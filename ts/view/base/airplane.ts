/// <reference path="../../libs/easeljs/easeljs.d.ts" />

module game.view.base {

  /**
   * Airplane Class.
   *
   * @class
   * @name Airplane
   */
  export class Airplane extends createjs.Container {

    private _img: HTMLImageElement;
    private _airPlane: createjs.Bitmap;

    /**
     * コンストラクタ.
     *
     * @constructor
     * @param {HTMLImageElement} img イメージ
     */
    constructor(img: HTMLImageElement) {

      super();

      this._img = img;
      this._initialize();
    }

    // ==========================================
    //   Public
    // ==========================================

    /**
     * 幅を取得する.
     *
     * @return {number} 幅
     */
    public getWidth(): number {

      return this._img.naturalWidth;
    }

    /**
     * 高さを取得する.
     *
     * @return {number} 高さ
     */
    public getHeight(): number {

      return this._img.naturalHeight;
    }

    /**
     * 表示画像を破棄する.
     */
    public destroy() {

      this.removeChild(this._airPlane);
    }

    // ==========================================
    //   Private
    // ==========================================

    /**
     * 初期化する.
     */
    private _initialize() {

      this._airPlane = new createjs.Bitmap(this._img);
      this.addChild(this._airPlane);
    }
  }
}