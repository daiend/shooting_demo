var game;
(function (game) {
    var Main = (function () {
        function Main(assets) {
            this._model = new game.model.AppModel();
            this._model.setAssets(assets);
            this._ctrl = new game.controller.AppController(this._model);
        }
        Main.prototype.init = function () {
        };
        return Main;
    })();
    game.Main = Main;
})(game || (game = {}));

document.addEventListener("DOMContentLoaded", function () {
    var preload = new game.Preload();
    preload.load();
});
//# sourceMappingURL=main.js.map
