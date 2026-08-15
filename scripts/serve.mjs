import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const host = '127.0.0.1';
const port = Number.parseInt(process.env.PORT ?? '4173', 10);

const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.gif': 'image/gif',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=utf-8',
    '.webp': 'image/webp',
    '.xml': 'application/xml; charset=utf-8'
};

const sendFile = async (response, filePath, statusCode = 200) => {
    const fileStats = await stat(filePath);
    response.writeHead(statusCode, {
        'Cache-Control': 'no-cache',
        'Content-Length': fileStats.size,
        'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream'
    });
    createReadStream(filePath).pipe(response);
};

const server = createServer(async (request, response) => {
    try {
        const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? host}`);
        const pathname = decodeURIComponent(requestUrl.pathname);
        const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
        let filePath = path.resolve(projectRoot, relativePath);

        if (!filePath.startsWith(`${projectRoot}${path.sep}`)) {
            response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
            response.end('Acceso denegado');
            return;
        }

        try {
            const fileStats = await stat(filePath);
            if (fileStats.isDirectory()) filePath = path.join(filePath, 'index.html');
            await sendFile(response, filePath);
        } catch {
            await sendFile(response, path.join(projectRoot, '404.html'), 404);
        }
    } catch {
        response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Solicitud inválida');
    }
});

server.listen(port, host, () => {
    console.log(`Portafolio disponible en http://${host}:${port}`);
    console.log('Presiona Ctrl+C para detener el servidor.');
});
