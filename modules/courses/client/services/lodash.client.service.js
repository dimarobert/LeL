(function () {
  'use strict';

  angular
    .module('courses')
    .constant('_', window._)
    .run(['$rootScope', function ($rootScope) {
      $rootScope._ = window._;
    }]);

})();