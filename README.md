# angularjs-oscars

A simple search application built completely with AngularJS on NoSQL MarkLogic database

![oscars](app-screenshot.png?raw=true "App home page")


##### Setup
1. Install free developer version of [MarkLogic](http://developer.marklogic.com/products)
2. Go to AppBuilder at ```http://localhost:8000/appservices```
3. Give name for the app, say Oscars, give name for database, say Oscar-DB.
4. Follow through the setup wizard with default settings and deploy the app on default port (5275) or give different port, say 8003
5. This essentially deploys the application on REST server attached to Oscars-DB containing 9 documents
6. Git clone this repo
7. cd angularjs-oscars
8. npm install
9. npm start

##### To enable CORS
Option 1:  Add this piece of code in ```search-list-query.xqy``` available at   /Users/\<username\>/Library/MarkLogic/Modules/MarkLogic/rest-api/endpoints dir for GET and POST. This is important for the server to handle requests from the app

replace

        return  if (exists($response)) then $response
with

        return
        if (exists($response)) then 	
        (eput:add-response-header("Access-Control-Allow-Origin", xdmp:get-request-header('Origin')), 	
	      eput:add-response-header("Access-Control-Allow-Credentials","true"), 
        $response)
        
Option 2:  Set up a proxy server using ````expressjs```` or ```http-proxy``` or any other proxy server that essentially helps you enable CORS

