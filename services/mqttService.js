const mqtt = require('mqtt');
const { Sensor, Alert } = require('../models');
const socketService = require('./socketService'); // socketService'i import et

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
const MQTT_TOPIC = process.env.MQTT_TOPIC || 'sensor/data';

const client = mqtt.connect(MQTT_BROKER_URL);

client.on('connect', () => {
  console.log(`📡 MQTT bağlı: ${MQTT_BROKER_URL}`);
  client.subscribe(MQTT_TOPIC, (err) => {
    if (err) {
      console.error('❌ MQTT subscribe hatası:', err.message);
    } else {
      console.log(`📥 Abone olundu: ${MQTT_TOPIC}`);
    }
  });
});

client.on('message', async (topic, messageBuffer) => {
  let payload;

  try {
    payload = JSON.parse(messageBuffer.toString());
  } catch (err) {
    console.error('❌ MQTT veri JSON parse hatası:', err.message);
    return;
  }

  const { sensorId, temperature, smoke, humidity } = payload;

  if (!sensorId) {
    console.warn('⚠️ MQTT verisi geçersiz: sensorId eksik');
    return;
  }

  if (
    (temperature !== undefined && (temperature < -50 || temperature > 150)) ||
    (humidity !== undefined && (humidity < 0 || humidity > 100)) ||
    (smoke !== undefined && (smoke < 0 || smoke > 1000))
  ) {
    console.warn(`⚠️ MQTT verisi sıra dışı değer içeriyor: ${JSON.stringify(payload)}`);
    return;
  }

  try {
    const sensor = await Sensor.findByPk(sensorId);
    if (!sensor) {
      console.warn(`🚫 Sensör bulunamadı: ${sensorId}`);
      return;
    }

    let status = 'active';
    let alertsToCreate = [];

    if (temperature > 60) {
      status = 'warning';
      const existing = await Alert.findOne({
        where: {
          sensorId,
          alertType: 'temperature',
          status: 'active',
        },
      });

      if (!existing) {
        alertsToCreate.push({
          alertType: 'temperature',
          alertValue: temperature,
          message: `Yüksek sıcaklık tespit edildi: ${temperature}°C`,
        });
      }
    }

    if (smoke > 300) {
      status = 'warning';
      const existing = await Alert.findOne({
        where: {
          sensorId,
          alertType: 'smoke',
          status: 'active',
        },
      });

      if (!existing) {
        alertsToCreate.push({
          alertType: 'smoke',
          alertValue: smoke,
          message: `Yüksek duman seviyesi tespit edildi: ${smoke}`,
        });
      }
    }

    if ((temperature < 5 || temperature === null) && (smoke < 10 || smoke === null)) {
      status = 'pending';
    }

    await sensor.update({
      temperature,
      smoke,
      humidity,
      status,
      lastDataReceivedAt: new Date(),
      updatedAt: new Date(),
    });

    // Socket.IO ile güncellenen sensör bilgisini yayınla
    socketService.emitSensorUpdate(sensor);

    for (const alert of alertsToCreate) {
      await Alert.create({
        sensorId,
        alertType: alert.alertType,
        alertValue: alert.alertValue,
        message: alert.message,
      });
    }

    console.log(`✅ MQTT veri güncellendi → Sensör: ${sensorId} | 🌡️ ${temperature}°C | 💨 ${smoke} | 💧 ${humidity} | Durum: ${status}`);

    if (alertsToCreate.length > 0) {
      console.log(`🚨 Yeni uyarı(lar): ${alertsToCreate.map(a => a.message).join(' | ')}`);
    }

  } catch (err) {
    console.error('❌ MQTT verisi işlenirken hata oluştu:', err.message);
  }
});
