import { Room, rooms } from "$lib/server/rooms";
import type { RequestEvent } from "@sveltejs/kit";

export function load(event : RequestEvent) {
    const pin = event.url.searchParams.get("pin");
    if (pin) {
        return {gameExists: rooms.has(Number(pin)), pin: pin};
    } else if (event.url.searchParams.has("create")) {
        const room = new Room();
        return {gameExists: true, pin: room.pin};
    }
}