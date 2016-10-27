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

    MapController.$inject = ['$element', '$timeout', '_', 'tilesFactory'];

    function MapController($element, $timeout, _, tilesFactory) {

        console.log('MapController');
        var map = this;

        _.extend(map, {
            onChangeDimension: onChangeDimension,
            onClickSubmit: onClickSubmit,
            onFocusDimension: onFocusDimension,

            cols: 16,
            name: 'TILES',
            rows: 16,
            tiles: tilesFactory
        });

        init();

        function init() {
            map.tiles.renderTiles({
                x: map.cols,
                y: map.rows
            });

            $timeout(setMap);
        }

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

        function onClickSubmit() {
            map.cols = map.cols > 16 ? 16 : map.cols;
            map.rows = map.rows > 16 ? 16 : map.rows;

            $element.addClass('map--hidden');

            init();
        }

        function onFocusDimension(id) {
            $element.find('#' + id).select();
        }

        function setHeights() {
            var $cells = $element.find('.map-row__cell');
            var height = 0;

            $cells.each(_setHeight);

            function _setHeight(index, cell) {
                if (!height) {
                    height = $(cell).outerWidth();
                }
                $(cell).outerHeight(height);
            }
        }

        function setMap() {
            setHeights();
            $element.removeClass('map--hidden');
        }
    }

})();