/// <reference path="../libs/easeljs/easeljs.d.ts" />
/// <reference path="../libs/soundjs/soundjs.d.ts" />
/// <reference path="../util.ts" />
/// <reference path="../command/actionCommand.ts" />
/// <reference path="../model/appModel.ts" />
/// <reference path="../view/background.ts" />
/// <reference path="../view/header.ts" />
/// <reference path="../view/enemy1.ts" />
/// <reference path="../view/enemy2.ts" />
/// <reference path="../view/enemy3.ts" />
/// <reference path="../view/boss.ts" />
/// <reference path="../view/player.ts" />
/// <reference path="../view/bullet.ts" />
/// <reference path="../view/base/airplane.ts" />

module game.controller {

  /**
   * AppController Class.
   *
   * @class
   * @name AppController
   */
  export class AppController {

    static FPS: number = 30;
    static ENEMY1_NUM: number = 4;
    static ENEMY3_NUM: number = 2;
    static MAX_PLAYER_LIFE: number = 5;

    private _canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector("canvas");
    private _stage: createjs.Stage;
    private _model: model.AppModel;
    private _backGround: view.Background;
    private _header: view.Header;
    private _actionCommand: command.ActionCommand;
    private _player: view.Player;
    private _enemyAry: any[] = [];
    private _tickCnt: number = 0;
    private _playerLife: number = AppController.MAX_PLAYER_LIFE;
    private _overlayCont: createjs.Container;
    private _sounds: Object = {};

    /**
     * コンストラクタ.
     *
     * @constructor
     * @param {game.model.AppModel} model モデル
     */
    constructor(model: model.AppModel) {

      this._stage = new createjs.Stage(this._canvas);
      this._model = model;
      this._backGround = new view.Background(model.getAssets(['bg']));
      this._header = new view.Header(model.getAssets(['player']));

      this._initialize();
    }

    // ==========================================
    //   Public
    // ==========================================

    /**
     * プレイヤーの弾をモデルに追加する.
     *
     * @param {game.view.Bullet} bullet 弾
     */
    public addPlayerBullet(bullet: view.Bullet) {

      this._model.addPlayerBullet(bullet);
    }

    /**
     * 敵の弾をモデルに追加する.
     *
     * @param {game.view.Bullet} bullet 弾
     */
    public addEnemyBullet(bullet: view.Bullet) {

      this._model.addEnemyBullet(bullet);
    }

    /**
     * 全ての弾をモデルから削除する.
     */
    public removeAllBullet() {

      this._player.stopShootTimer();
      this._model.removeAllBullet();
    }

    /**
     * 得点を追加する.
     *
     * @param {number} point 得点
     */
    public addPoint(point: number) {

      this._model.addPoint(point);
      this._header.updatePoint(this._model.getPoint());
    }

    /**
     * ステージを取得する.
     *
     * @return {createjs.Stage} ステージ
     */
    public getStage(): createjs.Stage {

      return this._stage;
    }

    /**
     * プレイヤーの座標を取得する.
     *
     * @return {Object} 座標
     */
    public getPlayerPos(): {x: number; y: number;} {

      var pos: {x: number; y: number;} = {'x': this._canvas.width / 2, 'y': this._canvas.height};

      if(this._player !== null) {

        pos = {'x': this._player.x, 'y': this._player.y};
      }

      return pos;
    }

    /**
     * コマンドを実行する.
     *
     * @param {String} command コマンド
     */
    public runCommand(command: string) {

      var actionCommand = game.command.ActionCommand;

      switch(command) {

        case actionCommand.APPEAR_ENEMY1:
          this._createEnemy1();
          break;

        case actionCommand.APPEAR_ENEMY2:
          this._createEnemy2();
          break;

        case actionCommand.APPEAR_ENEMY3:
          this._createEnemy3();
          break;

        case actionCommand.APPEAR_BOSS:
          this._showCaution();
          break;

        default:
          break;
      }
    }

