import { Ros, Topic, Message } from 'roslib';
import * as shortid from 'shortid';

export class RosAdapter implements ISocketClient {
    public ros: Ros;
    private subscribedEvents: Map<string, {
        topic: Topic,
        callback: (message: Message) => void
    }>;

    constructor() {
        this.subscribedEvents = new Map();
    }

    public connect: ISocketClient["connect"] = (url: string): Promise<Ros> => {
        return new Promise((resolve, reject) => {
            this.ros = new Ros({
                url
            });

            this.ros.on('connection', () => {
                resolve(this.ros);
            });

            this.ros.on('error', (error: any) => {
                reject(error);
            });
        })
    }

    public close: ISocketClient["close"] = () => {
        this.ros.close();
    }

    public publish: ISocketClient["publish"] = (eventName: string, data: Message, messageType: string, ...args: any) => {
        const topic = new Topic({
            ros: this.ros,
            name: eventName,
            messageType
            ...args
        });

        topic.publish(data);
        topic.
    }

    public subscribe: ISocketClient["subscribe"] = (eventName: string, messageType: string, callback: (message: Message) => void): string => {
        const topic = new Topic({
            ros: this.ros,
            name: eventName,
            messageType
        });

        const randomID = shortid.generate();
        const subscriptionID = `${eventName}-${randomID}`;

        this._addSubscription(subscriptionID, topic, callback);

        topic.subscribe(callback);

        return subscriptionID;
    }

    public unsubscribe: ISocketClient["unsubscribe"] = (subscriptionID: string) => {
        const value = this.subscribedEvents.get(subscriptionID);

        if (value !== undefined) {
            const { callback, topic } = value;
            topic.unsubscribe(callback);

            this._removeSubscription(subscriptionID);
        }
    }

    private _addSubscription = (subscriptionID: string, topic: Topic, callback: (message: Message) => void) => {
        this.subscribedEvents.set(subscriptionID, { topic, callback });
    }

    private _removeSubscription = (subscriptionID: string) => {
        this.subscribedEvents.delete(subscriptionID);
    }
}
