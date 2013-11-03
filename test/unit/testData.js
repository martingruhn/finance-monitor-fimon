var mgruhn = mgruhn || {};

/**
 * Response for 2012-05-01 to 2012-06-01
 * <code> 
 * select * from csv where url='http://ichart.finance.yahoo.com/table.csv?s=%5ESTOXX50E&amp;a=4&amp;b=01&amp;c=2012&amp;d=5&amp;e=01&amp;f=2012&amp;g=m&amp;ignore=.csv' and columns='date,open,high,low,close,volume,adjclose'
 * <code>
 */
mgruhn.TestData = {
	yqlResponse : {
		"query" : {
			"count" : 3,
			"created" : "2013-10-13T09:21:06Z",
			"lang" : "en-US",
			"results" : {
				"row" : [ {
					"date" : "Date",
					"open" : "Open",
					"high" : "High",
					"low" : "Low",
					"close" : "Close",
					"volume" : "Volume",
					"adjclose" : "Adj Close"
				}, {
					"date" : "2012-06-01",
					"open" : "2068.66",
					"high" : "2068.66",
					"low" : "2068.66",
					"close" : "2068.66",
					"volume" : "000",
					"adjclose" : "2068.66"
				}, {
					"date" : "2012-05-01",
					"open" : "2306.69",
					"high" : "2306.69",
					"low" : "2116.18",
					"close" : "2118.94",
					"volume" : "000",
					"adjclose" : "2118.94"
				} ]
			}
		}
	}
};