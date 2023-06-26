import { building } from '$app/environment';
import { GlobalThisWSS } from '$lib/server/webSocketUtils';
import type { Handle } from '@sveltejs/kit';
import type { ExtendedGlobal } from '$lib/server/webSocketUtils';
import { handleSocket } from '$lib/server/websocket';

// This can be extracted into a separate file
let wssInitialized = false;
const startupWebsocketServer = () => {
    if (wssInitialized) return;
    wssInitialized = true; // set to true here to avoid multiple initialize requests during the same time
    const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
    if (wss !== undefined) {
        wss.on('connection', (ws, request) => {
            console.log(`[wss:kit] Client connected (${ws.socketId})`);
            handleSocket(ws);

            ws.on('close', () => {
                console.log(`[wss:kit] Client disconnected (${ws.socketId})`);
            });
        });
    }
};

export const handle = (async ({ event, resolve }) => {
    startupWebsocketServer();
    // Skip WebSocket server when pre-rendering pages
    if (!building) {
        const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
        if (wss !== undefined) {
            event.locals.wss = wss;
        }
    }
    const response = await resolve(event, {
        filterSerializedResponseHeaders: name => name === 'content-type',
    });
    return response;
}) satisfies Handle;