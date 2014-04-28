'use strict';

/* Filters */

var app = angular.module('myApp.filters', [])

app.filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }]);


app.filter('startFrom', function () {
	return function (input, start) {
	  start =+start;
	  if (input !== null) {
	  	return input.slice(start);
	  } 
  	  	
	}
  });
