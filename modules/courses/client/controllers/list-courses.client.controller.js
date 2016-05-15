
(function () {
  'use strict';


  angular
    .module('courses')
    .controller('CoursesListController', CoursesListController);

  CoursesListController.$inject = ['CoursesService', 'Authentication', '_'];

  function CoursesListController(CoursesService, Authentication, _) {
    var vm = this;

    vm.user = Authentication.user;

    vm.courses = CoursesService.query();

    vm.canEdit = function () {
      return _.intersection(['teacher', 'admin'], vm.user.roles).length;
    };
  }
})();
