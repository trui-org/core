export interface ISocketClient {
    /** Connects the client to a designated server. */
    connect: (url: string) => Promise<void>;
    /** Closes the open connection to the server. */
    close: () => void;
    /** Determines if the client is connected to a server */
    connected: boolean;
    /** Publish data out to the network */
    publish: Function;
    /** Subscribe to events */
    subscribe: Function;
    /** Unsubscribe from an event */
    unsubscribe: (subscriptionID: Symbol) => void;
}