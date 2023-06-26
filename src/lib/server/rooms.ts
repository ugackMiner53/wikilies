import type { User } from "./user";

export const rooms = new Map<number, Room>();

export class Room {
    pin : number;
    users = <User[]>[];
    host? : User;
    judge? : User;
    currentUser? : User;
    roundActive = false;

    constructor() {
        let pin;
        while (!pin) {
            const randomPin = Math.floor(1000 + 9000 * Math.random());
            if (!rooms.has(randomPin)) {
                pin = randomPin;
            }
        }
        console.log(`Creating game with pin ${pin}`);
        this.pin = pin;
        rooms.set(this.pin, this);
    }

    addUser(user : User) {
        const clientUsers = this.users.map(user => ({
            socketId: user.socketId,
            name: user.name,
            judge: user.judge,
            host: (user == this.host)
        }));
        user.send(JSON.stringify({
            id: "playerList",
            players: clientUsers
        }))
        user.room = this;
        this.users.push(user);
        this.checkForHost();
    }

    removeUser(user : User) {
        console.log(`Removing user ${user.socketId}`)
        this.users = this.users.filter(remoteUser => remoteUser != user);
        if (this.users.length <= 0) {
            console.log(`[${this.pin}] Deleting self!`);
            rooms.delete(this.pin);
        } else {
            this.sendToAll({
                id: "removePlayer",
                socketId: user.socketId
            })
        }
        this.checkForHost();
    }

    checkForHost() {
        if ((!this.host || this.host.readyState !== 1) && this.users.length > 0) {
            this.host = this.users[0];
            this.host.send(JSON.stringify({
                id: "host"
            }));
        }
    }

    selectJudge(judgeId : string) {
        if (this.judge) {
            this.judge.judge = false;
            this.sendToAll({
                id: "playerData",
                socketId: this.judge.socketId,
                name: this.judge.name,
                judge: this.judge.judge,
                host: (this.host == this.judge),
                hasArticle: this.judge.hasArticle
            })
        }
        const newJudge = this.users.find(user => user.socketId == judgeId);
        if (newJudge) {
            this.judge = newJudge;
            this.judge.judge = true;
            this.sendToAll({
                id: "playerData",
                socketId: this.judge.socketId,
                name: this.judge.name,
                judge: this.judge.judge,
                host: (this.host == this.judge),
                hasArticle: this.judge.hasArticle
            })
        }
    }

    startGame() {
        if (this.users.length > 2) {
            this.roundActive = true;
            while (!this.currentUser) {
                const user = this.users[Math.floor(this.users.length*Math.random())];
                if (!user.judge) {
                    this.currentUser = user;
                }
            }

            this.sendToAll({
                id: "startGame",
                article: this.currentUser.article
            })
        }
        // this.sendToAll()
    }

    judgeGuess(guessId : string) {
        this.sendToAll({
            id: "judgeGuess",
            guessId: guessId,
            trueId: this.currentUser?.socketId
        })
        this.currentUser?.send(JSON.stringify({
            id: "resetArticle"
        }))
        this.currentUser = undefined;
        this.roundActive = false;
    }

    sendToAll(data : object) {
        const message = JSON.stringify(data);
        this.users.forEach(user => {
            user.send(message);
        })
    }
}
