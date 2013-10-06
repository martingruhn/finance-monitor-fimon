/*
 * See:
 * http://code.google.com/p/yahoo-finance-managed/wiki/YQLAPI
 * http://developer.yahoo.com/yql/console/?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22YHOO%22%20and%20startDate%20%3D%20%222009-09-11%22%20and%20endDate%20%3D%20%222010-03-10%22&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys
 * select * from yahoo.finance.historicaldata where symbol = "^STOXX50E" and startDate = "2009-09-11" and endDate = "2010-03-10"
 */

var ALLIANZ_MONITOR = {
		
	yql: "select * from csv where url='http://ichart.finance.yahoo.com/table.csv?s=%5ESTOXX50E&amp;a=04&amp;b=01&amp;c=2012&amp;d=06&amp;e=01&amp;f=2013&amp;g=m&amp;ignore=.csv'",
	
	test: function() {
		$.ajax({
			 type: "POST",
			 url: "http://query.yahooapis.com/v1/public/yql?q="+ encodeURIComponent(ALLIANZ_MONITOR.yql) +"&format=json&diagnostics=true",
			 dataType: "jsonp"			
		}).done(function( msg ) {
			$("#textnode").text(JSON.stringify(msg));
		});
	}
};

$( document ).ready(function() {
	ALLIANZ_MONITOR.test();
});


