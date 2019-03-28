import socketIO from 'socket.io-client';
import { GenericSocketClientAdapter, SubscribeCallbackType } from './shared/GenericSocketClientAdapter';

type SubscriptionValueType = {
    emitter: SocketIOClient.Emitter,
    eventName: string;
    callback: Function
}

export class SocketIOClient extends GenericSocketClientAdapter<SubscriptionValueType> {
    private _client: SocketIOClient.Socket | null;
    private _socketIOConnectOpts: SocketIOClient.ConnectOpts | undefined;

    public constructor(options?: SocketIOClient.ConnectOpts) {
        super();

        this._client = null;
        this._socketIOConnectOpts = options || undefined;
    }

    public connect = (url: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            this._client = socketIO(url, this._socketIOConnectOpts);

            this._client.on('connect', () => {
                resolve();
            });

            this._client.on('connect_error', (error: any) => {
                reject(error);
            });
        })
    }

    public close = () => {
        this._client!.close();
    }

    public get connected() {
        if (this._client === null) {
            return false;
        }

        return this._client.connected;
    }

    public publish = (eventName: string, data: any) => {
        this._client!.emit(eventName, data);
    }

    public subscribe = (eventName: string, callback: SubscribeCallbackType<any>): Symbol => {
        const emitter = this._client!.on(eventName, callback);

        const subscriptionValue = { emitter, eventName, callback };
        const subscriptionID = this.addSubscription(eventName, subscriptionValue);

        return subscriptionID;
    }

    public unsubscribe = (subscriptionID: Symbol) => {
        const value = this.getSubcriptionValue(subscriptionID);

        if (value !== undefined) {
            const { emitter, eventName, callback } = value;
            emitter.off(eventName, callback);

            this.removeSubscription(subscriptionID);
        }
    }
}
