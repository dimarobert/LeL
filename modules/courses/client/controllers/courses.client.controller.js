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

    vm.chapterRows = chapterRows;
    vm.rowChapters = rowChapters;
    vm.centerChapter = centerChapter;
    vm.hoverShowCaption = hoverShowCaption;
    vm.blurHideCaption = blurHideCaption;


    function chapterRows(chapters) {
      var ret = chapters.reduce(function (prev, next) {
        if (next.isSpacer)
          prev.push(prev.length + 1);
        return prev;
      }, [1]);
      return ret;
    }

    function rowChapters(chapters, row) {
      return chapters.reduce(function (prev, next) {
        if (row > 0) {
          if (next.isSpacer) row--;
          prev.shift();
        } else if (row == 0 && next.isSpacer) {
          row--;
          prev = prev.slice(0, prev.findIndex(function (v) {
            return v == next;
          }));
        }
        return prev;
      }, chapters.slice());
    }

    function centerChapter(rowChapters, idx) {
      if (rowChapters.length > 5)
        return '';
      if (rowChapters.length == 1)
        return 'col-sm-offset-4';
      return 'col-sm-offset-' + (6 - rowChapters.length);
    }

    function hoverShowCaption(event) {
      var caption = angular.element(event.currentTarget).next();
      caption.addClass('hover');
    }

    function blurHideCaption(event) {
      var caption = angular.element(event.currentTarget).next();
      caption.removeClass('hover');
    }

  };
})();
