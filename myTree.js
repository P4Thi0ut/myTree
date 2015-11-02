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
				//var nbrNodes = scope.draw[level].length;
				var px = /*(scope.tree.options.width / 2) +*/ parseInt(index, 10) * (scope.tree.options.nodeW * 1.5);
				var py = level * (scope.tree.options.nodeH * 2);
				//top lines
				var lsrcx = px + (scope.tree.options.nodeW / 2);
				var lsrcy = py;
				var ldstx = lsrcx;
				var ldsty = py - (scope.tree.options.nodeH / 2);
				//bottom line
				var blsrcx = px + (scope.tree.options.nodeW / 2);
				var blsrcy = py + scope.tree.options.nodeH;
				var bldstx = blsrcx;
				var bldsty = blsrcy + (scope.tree.options.nodeH / 2);
				//circle
				var cx = px + (scope.tree.options.nodeW / 2);
				var cy = py + (scope.tree.options.nodeH / 2);

				var n = {
					title: node.title,
					color: node.color,
					vignette: ("vignette" in node) ? node.vignette : false,
					stroke: ("stroke" in node) ? node.stroke : "plain",
					strokeType: ("strokeType" in node) ? "arrow": false,
					shape: node.shape,
					posx: px,
					posy: py,
					cx: cx,
					cy: cy,
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
				if (n.strokeType) {
					var p1 = n.linesrcx - 5;
					var p2 = n.linesrcx + 5;
					var offy = n.linesrcy - 5;
					n.strPath = n.linesrcx + "," + n.linesrcy + " " + p1 + "," + offy + " " + p2 + "," + offy;
				}
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