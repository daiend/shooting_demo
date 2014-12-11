module game {

  /**
   * Util Class.
   *
   * @class
   * @name Util
   */
  export class Util {

    /**
     * コンストラクタ.
     *
     * @constructor
     */
    constructor() {

    }

    /**
     * ランダムな数値を取得する.
     *
     * @param {number} min 最小値
     * @param {number} max 最大値
     */
    static _getRndNum(min: number, max: number): number {

      return ~~(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 衝突しているかを判定する.
     *
     * @param {any} obj1 オブジェクト1
     * @param {any} obj2 オブジェクト2
     */
    static _isCollision(obj1: any, obj2: any): boolean {

      var aW: number = obj1.getWidth(),
          aH: number = obj1.getHeight(),
          aX: number = ~~(obj1.x - aW / 2),
          aY: number = ~~(obj1.y - aH / 2),
          bW: number = obj2.getWidth(),
          bH: number = obj2.getHeight(),
          bX: number = ~~(obj2.x - bW / 2),
          bY: number = ~~(obj2.y - bH / 2);

      return ((aX < bX + bW) && (bX < aX + aW) && (aY < bY + bH) && (bY < aY + aH));
    }
  }
}
