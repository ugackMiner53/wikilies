<script lang="ts">
    import { onMount } from "svelte";
    import Wikipediaviewer from "../components/wikipediaviewer.svelte";
    import { sendPlayerData, ws } from "$lib/client/websocket";
    import { localPlayer } from "$lib/client/playerdata";
    import { goto } from "$app/navigation";

    let randomArticles = <string[]>[];
    let searchArticle = "";

    onMount(async () => {
        $localPlayer.hasArticle = false;
        sendPlayerData();
        getRandomArticles();
    })
    
    function getRandomArticles() {
        fetch("https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&list=random&rnnamespace=0&rnlimit=5").then(async (response) => {
            if (response.ok) {
                let data = await response.json();
                randomArticles = (<{title: string}[]>data.query.random).map(randomArticle => randomArticle.title);
            }
        })
    }

    function searchForPage(page : string) {
        fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=${page}&limit=2&namespace=0&format=json`).then(async (response) => {
            if (response.ok) {
                let data = await response.json();
                if (data[1][0]) {
                    $localPlayer.article = data[1][0];
                    console.log(`Set article to ${$localPlayer.article}`);
                }
            }
        })
    }


</script>

<style lang="scss">
    @import "$lib/client/styles";

    #titlebar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 10%;
        background: linear-gradient(45deg, $background-colors);
        // background: conic-gradient(at 50% -10%, $background-colors);
        overflow: scroll;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        
        h1 {
            white-space: nowrap;
            overflow-x: scroll;
            max-width: 60%;
        }

        button {
            cursor: pointer;
            &:disabled {
                cursor: not-allowed;
            }
        }
    }

    #wikipediaViewer {
        margin-top: 10%;
    }
</style>

<div id="titlebar">
    {#if $localPlayer.article != ""}
        <h1>You're viewing {$localPlayer.article}</h1>
    {/if}
    <div>

    </div>
    <form on:submit|preventDefault={() => searchForPage(searchArticle)}>
        
        <input type="search" name="Search" id="searchBox" placeholder="Search for articles" bind:value={searchArticle}>
        <button type="submit">Search</button>
    </form>
    <button on:click={() => {if ($localPlayer.article != "") {$localPlayer.hasArticle = true; sendPlayerData(); goto("/game/lobby");}}} disabled={$localPlayer.article == ""}>Select this article</button>
    <button on:click={() => {$localPlayer.article = ""; getRandomArticles()}}>Show random articles</button>
</div>
<div id="wikipediaViewer">
    {#if $localPlayer.article !== ""}
        <Wikipediaviewer />
    {:else}
        <p>Stumped? Try these random articles!</p>
        <ul>
            {#each randomArticles as randomArticle}
                <li><a href="#" on:click={() => {$localPlayer.article = randomArticle}}>{randomArticle}</a></li>
            {/each}
        </ul>
    {/if}
</div>
