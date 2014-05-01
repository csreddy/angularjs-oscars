'use strict';
/* Controllers */

var app = angular.module('myApp.controllers', []);
app.constant('RESTURL', 'http://'+ location.hostname + ':8003');

app.controller('MainCtrl', ['$scope', 'dataService', 'flash', 'mySharedService','facetSearchService', 'facetSelectionService', 'RESTURL',  function($scope, dataService, flash, sharedService, facetSearch, facet, RESTURL) {
	  $scope.RESTURL =  RESTURL;
	  $scope.loading = true;
	  $scope.data = null;
	  $scope.resultCount = 0;
	  $scope.currentPage = 0;
	  $scope.pageSize = 10;
	  $scope.numOfPages = function () {
		  return Math.ceil($scope.resultCount / $scope.pageSize);
	  }
	  $scope.selectedFacets = []
	  var query = $scope.q || "";
	   
	   $scope.payload = {"query":{"qtext": query}};	
	   
	  $scope.getSearchResult = function (query, payload) {
		var query = query || "";
		dataService.postData($scope.payload).then(function (dataResponse) {
  		$scope.data = dataResponse.data.results;
		
		$scope.loading = false;
		$scope.resultCount = $scope.data.length;
		 flash.success = 'Returned ' + $scope.resultCount  + ' results';

		getContent($scope.data);

  		});	
		$scope.currentPage = 0;
	//	console.log($scope.data);
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
		$scope.payload = facetSearch.payload;
		$scope.getSearchResult($scope.q, $scope.payload);
	//	flash.success = 'Returned ' + $scope.resultCount  + ' results';
		if ($scope.selectedFacets.indexOf(facetSearch.facetName) === -1) {
			$scope.selectedFacets.push(facetSearch.facetName);		
		}
		console.log('selected facet = ' + $scope.selectedFacets);
	  });
		
	  $scope.unselectFacet = function (index) {
		  var andQueryArray = $scope.payload["query"]["and-query"]["queries"];
		 andQueryArray.splice(index, 1);
		$scope.payload["query"]["and-query"]["queries"] = andQueryArray;
		 $scope.getSearchResult($scope.q, $scope.payload);
		 
		 facet.sendPayload($scope.payload);
		 
		  $scope.selectedFacets.splice(index, 1);
	  }
	  
	  // extract matching-text from a nested json object and add property resultText to $scope.data
	  function getContent(results) {
		  angular.forEach(results, function(content, parentKey){
		 var resultContent = "";
		   parentKey.resultContent = {};
			  angular.forEach(content.matches, function(matchText, key){
				  if (matchText instanceof Object) {
					  if (matchText["match-text"] instanceof Object) {
						  angular.forEach(matchText["match-text"], function(highlightText, key){
							  if (highlightText instanceof Object) {
								 resultContent = resultContent + " " + highlightText.highlight;
							  } else{
								  resultContent = resultContent + " " + highlightText;
							  }
						  });
					  }				
				  } else {
					   resultContent = resultContent + " " + matchText[key];
				  }
			  });
			    results[parentKey].resultContent =  resultContent;
		  });
	  }
  }]);
  
  app.controller('SidebarCtrl', ['$scope', 'dataService', 'mySharedService', 'facetSearchService', 'facetSelectionService', function ($scope, dataService, sharedService, facetSearch, facet) {
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
	    	  dataService.postData($scope.payload).then(function (dataResponse) {
	    		 $scope.facets = dataResponse.data.facets;
	  			 delete $scope.facets['centroid']; // delete centroid from facets props 
	    		 $scope.facetNames = Object.getOwnPropertyNames($scope.facets) || [];
	    	  });
		}
	
	
	$scope.$watch('q', function () {
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
		  var f = this.facetValue.name;
		  if (!$scope.payload["query"].hasOwnProperty("and-query")) {		
			  $scope.payload["query"]["and-query"] = {};
			  $scope.payload["query"]["and-query"] = {"queries": []};
			  $scope.payload["query"]["and-query"]["queries"].push(andQuery);
		  } else {
			  var exitLoop = {};
			  try {
				  angular.forEach($scope.payload["query"]["and-query"]["queries"], function(obj, key){
					  if (obj["range-constraint-query"]["value"][0] !== f) {
					  	  $scope.payload["query"]["and-query"]["queries"].push(andQuery);
						  throw exitLoop;
					  } else {
						  console.warn("already selected");
					  }
				  });

			  } catch (e) {
			  	if (e !== exitLoop) throw e;
			  } 			  
		  }


		  facetSearch.sendPayload($scope.payload, this.constraintName, this.facetValue.name );
		 
		  $scope.getFacetResult();	  
	  }
	  
  }]);

  
  // for future enhancements
  app.controller('MyCtrl2', ['$scope', function($scope) {
	  console.log("from MyCtrl2");
    var query = $scope.q ;
  }]);
  


