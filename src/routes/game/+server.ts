import { Room, rooms } from "$lib/server/rooms";
import { json, type RequestEvent } from "@sveltejs/kit";

export function GET(event : RequestEvent) {
    const pin = event.url.searchParams.get("pin");
    if (pin) {
        if (rooms.has(Number(pin))) {
            return json({pin: pin});
        } else {
            return json({pin: false});
        }
    } else if (event.url.searchParams.has("create")) {
        const room = new Room();
        return json({pin: room.pin});
    }
    return json({pin: false})
}