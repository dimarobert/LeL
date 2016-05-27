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
            $scope.userCourses.push(result);
          });

        Top15Service.query({ courseId: course.course }).$promise
          .then(function (result) {
            $scope.top15.push(result);
          });

        Top15Service.get({ courseId: course.course, action: 'currentuserplace' }).$promise
          .then(function (result) {
            $scope.userPlace.push(result);
          });
      }
      
      $scope.getTop15 = function(idx) {
        var t15 = $scope.top15[idx];
        
        return t15;
      }

      $scope.userNotInTop15 = function (idx) {
        if(!($scope.top15.length > idx)) return false;
        var t15 = $scope.top15[idx].find(function (u) {
          return u._id == $scope.authentication.user._id;
        });

        return t15 ? false : true;
      }

    })();
  }
]);
