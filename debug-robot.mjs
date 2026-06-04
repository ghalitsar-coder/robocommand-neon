import mqtt from 'mqtt';
const options = {
    clientId: 'debug-' + Math.random().toString(16).slice(2),
    clean: true,
    connectTimeout: 5000
};
console.log('Debug: Simulating DPad N press...');
const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', options);
client.on('connect', () => {
    console.log('✓ Connected to broker');
    // Simulate pressing N (north)
    client.publish('robot/drive/vector', '0.00,1.00');
    console.log('✓ Published: robot/drive/vector "0.00,1.00"');
    console.log('(Check ESP32 Serial Monitor for reaction)');
    setTimeout(() => client.end(), 1000);
});
client.on('error', (err) => {
    console.log('✗ Error:', err.message);
});
