/**
 * Provides the interaction of connecting to
 * a WebSocket Server and being able to
 * 'publish' and 'subscribe' to events
 */
interface ISocketClient<D = any> {
    connect: (url: string) => Promise<any>;
    close: () => void;
    publish: (eventName: string, data: any) => void;
    subscribe: (eventName: string, callback: subscribeCallbackType<D>) => void;
    unsubscribe: (eventName: string) => void;
}

type subscribeCallbackType<U> = (data: U) => any;