    /**
     * ゲームクリア時のオーバーレイを表示する.
     */
    public showGameClear() {

      var text: createjs.Text = new createjs.Text('GAME CLEAR!!', 'bold 64px ArialMT', '#00FF00'),
          point: createjs.Text = new createjs.Text('Total : ' + String(this._model.getPoint()), 'bold 36px ArialMT', '#FFF');

      createjs.Ticker.removeEventListener('tick', this._tickHandler);

      this._sounds['boss'].stop();
      this._sounds['clear'] = createjs.Sound.play('clear', { 'loop': -1 });
      this._sounds['clear'].volume = 0.5;

      this._overlayCont = this._createOverlay();
      this._overlayCont.name = 'clear';
      this._overlayCont.addEventListener('click', this._clickHandler);

      text.x = this._canvas.width / 2;
      text.y = this._canvas.height / 2 - 100;
      text.alpha = 0.7;
      text.textAlign = 'center';
      this._overlayCont.addChild(text);

      point.x = this._canvas.width / 2;
      point.y = this._canvas.height / 2;
      point.textAlign = 'center';
      this._overlayCont.addChild(point);
    }

    // ==========================================
    //   Event Handler
    // ==========================================

    /**
     * tickEventHandler.
     */
    private _tickHandler = () => {

      this._stage.update();

      if(this._actionCommand === undefined) {

        return;
      }

      this._checkPlayerBulletPos();
      this._checkEnemyBulletPos();
      this._checkEnemyPos();

      this._tickCnt++;
      if(this._tickCnt % AppController.FPS === 0) {

        this._actionCommand.addTime();
      }
    };

    /**
     * mouseMoveEventHandler.
     *
     * @param {createjs.MouseEvent} e マウスイベントオブジェクト
     */
    private _stageMouseMoveHandler = (e: createjs.MouseEvent) => {

      if(this._player === null) {

        return;
      }

      this._player.move(~~e.stageX, ~~(e.stageY - 60));
    };

    /**
     * clickEventHandler.
     */
    private _clickHandler = (e: createjs.MouseEvent) => {

      if(e.currentTarget['name'] === 'title') {

        this._overlayCont.removeEventListener('click', this._clickHandler);
        this._overlayCont.removeAllChildren();
        this._stage.removeChild(this._overlayCont);
        this._overlayCont = null;
        this._startGame();

      } else {

        if(e.currentTarget['name'] === 'clear') {

          this._sounds['clear'].stop();
        }

        this._refresh();
      }
    };

    // ==========================================
    //   Private
    // ==========================================

    /**
     * 初期化する.
     */
    private _initialize() {

      if(createjs.Touch.isSupported()) {

        createjs.Touch.enable(this._stage);
      }

      createjs.Ticker.setFPS(AppController.FPS);
      createjs.Ticker.addEventListener('tick', this._tickHandler);

      this._stepAndroid();
      this._showTitle();
    }

    /**
     * ゲームをスタートする.
     */
    private _startGame() {

      this._stage.addEventListener('stagemousemove', this._stageMouseMoveHandler);
      this._stage.addChild(this._backGround);
      this._stage.addChild(this._header);

      this._sounds['shot'] = createjs.Sound.createInstance('shot');
      this._sounds['shot2'] = createjs.Sound.createInstance('shot2');
      this._sounds['explode'] = createjs.Sound.createInstance('explode');
      this._sounds['loop'] = createjs.Sound.play('loop', { 'loop': -1 });
      this._sounds['loop'].volume = 0.5;

      if(this._actionCommand === undefined) {

        this._actionCommand = new command.ActionCommand(this);
      }

      this._addCommand();
      this._createPlayer();
    }

    /**
     * アンドロイド対策用.
     */
    private _stepAndroid() {

      var that: AppController = this,
          mask: createjs.Shape;

      //xperiaZ対策
      this._stage.clear = function() {

        if(that._canvas) {

          var a = that._canvas.getContext("2d");
          a.setTransform(1, 0, 0, 1, 0, 0);
          a.clearRect(0, 0, that._canvas.width + 0.5, that._canvas.height + 0.5);
        }
      };

      //Android4系対策
      mask = new createjs.Shape();
      mask.graphics.beginFill("#FFFFFF");
      mask.graphics.rect(0, 0, 640, 960);
      mask.graphics.endFill();
      this._stage.mask = mask;
    }

