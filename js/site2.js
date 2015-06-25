var colors = ['#F44336','#673AB7','#009688','#FFEB3B','#FF9800','#9E9E9E'];  
var scale_maxDate = new Date(2015, 5, 25);

var timecount_chart = dc.lineChart("#time_count");
var timesurgery_chart = dc.lineChart("#time_surgery");
var timebirths_chart = dc.lineChart("#time_births");
var timestaff_chart = dc.lineChart("#time_staff");
var org_chart = dc.rowChart("#rc_org");

    var dateFormat = d3.time.format("%Y-%m-%d");
    data.forEach(function (e) {
        e.Date = dateFormat.parse(e.Date);
        console.log(e.Date);
    });

var cf = crossfilter(data);

var dateDimension = cf.dimension(function(d){ return d.Date; });
var orgDimension = cf.dimension(function(d){ return d.RC_Org; });

var orgGroup = orgDimension.group().reduceSum(function(d) {return d.OPD+d.IPD;});
var opdGroup = dateDimension.group().reduceSum(function(d) {return d.OPD;});
var ipdGroup = dateDimension.group().reduceSum(function(d) {return d.IPD;});
var referredGroup = dateDimension.group().reduceSum(function(d) {return d.referred;});
var surgicalMinorGroup = dateDimension.group().reduceSum(function(d) {return d.Surgical_Minor;});
var surgicalMajorGroup = dateDimension.group().reduceSum(function(d) {return d.Surgical_Major;});
var birthsGroup = dateDimension.group().reduceSum(function(d) {return d.Number_of_births;});
var internationalStaffGroup = dateDimension.group().reduceSum(function(d) {return d.Number_of_international_staff;});
var nationalStaffGroup = orgDimension.group().reduceSum(function(d) {return d.Number_of_national_staff;});

var outAll = cf.groupAll().reduceSum(function(d){ return d.OPD; });
var inAll = cf.groupAll().reduceSum(function(d){ return d.IPD; });
var referredAll = cf.groupAll().reduceSum(function(d){ return d.referred; });
var minorAll = cf.groupAll().reduceSum(function(d){ return d.Surgical_Minor; });
var majorAll = cf.groupAll().reduceSum(function(d){ return d.Surgical_Major; });
var birthsAll = cf.groupAll().reduceSum(function(d){ return d.Number_of_births; });
var nationalAll = cf.groupAll().reduceSum(function(d){ return d.Number_of_international_staff; });
var internationalAll = cf.groupAll().reduceSum(function(d){ return d.Number_of_national_staff; });


timecount_chart
        .width($('#time_count').width())
        .height(150)
        .dimension(dateDimension)
        .group(opdGroup, "Out Patients")
        .renderArea(true)
        .x(d3.time.scale().domain([new Date(2015, 4, 1), scale_maxDate]))
        .stack(ipdGroup,"In patients",function(d){
            return d.value;
        })
        .legend(dc.legend().x($('#time_count').width()-150).y(0).gap(5))
        .xAxis().ticks(8);

timesurgery_chart
        .width($('#time_count').width())
        .height(150)
        .dimension(dateDimension)
        .group(referredGroup,"Referred")
        .x(d3.time.scale().domain([new Date(2015, 4, 1), scale_maxDate]))
        .rangeChart(timecount_chart)
        .elasticY(true)
        .renderArea(true)       
        .stack(surgicalMinorGroup,"Surgical Minor",function(d){
            return d.value;
        })
        .stack(surgicalMajorGroup,"Surgical Major",function(d){
            return d.value;
        })        
        .brushOn(false)
        .legend(dc.legend().x($('#time_count').width()-150).y(0).gap(5))
        .xAxis().ticks(8);

timebirths_chart
        .width($('#time_count').width())
        .height(150)
        .dimension(dateDimension)
        .group(birthsGroup, 'Births')
        .x(d3.time.scale().domain([new Date(2015, 4, 1), scale_maxDate]))
        .rangeChart(timecount_chart)
        .elasticY(true)
        .renderArea(true)        
        .brushOn(false)
        .legend(dc.legend().x($('#time_count').width()-150).y(0).gap(5))
        .xAxis().ticks(8);

timestaff_chart
        .width($('#time_count').width())
        .height(150)
        .dimension(dateDimension)
        .group(referredGroup,'National Staff')
        .x(d3.time.scale().domain([new Date(2015, 4, 1), scale_maxDate]))
        .rangeChart(timecount_chart)
        .elasticY(true)
        .renderArea(true)       
        .stack(surgicalMinorGroup,'International Staff',function(d){
            return d.value;
        })  
        .brushOn(false)
        .legend(dc.legend().x($('#time_count').width()-150).y(0).gap(5))
        .xAxis().ticks(8);

org_chart.width($('#rc_org').width()).height(300)
        .dimension(orgDimension)
        .group(orgGroup)
        .xAxis().ticks(8);

dc.dataCount('#outtotal')
	.dimension(cf)
	.group(outAll);

dc.dataCount('#intotal')
	.dimension(cf)
	.group(inAll);

dc.dataCount('#referredtotal')
	.dimension(cf)
	.group(referredAll);

dc.dataCount('#minortotal')
	.dimension(cf)
	.group(minorAll);

dc.dataCount('#majortotal')
	.dimension(cf)
	.group(majorAll);

dc.dataCount('#nationaltotal')
	.dimension(cf)
	.group(nationalAll);

dc.dataCount('#internationaltotal')
	.dimension(cf)
	.group(internationalAll);

dc.dataCount('#birthstotal')
	.dimension(cf)
	.group(birthsAll);

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
    timecount_chart.focusCharts([timesurgery_chart,timebirths_chart,timestaff_chart]);

dc.renderAll();
