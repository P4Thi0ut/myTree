var myTree = angular.module('myTree', []);

angular.forEach(['r', 'x', 'y', 'x1', 'x2', 'y1', 'y2', 'fill', 'width', 'height', 'xlink', 'href'], function(name) {
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
					process(0, scope.tree.data[n], 0, 0, 0, scope.tree.options);
				scope.load = true;
			},0);

			var process = function(level, node, index, parentx, parenty) {
				var px = parseInt(index, 10) * (scope.tree.options.nodeW * 1.5);
				var py = parseInt(level, 10) * (scope.tree.options.nodeH * 2);
				//top lines
				var lsrcx = px + 30;
				var lsrcy = py;
				var ldstx = lsrcx;
				var ldsty = py - (scope.tree.options.nodeH / 2);
				//bottom line
				var blsrcx = px + 30;
				var blsrcy = py + scope.tree.options.nodeH;
				var bldstx = blsrcx;
				var bldsty = blsrcy + (scope.tree.options.nodeH / 2);

				var n = {
					title: node.title,
					color: node.color,
					vignette: ("vignette" in node) ? node.vignette : false,
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