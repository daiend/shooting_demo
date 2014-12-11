var game;
(function (game) {
    (function (_command) {
        var ActionCommand = (function () {
            function ActionCommand(controller) {
                this._commandAry = [];
                this._time = 0;
                this._controller = controller;
            }
            ActionCommand.prototype.addCommand = function (command) {
                this._commandAry.push(command);
            };

            ActionCommand.prototype.addTime = function () {
                this._time++;
                this._checkCommand();
            };

            ActionCommand.prototype.destroy = function () {
                this._commandAry = [];
                this._time = 0;
            };

            ActionCommand.prototype._checkCommand = function () {
                var command, len = this._commandAry.length;

                if (len === 0) {
                    return;
                }

                for (var i = len; i--;) {
                    command = this._commandAry[i];

                    if (this._time >= command['time']) {
                        this._controller.runCommand(command['command']);
                        this._commandAry.splice(i, 1);
                        break;
                    }
                }
            };
            ActionCommand.APPEAR_ENEMY1 = 'appearEnemy1';
            ActionCommand.APPEAR_ENEMY2 = 'appearEnemy2';
            ActionCommand.APPEAR_ENEMY3 = 'appearEnemy3';
            ActionCommand.APPEAR_BOSS = 'appearBoss';
            return ActionCommand;
        })();
        _command.ActionCommand = ActionCommand;
    })(game.command || (game.command = {}));
    var command = game.command;
})(game || (game = {}));
//# sourceMappingURL=actionCommand.js.map

