(function () {
    'use strict';

    // Courses controller
    angular
        .module('courses')
        .controller('CoursesEditController', CoursesEditController);

    CoursesEditController.$inject = ['$scope', '$state', 'Authentication', 'courseResolve'];

    function CoursesEditController($scope, $state, Authentication, course) {
        var vm = this;

        vm.authentication = Authentication;
        vm.course = course;
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;

        vm.initTooltip = initTooltip;
        vm.initType = initType;
        vm.resetType = resetType;

        vm.addCategory = addCategory;
        vm.removeCategory = removeCategory;

        vm.addChapter = addChapter;
        vm.removeChapter = removeChapter;
        vm.getChapterName = getChapterName;

        vm.addLesson = addLesson;
        vm.removeLesson = removeLesson;

        vm.addQuestion = addQuestion;
        vm.removeQuestion = removeQuestion;

        vm.addAnswer = addAnswer;
        vm.removeAnswer = removeAnswer;

        vm.addQuestionValidation = addQuestionValidation;

        (function () {
            function createScope() {
                var _args = Array.prototype.slice.call(arguments);
                return function () {
                    return _args.join('-');
                }
            }

            var categories = vm.course.categories;
            for (var catIdx in categories) {
                categories[catIdx].domId = createScope(catIdx);
                var chapters = categories[catIdx].chapters;
                for (var chaIdx in chapters) {
                    chapters[chaIdx].domId = createScope(catIdx, chaIdx);
                    var lessons = chapters[chaIdx].lessons;
                    for (var lesIdx in lessons) {
                        lessons[lesIdx].domId = createScope(catIdx, chaIdx, lesIdx);
                        var questions = lessons[lesIdx].questions;
                        for (var queIdx in questions) {
                            questions[queIdx].domId = createScope(catIdx, chaIdx, lesIdx, queIdx);
                        }
                    }
                }
            }
        })();

        function initTooltip() {
            window.$('[data-toggle="tooltip"]').tooltip({
                trigger: 'hover'
            });
        }

        function initType(question) {
            switch (question.type) {
                case 'choose-photo':
                    !question.answers && (question.answers = []);
                    break;

                case 'translate':
                    !question.answers && (question.answers = ['']);
                    break;

                case 'identify-object':
                    !question.answers && (question.answers = []);
                    break;
            }
        }

        function resetType(question) {
            question.solution = '';
            question.photo = '';
            switch (question.type) {
                case 'choose-photo':
                    question.answers = [];
                    break;

                case 'translate':
                    question.answers = [''];
                    question.caption = 'Tradu acest text:';
                    break;

                case 'identify-object':
                    question.answers = [];
                    break;
            }
        }

        function addCategory() {
            !vm.course && (vm.course = {});
            !vm.course.categories && (vm.course.categories = []);

            vm.course.categories.push({
                name: 'New Category',
                domId: function () {
                    var _this = this;
                    return vm.course.categories.findIndex(function (v) {
                        return v == _this;
                    });
                }
            });
        };

        function removeCategory(index) {
            vm.course && vm.course.categories && vm.course.categories.splice(index, 1);
        };

        function addChapter(category) {
            !category.chapters && (category.chapters = []);
            category.chapters.push({
                name: 'New Chapter',
                domId: function () {
                    var _this = this;
                    var categoryIdx = vm.course.categories.findIndex(function (v) {
                        return v == category;
                    });
                    var chapterIdx = category.chapters.findIndex(function (v) {
                        return v == _this;
                    });
                    return categoryIdx + '-' + chapterIdx;
                }
            });
        }

        function removeChapter(category, index) {
            category.chapters && category.chapters.splice(index, 1);
        };

        function getChapterName(chapter) {
            if (chapter.isSpacer)
                return 'spacer';
            return chapter.name || 'Unnamed chapter';
        }

        function addLesson(chapter) {
            !chapter.lessons && (chapter.lessons = []);
            chapter.lessons.push({
                name: 'New Lesson',
                domId: function () {
                    var _this = this;
                    var chapterIdx = -1;
                    var categoryIdx = vm.course.categories.findIndex(function (v) {
                        chapterIdx = v.chapters.findIndex(function (v2) {
                            return v2 == chapter;
                        });
                        return chapterIdx > -1;
                    });
                    var lessonIdx = chapter.lessons.findIndex(function (v) {
                        return v == _this;
                    });
                    return categoryIdx + '-' + chapterIdx + '-' + lessonIdx;
                }
            });
        }

        function removeLesson(chapter, index) {
            chapter.lessons && chapter.lessons.splice(index, 1);
        };

        function addQuestion(lesson) {
            !lesson.questions && (lesson.questions = []);
            lesson.questions.push({
                caption: '',
                domId: function () {
                    var _this = this;
                    var lessonIdx = -1;
                    var chapterIdx = -1;
                    var categoryIdx = vm.course.categories.findIndex(function (v) {
                        chapterIdx = v.chapters.findIndex(function (v1) {
                            lessonIdx = v1.lessons.findIndex(function (v2) {
                                return v2 == lesson;
                            });
                            return lessonIdx > -1;
                        });
                        return chapterIdx > -1;
                    });
                    var questionIdx = lesson.questions.findIndex(function (v) {
                        return v == _this;
                    });
                    return categoryIdx + '-' + chapterIdx + '-' + lessonIdx + '-' + questionIdx;
                },
                answers: []
            });
        }

        function removeQuestion(lesson, index) {
            lesson.questions && lesson.questions.splice(index, 1);
        };

        function addAnswer(question) {
            !question.answers && (question.answers = []);
            question.answers.push('');
        }

        function removeAnswer(question, index) {
            question.answers && question.answers.splice(index, 1);
        };

        function addQuestionValidation(form, control, question) {
            if (question.type == 'identify-object') {
                addArrayValidation(form, control, question.answers);
            } else {
                removeArrayValidation(form, control, question.answers);
            }
        }

        function addArrayValidation(form, control, array) {
            if (!form) return;
            array._watcher = $scope.$watchCollection(array, function (items) {
                debugger;
                if (Array.isArray(items) && items.length > 0)
                    form.$setValidity('minarraylength', true, control);
                else
                    form.$setValidity('minarraylength', false, control);
            });
        }

        function removeArrayValidation(form, array) {
            if (!form) return;
            form.$setValidity('minarraylength', true);
            if (array._watcher)
                array._watcher();
        }

        // Remove existing Course
        function remove() {
            if (confirm('Are you sure you want to delete?')) {
                vm.course.$remove($state.go('courses.list'));
            }
        }

        // Save Course
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity');
                return false;
            }

            // TODO: move create/update logic to service
            if (vm.course._id) {
                vm.course.$update(successCallback, errorCallback);
            } else {
                vm.course.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.go('courses.edit', {
                    courseId: res._id
                }, { reload: true });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
})();
