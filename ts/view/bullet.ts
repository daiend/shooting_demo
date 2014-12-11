/// <reference path="../libs/easeljs/easeljs.d.ts" />

module game.view {

  /**
   * Bullet Class.
   *
   * @class
   * @name Bullet
   */
  export class Bullet extends createjs.Container {

    private _stage: createjs.Stage;
    private _img: HTMLImageElement;
    private _bullet: createjs.Bitmap;

    /**
     * コンストラクタ.
     *
     * @constructor
     * @param {createjs.Stage} stage ステージ
     * @param {HTMLImageElement} img イメージ
     */
    constructor(stage: createjs.Stage, img: HTMLImageElement) {

      super();

      this._stage = stage;
      this._img = img;
      this._initialize();
    }

    // ==========================================
    //   Public
    // ==========================================

    /**
     * 画面から消す.
     */
    public remove() {

      createjs.Tween.removeTweens(this);
      this.removeChild(this);

      this._stage.removeChild(this);
    }

    /**
     * 幅を取得する.
     */
    public getWidth(): number {

      return this._img.naturalWidth;
    }

    /**
     * 高さを取得する.
     */
    public getHeight(): number {

      return this._img.naturalHeight;
    }

    // ==========================================
    //   Private
    // ==========================================

    /**
     * 初期化する.
     */
    private _initialize() {

      this._bullet = new createjs.Bitmap(this._img);
      this.addChild(this._bullet);
    }
  }
}