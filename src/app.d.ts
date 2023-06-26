// See https://kit.svelte.dev/docs/types#app

import type { ExtendedWebSocketServer } from "$lib/server/webSocketUtils";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			wss?: ExtendedWebSocketServer
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
