<script lang="ts">
    import { goto } from "$app/navigation";
    import { currentArticle, gameResults, players } from "$lib/client/gamedata";
    import { localPlayer } from "$lib/client/playerdata";
    import { onMount } from "svelte";
    import { get } from "svelte/store";

    let truePlayerName : string|undefined;
    let guessedPlayerName : string|undefined;

    onMount(() => {
        const _gameResults = get(gameResults);
        const _players = get(players);

        truePlayerName = _players.find(player => player.socketId == _gameResults.trueId)?.name;
        guessedPlayerName = _players.find(player => player.socketId == _gameResults.guessedId)?.name;
    })


</script>


{#if $localPlayer.judge}
    {#if $gameResults.judgeWin}
        <!-- Judge picked the player telling the truth -->
        <h1>You Win!</h1>
        <h2>{truePlayerName} was telling the truth about {$currentArticle}!</h2>
    {:else}
        <h1>You Lose!</h1>
        <!-- Judge picked a player telling a lie -->
        <h2>{truePlayerName} was telling the truth about {$currentArticle}, but you guessed {guessedPlayerName}!</h2>
    {/if}
{:else}
    {#if $gameResults.localWin}
        <h1>You Win!</h1> 
        {#if $localPlayer.socketId == $gameResults.trueId}
            <!-- Judge picked the right player -->
            <h2>You convinced the judge of the truth behind {$currentArticle}</h2>
        {:else}
            <!-- Judge picked the wrong player -->
            <h2>You convinced the judge about your lie behind {$currentArticle}</h2>
        {/if}
    {:else}
        <h1>You Lose!</h1>
        {#if $localPlayer.socketId == $gameResults.trueId}
            <!-- Judge picked another player despite this one telling the truth -->
            <h2>You failed to convince the judge of the truth behind {$currentArticle}, so {guessedPlayerName} won instead!</h2>
        {:else}
            <!-- Judge saw through the lies of this player and didnt choose them -->
            <h2>You failed to convince the judge about your lie behind {$currentArticle}, so {guessedPlayerName} won instead!</h2>
        {/if}
    {/if}
{/if}

<button on:click={() => {goto("./lobby")}}>Continue</button>