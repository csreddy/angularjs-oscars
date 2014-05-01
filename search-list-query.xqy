/* 

Add this piece of code in search-list-query.xqy available at /Users/sreddy/Library/MarkLogic/Modules/MarkLogic/rest-api/endpoints dir for GET and POST
This is important for the server to handle requests and enable CORS
Otherwise use a proxy server 

*/

  return
	if (exists($response)) then 	
	(eput:add-response-header("Access-Control-Allow-Origin", xdmp:get-request-header('Origin')), 	
	eput:add-response-header("Access-Control-Allow-Credentials","true"), 
$response)