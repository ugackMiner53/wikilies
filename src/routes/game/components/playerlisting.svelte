<script lang="ts">
    import type Player from "$lib/client/player";
    import { sendJudge } from "$lib/client/websocket";

    export let player : Player;
</script>


<div>
    <p on:click={() => {sendJudge(player.socketId)}}>{player.name} {player.hasArticle ? "" : "(Selecting)"} {player.host ? "(Hosting)" : ""} {player.judge ? "(Judging)" : ""} ({player.socketId})</p>
</div>