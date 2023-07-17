<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { ws } from "$lib/client/websocket";

    if (browser) {
        if (window.location.pathname != "/game" && (!ws || ws.readyState != WebSocket.OPEN)) {
            goto("/");
        }
    }

</script>

<slot />