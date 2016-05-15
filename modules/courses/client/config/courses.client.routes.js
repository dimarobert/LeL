(function () {
  'use strict';

  angular
    .module('courses')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('courses', {
        abstract: true,
        url: '/courses',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'teacher', 'admin']
        }
      })
      .state('courses.manage', {
        url: '/manage',
        templateUrl: 'modules/courses/client/views/manage-courses.client.view.html',
        controller: 'CoursesManageController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: 'Manage Courses'
        }
      })
      .state('courses.list', {
        url: '',
        templateUrl: 'modules/courses/client/views/list-courses.client.view.html',
        controller: 'CoursesListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'teacher', 'admin'],
          pageTitle: 'Courses List'
        }
      })
      .state('courses.create', {
        url: '/create',
        templateUrl: 'modules/courses/client/views/form-course.client.view.html',
        controller: 'CoursesController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: newCourse
        },
        data: {
          roles: ['teacher', 'admin'],
          pageTitle: 'Courses Create'
        }
      })
      .state('courses.edit', {
        url: '/:courseId/edit',
        templateUrl: 'modules/courses/client/views/form-course.client.view.html',
        controller: 'CoursesController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: getCourse
        },
        data: {
          roles: ['teacher', 'admin'],
          pageTitle: 'Edit Course {{ courseResolve.name }}'
        }
      })
      .state('courses.view', {
        url: '/:courseId',
        templateUrl: 'modules/courses/client/views/view-course.client.view.html',
        controller: 'CoursesController',
        controllerAs: 'vm',
        resolve: {
          courseResolve: getCourse
        },
        data: {
          roles: ['user', 'teacher', 'admin'],
          pageTitle: 'Course {{ articleResolve.name }}'
        }
      });
  }

  getCourse.$inject = ['$stateParams', 'CoursesService'];

  function getCourse($stateParams, CoursesService) {
    return CoursesService.get({
      courseId: $stateParams.courseId
    }).$promise;
  }

  newCourse.$inject = ['CoursesService'];

  function newCourse(CoursesService) {
    return new CoursesService();
  }
})();
