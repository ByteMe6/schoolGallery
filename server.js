require('dotenv').config();
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const favicon = require('serve-favicon');

const app = express();
const port = process.env.PORT || 3000;
const hostname = '0.0.0.0';

// Безопасность
app.use(helmet({
    contentSecurityPolicy: false // Отключаем CSP для локальной разработки
}));

// Включаем CORS
app.use(cors());

// Сжатие ответов
app.use(compression());

// Логирование
app.use(morgan('dev'));

// Favicon
app.use(favicon(path.join(__dirname, 'favicon.ico')));

// Статические файлы
app.use(express.static(__dirname, {
    maxAge: '1h', // Кэширование на 1 час
    etag: true,
    lastModified: true
}));

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Что-то пошло не так!');
});

// Запуск сервера
app.listen(port, hostname, () => {
    console.log(`\n🚀 Сервер запущен по адресу http://${hostname}:${port}/`);
    console.log('\n📱 Для доступа из локальной сети используйте:');
    
    // Получаем локальный IP
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Пропускаем non-IPv4 и internal адреса
            if (net.family === 'IPv4' && !net.internal) {
                console.log(`   http://${net.address}:${port}/`);
            }
        }
    }
    
    console.log('\n📝 Доступные команды:');
    console.log('   npm run dev    - Запуск сервера разработки с автоперезагрузкой');
    console.log('   npm run serve  - Запуск в production режиме через PM2');
    console.log('   npm start     - Обычный запуск сервера\n');
}); 