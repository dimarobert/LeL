(function () {
    'use strict';

    // Courses controller
    angular
        .module('courses')
        .controller('ViewChapterController', ViewChapterController);

    ViewChapterController.$inject = ['$scope', '$state', '$stateParams', 'Authentication', 'courseResolve'];

    function ViewChapterController($scope, $state, $stateParams, Authentication, course) {
        var vm = this;

        vm.authentication = Authentication;
        vm.course = course;
        vm.error = null;

        (function () {
            vm.categoryId = $stateParams.categoryId;
            vm.chapterId = $stateParams.chapterId;
            vm.chapter = vm.course.categories[vm.categoryId].chapters[vm.chapterId];
        })();
    };
})();
