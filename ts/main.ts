/// <reference path="libs/easeljs/easeljs.d.ts" />
/// <reference path="controller/appController.ts" />
/// <reference path="model/appModel.ts" />
/// <reference path="preload.ts" />

module game {

  /**
   * Main Class.
   *
   * @class
   * @name Main
   */
  export class Main {

    private _model: model.AppModel;
    private _ctrl: controller.AppController;

    /**
     * コンストラクタ.
     *
     * @constructor
     * @param {Object} assets アセット
     */
    constructor(assets: Object) {

      this._model = new model.AppModel();
      this._model.setAssets(assets);
      this._ctrl = new controller.AppController(this._model);
    }

    // ==========================================
    //   Public
    // ==========================================

    /**
     * 初期化する.
     */
    public init() {


    }
  }
}

document.addEventListener("DOMContentLoaded", function() {

  var preload = new game.Preload();
  preload.load();
});