    /**
     * コマンドを追加する.
     */
    private _addCommand() {

      var actionCommand = game.command.ActionCommand;

      for(var i = 5; i--;) {

        this._actionCommand.addCommand(
          { 'command': actionCommand.APPEAR_ENEMY1, 'time': 2 * i }
        );
      }

      for(var i = 7; i--;) {

        this._actionCommand.addCommand(
          { 'command': actionCommand.APPEAR_ENEMY2, 'time': 12 + game.Util._getRndNum(-2, 0) + 2 * i }
        );
      }

      for(var i = 4; i--;) {

        this._actionCommand.addCommand(
          { 'command': actionCommand.APPEAR_ENEMY1, 'time': 16 + 2 * i }
        );
      }

      for(var i = 8; i--;) {

        this._actionCommand.addCommand(
          { 'command': actionCommand.APPEAR_ENEMY3, 'time': 28 + game.Util._getRndNum(-2, 0) + 3 * i }
        );
      }

      this._actionCommand.addCommand(
        { 'command': actionCommand.APPEAR_BOSS, 'time': 52 }
      );

      /*
      this._actionCommand.addCommand(
        { 'command': actionCommand.APPEAR_BOSS, 'time': 5 }
      );
      */
    }

    /**
     * プレイヤーを生成する.
     */
    private _createPlayer() {

      var assets: Object = this._model.getAssets(['player', 'playerBullet', 'playerExplode']),
          img: HTMLImageElement = assets['player'];

      this._player = new view.Player(this, assets);
      this._player.x = this._canvas.width / 2;
      this._player.y = this._canvas.height - img.naturalHeight * 2;
      this._player.regX = img.naturalWidth / 2;
      this._player.regY = img.naturalHeight / 2;
      this._player.alpha = 0;
      this._player.appear();
      this._stage.addChild(this._player);
    }

    /**
     * 敵1を生成する.
     */
    private _createEnemy1() {

      var assets: Object = this._model.getAssets(['enemy', 'enemyBullet', 'enemyExplode']),
          img: HTMLImageElement = assets['enemy'],
          enemy: view.Enemy1;

      for(var i = AppController.ENEMY1_NUM; i--;) {

        enemy = new game.view.Enemy1(this, assets);
        enemy.regX = img.naturalWidth / 2;
        enemy.regY = img.naturalHeight / 2;
        enemy.setPos();
        enemy.move(i * 200);
        this._stage.addChild(enemy);
        this._enemyAry.push(enemy);
      }
    }

    /**
     * 敵2を生成する.
     */
    private _createEnemy2() {

      var assets: Object = this._model.getAssets(['enemy2', 'enemyBullet2', 'enemyExplode']),
          img: HTMLImageElement = assets['enemy2'],
          enemy: view.Enemy2 = new game.view.Enemy2(this, assets);

      enemy.regX = img.naturalWidth / 2;
      enemy.regY = img.naturalHeight / 2;
      enemy.setPos();
      enemy.move();
      this._stage.addChild(enemy);
      this._enemyAry.push(enemy);
    }

    /**
     * 敵3を生成する.
     */
    private _createEnemy3() {

      var assets: Object = this._model.getAssets(['enemy3', 'enemyBullet', 'enemyExplode']),
          img: HTMLImageElement = assets['enemy3'],
          enemy: view.Enemy3;

      for(var i = AppController.ENEMY3_NUM; i--;) {

        enemy = new game.view.Enemy3(this, assets);
        enemy.regX = img.naturalWidth / 2;
        enemy.regY = img.naturalHeight / 2;
        enemy.setPos();
        enemy.move();
        this._stage.addChild(enemy);
        this._enemyAry.push(enemy);
      }
    }

    /**
     * ボスを生成する.
     */
    private _createBoss() {

      var assets: Object = this._model.getAssets([
            'boss', 'bossBullet', 'bossLaser', 'enemyBullet', 'enemyExplode'
          ]),
          img: HTMLImageElement = assets['boss'],
          boss: view.Boss = new game.view.Boss(this, assets);

      boss.regX = img.naturalWidth / 2;
      boss.regY = img.naturalHeight / 2;
      boss.name = 'boss';
      boss.setPos();
      boss.move();
      this._stage.addChild(boss);
      this._enemyAry.push(boss);

      this._sounds['loop'].stop();
      this._sounds['boss'] = createjs.Sound.play('boss', { 'loop': -1 });
      this._sounds['boss'].volume = 0.5;
    }

