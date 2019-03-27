export interface ISocketClient {
    connect: (url: string) => Promise<void>;
    close: () => void;
    publish: Function;
    subscribe: Function;
    unsubscribe: (subscriptionID: Symbol) => void;
}