import http from 'http';
import IOServer from 'socket.io';

export class SocketIOServer {
    public readonly port = 4444;
    private httpServer: http.Server;
    private sioServer: SocketIO.Server;

    public constructor() {
        this.httpServer = http.createServer();
        this.sioServer = IOServer(this.httpServer);
    }

    private onServerStart = () => {
        // listen whenever someone connects
        this.sioServer.on('connection', (socket) => {
            socket.on('disconnect', () => {
                console.log('A user has disconnected...');
            });
        });
    }

    public start = () => {
        this.onServerStart();

        this.httpServer.listen(this.port, () => {
            console.log(`Starting Socket IO Server locally on port ${this.port}`);
        });
    }

    public stop = () => {
        this.httpServer.close()
    }
}