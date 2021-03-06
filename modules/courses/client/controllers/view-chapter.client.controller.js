(function () {
    'use strict';

    // Courses controller
    angular
        .module('courses')
        .controller('ViewChapterController', ViewChapterController);

    ViewChapterController.$inject = ['$scope', '$state', '$stateParams', 'Authentication', 'UserCourses', 'courseResolve'];

    function ViewChapterController($scope, $state, $stateParams, Authentication, UserCourses, course) {
        var vm = this;

        vm.authentication = Authentication;
        vm.course = course;
        vm.error = null;
        vm.filterLessons = filterLessons;

        vm.hasUserDoneIt = hasUserDoneIt;
        vm.getLessonClass = getLessonClass;
        vm.getLabelClass = getLabelClass;

        (function () {
            vm.categoryId = $stateParams.categoryId;
            vm.chapterId = $stateParams.chapterId;
            vm.chapter = vm.course.categories[vm.categoryId].chapters[vm.chapterId];

            UserCourses.query().$promise
                .then(function (r) {
                    vm.userCourse = r.find(function (c) { return vm.course._id == c.course; });
                });

        })();

        function filterLessons(el, idx) {
            return el.questions.length;
        }

        function hasUserDoneIt(lesson) {
            if (vm.userCourse)
                return vm.userCourse.finishedLessons.find(function (l) { return lesson._id == l.id; });
            return null;
        }

        function getLessonClass(lesson) {
            var done = vm.hasUserDoneIt(lesson);
            if (done) {
                if (done.points < lesson.questions.length * 2 / 3)
                    return 'list-group-item-danger';
                if (done.points < lesson.questions.length * 4 / 3)
                    return 'list-group-item-warning';
                return 'list-group-item-success';
            }
        }

        function getLabelClass(lesson) {
            var done = vm.hasUserDoneIt(lesson);
            if (done) {
                if (done.points < lesson.questions.length * 2 / 3)
                    return 'label-danger';
                if (done.points < lesson.questions.length * 4 / 3)
                    return 'label-warning';
                return 'label-success';
            }
        }
    };
})();
