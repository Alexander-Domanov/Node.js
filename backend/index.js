/*
*  Primary file for the API
*
* */

// Dependencies
const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder

// The server should respond to all requests with a string
const server = http.createServer((req, res) => {

    // Get the URL and parse it
    const parsedURL = url.parse(req.url, true)

    // Get the path
    const path = parsedURL.pathname
    const trimmedPath = path.replace(/^\/+|\/+$/g, '')

    // Get the query string as an object
    const queryStringObject = parsedURL.query


    // Get the HTTP Method
    const method = req.method.toLowerCase()

    // Get the headers as and object
    const headers = req.headers

    // Get the payload, if any
    const decoder = new StringDecoder('utf-8')
    let buffer = ''
    req.on('data', (data) => {
        buffer += decoder.write(data)
    })
    req.on('end', () => {
        buffer += decoder.end()

        // Choose the handler this request should go to. If one s not found, use the notfound handler
        const choseHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound

        // Construct the data object to send to the handler
        let data =
            {
                'trimmedPath':
                trimmedPath,
                'queryStringObject':
                queryStringObject,
                'method': method,
                'headers': headers,
                'payload': buffer
            }

        // Route the request to the handler specified in the router
        choseHandler(data, (statusCode, payload) => {
            // Use the status code called back by the handler, or default to 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200

            // Use the payload called back by the handler, or default to an empty object
            payload = typeof (payload) == 'object' ? payload : {}

            // Convert the payload to a string
            let payloadString = JSON.stringify(payload)

            // Return the response
            res.writeHead(statusCode)

            res.end(payloadString)

            // Log the request path
            console.log('Request received on path: ' + trimmedPath + ' with method: ' + method + 'and with these query string parameters', queryStringObject)
            console.log('Request received with the headers: ', headers)
            console.log('Request received with this payload: ', buffer)
            console.log('Returning this response: ', statusCode, payloadString)
        })

    })
})


// Start the server, and have it listen on port 3000
server.listen(3000, () => {
    console.log('The server is listening on port 3000 now')
})

// Define the handlers
const handlers = {}

// Sample handler
handlers.sample = (data, callback) => {
    // Callback a http status code, and a payload object
    callback(400, {'name': 'sample handler'})
}

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404)
}

// Define a request router
const router = {
    'sample': handlers.sample
}