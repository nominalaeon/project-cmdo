(() => {

    'use strict';

    angular.module('projectCmdo.components')
        .directive('map', mapDirective);

    function mapDirective() {
        var directive = {
            restrict: 'A',
            replace: true,
            templateUrl: 'templates/components/map/map.tmpl.html',
            controller: MapController,
            controllerAs: 'map'
        };

        return directive;
    }

    MapController.$inject = ['$element', '$rootScope', '$timeout', '_', 'tilesFactory', 'userFactory'];

    function MapController($element, $rootScope, $timeout, _, tilesFactory, userFactory) {

        var map = this;

        _.extend(map, {
            onChangeDimension: onChangeDimension,
            onClickSubmit: onClickSubmit,
            onClickTile: onClickTile,
            onFocusDimension: onFocusDimension,

            $cells: [],
            $rows: [],

            cols: 12,
            rows: 12,
            tiles: tilesFactory
        });

        init();

        function init() {
            map.tiles.renderTiles({
                x: map.cols,
                y: map.rows
            });

            $timeout(initMap);
        }

        function initMap() {
            setHeights();

            $element.removeClass('map--hidden');

            $rootScope.$broadcast('readyMap');
        }

        ////

        function onChangeDimension() {
            if (map.cols > 16) {
                console.warn(map.cols + ' Columns? Did you mean "16"?');
                map.cols = 16;
            }
            if (map.rows > 16) {
                console.warn(map.rows + ' Rows? Did you mean "16"?');
                map.rows = 16;
            }
        }

        function onClickTile(tile) {
            var deltaX = userFactory.x - tile.x;
            var deltaY = userFactory.y - tile.y;

            if (deltaX < -1 || deltaX > 1 ||
                deltaY < -1 || deltaY > 1) {
                return;
            }

            $rootScope.$broadcast('onClickTile', {
                tile: tile
            });
        }

        function onClickSubmit() {
            map.$cells = [];
            map.$rows = [];

            map.cols = map.cols > 16 ? 16 : map.cols;
            map.rows = map.rows > 16 ? 16 : map.rows;

            $element.addClass('map--hidden');

            init();
        }

        function onFocusDimension(id) {
            $element.find('#' + id).select();
        }

        function setHeights() {
            map.$rows = $element.find('.map-row');

            map.$rows.each((index, row) => {
                map.$cells[index] = $(row).find('.map-row__cell');
                map.$cells[index].each(_setTile.bind(this, index));

                map.tiles.height = $element.outerHeight();
                map.tiles.width = $element.outerWidth();
            });

            function _setTileSize($cell) {
                if (!map.tiles.tileSize) {
                    map.tiles.tileSize = $cell.outerWidth();
                }

                $cell.outerHeight(map.tiles.tileSize);
                $cell.outerWidth(map.tiles.tileSize);
            }

            function _setTile(rowIndex, cellIndex, cell) {
                _setTileSize($(cell));

                tilesFactory.rows[rowIndex][cellIndex].$root = $(cell);
            }
        }
    }

})();