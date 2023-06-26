<script lang="ts">
    import { ws, establishWebSocket} from "$lib/client/websocket";
    import { localPlayer } from "$lib/client/playerdata";
    let pin : number;

</script>

<style lang="scss">
    main {
        font-family: sans-serif;
    }
</style>

<div id="title">
    <h1>Two of these people are lying</h1>
    <h2>Because two of these people will be</h2>
</div>

<form>
    
</form>
<input type="number" maxlength="4" max="9999" min="1000" id="pinInput" bind:value={pin}>
<input type="text" name="Name" id="nameInput" bind:value={$localPlayer.name}>
<a href={`/game?pin=${pin}`}>Join Game</a>