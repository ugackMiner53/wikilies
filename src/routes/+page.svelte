<script lang="ts">
    import { ws, establishWebSocket, joinGame as connectGame, sendPlayerData} from "$lib/client/websocket";
    import { localPlayer } from "$lib/client/playerdata";
    import { goto } from "$app/navigation";
    let pin : number;

    async function createGame() {
        document.querySelectorAll("button").forEach(button => {button.disabled = true})
        const url = new URL("/game", location.href);
        url.searchParams.set("create", "")
        enterGame(await (await fetch(url)).json());
    }

    async function joinGame() {
        if (pin != undefined) {
            document.querySelectorAll("button").forEach(button => {button.disabled = true})
            const url = new URL("/game", location.href);
            url.searchParams.set("pin", pin.toString());
            enterGame(await (await fetch(url)).json());
        }
    }

    function enterGame(response : any) {
        if (response.pin) {
            establishWebSocket(() => {
                connectGame(Number(response.pin));
                sendPlayerData();
                goto("/game/lobby");
            });
        } else {
            // Show an error here
            alert("Something went wrong when joining that game!\nCheck to make sure that your PIN is correct and that you're connected to the server!");
            document.querySelectorAll("button").forEach(button => {button.disabled = false})
        }
    }
</script>

<style lang="scss">
    @use "$lib/client/styles" as styles;

    #background {
        @include styles.background;
    }

    #title {
        color: white;
        text-align: center;
        font-size: calc(5vw + 1rem);
    }

    input, button {
        border-radius: 12px;
        width: 25vw;
        height: 5vw;
        background: rgba(53,53,53,0.25);
        border: solid 5px black;
        text-align: center;
        color: white;
        font-size: calc(0.5vw + 1rem);

        &:hover {
            background: rgba(255,255,255,0.1);
        }

        &:disabled {
            color: gray;
            background: rgba(53,53,53,0.5);
            cursor: not-allowed;
        }
    }

    button {
        cursor: pointer;
    }

    #inputs {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    #options {
        display: flex;
        flex-direction: row;
        background: rgba(53, 53, 53, 0.5);
        border: 1px solid black;
        margin-top: calc(3vw + 1rem);
        padding: calc(1vw + 1rem);
        justify-content: space-around;
        width: 80%;
    }

    form {
        display: flex;
        flex-direction: column;

    }
</style>

<div id="background" />

<h1 id="title">Wikipedia Lies</h1>

<div id="inputs">
    <input type="text" name="Name" id="nameInput" placeholder="Enter your name" bind:value={$localPlayer.name}>
    <div id="options">
        <button disabled={!$localPlayer.name} on:click={() => {createGame()}}>Create new Lobby</button>
        <form on:submit|preventDefault={() => {joinGame()}}>
            <input type="number" maxlength="4" max="9999" min="1000" placeholder="Enter PIN" id="pinInput" bind:value={pin}>
            <button disabled={!$localPlayer.name || !pin} type="submit">Join Game</button>
        </form>
    </div>
</div>