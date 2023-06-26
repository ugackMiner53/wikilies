import { writable } from "svelte/store";
import type Player from "./player";

export const currentArticle = writable("");
export const players = writable(<Player[]>[]);
export const gameResults = writable(<{localWin: boolean; judgeWin: boolean; guessedId: string; trueId: string;}>{});