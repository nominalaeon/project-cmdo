(() => {

    'use strict';

    angular.module('projectCmdo.utils')
        .factory('_', lodashFactory);

    lodashFactory.$inject = ['$window'];

    function lodashFactory($window) {
        var _ = $window._;

        delete $window._; // remove second Lodash library

        return (_);
    }

})();