    /**
     * 敵を消す.
     *
     * @param {number} index インデックス
     */
    private _removeEnemy(index: number) {

      var enemy: any = this._enemyAry[index];
      enemy.remove();

      this._enemyAry.splice(index, 1);
    }

    /**
     * プレイヤーの弾の座標を確認して衝突判定を行う.
     */
    private _checkPlayerBulletPos() {

      var bulletAry: view.Bullet[] = this._model.getPlayerBullet(),
          bullet: view.Bullet,
          enemy: any;

      if(bulletAry.length === 0 || this._enemyAry.length === 0) {

        return;
      }

      for(var i = bulletAry.length; i--;) {

        bullet = bulletAry[i];

        if(bullet === undefined) {

          continue;
        }

        //領域外だったら
        if(bullet.y < 0) {

          this._model.removePlayerBullet(i);
          continue;
        }

        for(var j = this._enemyAry.length; j--;) {

          enemy = this._enemyAry[j];

          if(enemy === undefined) {

            continue;
          }

          //敵に弾が当たったら
          if(game.Util._isCollision(bullet, enemy)) {

            this._model.removePlayerBullet(i);
            this._damageEnemy(enemy, j);
          }
        }
      }
    }

    /**
     * 敵の弾の座標を確認して衝突判定を行う.
     */
    private _checkEnemyBulletPos() {

      var bulletAry: view.Bullet[] = this._model.getEnemyBullet(),
          bullet: view.Bullet;

      if(bulletAry.length === 0) {

        return;
      }

      for(var i = bulletAry.length; i--;) {

        bullet = bulletAry[i];

        if(bullet === undefined) {

          continue;
        }

        //領域外だったら
        if(bullet.x < 0 || bullet.x > this._canvas.width || bullet.y < 0 || bullet.y > this._canvas.height) {

          this._model.removeEnemyBullet(i);
          continue;
        }

        //プレイヤー無敵状態だったら
        if(this._player === null || this._player.isInvincible()) {

          continue;
        }

        //プレイヤーに弾が当たったら
        if(game.Util._isCollision(bullet, this._player)) {

          this._model.removeAllBullet();
          this._damagePlayer();
          break;
        }
      }
    }

    /**
     * 敵の座標を確認して衝突判定を行う.
     */
    private _checkEnemyPos() {

      var enemy: any;

      for(var i = this._enemyAry.length; i--;) {

        enemy = this._enemyAry[i];

        if(enemy === undefined) {

          continue;
        }

        //領域外だったら
        if(enemy.y < 0 || enemy.y > this._canvas.height) {

          this._removeEnemy(i);
          continue;
        }

        //プレイヤー無敵状態だったら
        if(this._player === null || this._player.isInvincible()) {

          continue;
        }

        //プレイヤーと機体が当たったら
        if(game.Util._isCollision(enemy, this._player)) {

          this._damagePlayer();
          break;
        }
      }
    }

    /**
     * 敵にダメージを与える.
     *
     * @param {any} enemy 敵
     * @param {number} index インデックス
     */
    private _damageEnemy(enemy: any, index: number) {

      if(enemy.damage === undefined) {

        this._sounds['shot'].play();
        this._removeEnemy(index);
        return;
      }

      enemy.damage();

      if(enemy.getVital() === 0) {

        if(enemy.name === 'boss') {

          this._sounds['explode'].play();

        } else {

          this._sounds['shot'].play();
        }

        this._removeEnemy(index);
      }
    }

    /**
     * プレイヤーにダメージを与える.
     */
    private _damagePlayer() {

      this._sounds['shot2'].play();

      this._player.remove();
      this._player = null;
      this._playerLife--;

      this._header.updateLife(this._playerLife);

      if(this._playerLife !== 0) {

        this._createPlayer();

      } else {

        createjs.Tween.get(this)
          .wait(700)
          .call(this._showGameOver);
      }
    }

