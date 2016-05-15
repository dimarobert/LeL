
(function () {
    'use strict';


    angular
        .module('courses')
        .controller('CoursesManageController', CoursesManageController);

    CoursesManageController.$inject = ['CoursesService', 'Authentication', '_'];

    function CoursesManageController(CoursesService, Authentication, _) {
        var vm = this;

        vm.user = Authentication.user;

        vm.courses = CoursesService.query();

        vm.canEdit = function () {
            return _.intersection(['teacher', 'admin'], vm.user.roles).length;
        };

        vm.remove = function (course) {
            CoursesService
                .remove({ courseId: course._id })
                .$promise
                .then(function () {
                    vm.courses.$refresh();
                })
                .catch(function (err) {
                    debugger;
                });
        }
    }
})();
