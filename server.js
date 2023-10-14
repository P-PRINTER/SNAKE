import http from 'http';
import fs from 'fs/promises';
import { constants } from 'fs';


http.createServer(serverCallback).listen(3000);

async function serverCallback (request, response) {

	console.log(request.url);

	try {
		const	fileName	= request.url.slice(1);
		let 	fileExt		= request.url.split("/").at(-1).split(".")[1];
		fileExt				= fileExt ? fileExt : '';

		const	MIMEStr		= await fs.readFile("server-modules/MIME.json", 'utf-8');
		const	MIMEObj		= JSON.parse(MIMEStr);

		let MIMEType	= MIMEObj[fileExt];
		let content;

		if (!MIMEType) throw new Error("Unknown the file extension");

		if (request.url === "/") {
			content		= await fs.readFile("index.html", 'utf-8');
			MIMEType	= 'text/html';
		} else {
			await fs.access(fileName, constants.F_OK).catch( () => {
				throw new Error("File is undefined");
			} );

			content		= await fs.readFile(fileName, 'utf-8');
			MIMEType	= MIMEObj[fileExt];
		}

		console.log(`MIME: ${MIMEType}`);

		response.statusCode = 200;
		response.setHeader('Content-Type', MIMEType);
		response.write(content);

	} catch (err) {
		console.log(`${err.name}: ${err.message}`);
		response.statusCode = 301;

	} finally {
		console.log();
		response.end();
	}
}