    /**
     * 画面をリフレッシュする.
     */
    private _refresh() {

      createjs.Tween.removeAllTweens();
      this._stage.removeAllChildren();
      this._model.destroy();
      this._actionCommand.destroy();
      this._header.destroy();

      createjs.Ticker.addEventListener('tick', this._tickHandler);
      this._stage.removeEventListener('stagemousemove', this._stageMouseMoveHandler);
      this._overlayCont.removeEventListener('click', this._clickHandler);

      this._playerLife = AppController.MAX_PLAYER_LIFE;
      this._tickCnt = 0;
      this._backGround = null;
      this._header = null;
      this._enemyAry = [];

      this._backGround = new view.Background(this._model.getAssets(['bg']));
      this._header = new view.Header(this._model.getAssets(['player']));

      this._startGame();
    }

    /**
     * タイトルを表示する.
     */
    private _showTitle() {

      var text: createjs.Text = new createjs.Text('Shooting Demo', 'bold 64px ArialMT', '#FFF'),
          text2: createjs.Text = new createjs.Text('tap game start', 'bold 36px ArialMT', '#FFF');

      this._overlayCont = this._createOverlay();
      this._overlayCont.name = 'title';
      this._overlayCont.addEventListener('click', this._clickHandler);

      text.x = this._canvas.width / 2;
      text.y = this._canvas.height / 2 - 100;
      text.textAlign = 'center';
      this._overlayCont.addChild(text);

      text2.x = this._canvas.width / 2;
      text2.y = this._canvas.height / 2;
      text2.textAlign = 'center';
      this._overlayCont.addChild(text2);
    }

    /**
     * 警告オーバーレイを表示する.
     */
    private _showCaution() {

      var that: AppController = this,
          text: createjs.Text = new createjs.Text('CAUTION!!', 'bold 64px ArialMT', '#FF0000');

      this._sounds['alert'] = createjs.Sound.play('alert', { loop: 2 });

      this._overlayCont = this._createOverlay();

      text.x = this._canvas.width / 2;
      text.y = this._canvas.height / 2 - text.getMeasuredHeight();
      text.alpha = 0.7;
      text.textAlign = 'center';
      this._overlayCont.addChild(text);

      createjs.Tween.get(text)
        .wait(500)
        .to({ alpha: 0 }, 500, createjs.Ease.cubicOut)
        .to({ alpha: 0.7 }, 400, createjs.Ease.cubicIn)
        .wait(500)
        .to({ alpha: 0 }, 500, createjs.Ease.cubicOut)
        .to({ alpha: 0.7 }, 400, createjs.Ease.cubicIn)
        .wait(500)
        .to({ alpha: 0 }, 500, createjs.Ease.cubicOut)
        .call(function() {

          createjs.Tween.removeTweens(text);
          that._overlayCont.removeAllChildren();
          that._stage.removeChild(that._overlayCont);
          that._overlayCont = null;

          that._sounds['alert'].stop();

          that._createBoss();
        });
    }

    /**
     * ゲームオーバーオーバーレイを表示する.
     */
    private _showGameOver() {

      var text: createjs.Text = new createjs.Text('GAME OVER', 'bold 64px ArialMT', '#FFF'),
          point: createjs.Text = new createjs.Text('Total : ' + String(this._model.getPoint()), 'bold 36px ArialMT', '#FFF');

      createjs.Ticker.removeEventListener('tick', this._tickHandler);

      this._sounds['loop'].stop();

      if(this._sounds['boss'] !== undefined) {

        this._sounds['boss'].stop();
      }

      this._overlayCont = this._createOverlay();
      this._overlayCont.addEventListener('click', this._clickHandler);

      text.x = this._canvas.width / 2;
      text.y = this._canvas.height / 2 - 100;
      text.textAlign = 'center';
      this._overlayCont.addChild(text);

      point.x = this._canvas.width / 2;
      point.y = this._canvas.height / 2;
      point.textAlign = 'center';
      this._overlayCont.addChild(point);
    }

    /**
     * オーバーレイを生成する.
     */
    private _createOverlay(): createjs.Container {

      var cont: createjs.Container = new createjs.Container,
          cover: createjs.Shape = new createjs.Shape();

      this._stage.addChild(cont);

      cover.graphics.beginFill("#000");
      cover.graphics.rect(0, 0, 640, 960);
      cover.graphics.endFill();
      cover.alpha = 0.5;
      cont.addChild(cover);

      return cont;
    }
  }
}