var myTree = angular.module('myTree', []);

angular.forEach(['r', 'x', 'y', 'x1', 'x2', 'y1', 'y2',
				'fill', 'width', 'height', 'xlink', 'href',
				'cx', 'cy', 'r', 'd', 'points'], function(name) {
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
				scope.tree.options.radius = (scope.tree.options.nodeW < scope.tree.options.nodeH) ?
					(scope.tree.options.nodeW / 2):(scope.tree.options.nodeH / 2);
				for (n in scope.tree.data)
					process(0, scope.tree.data[n], 0, 0, 0, scope.tree.options);
				scope.load = true;
				//console.info(scope.draw);
			},0);

			var process = function(level, node, index, parentx, parenty) {
				level = parseInt(level, 10);
				node.posx = parseInt(index, 10) * (scope.tree.options.nodeW * 1.5);
				node.posy = level * (scope.tree.options.nodeH * 2);
				//top lines
				node.linesrcx = node.posx + (scope.tree.options.nodeW / 2);
				node.linesrcy = node.posy;
				node.linedstx = node.linesrcx;
				node.linedsty = node.posy - (scope.tree.options.nodeH / 2);
				//bottom line
				node.blinesrcx = node.posx + (scope.tree.options.nodeW / 2);
				node.blinesrcy = node.posy + scope.tree.options.nodeH;
				node.blinedstx = node.blinesrcx;
				node.blinedsty = node.blinesrcy + (scope.tree.options.nodeH / 2);
				//circle
				node.cx = node.posx + (scope.tree.options.nodeW / 2);
				node.cy = node.posy + (scope.tree.options.nodeH / 2);
				node.shape = ("shape" in node) ? node.shape: "square";
				node.vignette = ("vignette" in node) ? node.vignette : false;
				node.stroke = ("stroke" in node) ? node.stroke : "plain";
				node.strokeType = ("strokeType" in node) ? node.strokeType: false;
				node.hasChilds = (node.childs.length > 0);
				node.parentx = parentx;
				node.parenty = parenty;

				if (node.strokeType) {
					var offy = node.linesrcy - 5;
					node.strPath = node.linesrcx+","+node.linesrcy+" "+(node.linesrcx - 5)+","+offy+" "+(node.linesrcx + 5)+","+offy;
				}
				if (level in scope.draw)
					scope.draw[level].push(node);
				else
					scope.draw[level] = [node];
				for (c in node.childs)
					process(level + 1, node.childs[c], index + parseInt(c, 10), node.blinedstx, node.blinedsty);
			}
		}
	}
}]);