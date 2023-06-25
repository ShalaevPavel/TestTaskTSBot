import { Client } from 'pg';
import { Telegraf } from 'telegraf';
// import { handlePurchaseMessage } from './index.ts';
import {config} from "dotenv";

config();


async function handlePurchaseMessage(message, bot) {
    const chatId = process.env.TEST_CHAT_ID.toString(); // Замените на ID админского чата

    try {
        if (message.payload) { // Добавлена проверка на пустое значение payload
            // const telegramMessage = JSON.parse(message.payload);
            const telegramMessage = message.payload;
            await bot.telegram.sendMessage(chatId, telegramMessage);
        } else {
            bot.telegram.sendMessage(chatId, "payload is empty");


        }
    } catch (error) {
        console.error(error);
    }
}
// Unit-тесты

describe('handlePurchaseMessage', () => {
    let testBot;
    let testPgClient;

    beforeAll(async () => {
        // Подключение к тестовой базе данных PostgreSQL
        testPgClient = new Client({
            user: 'user1',
            host: 'localhost',
            database: 'tz_2_test',
            password: '12345678',
            port: 5432
        });
        await testPgClient.connect();

        // Создание экземпляра тестового бота Telegraf
        testBot = new Telegraf(process.env.TEST_BOT_TOKEN.toString());
        testBot.telegram.sendMessage = jest.fn(); // Мок для sendMessage

        // Запуск слушателя событий базы данных
        await testPgClient.query('LISTEN purchases');
    });

    afterAll(async () => {
        // Отключение от тестовой базы данных PostgreSQL
        await testPgClient.end();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should send message if payload is not empty', async () => {
        const message = { payload: 'your_payload' };

        await handlePurchaseMessage(message, testBot);

        expect(testBot.telegram.sendMessage).toHaveBeenCalledWith(process.env.TEST_CHAT_ID.toString(), 'your_payload');
        expect(testBot.telegram.sendMessage).toHaveBeenCalledTimes(1);
    });

    test('should send "payload is empty" message if payload is empty', async () => {
        const message = { payload: '' };

        await handlePurchaseMessage(message, testBot);

        expect(testBot.telegram.sendMessage).toHaveBeenCalledWith(process.env.TEST_CHAT_ID.toString(), 'payload is empty');
        expect(testBot.telegram.sendMessage).toHaveBeenCalledTimes(1);
    });

    test('should handle errors correctly', async () => {
        const message = { payload: 'your_payload' };
        const mockError = new Error('test error');

        testBot.telegram.sendMessage.mockRejectedValueOnce(mockError);

        await handlePurchaseMessage(message, testBot);

        expect(testBot.telegram.sendMessage).toHaveBeenCalledWith(process.env.TEST_CHAT_ID.toString(), 'your_payload');
        expect(testBot.telegram.sendMessage).toHaveBeenCalledTimes(1);
        // expect(console.error).toHaveBeenCalledWith(mockError);
    });
});
