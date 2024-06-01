<script lang="ts">
    import { goto } from "$app/navigation";
    import { pin, players } from "$lib/client/gamedata";
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

    #pinArea {
        color: white;
        font-size: calc(3vw + 1rem);
        
    }

    #changeArticle {
        position: absolute;
        top: 0;
        right: 0;
        margin-right: 1%;
        margin-top: 1%;
        background: rgba(53,53,53, 0.25);
        color: white;
        max-width: 50%;
        max-height: 25%;
        width: 25%;
        height: 10%;
        border: none;
        cursor: pointer;
    }

    #playerList {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        background: rgba(53,53,53,0.5);
        text-align: center;
        color: white;
        border-top: 3px solid black;
        ul {
            color: black;
            gap: 10%;
            row-gap: 20px;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-around;
            align-items: center;
            padding-left: 10%;
            padding-right: 10%;
        }
    }
</style>
<div id="background" />

<div id="pinArea">
    <h1>{$pin}</h1>
    {#if $localPlayer.host}
        <button disabled={$players.length < 2 || !$players.every(player => player.hasArticle) || !$localPlayer.hasArticle || !($players.some(player => player.judge) || $localPlayer.judge)} on:click={() => {sendStartGame()}} >Start Game</button>
    {/if}
</div>

<button id="changeArticle" on:click={() => {goto("/game/findarticle")}}>
    {#if $localPlayer.article}
        <p>Your article is <b>{$localPlayer.article}</b>!</p>
    {:else}
        <b>Set your article!</b>
    {/if}
</button>

<div id="playerList">
    <h1>Players</h1>
    <ul>
        <Playerlisting player={$localPlayer} />
        {#each $players as player}
            <Playerlisting {player} />
        {/each}
    </ul>
</div>