var ALLIANZ_MONITOR = {

	yql : "select * from csv where url='http://ichart.finance.yahoo.com/table.csv?s=%5ESTOXX50E&amp;a={fm}&amp;b=01&amp;c={fy}&amp;d={tm}&amp;e=01&amp;f={ty}&amp;g=m&amp;ignore=.csv'",
	cap : 4.3,

	buildQueryString : function(fy, fm, ty, tm) {
		return this.yql.replace("{fy}", fy).replace("{fm}", fm).replace("{ty}", ty).replace("{tm}", tm);
	},
	
	handleResponse : function(msg) {
		var closeValueByMonth = this.toCloseValueByMonth(msg);
		var rates = this.calculateRates(closeValueByMonth);
		this.renderResponse(rates);
	},

	/* returns s.th. like {"06" : 2716.03, "07" : 1000	} */
	toCloseValueByMonth : function(jsonCsv) {
		// {"col0":"Date","col1":"Open","col2":"High","col3":"Low","col4":"Close","col5":"Volume","col6":"Adj Close"}
		// {"col0":"2013-07-01","col1":"2622.62","col2":"2622.62","col3":"2622.62","col4":"2622.62","col5":"000","col6":"2622.62"}
		var originalRow = jsonCsv.query.results.row;
		var rows = jsonCsv.query.results.row.slice(1, originalRow.length);
		var unordered = $.map(rows, function(r) {
			var month = r.col0.substring(0,7);
			var value = parseFloat(r.col6);
			return {month: month, value : value};
		});
		return unordered.sort(function(a, b) {
			return -1 * a.month.localeCompare(b);
		});
	},

	/* returns e.g. [{month : "06", value : 2716.03, factor : 6.88, factorWithCap : 4.1 }] */
	calculateRates : function(valuesByMonth) {
		var result = new Array();
		var sumFactor = 0;
		var sumFactorWithCap = 0;
		$.each(valuesByMonth, function(index, elem) {
			var month = elem.month;
			var value = elem.value;
			if (result.length == 0) {
				result.push({ month : month, value : value, factor : null, factorWithCap : null });
			} else {
				var previous = result[result.length-1];
				var factor = round(((value - previous.value) / previous.value * 100), 2); 
				var factorWithCap = round(Math.min(factor, ALLIANZ_MONITOR.cap), 2);
				result.push({month : month, value : value, factor : factor, factorWithCap : factorWithCap });
				sumFactor += factor;
				sumFactorWithCap += factorWithCap;
			}
		});
		result.push({month : null, value : null, factor : sumFactor, factorWithCap : sumFactorWithCap});
		return result;
		
		function round(value, decimals) {
			var tens = Math.pow(10, decimals);
			return Math.round(value * tens) / tens;
		}
	},

	renderResponse : function(rates) {
		var t = $("#rateTemplate");
		$.each(rates, function(index, rate) {
			var rateView = t.clone();
			rateView.show();
			var fields = rateView.find("td");
			$(fields[0]).text(renderIfNotNull(rate.month));
			$(fields[1]).text(renderIfNotNull(rate.value));
			$(fields[2]).text(renderIfNotNull(rate.factor));
			$(fields[3]).text(renderIfNotNull(rate.factorWithCap));
			t.parent().append(rateView);
		});
		
		function renderIfNotNull(value) {
			return value != null ? value : "";
		}
	},

	requestData : function(fy, fm, ty, tm) {
		$
				.ajax(
						{
							type : "GET",
							url : "http://query.yahooapis.com/v1/public/yql?format=json&diagnostics=true&q="
									+ encodeURIComponent(this.buildQueryString(fy, fm, ty, tm)),
							dataType : "jsonp"
						}).done(function(msg) {
					ALLIANZ_MONITOR.handleResponse(msg);
				});
	}
};

$(document).ready(function() {
	
	function getParam(p) {
		var v = $.url().param(p);
		$("[name=" + p + "]").val(v);
		return parseInt(v);
	}
	
	var url = $.url();
	var fy = getParam("fromYear");
	var fm = getParam("fromMonth");
	var ty = getParam("toYear"); 
	var tm = getParam("toMonth");
	
	$("fromYear")
	
	if (fy > 1000 && fm > 0 && ty > 1000 && tm > 0) {
		ALLIANZ_MONITOR.requestData(fy, fm, ty, tm);
	}

//	$("#submitButton").on("click", function(e) {
//		ALLIANZ_MONITOR.handleResponse(
//
//				{"query":{"count":16,"created":"2013-10-06T10:23:29Z","lang":"null","diagnostics":{"publiclyCallable":"true","url":{"execution-start-time":"0","execution-stop-time":"525","execution-time":"525","content":"http://ichart.finance.yahoo.com/table.csv?s=%5ESTOXX50E&amp;a=04&amp;b=01&amp;c=2012&amp;d=06&amp;e=01&amp;f=2013&amp;g=m&amp;ignore=.csv"},"user-time":"526","service-time":"525","build-version":"0.2.1867"},"results":{"row":[{"col0":"Date","col1":"Open","col2":"High","col3":"Low","col4":"Close","col5":"Volume","col6":"Adj Close"},{"col0":"2013-07-01","col1":"2622.62","col2":"2622.62","col3":"2622.62","col4":"2622.62","col5":"000","col6":"2622.62"},{"col0":"2013-06-03","col1":"2747.74","col2":"2755.70","col3":"2511.83","col4":"2602.59","col5":"000","col6":"2602.59"},{"col0":"2013-05-01","col1":"2711.74","col2":"2835.87","col3":"2711.74","col4":"2769.64","col5":"000","col6":"2769.64"},{"col0":"2013-04-02","col1":"2679.80","col2":"2717.38","col3":"2553.49","col4":"2712.00","col5":"000","col6":"2712.00"},{"col0":"2013-03-01","col1":"2616.75","col2":"2744.70","col3":"2612.46","col4":"2624.02","col5":"000","col6":"2624.02"},{"col0":"2013-02-01","col1":"2710.08","col2":"2710.08","col3":"2570.52","col4":"2633.55","col5":"000","col6":"2633.55"},{"col0":"2013-01-02","col1":"2711.25","col2":"2749.27","col3":"2691.45","col4":"2702.98","col5":"000","col6":"2702.98"},{"col0":"2012-12-03","col1":"2582.36","col2":"2659.95","col3":"2582.36","col4":"2635.93","col5":"000","col6":"2635.93"},{"col0":"2012-11-01","col1":"2533.87","col2":"2581.69","col3":"2427.32","col4":"2575.25","col5":"000","col6":"2575.25"},{"col0":"2012-10-01","col1":"2498.81","col2":"2574.19","col3":"2456.54","col4":"2503.64","col5":"000","col6":"2503.64"},{"col0":"2012-09-03","col1":"2463.17","col2":"2594.56","col3":"2436.54","col4":"2454.26","col5":"000","col6":"2454.26"},{"col0":"2012-08-01","col1":"2333.38","col2":"2490.27","col3":"2263.36","col4":"2440.71","col5":"000","col6":"2440.71"},{"col0":"2012-07-02","col1":"2292.08","col2":"2340.31","col3":"2151.54","col4":"2325.72","col5":"000","col6":"2325.72"},{"col0":"2012-06-01","col1":"2068.66","col2":"2264.72","col3":"2068.66","col4":"2264.72","col5":"000","col6":"2264.72"},{"col0":"2012-05-01","col1":"2306.69","col2":"2306.69","col3":"2116.18","col4":"2118.94","col5":"000","col6":"2118.94"}]}}}
//
//);
//	});
});
