'use strict';

var HEIGHT = 600;
var WIDTH = 1100;
var MARGINS = {
    top: 20,
    right: 20,
    bottom: 40,
    left: 50
  };

var menus = d3.selectAll('select');

//scales
var x = d3.time.scale()
          .range([0, (WIDTH - MARGINS.right - MARGINS.left)])
          .domain([new Date(1990, 0, 1), new Date(2013, 0, 1)]);

var y = d3.scale.linear()
      .range([(HEIGHT - MARGINS.bottom - MARGINS.top), 0])
      .domain([0, (0.75 * 100)]);

var xAxis = d3.svg.axis()
        .scale(x)
        .ticks(10);
  var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

  var chart = d3.select('#chart')
        .append('svg')
        .attr('height', HEIGHT)
        .attr('width', WIDTH)
        .attr('id', 'display');

  chart.append('g').call(xAxis)
      .attr('transform', 'translate(' + MARGINS.left + ', ' +
        (HEIGHT - MARGINS.bottom) + ')')
      .attr('class', 'axis')
      .selectAll('text')
      .attr('y', 5)
      .attr('x', 6)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(45)')
      .style('text-anchor', 'start');

  chart.append('g').call(yAxis)
      .attr('class', 'axis')
      .attr('transform', 'translate(' + MARGINS.left + ', ' + MARGINS.top + ')')
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', 7)
      .style('text-anchor', 'end')
      .text('Mean Prevalence as Percentage of Population');

d3.csv("data.csv", function(d) {

  return {
    location: d.location_name,
    gender: d.sex,
    year: d.year,
    mean: d.mean,
    metric: d.metric
  };
}, function(data) {
  // console.log(data[0]);
  data.forEach(function(x) {
    var year = x.year;
    var mean = x.mean;
    var sex = x.sex;
    var location = x.location_name;
  });

});

