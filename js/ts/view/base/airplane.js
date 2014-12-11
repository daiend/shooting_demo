var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var game;
(function (game) {
    (function (view) {
        (function (base) {
            var Airplane = (function (_super) {
                __extends(Airplane, _super);
                function Airplane(img) {
                    _super.call(this);

                    this._img = img;
                    this._initialize();
                }
                Airplane.prototype.getWidth = function () {
                    return this._img.naturalWidth;
                };

                Airplane.prototype.getHeight = function () {
                    return this._img.naturalHeight;
                };

                Airplane.prototype.destroy = function () {
                    this.removeChild(this._airPlane);
                };

                Airplane.prototype._initialize = function () {
                    this._airPlane = new createjs.Bitmap(this._img);
                    this.addChild(this._airPlane);
                };
                return Airplane;
            })(createjs.Container);
            base.Airplane = Airplane;
        })(view.base || (view.base = {}));
        var base = view.base;
    })(game.view || (game.view = {}));
    var view = game.view;
})(game || (game = {}));
//# sourceMappingURL=airplane.js.map
