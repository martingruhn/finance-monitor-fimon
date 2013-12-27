var mgruhn = mgruhn || {};
mgruhn.KursMonitor = function(jsonpDelegatee) {
  
    this.jsonpDelegatee = jsonpDelegatee;

	var self = this;

	templateYql = "select * from csv where "
			+ "url='http://ichart.finance.yahoo.com/table.csv?s=%5ESTOXX50E&amp;c={fy}&amp;a={fm}&amp;b={fd}&amp;f={ty}&amp;d={tm}&amp;e={td}&amp;g=m&amp;ignore=.csv' "
			+ "and columns='date,open,high,low,close,volume,adjclose'";

	this.getRatesFor = function(year, referenceMonth, cap, callback) {
		var fromTo = this.toFromTo(year, referenceMonth);
		this.queryRatesFromYahooFinance(fromTo.from, fromTo.to, function(msg, yqlQuery) {
			var valueByMonth = self.toValueByMonth(msg);
			var rates = self.calculateRates(valueByMonth, cap);
			if (callback) callback(rates, yqlQuery);
		});
	};
	
	this.toFromTo = function(year, referenceMonth) {
		var previousMonthAsIndex = referenceMonth - 2;
		var from = new Date(year-1, previousMonthAsIndex, 1);
		var to = lastDayOfMonth(new Date(year, previousMonthAsIndex));
		return {from: from, to: to};
	};
	
	function lastDayOfMonth(date) {
		return moment(date).add('months', 1).date(0).toDate();
	};
	
	this.queryRatesFromYahooFinance = function(from, to, callback) {
		var yqlQuery = this.buildQueryString(from, to);
		var queryUrl = "http://query.yahooapis.com/v1/public/yql?format=json&diagnostics=false&q="
			+ encodeURIComponent(yqlQuery);
		this.jsonpDelegatee.jsonp(queryUrl, function(jsonResponse) {
            if (callback) callback(jsonResponse, yqlQuery);
        }, function(errorMessage) {
            console.warn("Failure calling yahooapi: " + errorMessage);
        });
	};
	
	this.buildQueryString = function(from, to) {
		var query = this.formatFromToDates(templateYql, from, to);
		return query;
	};
	
	this.formatFromToDates = function(template, from, to) {
		return template //
			.replace("{fy}", from.getFullYear()) //
			.replace("{fm}", from.getMonth()) //
			.replace("{fd}", from.getDate()) //
			.replace("{ty}", to.getFullYear()) //
			.replace("{tm}", to.getMonth()) //
			.replace("{td}", to.getDate());
	};

	/** See monitorSpec.js input/output example */
	this.toValueByMonth = function(jsonCsv) {
		var rowsWithHeader = jsonCsv.query.results.row;
		var dataRows = jsonCsv.query.results.row.slice(1, rowsWithHeader.length);
		return dataRows.map(function(r) {
			var month = r.date.substring(0, 7);
			var value = parseFloat(r.close);
			return {
				month : month,
				value : value
			};
		}).reverse();
	};

	/**
	 * @param valuesByMonth sth. like [{ month : "2012-05", value : 2118.94}, {month : "2012-06", value : 2068.66}]
	 */
	this.calculateRates = function(valuesByMonth, cap) {
		var result = new Array();
		var sumFactor = 0;
		var sumFactorWithCap = 0;
		for (var i=0; i<valuesByMonth.length; i++) {
			var elem = valuesByMonth[i];
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
		};
		sumFactor = round(sumFactor, 2);
		sumFactorWithCap = round(sumFactorWithCap, 2);
		result.push({month : null, value : null, factor : sumFactor, factorWithCap : sumFactorWithCap});
		return result;
		
	};
	
	function round(value, decimals) {
		var tens = Math.pow(10, decimals);
		return Math.round(value * tens) / tens;
	}
	
}; 
