(() => {

    'use strict';

    angular.module('projectCmdo')
        .factory('tilesFactory', tilesFactory);

    tilesFactory.$inject = ['$rootScope', '_', 'tileService'];

    function tilesFactory($rootScope, _, tileService) {

        class TilesFactory {
            constructor(tiles) {
                this._tiles = {};
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

            get height() {
                return this._tiles.height || 0;
            }
            set height(height) {
                this._tiles.height = height;
            }

            get rows() {
                return this._tiles.rows || [];
            }
            set rows(rows) {
                this._tiles.rows = rows;
            }

            get tiles() {
                return _.flatten(this.rows);
            }

            get tileSize() {
                return this._tiles.tileSize || 0;
            }
            set tileSize(tileSize) {
                this._tiles.tileSize = tileSize;
            }

            get userTile() {
                return this._tiles.userTile || tileService.createTile();
            }
            set userTile(userTile) {
                this._tiles.userTile = userTile;
            }

            get width() {
                return this._tiles.width || 0;
            }
            set width(width) {
                this._tiles.width = width;
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

            resetVisibility() {
                this.tiles.forEach((tile) => {
                    tile.isVisible = false;
                });
            }

            toggleVisibility(position) {
                this.userTile = _.find(this.tiles, {
                    x: position.x,
                    y: position.y
                });

                this.tiles.forEach(_isVisible.bind(this));

                function _isVisible(tile) {
                    var delta = {
                        e: tile.elevation - this.userTile.elevation,
                        x: tile.x - this.userTile.x,
                        y: tile.y - this.userTile.y
                    };

                    var isFar = delta.x < -2 || delta.x > 2 || delta.y < -2 || delta.y > 2;
                    var isHigh = delta.e < -1 || delta.e > 1;
                    var isNear = delta.x < 2 && delta.x > -2 && delta.y < 2 && delta.y > -2;

                    console.log(tile.x, tile.y, !isFar, !isHigh, isNear, delta);
                    tile.isVisible = (!isFar && !isHigh) || isNear;
                }
            }
        }

        return new TilesFactory();
    }

})();