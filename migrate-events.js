/**
 * Script de Migración - Actualizar Eventos Antiguos
 * 
 * Este script actualiza los eventos antiguos que no tienen trafficSource
 * calculado y los procesa con el TrafficSourceDetector.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const TrafficSourceDetector = require('./services/trafficSourceDetector');

const API_KEY = 'key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4';

async function migrateEvents() {
    try {
        console.log('🔍 Conectando a MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB\n');

        // Buscar eventos sin trafficSource
        console.log('📋 Buscando eventos sin trafficSource...');
        const eventsWithoutTrafficSource = await Event.find({
            apiKey: API_KEY,
            $or: [
                { 'trafficSource.type': { $exists: false } },
                { 'trafficSource.type': null }
            ]
        });

        console.log(`✅ Encontrados ${eventsWithoutTrafficSource.length} eventos para migrar\n`);

        if (eventsWithoutTrafficSource.length === 0) {
            console.log('✅ No hay eventos para migrar');
            return;
        }

        // Migrar cada evento
        let migratedCount = 0;
        let errorCount = 0;

        for (const event of eventsWithoutTrafficSource) {
            try {
                // Detectar traffic source
                const trafficSource = TrafficSourceDetector.detectSource({
                    gclid: event.gclid,
                    fbclid: event.fbclid,
                    ttclid: event.ttclid,
                    li_fat_id: event.li_fat_id,
                    utm_source: event.utm_source,
                    utm_medium: event.utm_medium,
                    utm_campaign: event.utm_campaign,
                    referrer: event.referrer
                });

                // Actualizar evento
                event.trafficSource = trafficSource;
                
                // Si no tiene referrerDomain, calcularlo
                if (!event.referrerDomain && event.referrer) {
                    event.referrerDomain = TrafficSourceDetector.extractDomain(event.referrer);
                }

                await event.save();
                migratedCount++;

                if (migratedCount % 10 === 0) {
                    console.log(`   Migrados ${migratedCount}/${eventsWithoutTrafficSource.length} eventos...`);
                }
            } catch (error) {
                console.error(`   ❌ Error migrando evento ${event._id}:`, error.message);
                errorCount++;
            }
        }

        console.log('\n✅ Migración completada:');
        console.log(`   - Eventos migrados: ${migratedCount}`);
        console.log(`   - Errores: ${errorCount}`);

        // Verificar resultados
        console.log('\n📊 Verificando resultados...');
        const byTrafficType = await Event.aggregate([
            { $match: { apiKey: API_KEY } },
            {
                $group: {
                    _id: '$trafficSource.type',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        console.log('\n📋 Eventos por tipo de tráfico:');
        byTrafficType.forEach(item => {
            console.log(`   ${item._id || 'undefined'}: ${item.count} eventos`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Desconectado de MongoDB');
    }
}

// Ejecutar migración
migrateEvents();
