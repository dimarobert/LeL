(function () {
    'use strict';

    // Courses controller
    angular
        .module('courses')
        .controller('ViewChapterController', CoursesController);

    CoursesController.$inject = ['$scope', '$state', '$stateParams', 'Authentication', 'courseResolve'];

    function CoursesController($scope, $state, $stateParams, Authentication, course) {
        var vm = this;

        vm.authentication = Authentication;
        vm.course = course;
        vm.error = null;

    };
})();
