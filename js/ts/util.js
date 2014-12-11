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
