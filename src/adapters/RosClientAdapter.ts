import { Ros, Topic, Message } from 'roslib';
import { GenericSocketClientAdapter, SubscribeCallbackType } from './shared/GenericSocketClientAdapter';

type SocketType = Ros;
type SubscriptionValueType = {
    topic: Topic,
    callback: (message: Message) => void
}

export class RosClient extends GenericSocketClientAdapter<SocketType, SubscriptionValueType> {
    public ros: Ros;

    public constructor() {
        super();

        // create an unconnected Ros object
        this.ros = new Ros({ url: undefined });
    }

    public connect = (url: string): Promise<Ros> => {
        return new Promise((resolve, reject) => {
            this.ros.connect(url);

            this.ros.on('connection', () => {
                resolve(this.ros);
            });

            this.ros.on('error', (error: any) => {
                reject(error);
            });
        })
    }

    public close = () => {
        this.ros.close();
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
            const { topic, callback } = value;
            topic.unsubscribe(callback);

            this.removeSubscription(subscriptionID);
        }
    }
}
