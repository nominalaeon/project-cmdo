(() => {

    'use strict';

    angular.module('projectCmdo')
        .factory('userFactory', userFactory);

    userFactory.$inject = ['$rootScope', '_'];

    function userFactory($rootScope, _) {

        const TROOPERCOUNT = 9;

        class UserFactory {
            constructor(user) {
                this._user = {};

                this.createTroopers();
            }

            get isSet() {
                return this._user.isSet || false;
            }
            set isSet(isSet) {
                this._user.isSet = isSet;
            }

            get moves() {
                return this._user.moves || 0;
            }
            set moves(moves) {
                if (!_.isNumber(moves)) {
                    return;
                }

                if (moves % 2 === 0 && moves > 3) {
                    this.troopers.pop();
                }

                this._user.moves = moves;
            }

            get troopers() {
                return this._user.troopers || [];
            }
            set troopers(troopers) {
                this._user.troopers = troopers;
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

            createTroopers() {
                var troopers = [];
                for (let i = 0; i < TROOPERCOUNT; i++) {
                    troopers.push({
                        health: 3
                    });
                }
                this.troopers = troopers;
            }
        }

        return new UserFactory();
    }

})();