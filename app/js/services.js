'use strict';

/* Services */

var app = angular.module('myApp.services', []);

app.value('version', '0.1');
app.constant('RESTURL', 'http://'+ location.hostname + ':8003');

app.service('dataService', function($http, RESTURL) {
	
// this method is never used
this.getData = function(q) {
    if (q === undefined || q === null) {
    	q == "";
    }

	console.log("q = " + q);
	return $http({
        method: 'GET',
        url: RESTURL + '/v1/search?format=json&options=all&pageLength=10&q='+q
     });
 }
 
 this.postData = function (jsonPayload) {
	return $http({
         method: 'POST',
         url: RESTURL + '/v1/search?format=json&options=all&start=1&pageLength=160',
		 data: jsonPayload
      });
 }
});


app.factory('mySharedService', function($rootScope) {
    var sharedService = {};
    
    sharedService.message = '';

    sharedService.prepForBroadcast = function(msg) {
        this.message = msg;
        this.broadcastItem();
    };

    sharedService.broadcastItem = function() {
        $rootScope.$broadcast('clickSearch');
    };

    return sharedService;
});

app.factory('facetSearchService', function ($rootScope) {
	var facetSearch = {};
	facetSearch.payload = {};
	facetSearch.constraintName = "";
	facetSearch.facetName = "";
	
	facetSearch.sendPayload = function (payload, constraintName, facetName) {
		 this.payload = payload;
		 this.constraintName = constraintName;
		 this.facetName = facetName;
		 $rootScope.$broadcast('clickFacet');
	}
	return facetSearch;
	
});


app.factory('facetSelectionService', function ($rootScope) {
	var facet = {};
	facet.payload = {};
	
	facet.sendPayload = function (payload) {
		this.payload = payload;
		$rootScope.$broadcast('unselectFacet');
	}
	return facet;
	
})




