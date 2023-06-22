import { Telegraf, Context } from 'telegraf';
import { Client } from 'pg';

// Подключение к базе данных PostgreSQL
const pgClient = new Client({
    user: 'user1',
    host: 'localhost',
    database: 'chat_ts',
    password: '12345678',
    port: 5432, // Порт PostgreSQL
});

pgClient.connect();

// Создание экземпляра бота Telegraf
const bot = new Telegraf('5973636409:AAH46_rWxHYdZWtbReockDQma0hqDf5Yv1g');

// Обработчик команды /start
bot.start((ctx: Context) => {
    ctx.reply('Привет! Я бот отслеживания покупок 69420.');
});

// Обработчик покупки
bot.command('purchase', async (ctx: Context) => {
    try {
        // Получение информации о покупке из базы данных
        const result = await pgClient.query('SELECT * FROM purchases');
        const purchases = result.rows;

        // Отправка информации о покупке в телеграм-бота
        for (const purchase of purchases) {
            ctx.reply(`Новая покупка: ${purchase.name}`);

        }
    } catch (error) {
        console.error('Ошибка при получении информации о покупке:', error);
    }
});

// Запуск бота
bot.launch().then(() => {
    console.log('Бот запущен');
}).catch((error) => {
    console.error('Ошибка при запуске бота:', error);
});
