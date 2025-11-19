/**
 * Script de prueba para verificar el rango de fechas
 * Ejecutar con: node test-date-range.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

async function testDateRange() {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB');
        
        const apiKey = 'key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4';
        
        // 1. Contar TODOS los eventos con este API key
        const totalEvents = await Event.countDocuments({ apiKey });
        console.log('\n📊 Total de eventos con este API key:', totalEvents);
        
        // 2. Obtener el evento más reciente
        const latestEvent = await Event.findOne({ apiKey }).sort({ timestamp: -1 });
        console.log('\n🕐 Evento más reciente:');
        console.log('  - Timestamp:', latestEvent?.timestamp);
        console.log('  - Event Type:', latestEvent?.eventType);
        console.log('  - Campaign:', latestEvent?.utm_campaign);
        
        // 3. Obtener el evento más antiguo
        const oldestEvent = await Event.findOne({ apiKey }).sort({ timestamp: 1 });
        console.log('\n🕐 Evento más antiguo:');
        console.log('  - Timestamp:', oldestEvent?.timestamp);
        console.log('  - Event Type:', oldestEvent?.eventType);
        
        // 4. Contar eventos por día
        console.log('\n📅 Eventos por día:');
        const eventsByDay = await Event.aggregate([
            { $match: { apiKey } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: -1 } },
            { $limit: 10 }
        ]);
        
        eventsByDay.forEach(day => {
            console.log(`  ${day._id}: ${day.count} eventos`);
        });
        
        // 5. Probar el rango de fechas como lo hace el backend
        console.log('\n🔍 Probando rango de fechas (últimos 30 días):');
        
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        
        const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        startDate.setHours(0, 0, 0, 0);
        
        console.log('  Start Date:', startDate.toISOString());
        console.log('  End Date:', endDate.toISOString());
        
        const eventsInRange = await Event.countDocuments({
            apiKey,
            timestamp: { $gte: startDate, $lte: endDate }
        });
        
        console.log('  Eventos en rango:', eventsInRange);
        
        // 6. Probar específicamente el 18 de noviembre
        console.log('\n🔍 Probando específicamente el 18 de noviembre 2025:');
        
        const nov18Start = new Date('2025-11-18');
        nov18Start.setHours(0, 0, 0, 0);
        
        const nov18End = new Date('2025-11-18');
        nov18End.setHours(23, 59, 59, 999);
        
        console.log('  Start:', nov18Start.toISOString());
        console.log('  End:', nov18End.toISOString());
        
        const nov18Events = await Event.find({
            apiKey,
            timestamp: { $gte: nov18Start, $lte: nov18End }
        });
        
        console.log('  Eventos encontrados:', nov18Events.length);
        
        if (nov18Events.length > 0) {
            console.log('\n  Detalles de eventos del 18 de noviembre:');
            nov18Events.forEach((event, index) => {
                console.log(`\n  Evento ${index + 1}:`);
                console.log('    - ID:', event._id);
                console.log('    - Timestamp:', event.timestamp);
                console.log('    - Event Type:', event.eventType);
                console.log('    - Campaign:', event.utm_campaign);
                console.log('    - Traffic Type:', event.trafficSource?.type);
            });
        }
        
        // 7. Verificar el evento específico que mencionaste
        console.log('\n🔍 Buscando el evento específico (debug_test_001):');
        const specificEvent = await Event.findOne({ gclid: 'debug_test_001' });
        
        if (specificEvent) {
            console.log('  ✅ Evento encontrado:');
            console.log('    - ID:', specificEvent._id);
            console.log('    - Timestamp:', specificEvent.timestamp);
            console.log('    - API Key:', specificEvent.apiKey);
            console.log('    - Campaign:', specificEvent.utm_campaign);
        } else {
            console.log('  ❌ Evento NO encontrado');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n✅ Conexión cerrada');
    }
}

testDateRange();
