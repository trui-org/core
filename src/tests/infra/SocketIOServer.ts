import http from 'http';
import IOServer from 'socket.io';

type RegisteredEventValueType = {
    eventName: string;
    callback: Function;
}

export class SocketIOServer {
    public readonly port = 4444;
    private httpServer: http.Server;
    private sioServer: SocketIO.Server;
    private registeredEvents: Map<Symbol, RegisteredEventValueType>;

    public constructor() {
        this.httpServer = http.createServer();
        this.sioServer = IOServer(this.httpServer);
        this.registeredEvents = new Map();
    }

    private onServerStart = () => {
        // listen whenever someone connects
        this.sioServer.on('connection', (socket) => {
            socket.on('disconnect', () => {
                console.log('A user has disconnected...');
            });

            const events = this.registeredEvents.values();

            for (let event of events) {
                socket.on(event.eventName, (...data: any[]) => {
                    event.callback(...data);
                });
            }
        });
    }

    public registerEvent = (eventName: string, callback: Function): Symbol => {
        const id = Symbol(eventName);
        this.registeredEvents.set(id, { eventName, callback });

        return id;
    }

    public unregisterEvent = (id: Symbol) => {
        this.registeredEvents.delete(id);
    }

    public start = () => {
        this.onServerStart();

        this.httpServer.listen(this.port);
    }

    public stop = () => {
        this.httpServer.close()
    }
}