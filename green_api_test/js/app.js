// Ждём полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Получаем элементы со страницы
    const idInstanceInput = document.getElementById('idInstance');
    const apiTokenInput = document.getElementById('apiTokenInstance');
    const responseArea = document.getElementById('response');
    
    const btnGetSettings = document.getElementById('getSettings');
    const btnGetState = document.getElementById('getStateInstance');
    const btnSendMessage = document.getElementById('sendMessage');
    const btnSendFile = document.getElementById('sendFileByUrl');
    
    // Проверяем, все ли элементы найдены
    if (!btnGetSettings || !btnGetState || !btnSendMessage || !btnSendFile) {
        console.error('Ошибка: не все кнопки найдены в HTML');
        return;
    }
    
    // Базовый URL GREEN-API
    const BASE_URL = 'https://api.green-api.com';
    
    // Функция для вывода ответа в textarea
    function showResponse(data) {
        responseArea.value = JSON.stringify(data, null, 2);
    }
    
    // Функция для выполнения запросов к API
    async function callApi(method, body = null) {
        const idInstance = idInstanceInput.value.trim();
        const apiToken = apiTokenInput.value.trim();
        
        if (!idInstance || !apiToken) {
            showResponse({ error: 'Заполните idInstance и ApiTokenInstance' });
            return;
        }
        
        const url = `${BASE_URL}/waInstance${idInstance}/${method}/${apiToken}`;
        
        const options = {
            method: body ? 'POST' : 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
        
        if (body) {
            options.body = JSON.stringify(body);
        }
        
        try {
            showResponse({ status: 'Загрузка...' });
            const response = await fetch(url, options);
            const data = await response.json();
            showResponse(data);
        } catch (error) {
            showResponse({ error: 'Ошибка сети или CORS', details: error.message });
        }
    }
    
    // Обработчики
    btnGetSettings.addEventListener('click', () => callApi('getSettings'));
    btnGetState.addEventListener('click', () => callApi('getStateInstance'));
    
    btnSendMessage.addEventListener('click', () => {
        const phone = prompt('Введите номер телефона (например: 79991234567):');
        if (!phone) return;
        const message = prompt('Введите текст сообщения:');
        if (!message) return;
        callApi('sendMessage', { chatId: `${phone}@c.us`, message });
    });
    
    btnSendFile.addEventListener('click', () => {
        const phone = prompt('Введите номер телефона (например: 79991234567):');
        if (!phone) return;
        const fileUrl = prompt('Введите URL файла:');
        if (!fileUrl) return;
        let fileName = fileUrl.split('/').pop().split('?')[0] || 'file';
        callApi('sendFileByUrl', { chatId: `${phone}@c.us`, urlFile: fileUrl, fileName });
    });
    
});