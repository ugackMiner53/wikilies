<script lang="ts">
    import { currentArticle } from "$lib/client/gamedata";
    import { localPlayer } from "$lib/client/playerdata";
    import { players } from "$lib/client/gamedata";
    import { sendJudgeGuess } from "$lib/client/websocket";

    let guessed = false;
</script>

<style lang="scss">
    @use "$lib/client/styles" as styles;

    #background {
        @include styles.background;
    }
</style>

<div id="background" />

{#if $localPlayer.judge}
    <h1>You are judging!</h1>
    <h2>Hear out the players on what {$currentArticle} is, and pick the person who you think read the article!</h2>
    {#each $players as player}
        <button disabled={guessed} on:click={() => {guessed = true; sendJudgeGuess(player.socketId);}}>{player.name}</button>
    {/each}
{:else}
    {#if $currentArticle == $localPlayer.article}
        <h1>You need to tell the judge about your article, {$currentArticle}!</h1>
    {:else}
        <h1>You need to lie and convince the judge that you read about {$currentArticle}!</h1>
    {/if}
{/if}