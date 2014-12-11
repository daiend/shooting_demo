var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var game;
(function (game) {
    (function (view) {
        var Bullet = (function (_super) {
            __extends(Bullet, _super);
            function Bullet(stage, img) {
                _super.call(this);

                this._stage = stage;
                this._img = img;
                this._initialize();
            }
            Bullet.prototype.remove = function () {
                createjs.Tween.removeTweens(this);
                this.removeChild(this);

                this._stage.removeChild(this);
            };

            Bullet.prototype.getWidth = function () {
                return this._img.naturalWidth;
            };

            Bullet.prototype.getHeight = function () {
                return this._img.naturalHeight;
            };

            Bullet.prototype._initialize = function () {
                this._bullet = new createjs.Bitmap(this._img);
                this.addChild(this._bullet);
            };
            return Bullet;
        })(createjs.Container);
        view.Bullet = Bullet;
    })(game.view || (game.view = {}));
    var view = game.view;
})(game || (game = {}));
//# sourceMappingURL=bullet.js.map
