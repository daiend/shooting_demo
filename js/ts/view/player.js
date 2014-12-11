var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var game;
(function (game) {
    (function (view) {
        var Player = (function (_super) {
            __extends(Player, _super);
            function Player(controller, assets) {
                _super.call(this, assets['player']);
                this._invincibleFlg = true;

                this._controller = controller;
                this._stage = controller.getStage();
                this._assets = assets;
            }
            Player.prototype.appear = function () {
                var that = this;

                createjs.Tween.get(this).wait(300).call(this._setShootTimer).to({ alpha: 1 }, 1000, createjs.Ease.cubicOut).call(function () {
                    that._invincibleFlg = false;
                });
            };

            Player.prototype.move = function (x, y) {
                this.x = x;
                this.y = y;
            };

            Player.prototype.remove = function () {
                createjs.Tween.removeTweens(this);
                this._explode();
                this._stage.removeChild(this);
            };

            Player.prototype.isInvincible = function () {
                return this._invincibleFlg;
            };

            Player.prototype.stopShootTimer = function () {
                createjs.Tween.removeTweens(this);
            };

            Player.prototype._shoot = function () {
                var img = this._assets['playerBullet'], bullet = new view.Bullet(this._stage, img);

                bullet.x = this.x;
                bullet.y = this.y - this.getHeight() / 2;
                bullet.regX = img.naturalWidth / 2;
                bullet.regY = img.naturalHeight / 2;
                this._stage.addChild(bullet);
                this._controller.addPlayerBullet(bullet);

                createjs.Tween.get(bullet).to({ y: bullet.y - this._stage.canvas.height }, 500, createjs.Ease.linear);
            };

            Player.prototype._explode = function () {
                var that = this, img = this._assets['playerExplode'], explode = new createjs.Bitmap(img);

                explode.x = this.x;
                explode.y = this.y;
                explode.regX = img.naturalWidth / 2;
                explode.regY = img.naturalWidth / 2;
                explode.alpha = 0.7;
                this._stage.addChild(explode);

                createjs.Tween.get(explode).to({ scaleX: 7.0, scaleY: 7.0, alpha: 0 }, 500, createjs.Ease.linear).call(function () {
                    that._stage.removeChild(explode);
                    explode = null;
                });

                this.destroy();
            };

            Player.prototype._setShootTimer = function () {
                createjs.Tween.get(this, { loop: true }).call(this._shoot).wait(Player.BULLET_INTERVAL);
            };
            Player.BULLET_INTERVAL = 100;
            return Player;
        })(view.base.Airplane);
        view.Player = Player;
    })(game.view || (game.view = {}));
    var view = game.view;
})(game || (game = {}));
//# sourceMappingURL=player.js.map
