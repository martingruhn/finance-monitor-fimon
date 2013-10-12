var mgruhn = mgruhn || {};

mgruhn.RentenMonitorHtml = function(rentenMonitor) {
	
	var templateLinkYahooHtml = "http://de.finance.yahoo.com/q/hp?s=^STOXX50E&b=01&a={fm}&c={fy}&e=01&d={tm}&f={ty}&g=m";
	var templateLinkYahooCsv = "http://ichart.finance.yahoo.com/table.csv?s=%5ESTOXX50E&b=01&a={fm}&c={fy}&e=01&d={tm}&f={ty}&g=m&ignore=.csv";

	this.renderYqlQuery = function(yqlQuery) {
		$("#yqlQuery").text(yqlQuery);
	};

	this.renderInfoLinks = function(fy, fm, ty, tm, yqlQuery) {
		$("#linkYahooHtml").attr("href", rentenMonitor.formatFromToDates(templateLinkYahooHtml, fy, fm, ty, tm));
		$("#linkYahooCsv").attr("href", rentenMonitor.formatFromToDates(templateLinkYahooCsv, fy, fm, ty, tm));
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

$(document).ready(function() {
	
	var url = $.url();
	var fy = getParam("fromYear");
	var fm = getParam("fromMonth");
	var ty = getParam("toYear"); 
	var tm = getParam("toMonth");
	
	if (fy > 1000 && fm > 0 && ty > 1000 && tm > 0) {
		var mon = new mgruhn.RentenMonitor(4.3);
		var monHtml = new mgruhn.RentenMonitorHtml(mon);
		
		mon.getRatesFor(fy, fm, ty, tm, function(rates, yqlQuery) {
			monHtml.renderYqlQuery(yqlQuery);
			monHtml.renderInfoLinks(fy, fm, ty, tm);
			monHtml.renderRates(rates);
		});
	}

	function getParam(p) {
		var v = $.url().param(p);
		$("[name=" + p + "]").val(v);
		return parseInt(v);
	}
	
});
