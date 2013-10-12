var ALLIANZ_MONITOR = function() {

	var templateYql = "select * from csv where url='http://ichart.finance.yahoo.com/table.csv?s=%5ESTOXX50E&amp;a={fm}&amp;b=01&amp;c={fy}&amp;d={tm}&amp;e=01&amp;f={ty}&amp;g=m&amp;ignore=.csv'";
	var templateLinkYahooHtml = "http://de.finance.yahoo.com/q/hp?s=^STOXX50E&b=01&a={fm}&c={fy}&e=01&d={tm}&f={ty}&g=m";
	var templateLinkYahooCsv = "http://ichart.finance.yahoo.com/table.csv?s=%5ESTOXX50E&b=01&a={fm}&c={fy}&e=01&d={tm}&f={ty}&g=m&ignore=.csv";
	var cap = 4.3;
	var toMonth = 0;

	return {
		handleResponse : function(msg) {
			var valueByMonth = this.toValueByMonth(msg);
			var rates = this.calculateRates(valueByMonth);
			this.renderRates(rates);
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
			if (parseInt(result[result.length-1].month.split("-")[1]) > toMonth) {
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
					var factorWithCap = round(Math.min(factor, cap), 2);
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
	
		renderRates : function(rates) {
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
		
		handleRequest : function(fy, fm, ty, tm) {
			var yqlQuery = this.buildQueryString(fy, fm, ty, tm);
			
			this.renderInfoLinks(fy, fm, ty, tm, yqlQuery);
			
			$.ajax({
				type : "GET",
				url : "http://query.yahooapis.com/v1/public/yql?format=json&diagnostics=true&q="
						+ encodeURIComponent(yqlQuery),
				dataType : "jsonp"
			}).done(function(msg) {
				ALLIANZ_MONITOR.handleResponse(msg);
			});
		},
		
		renderInfoLinks : function(fy, fm, ty, tm, yqlQuery) {
			$("#yqlQuery").text(yqlQuery);
			$("#linkYahooHtml").attr("href", this.formatFromToDates(templateLinkYahooHtml, fy, fm, ty, tm));
			$("#linkYahooCsv").attr("href", this.formatFromToDates(templateLinkYahooCsv, fy, fm, ty, tm));
		},
	
		buildQueryString : function(fy, fm, ty, tm) {
			/* beware: 
			 * 1. yahoo's January is 0
			 * 2. it seems like if the first day of month is not a working day, then that month is omitted
			 *    hence workaround: go one month further and cut it off later 
			 */
			var query = this.formatFromToDates(templateYql, fy, fm, ty, tm);
			toMonth = tm;
			console.log(query);
			return query;
		},
		
		formatFromToDates : function(template, fy, fm, ty, tm) {
			return template.replace("{fy}", fy).replace("{fm}", fm-1).replace("{ty}", ty).replace("{tm}", tm);
		}
	};
}();

$(document).ready(function() {
	
	var url = $.url();
	var fy = getParam("fromYear");
	var fm = getParam("fromMonth");
	var ty = getParam("toYear"); 
	var tm = getParam("toMonth");
	
	if (fy > 1000 && fm > 0 && ty > 1000 && tm > 0) {
		ALLIANZ_MONITOR.handleRequest(fy, fm, ty, tm);
	}

	function getParam(p) {
		var v = $.url().param(p);
		$("[name=" + p + "]").val(v);
		return parseInt(v);
	}
	
});
