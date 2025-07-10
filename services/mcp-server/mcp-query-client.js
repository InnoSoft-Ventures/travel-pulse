const http = require('http');

const sqlQuery = process.argv[2];

if (!sqlQuery) {
	console.error('Usage: node mcp-query-client.js "YOUR SQL QUERY"');
	process.exit(1);
}

const encodedQuery = Buffer.from(sqlQuery).toString('base64');

const data = JSON.stringify({
	encodedQuery: encodedQuery,
});

const options = {
	hostname: 'localhost',
	port: 3001,
	path: '/query',
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'Content-Length': data.length,
	},
};

const req = http.request(options, (res) => {
	console.log(`Status: ${res.statusCode}`);
	console.log(`Headers: ${JSON.stringify(res.headers)}`);

	let responseBody = '';
	res.on('data', (chunk) => {
		responseBody += chunk;
	});

	res.on('end', () => {
		try {
			const jsonResponse = JSON.parse(responseBody);
			console.log(
				'Response Body:',
				JSON.stringify(jsonResponse, null, 2)
			);
		} catch (e) {
			console.error('Failed to parse JSON response:', responseBody);
		}
	});
});

req.on('error', (error) => {
	console.error(`Request error: ${error.message}`);
});

req.write(data);
req.end();
