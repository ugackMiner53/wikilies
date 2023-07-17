<script lang="ts">
    import type Player from "$lib/client/player";
    import { sendJudge } from "$lib/client/websocket";
    import { localPlayer } from "$lib/client/playerdata";

    export let player : Player;
</script>

<style lang="scss">
    button {
        border: none;
        background: none;
    }
</style>

<div>
    <!-- <p on:click={() => {sendJudge(player.socketId)}}>{player.name} {player.hasArticle ? "" : "(Selecting)"} {player.host ? "(Hosting)" : ""} {player.judge ? "(Judging)" : ""}</p> -->
    <button on:click={() => {sendJudge(player.socketId)}}
        style:color={player.host ? "violet" : "unset"}

        style:font-style={!player.hasArticle ? "italic" : "unset"}
        style:text-decoration={!player.hasArticle ? "wavy" : "unset"}

        style:font-weight={player.judge ? "bold" : "unset"}

        style:cursor={$localPlayer.host ? "pointer" : "text"}
        >{player.name} {player.hasArticle ? "" : "(Selecting)"} {player.host ? "(Hosting)" : ""} {player.judge ? "(Judging)" : ""}</button>
</div>