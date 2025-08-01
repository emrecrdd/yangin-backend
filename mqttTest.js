const mqtt = require('mqtt');
const { v4: uuidv4 } = require('uuid'); // <== bu satırı ekle

const client = mqtt.connect('mqtt://localhost:1883');

// Gerçek UUID’ler oluştur
const fakeSensors = [
  {
    sensorId: uuidv4(),
    latitude: 40.712776,
    longitude: -74.005974,
    temperature: 45,
    smoke: 50,
    humidity: 30,
  },
  {
    sensorId: uuidv4(),
    latitude: 40.713776,
    longitude: -74.002974,
    temperature: 70,
    smoke: 300,
    humidity: 40,
  },
  {
    sensorId: uuidv4(),
    latitude: 40.714776,
    longitude: -74.010974,
    temperature: 25,
    smoke: 20,
    humidity: 60,
  },
  {
    sensorId: uuidv4(),
    latitude: 40.715776,
    longitude: -74.008974,
    temperature: 80,
    smoke: 400,
    humidity: 25,
  },
];

client.on('connect', () => {
  console.log('🔥 MQTT client connected');

  fakeSensors.forEach((sensor, index) => {
    setTimeout(() => {
      client.publish('sensor/data', JSON.stringify(sensor), () => {
        console.log(`📡 MQTT verisi gönderildi: ${sensor.sensorId}`);
        if (index === fakeSensors.length - 1) {
          client.end();
        }
      });
    }, index * 500);
  });
});

client.on('error', (err) => {
  console.error('MQTT error:', err.message);
});
