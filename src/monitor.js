var ALLIANZ_MONITOR = {

	yql : "select * from csv where url='http://ichart.finance.yahoo.com/table.csv?s=%5ESTOXX50E&amp;a={fm}&amp;b=01&amp;c={fy}&amp;d={tm}&amp;e=01&amp;f={ty}&amp;g=m&amp;ignore=.csv'",
	cap : 4.3,
	toMonth : 0,

	handleResponse : function(msg) {
		var valueByMonth = this.toValueByMonth(msg);
		var rates = this.calculateRates(valueByMonth);
		this.render(rates);
	},

	/* returns s.th. like [{month: "06" , value : 2716.03}] */
	toValueByMonth : function(jsonCsv) {
		// {"col0":"Date","col1":"Open","col2":"High","col3":"Low","col4":"Close","col5":"Volume","col6":"Adj Close"}
		// {"col0":"2013-07-01","col1":"2622.62","col2":"2622.62","col3":"2622.62","col4":"2622.62","col5":"000","col6":"2622.62"}
		var originalRow = jsonCsv.query.results.row;
		var rows = jsonCsv.query.results.row.slice(1, originalRow.length);
		var result = $.map(rows, function(r) {
			var month = r.col0.substring(0,7);
			var value = parseFloat(r.col6);
			return {month: month, value : value};
		}).reverse();
		// workaround: cut off superfluous month
		if (parseInt(result[result.length-1].month.split("-")[1]) > this.toMonth) {
			result.pop();
		};
		return result;
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
		sumFactor = round(sumFactor, 2);
		sumFactorWithCap = round(sumFactorWithCap, 2);
		result.push({month : null, value : null, factor : sumFactor, factorWithCap : sumFactorWithCap});
		return result;
		
		function round(value, decimals) {
			var tens = Math.pow(10, decimals);
			return Math.round(value * tens) / tens;
		}
	},

	render : function(rates) {
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
		$.ajax({
			type : "GET",
			url : "http://query.yahooapis.com/v1/public/yql?format=json&diagnostics=true&q="
					+ encodeURIComponent(this.buildQueryString(fy, fm, ty, tm)),
			dataType : "jsonp"
		}).done(function(msg) {
			ALLIANZ_MONITOR.handleResponse(msg);
		});
	},
	
	buildQueryString : function(fy, fm, ty, tm) {
		/* beware: 
		 * 1. yahoo's January is 0
		 * 2. it seems like if the first day of month is not a working day, then that month is omitted
		 *    hence workaround: go one month further and cut it off later 
		 */
		var query=this.yql.replace("{fy}", fy).replace("{fm}", fm-1).replace("{ty}", ty).replace("{tm}", tm);
		this.toMonth = tm;
		console.log(query);
		return query;
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
	
	if (fy > 1000 && fm > 0 && ty > 1000 && tm > 0) {
		ALLIANZ_MONITOR.requestData(fy, fm, ty, tm);
	}

});
