var mgruhn = mgruhn || {};


mgruhn.RentenMonitor = function(pCap) {

	var cap = pCap || 4.3;
	var self = this;

	templateYql = "select * from csv where url='http://ichart.finance.yahoo.com/table.csv?s=%5ESTOXX50E&amp;a={fm}&amp;b=01&amp;c={fy}&amp;d={tm}&amp;e=01&amp;f={ty}&amp;g=m&amp;ignore=.csv'";

	this.getRatesFor = function(fy, fm, ty, tm, callback) {
		var yqlQuery = this.buildQueryString(fy, fm, ty, tm);
		
		$.ajax({
			type : "GET",
			url : "http://query.yahooapis.com/v1/public/yql?format=json&diagnostics=true&q="
					+ encodeURIComponent(yqlQuery),
			dataType : "jsonp"
		}).done(function(msg) {
			var valueByMonth = self.toValueByMonth(msg, tm);
			var rates = self.calculateRates(valueByMonth);
			if (callback) callback(rates, yqlQuery);
		});
	};
	
	/** 
	 * Beware: 
	 * 1. Yahoo's January is 0
	 * 2. it seems like if the first day of month is not a working day, then that month is omitted
	 *    hence workaround: go one month further and cut it off later 
	 */
	this.buildQueryString = function(fy, fm, ty, tm) {
		var query = this.formatFromToDates(templateYql, fy, fm, ty, tm);
		return query;
	};
	
	this.formatFromToDates = function(template, fy, fm, ty, tm) {
		return template.replace("{fy}", fy).replace("{fm}", fm-1).replace("{ty}", ty).replace("{tm}", tm);
	};

	this.toValueByMonth = function(jsonCsv, toMonth) {
		var originalRow = jsonCsv.query.results.row;
		var rows = jsonCsv.query.results.row.slice(1, originalRow.length);
		var result = $.map(rows, function(r) {
			var month = r.col0.substring(0, 7);
			var value = parseFloat(r.col6);
			return {
				month : month,
				value : value
			};
		}).reverse();
		// workaround: cut off superfluous month
		if (parseInt(result[result.length-1].month.split("-")[1]) > toMonth) {
			result.pop();
		};
		return result;
	};

	this.calculateRates = function(valuesByMonth) {
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
	};

}; 
