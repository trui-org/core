import { generate as shortIDGenerate } from 'shortid';

export type SubscribeCallbackType<U, R = void> = (data: U) => R;
export type GenericPublishType<D = any> = (eventName: string, data: D) => void;
export type GenericSubscribeType<C = any> = (eventName: string, callback: SubscribeCallbackType<C>) => string;

export abstract class GenericSocketClientAdapter<S = any, D = any> implements ISocketClient<S> {
    private _subscribedEvents: Map<string, D>;

    public constructor() {
        this._subscribedEvents = new Map();
    }

    public abstract connect(url: string): Promise<S>;
    public abstract close(): void;
    public abstract publish: Function;
    public abstract subscribe: Function;
    public abstract unsubscribe(subscriptionID: string): void;

    /**
     * Adds the new subscription to the existing subscribed events.
     */
    protected addSubscription = (eventName: string, value: D): string => {
        const randomID = shortIDGenerate();
        const subscriptionID = `${eventName}-${randomID}`;

        this._subscribedEvents.set(subscriptionID, value);

        return subscriptionID;
    }

    /**
     * Removes a subscription based off the subscriptionID from the internal Map object
     */
    protected removeSubscription = (subscriptionID: string) => {
        this._subscribedEvents.delete(subscriptionID);
    }

    /**
     * Returns the value of the subscriptionID
     */
    protected getSubcriptionValue = (subscriptionID: string) => {
        return this._subscribedEvents.get(subscriptionID);
    }
}