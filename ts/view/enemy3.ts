/// <reference path="../libs/easeljs/easeljs.d.ts" />
/// <reference path="../libs/tweenjs/tweenjs.d.ts" />
/// <reference path="../util.ts" />
/// <reference path="../controller/appController.ts" />
/// <reference path="base/airplane.ts" />
/// <reference path="bullet.ts" />

module game.view {

  /**
   * Enemy3 Class.
   *
   * @class
   * @name Enemy3
   */
  export class Enemy3 extends view.base.Airplane {

    static BULLET_NUM: number = 6;
    static POINT: number = 3000;

    private _controller: controller.AppController;
    private _stage: createjs.Stage;
    private _assets: Object;

    /**
     * コンストラクタ.
     *
     * @constructor
     * @param {game.controller.AppController} controller コントローラー
     * @param {Object} assets アセット
     */
    constructor(controller: controller.AppController, assets: Object) {

      super(assets['enemy3']);

      this._controller = controller;
      this._stage = controller.getStage();
      this._assets = assets;
    }

    // ==========================================
    //   Public
    // ==========================================

    /**
     * 座標をセットする.
     */
    public setPos() {

      this.x = (game.Util._getRndNum(0, 1) === 0) ? 700 : -60;
      this.y = (game.Util._getRndNum(0, 1) === 0) ? 400 : 150;

      this.x += game.Util._getRndNum(-100, 100);
      this.y += game.Util._getRndNum(-100, 100);
    }

    /**
     * 動かす.
     *
     * @param {number} delay ディレイするミリ秒
     */
    public move() {

      var pos: {x: number; y: number;} = this._controller.getPlayerPos();

      createjs.Tween.get(this)
        .to({ x: pos.x + game.Util._getRndNum(-100, 100), y: pos.y + game.Util._getRndNum(-100, 100) }, 1400, createjs.Ease.cubicOut)
        .wait(300)
        .to({x: this._stage.canvas.width / 2, y: -100}, 1000, createjs.Ease.cubicOut);

      createjs.Tween.get(this)
        .wait(2000)
        .call(this._shoot);
    }

    /**
     * 画面から消す.
     */
    public remove() {

      createjs.Tween.removeTweens(this);
      this._explode();
      this._stage.removeChild(this);
    }

    // ==========================================
    //   Private
    // ==========================================

    /**
     * 弾を撃つ.
     */
    private _shoot() {

      var img: HTMLImageElement = this._assets['enemyBullet'],
          bullet: view.Bullet,
          pos: {x: number; y: number;};

      for(var i = Enemy3.BULLET_NUM; i--;) {

        bullet = new view.Bullet(this._stage, img);
        bullet.x = this.x;
        bullet.y = this.y;
        bullet.regX = img.naturalWidth / 2;
        bullet.regY = img.naturalHeight / 2;
        this._stage.addChild(bullet);
        this._controller.addEnemyBullet(bullet);

        pos = this._controller.getPlayerPos();

        createjs.Tween.get(bullet)
          .to({ x: game.Util._getRndNum(pos.x - 150, pos.x + 150), y: 1000 }, 1200 + game.Util._getRndNum(-100, 100), createjs.Ease.linear);
      }
    }

    /**
     * 爆発する.
     */
    private _explode() {

      var that: Enemy3 = this,
          img = this._assets['enemyExplode'],
          explode: createjs.Bitmap = new createjs.Bitmap(img);

      if(this.y < 0) {

        this.destroy();
        return;
      }

      this._controller.addPoint(Enemy3.POINT);

      explode.x = this.x;
      explode.y = this.y;
      explode.regX = img.naturalWidth / 2;
      explode.regY = img.naturalWidth / 2;
      explode.alpha = 0.7;
      this._stage.addChild(explode);

      createjs.Tween.get(explode)
        .to({ scaleX: 5.0, scaleY: 5.0, alpha: 0 }, 300, createjs.Ease.linear)
        .call(function() {
          that._stage.removeChild(explode);
          explode = null;
        });

      this.destroy();
    }
  }
}