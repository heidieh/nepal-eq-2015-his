var colors = ['#F44336','#673AB7','#009688','#FFEB3B','#FF9800','#9E9E9E'];  

var timecount_chart = dc.lineChart("#time_count");
var timestats1_chart = dc.compositeChart("#time_stats");
var timestats2_chart = dc.compositeChart("#time_stats2");
var org_chart = dc.rowChart("#rc_org");
var under5_chart = dc.pieChart("#age");

    var dateFormat = d3.time.format("%Y-%m-%d");
    data.forEach(function (e) {
        e.date = dateFormat.parse(e.date);
    });

var cf = crossfilter(data);

var dateDimension = cf.dimension(function(d){ return d.date; });
var orgDimension = cf.dimension(function(d){ return d.rc; });
var under5Dimension = cf.dimension(function(d){ return d.Under_5; });

var dateGroup = dateDimension.group().reduceSum(function(d) {return d.deaths+d.trauma+d.ari+d.awd+d.bloody_dia+d.pou;});
var deathsGroup = dateDimension.group().reduceSum(function(d) {return d.deaths;});
var traumaGroup = dateDimension.group().reduceSum(function(d) {return d.trauma;});
var ariGroup = dateDimension.group().reduceSum(function(d) {return d.ari;});
var awdGroup = dateDimension.group().reduceSum(function(d) {return d.awd;});
var bloodydiaGroup = dateDimension.group().reduceSum(function(d) {return d.bloody_dia;});
var pouGroup = dateDimension.group().reduceSum(function(d) {return d.pou;});
var orgGroup = orgDimension.group().reduceSum(function(d) {return d.deaths+d.trauma+d.ari+d.awd+d.bloody_dia+d.pou;});
var under5Group = under5Dimension.group().reduceSum(function(d) {return d.deaths+d.trauma+d.ari+d.awd+d.bloody_dia+d.pou;});

var patientsAll = cf.groupAll().reduceSum(function(d){ return d.deaths+d.trauma+d.ari+d.awd+d.bloody_dia+d.pou; });
var deathsAll = cf.groupAll().reduceSum(function(d){ return d.deaths; });
var traumaAll = cf.groupAll().reduceSum(function(d){ return d.trauma; });
var ariAll = cf.groupAll().reduceSum(function(d){ return d.ari; });
var awdAll = cf.groupAll().reduceSum(function(d){ return d.awd; });
var pouAll = cf.groupAll().reduceSum(function(d){ return d.pou; });
var bloodydiaAll = cf.groupAll().reduceSum(function(d){ return d.bloody_dia; });

var xScaleRange = d3.time.scale().domain([new Date(2015, 4, 1), new Date(2015, 5, 1)]);
var xScale = d3.time.scale().domain([new Date(2015, 4, 1), new Date(2015, 5, 1)]);

timecount_chart
        .width($('#timecount').width())
        .height(150)
        .dimension(dateDimension)
        .group(dateGroup)
        .x(xScaleRange);

timestats1_chart
        .width($('#timestats').width())
        .height(200)
        .dimension(dateDimension)
        .x(xScale)
        .rangeChart(timecount_chart)
        .elasticY(true)
        .margins({top: 10, right: 50, bottom: 60, left: 30})
        .compose([
            dc.lineChart(timestats1_chart).group(deathsGroup).colors(colors[0]),
            dc.lineChart(timestats1_chart).group(traumaGroup).colors(colors[1]),            
        ]);
        
timestats2_chart
        .width($('#timestats').width())
        .height(200)
        .dimension(dateDimension)
        .x(xScale)
        .rangeChart(timecount_chart)
        .elasticY(true)
        .margins({top: 10, right: 50, bottom: 60, left: 30})
        .compose([
            dc.lineChart(timestats2_chart).group(ariGroup).colors(colors[2]),
            dc.lineChart(timestats2_chart).group(awdGroup).colors(colors[3]),
            dc.lineChart(timestats2_chart).group(bloodydiaGroup).colors(colors[4]),
            dc.lineChart(timestats2_chart).group(pouGroup).colors(colors[5])            
        ]);         
        
org_chart.width($('#rc_org').width()).height(300)
        .dimension(orgDimension)
        .group(orgGroup);

under5_chart.width($('#age').width()).height(200)
        .dimension(under5Dimension)
        .group(under5Group);

dc.dataCount('#deathstotal')
	.dimension(cf)
	.group(deathsAll);

dc.dataCount('#traumatotal')
	.dimension(cf)
	.group(traumaAll);

dc.dataCount('#aritotal')
	.dimension(cf)
	.group(ariAll);

dc.dataCount('#awdtotal')
	.dimension(cf)
	.group(awdAll);

dc.dataCount('#bloodydiatotal')
	.dimension(cf)
	.group(bloodydiaAll);

dc.dataCount('#poutotal')
	.dimension(cf)
	.group(pouAll);

dc.renderAll();

var svg = d3.select('#time_stats').select("svg");

var g = svg.append("g");

    g.append("rect")
        .attr("x", 10)
        .attr("y", 170)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill",colors[0])
        .attr("class","legend");

    g.append("text")
        .attr("x",25)
        .attr("y",178)
        .text("Deaths")
        .attr("font-size","10px")
        .attr("class","legend");

    g.append("rect")
        .attr("x", 110)
        .attr("y", 170)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill",colors[1])
        .attr("class","legend");

    g.append("text")
        .attr("x",125)
        .attr("y",178)
        .text("Trauma")
        .attr("font-size","10px")
        .attr("class","legend");

var svg = d3.select('#time_stats2').select("svg");

var g = svg.append("g");

    g.append("rect")
        .attr("x", 10)
        .attr("y", 170)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill",colors[2])
        .attr("class","legend");

    g.append("text")
        .attr("x",25)
        .attr("y",178)
        .text("ARI")
        .attr("font-size","10px")
        .attr("class","legend");

    g.append("rect")
        .attr("x", 110)
        .attr("y", 170)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill",colors[3])
        .attr("class","legend");

    g.append("text")
        .attr("x",125)
        .attr("y",178)
        .text("AWD")
        .attr("font-size","10px")
        .attr("class","legend");

    g.append("rect")
        .attr("x", 10)
        .attr("y", 190)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill",colors[4])
        .attr("class","legend");

    g.append("text")
        .attr("x",25)
        .attr("y",198)
        .text("Bloody Diarrhea")
        .attr("font-size","10px")
        .attr("class","legend");

    g.append("rect")
        .attr("x", 110)
        .attr("y", 190)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill",colors[5])
        .attr("class","legend");

    g.append("text")
        .attr("x",125)
        .attr("y",198)
        .text("PUO")
        .attr("font-size","10px")
        .attr("class","legend");