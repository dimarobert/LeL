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

  };
})();
