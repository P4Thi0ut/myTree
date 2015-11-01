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
			scope.draw = {};
			$timeout(function() {
				scope.tree = ngModelCtrl.$viewValue;
				for (n in scope.tree.data)
					process(0, scope.tree.data[n], 0, 0, 0);
				scope.load = true;
				console.info(scope.draw);
				//console.info(scope.tree);
			},0);

			var process = function(level, node, index, parentx, parenty) {
				var px = parseInt(index, 10) * 70;
				var py = parseInt(level, 10) * 60;
				//top line
				var lsrcx = px + 35;
				var lsrcy = py;
				var ldstx = lsrcx;
				var ldsty = py - 20;
				//bottom line
				var blsrcx = px + 35;
				var blsrcy = py + 20;
				var bldstx = blsrcx;
				var bldsty = blsrcy + 10;

				var n = {
					title: node.title,
					posx: px,
					posy: py,
					linesrcx: lsrcx,
					linesrcy: lsrcy,
					linedstx: ldstx,
					linedsty: ldsty,
					blinesrcx: blsrcx,
					blinesrcy: blsrcy,
					blinedstx: bldstx,
					blinedsty: bldsty,
					hasChilds: (node.childs.length > 0),
					parentx: parentx,
					parenty: parenty
				};
				if (level in scope.draw)
					scope.draw[level].push(n);
				else
					scope.draw[level] = [n];
				for (c in node.childs)
					process(level + 1, node.childs[c], index + parseInt(c, 10), bldstx, bldsty);
			}
		}
	}
}]);