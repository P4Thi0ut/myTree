var myTree = angular.module('myTree', []);

angular.forEach(['r', 'x', 'y', 'cx','cy', 'x1', 'x2', 'y1', 'y2', 'fill', 'width', 'height'], function(name) {
  	var ngName = 'ng' + name[0].toUpperCase() + name.slice(1);
  	myTree.directive(ngName, function() {
    	return function(scope, element, attrs) {
      		attrs.$observe(ngName, function(value) {
        		attrs.$set(name, value);
      		})
    	};
  	});
});

myTree.directive('tree', ['$timeout', function($timeout) {
	return {
		restrict: 'A',
		require: 'ngModel',
		templateUrl: 'templates/myTree.html',
		link: function(scope, element, attributes, ngModelCtrl) {
			scope.load = false;
			$timeout(function() {
				scope.tree = ngModelCtrl.$viewValue;
				scope.load = true;
			},0);
		}
	}
}]);