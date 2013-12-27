xdescribe("The Yahoo! Finance API (CSV over YQL)", function() {
	
	var givenValueByMonth2012 = {5: 2118.94, 6: 2264.72, 7: 2325.72,	8: 2440.71,	9: 2454.26,	10: 2503.64} ;
	
	it("should return expected values for May to October in 2012", function() {
		var actualValueByMonth = {};
		runs(function() {
			for (var m in givenValueByMonth2012) {
				var month = m-1;
				var from = new Date(2012, month, 1);
				var to = new Date(moment({y: 2012, M: month, d: 1}).add('months', 1).date(0));
				monitor.queryRatesFromYahooFinance(from, to, function(result) {
					var date = result.query.results.row[1].date;
					var close = parseFloat(result.query.results.row[1].close);
					var month = parseInt(date.split("-")[1]);
					actualValueByMonth[month] = close;
				});
			};
		});
		
		waitsFor(function() {
			return Object.keys(givenValueByMonth2012).length === Object.keys(actualValueByMonth).length;
		}, 3000);
		
		runs(function() {
			expect(actualValueByMonth).toEqual(givenValueByMonth2012);
		});
	});
});

describe("A KursMonitor", function() {
	var monitor = null;
	var givenValueByMonth = [{
		month : "2012-05",
		value : 2118.94
	}, {
		month : "2012-06",
		value : 2068.66
	}];
	
	beforeEach(function() {
        var mockAjaxHandler = {
              jsonp : function(url, successCallback, errorCallback) {
                  successCallback(mgruhn.TestData.yqlResponse);
              }      
          };
		monitor = new mgruhn.KursMonitor(mockAjaxHandler);
	});
	
	
	it("should transform year and reference date to proper from to", function() {
		var fromTo = monitor.toFromTo(2013, 06);
		expect(fromTo.from).toEqual(new Date(2012, 4, 1));
		expect(fromTo.to).toEqual(new Date(2013, 4, 31));
	});

	it("should transform YQL response to valueByMonth", function() {
		var result = monitor.toValueByMonth(mgruhn.TestData.yqlResponse);
		expect(result).toEqual(givenValueByMonth);
	});

	it("should calculate rates for given valueByMonth JSON", function() {
		var rates = monitor.calculateRates(givenValueByMonth, 4.3);
		console.log(JSON.stringify(rates));
		expect(rates.length).toEqual(3);
		expect(rates[2].factor).toEqual(-2.37);
	});
	
	
	it("should use $.ajax to get rates and process them correctly", function() {
		monitor.getRatesFor(2012, 6, 4.3, function(rates, yqlQuery) {
			expect(rates.length).toEqual(3);
			expect(rates[2].factor).toEqual(-2.37);
		});
	});
	
}); 