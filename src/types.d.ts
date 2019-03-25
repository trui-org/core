interface ISocketClient<S> {
    connect: (url: string) => Promise<S>;
    close: () => void;
    publish: Function;
    subscribe: Function;
    unsubscribe: (subscriptionID: Symbol) => void;
}