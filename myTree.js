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
			scope.nth = {};
			$timeout(function() {
				scope.tree = ngModelCtrl.$viewValue;
				scope.tree.options.radius = (scope.tree.options.nodeW < scope.tree.options.nodeH) ?
					(scope.tree.options.nodeW / 2):(scope.tree.options.nodeH / 2);
				for (n in scope.tree.data)
					process(0, scope.tree.data[n], 0, 0, 1);
				scope.load = true;
				//console.info(scope.draw);
			},0);

			var compute = function(nodes, index) {
				var gap = parseInt((scope.tree.options.width - (scope.tree.options.nodeW * nodes)) / (nodes + 1), 10);
				return (index * gap) + ((index - 1) * scope.tree.options.nodeW);
			}

			var process = function(level, node, parentx, parenty, siblings) {
				level = parseInt(level, 10);
				scope.nth[level] = (level in scope.nth) ? scope.nth[level] + 1: 1;
				node.posx = compute(siblings, scope.nth[level]);
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
					process(level + 1, node.childs[c], node.blinedstx, node.blinedsty, node.nextLevel);
			}
		}
	}
}]);