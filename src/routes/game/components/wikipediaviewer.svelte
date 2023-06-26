<script lang="ts">
    import { localPlayer } from "$lib/client/playerdata";
    import { onMount } from "svelte";
    const regex = /<a .*?>/g

    let articleText = "";

    $: $localPlayer.article, (() => {
        updateArticleText();
    })();

    function updateArticleText() {
        fetch(`https://en.wikipedia.org/w/api.php?format=json&origin=*&action=parse&redirects=true&prop=text&page=${$localPlayer.article}`).then(async (response) => {
            if (response.ok) {
                let data = await response.json();
                articleText = data.parse.text["*"].replaceAll(regex, "<a href=\"#\">");
            }
        })
    }

    onMount(() => {
        if ($localPlayer.article != "") {
            updateArticleText();
        }
    })
</script>

<style lang="scss">
    #wikiBackground {
        position: fixed;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        background: white;
        z-index: -1;
    }

</style>

<!-- Don't ask where I got this stylesheet from, I don't remember -->
<link rel="stylesheet" href="/wikipedia.css">
<div id="wikiBackground" />
{#if articleText}
    {@html articleText}
{/if}
