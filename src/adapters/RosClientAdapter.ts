import { Ros, Topic, Message } from 'roslib';
import { GenericSocketClientAdapter, SubscribeCallbackType } from './shared/GenericSocketClientAdapter';

type SubscriptionValueType = {
    topic: Topic,
    callback: (message: Message) => void
}

export class RosClient extends GenericSocketClientAdapter<SubscriptionValueType> {
    private _ros: Ros;

    public constructor() {
        super();

        // create an unconnected Ros object
        this._ros = new Ros({ url: undefined });
    }

    public connect = (url: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            this._ros.connect(url);

            this._ros.on('connection', () => {
                resolve();
            });

            this._ros.on('error', (error: any) => {
                reject(error);
            });
        })
    }

    public close = () => {
        this._ros.close();
    }

    public publish = (eventName: string, data: Message, messageType: string) => {
        const topic = new Topic({
            ros: this._ros,
            name: eventName,
            messageType
        });

        topic.publish(data);
    }

    public subscribe = (eventName: string, messageType: string, callback: SubscribeCallbackType<Message>): Symbol => {
        const topic = new Topic({
            ros: this._ros,
            name: eventName,
            messageType
        });

        const subscriptionValue = { topic, callback };
        const subscriptionID = this.addSubscription(eventName, subscriptionValue);

        topic.subscribe(callback);

        return subscriptionID;
    }

    public unsubscribe = (subscriptionID: Symbol) => {
        const value = this.getSubcriptionValue(subscriptionID);

        if (value !== undefined) {
            const { topic, callback } = value;
            topic.unsubscribe(callback);

            this.removeSubscription(subscriptionID);
        }
    }
}
