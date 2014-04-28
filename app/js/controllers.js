'use strict';

/* Controllers */

var app = angular.module('myApp.controllers', []);


app.controller('MainCtrl', ['$scope', 'dataService', 'flash', 'mySharedService','facetSearchService', 'facetSelectionService',  function($scope, dataService, flash, sharedService, facetSearch, facet) {
	  console.log("from MyCtrl1");
	  $scope.loading = true;
	  $scope.data = null;
	  $scope.resultCount = 0;
	  $scope.currentPage = 0;
	  $scope.pageSize = 10;
	  $scope.numOfPages = function () {
		  return Math.ceil($scope.resultCount / $scope.pageSize);
	  }
	  $scope.selectedFacets = []
	  $scope.matchText = {};
	  var query = $scope.q || "";
	   
	   $scope.payload = {"query":{"qtext": query}};	
	   
	  $scope.getSearchResult = function (query, payload) {
		var query = query || "";
		dataService.postData($scope.payload).then(function (dataResponse) {
		console.log(dataResponse);
  		$scope.data = dataResponse.data.results;
		$scope.loading = false;
		$scope.resultCount = $scope.data.length;
		 flash.success = 'Returned ' + $scope.resultCount  + ' results';
  		});	
		$scope.currentPage = 0;
	  }
	    
	  $scope.init =  $scope.getSearchResult();
	  
	  
	  $scope.search = function (query) {
		  sharedService.prepForBroadcast(query);
		  $scope.payload.query.qtext = query;
	//	  console.log("when clicked search: payload = " + JSON.stringify($scope.payload));
	  	 $scope.getSearchResult(query);
	//	 flash.success = 'Returned ' + $scope.resultCount  + ' results';
	  }
	  
	  $scope.$on('clickFacet', function (payload) {
		  console.log('clickFacet triggered');
		$scope.payload = facetSearch.payload;
		$scope.getSearchResult($scope.q, $scope.payload);
	//	flash.success = 'Returned ' + $scope.resultCount  + ' results';
	
		$scope.selectedFacets.push(facetSearch.facetName);
		console.log('clicked facet = ' + $scope.selectedFacets);
	  });
		
	  $scope.unselectFacet = function (index) {
		  var andQueryArray = $scope.payload["query"]["and-query"]["queries"];
		 andQueryArray.splice(index, 1);
		$scope.payload["query"]["and-query"]["queries"] = andQueryArray;
		 $scope.getSearchResult($scope.q, $scope.payload);
		 
		 facet.sendPayload($scope.payload);
		 
		  $scope.selectedFacets.splice(index, 1);
	  }


  }]);
  
  app.controller('SidebarCtrl', ['$scope', 'dataService', 'mySharedService', 'facetSearchService', 'facetSelectionService', function ($scope, dataService, sharedService, facetSearch, facet) {
	  console.log('in SidebarCtrl');
	  var query = ""
	 $scope.payload = {"query":{"qtext": query}};	
	  $scope.facets = {};
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
		
		
		$scope.$on('unselectFacet', function () {
			$scope.payload = facet.payload;
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
	  

		  facetSearch.sendPayload($scope.payload, this.constraintName, this.facetValue.name );
		 
		  $scope.getFacetResult();

		  
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
  }]);
  
  app.controller('flashCtrl', ['flash',  function (flash) {
	  console.log("inside flashCtrl");	  
	  	 flash.success = "Do it live";
	  	 flash.error = 'Fail!';
  }]);
  

