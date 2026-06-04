import mqtt from 'mqtt';
const options = {
    clientId: 'test-browser-' + Math.random().toString(16).slice(2),
    clean: true,
    connectTimeout: 5000
};
console.log('Testing HiveMQ Public Broker (browser-compatible)...');
const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', options);
client.on('connect', () => {
    console.log('✓ Connected to HiveMQ Public Broker via WSS!');
    client.subscribe('robot/status/#', (err) => {
        if (!err) console.log('✓ Subscribed to robot/status/#');
    });
    setTimeout(() => {
        client.publish('robot/drive/vector', '0.5,0.0');
        console.log('✓ Published test message to robot/drive/vector');
        setTimeout(() => client.end(), 1000);
    }, 1000);
});
client.on('message', (topic, msg) => {
    console.log('✓ Received:', topic, msg.toString());
});
client.on('error', (err) => {
    console.log('✗ Error:', err.message);
    process.exit(1);
});
