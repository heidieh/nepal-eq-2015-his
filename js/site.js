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

timecount_chart
        .width($('#time_count').width())
        .height(150)
        .dimension(dateDimension)
        .group(dateGroup)
        .x(xScaleRange)
        .xAxisLabel("Date")
        .yAxisLabel("Cases")
        .xAxis().ticks(8);

timestats1_chart
        .width($('#time_stats').width())
        .height(200)
        .dimension(dateDimension)
        .x(d3.time.scale().domain([new Date(2015, 4, 1), new Date(2015, 5, 1)]))
        .rangeChart(timecount_chart)
        .elasticY(true)
        .compose([
            dc.lineChart(timestats1_chart).group(deathsGroup,'Deaths').colors(colors[0]),
            dc.lineChart(timestats1_chart).group(traumaGroup,'Trauma').colors(colors[1]),            
        ])
        .brushOn(false)
        .xAxisLabel("Date")
        .yAxisLabel("Cases")
        .legend(dc.legend().x($('#time_count').width()-150).y(0).gap(5))
        .xAxis().ticks(8);
        
timestats2_chart
        .width($('#time_stats').width())
        .height(200)
        .dimension(dateDimension)
        .x(d3.time.scale().domain([new Date(2015, 4, 1), new Date(2015, 5, 1)]))
        .elasticY(true)
        .compose([
            dc.lineChart(timestats2_chart).group(ariGroup, 'ARI').colors(colors[2]),
            dc.lineChart(timestats2_chart).group(awdGroup, 'AWD').colors(colors[3]),
            dc.lineChart(timestats2_chart).group(bloodydiaGroup, 'Bloody Diarrhea').colors(colors[4]),
            dc.lineChart(timestats2_chart).group(pouGroup, 'PUO').colors(colors[5])            
        ])
        .brushOn(false)
        .xAxisLabel("Date")
        .yAxisLabel("Cases")
        .legend(dc.legend().x($('#time_count').width()-150).y(0).gap(5))
        .xAxis().ticks(8);
        
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

    function rangesEqual(range1, range2) {
        if (!range1 && !range2) {
            return true;
        }
        else if (!range1 || !range2) {
            return false;
        }
        else if (range1.length === 0 && range2.length === 0) {
            return true;
        }
        else if (range1[0].valueOf() === range2[0].valueOf() &&
            range1[1].valueOf() === range2[1].valueOf()) {
            return true;
        }
        return false;
    }
    // monkey-patch the first chart with a new function
    // technically we don't even need to do this, we could just change the 'filtered'
    // event externally, but this is a bit nicer and could be added to dc.js core someday
    timecount_chart.focusCharts = function (chartlist) {
        if (!arguments.length) {
            return this._focusCharts;
        }
        this._focusCharts = chartlist; // only needed to support the getter above
        this.on('filtered', function (range_chart) {
            if (!range_chart.filter()) {
                dc.events.trigger(function () {
                    chartlist.forEach(function(focus_chart) {
                        focus_chart.x().domain(focus_chart.xOriginalDomain());
                    });
                });
            } else chartlist.forEach(function(focus_chart) {
                if (!rangesEqual(range_chart.filter(), focus_chart.filter())) {
                    dc.events.trigger(function () {
                        focus_chart.focus(range_chart.filter());
                    });
                }
            });
        });
        return this;
    };
    timecount_chart.focusCharts([timestats1_chart,timestats2_chart]);

dc.renderAll();