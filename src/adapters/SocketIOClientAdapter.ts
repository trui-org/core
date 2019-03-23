import * as sio from 'socket.io-client';
import { GenericSocketClientAdapter, SubscribeCallbackType } from './shared/GenericSocketClientAdapter';

type SocketType = SocketIOClientStatic;
type SubscriptionValueType = {
    callback: (message: any) => void
}

export class SocketIOClient extends GenericSocketClientAdapter<SocketType, SubscriptionValueType> {
    public client: any;

    public constructor(options?: object) {
        super();

        // create an unconnected SocketIO Client
        this.client = socketIO({
            autoConnect: false,
            ...options
        });
    }

    public connect = (url: string): Promise<Ros> => {
        return new Promise((resolve, reject) => {
            this.client.

                this.ros.on('connection', () => {
                    resolve(this.ros);
                });

            this.ros.on('error', (error: any) => {
                reject(error);
            });
        })
    }

    public close = () => {
        this.client.close();
    }

    public publish = (eventName: string, data: Message, messageType: string) => {
        const topic = new Topic({
            ros: this.ros,
            name: eventName,
            messageType
        });

        topic.publish(data);
    }

    public subscribe = (eventName: string, messageType: string, callback: SubscribeCallbackType<Message>): string => {
        const topic = new Topic({
            ros: this.ros,
            name: eventName,
            messageType
        });

        const subscriptionValue = { topic, callback };
        const subscriptionID = this.addSubscription(eventName, subscriptionValue);

        topic.subscribe(callback);

        return subscriptionID;
    }

    public unsubscribe = (subscriptionID: string) => {
        const value = this.getSubcriptionValue(subscriptionID);

        if (value !== undefined) {
            const { callback } = value;
            topic.unsubscribe(callback);

            this.removeSubscription(subscriptionID);
        }
    }
}
