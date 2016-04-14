(function () {
  'use strict';

  angular
    .module('courses')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Courses',
      state: 'courses',
      type: 'dropdown',
      roles: ['user', 'teacher', 'admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'courses', {
      title: 'Available courses',
      state: 'courses.list',
      roles: ['user', 'teacher', 'admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'courses', {
      title: 'Create Course',
      state: 'courses.create',
    roles: ['teacher', 'admin']
    });
  }
})();
