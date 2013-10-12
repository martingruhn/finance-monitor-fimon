describe("Rentenmonitor", function() {
	var monitor = null;
	var valueByMonth = [{
		month : "2012-05",
		value : 2118.94
	}, {
		month : "2012-06",
		value : 2068.66
	}];

	beforeEach(function() {
		monitor = new mgruhn.RentenMonitor(6, 4.3);
	});

	it("should transform YQL response to valueByMonth", function() {
		var result = monitor.toValueByMonth(mgruhn.TestData.yqlResponse, 6);
		expect(result).toEqual(valueByMonth);
	});

	it("should calculate rates for given valueByMonth JSON", function() {
		var rates = monitor.calculateRates(valueByMonth);
		console.log(JSON.stringify(rates));
		expect(rates.length).toEqual(3);
		expect(rates[2].factor).toEqual(-2.37);
	});
	
}); 