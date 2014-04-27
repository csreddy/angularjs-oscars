'use strict';

/* Controllers */

var app = angular.module('myApp.controllers', []);


app.controller('MyCtrl1', ['$scope', 'dataService', 'flash', 'mySharedService','facetSearchService',  function($scope, dataService, flash, sharedService, facetSearch) {
	  console.log("from MyCtrl1");
	  $scope.loading = true;
	  $scope.data = null;
	//  $scope.q = "bob";
	  var query = $scope.q || "";
	//   var payload = payload || {"query":{"qtext": query}};	
	   
	   $scope.payload = {"query":{"qtext": query}};	
	   
	  $scope.getSearchResult = function (query, payload) {
		  var query = query || "";
	//	  var payload  = payload || {"query":{"qtext": query}};	
		sharedService.prepForBroadcast(query);
		dataService.postData($scope.payload).then(function (dataResponse) {
		console.log(dataResponse);
  		$scope.data = dataResponse.data.results;
		$scope.loading = false;
		 flash.success = 'Returned ' + $scope.data.length + ' results';
  		});	
	  }
	    
	  $scope.init =  $scope.getSearchResult();
	  
	  console.log("query = " + query);
	  
	  $scope.search = function (query) {
		  $scope.payload.query.qtext = query;
		  console.log("when clicked search: payload = " + JSON.stringify($scope.payload));
	  	$scope.getSearchResult(query);
		// flash.success = 'Returned ' + $scope.data.length + ' results';
	  }
	  
	  $scope.$on('clickFacet', function (payload) {
		  console.log('clickFacet triggered');
		$scope.payload = facetSearch.payload;
 		dataService.postData($scope.payload).then(function (dataResponse) {
 		console.log(dataResponse);
   		$scope.data = dataResponse.data.results;
 		$scope.loading = false;
 		 flash.success = 'Returned ' + $scope.data.length + ' results';
   		});	
		 
	  });
	

  }]);
  
  app.controller('sidebarCtrl', ['$scope', 'dataService', 'mySharedService', 'facetSearchService', function ($scope, dataService, sharedService, facetSearch) {
	  console.log('in sidebarCtrl');
	  var query = ""
	 $scope.payload = {"query":{"qtext": query}};	
	  
	  $scope.init = function () {
		  $scope.payload.query.qtext = "";
		  $scope.getFacetResult();
	  }
	 
	  $scope.$on('clickSearch', function() {
	      $scope.q = sharedService.message;
	  	  query = $scope.q;
	  	   $scope.payload.query.qtext = query;
		  $scope.getFacetResult($scope.payload);
	    });  
	
		$scope.getFacetResult = function () {
		//	console.log("--------getFacetResult payload---------" + JSON.stringify(payload));
	    	  dataService.postData($scope.payload).then(function (dataResponse) {
	    	//	 console.log('response = '+dataResponse);
	    		 $scope.facets = dataResponse.data.facets;
	  			 delete $scope.facets['centroid']; // delete centroid from facets props 
	    		 $scope.facetNames = Object.getOwnPropertyNames($scope.facets) || [];
	    		//  console.log($scope.facetNames);	 
	    	  });
		}
	
	
	$scope.$watch('q', function () {
		console.log("q changed");
//		console.log("payload ======== " + JSON.stringify(payload));	
		$scope.getFacetResult();
	}, true);	 
		 	  
	  $scope.facetSearch = function () {
		  console.log('in facetSearch()');
		  console.log('BEFORE CLICK: payload = ' + JSON.stringify($scope.payload));
			var	andQuery = {
		  	"range-constraint-query": {
		  		"constraint-name": this.constraintName,
				"value": [ this.facetValue.name ]
		  	}
		  };
		  
		  if (!$scope.payload["query"].hasOwnProperty("and-query")) {		
			  $scope.payload["query"]["and-query"] = {};
			  $scope.payload["query"]["and-query"] = {"queries": []};
			  $scope.payload["query"]["and-query"]["queries"].push(andQuery);
		  } else {
		  	  $scope.payload["query"]["and-query"]["queries"].push(andQuery);
		  }
		  
		    console.log('AFTER CLICK: payload = ' + JSON.stringify($scope.payload)); 
		  facetSearch.sendPayload($scope.payload);
	   	 
		  $scope.getFacetResult();
		  
		  console.log("payload when clicked= " + JSON.stringify($scope.payload));
		  
	  }
	  
  }]);
  
  app.controller('facetSearchCtrl', ['$scope', 'dataService', function ($scope, dataService) {
	  console.log('in facetSearchCtrl');
	  var qtext = $scope.q || "";
	  var constraintName = $scope.constraintName;
	
  }]);
  
  
  app.controller('MyCtrl2', ['$scope', function($scope) {
	  console.log("from MyCtrl2");
    var query = $scope.q ;//|| "tim";
	console.log('************ q = ' + query);
  }]);
  
  app.controller('flashCtrl', ['flash',  function (flash) {
	  console.log("inside flashCtrl");	  
	  	 flash.success = "Do it live";
	  	 flash.error = 'Fail!';
  }]);
  

