(function () {
  'use strict';

  angular
    .module('core')
    .factory('Top15Service', Top15Service);

  Top15Service.$inject = ['$resource'];

  function Top15Service($resource) {
    return $resource('api/users/top15/:courseId/:action');
  }
})();
