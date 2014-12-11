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
