angular.module('courses')
    .directive('popOver', function ($compile) {
        return {
            restrict: "A",
            transclude: true,
            template: "<span ng-transclude></span>",
            link: function (scope, element, attrs) {
                var options = {
                    content: $compile(scope.content)(scope),
                    placement: scope.placement,
                    html: true,
                    title: scope.title,
                    trigger: scope.trigger
                };
                $(element).popover(options);
            },
            scope: {
                title: '@',
                content: '=dataContent',
                placement: '=dataPlacement',
                trigger: '=dataTrigger',
            }
        };
    });