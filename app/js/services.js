'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var app = angular.module('myApp.services', []);

app.value('version', '0.1');


app.service('dataService', function($http) {

//	 $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
this.getData = function(q) {
    // $http() returns a $promise that we can add handlers with .then()
    if (q === undefined || q === null) {
    	q == "";
    }

	console.log("q = " + q);
	return $http({
        method: 'GET',
        url: 'http://localhost:8003/v1/search?format=json&options=all&q='+q
     });
 }
 
 this.postData = function (jsonPayload) {
	// console.log('postData() q = ' + q);
	 console.log('payload = ' +  JSON.stringify(jsonPayload));
	return $http({
         method: 'POST',
         url: 'http://localhost:8003/v1/search?format=json&options=all',
		 data: jsonPayload
      });
 }
});


app.factory('mySharedService', function($rootScope) {
    var sharedService = {};
    
    sharedService.message = '';

    sharedService.prepForBroadcast = function(msg) {
		console.log('from sharedService:  msg =  ' + msg);
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
	
	facetSearch.sendPayload = function (payload) {
		console.log("from facetSearchService: payload = " + JSON.stringify(payload));
		 this.payload = payload;
		 $rootScope.$broadcast('clickFacet');
	}
	return facetSearch;
	
});




