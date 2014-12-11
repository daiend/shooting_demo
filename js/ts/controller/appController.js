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
