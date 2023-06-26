import { writable } from "svelte/store";

export const localPlayer = writable({
    socketId: "",
    name: "",
    article: "",
    judge: false,
    host: false,
    hasArticle: false
})