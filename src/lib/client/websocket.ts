import { get } from "svelte/store";
import { currentArticle, gameResults, players, pin as gamePin } from "./gamedata";
import type Player from "./player";
import { localPlayer } from "./playerdata";

import { goto } from "$app/navigation";

export let ws: WebSocket | null = null;

export function establishWebSocket(websocketConnectedCallback : () => void) {
    if (ws) return;
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    ws = new WebSocket(`${protocol}//${window.location.host}/socket`);
    ws.addEventListener("open", (event) => {
        console.log("[websocket] connection open", event);
        websocketConnectedCallback();
    });
    ws.addEventListener("close", (event) => {
        console.log("[websocket] connection closed", event);
        ws = null;
    });
    ws.addEventListener("message", (event) => {
        console.log("[websocket] message received", event);
        handleMessage(event.data);
    });
}

function handleMessage(message : string) {
    const data = JSON.parse(message);
    switch (data.id) {
        case "socketId": {
            localPlayer.update(player => {
                player.socketId = data.socketId; 
                return player
            });
            break;
        }
        case "playerData": {
            if (data.socketId == get(localPlayer).socketId) {
                localPlayer.update(player => {
                    // This should be the only thing updated in this function on the localPlayer
                    player.judge = data.judge;
                    return player;
                })
                return;
            }
            const playerArray = get(players);
            const player = playerArray.find(player => player.socketId == data.socketId);
            if (!player) {
                playerArray.push({
                    socketId: data.socketId,
                    name: data.name,
                    judge: data.judge,
                    host: data.host,
                    hasArticle: data.hasArticle
                } as Player);
            } else {
                player.name = data.name;
                player.judge = data.judge;
                player.host = data.host;
                player.hasArticle = data.hasArticle;
            }
            players.set(playerArray);
            break;
        }
        case "playerList": {
            console.log(data.players);
            players.set(data.players);
            break;
        }
        case "removePlayer": {
            players.update(players => {
                console.log(`Trying to remove ${data.socketId} (len: ${players.length})`);
                players = players.filter(player => player.socketId != data.socketId);
                console.log(`(len: ${players.length})`);
                return players;
            })
            break;
        }
        case "resetArticle": {
            localPlayer.update(player => {
                player.article = "";
                player.hasArticle = false;
                return player;
            });
            sendPlayerData();
            break;
        }
        case "judgeGuess": {
            const localPlayerData = get(localPlayer);

            gameResults.set({
                localWin: data.guessId == localPlayerData.socketId,
                judgeWin: data.guessId == data.trueId,
                guessedId: data.guessId,
                trueId: data.trueId
            });
            goto("./results");
            break;
        }
        case "startGame": {
            currentArticle.set(data.article);
            goto("./guessing");
            break;
        }
        case "host": {
            localPlayer.update((player) => {
                player.host = true; 
                return player;
            });
            break;
        }
        default:
            console.error(`Unknown id type ${data.id}!`);
    }
}

export function joinGame(pin : number) {
    gamePin.set(pin);
    send({
        id: "joinGame",
        pin: pin
    })
}

export function sendPlayerData() {
    const localPlayerData = get(localPlayer); 
    send({
        id: "playerData",
        name: localPlayerData.name,
        article: localPlayerData.article,
        hasArticle: localPlayerData.hasArticle
    });
}

export function sendJudge(judgeId : string) {
    send({
        id: "selectJudge",
        judgeId: judgeId
    });
}

export function sendStartGame() {
    send({
        id: "startGame"
    });
}

export function sendJudgeGuess(guessId : string) {
    send({
        id: "judgeGuess",
        guessId: guessId
    });
}

function send(data : object) {
    if (ws?.readyState == WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    }
}