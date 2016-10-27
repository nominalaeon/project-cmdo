(() => {

    'use strict';

    angular.module('projectCmdo')
        .factory('tilesFactory', tilesFactory);

    tilesFactory.$inject = ['$rootScope', '_', 'tileService'];

    function tilesFactory($rootScope, _, tileService) {

        class TilesFactory {
            constructor(tiles) {
                this._tiles = {};

                for (var prop in tiles) {
                    if (!tiles.hasOwnProperty(prop)) {
                        continue;
                    }
                    this[prop] = tiles[prop];
                }
            }

            get count() {
                return this.grid.x * this.grid.y;
            }

            get grid() {
                return this._tiles.grid || {
                    x: 0,
                    y: 0
                };
            }
            set grid(grid) {
                this._tiles.grid = {
                    x: grid && grid.x ? parseInt(grid.x) : 0,
                    y: grid && grid.y ? parseInt(grid.y) : 0
                };
            }

            get rows() {
                return this._tiles.rows || [];
            }
            set rows(rows) {
                this._tiles.rows = rows;
            }

            get tiles() {
                return this._tiles.tiles || [];
            }
            set tiles(tiles) {
                this._tiles.tiles = tiles;
            }

            renderTiles(grid) {
                this.grid = grid;

                if (this.count <= 0) {
                    console.error('Invalid map definition:', this.grid);
                    return;
                }

                var BEACH = this.grid.x - 2;
                var JUNGLE = this.grid.x - 3;
                var OCEAN = this.grid.x - 1;
                var MIN = 2;
                var MAX = 5;
                var elevation = MIN;
                var peaks = 0;
                var rows = [];

                for (var rowIndex = 0; rowIndex < this.grid.y; rowIndex++) {

                    rows[rowIndex] = [];

                    for (var cellIndex = 0; cellIndex < this.grid.x; cellIndex++) {
                        var tile = tileService.createTile({
                            elevation: _getElevation(cellIndex, rowIndex),
                            x: cellIndex,
                            y: rowIndex
                        });

                        rows[rowIndex].push(tile);
                    }

                    /**
                     * Reset elevation to row's first cell's elevation
                     * so that next row uses its Northern sibling's elevation
                     * to start the calculations for its cells
                     */
                    elevation = rows[rowIndex][0].elevation;
                }

                this.rows = rows;

                function _getElevation(cell, row) {
                    /**
                     * random cell can be Peak(4)
                     * cell 7 is Beach(1)
                     * cell 8 is Ocean(0)
                     */

                    if (cell > JUNGLE) {
                        return cell === BEACH ? 1 : 0;
                    }

                    var deltas = [0];

                    if (row > 0 && cell > 0) {
                        elevation = Math.floor((rows[row - 1][cell].elevation + rows[row][cell - 1].elevation) / 2);
                    }

                    if (elevation > MIN) {
                        deltas.push(-1);
                    }
                    if (elevation < MAX && peaks < 2) {
                        deltas.push(1);
                    }
                    if (elevation < MAX - 2 && peaks < 2) {
                        deltas.push(2);
                        deltas.pop(); // pull off the 0 delta for a greater chance to hit the 2 delta
                    }

                    elevation = elevation + _.sample(deltas);
                    peaks = elevation === MAX ? peaks++ : peaks;

                    return elevation;
                }
            }
        }

        return new TilesFactory();
    }

})();