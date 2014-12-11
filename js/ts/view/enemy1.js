var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var game;
(function (game) {
    (function (view) {
        var Enemy1 = (function (_super) {
            __extends(Enemy1, _super);
            function Enemy1(controller, assets) {
                _super.call(this, assets['enemy']);

                this._controller = controller;
                this._stage = controller.getStage();
                this._assets = assets;
            }
            Enemy1.prototype.setPos = function () {
                var rnd = game.Util._getRndNum(0, 1);

                this.x = (rnd === 0) ? 700 : -60;
                this.y = 150;
            };

            Enemy1.prototype.move = function (delay) {
                var initX = this.x, rndX = (this.x > 0) ? game.Util._getRndNum(-400, -200) : game.Util._getRndNum(400, 200), rndY = game.Util._getRndNum(-100, 100);

                createjs.Tween.get(this).wait(delay).to({ x: this.x + rndX, y: this.y + rndY }, 800, createjs.Ease.cubicOut).call(this._shoot).wait(1000).to({ x: initX, y: -100 }, 800, createjs.Ease.cubicOut);
            };

            Enemy1.prototype.remove = function () {
                createjs.Tween.removeTweens(this);
                this._explode();
                this._stage.removeChild(this);
            };

            Enemy1.prototype._shoot = function () {
                var img = this._assets['enemyBullet'], bullet, pos;

                for (var i = Enemy1.BULLET_NUM; i--;) {
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

            Enemy1.prototype._explode = function () {
                var that = this, img = this._assets['enemyExplode'], explode = new createjs.Bitmap(img);

                if (this.y < 0) {
                    this.destroy();
                    return;
                }

                this._controller.addPoint(Enemy1.POINT);

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
            Enemy1.BULLET_NUM = 8;
            Enemy1.POINT = 1000;
            return Enemy1;
        })(view.base.Airplane);
        view.Enemy1 = Enemy1;
    })(game.view || (game.view = {}));
    var view = game.view;
})(game || (game = {}));
//# sourceMappingURL=enemy1.js.map
