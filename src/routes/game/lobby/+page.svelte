<script lang="ts">
    import { goto } from "$app/navigation";
    import { players } from "$lib/client/gamedata";
    import { localPlayer } from "$lib/client/playerdata";
    import { sendJudge, sendStartGame, ws } from "$lib/client/websocket";
    import { onMount } from "svelte";
    import Playerlisting from "../components/playerlisting.svelte";

    onMount(() => {
        if (!ws)
            goto("/");
    })
</script>

<style lang="scss">
    @use "$lib/client/styles" as styles;

    #background {
        @include styles.background;
    }
</style>
<div id="background" />
<div id="playerList">
    <h1>Players</h1>
    <ul>
        <Playerlisting player={$localPlayer} />
        {#each $players as player}
            <Playerlisting {player} />
        {/each}
    </ul>
</div>
<div id="changeArticle">
    <p>Your article is 
        <b>{$localPlayer.article}</b>
    </p>
    <button on:click={() => {goto("./findarticle")}}>Change</button>
</div>
{#if $localPlayer.host}
    <div>
        <button disabled={$players.length < 2 || !$players.every(player => player.hasArticle) || !$localPlayer.hasArticle || !($players.some(player => player.judge) || $localPlayer.judge)} on:click={() => {sendStartGame()}} >Start Game</button>
    </div>
{/if}