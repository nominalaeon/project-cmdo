(() => {

    'use strict';

    angular.module('projectCmdo.components')
        .directive('user', userDirective);

    function userDirective() {
        var directive = {
            restrict: 'A',
            replace: true,
            templateUrl: 'templates/components/user/user.tmpl.html',
            controller: UserController,
            controllerAs: 'user'
        };

        return directive;
    }

    UserController.$inject = ['$element', '$rootScope', '$timeout', '_', 'tilesFactory', 'userFactory'];

    function UserController($element, $rootScope, $timeout, _, tilesFactory, userFactory) {

        var user = this;

        _.extend(user, {

        });

        var stopInitListener = $rootScope.$on('readyMap', init);
        var stopTileListener = angular.noop;

        function init() {
            stopInitListener();

            /** set start position */
            userFactory.x = tilesFactory.grid.x - 2; // starts at the end of the map, on the Beach
            userFactory.y = Math.floor((tilesFactory.grid.y - 1) / 2); // starts halfway down the Beach

            setDimensions();
            setPosition();
            setVisibility();

            bindEvents();

            $rootScope.$broadcast('readyUser');
        }

        function bindEvents() {
            userFactory.isSet = true;

            stopInitListener = $rootScope.$on('readyMap', reInit);
            stopTileListener = $rootScope.$on('onClickTile', onClickTile);
        }

        function onClickTile(event, args) {
            userFactory.x = args.tile.x;
            userFactory.y = args.tile.y;
            reInit();
        }

        function reInit() {
            stopInitListener();
            stopTileListener();

            userFactory.isSet = false;

            $element.outerHeight(0);
            $element.outerWidth(0);

            setDimensions();
            setPosition();
            setVisibility();

            bindEvents();
        }

        function setDimensions() {
            $element.outerHeight(tilesFactory.tileSize);
            $element.outerWidth(tilesFactory.tileSize);
        }

        function setPosition() {
            $element.css({
                top: tilesFactory.tileSize * userFactory.y,
                left: tilesFactory.tileSize * userFactory.x
            });
        }

        function setVisibility() {
            tilesFactory.resetVisibility();
            tilesFactory.toggleVisibility({
                x: userFactory.x,
                y: userFactory.y
            });
        }

    }

})();