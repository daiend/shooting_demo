/// <reference path="../libs/easeljs/easeljs.d.ts" />

module game.view {

  /**
   * Background Class.
   *
   * @class
   * @name Background
   */
  export class Background extends createjs.Container {

    private _assets: Object;
    private _bgBmp: createjs.Bitmap;
    private _bgBmp2: createjs.Bitmap;

    /**
     * コンストラクタ.
     *
     * @constructor
     * @param {Object} assets アセット
     */
    constructor(assets: Object) {

      super();

      this._assets = assets;
      this._initialize();
    }

    // ==========================================
    //   Private
    // ==========================================

    /**
     * 初期化する.
     */
    private _initialize() {

      var bg: createjs.Shape = new createjs.Shape();

      bg.graphics.beginRadialGradientFill(["#0e0c3f", '#000'], [0, 1], 320, 480, 20, 320, 480, 800);
      bg.graphics.rect(0, 0, 640, 960);
      bg.graphics.endFill();
      this.addChild(bg);

      this._bgBmp = new createjs.Bitmap(this._assets['bg']);
      this._bgBmp.scaleX = this._bgBmp.scaleY = 2;
      this.addChild(this._bgBmp);

      this._bgBmp2 = new createjs.Bitmap(this._assets['bg']);
      this._bgBmp2.y = -960;
      this._bgBmp2.scaleX = this._bgBmp2.scaleY = 2;
      this.addChild(this._bgBmp2);

      createjs.Tween.get(bg, { loop: true })
        .to({ alpha: 0.5 }, 2000, createjs.Ease.cubicOut)
        .to({ alpha: 1 }, 2000, createjs.Ease.cubicIn)
        .wait(1000);

      this._scrollBg();
    }

    /**
     * 背景をスクロールさせる.
     */
    private _scrollBg() {

      var that: Background = this,
          canvasH = 960;

      createjs.Tween.get(this._bgBmp, { loop: true })
        .to({ y: this._bgBmp.y + canvasH }, 3000, createjs.Ease.linear)
        .call(function() {
          if(that._bgBmp.y === canvasH) {
            that._bgBmp.y = -canvasH;
          }
        });

      createjs.Tween.get(this._bgBmp2, { loop: true })
        .to({ y: this._bgBmp2.y + canvasH }, 3000, createjs.Ease.linear)
        .call(function() {
          if(that._bgBmp2.y === canvasH) {
            that._bgBmp2.y = -canvasH;
          }
        });
    }
  }
}