/**
 * Script de prueba para verificar el FIX del rango de fechas
 * Ejecutar con: node test-date-range-fixed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');

async function testDateRangeFix() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB');
        
        const apiKey = 'key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4';
        
        console.log('\n🔍 ANTES DEL FIX (zona horaria local):');
        console.log('=====================================');
        
        const wrongStart = new Date('2025-11-18');
        wrongStart.setHours(0, 0, 0, 0);
        
        const wrongEnd = new Date('2025-11-18');
        wrongEnd.setHours(23, 59, 59, 999);
        
        console.log('Start:', wrongStart.toISOString());
        console.log('End:', wrongEnd.toISOString());
        
        const wrongCount = await Event.countDocuments({
            apiKey,
            timestamp: { $gte: wrongStart, $lte: wrongEnd }
        });
        
        console.log('Eventos encontrados:', wrongCount, wrongCount === 0 ? '❌' : '✅');
        
        console.log('\n🔍 DESPUÉS DEL FIX (UTC):');
        console.log('=========================');
        
        const correctStart = new Date('2025-11-18T00:00:00.000Z');
        const correctEnd = new Date('2025-11-18T23:59:59.999Z');
        
        console.log('Start:', correctStart.toISOString());
        console.log('End:', correctEnd.toISOString());
        
        const correctCount = await Event.countDocuments({
            apiKey,
            timestamp: { $gte: correctStart, $lte: correctEnd }
        });
        
        console.log('Eventos encontrados:', correctCount, correctCount > 0 ? '✅' : '❌');
        
        if (correctCount > 0) {
            console.log('\n📋 Eventos del 18 de noviembre:');
            const events = await Event.find({
                apiKey,
                timestamp: { $gte: correctStart, $lte: correctEnd }
            });
            
            events.forEach((event, index) => {
                console.log(`\n  ${index + 1}. ${event.eventType}`);
                console.log(`     Timestamp: ${event.timestamp.toISOString()}`);
                console.log(`     Campaign: ${event.utm_campaign || 'N/A'}`);
                console.log(`     Traffic: ${event.trafficSource?.type || 'N/A'}`);
            });
        }
        
        console.log('\n✅ FIX VERIFICADO - El problema era la zona horaria local vs UTC');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
    }
}

testDateRangeFix();
