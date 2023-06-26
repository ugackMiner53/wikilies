import { ExWebSocket } from "$lib/server/webSocketUtils";
import type { Room } from "./rooms";

export class User extends ExWebSocket {
    name?: string;
    article?: string;
    judge?: boolean;
    room?: Room;
    hasArticle?: boolean;
}