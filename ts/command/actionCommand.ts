/// <reference path="../controller/appController.ts" />

module game.command {

  /**
   * ActionCommand Class.
   *
   * @class
   * @name ActionCommand
   */
  export class ActionCommand {

    static APPEAR_ENEMY1: string = 'appearEnemy1';
    static APPEAR_ENEMY2: string = 'appearEnemy2';
    static APPEAR_ENEMY3: string = 'appearEnemy3';
    static APPEAR_BOSS: string = 'appearBoss';

    private _controller: controller.AppController;
    private _commandAry: {command: string; time: number;}[] = [];
    private _time: number = 0;

    /**
     * コンストラクタ.
     *
     * @constructor
     * @param {game.controller.AppController} controller コントローラー
     */
    constructor(controller: controller.AppController) {

      this._controller = controller;
    }

    // ==========================================
    //   Public
    // ==========================================

    /**
     * コマンドを追加する.
     *
     * @param {Object} command コマンド
     */
    public addCommand(command: {command: string; time: number;}) {

      this._commandAry.push(command);
    }

    /**
     * ゲーム時間を経過させる.
     */
    public addTime() {

      this._time++;
      this._checkCommand();
    }

    /**
     * インスタンスメンバを破棄する.
     */
    public destroy() {

      this._commandAry = [];
      this._time = 0;
    }

    // ==========================================
    //   Private
    // ==========================================

    /**
     * 登録したコマンドを実行する時間か確認する.
     */
    private _checkCommand() {

      var command: {command: string; time: number;},
          len = this._commandAry.length;

      if(len === 0) {

        return;
      }

      for(var i = len; i--;) {

        command = this._commandAry[i];

        if(this._time >= command['time']) {

          this._controller.runCommand(command['command']);
          this._commandAry.splice(i, 1);
          break;
        }
      }
    }
  }
}