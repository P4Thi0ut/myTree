angular.module('myTreeApp', ['ngRoute', 'myTree'])
	.run(function() {})
	.config(function($routeProvider, $locationProvider) {
		$routeProvider.when('/', {
			templateUrl: 'templates/example.html'
		});
	})
	.controller('example',  ['$scope', '$http', function($scope, $http) {
		$scope.load = false;
		$http.get("data.json").then(function(answer) {
			$scope.tree = answer.data;
			$scope.load = true;
		});
	}])