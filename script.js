var margin = {
	top: 20,
	left: 40,
	bottom: 40,
	right: 20
};
var w = window.innerWidth - (margin.left + margin.right);
var h = window.innerHeight - 2 * (margin.top + margin.bottom);

var chart = document.getElementById('graph');
var gender = document.getElementById('gender');
var metric = document.getElementById('metric');
var country = document.getElementById('country');
var age = document.getElementById('age-group')

d3.csv('data.csv', function(csv){

	// getting country data from csv file and putting it in ascending order
	var countryData = d3.nest()
		.key(function(d) {return d.location_name; })
		.sortKeys(d3.ascending)
		.entries(csv)
	//countryData returns as an object need to use for in loop instead of for loop
	//put country data in to coutnry dropdown
	for (var i in countryData){
		var option = document.createElement('option')
		option.text = countryData[i].key;
		option.value = countryData[i].key;
		country.add(option)
	}

	var ageData = d3.nest()
		.key(function(d) { return d.age_group; })
		.sortKeys(d3.ascending)
		.entries(csv)

	for (var i in ageData) {
		var option = document.createElement('option')
		option.text = ageData[i].key;
		option.value = ageData[i].key;
		age.add(option)
	}

	//graph function
	function initializeGraph() {

		while (chart.firstChild) {
			chart.removeChild(chart.firstChild);
		}

		//Getting year data for y axis
		var data = d3.nest()
			.key(function(d) { return d.year; })
			.sortKeys(d3.ascending)
			.entries(csv);

		var meanArray = [];
    	for (var i in data) { 
	    	meanArray.push(d3.mean(data[i].values.filter(function(d) {
	    		return d.sex === gender.value;
	    	})
	    	.filter(function(d) {
	    		return d.metric === metric.value;
	    	})
	    	.filter(function(d) {
	    		if (country.value === 'all') { return true; }
	    		return d.location_name === country.value;
	    	})
	    	.filter(function(d) {
	    		if (age.value === 'all') { return true; }
	    		return d.age_group === age.value;
	    	})
	    	.map(function(d) {
	        	return +d.mean;
	    	})));
    	}
    	// console.log(meanArray)

		//SVG container for graph
		var tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0])
			.html(function(d, i) {
				return "<strong>Frequency:</strong> <span style='color:red'>" + meanArray[i] + "</span>";
			})

		var graph = d3.select('#graph')
		.attr({
			'width': w + (margin.left + margin.right),
			'height': h + (margin.top + margin.bottom)
		})
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		var x = d3.scale.ordinal().rangeRoundBands([0, w], 0.1)
		.domain(data.map(function(d) {return d.key;}))

		var yDomain = [d3.min(meanArray) - 0.01, d3.max(meanArray) + 0.01];

		var y = d3.scale.linear()
			.range([h, 0])
			.domain(yDomain)

		//X and Y Axis
		var xAxis = d3.svg.axis()
			.scale(x)
			.orient('bottom')
			.ticks(data.length)

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient('left')
			.ticks(10, '%');

		graph.call(tip)

		graph.append('g')
			.attr('class', 'axis')
			.attr('transform', 'translate(0,' + h + ')')
			.call(xAxis)
			.append('text')
			.attr('x', w / 2)
			.attr('y', 2 * margin.top)
			.style('font-size', '14px')
			.style('text-anchor', 'middle')
			.text('Year');

		graph.append('g')
			.attr('class', 'axis')
			.call(yAxis)
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', 6)
			.attr('dy', '.71em')
			.style('font-size', '14px')
			.style('text-anchor', 'end')
			.text('Prevalence (Percentage)');

		graph.selectAll('bar')
			.data(data)
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.attr('x', function(d, i) { return x(d.key); })
			.attr('width', x.rangeBand())
			.attr('y', function(d, i) { return y(meanArray[i]); })
			.attr('height', function(d, i) { return h-y(meanArray[i]); })
			.on('mouseover', tip.show)
      		.on('mouseout', tip.hide)
	}

	gender.addEventListener('change', function(){
		initializeGraph()
	});
	metric.addEventListener('change', function(){
		initializeGraph()
	});
	country.addEventListener('change', function(){
		initializeGraph()
	});
	age.addEventListener('change', function(){
		initializeGraph()
	});

});