import type { ExWebSocket } from "$lib/server/webSocketUtils";
import { rooms } from "./rooms";
import type { User } from "./user";

export function handleSocket(socket : ExWebSocket) {
    const user = socket as User;
    user.send(JSON.stringify({
        id: "socketId",
        socketId: user.socketId
    }))
    user.on("message", (message) => {
        const data = JSON.parse(message.toString());
        switch (data.id) {
            case "joinGame": {
                rooms.get(data.pin)?.addUser(user);
                break;
            }
            case "playerData": {
                user.name = data.name;
                user.article = data.article;
                user.hasArticle = data.hasArticle;
                user.room?.sendToAll({
                    id: "playerData",
                    socketId: user.socketId,
                    name: data.name,
                    judge: user.judge,
                    host: (user.room.host == user),
                    hasArticle: user.hasArticle
                })
                console.log(`Recieved ${user.socketId}'s name of ${user.name} and article of ${user.article}`);
                break;
            }
            case "startGame": {
                if (user.room?.host == user) {
                    user.room?.startGame();
                }
                break;
            }
            case "selectJudge": {
                if (user.room?.host == user) {
                    user.room?.selectJudge(data.judgeId);
                }
                break;
            }
            case "judgeGuess": {
                if (user.room?.judge == user) {
                    user.room?.judgeGuess(data.guessId);
                }
                break;
            }
            default:
                console.error(`${user.socketId} sent message with unknown id ${data.id}`);
        }

    })
    user.on("close", () => {
        user.room?.removeUser(user);
    })
}