/// <reference path="../libs/easeljs/easeljs.d.ts" />
/// <reference path="../libs/tweenjs/tweenjs.d.ts" />
/// <reference path="../controller/appController.ts" />
/// <reference path="base/airplane.ts" />
/// <reference path="bullet.ts" />

module game.view {

  /**
   * Player Class.
   *
   * @class
   * @name Header
   */
  export class Player extends view.base.Airplane {

    static BULLET_INTERVAL: number = 100;

    private _controller: controller.AppController;
    private _stage: createjs.Stage;
    private _assets: Object;
    private _invincibleFlg: boolean = true;

    /**
     * コンストラクタ.
     *
     * @constructor
     * @param {game.controller.AppController} controller コントローラー
     * @param {Object} assets アセット
     */
    constructor(controller: controller.AppController, assets: Object) {

      super(assets['player']);

      this._controller = controller;
      this._stage = controller.getStage();
      this._assets = assets;
    }

    // ==========================================
    //   Public
    // ==========================================

    /**
     * 表示する.
     */
    public appear() {

      var that: Player = this;

      createjs.Tween.get(this)
        .wait(300)
        .call(this._setShootTimer)
        .to({ alpha: 1 }, 1000, createjs.Ease.cubicOut)
        .call(function() {

          that._invincibleFlg = false;
        });
    }

    /**
     * 動かす.
     */
    public move(x: number, y: number) {

      this.x = x;
      this.y = y;
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
     * 無敵状態かを取得する.
     *
     * @return {boolean} フラグ
     */
    public isInvincible(): boolean {

      return this._invincibleFlg;
    }

    /**
     * 弾を撃つタイマーを止める.
     */
    public stopShootTimer() {

      createjs.Tween.removeTweens(this);
    }

    // ==========================================
    //   Private
    // ==========================================

    /**
     * 弾を撃つ.
     */
    private _shoot() {

      var img: HTMLImageElement = this._assets['playerBullet'],
          bullet: view.Bullet = new view.Bullet(this._stage, img);

      bullet.x = this.x;
      bullet.y = this.y - this.getHeight() / 2;
      bullet.regX = img.naturalWidth / 2;
      bullet.regY = img.naturalHeight / 2;
      this._stage.addChild(bullet);
      this._controller.addPlayerBullet(bullet);

      createjs.Tween.get(bullet)
        .to({ y: bullet.y - this._stage.canvas.height}, 500, createjs.Ease.linear);
    }

    /**
     * 爆発する.
     */
    private _explode() {

      var that: Player = this,
          img = this._assets['playerExplode'],
          explode: createjs.Bitmap = new createjs.Bitmap(img);

      explode.x = this.x;
      explode.y = this.y;
      explode.regX = img.naturalWidth / 2;
      explode.regY = img.naturalWidth / 2;
      explode.alpha = 0.7;
      this._stage.addChild(explode);

      createjs.Tween.get(explode)
        .to({ scaleX: 7.0, scaleY: 7.0, alpha: 0 }, 500, createjs.Ease.linear)
        .call(function() {
          that._stage.removeChild(explode);
          explode = null;
        });

      this.destroy();
    }

    /**
     * 弾を撃つ間隔のタイマーをセットする.
     */
    private _setShootTimer() {

      createjs.Tween.get(this, { loop: true })
        .call(this._shoot)
        .wait(Player.BULLET_INTERVAL);
    }
  }
}