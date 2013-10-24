var mgruhn = mgruhn || {};

$(document).ready(function() {
	
	var url = $.url();
	var year = getParam("year");
	var month = getParam("month");
	var cap = getParam("cap") || 4.3;
	
	if (year > 1000 && month > 0 && month <= 12) {
		var mon = new mgruhn.KursMonitor();
		var monHtml = new mgruhn.KursMonitorHtml(mon);
		
		mon.getRatesFor(year, month, cap, function(rates, yqlQuery) {
			monHtml.renderRates(rates);
			monHtml.renderYqlQuery(yqlQuery);
			monHtml.renderInfoLinks(year, month);
		});
	}

	function getParam(p) {
		var v = $.url().param(p);
		if (v > 0) $("[name=" + p + "]").val(v);
		try {
			return parseFloat(v);
		} catch(e) {
			return 0;
		}
	}
	
});

mgruhn.KursMonitorHtml = function(kursMonitor) {
	
	var templateLinkYahooHtml = "http://de.finance.yahoo.com/q/hp?s=^STOXX50E&b={fd}&a={fm}&c={fy}&e={td}&d={tm}&f={ty}&g=m";
	var templateLinkYahooCsv = "http://ichart.finance.yahoo.com/table.csv?s=%5ESTOXX50E&b={fd}&a={fm}&c={fy}&e={td}&d={tm}&f={ty}&g=m&ignore=.csv";

	this.renderYqlQuery = function(yqlQuery) {
		$("#yqlQuery").text(yqlQuery);
	};

	this.renderInfoLinks = function(year, month, yqlQuery) {
		var range = kursMonitor.toFromTo(year, month);
		$("#linkYahooHtml").attr("href", kursMonitor.formatFromToDates(templateLinkYahooHtml, range.from, range.to));
		$("#linkYahooCsv").attr("href", kursMonitor.formatFromToDates(templateLinkYahooCsv, range.from, range.to));
	};

	this.renderRates = function(rates) {
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
		 
	};
	
	function renderIfNotNull(value) {
		return value != null ? value : "";
	}
	
};


