/// <reference path="../libs/easeljs/easeljs.d.ts" />
/// <reference path="../view/player.ts" />
/// <reference path="../view/bullet.ts" />

module game.model {

  /**
   * AppModel Class.
   *
   * @class
   * @name AppModel
   */
  export class AppModel {

    private _assets: Object = {};
    private _playerBulletAry: view.Bullet[] = [];
    private _enemyBulletAry: view.Bullet[] = [];
    private _point: number = 0;

    /**
     * コンストラクタ.
     *
     * @constructor
     */
    constructor() {

    }

    // ==========================================
    //   Public
    // ==========================================

    /**
     * インスタンスメンバを破棄する.
     */
    public destroy() {

      this._playerBulletAry = [];
      this._enemyBulletAry = [];
      this._point = 0;
    }

    /**
     * 画像アセットをセットする.
     *
     * @param {Object} assets アセット
     */
    public setAssets(assets: Object) {

      this._assets = assets;
    }

    /**
     * 画像アセットを取得する.
     *
     * @param {Array} ary 画像の名前の配列
     */
    public getAssets(ary: string[]): Object {

      var result: Object = {},
          str: string;

      for(var i = ary.length; i--;) {
        str = ary[i];
        result[str] = this._assets[str];
      }

      return result;
    }

    /**
     * プレイヤーの弾を配列に追加する.
     *
     * @param {game.view.Bullet} bullet 弾
     */
    public addPlayerBullet(bullet: view.Bullet) {

      this._playerBulletAry.push(bullet);
    }

    /**
     * プレイヤーの弾を配列から削除する.
     *
     * @param {game.view.Bullet} index インデックス
     */
    public removePlayerBullet(index) {

      var bullet: view.Bullet = this._playerBulletAry[index];

      if(bullet !== undefined) {

        bullet.remove();
        this._playerBulletAry.splice(index, 1);
      }
    }

    /**
     * プレイヤーの弾を取得する.
     *
     * @return {Array} 弾の配列
     */
    public getPlayerBullet(): view.Bullet[] {

      return this._playerBulletAry;
    }

    /**
     * 敵の弾を配列に追加する.
     *
     * @param {game.view.Bullet} bullet 弾
     */
    public addEnemyBullet(bullet: view.Bullet) {

      this._enemyBulletAry.push(bullet);
    }

    /**
     * 敵の弾を配列から削除する.
     *
     * @param {game.view.Bullet} index インデックス
     */
    public removeEnemyBullet(index) {

      var bullet: view.Bullet = this._enemyBulletAry[index];

      if(bullet !== undefined) {

        bullet.remove();
        this._enemyBulletAry.splice(index, 1);
      }
    }

    /**
     * 敵の弾を取得する.
     *
     * @return {Array} 弾の配列
     */
    public getEnemyBullet(): view.Bullet[] {

      return this._enemyBulletAry;
    }

    /**
     * 全ての弾を削除する.
     */
    public removeAllBullet() {

      for(var i = this._playerBulletAry.length; i--;) {

        this._playerBulletAry[i].remove();
      }

      for(var i = this._enemyBulletAry.length; i--;) {

        this._enemyBulletAry[i].remove();
      }

      this._playerBulletAry = [];
      this._enemyBulletAry = [];
    }

    /**
     * 得点を追加する.
     *
     * @return {number} point 得点
     */
    public addPoint(point: number) {

      this._point += point;
    }

    /**
     * 得点を取得する.
     *
     * @return {number} 得点
     */
    public getPoint(): number {

      return this._point;
    }
  }
}