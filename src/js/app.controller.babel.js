(() => {

    'use strict';

    angular.module('projectCmdo')
        .controller('ProjectCmdoController', ProjectCmdoController);

    ProjectCmdoController.$inject = ['_'];

    function ProjectCmdoController(_) {
        var cmdo = this;

        _.extend(cmdo, {
            name: 'Project Commando'
        });
    }

})();