var game;
(function (game) {
    (function (controller) {
        var AppController = (function () {
            function AppController(model) {
                var _this = this;
                this._canvas = document.querySelector("canvas");
                this._enemyAry = [];
                this._tickCnt = 0;
                this._playerLife = AppController.MAX_PLAYER_LIFE;
                this._sounds = {};
                this._tickHandler = function () {
                    _this._stage.update();

                    if (_this._actionCommand === undefined) {
                        return;
                    }

                    _this._checkPlayerBulletPos();
                    _this._checkEnemyBulletPos();
                    _this._checkEnemyPos();

                    _this._tickCnt++;
                    if (_this._tickCnt % AppController.FPS === 0) {
                        _this._actionCommand.addTime();
                    }
                };
                this._stageMouseMoveHandler = function (e) {
                    if (_this._player === null) {
                        return;
                    }

                    _this._player.move(~~e.stageX, ~~(e.stageY - 60));
                };
                this._clickHandler = function (e) {
                    if (e.currentTarget['name'] === 'title') {
                        _this._overlayCont.removeEventListener('click', _this._clickHandler);
                        _this._overlayCont.removeAllChildren();
                        _this._stage.removeChild(_this._overlayCont);
                        _this._overlayCont = null;
                        _this._startGame();
                    } else {
                        if (e.currentTarget['name'] === 'clear') {
                            _this._sounds['clear'].stop();
                        }

                        _this._refresh();
                    }
                };
                this._stage = new createjs.Stage(this._canvas);
                this._model = model;
                this._backGround = new game.view.Background(model.getAssets(['bg']));
                this._header = new game.view.Header(model.getAssets(['player']));

                this._initialize();
            }
            AppController.prototype.addPlayerBullet = function (bullet) {
                this._model.addPlayerBullet(bullet);
            };

            AppController.prototype.addEnemyBullet = function (bullet) {
                this._model.addEnemyBullet(bullet);
            };

            AppController.prototype.removeAllBullet = function () {
                this._player.stopShootTimer();
                this._model.removeAllBullet();
            };

            AppController.prototype.addPoint = function (point) {
                this._model.addPoint(point);
                this._header.updatePoint(this._model.getPoint());
            };

            AppController.prototype.getStage = function () {
                return this._stage;
            };

            AppController.prototype.getPlayerPos = function () {
                var pos = { 'x': this._canvas.width / 2, 'y': this._canvas.height };

                if (this._player !== null) {
                    pos = { 'x': this._player.x, 'y': this._player.y };
                }

                return pos;
            };

            AppController.prototype.runCommand = function (command) {
                var actionCommand = game.command.ActionCommand;

                switch (command) {
                    case actionCommand.APPEAR_ENEMY1:
                        this._createEnemy1();
                        break;

                    case actionCommand.APPEAR_ENEMY2:
                        this._createEnemy2();
                        break;

                    case actionCommand.APPEAR_ENEMY3:
                        this._createEnemy3();
                        break;

                    case actionCommand.APPEAR_BOSS:
                        this._showCaution();
                        break;

                    default:
                        break;
                }
            };

            AppController.prototype.showGameClear = function () {
                var text = new createjs.Text('GAME CLEAR!!', 'bold 64px ArialMT', '#00FF00'), point = new createjs.Text('Total : ' + String(this._model.getPoint()), 'bold 36px ArialMT', '#FFF');

                createjs.Ticker.removeEventListener('tick', this._tickHandler);

                this._sounds['boss'].stop();
                this._sounds['clear'] = createjs.Sound.play('clear', { 'loop': -1 });
                this._sounds['clear'].volume = 0.5;

                this._overlayCont = this._createOverlay();
                this._overlayCont.name = 'clear';
                this._overlayCont.addEventListener('click', this._clickHandler);

                text.x = this._canvas.width / 2;
                text.y = this._canvas.height / 2 - 100;
                text.alpha = 0.7;
                text.textAlign = 'center';
                this._overlayCont.addChild(text);

                point.x = this._canvas.width / 2;
                point.y = this._canvas.height / 2;
                point.textAlign = 'center';
                this._overlayCont.addChild(point);
            };

            AppController.prototype._initialize = function () {
                if (createjs.Touch.isSupported()) {
                    createjs.Touch.enable(this._stage);
                }

                createjs.Ticker.setFPS(AppController.FPS);
                createjs.Ticker.addEventListener('tick', this._tickHandler);

                this._stepAndroid();
                this._showTitle();
            };

            AppController.prototype._startGame = function () {
                this._stage.addEventListener('stagemousemove', this._stageMouseMoveHandler);
                this._stage.addChild(this._backGround);
                this._stage.addChild(this._header);

                this._sounds['shot'] = createjs.Sound.createInstance('shot');
                this._sounds['shot2'] = createjs.Sound.createInstance('shot2');
                this._sounds['explode'] = createjs.Sound.createInstance('explode');
                this._sounds['loop'] = createjs.Sound.play('loop', { 'loop': -1 });
                this._sounds['loop'].volume = 0.5;

                if (this._actionCommand === undefined) {
                    this._actionCommand = new game.command.ActionCommand(this);
                }

                this._addCommand();
                this._createPlayer();
            };

            AppController.prototype._stepAndroid = function () {
                var that = this, mask;

                this._stage.clear = function () {
                    if (that._canvas) {
                        var a = that._canvas.getContext("2d");
                        a.setTransform(1, 0, 0, 1, 0, 0);
                        a.clearRect(0, 0, that._canvas.width + 0.5, that._canvas.height + 0.5);
                    }
                };

                mask = new createjs.Shape();
                mask.graphics.beginFill("#FFFFFF");
                mask.graphics.rect(0, 0, 640, 960);
                mask.graphics.endFill();
                this._stage.mask = mask;
            };

            AppController.prototype._addCommand = function () {
                var actionCommand = game.command.ActionCommand;

                for (var i = 5; i--;) {
                    this._actionCommand.addCommand({ 'command': actionCommand.APPEAR_ENEMY1, 'time': 2 * i });
                }

                for (var i = 7; i--;) {
                    this._actionCommand.addCommand({ 'command': actionCommand.APPEAR_ENEMY2, 'time': 12 + game.Util._getRndNum(-2, 0) + 2 * i });
                }

                for (var i = 4; i--;) {
                    this._actionCommand.addCommand({ 'command': actionCommand.APPEAR_ENEMY1, 'time': 16 + 2 * i });
                }

                for (var i = 8; i--;) {
                    this._actionCommand.addCommand({ 'command': actionCommand.APPEAR_ENEMY3, 'time': 28 + game.Util._getRndNum(-2, 0) + 3 * i });
                }

                this._actionCommand.addCommand({ 'command': actionCommand.APPEAR_BOSS, 'time': 52 });
            };

            AppController.prototype._createPlayer = function () {
                var assets = this._model.getAssets(['player', 'playerBullet', 'playerExplode']), img = assets['player'];

                this._player = new game.view.Player(this, assets);
                this._player.x = this._canvas.width / 2;
                this._player.y = this._canvas.height - img.naturalHeight * 2;
                this._player.regX = img.naturalWidth / 2;
                this._player.regY = img.naturalHeight / 2;
                this._player.alpha = 0;
                this._player.appear();
                this._stage.addChild(this._player);
            };

            AppController.prototype._createEnemy1 = function () {
                var assets = this._model.getAssets(['enemy', 'enemyBullet', 'enemyExplode']), img = assets['enemy'], enemy;

                for (var i = AppController.ENEMY1_NUM; i--;) {
                    enemy = new game.view.Enemy1(this, assets);
                    enemy.regX = img.naturalWidth / 2;
                    enemy.regY = img.naturalHeight / 2;
                    enemy.setPos();
                    enemy.move(i * 200);
                    this._stage.addChild(enemy);
                    this._enemyAry.push(enemy);
                }
            };

            AppController.prototype._createEnemy2 = function () {
                var assets = this._model.getAssets(['enemy2', 'enemyBullet2', 'enemyExplode']), img = assets['enemy2'], enemy = new game.view.Enemy2(this, assets);

                enemy.regX = img.naturalWidth / 2;
                enemy.regY = img.naturalHeight / 2;
                enemy.setPos();
                enemy.move();
                this._stage.addChild(enemy);
                this._enemyAry.push(enemy);
            };

            AppController.prototype._createEnemy3 = function () {
                var assets = this._model.getAssets(['enemy3', 'enemyBullet', 'enemyExplode']), img = assets['enemy3'], enemy;

                for (var i = AppController.ENEMY3_NUM; i--;) {
                    enemy = new game.view.Enemy3(this, assets);
                    enemy.regX = img.naturalWidth / 2;
                    enemy.regY = img.naturalHeight / 2;
                    enemy.setPos();
                    enemy.move();
                    this._stage.addChild(enemy);
                    this._enemyAry.push(enemy);
                }
            };

            AppController.prototype._createBoss = function () {
                var assets = this._model.getAssets([
                    'boss', 'bossBullet', 'bossLaser', 'enemyBullet', 'enemyExplode'
                ]), img = assets['boss'], boss = new game.view.Boss(this, assets);

                boss.regX = img.naturalWidth / 2;
                boss.regY = img.naturalHeight / 2;
                boss.name = 'boss';
                boss.setPos();
                boss.move();
                this._stage.addChild(boss);
                this._enemyAry.push(boss);

                this._sounds['loop'].stop();
                this._sounds['boss'] = createjs.Sound.play('boss', { 'loop': -1 });
                this._sounds['boss'].volume = 0.5;
            };

            AppController.prototype._removeEnemy = function (index) {
                var enemy = this._enemyAry[index];
                enemy.remove();

                this._enemyAry.splice(index, 1);
            };

            AppController.prototype._checkPlayerBulletPos = function () {
                var bulletAry = this._model.getPlayerBullet(), bullet, enemy;

                if (bulletAry.length === 0 || this._enemyAry.length === 0) {
                    return;
                }

                for (var i = bulletAry.length; i--;) {
                    bullet = bulletAry[i];

                    if (bullet === undefined) {
                        continue;
                    }

                    if (bullet.y < 0) {
                        this._model.removePlayerBullet(i);
                        continue;
                    }

                    for (var j = this._enemyAry.length; j--;) {
                        enemy = this._enemyAry[j];

                        if (enemy === undefined) {
                            continue;
                        }

                        if (game.Util._isCollision(bullet, enemy)) {
                            this._model.removePlayerBullet(i);
                            this._damageEnemy(enemy, j);
                        }
                    }
                }
            };

            AppController.prototype._checkEnemyBulletPos = function () {
                var bulletAry = this._model.getEnemyBullet(), bullet;

                if (bulletAry.length === 0) {
                    return;
                }

                for (var i = bulletAry.length; i--;) {
                    bullet = bulletAry[i];

                    if (bullet === undefined) {
                        continue;
                    }

                    if (bullet.x < 0 || bullet.x > this._canvas.width || bullet.y < 0 || bullet.y > this._canvas.height) {
                        this._model.removeEnemyBullet(i);
                        continue;
                    }

                    if (this._player === null || this._player.isInvincible()) {
                        continue;
                    }

                    if (game.Util._isCollision(bullet, this._player)) {
                        this._model.removeAllBullet();
                        this._damagePlayer();
                        break;
                    }
                }
            };

            AppController.prototype._checkEnemyPos = function () {
                var enemy;

                for (var i = this._enemyAry.length; i--;) {
                    enemy = this._enemyAry[i];

                    if (enemy === undefined) {
                        continue;
                    }

                    if (enemy.y < 0 || enemy.y > this._canvas.height) {
                        this._removeEnemy(i);
                        continue;
                    }

                    if (this._player === null || this._player.isInvincible()) {
                        continue;
                    }

                    if (game.Util._isCollision(enemy, this._player)) {
                        this._damagePlayer();
                        break;
                    }
                }
            };

            AppController.prototype._damageEnemy = function (enemy, index) {
                if (enemy.damage === undefined) {
                    this._sounds['shot'].play();
                    this._removeEnemy(index);
                    return;
                }

                enemy.damage();

                if (enemy.getVital() === 0) {
                    if (enemy.name === 'boss') {
                        this._sounds['explode'].play();
                    } else {
                        this._sounds['shot'].play();
                    }

                    this._removeEnemy(index);
                }
            };

            AppController.prototype._damagePlayer = function () {
                this._sounds['shot2'].play();

                this._player.remove();
                this._player = null;
                this._playerLife--;

                this._header.updateLife(this._playerLife);

                if (this._playerLife !== 0) {
                    this._createPlayer();
                } else {
                    createjs.Tween.get(this).wait(700).call(this._showGameOver);
                }
            };

            AppController.prototype._refresh = function () {
                createjs.Tween.removeAllTweens();
                this._stage.removeAllChildren();
                this._model.destroy();
                this._actionCommand.destroy();
                this._header.destroy();

                createjs.Ticker.addEventListener('tick', this._tickHandler);
                this._stage.removeEventListener('stagemousemove', this._stageMouseMoveHandler);
                this._overlayCont.removeEventListener('click', this._clickHandler);

                this._playerLife = AppController.MAX_PLAYER_LIFE;
                this._tickCnt = 0;
                this._backGround = null;
                this._header = null;
                this._enemyAry = [];

                this._backGround = new game.view.Background(this._model.getAssets(['bg']));
                this._header = new game.view.Header(this._model.getAssets(['player']));

                this._startGame();
            };

            AppController.prototype._showTitle = function () {
                var text = new createjs.Text('Shooting Demo', 'bold 64px ArialMT', '#FFF'), text2 = new createjs.Text('tap game start', 'bold 36px ArialMT', '#FFF');

                this._overlayCont = this._createOverlay();
                this._overlayCont.name = 'title';
                this._overlayCont.addEventListener('click', this._clickHandler);

                text.x = this._canvas.width / 2;
                text.y = this._canvas.height / 2 - 100;
                text.textAlign = 'center';
                this._overlayCont.addChild(text);

                text2.x = this._canvas.width / 2;
                text2.y = this._canvas.height / 2;
                text2.textAlign = 'center';
                this._overlayCont.addChild(text2);
            };

            AppController.prototype._showCaution = function () {
                var that = this, text = new createjs.Text('CAUTION!!', 'bold 64px ArialMT', '#FF0000');

                this._sounds['alert'] = createjs.Sound.play('alert', { loop: 2 });

                this._overlayCont = this._createOverlay();

                text.x = this._canvas.width / 2;
                text.y = this._canvas.height / 2 - text.getMeasuredHeight();
                text.alpha = 0.7;
                text.textAlign = 'center';
                this._overlayCont.addChild(text);

                createjs.Tween.get(text).wait(500).to({ alpha: 0 }, 500, createjs.Ease.cubicOut).to({ alpha: 0.7 }, 400, createjs.Ease.cubicIn).wait(500).to({ alpha: 0 }, 500, createjs.Ease.cubicOut).to({ alpha: 0.7 }, 400, createjs.Ease.cubicIn).wait(500).to({ alpha: 0 }, 500, createjs.Ease.cubicOut).call(function () {
                    createjs.Tween.removeTweens(text);
                    that._overlayCont.removeAllChildren();
                    that._stage.removeChild(that._overlayCont);
                    that._overlayCont = null;

                    that._sounds['alert'].stop();

                    that._createBoss();
                });
            };

            AppController.prototype._showGameOver = function () {
                var text = new createjs.Text('GAME OVER', 'bold 64px ArialMT', '#FFF'), point = new createjs.Text('Total : ' + String(this._model.getPoint()), 'bold 36px ArialMT', '#FFF');

                createjs.Ticker.removeEventListener('tick', this._tickHandler);

                this._sounds['loop'].stop();

                if (this._sounds['boss'] !== undefined) {
                    this._sounds['boss'].stop();
                }

                this._overlayCont = this._createOverlay();
                this._overlayCont.addEventListener('click', this._clickHandler);

                text.x = this._canvas.width / 2;
                text.y = this._canvas.height / 2 - 100;
                text.textAlign = 'center';
                this._overlayCont.addChild(text);

                point.x = this._canvas.width / 2;
                point.y = this._canvas.height / 2;
                point.textAlign = 'center';
                this._overlayCont.addChild(point);
            };

            AppController.prototype._createOverlay = function () {
                var cont = new createjs.Container, cover = new createjs.Shape();

                this._stage.addChild(cont);

                cover.graphics.beginFill("#000");
                cover.graphics.rect(0, 0, 640, 960);
                cover.graphics.endFill();
                cover.alpha = 0.5;
                cont.addChild(cover);

                return cont;
            };
            AppController.FPS = 30;
            AppController.ENEMY1_NUM = 4;
            AppController.ENEMY3_NUM = 2;
            AppController.MAX_PLAYER_LIFE = 5;
            return AppController;
        })();
        controller.AppController = AppController;
    })(game.controller || (game.controller = {}));
    var controller = game.controller;
})(game || (game = {}));
//# sourceMappingURL=appController.js.map

