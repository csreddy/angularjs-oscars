xquery version "1.0-ml";

(: Copyright 2011-2014 MarkLogic Corporation.  All Rights Reserved. :)

import module namespace searchmodq = "http://marklogic.com/rest-api/models/search-model-query"
    at "/MarkLogic/rest-api/models/search-model-query.xqy";

import module namespace rest = "http://marklogic.com/appservices/rest" 
  at "/MarkLogic/appservices/utils/rest.xqy";
  
import module namespace conf = "http://marklogic.com/rest-api/endpoints/config"
    at "/MarkLogic/rest-api/endpoints/config.xqy";
  
import module namespace sut = "http://marklogic.com/rest-api/lib/search-util"
    at "/MarkLogic/rest-api/lib/search-util.xqy";

import module namespace eput = "http://marklogic.com/rest-api/lib/endpoint-util"
    at "/MarkLogic/rest-api/lib/endpoint-util.xqy";

import module namespace logger = "http://marklogic.com/rest-api/logger"
    at "/MarkLogic/rest-api/lib/logger.xqy";

declare default function namespace "http://www.w3.org/2005/xpath-functions";
declare option xdmp:mapping "false";

declare option xdmp:transaction-mode "auto";

let $rule      := conf:get-search-query-request-rule()
let $headers   := eput:get-request-headers()
let $accept    := eput:get-accept-types($headers)
let $method    := eput:get-request-method($headers)
let $params-in := eput:get-request-params($rule,$method,$headers)
let $env       := eput:response-callback-map(eput:response-type-callback#1)
let $params    := eput:check-param-names(
    $rule, $env, $params-in, $method, "^(trans:)"
    )
return (
    logger:dump-request-environment((sut:log-effective-options#1,searchmodq:log-cts-query#1), $params-in),

    if (empty($accept)) then ()
    else if ($accept = ("application/json", "text/json", "application/xml", "text/xml")) then
        let $view := map:get($params,"view")
        return
            if (not($view eq "none")) then ()
            else error((),"REST-UNSUPPORTEDPARAM",
                "Can use the 'none' value for the 'view' parameter only with multipart/mixed accept")
    else if (starts-with(head($accept),"multipart/mixed"))
    then map:put($env,"add-header",eput:add-response-header#2)
    else error((), "REST-UNACCEPTABLETYPE", string-join($accept,", ")),

    if ($method eq "GET") then
        let $response := searchmodq:search-get($headers,$params,$env)
        return
		if (exists($response)) then 	
		(eput:add-response-header("Access-Control-Allow-Origin", xdmp:get-request-header('Origin')), 	eput:add-response-header("Access-Control-Allow-Credentials","true"), 
	$response)
            else xdmp:set-response-code(404,"Not Found")
    else if ($method eq "POST") then    
        let $response := searchmodq:search-post(
            $headers,
            $params,
            $env,
            xdmp:get-request-body(eput:get-content-format($headers,$params))
            )
        return
		if (exists($response)) then 	
		(eput:add-response-header("Access-Control-Allow-Origin", xdmp:get-request-header('Origin')), 	eput:add-response-header("Access-Control-Allow-Credentials","true"), 
	$response)
            else xdmp:set-response-code(404,"Not Found")
    else error((), "REST-UNSUPPORTEDMETHOD",$method)
    )