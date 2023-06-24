import { Telegraf, Context } from 'telegraf';
import { Client } from 'pg';
require('dotenv').config();

// Подключение к базе данных PostgreSQL
const pgClient = new Client({
    user: 'user1',
    host: 'localhost',
    database: 'tz_2',
    // database: 'chat_ts',
    password: '12345678',
    port: 5432, // Порт PostgreSQL
});



// Создание экземпляра бота Telegraf
const bot = new Telegraf(process.env.BOT_TOKEN!.toString());



// Обработчик команды /start
// bot.start((ctx: Context) => {
//     ctx.reply('Питер - интернетная помойка');
// });

// Обработчик покупки
// bot.command('purchase', async (ctx: Context) => {
//     try {
//         // Получение информации о покупке из базы данных
//         const result = await pgClient.query('SELECT * FROM purchases');
//         const purchases = result.rows;
//
//         // Отправка информации о покупке в телеграм-бота
//         for (const purchase of purchases) {
//             ctx.reply(`Новая покупка: ${purchase.name} bought for ${purchase.price}`);
//
//         }
//     } catch (error) {
//         console.error('Ошибка при получении информации о покупке:', error);
//     }
// });
async function handlePurchaseMessage(message: any) {
    const chatId: string = process.env.BOT_TOKEN!.toString(); // Замените на ID админского чата

    try {
        if (message.payload) { // Добавлена проверка на пустое значение payload
            const telegramMessage = JSON.parse(message.payload);
            await bot.telegram.sendMessage(chatId, telegramMessage);
        }
        else {
            console.log(69);
        }
    } catch (error) {
        console.error(error);
    }
}

// pgClient.on('notification', (notification) => {
//     console.log('Received notification:', notification);
//     handlePurchaseMessage(notification);
//     // const purchaseName = notification.payload;
//     // console.log(purchaseName);
//     // bot.telegram.sendMessage('626266495', `Новая покупка: ${purchaseName}`);
// });

pgClient.connect((err) => {
    if (err) {
        console.error('connection error', err.stack);
        process.exit(-1);
    }

    console.log('connected');

    // pgClient.query('LISTEN purchases_queue');
    pgClient.query('LISTEN purchases');
    console.log("reached");

    pgClient.on('notification', (notification) => {
        console.log('Received notification:', notification);
        console.log(notification.payload);
        // bot.telegram.sendMessage('626266495', notification.toString());
        bot.telegram.sendMessage('626266495', "Привет, Мама");
        handlePurchaseMessage(notification);
    });
});


// Запуск бота
bot.launch().then(() => {
    console.log('Бот запущен');
}).catch((error) => {
    console.error('Ошибка при запуске бота:', error);
});













