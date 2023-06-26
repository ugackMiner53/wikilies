import { parse } from 'url';
import { WebSocketServer } from 'ws';
import { nanoid } from 'nanoid';
import { type Server, WebSocket } from 'ws';
import type { IncomingMessage } from 'http';
import type { Duplex } from 'stream';

export const GlobalThisWSS = Symbol.for('sveltekit.wss');

export class ExWebSocket extends WebSocket {
    socketId? : string;
}

export type ExtendedWebSocketServer = Server<typeof ExWebSocket>;

export type ExtendedGlobal = typeof globalThis & {
    [GlobalThisWSS]: ExtendedWebSocketServer;
};

export const onHttpServerUpgrade = (req: IncomingMessage, sock: Duplex, head: Buffer) => {
    const pathname = req.url ? parse(req.url).pathname : null;
    if (pathname !== '/socket') return;

    const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];

    wss.handleUpgrade(req, sock, head, (ws) => {
        // console.log('[handleUpgrade] creating new connecttion');
        wss.emit('connection', ws, req);
    });
};

export const createWSSGlobalInstance = () => {
    const wss = new WebSocketServer({ noServer: true }) as ExtendedWebSocketServer;

    (globalThis as ExtendedGlobal)[GlobalThisWSS] = wss;

    wss.on('connection', (ws) => {
        ws.socketId = nanoid();
        console.log(`[wss:global] Client connected (${ws.socketId})`);

        ws.on('close', () => {
            console.log(`[wss:global] Client disconnected (${ws.socketId})`);
        });
    });

    return wss;
};
