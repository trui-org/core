import { SocketIOServer } from '../infra/SocketIOServer';
import { SocketIOClient } from '../../adapters';

const url = 'http://localhost';
const mockServer = new SocketIOServer();
let client: SocketIOClient;

describe('Testing the SocketIO Adapter', () => {
    beforeAll(() => {
        mockServer.start();
    })

    beforeEach(() => {
        client = new SocketIOClient({ port: mockServer.port.toString() });
    })

    afterEach(() => {
        if (client.connected) {
            client.close();
        }
    })

    test('it should connect properly', async () => {
        // expect.assertions(1);
        // client.connect() resolves to nothing so it should be undefined
        expect(client.connect(url)).resolves.toBeUndefined();
        expect(client.connected).toBe(true);
        // console.log(`connected: ${client.connected}`)
        // await client.connect(url);
        // console.log(`connected: ${client.connected}`)
    })

    // test('it should close properly', async () => {
    //     await client.connect(url);
    //     expect(client.connected).toBe(true);

    //     client.close();
    //     expect(client.connected).toBe(false);
    // })

    // test('it should publish properly', async () => {
    //     await client.connect(url);

    //     mockServer.registerEvent('test-event', (msg: string) => {
    //         expect(msg).toBe('foo');
    //     })

    //     client.publish('test-event', 'foo');
    // })

    afterAll(() => {
        mockServer.stop();
    })
})