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
        client.close();
    })

    test('it should connect properly', () => {
        // client.connect() resolves to nothing so it should be undefined
        expect(client.connect(url))
            .resolves
            .toBeUndefined()
    })

    test('it should close properly', async () => {
        await client.connect(url);
        expect(client.close()).toHaveReturned();
    })

    afterAll(() => {
        mockServer.stop();
    })
})