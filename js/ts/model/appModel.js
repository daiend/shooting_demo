var game;
(function (game) {
    (function (model) {
        var AppModel = (function () {
            function AppModel() {
                this._assets = {};
                this._playerBulletAry = [];
                this._enemyBulletAry = [];
                this._point = 0;
            }
            AppModel.prototype.destroy = function () {
                this._playerBulletAry = [];
                this._enemyBulletAry = [];
                this._point = 0;
            };

            AppModel.prototype.setAssets = function (assets) {
                this._assets = assets;
            };

            AppModel.prototype.getAssets = function (ary) {
                var result = {}, str;

                for (var i = ary.length; i--;) {
                    str = ary[i];
                    result[str] = this._assets[str];
                }

                return result;
            };

            AppModel.prototype.addPlayerBullet = function (bullet) {
                this._playerBulletAry.push(bullet);
            };

            AppModel.prototype.removePlayerBullet = function (index) {
                var bullet = this._playerBulletAry[index];

                if (bullet !== undefined) {
                    bullet.remove();
                    this._playerBulletAry.splice(index, 1);
                }
            };

            AppModel.prototype.getPlayerBullet = function () {
                return this._playerBulletAry;
            };

            AppModel.prototype.addEnemyBullet = function (bullet) {
                this._enemyBulletAry.push(bullet);
            };

            AppModel.prototype.removeEnemyBullet = function (index) {
                var bullet = this._enemyBulletAry[index];

                if (bullet !== undefined) {
                    bullet.remove();
                    this._enemyBulletAry.splice(index, 1);
                }
            };

            AppModel.prototype.getEnemyBullet = function () {
                return this._enemyBulletAry;
            };

            AppModel.prototype.removeAllBullet = function () {
                for (var i = this._playerBulletAry.length; i--;) {
                    this._playerBulletAry[i].remove();
                }

                for (var i = this._enemyBulletAry.length; i--;) {
                    this._enemyBulletAry[i].remove();
                }

                this._playerBulletAry = [];
                this._enemyBulletAry = [];
            };

            AppModel.prototype.addPoint = function (point) {
                this._point += point;
            };

            AppModel.prototype.getPoint = function () {
                return this._point;
            };
            return AppModel;
        })();
        model.AppModel = AppModel;
    })(game.model || (game.model = {}));
    var model = game.model;
})(game || (game = {}));
//# sourceMappingURL=appModel.js.map
