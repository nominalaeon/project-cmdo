(() => {

    'use strict';

    angular.module('projectCmdo')
        .factory('userFactory', userFactory);

    userFactory.$inject = ['$rootScope', '_'];

    function userFactory($rootScope, _) {

        class UserFactory {
            constructor(user) {
                this._user = {};
            }

            get isSet() {
                return this._user.isSet || false;
            }
            set isSet(isSet) {
                this._user.isSet = isSet;
            }

            get x() {
                return this._user.x || 0;
            }
            set x(x) {
                this._user.x = x;
            }

            get y() {
                return this._user.y || 0;
            }
            set y(y) {
                this._user.y = y;
            }
        }

        return new UserFactory();
    }

})();