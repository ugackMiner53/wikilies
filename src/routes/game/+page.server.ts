import { Room, rooms } from "$lib/server/rooms";
import type { RequestEvent } from "@sveltejs/kit";

export function load(event : RequestEvent) {
    const pin = event.url.searchParams.get("pin");
    if (pin) {
        // DEBUG
        if (!rooms.has(Number(pin))) {
            new Room(); // DEBUG LINE: REMOVE THIS LATER
        }
        // /DEBUG

        return {gameExists: rooms.has(Number(pin)), pin: pin};
    }
    return {gameExists: false, pin: pin};
}