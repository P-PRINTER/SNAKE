import http from 'http';
import fs from 'fs';

http.createServer(serverCallback).listen(3000);


async function serverCallback (request, response) {
	response.end();
}