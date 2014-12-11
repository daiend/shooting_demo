var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var game;
(function (game) {
    (function (view) {
        var Boss = (function (_super) {
            __extends(Boss, _super);
            function Boss(controller, assets) {
                _super.call(this, assets['boss']);
                this._bmpList = {};
                this._vital = Boss.MAX_VITAL;

                this._controller = controller;
                this._stage = controller.getStage();
                this._assets = assets;
            }
            Boss.prototype.setPos = function () {
                this.x = this._stage.canvas.width / 2;
                this.y = 0;
            };

            Boss.prototype.move = function () {
                var that = this;

                createjs.Tween.get(this).to({ y: this.y + 300 }, 1500, createjs.Ease.linear).call(function () {
                    createjs.Tween.get(that, { loop: true }).call(that._moveRandom).wait(3000 + game.Util._getRndNum(-500, 500));
                });

                createjs.Tween.get(this, { loop: true }).wait(game.Util._getRndNum(1500, 3000)).call(this._shoot);
            };

            Boss.prototype.remove = function () {
                createjs.Tween.removeTweens(this);
                this._explode();
                this._stage.removeChild(this);
            };

            Boss.prototype.damage = function () {
                if (this._vital === 0) {
                    return;
                }

                this._vital--;
                this._blink();
            };

            Boss.prototype.getVital = function () {
                return this._vital;
            };

            Boss.prototype._moveRandom = function () {
                createjs.Tween.get(this).to({ x: game.Util._getRndNum(220, 420), y: game.Util._getRndNum(180, 380) }, 2000, createjs.Ease.cubicOut);
            };

            Boss.prototype._shoot = function () {
                var img = (game.Util._getRndNum(0, 1) === 0) ? this._assets['bossBullet'] : this._assets['enemyBullet'], bullet;

                for (var i = Boss.BULLET_NUM; i--;) {
                    bullet = new view.Bullet(this._stage, img);
                    bullet.x = this.x;
                    bullet.y = this.y;
                    bullet.regX = img.naturalWidth / 2;
                    bullet.regY = img.naturalHeight / 2;
                    this._stage.addChild(bullet);
                    this._controller.addEnemyBullet(bullet);

                    createjs.Tween.get(bullet).to({ x: game.Util._getRndNum(-700, 1300), y: 1000 }, game.Util._getRndNum(3000, 5000), createjs.Ease.linear);
                }
            };

            Boss.prototype._blink = function () {
                createjs.Tween.get(this).set({ visible: false }).wait(100).set({ visible: true });
            };

            Boss.prototype._explode = function () {
                var that = this, img = this._assets['enemyExplode'], explode = new createjs.Bitmap(img);

                this._controller.addPoint(Boss.POINT);
                this._controller.removeAllBullet();

                explode.x = this.x;
                explode.y = this.y;
                explode.regX = img.naturalWidth / 2;
                explode.regY = img.naturalWidth / 2;
                explode.alpha = 0.7;
                this._stage.addChild(explode);

                createjs.Tween.get(explode).to({ scaleX: 12.0, scaleY: 12.0, alpha: 0 }, 1000, createjs.Ease.cubicOut).wait(500).call(function () {
                    that._stage.removeChild(explode);
                    explode = null;

                    that._controller.showGameClear();
                });

                this.destroy();
            };
            Boss.BULLET_NUM = 20;
            Boss.POINT = 20000;
            Boss.MAX_VITAL = 100;
            return Boss;
        })(view.base.Airplane);
        view.Boss = Boss;
    })(game.view || (game.view = {}));
    var view = game.view;
})(game || (game = {}));
//# sourceMappingURL=boss.js.map
