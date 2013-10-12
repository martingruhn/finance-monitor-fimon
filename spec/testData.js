var mgruhn = mgruhn || {};

/**
 * Response for select * from csv where
 * url='http://ichart.finance.yahoo.com/table.csv?s=%5ESTOXX50E&amp;a=4&amp;b=01&amp;c=2012&amp;d=5&amp;e=01&amp;f=2012&amp;g=m&amp;ignore=.csv'
 * i.e. from 05 to 06.2012
 */
mgruhn.TestData = {
	yqlResponse : {
		"query" : {
			"count" : 3,
			"created" : "2013-10-12T09:58:50Z",
			"lang" : "en-US",
			"diagnostics" : {
				"publiclyCallable" : "true",
				"url" : {
					"execution-start-time" : "1",
					"execution-stop-time" : "143",
					"execution-time" : "142",
					"content" : "http://ichart.finance.yahoo.com/table.csv?s=%5ESTOXX50E&amp;a=4&amp;b=01&amp;c=2012&amp;d=5&amp;e=01&amp;f=2012&amp;g=m&amp;ignore=.csv"
				},
				"user-time" : "144",
				"service-time" : "142",
				"build-version" : "0.2.1867"
			},
			"results" : {
				"row" : [ {
					"col0" : "Date",
					"col1" : "Open",
					"col2" : "High",
					"col3" : "Low",
					"col4" : "Close",
					"col5" : "Volume",
					"col6" : "Adj Close"
				}, {
					"col0" : "2012-06-01",
					"col1" : "2068.66",
					"col2" : "2068.66",
					"col3" : "2068.66",
					"col4" : "2068.66",
					"col5" : "000",
					"col6" : "2068.66"
				}, {
					"col0" : "2012-05-01",
					"col1" : "2306.69",
					"col2" : "2306.69",
					"col3" : "2116.18",
					"col4" : "2118.94",
					"col5" : "000",
					"col6" : "2118.94"
				} ]
			}
		}
	}
};