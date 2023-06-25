import {Telegraf, Context} from 'telegraf';
import {Client} from 'pg';
import {config} from "dotenv";

config();

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

async function handlePurchaseMessage(message: any) {
    const chatId: string = process.env.CHAT_ID!.toString(); // Замените на ID админского чата

    try {
        if (message.payload) { // Добавлена проверка на пустое значение payload
            // const telegramMessage = JSON.parse(message.payload);
            const telegramMessage = message.payload;
            await bot.telegram.sendMessage(chatId, telegramMessage);
        } else {
            bot.telegram.sendMessage(chatId, "payload is empty");

            console.log(69);
        }
    } catch (error) {
        console.error(error);
    }
}


pgClient.connect(async (err) => {
    if (err) {
        console.error('connection error', err.stack);
        process.exit(-1);
    }

    console.log('connected');

    // pgClient.query('LISTEN purchases_queue');
    await pgClient.query('LISTEN purchases');
    console.log("reached");

    pgClient.on('notification', (notification) => {
        console.log('Received notification:', notification);
        handlePurchaseMessage(notification);
    });
});


// Запуск бота
bot.launch().then(() => {
    console.log('Бот запущен');
}).catch((error) => {
    console.error('Ошибка при запуске бота:', error);
});













