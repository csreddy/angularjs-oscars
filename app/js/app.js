'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'angular-flash.service', 
  'angular-flash.flash-alert-directive'
]);

app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/view1'});
	$httpProvider.defaults.withCredentials = true;
	 $httpProvider.defaults.headers.post = {};
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

app.config(function (flashProvider) {
	  flashProvider.errorClassnames.push('alert-danger');
});



app.constant('facetList', {
	 "facets": {
		 "award": {
		 "name": "award",
		 "type": "range",
		 "options": {
		 "order": "",
		 "direction": "",
		 "limit": "10"
	 },
		 "label": {
		 "lang": "en",
		 "_value": "Award"
	 },
	 "front-page": "false",
	 "side-bar": "true",
	 "datatype": {
		 "collation": "http:\/\/marklogic.com\/collation\/",
		 "_value": "xs:string"
	 },
	 "qnames": {
		 "type": "element\/attribute",
		 "elem-ns": "http:\/\/marklogic.com\/wikipedia",
		 "elem": "nominee",
		 "attr-ns": "",
		 "attr": "award",
		 "field": ""
	 },
	 "fragment-scope": "",
	 "collection-prefix": "",
	 "facet": {
		 "enabled": "true",
		 "_value": "\n ",
		 "options": {
		 "order": "",
		 "direction": "",
		 "limit": "10"
	 }
	 },
	 "term-options": {
		 "case": "",
		 "punct": "punctuation-insensitive",
		 "wild": "",
		 "stem": "",
		 "diacritic": ""
	 },
	 "relative-buckets": {
	 "use": "false",
	 "bucket": [
		 {
			 "anchor": "",
			 "lt": "",
			 "ge": "",
			 "name": ""
		 }
		 ],
		 "_value": "\n "
		 },
		 "absolute-buckets": {
			 "use": "false",
			 	"bucket": [
				{
				 "anchor": "",
				 "lt": "",
				 "ge": "",
				 "name": ""
		 		}
	 		   ],
	 "_value": "\n "
	 }
	 }
	 }
	}
);

