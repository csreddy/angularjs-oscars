# angularjs-oscars

A simple search application built completely with AngularJS on MarkLogic (NoSql) database

![oscars](app-screenshot.png?raw=true "App home page")


##### To enable CORS
Option 1:  Add this piece of code in search-list-query.xqy available at   /Users/\<username\>/Library/MarkLogic/Modules/MarkLogic/rest-api/endpoints dir for GET and POST. This is important for the server to handle requests from the app

replace

        return  if (exists($response)) then $response
with

        return
        if (exists($response)) then 	
        (eput:add-response-header("Access-Control-Allow-Origin", xdmp:get-request-header('Origin')), 	
	      eput:add-response-header("Access-Control-Allow-Credentials","true"), 
        $response)
        
Option 2:  Set up a proxy server using ````expressjs```` or ```http-proxy``` or any other proxy server that essentially helps you enable CORS

