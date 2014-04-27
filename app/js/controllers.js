'use strict';

/* Controllers */

var app = angular.module('myApp.controllers', []);


app.controller('MyCtrl1', ['$scope', 'dataService', 'flash', 'facetList', 'mySharedService','facetSearchService',  function($scope, dataService, flash, facetList, sharedService, facetSearch) {
	  console.log("from MyCtrl1");
	  $scope.loading = true;
	  $scope.data = null;
	//  $scope.q = "bob";
	  var query = $scope.q || "";
	  $scope.init = function () {
		  				sharedService.prepForBroadcast(query);
		 	 			dataService.getData(query).then(function (dataResponse) {
							console.log(dataResponse);
				  		$scope.data = dataResponse.data.results;
					//	$scope.facets = dataResponse.data.facets;
						 $scope.loading = false;
					//	console.log($scope.data);
		  		  		});
	  }
	  console.log("query = " + query);
	  $scope.search = function (query) {
		  console.log('clicked search()');
		  sharedService.prepForBroadcast(query);
		  
		 var query = $scope.q || "";
		 var payload = {"query":{"qtext": query}};	
		 dataService.postData(payload).then(function (dataResponse) {
  		 $scope.data = dataResponse.data.results;
		 $scope.loading = false;
	//	 console.log($scope.data);
		 flash.success = 'Returned ' + $scope.data.length + ' results';
		 });
	  }
	  
	  $scope.searchWithPayload = function (payload) {
		  console.log('clicked searchWithPayload()');
		 dataService.postData(payload).then(function (dataResponse) {
  		 $scope.data = dataResponse.data.results;
		 $scope.loading = false;
	//	 console.log($scope.data);
		 flash.success = 'Returned ' + $scope.data.length + ' results';
		 });
	  }
	  
	  $scope.$on('facetClick', function () {
		 var payload =  facetSearch.payload;
		   $scope.searchWithPayload(payload);
	  });
	

  }]);
  
  app.controller('sidebarCtrl', ['$scope', 'dataService', 'mySharedService', 'facetSearchService', function ($scope, dataService, sharedService, facetSearch) {
	  console.log('in sidebarCtrl');
	  var query = ""
	  var payload = {"query":{"qtext": query}};	
	  $scope.$on('handleBroadcast', function() {
	      $scope.q = sharedService.message;
	  	 query = $scope.q;
	  	 payload = {"query":{"qtext": query}};	
	    });  
	
	$scope.$watch('q', function () {
		console.log("q changed");
//		console.log("payload ======== " + JSON.stringify(payload));	
  	  dataService.postData(payload).then(function (dataResponse) {
  		 console.log('response = '+dataResponse);
  		 $scope.facets = dataResponse.data.facets;
		 delete $scope.facets['centroid']; // delete centroid from facets props 
  		 $scope.facetNames = Object.getOwnPropertyNames($scope.facets) || [];
  		//  console.log($scope.facetNames);	 
  	  });
	}, true);	 
		 	
		
	  dataService.postData(payload).then(function (dataResponse) {
		 console.log('response = '+dataResponse);
		 $scope.facets = dataResponse.data.facets;
		  delete $scope.facets['centroid']; // delete centroid from facets props 
		 $scope.facetNames = Object.getOwnPropertyNames($scope.facets) || [];
		 //$scope.facetNames.splice($scope.facetNames.indexOf("centroid"), 1);	
		  console.log($scope.facetNames);	 
	  });

		  
	  $scope.facetSearch = function () {
		  console.log('in facetSearch()');
			var	andQuery = {
		  	"range-constraint-query": {
		  		"constraint-name": this.constraintName,
				"value": [ this.facetValue.name ]
		  	}
		  };
		  
		  if (!payload["query"].hasOwnProperty("and-query")) {		
			  payload["query"]["and-query"] = {};
			  payload["query"]["and-query"] = {"queries": []};
			  payload["query"]["and-query"]["queries"].push(andQuery);
		  } else {
		  	  payload["query"]["and-query"]["queries"].push(andQuery);
		  }
		  
			 facetSearch.sendResults(payload);
	   	  dataService.postData(payload).then(function (dataResponse) {
	   		 console.log('response = '+dataResponse);
	   		 $scope.facets = dataResponse.data.facets;
			  delete $scope.facets['centroid']; // delete centroid from facets props 
	   		 $scope.facetNames = Object.getOwnPropertyNames($scope.facets) || [];
	   		 //$scope.facetNames.splice($scope.facetNames.indexOf("centroid"), 1);	
	   		  console.log($scope.facetNames);	 
	   	  });
		  console.log("payload when clicked= " + JSON.stringify(payload));
		  
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
  

