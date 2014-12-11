/// <reference path="../libs/easeljs/easeljs.d.ts" />
/// <reference path="../libs/tweenjs/tweenjs.d.ts" />
/// <reference path="../util.ts" />
/// <reference path="../controller/appController.ts" />
/// <reference path="base/airplane.ts" />
/// <reference path="bullet.ts" />

module game.view {

  /**
   * Boss Class.
   *
   * @class
   * @name Boss
   */
  export class Boss extends createjs.Container {

    static BULLET_NUM: number = 20;
    static POINT: number = 20000;
    static MAX_VITAL: number = 100;

    private _controller: controller.AppController;
    private _stage: createjs.Stage;
    private _assets: Object;
    private _bmpList: Object = {};
    private _vital: number = Boss.MAX_VITAL;

    /**
     * コンストラクタ.
     *
     * @constructor
     * @param {game.controller.AppController} controller コントローラー
     * @param {Object} assets アセット
     */
    constructor(controller: controller.AppController, assets: Object) {

      super();

      this._controller = controller;
      this._stage = controller.getStage();
      this._assets = assets;

      this._initialize();
    }

    // ==========================================
    //   Public
    // ==========================================

    /**
     * 座標をセットする.
     */
    public setPos() {

      this.x = this._stage.canvas.width / 2;
      this.y = 0;
    }

    /**
     * 動かす.
     */
    public move() {

      var that: Boss = this;

      createjs.Tween.get(this)
        .to({ y: this.y + 300 }, 1500, createjs.Ease.linear)
        .call(function() {

          createjs.Tween.get(that, { loop: true })
            .call(that._moveRandom)
            .wait(3000 + game.Util._getRndNum(-500, 500));
        });

      createjs.Tween.get(this, { loop: true })
        .wait(game.Util._getRndNum(1500, 3000))
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

    /**
     * ダメージを与える.
     */
    public damage() {

      if(this._vital === 0) {

        return;
      }

      if(this._vital === Boss.MAX_VITAL / 2) {

        this._changeAvatar();
      }

      this._vital--;
      this._blink();
    }

    /**
     * 耐久力を取得する.
     */
    public getVital() {

      return this._vital;
    }

    /**
     * 幅を取得する.
     */
    public getWidth(): number {

      return this._assets['avaCloth'].naturalWidth;
    }

    /**
     * 高さを取得する.
     */
    public getHeight(): number {

      return this._assets['avaCloth'].naturalHeight;
    }

    /**
     * 表示している子要素を破棄する.
     */
    public destroy() {

      this.removeAllChildren();
    }

    // ==========================================
    //   Private
    // ==========================================

    /**
     * 初期化する.
     */
    private _initialize() {

      this._bmpList['avaClothDefault'] = new createjs.Bitmap(this._assets['avaClothDefault']);
      this._bmpList['avaClothDefault'].visible = false;
      this.addChild(this._bmpList['avaClothDefault']);

      this._bmpList['avaCloth'] = new createjs.Bitmap(this._assets['avaCloth']);
      this.addChild(this._bmpList['avaCloth']);

      this._bmpList['avaHair2'] = new createjs.Bitmap(this._assets['avaHair2']);
      this.addChild(this._bmpList['avaHair2']);

      this._bmpList['avaArmDefault'] = new createjs.Bitmap(this._assets['avaArmDefault']);
      this._bmpList['avaArmDefault'].visible = false;
      this.addChild(this._bmpList['avaArmDefault']);

      this._bmpList['avaFace'] = new createjs.Bitmap(this._assets['avaFace']);
      this.addChild(this._bmpList['avaFace']);

      this._bmpList['avaHair'] = new createjs.Bitmap(this._assets['avaHair']);
      this.addChild(this._bmpList['avaHair']);

      this._bmpList['avaArm'] = new createjs.Bitmap(this._assets['avaArm']);
      this.addChild(this._bmpList['avaArm']);
    }

    /**
     * ランダムに動く.
     */
    private _moveRandom() {

      createjs.Tween.get(this)
        .to({ x: game.Util._getRndNum(220, 420), y: game.Util._getRndNum(180, 380) }, 2000, createjs.Ease.cubicOut);
    }

    /**
     * 弾を撃つ.
     */
    private _shoot() {

      var img: HTMLImageElement = (game.Util._getRndNum(0, 1) === 0) ? this._assets['bossBullet'] : this._assets['enemyBullet'],
          bullet: view.Bullet;

      for(var i = Boss.BULLET_NUM; i--;) {

        bullet = new view.Bullet(this._stage, img);
        bullet.x = this.x;
        bullet.y = this.y;
        bullet.regX = img.naturalWidth / 2;
        bullet.regY = img.naturalHeight / 2;
        this._stage.addChild(bullet);
        this._controller.addEnemyBullet(bullet);

        createjs.Tween.get(bullet)
          .to({ x: game.Util._getRndNum(-700, 1300), y: 1000 }, game.Util._getRndNum(3000, 5000), createjs.Ease.linear);
      }
    }

    /**
     * ダメージを受けたときに点滅させる.
     */
    private _blink() {

      createjs.Tween.get(this)
        .set({ visible: false })
        .wait(100)
        .set({ visible: true });
    }

    /**
     * アバターを変更する.
     */
    private _changeAvatar() {

      createjs.Tween.get(this._bmpList['avaCloth'])
        .to({ x: 150, y: -50, alpha: 0 }, 1000, createjs.Ease.cubicOut)
        .set({ visible: false });

      createjs.Tween.get(this._bmpList['avaArm'])
        .to({ x: -150, y: -50, alpha: 0 }, 1000, createjs.Ease.cubicOut)
        .set({ visible: false });

      this._bmpList['avaClothDefault'].visible = true;
      this._bmpList['avaArmDefault'].visible = true;
    }

    /**
     * 爆発する.
     */
    private _explode() {

      var that: Boss = this,
          img = this._assets['enemyExplode'],
          explode: createjs.Bitmap = new createjs.Bitmap(img);

      this._controller.addPoint(Boss.POINT);
      this._controller.removeAllBullet();

      explode.x = this.x;
      explode.y = this.y;
      explode.regX = img.naturalWidth / 2;
      explode.regY = img.naturalWidth / 2;
      explode.alpha = 0.7;
      this._stage.addChild(explode);

      createjs.Tween.get(explode)
        .to({ scaleX: 12.0, scaleY: 12.0, alpha: 0 }, 1000, createjs.Ease.cubicOut)
        .wait(500)
        .call(function() {

          that._stage.removeChild(explode);
          explode = null;

          that._controller.showGameClear();
        });

      this.destroy();
    }
  }
}