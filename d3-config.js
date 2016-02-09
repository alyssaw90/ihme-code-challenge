'use strict';

module.exports = exports = {};

var height = 600;
var width = 1200;
var margins = {
	top: 20,
	right: 40,
	bottom: 40,
	left: 50
};

var formatePercent = d3.format('.0%')

var x = d3.scale.ordinal()
	.rangeRoundBand([0, width], .1);

var y = d3.scale.ordinal()
	.rangeRoundBand([height, 0]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient(bottom);

var yAxis = d3.svg.axis()
	.scale(y)
	.orient('left')
	.tickFormat(formatePercent);
	
