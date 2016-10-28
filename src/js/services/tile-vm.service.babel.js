(() => {

    'use strict';

    angular.module('projectCmdo')
        .service('tileService', tileService);

    tileService.$inject = ['_'];

    function tileService(_) {

        this.createTile = (options) => {
            return new TileVM(options);
        };

        class TileVM {
            constructor(tile) {
                this._tile = {};

                for (var prop in tile) {
                    if (!tile.hasOwnProperty(prop)) {
                        continue;
                    }
                    this[prop] = tile[prop];
                }
            }

            get $root() {
                return this._tile.$root || $('');
            }
            set $root($root) {
                this._tile.$root = $root;
            }

            get elevation() {
                return this._tile.elevation || 0;
            }
            set elevation(elevation) {
                this._tile.elevation = elevation;
            }

            get isVisible() {
                return this._tile.isVisible || false;
            }
            set isVisible(isVisible) {
                this._tile.isVisible = isVisible;
            }

            get x() {
                return this._tile.x || 0;
            }
            set x(x) {
                this._tile.x = x;
            }

            get y() {
                return this._tile.y || 0;
            }
            set y(y) {
                this._tile.y = y;
            }
        }
    }

})();