
(function () {
  'use strict';


  angular
    .module('courses')
    .controller('CoursesListController', CoursesListController);

  CoursesListController.$inject = ['CoursesService', 'Authentication'];

  function CoursesListController(CoursesService, Authentication) {
    var vm = this;

    vm.user = Authentication.user;

    vm.courses = CoursesService.query();

    vm.canEdit = function () {
      return _.intersection(['teacher', 'admin'], vm.user.roles).length;
    }
  }
})();
