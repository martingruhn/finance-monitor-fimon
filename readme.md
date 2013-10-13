**Transparency for the pension product IndexSelect of the Allianz Group**

This application shows the development of the stock market index EURO STOXX 50&reg; and its impact on a pension product called [IndexSelect](https://www.allianz.de/produkte/altersvorsorge/vorsorgekonzepte/vorsorgeIndexselect.html) offered by the [German Allianz Group](https://www.allianz.de).

Usage
--------------

Download the ZIP package, extract it somewhere on your computer, and open kursmonitor.html in your browser. From there on you need to understand German and follow the instructions (IndexSelect is a German product anyway).


Disclaimer
--------------

This application is written in Javascript and HTML. It works completely in your browser. Hovewer, it pulls stock data from Yahoo! Finance whenever you trigger calculation/display of rates for a specific time period.

Data from Yahoo! Finance is not distributed with this application nor stored permanently. This application only provides access to it using Yahoos own YQL API. Be aware that Yahoo! Finance allows to obtain data for **personal use only**. See also [related discussion on Yahoo forums](http://developer.yahoo.com/forum/General-Discussion-at-YDN/Using-Yahoo-Finance-API-Not-RSS-/1250246255000-0b82f8f0-7f48-3af2-8fe2-e73a138cbfaa) and [Yahoo! Finance Web Services Terms of Use](http://finance.yahoo.com/badges/tos).


Understand
--------------

To understand how data is pulled from Yahoo! Finance read:

Finance API:
- http://stackoverflow.com/questions/10040954/alternative-to-google-finance-api
- http://code.google.com/p/yahoo-finance-managed/wiki/YQLAPI

YQL and open data tables:
- http://developer.yahoo.com/yql/guide/yql_users_guide.html
- http://www.datatables.org/ (not used here but still interesting)


Why?
--------------

I wrote this application to understand and validate regular product information sheets the Allianz Group sends me. Furthermore, I want to be able to track the current development of the underlying stock market index. Last but not least I am practicing Javascript development -- just for fun!
