import mqtt from 'mqtt';
const options = {
    clientId: 'test-node-' + Math.random().toString(16).slice(2),
    username: 'ghalytsarhivemq',
    password: 'Ember1233',
    clean: true,
    connectTimeout: 5000
};
console.log('Testing HiveMQ Cloud connection via WebSockets...');
const client = mqtt.connect('wss://8bbf3f5e18ea48e0ba67d15832b06403.s1.eu.hivemq.cloud:8884/mqtt', options);
client.on('connect', () => {
    console.log('✓ Connected to HiveMQ Cloud via WebSockets!');
    client.end();
    process.exit(0);
});
client.on('error', (err) => {
    console.log('✗ Error:', err.message);
    console.log('  Code:', err.code);
    client.end();
    process.exit(1);
});
setTimeout(() => {
    console.log('✗ Timeout: No response after 5 seconds');
    process.exit(1);
}, 6000);
