/// <reference path="../libs/easeljs/easeljs.d.ts" />
/// <reference path="../libs/tweenjs/tweenjs.d.ts" />
/// <reference path="../util.ts" />
/// <reference path="../controller/appController.ts" />
/// <reference path="base/airplane.ts" />
/// <reference path="bullet.ts" />

module game.view {

  /**
   * Enemy2 Class.
   *
   * @class
   * @name Enemy1
   */
  export class Enemy2 extends view.base.Airplane {

    static BULLET_INTERVAL: number = 1500;
    static POINT: number = 2000;

    private _controller: controller.AppController;
    private _stage: createjs.Stage;
    private _assets: Object;
    private _vital: number = 5;

    /**
     * コンストラクタ.
     *
     * @constructor
     * @param {game.controller.AppController} controller コントローラー
     * @param {Object} assets アセット
     */
    constructor(controller: controller.AppController, assets: Object) {

      super(assets['enemy2']);

      this._controller = controller;
      this._stage = controller.getStage();
      this._assets = assets;

      this._setShootTimer();
    }

    // ==========================================
    //   Public
    // ==========================================

    /**
     * 座標をセットする.
     */
    public setPos() {

      this.x = game.Util._getRndNum(80, 620);
      this.y = 0;
    }

    /**
     * 動かす.
     *
     * @param {number} delay ディレイするミリ秒
     */
    public move() {

      createjs.Tween.get(this)
        .to({y: 1000}, 5000, createjs.Ease.linear);
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

      this._vital--;
      this._blink();
    }

    /**
     * 耐久力を取得する.
     *
     * @return {number} 耐久力
     */
    public getVital(): number {

      return this._vital;
    }

    // ==========================================
    //   Private
    // ==========================================

    /**
     * 弾を撃つ.
     */
    private _shoot() {

      var img: HTMLImageElement = this._assets['enemyBullet2'],
          bullet: view.Bullet = new view.Bullet(this._stage, img);

      bullet.x = this.x;
      bullet.y = this.y;
      bullet.regX = img.naturalWidth / 2;
      bullet.regY = img.naturalHeight / 2;
      this._stage.addChild(bullet);
      this._controller.addEnemyBullet(bullet);

      createjs.Tween.get(bullet)
        .to({ y: this.y + this._stage.canvas.height }, 1000, createjs.Ease.linear);
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
     * 爆発する.
     */
    private _explode() {

      var that: Enemy2 = this,
          img = this._assets['enemyExplode'],
          explode: createjs.Bitmap = new createjs.Bitmap(img);

      if(this.y > this._stage.canvas.height) {

        this.destroy();
        return;
      }

      this._controller.addPoint(Enemy2.POINT);

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

    private _setShootTimer() {

      createjs.Tween.get(this, { loop: true })
        .call(this._shoot)
        .wait(Enemy2.BULLET_INTERVAL);
    }
  }
}