var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var game;
(function (game) {
    (function (view) {
        var Header = (function (_super) {
            __extends(Header, _super);
            function Header(assets) {
                _super.call(this);
                this._lifeIconAry = [];

                this._assets = assets;
                this._initialize();
            }
            Header.prototype.updatePoint = function (point) {
                this._pointTxt.text = String(point);
            };

            Header.prototype.updateLife = function (life) {
                this._lifeIconAry[life].visible = false;
            };

            Header.prototype.destroy = function () {
                this._lifeIconAry = [];
            };

            Header.prototype._initialize = function () {
                var img = this._assets['player'], icon;

                this._pointTxt = new createjs.Text('0000', 'bold 64px ArialMT', '#FFF');
                this._pointTxt.alpha = 0.5;
                this._pointTxt.textAlign = 'left';
                this.addChild(this._pointTxt);

                for (var i = 5; i--;) {
                    icon = new createjs.Bitmap(img);
                    icon.x = 400 + 50 * i;
                    icon.y = 30;
                    icon.regX = img.naturalWidth / 2;
                    icon.regY = img.naturalHeight / 2;
                    icon.scaleX = icon.scaleY = 0.5;
                    this.addChild(icon);
                    this._lifeIconAry.push(icon);
                }
            };
            return Header;
        })(createjs.Container);
        view.Header = Header;
    })(game.view || (game.view = {}));
    var view = game.view;
})(game || (game = {}));
//# sourceMappingURL=header.js.map
