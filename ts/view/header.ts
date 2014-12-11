/// <reference path="../libs/easeljs/easeljs.d.ts" />

module game.view {

  /**
   * Header Class.
   *
   * @class
   * @name Header
   */
  export class Header extends createjs.Container {

    private _assets: Object;
    private _pointTxt: createjs.Text;
    private _lifeIconAry: createjs.Bitmap[] = [];

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
    //   Public
    // ==========================================

    /**
     * 得点を更新する.
     *
     * @param {number} point 得点
     */
    public updatePoint(point: number) {

      this._pointTxt.text = String(point);
    }

    /**
     * 残りライフを更新する.
     *
     * @param {number} life 残りライフ
     */
    public updateLife(life: number) {

      this._lifeIconAry[life].visible = false;
    }

    /**
     * インスタンスメンバを破棄する.
     */
    public destroy() {

      this._lifeIconAry = [];
    }

    // ==========================================
    //   Private
    // ==========================================

    /**
     * 初期化する.
     */
    private _initialize() {

      var img: HTMLImageElement = this._assets['player'],
          icon: createjs.Bitmap;

      this._pointTxt = new createjs.Text('0000', 'bold 64px ArialMT', '#FFF');
      this._pointTxt.alpha = 0.5;
      this._pointTxt.textAlign = 'left';
      this.addChild(this._pointTxt);

      for(var i = 5; i--;) {

        icon = new createjs.Bitmap(img);
        icon.x = 400 + 50 * i;
        icon.y = 30;
        icon.regX = img.naturalWidth / 2;
        icon.regY = img.naturalHeight / 2;
        icon.scaleX = icon.scaleY = 0.5;
        this.addChild(icon);
        this._lifeIconAry.push(icon);
      }
    }
  }
}