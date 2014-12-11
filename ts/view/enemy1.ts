/// <reference path="../libs/easeljs/easeljs.d.ts" />
/// <reference path="../libs/tweenjs/tweenjs.d.ts" />
/// <reference path="../util.ts" />
/// <reference path="../controller/appController.ts" />
/// <reference path="base/airplane.ts" />
/// <reference path="bullet.ts" />

module game.view {

  /**
   * Enemy1 Class.
   *
   * @class
   * @name Enemy1
   */
  export class Enemy1 extends view.base.Airplane {

    static BULLET_NUM: number = 8;
    static POINT: number = 1000;

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

      super(assets['enemy']);

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

      var rnd: number = game.Util._getRndNum(0, 1);

      this.x = (rnd === 0) ? 700 : -60;
      this.y = 150;
    }

    /**
     * 動かす.
     *
     * @param {number} delay ディレイするミリ秒
     */
    public move(delay: number) {

      var initX: number = this.x,
          rndX: number = (this.x > 0) ? game.Util._getRndNum(-400, -200) : game.Util._getRndNum(400, 200),
          rndY: number = game.Util._getRndNum(-100, 100);

      createjs.Tween.get(this)
        .wait(delay)
        .to({x: this.x + rndX, y: this.y + rndY}, 800, createjs.Ease.cubicOut)
        .call(this._shoot)
        .wait(1000)
        .to({x: initX, y: -100}, 800, createjs.Ease.cubicOut);
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

      for(var i = Enemy1.BULLET_NUM; i--;) {

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

      var that: Enemy1 = this,
          img = this._assets['enemyExplode'],
          explode: createjs.Bitmap = new createjs.Bitmap(img);

      if(this.y < 0) {

        this.destroy();
        return;
      }

      this._controller.addPoint(Enemy1.POINT);

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