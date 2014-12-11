var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var game;
(function (game) {
    (function (view) {
        var Enemy3 = (function (_super) {
            __extends(Enemy3, _super);
            function Enemy3(controller, assets) {
                _super.call(this, assets['enemy3']);

                this._controller = controller;
                this._stage = controller.getStage();
                this._assets = assets;
            }
            Enemy3.prototype.setPos = function () {
                this.x = (game.Util._getRndNum(0, 1) === 0) ? 700 : -60;
                this.y = (game.Util._getRndNum(0, 1) === 0) ? 400 : 150;

                this.x += game.Util._getRndNum(-100, 100);
                this.y += game.Util._getRndNum(-100, 100);
            };

            Enemy3.prototype.move = function () {
                var pos = this._controller.getPlayerPos();

                createjs.Tween.get(this).to({ x: pos.x + game.Util._getRndNum(-100, 100), y: pos.y + game.Util._getRndNum(-100, 100) }, 1400, createjs.Ease.cubicOut).wait(300).to({ x: this._stage.canvas.width / 2, y: -100 }, 1000, createjs.Ease.cubicOut);

                createjs.Tween.get(this).wait(2000).call(this._shoot);
            };

            Enemy3.prototype.remove = function () {
                createjs.Tween.removeTweens(this);
                this._explode();
                this._stage.removeChild(this);
            };

            Enemy3.prototype._shoot = function () {
                var img = this._assets['enemyBullet'], bullet, pos;

                for (var i = Enemy3.BULLET_NUM; i--;) {
                    bullet = new view.Bullet(this._stage, img);
                    bullet.x = this.x;
                    bullet.y = this.y;
                    bullet.regX = img.naturalWidth / 2;
                    bullet.regY = img.naturalHeight / 2;
                    this._stage.addChild(bullet);
                    this._controller.addEnemyBullet(bullet);

                    pos = this._controller.getPlayerPos();

                    createjs.Tween.get(bullet).to({ x: game.Util._getRndNum(pos.x - 150, pos.x + 150), y: 1000 }, 1200 + game.Util._getRndNum(-100, 100), createjs.Ease.linear);
                }
            };

            Enemy3.prototype._explode = function () {
                var that = this, img = this._assets['enemyExplode'], explode = new createjs.Bitmap(img);

                if (this.y < 0) {
                    this.destroy();
                    return;
                }

                this._controller.addPoint(Enemy3.POINT);

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
            Enemy3.BULLET_NUM = 6;
            Enemy3.POINT = 3000;
            return Enemy3;
        })(view.base.Airplane);
        view.Enemy3 = Enemy3;
    })(game.view || (game.view = {}));
    var view = game.view;
})(game || (game = {}));
//# sourceMappingURL=enemy3.js.map
