var margin = {top: 20, right: 20, bottom: 150, left: 40},
width = 960 - margin.left - margin.right,
height = 700 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range(["#00CC33", "#000000", "#0000FF", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
	return "<strong> Value:</strong> <span style='color:yellow'>" + Math.round(d.value*1000)/1000 + "</span>";
    })





var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);





var parentElement = document.getElementById('classifiers');






svg.selectAll("*").remove();

d3.csv("fit_metrics.csv", function(error, data) {

    console.log(data);
    console.log(data[0].Classifier)

    for(var i = 0; i < data.length; i++){
	stuff = data[i];
	console.log(stuff);
    	var newCheckBox = document.createElement('input');
    	newCheckBox.type = 'checkbox';
    	newCheckBox.id = stuff.Classifier; // need unique Ids!
	newCheckBox.className = 'classifier_ctrl';
	var newtext = document.createTextNode(stuff.Classifier);
	newCheckBox.appendChild(newtext);
	parentElement.appendChild(newCheckBox);

    };

    
    var valnames = d3.keys(data[0]).filter(function(key) { return key !== "Classifier" && document.getElementById(key).checked});

    data.forEach(function(d) {
	d.names = valnames.map(function(name) { return {name: name, value: +d[name]}; });
    });

    x0.domain(data.map(function(d) { return d.Classifier; }));
    x1.domain(valnames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.names, function(d) { return d.value; }); })]);

    svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis)
	.selectAll("text")
	.attr("y", 0)
	.attr("x", 9)
	.attr("dy", ".35em")
	.attr("transform", "rotate(90)")
	.style("text-anchor", "start");


    svg.append("g")
	.attr("class", "y axis")
	.call(yAxis)
	.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end")
	.text("value");

    var classifier = svg.selectAll(".Classifier")
	.data(data)
	.enter().append("g")
	.attr("class", "g")
	.attr("transform", function(d) { return "translate(" + x0(d.Classifier) + ",0)"; });

    classifier.selectAll("rect")
	.data(function(d) { return d.names; })
	.enter().append("rect")
	.attr("width", x1.rangeBand())
	.attr("x", function(d) { return x1(d.name); })
	.attr("y", function(d) { return y(d.value); })
	.attr("height", function(d) { return height - y(d.value); })
	.style("fill", function(d) { return color(d.name); })
	.on('mouseover',tip.show)
	.on('mouseout',tip.hide);



    var legend = svg.selectAll(".legend")
	.data(valnames.slice().reverse())
	.enter().append("g")
	.attr("class", "legend")
	.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
	.attr("x", width - 18)
	.attr("width", 18)
	.attr("height", 18)
	.style("fill", color);

    legend.append("text")
	.attr("x", width - 24)
	.attr("y", 9)
	.attr("dy", ".35em")
	.style("text-anchor", "end")
	.text(function(d) { return d; });




});







makeplot = function() {

    svg.selectAll("*").remove();

    d3.csv("fit_metrics.csv", function(error, data) {

	data = data.filter(function(row) {
            return document.getElementById(row['Classifier']).checked;
	})


	var valnames = d3.keys(data[0]).filter(function(key) { return key !== "Classifier" && document.getElementById(key).checked});

	data.forEach(function(d) {
	    d.names = valnames.map(function(name) { return {name: name, value: +d[name]}; });
	});

	x0.domain(data.map(function(d) { return d.Classifier; }));
	x1.domain(valnames).rangeRoundBands([0, x0.rangeBand()]);
	y.domain([0, d3.max(data, function(d) { return d3.max(d.names, function(d) { return d.value; }); })]);

	svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis)
	    .selectAll("text")
	    .attr("y", 0)
	    .attr("x", 9)
	    .attr("dy", ".35em")
	    .attr("transform", "rotate(90)")
	    .style("text-anchor", "start");


	svg.append("g")
	    .attr("class", "y axis")
	    .call(yAxis)
	    .append("text")
	    .attr("transform", "rotate(-90)")
	    .attr("y", 6)
	    .attr("dy", ".71em")
	    .style("text-anchor", "end")
	    .text("value");

	var classifier = svg.selectAll(".Classifier")
	    .data(data)
	    .enter().append("g")
	    .attr("class", "g")
	    .attr("transform", function(d) { return "translate(" + x0(d.Classifier) + ",0)"; });

	classifier.selectAll("rect")
	    .data(function(d) { return d.names; })
	    .enter().append("rect")
	    .attr("width", x1.rangeBand())
	    .attr("x", function(d) { return x1(d.name); })
	    .attr("y", function(d) { return y(d.value); })
	    .attr("height", function(d) { return height - y(d.value); })
	    .style("fill", function(d) { return color(d.name); })
	    .on('mouseover',tip.show)
	    .on('mouseout',tip.hide);



	var legend = svg.selectAll(".legend")
	    .data(valnames.slice().reverse())
	    .enter().append("g")
	    .attr("class", "legend")
	    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
	    .attr("x", width - 18)
	    .attr("width", 18)
	    .attr("height", 18)
	    .style("fill", color);

	legend.append("text")
	    .attr("x", width - 24)
	    .attr("y", 9)
	    .attr("dy", ".35em")
	    .style("text-anchor", "end")
	    .text(function(d) { return d; });




    });


};

var toggleA = null;
d3.selectAll('.classifier_ctrl').on('change', function() {

    if (toggleA !== null) {
        toggleA = null;
    } 
    else {
        makeplot();
    }        
});







