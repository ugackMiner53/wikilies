<script lang="ts">
    import { goto } from "$app/navigation";
    import { establishWebSocket, joinGame, sendPlayerData } from "$lib/client/websocket";
    import { onMount } from "svelte";
    export let data;

    onMount(() => {
        if (data.gameExists) {
            establishWebSocket(() => {
                joinGame(Number(data.pin));
                sendPlayerData();
                goto("/game/lobby");
            });
        } else {
            goto("/");
        }
    })

</script>

<h1>Connecting to the lobby...</h1>
<p>{data.gameExists ? "Game Found!" : "Game not found! Redirecting to homepage..."}</p>