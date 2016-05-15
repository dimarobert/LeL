(function () {
  'use strict';

  // Courses controller
  angular
    .module('courses')
    .controller('CoursesController', CoursesController);

  CoursesController.$inject = ['$scope', '$state', 'Authentication', 'courseResolve'];

  function CoursesController($scope, $state, Authentication, course) {
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

    vm.addLesson = addLesson;
    vm.removeLesson = removeLesson;

    vm.addQuestion = addQuestion;
    vm.removeQuestion = removeQuestion;

    vm.addAnswer = addAnswer;
    vm.removeAnswer = removeAnswer;

    (function () {
      var categories = vm.course.categories;
      for (var catIdx in categories) {
        categories[catIdx].domId = function () { return catIdx; }
        var chapters = categories[catIdx].chapters;
        for (var chaIdx in chapters) {
          chapters[chaIdx].domId = function () { return catIdx + '-' + chaIdx; }
          var lessons = chapters[chaIdx].lessons;
          for (var lesIdx in lessons) {
            lessons[lesIdx].domId = function () { return catIdx + '-' + chaIdx + '-' + lesIdx; }
            var questions = lessons[lesIdx].questions;
            for (var queIdx in questions) {
              questions[queIdx].domId = function () { return catIdx + '-' + chaIdx + '-' + lesIdx + '-' + queIdx; }
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
          question.caption = 'Translate the following sentence:';
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

    // Remove existing Course
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.course.$remove($state.go('courses.list'));
      }
    }

    // Save Course
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.courseForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.course._id) {
        vm.course.$update(successCallback, errorCallback);
      } else {
        vm.course.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('courses.view', {
          courseId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
