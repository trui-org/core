import { ISocketClient } from '~/types';

export type SubscribeCallbackType<U, R = void> = (data: U) => R;
export type GenericPublishType<D = any> = (eventName: string, data: D) => void;
export type GenericSubscribeType<C = any> = (eventName: string, callback: SubscribeCallbackType<C>) => string;

export abstract class GenericSocketClientAdapter<D = any> implements ISocketClient {
    private _subscribedEvents: Map<Symbol, D>;

    public constructor() {
        this._subscribedEvents = new Map();
    }

    public abstract connect(url: string): Promise<void>;
    public abstract close(): void;
    public abstract get connected(): boolean;
    public abstract publish: Function;
    public abstract subscribe: Function;
    public abstract unsubscribe(subscriptionID: Symbol): void;

    /**
     * Adds the new subscription to the existing subscribed events.
     */
    protected addSubscription = (eventName: string, value: D): Symbol => {
        const subscriptionID = Symbol(eventName);

        this._subscribedEvents.set(subscriptionID, value);

        return subscriptionID;
    }

    /**
     * Removes a subscription based off the subscriptionID from the internal Map object
     */
    protected removeSubscription = (subscriptionID: Symbol) => {
        this._subscribedEvents.delete(subscriptionID);
    }

    /**
     * Returns the value of the subscriptionID
     */
    protected getSubcriptionValue = (subscriptionID: Symbol) => {
        return this._subscribedEvents.get(subscriptionID);
    }
}