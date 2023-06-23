import { Telegraf, Context } from 'telegraf';
import { Client } from 'pg';

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
const bot = new Telegraf('5973636409:AAH46_rWxHYdZWtbReockDQma0hqDf5Yv1g');



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
    const chatId = '626266495'; // Замените на ID админского чата

    try {
        // const telegramMessage = JSON.parse(message.payload);
        const telegramMessage: string = message.leangth;
        await bot.telegram.sendMessage(chatId, telegramMessage);
        await bot.telegram.sendMessage(chatId, "13224224");
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

    pgClient.query('LISTEN purchases_queue');

    pgClient.on('notification', (notification) => {
        console.log('Received notification:', notification);
        console.log(notification.payload);
        bot.telegram.sendMessage('626266495', notification.toString());
        handlePurchaseMessage(notification);
    });
});


// Запуск бота
bot.launch().then(() => {
    console.log('Бот запущен');
}).catch((error) => {
    console.error('Ошибка при запуске бота:', error);
});













