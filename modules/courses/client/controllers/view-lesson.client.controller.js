(function () {
    'use strict';

    // Courses controller
    angular
        .module('courses')
        .controller('ViewLessonController', ViewLessonController);

    ViewLessonController.$inject = ['$scope', '$state', '$stateParams', 'Authentication', 'courseResolve', 'CoursesService'];

    function ViewLessonController($scope, $state, $stateParams, Authentication, course, CoursesService) {
        var vm = this;

        vm.authentication = Authentication;
        vm.course = course;
        vm.error = null;

        vm.checkResponse = checkResponse;
        vm.advance = advance;
        vm.endLesson = endLesson;

        (function () {
            vm.categoryId = $stateParams.categoryId;
            vm.chapterId = $stateParams.chapterId;
            vm.lessonId = $stateParams.lessonId;
            vm.lesson = vm.course
                .categories[vm.categoryId]
                .chapters[vm.chapterId]
                .lessons[vm.lessonId];

            vm.currentQuestion = 0;
            vm.question = vm.lesson.questions[vm.currentQuestion];
        })();

        function checkResponse(question) {
            if (vm.verified) return;
            vm.verified = true;
            if (question.type == 'choose-photo')
                vm.correctResponse = (question.solution == question.response ? 'yes' : 'no');
            else if (question.type == 'translate') {
                var sol = question.solution.toLowerCase().replace(/[ !@#$%^&*(){}\[\];:'",<\.>\/?\\\|\-_=+`~]/g, '');
                var res = question.response.toLowerCase().replace(/[ !@#$%^&*(){}\[\];:'",<\.>\/?\\\|\-_=+`~]/g, '');
                vm.correctResponse = (sol == res ? 'yes' : 'no');
                if (vm.correctResponse == 'no') {
                    sol = sol.replace(/[ăâ]/gi, 'a');
                    sol - sol.replace('î', 'i');
                    sol = sol.replace('ș', 's');
                    sol = sol.replace('ț', 't');

                    res = res.replace(/[ăâ]/gi, 'a');
                    res - res.replace('î', 'i');
                    res = res.replace('ș', 's');
                    res = res.replace('ț', 't');
                    vm.correctResponse = (sol == res ? 'partial' : 'no');
                }

            }
            switch (vm.correctResponse) {
                case 'yes':
                    question.points = 2;
                    break;
                case 'partial':
                    question.points = 1;
                    break;
                case 'no':
                    question.points = 0;
                    break;
            }
            if (vm.lesson.questions.length - 1 == vm.currentQuestion)
                vm.finished = true;
        }

        function advance() {
            if (vm.verified) {
                if (vm.lesson.questions.length > vm.currentQuestion) {
                    vm.currentQuestion++;
                    vm.verified = false;
                    vm.correctResponse = null;
                    vm.question = vm.lesson.questions[vm.currentQuestion];
                }
            }
        }

        function endLesson() {
            var user = vm.authentication.user;
            var saveResults = new CoursesService({
                results: vm.lesson
            });
            saveResults.$save({ courseId: vm.course._id, action: 'addPoints' });

            debugger;
        }

    };
})();
