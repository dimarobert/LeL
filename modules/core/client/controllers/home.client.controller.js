'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'CoursesService', 'Top15Service',
  function ($scope, Authentication, CoursesService, Top15Service) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.userCourses = [];
    $scope.top15 = [];
    $scope.userPlace = [];

    (function () {
      for (var course of $scope.authentication.user.startedCourses) {
        CoursesService.get({ courseId: course.course }).$promise
          .then(function (result) {
            var old = $scope.userCourses.findIndex(function (uc) { return uc._id == result._id });
            if (old > -1)
              $scope.userCourses[old] = result;
            else
              $scope.userCourses.push(result);
          });

        Top15Service.query({ courseId: course.course }).$promise
          .then(function (result) {
            var old = $scope.top15.findIndex(function (t) { return t.courseId == course.course; });
            if (old > -1)
              $scope.top15[old] = { courseId: course.course, result: result };
            else
              $scope.top15.push({ courseId: course.course, result: result });
          });

        Top15Service.get({ courseId: course.course, action: 'currentuserplace' }).$promise
          .then(function (result) {
            var old = $scope.userPlace.findIndex(function (up) { return up.courseId == course.course; });
            if (old > -1)
              $scope.userPlace[old] = { courseId: course.course, result: result };
            else
              $scope.userPlace.push({ courseId: course.course, result: result });
          });
      }

      $scope.getTop15 = function (course) {
        var t15 = $scope.top15.find(function (c) { return c.courseId == course._id; })
        if (t15)
          return t15.result;
      }

      $scope.userNotInTop15 = function (idx) {
        if (!($scope.top15.length > idx)) return false;
        var t15 = $scope.top15[idx].result.find(function (u) {
          return u._id == $scope.authentication.user._id;
        });

        return t15 ? false : true;
      }

    })();
  }
]);
