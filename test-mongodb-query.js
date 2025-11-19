/**
 * Script de Diagnóstico - Verificar Eventos en MongoDB
 * 
 * Este script verifica directamente en MongoDB si hay eventos
 * y si el proyecto está configurado correctamente.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const Project = require('./models/Project');

const API_KEY = 'key_8bfce6f8-1d05-4a93-8a94-6e46aa33fea4';

async function diagnose() {
    try {
        console.log('🔍 Conectando a MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB\n');

        // 1. Verificar el proyecto
        console.log('📋 Paso 1: Verificar Proyecto');
        console.log('=====================================');
        const project = await Project.findOne({ apiKey: API_KEY });
        
        if (!project) {
            console.log('❌ NO se encontró ningún proyecto con este API Key');
            console.log('   API Key buscado:', API_KEY);
            console.log('\n📊 Proyectos existentes:');
            const allProjects = await Project.find().select('name apiKey user');
            allProjects.forEach((p, i) => {
                console.log(`   ${i + 1}. ${p.name}`);
                console.log(`      API Key: ${p.apiKey}`);
                console.log(`      User ID: ${p.user}`);
            });
        } else {
            console.log('✅ Proyecto encontrado:');
            console.log('   Nombre:', project.name);
            console.log('   API Key:', project.apiKey);
            console.log('   User ID:', project.user);
            console.log('   Creado:', project.createdAt);
        }

        // 2. Contar eventos totales
        console.log('\n📋 Paso 2: Contar Eventos');
        console.log('=====================================');
        const totalEvents = await Event.countDocuments({ apiKey: API_KEY });
        console.log(`✅ Total de eventos con este API Key: ${totalEvents}`);

        if (totalEvents === 0) {
            console.log('❌ No hay eventos guardados con este API Key');
            console.log('\n📊 Verificando eventos con otros API Keys:');
            const eventsByApiKey = await Event.aggregate([
                {
                    $group: {
                        _id: '$apiKey',
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } }
            ]);
            eventsByApiKey.forEach((item, i) => {
                console.log(`   ${i + 1}. API Key: ${item._id}`);
                console.log(`      Eventos: ${item.count}`);
            });
        }

        // 3. Ver los últimos 5 eventos
        if (totalEvents > 0) {
            console.log('\n📋 Paso 3: Últimos 5 Eventos');
            console.log('=====================================');
            const recentEvents = await Event.find({ apiKey: API_KEY })
                .sort({ timestamp: -1 })
                .limit(5)
                .select('timestamp eventType pageUrl trafficSource utm_source utm_campaign');
            
            recentEvents.forEach((event, i) => {
                console.log(`\n   Evento ${i + 1}:`);
                console.log(`   - Tipo: ${event.eventType}`);
                console.log(`   - Fecha: ${event.timestamp}`);
                console.log(`   - URL: ${event.pageUrl}`);
                console.log(`   - Traffic Type: ${event.trafficSource?.type || 'N/A'}`);
                console.log(`   - Platform: ${event.trafficSource?.platform || 'N/A'}`);
                console.log(`   - UTM Source: ${event.utm_source || 'N/A'}`);
                console.log(`   - UTM Campaign: ${event.utm_campaign || 'N/A'}`);
            });
        }

        // 4. Contar por tipo de tráfico
        if (totalEvents > 0) {
            console.log('\n📋 Paso 4: Eventos por Tipo de Tráfico');
            console.log('=====================================');
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
            
            byTrafficType.forEach(item => {
                console.log(`   ${item._id || 'undefined'}: ${item.count} eventos`);
            });
        }

        // 5. Verificar rango de fechas
        if (totalEvents > 0) {
            console.log('\n📋 Paso 5: Rango de Fechas de los Eventos');
            console.log('=====================================');
            const oldestEvent = await Event.findOne({ apiKey: API_KEY })
                .sort({ timestamp: 1 })
                .select('timestamp');
            const newestEvent = await Event.findOne({ apiKey: API_KEY })
                .sort({ timestamp: -1 })
                .select('timestamp');
            
            console.log(`   Evento más antiguo: ${oldestEvent.timestamp}`);
            console.log(`   Evento más reciente: ${newestEvent.timestamp}`);
            
            const now = new Date();
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            const recentCount = await Event.countDocuments({
                apiKey: API_KEY,
                timestamp: { $gte: thirtyDaysAgo }
            });
            console.log(`   Eventos en los últimos 30 días: ${recentCount}`);
        }

        // 6. Resumen y recomendaciones
        console.log('\n📋 Paso 6: Resumen y Recomendaciones');
        console.log('=====================================');
        
        if (!project) {
            console.log('❌ PROBLEMA: No existe un proyecto con este API Key');
            console.log('   SOLUCIÓN: Crea un proyecto en el dashboard o actualiza');
            console.log('             el API Key en WordPress');
        } else if (totalEvents === 0) {
            console.log('❌ PROBLEMA: El proyecto existe pero no hay eventos');
            console.log('   SOLUCIÓN: Verifica que el script de WordPress esté');
            console.log('             enviando eventos correctamente');
        } else {
            console.log('✅ TODO ESTÁ BIEN:');
            console.log(`   - Proyecto existe: ${project.name}`);
            console.log(`   - Total de eventos: ${totalEvents}`);
            console.log('   - Los eventos deberían aparecer en el dashboard');
            console.log('\n   Si no aparecen en el dashboard, el problema está en:');
            console.log('   1. El frontend no está consultando correctamente');
            console.log('   2. Hay un problema con el rango de fechas');
            console.log('   3. El usuario no tiene acceso al proyecto');
        }

        console.log('\n✅ Diagnóstico completado\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Desconectado de MongoDB');
    }
}

// Ejecutar diagnóstico
diagnose();
