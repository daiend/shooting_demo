var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var game;
(function (game) {
    (function (view) {
        var Background = (function (_super) {
            __extends(Background, _super);
            function Background(assets) {
                _super.call(this);

                this._assets = assets;
                this._initialize();
            }
            Background.prototype._initialize = function () {
                var bg = new createjs.Shape();

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

                createjs.Tween.get(bg, { loop: true }).to({ alpha: 0.5 }, 2000, createjs.Ease.cubicOut).to({ alpha: 1 }, 2000, createjs.Ease.cubicIn).wait(1000);

                this._scrollBg();
            };

            Background.prototype._scrollBg = function () {
                var that = this, canvasH = 960;

                createjs.Tween.get(this._bgBmp, { loop: true }).to({ y: this._bgBmp.y + canvasH }, 3000, createjs.Ease.linear).call(function () {
                    if (that._bgBmp.y === canvasH) {
                        that._bgBmp.y = -canvasH;
                    }
                });

                createjs.Tween.get(this._bgBmp2, { loop: true }).to({ y: this._bgBmp2.y + canvasH }, 3000, createjs.Ease.linear).call(function () {
                    if (that._bgBmp2.y === canvasH) {
                        that._bgBmp2.y = -canvasH;
                    }
                });
            };
            return Background;
        })(createjs.Container);
        view.Background = Background;
    })(game.view || (game.view = {}));
    var view = game.view;
})(game || (game = {}));
//# sourceMappingURL=background.js.map
