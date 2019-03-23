import { generate as shortIDGenerate } from 'shortid';

interface ISocketClientAdapter<V> {
    getSubcriptionValue: (subscriptionID: string) => V | undefined;
    addSubscription: (eventName: string, value: V) => string;
    removeSubscription: (subscriptionID: string) => void;
}

export type SubscribeCallbackType<U, R = void> = (data: U) => R;
export type GenericPublishType<D = any> = (eventName: string, data: D) => void;
export type GenericSubscribeType<C = any> = (eventName: string, callback: SubscribeCallbackType<C>) => string;

export abstract class GenericSocketClientAdapter<S = any, D = any> implements ISocketClientAdapter<D> {
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
    public addSubscription = (eventName: string, value: D): string => {
        const randomID = shortIDGenerate();
        const subscriptionID = `${eventName}-${randomID}`;

        this._subscribedEvents.set(subscriptionID, value);

        return subscriptionID;
    }

    /**
     * Removes a subscription based off the subscriptionID from the internal Map object
     */
    public removeSubscription = (subscriptionID: string) => {
        this._subscribedEvents.delete(subscriptionID);
    }

    /**
     * Returns the value of the subscriptionID
     */
    public getSubcriptionValue = (subscriptionID: string) => {
        return this._subscribedEvents.get(subscriptionID);
    }
}