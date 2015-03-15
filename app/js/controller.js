var kursMonitorApp = angular.module('kursMonitor', ['ngResource', 'ngRoute']);

kursMonitorApp.config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true);
} ]);

kursMonitorApp.controller('kursMonitorCtrl', function($scope, $location, $http) {
	var monitorService = new mgruhn.KursMonitor(this);
	
	var templateLinkYahooHtml = "http://de.finance.yahoo.com/q/hp?s=^STOXX50E&b={fd}&a={fm}&c={fy}&e={td}&d={tm}&f={ty}&g=m";
	var templateLinkYahooCsv = "http://ichart.finance.yahoo.com/table.csv?s=%5ESTOXX50E&b={fd}&a={fm}&c={fy}&e={td}&d={tm}&f={ty}&g=m&ignore=.csv";
	
	var params = $location.search();
	
	$scope.year = params.year || "2015";
	$scope.referenceMonth = params.refMonth || "6";
	$scope.cap = params.cap || "3.8";
	$scope.rates = [];
	$scope.yqlQuery = "...";
	$scope.yahooHtmlHref = "#";
	$scope.yahooCsvHref = "#";

	$scope.calculateRates = function() {
		$scope.rates = [];
                setUrlParams();
		renderInfoLinks($scope.year, $scope.referenceMonth);
		monitorService.getRatesFor($scope.year, $scope.referenceMonth, $scope.cap, function(rates, yqlQuery) {
			$scope.rates = rates;
			$scope.yqlQuery = yqlQuery;
		});
	};
	
	function setUrlParams() {
		$location.search({
			year: $scope.year, 
			refMonth: $scope.referenceMonth, 
			cap: $scope.cap
		});
	};
	
	function renderInfoLinks(year, month) {
		var range = monitorService.toFromTo(year, month);
		$scope.yahooHtmlHref = monitorService.formatFromToDates(templateLinkYahooHtml, range.from, range.to);
		$scope.yahooCsvHref = monitorService.formatFromToDates(templateLinkYahooCsv, range.from, range.to);
	};

	this.jsonp = function(url, successCallback, errorCallback) {
        $http.jsonp(url + "&callback=JSON_CALLBACK")
        .success(function(data, status, headers, config) {
            successCallback(data);
        }).error(function(data, status, headers, config) {
            errorCallback("Failure calling yahooapi: " + status);
        });
	};
	
	if (params.year && params.refMonth && params.cap) {
		$scope.calculateRates();
	};
	
});