var game;
(function (game) {
    var Main = (function () {
        function Main(assets) {
            this._model = new game.model.AppModel();
            this._model.setAssets(assets);
            this._ctrl = new game.controller.AppController(this._model);
        }
        Main.prototype.init = function () {
        };
        return Main;
    })();
    game.Main = Main;
})(game || (game = {}));

document.addEventListener("DOMContentLoaded", function () {
    var preload = new game.Preload();
    preload.load();
});
//# sourceMappingURL=main.js.map

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

var game;
(function (game) {
    var Preload = (function () {
        function Preload() {
            var _this = this;
            this._assets = {};
            this._soundLoadCnt = 0;
            this._fileLoadHandler = function (e) {
                _this._assets[e.item.id] = e.result;
            };
            this._completeHandler = function () {
                createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin, createjs.FlashPlugin]);
                createjs.Sound.alternateExtensions = ["mp3"];
                createjs.Sound.addEventListener("fileload", _this._soundLoadHandler);

                for (var i = Preload.SOUND_NAME.length; i--;) {
                    createjs.Sound.registerSound('sound/' + Preload.SOUND_NAME[i] + '.mp3', Preload.SOUND_NAME[i]);
                }
            };
            this._soundLoadHandler = function () {
                _this._soundLoadCnt++;

                if (_this._soundLoadCnt !== Preload.SOUND_NAME.length) {
                    return;
                }

                var main = new game.Main(_this._assets), element = document.querySelector('body');

                main.init();
                element.style.backgroundImage = 'none';
            };
        }
        Preload.prototype.load = function () {
            var loader = new createjs.LoadQueue(false), manifest = [
                { 'id': 'bg', type: "image", 'src': 'data:image/png;base64,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' },
                { 'id': 'boss', type: "image", 'src': 'data:image/png;base64,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' },
                { 'id': 'enemy', type: "image", 'src': 'data:image/png;base64,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' },
                { 'id': 'enemy2', type: "image", 'src': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABLCAMAAAD6bgFoAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA2UExURQAAAP9/DMhCAEBAR4uYfEFFPBISF253YzM1L1BWSXo0AFhYX6m5lv/eKYaGj3NGDJ6ep/+9GGYtWnUAAAABdFJOUwBA5thmAAACvUlEQVRYw+3XiW7qMBAFUBziDQIJ//+zvfd6oYkSCK0jvSd1VImCx0fxNobT6XucEe70NhzzXrS3Yc5XxB6GeefNR7neEXsY5l03HqgJA+Q6BYSYs1vVnFNXx7zpuga1YYhMwdoYHclpi5nY1cVobZim5TzjUYAEIN5jNe/3sMWE+x17wntAgdDsgRoxmhaMyPu+x6bA/yGsMWrA1up7QNZqgo5gNLteDMFthk1ivOZ5xmhaCoNMG7eYyNbCaILaMxwRkczg/9rsFJXRUBIjyNpDmIyAEYh5TBEV+Q0YdnbMS9CC8TnA6BWzEPEGL8oOAf1iFIMdmhHEkYwGtYsp0IFMr0Hhz7E/Ay/sEutbtvUaVL9kuKO0AulpQoryNJnJT6NIT6MVZd+mjOUmwoePh7oop38yA+LJ9DWF+dFzr9p2jNZCjDFghmHGuBozZhjAIJ+M1jGVEB2OrtMxd1r3+jQ+r/+TwYLrcCM/dbRNmVxo0u5L249jj4EHs+fc9DycgPOuS+NOfVJxb83oQ81pVjEiN4uQj4DKhpJz0Zkz6OtQs1wt7qHrjHncEA9jui7UQs4sVw75QUyun5aWPhFjHggjJpc7tM8raVumlIlUhiMZ0WEcBQkZx5BGBCbmgpxLRX2ackVpubgqgnA5EGKMI45NRpzTIs0vq5YM3n5ncDuxjuiqGhW6pHRh8uZ6MnExxY0Yz50OZhjEnDiuxTUeOCI1MYtM7jhfcB3uwujWXX7VKg2Jqd0OYWaDevXlug7qj/mYyZdieM2UrMMZY2438/73FLPMClOq5ufMWqH4BaMjl7/OfsbUr7ShnNwWjMpx+k72EaMusx8pquv45CMmdQnLHzi/Z8qe6rrbrXvPMKtb3amNmNyO220Pw/vvVfs/xVwuxlzeM8y6/EdM1+1hkPXH/IwhdNoRb7N+yHwB/qpQf1xqwsoAAAAASUVORK5CYII=' },
                { 'id': 'enemy3', type: "image", 'src': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGBAMAAACDAP+3AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAkUExURQAAAEBARxISF1hYX4aGj29vd7W1v/9/DJ6ep8hCAP/eKf+9GDk+ZrgAAAABdFJOUwBA5thmAAABPUlEQVRIx+3VvU7DMBAA4Hpkq2OngjFxVamjXRdQt9QGdY0KEmsLAztDVDohCjN0qTJ3QCoPUAlejnN/WAjCgZMY4JZk+KRLzue7SuU/NkHoXv5Iqz8zhNKwf5BdtVP6KfvaEBqepru3ncX88AbeCpWHIax9YhNuTUu7x1FfVr9jHOndDxgI05K1y0kB8jAbEkTURRAVIQ+zJULFLoQqQF4mXJG4biSkYrobr1Ba0myJkJRbaxPK1AfkaY4dUWJ/CJ/cOFfCoYvSxtVN6ARSNPM8n0JSbpSrZylDwrOJkYGQtWFzlmXZaNoYMBUx3bt7T+ZloCPARLwLZPy6BFRPAjDQJWXMzux6rpO1Gb8snpdrw03nafTwCwbrv7DqjHXueH2IdC+w7ina3MCaY2hzFW3Oo+0dtD2It5f/WrwBRnwn+C46MNAAAAAASUVORK5CYII=' },
                { 'id': 'player', type: "image", 'src': 'data:image/png;base64,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' },
                { 'id': 'bossBullet', type: "image", 'src': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADAUExURQAAAFT5AHH5L136AFH4AFD4AHX5Ok73AFv6AE71AD3/AE3/AEH/AH76UFj6AGv5EGP4AIL6VWj4AYf6YlH/AG75IHj6QmH3AF74AIX6XU7/AKL7imL4AHv6SpX6d1b5AJD5cab7kZn7frb8plP5AMP8tlD3AK76m7L7ocf8u4r6Z537hI35bL78sKr6laD7h9f8z878xEz/ANL8yeP93rr8q8v8wOf95Nv81Pz//Ov96fP98d/82O/97Pj/9v///470yoIAAAA/dFJOUwAtXD0mFmEeORoCCARuNFNLck98EFdlRUB3DZpIaoswh5+PsCq+Iaeswn+Tg7mjltXLE8/itcfn2f3r893v+PZLb/AAAAOuSURBVEjHlVZpY6JQDJT7hgrIoSDggYgX4q2t/v9/tQlXbS273XyeeZPkvUxep/Mcotw3c0YQuLgIThCYvC+JnbaQ+4CO6QkRlEFMaJoTGLOFIkomw8WAVnmeKoLn1WBCxwLTl348Hk6fAJpybM97g/Bs2+H5gABK/srA42lCBfSbrmtaD0LTdCBRfDBBhvgdj8fzCO+RJMtalsWyLNnTdKCoBM0x/S8MGfEqhXAA+4rShVAU32JJoDh88I0h9pkCD6ezvtJ1DSM1IFy3q1hsTysZT3VUeA+Ot5SukS7DIUYYpobb9S1Se7OBIeRyU0DOVXi/66bhcLTYDAaDzWYxGi4NV0EGagh9uSmADni7wBvL4WgziNYYUTRYjMIURJChTuK6DImJCd55K/AhwNezZIyRJDOgDJduFzQ8Sq2TQgFISCMLPMDHh9UUY7UaA2UDDMhKtykCJBoBWyetEp+MV9P5cQtxnE9XY2SkrsL2MCnBlLFFIOB4Guu7y9EmSg7T+XaXnc/nLNsd58hYhGkXJXgixtbK0KJSIB0W+OMue9+fTqf9/pxtkTEYhYUEhY2qMqoEBrMx4M/70/V2u31cT+/ISNaQFEo4Ks2ZnQ5kFECLLMUYLqJkNQf89Xa/PB6X+wcwjtMDSCxdH3OaxHlVgk76bjpEgW0GeIBjXICxAwmowlBYzeMDJJhlCZhRNDuAwKnGPx736x4kxpiTYhVFMFgzNFVjFTfEjI679+u9xj8ut9N5izlhEdjYZ4JRErL9RyPweNwwJywCq/4N4f6/hHYF8tc1PHdp0N4lo+nSl3tYw0U/3cP9p3sobpqCYahvelvd9KXlplve0kfzlg5J9PUt4WtVy3FAieq1Yrw3r3X5/FqLIqjv85BlMA/b47ScB+N5Hlon7ggTd4DzceJ8Fm2AFkx0AfHrTEezpJ7pwzhZFy4APS0EGKlxDbVxjcWna8zWUYUndQ8rMEubEf/hS6WToS/VFo7OF1B25XxAWSw2m8L4wk/nI+LG+eDyGK7yYvBWoIQhGGsYLsFbFZ+tvdWUX91bK93bNYoA8wYr7ukv7l3vB9720PAtHxZEET6L+8Eu94P0slHocgNpwMEVVG8gh4cNJOR98WUn4o4DilftOK3YcU7LjsM6chAhii0KaxTDdnCLTiAdU2rd0/TnnsY1jXBIR277CZiwq5uvAEHQdIzwv30eJDNvvhoxx/3jr1H9T/CDgpHnZl+S/w4vOaIsYciy+At0JYPxI/wPejrNEGWTlW8AAAAASUVORK5CYII=' },
                { 'id': 'enemyBullet', type: "image", 'src': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAzCAMAAADmSHsbAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADAUExURQAAAPg7Mf8AAPuIhv4mEvEiAPo5LvhSTfpxbfdBN/hIP/QjAPkkBvktIvlNRv0mDvlhXP8nAPgpHPp3c/QoAPYkAvkvJfdEPflcV/pqZ/uZl/uko/83APlYU/plY/p8efufnPMjAPqAfv719fy8u/ywr/p7ePyzsvzExPzW1vlkX/uOjfmTk/uFg/uUkvypp/zi4/yrq/3p6fzMy/y3t/zJyPzQzvva2fzBwfkuIvzn5vmSj//6+v3s7Pvd3f///0KsC08AAAA/dFJOUwA6AYsjEjZTcUBJDhwtTSBhBil3ChgwRlxsm6YEWGd/oBWD9r6yfLTF2GOQlYaWquOu6s25ytDbwSvpk/zu3zu53P8AAAJ3SURBVEjHxZbpkqIwFIUFAoisIjsCooKK4oq42+//VnMT7banlxnTNVVzyp/n49wTQ0Kj8Vks2yVi2cYTYtuWLPNEsmy1/8aAO7UVRSdSFDsF5o8P51NFR6apEpkm0pWU/zaGtXgb3AdHEBgiQXAOwNi89SXRlVMFmY7ASJLbInIliREcEymp3P1ietnWid3VNFGMyE/TXILotvypCYyDDg62i5HnGUSeF4kYcQ4IxvrwfF5BqkDsRhH7fhPk+3FhEERQkcK3f5/fxv6WFhkxmDt5Aso7AMVGpLUwYb/vwd79olf44O6XJQcqyz4wfuGJd+KxVlaqH4g/xnZuepoHoPlpymEkJsRBT613BUzn7k+46SzohUS9YDblkjvhmI8alo0cxtWwv89h+yIjWmCE62NCcxkH2dYjQJC0qMD+eW+xGlXDPWhYjVaL3hwTRaRJwmsEa6U4QDR8mAf8WTUcbzd1vdmOh1WGiaTjGyKOSMkeYeVbQNzMuRn4wV5PdqBJDQgQMy5vxrcIslDtFKm3gP40wP7N5Lo8gpbXyQYTwbR/i1BR2r5XJg0SCFhV4F+uLwPQZb0EolpBREJa3GrDRAgmgiWCgHA03IJ/cH4BnQdAbIejECLwQkkCwjORCq7o+Z3y1FtU4/q6HrzcNVhf63G16J3Kju+J7q1El9dVpgUV8nIeZjjgcn4FzhcckYXzMocSLUbV+e4bABWCMNtvdse3AIg47jb7LAygxHdA/RGo/zXw/EhPl6ZeVuo/jnpr0G8+6u1N/QJRv6L0hwD9MUN9kNEfldSHMf1xT3+h0F9Z9Jci/bVLf7HTfzr85OPkB58//1+/AGiZsnGWasLMAAAAAElFTkSuQmCC' },
                { 'id': 'enemyBullet2', type: "image", 'src': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAABUCAMAAAD+pzS+AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADAUExURQAAAP/28P/9/P+CHP+uAP+AMf/9/f+yev9ISP/u4P9mLf/+/v92Gv/////8+f/////+/v////+vAP+vAP+nCP+vAP9ZO/9GP/9ZWP9jKv+GDP////+vBP/+/v/9/f9AOP+rCP+rAv+WAf/+/v/+/v92Fv9JNv9lYv+TB/9EPv+Fg/+sqP/c2/+5mP+6uf+Sj/+gnP86Lv91cf9+D/8/Qf/y8v92G/8xNf/Jx/+ho//Gxf+Ujv9sav+jov9tRf+mZqrmFxcAAABAdFJOUwAZMybKFNAG9g353fl8JmdBkLDnYJDz2fji+e1FvlW4NHf5r6Dab/XRRfXv6B7y8+z69LSb65OF7aXENslm+PdhH7GGAAAG6ElEQVRYw53YC3uayhYGYAFxAOWmCKgIqCAKeMN4SdJ2//9/db41kMRkm8azfdKm8vDOWvPNANpW65uXqrb+w4u9M/ao4H8J6lf/CFMNoXknPMRY3dQ7a6mCwP4Da/1/zPhI50GGH1k03t6pDzGcxBjb1IzeCIb60IIxFBBE4Y1tHsgSheCIbdArLRoTBJX91CYIzhIEqoYhBHpvCD8uOU7DWYJhcKYaG9bCG+ExZoAZnGHNBFEU2KPMMpCpKiJFVbSMnxLBNEQwUSSGf4s1U39iFAZOtCyBM0tAk5b4A+OzElTLDMFQ2UJRwbJE4Ye1hhI3YKaFPMFCYuGr/LcNxih4i6rpeogZEhNVYn/dKbQTMS1BsHQ7FJhB3VqCEYaiYAh/qwYWWoYR2jZVQzZmaIimKQqvm9Y3O4xxZoGJZmKbG5VXC0XrB8Y3hIWWLJ0zHqlphfgjvm7U75nIx7ZCe5GYhkCRIhswcpJ8n8kN00MzmSY6pkkroZumDvstox5E0xB13dST6UK3DAt9kmnYfSXLLWaZG0O3dX1RM4NYYtu2Hlqva/kuQxPyb85sezpd2KEYEsM0E7Dw9/pulzKOSr/RpJ3YScNEzuAwwfsMPTJ5DWZh+EWnA4YdQgxDgOnh+l6XsiSxzfIZDHFwZobYWFj4KZXGZntdS/9ecRk9cBYucF6XMx3VkA6NAbZevrJ/M1STatZpGBoj1ul0pmC/l8v1V4ZprWW2vjyboonRO29MaFii67+XT8vN5nMqTAKTwXRLh7llNEonoWpPy7X0OU3OpCVYyFlJ08HeMCxiNIj9fLlclpIs3zgmvzHbtLvd7qksMR3dNhvWnSbJ89MTyn1iyGO9jtdgiZ6UxE6Yjp3Q4qPFSRdr8hyBUTn2qdjSWYIt9Odrt1uWpw62YmKKFmeTzmL6HEVgMTZuA9lGQrXljLPnX9tTuQVb3LAT1qRm6w+mxjHKLR3ncnl5ibxtWezKU5eYbhFDz53pyy+wC7Jkt2x9OXNWet52u8uvJ0oBF4+VINfrtuwQq8s1jG1iSV4/vbFsW+T59kQpgIVg5T7/YM7brUiOA4nV7ImzfUUM01ng9rAA22XXbsPO59e3lQ4Cua72FL2USlbk2e7aMFOfclacrsSiy/kcbFjDYllegs2iqNgeqiLz85pNsficVftrAeZh6c5OLPPPIGBMXkbn2TKKdjswXyHWpY1v2thZ13y33+Ve5IGdz7OA70s1duLW5uJFYF5VHfIiUyosXM0SsG1eFLuKmBedz8MA+xmJBDOwMx2JvCw7VPvMR1M104kVebFtWHo8Dh0EL7ckZxaARdGRMyXLfT/LixKsY+sLbOyiAsuAvBFnQSxJxGImETtGnqK4fub7VK6LOgkS6Xb3WcNczmbkWjGYHIP1j56nuK4LlVV5geugZpO9XxS5X7NV/4MFcjz0RmCKO9JchbticrqWxCZgu12m0JhfmBQPR6N+31VGYH5FXRaTcl8ubFw0p112nzlgKdjIRTXtD87BXplcdzUrq6aaq3FGjkfiSEE/HR2P6Ts7+PvJNb8uEvRY+H6eE9M4I8fZ8Ja52p+8ZtuqIHbaKUpV+cj4hskt2ekTG6fvjM5RdpNtlr8Qy9FyRoc4a9PkYmK82nwUNUzj51Snwq84yw6K/0e7ZVjoFgvQKljPOx4xM1fruThFyUpiyP+kHCDoIFdtcjWjaoMPprkNy16mCJKzsUZs1efMkTibBWCrd0Yju/527/svyP9KrDemYxrYoN2nRHC9YXJgcy86jkBcnOIqmrLdK0oBVoBpY8568zZn/OHPAlwLw8F8hB1eM6pJ7LDvTMocrDfvoe/ReFCz+qkqzYgN0tEb6/U0TdnvOLtWvAxnFMigPXRqJgdBANZOOUNDPTglzznbYqe5Y2JezfqUY/0IwL7EMCtiGjHAd+ZTjpylpAb94P3ZAdYfDFaje4z3OEe6FD96GsbvDyopcMDaqzRN0eR8/Lkajsx7o1HaJtZ35JvnWzBsc0fVwMYN63I2J5Y2gcQ3T2EWOxRKe9XTejXzq+oLq2fm3H6mIcbLob2auVnmagVnPc7qYp8UwgwolHZ7PtZw1niMe0N26IEVfGrjNF0NMO5Q+vpxJpi1ueuNaHAw/9D7Z9ItDjVbfUnxw/E2sVnQJW4NWc22B3Q9X1GL7WFw75Nh3KSZEnM5O532B5oaZV/v/DsfRMnRBUXBaLjljP/Z//K83hyD9XEPib/5vsLiGa7Dfh8VV7Rl5ikeaMcVTbm+Nr/71oFrb9hHR0hglY7nKR7WCHgAFMt//UolBTNIevHoZhilPfxmVp+SoeuBKGf4TZXYA1+8sbEd7ugmxe/B7NH/avnp9T8TaxDIJB4uUAAAAABJRU5ErkJggg==' },
                { 'id': 'playerBullet', type: "image", 'src': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAA5CAMAAAB6QTkbAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADAUExURQAAAHV1/4KC/4GB/4SE/3t7/4KC/39//3x2/4R//31//3h4/19//1VV/3d3/3x8/4OC/3x8/4CA/35+/4CA/4F9/4CA/3x3/35+/4OB/319/4GB/35+/397/3p6/35+/3p//3l5/4OD/4CA/4GB/39//4CA/3p6/35+/4KC/3h4/3+C/4CA/////4uM/4WF/5GR/87O/7+//7e3/6+v/6am/5qa//Hx/8bG/9nY/5WW/6Kh/+Dh/+Xl/9LS/+Tl/9sIMrcAAAAtdFJOUwANfZZLI2QYKTKeEwgDHlTIXHWR/DvzL2mvgtuJRhtvNkPhp7/S5k1jrpa4t7Od768AAAJrSURBVEjHfdbnktowFAXgdRdy7xWbXnYXF5bOJnn/t4qcmUx0M1ecX9J8R2CMbfntjcWJY+ftRXiX5lk2l8Rd4CRIkoaIy7zb2+5wiLa2qAvcfL8eDod3U1QGTno2PvTC4wDuH8fJzReVebfpwL7m+pMKDhq4VQ4/rtdfQ2nhZeB1d7t/f99vnYGXgaftcbjfh2Of4mXgbvt1G4bbV+/iZeBZfzqynPoMLwOv2vMXy7mt8DLvdtg9TyzPLkTPHXCJRpczyyWi6LkDLr0n/eX5vPSJgl6lwA2atI/L5dEmFL2UgNd007WPR9ttKPqvAHdoGbUsUUnRWwu4pqyTqOuiZK1oWBk4Cb1NxLLxQvSKBk6qVblJkk25qvAy72nxuV6wrD8KtAycFHuvXCxKb1+gxwxck5crb732VksZ/4G8awH99Fg+aYCXedcaZb/yvFWuNHiZdy0Ll/nHR74MM7zMu7ar6D7Pc1rt8DLvjl8oyzxfKoWP/928O24QKpQqYeDiZd7ZpFJYqsCtBeV/bmwbmY1DuVHRSxS4MdflIgwLOZvjZd7NWA9klsCP0TsFuBT72TjJ/Bi/B3mXZu64NNDdGV7mXUq3O71pdF1N8TLvFpn6OouvEvS5Adwic3fHJu5cVObc1mLVHxfGGv74Au7MVNV1VXUm2GSBG+lUZZlOBE9+4GYaj5M4FWyEwCUymY4LiWD3Bi5pk9l0Optogt0KuFWnkzG1aGvj3TbIOCaGaNMEbjrjxBFv9LxL41JiCN9OgFtGTUhtWKIycNv4E/HLCXBzHJvi1x7g1jixxGXo5ssP/s9t07Rflf/6b8UFZvtsvS+kAAAAAElFTkSuQmCC' },
                { 'id': 'enemyExplode', type: "image", 'src': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADAUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wOj5kwAAAA/dFJOUwDKVPS7aUSqIJ8ItH8w7dV2bpX6v+vZ3QuGEF47UFo/eqTDxeDPkNOCFmRLmRsmjugzizWSK+RWHeLvuLB8AriPrCYAAAOGSURBVEjHpZdpk6IwEIaFAImcgkHkUATBA0TF+xz+/7/aRma3drbUma30h5kP1lP99tuh02m1XkWfaCXPlxrpt/4vTryKqWFXELZBscqffkp6vGVUXYQuug2hXxDqVobFez9AiUqB1NfnxHF6EI6TnNc28FQl36B9kVZAJj0j5ThuDAH/UqOXrHVUUfFt+QGukH12gIypcFUecRVoDLxztlGFg9esanT1gzPlYkG5YRxFbYgowvimCDE3dQ5611ZfSbYqtK7R6w1H7YW1m6wgJjtr0Y7w7Vrja1RZT6UT3L0cemks3HB7sdu4M/U+grirM3ezW7TxTYjT3uHSxeQpqycGRxXctlbubNQxTVHMMlE0zc5o5q6sNlYoZyT6E7pfs9OxcIsWE1ftmGLmD488xHHoZ6LZUd3JIroJ42lN/6vcerBXSLsBNPOPg1ySpDCEP/ng6GeAbyD59UFb//hcXRp24o7MbAhkGGy1R2yDEPhhZo7cSUNfqi+eBwY6GA921hF9PpeCcr8k5FQUJ0KW+zKQct4XO7MHbRyQHXwpeN3jhIYdDqRAW5Ji7vVliL43L8hSC6TBsKEFrrf+u2yx0p2U3moWJIfbPZl78sfvXz9kb0722xCk1/SNpo5eiX+6RNFhGiuR5ULePCyXhSd/tUT2imUZ5pDbtSIlnh4QJX/csh0QvdiMQHOokfmTQ9SfEw1yi6PNohZu//bMo+g8jUG0avqDsCRz+dkBlOekDAe+qYLweHpGtPm+eaiYu2IQnfHSdvmcrenlVuIzEI6vHFTNf56PtQGJV6o5zIN98fKb7Rf7IB+a9xWkNtbNSTkZKEmhYkg8kDTyZtp4RJMGkBqqThNknBrVPU6JdjPTz4OXoj+FB7lvznaRUltW61Yb1WD1USrJ2zHnkVI6guGN7tpvjM4pbVSH+0J+B8vFPmx00/SMMNhAUQJNtj5Vf7yDPz51W9DqBNF+ixgXaFS0A6+lLflmOHtkKw1NdRdBsy42aWk2dFmJJnco+durBa4gKPq+qh3TK621BbPHSns1EnlJO8nvYfmkSbw4WrWVMdhdQqfsBs74UCu+gwst5LPa7rFR94oJZpLNZBhTq5gOCdPxZPswmD5JpmHANIbYBiDT6GUa+mzXDdNFx3bFMl3ubGsF20LDtkoxLXFs6yPb4sq2MjMu62zPBLYHCuPTiPFR9vPn4C+vX9gx3jof+AAAAABJRU5ErkJggg==' },
                { 'id': 'playerExplode', type: "image", 'src': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADAUExURQAAAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wOj5kwAAAA/dFJOUwDKVPS7aUSqIJ8ItH8w7dV2bpX6v+vZ3QuGEF47UFo/eqTDxeDPkNOCFmRLmRsmjugzizWSK+RWHeLvuLB8AriPrCYAAAOGSURBVEjHpZdpk6IwEIaFAImcgkHkUATBA0TF+xz+/7/aRma3drbUma30h5kP1lP99tuh02m1XkWfaCXPlxrpt/4vTryKqWFXELZBscqffkp6vGVUXYQuug2hXxDqVobFez9AiUqB1NfnxHF6EI6TnNc28FQl36B9kVZAJj0j5ThuDAH/UqOXrHVUUfFt+QGukH12gIypcFUecRVoDLxztlGFg9esanT1gzPlYkG5YRxFbYgowvimCDE3dQ5611ZfSbYqtK7R6w1H7YW1m6wgJjtr0Y7w7Vrja1RZT6UT3L0cemks3HB7sdu4M/U+grirM3ezW7TxTYjT3uHSxeQpqycGRxXctlbubNQxTVHMMlE0zc5o5q6sNlYoZyT6E7pfs9OxcIsWE1ftmGLmD488xHHoZ6LZUd3JIroJ42lN/6vcerBXSLsBNPOPg1ySpDCEP/ng6GeAbyD59UFb//hcXRp24o7MbAhkGGy1R2yDEPhhZo7cSUNfqi+eBwY6GA921hF9PpeCcr8k5FQUJ0KW+zKQct4XO7MHbRyQHXwpeN3jhIYdDqRAW5Ji7vVliL43L8hSC6TBsKEFrrf+u2yx0p2U3moWJIfbPZl78sfvXz9kb0722xCk1/SNpo5eiX+6RNFhGiuR5ULePCyXhSd/tUT2imUZ5pDbtSIlnh4QJX/csh0QvdiMQHOokfmTQ9SfEw1yi6PNohZu//bMo+g8jUG0avqDsCRz+dkBlOekDAe+qYLweHpGtPm+eaiYu2IQnfHSdvmcrenlVuIzEI6vHFTNf56PtQGJV6o5zIN98fKb7Rf7IB+a9xWkNtbNSTkZKEmhYkg8kDTyZtp4RJMGkBqqThNknBrVPU6JdjPTz4OXoj+FB7lvznaRUltW61Yb1WD1USrJ2zHnkVI6guGN7tpvjM4pbVSH+0J+B8vFPmx00/SMMNhAUQJNtj5Vf7yDPz51W9DqBNF+ixgXaFS0A6+lLflmOHtkKw1NdRdBsy42aWk2dFmJJnco+durBa4gKPq+qh3TK621BbPHSns1EnlJO8nvYfmkSbw4WrWVMdhdQqfsBs74UCu+gwst5LPa7rFR94oJZpLNZBhTq5gOCdPxZPswmD5JpmHANIbYBiDT6GUa+mzXDdNFx3bFMl3ubGsF20LDtkoxLXFs6yPb4sq2MjMu62zPBLYHCuPTiPFR9vPn4C+vX9gx3jof+AAAAABJRU5ErkJggg==' }
            ];

            loader.addEventListener("fileload", this._fileLoadHandler);
            loader.addEventListener("complete", this._completeHandler);
            loader.loadManifest(manifest);
        };
        Preload.SOUND_NAME = ['alert', 'loop', 'shot', 'shot2', 'boss', 'explode', 'clear'];
        return Preload;
    })();
    game.Preload = Preload;
})(game || (game = {}));
//# sourceMappingURL=preload.js.map

var game;
(function (game) {
    var Util = (function () {
        function Util() {
        }
        Util._getRndNum = function (min, max) {
            return ~~(Math.random() * (max - min + 1)) + min;
        };

        Util._isCollision = function (obj1, obj2) {
            var aW = obj1.getWidth(), aH = obj1.getHeight(), aX = ~~(obj1.x - aW / 2), aY = ~~(obj1.y - aH / 2), bW = obj2.getWidth(), bH = obj2.getHeight(), bX = ~~(obj2.x - bW / 2), bY = ~~(obj2.y - bH / 2);

            return ((aX < bX + bW) && (bX < aX + aW) && (aY < bY + bH) && (bY < aY + aH));
        };
        return Util;
    })();
    game.Util = Util;
})(game || (game = {}));
//# sourceMappingURL=util.js.map

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

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var game;
(function (game) {
    (function (view) {
        var Boss2 = (function (_super) {
            __extends(Boss2, _super);
            function Boss2(controller, assets) {
                _super.call(this, assets['boss']);
                this._bmpList = {};
                this._vital = view.Boss.MAX_VITAL;

                this._controller = controller;
                this._stage = controller.getStage();
                this._assets = assets;
            }
            Boss2.prototype.setPos = function () {
                this.x = this._stage.canvas.width / 2;
                this.y = 0;
            };

            Boss2.prototype.move = function () {
                var that = this;

                createjs.Tween.get(this).to({ y: this.y + 300 }, 1500, createjs.Ease.linear).call(function () {
                    createjs.Tween.get(that, { loop: true }).call(that._moveRandom).wait(3000 + game.Util._getRndNum(-500, 500));
                });

                createjs.Tween.get(this, { loop: true }).wait(game.Util._getRndNum(1500, 3000)).call(this._shoot);
            };

            Boss2.prototype.remove = function () {
                createjs.Tween.removeTweens(this);
                this._explode();
                this._stage.removeChild(this);
            };

            Boss2.prototype.damage = function () {
                if (this._vital === 0) {
                    return;
                }

                this._vital--;
                this._blink();
            };

            Boss2.prototype.getVital = function () {
                return this._vital;
            };

            Boss2.prototype._moveRandom = function () {
                createjs.Tween.get(this).to({ x: game.Util._getRndNum(220, 420), y: game.Util._getRndNum(180, 380) }, 2000, createjs.Ease.cubicOut);
            };

            Boss2.prototype._shoot = function () {
                var img = (game.Util._getRndNum(0, 1) === 0) ? this._assets['bossBullet'] : this._assets['enemyBullet'], bullet;

                for (var i = Boss2.BULLET_NUM; i--;) {
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

            Boss2.prototype._blink = function () {
                createjs.Tween.get(this).set({ visible: false }).wait(100).set({ visible: true });
            };

            Boss2.prototype._explode = function () {
                var that = this, img = this._assets['enemyExplode'], explode = new createjs.Bitmap(img);

                this._controller.addPoint(Boss2.POINT);
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
            Boss2.BULLET_NUM = 20;
            Boss2.POINT = 20000;
            Boss2.MAX_VITAL = 100;
            return Boss2;
        })(view.base.Airplane);
        view.Boss2 = Boss2;
    })(game.view || (game.view = {}));
    var view = game.view;
})(game || (game = {}));
//# sourceMappingURL=boss2.js.map

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
