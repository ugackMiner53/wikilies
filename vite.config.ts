import { createWSSGlobalInstance, onHttpServerUpgrade } from './src/lib/server/webSocketUtils';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ViteDevServer } from 'vite';

const webSocketPlugin = {
	name: "integratedWebsocketServer",
	configureServer(server : ViteDevServer) {
		createWSSGlobalInstance();
		server.httpServer?.on("upgrade", onHttpServerUpgrade);
	}
}

export default defineConfig({
	plugins: [sveltekit(), webSocketPlugin]
});
