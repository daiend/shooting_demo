var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var game;
(function (game) {
    (function (view) {
        var Enemy2 = (function (_super) {
            __extends(Enemy2, _super);
            function Enemy2(controller, assets) {
                _super.call(this, assets['enemy2']);
                this._vital = 5;

                this._controller = controller;
                this._stage = controller.getStage();
                this._assets = assets;

                this._setShootTimer();
            }
            Enemy2.prototype.setPos = function () {
                this.x = game.Util._getRndNum(80, 620);
                this.y = 0;
            };

            Enemy2.prototype.move = function () {
                createjs.Tween.get(this).to({ y: 1000 }, 5000, createjs.Ease.linear);
            };

            Enemy2.prototype.remove = function () {
                createjs.Tween.removeTweens(this);
                this._explode();
                this._stage.removeChild(this);
            };

            Enemy2.prototype.damage = function () {
                if (this._vital === 0) {
                    return;
                }

                this._vital--;
                this._blink();
            };

            Enemy2.prototype.getVital = function () {
                return this._vital;
            };

            Enemy2.prototype._shoot = function () {
                var img = this._assets['enemyBullet2'], bullet = new view.Bullet(this._stage, img);

                bullet.x = this.x;
                bullet.y = this.y;
                bullet.regX = img.naturalWidth / 2;
                bullet.regY = img.naturalHeight / 2;
                this._stage.addChild(bullet);
                this._controller.addEnemyBullet(bullet);

                createjs.Tween.get(bullet).to({ y: this.y + this._stage.canvas.height }, 1000, createjs.Ease.linear);
            };

            Enemy2.prototype._blink = function () {
                createjs.Tween.get(this).set({ visible: false }).wait(100).set({ visible: true });
            };

            Enemy2.prototype._explode = function () {
                var that = this, img = this._assets['enemyExplode'], explode = new createjs.Bitmap(img);

                if (this.y > this._stage.canvas.height) {
                    this.destroy();
                    return;
                }

                this._controller.addPoint(Enemy2.POINT);

                explode.x = this.x;
                explode.y = this.y;
                explode.regX = img.naturalWidth / 2;
                explode.regY = img.naturalWidth / 2;
                explode.alpha = 0.7;
                this._stage.addChild(explode);

                createjs.Tween.get(explode).to({ scaleX: 5.0, scaleY: 5.0, alpha: 0 }, 300, createjs.Ease.linear).call(function () {
                    that._stage.removeChild(explode);
                    explode = null;
                });

                this.destroy();
            };

            Enemy2.prototype._setShootTimer = function () {
                createjs.Tween.get(this, { loop: true }).call(this._shoot).wait(Enemy2.BULLET_INTERVAL);
            };
            Enemy2.BULLET_INTERVAL = 1500;
            Enemy2.POINT = 2000;
            return Enemy2;
        })(view.base.Airplane);
        view.Enemy2 = Enemy2;
    })(game.view || (game.view = {}));
    var view = game.view;
})(game || (game = {}));
//# sourceMappingURL=enemy2.js.map
