/**
 * JavaScript для WebApp записи на маникюр
 * Обрабатывает форму и отправляет данные в Telegram-бот
 */

// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;

// Информация об услугах (для отображения деталей)
const servicesInfo = {
    'Маникюр (60 мин, 1500 руб)': {
        duration: '60 минут',
        price: '1500 руб',
        description: 'Классический маникюр с обработкой кутикулы и покрытием'
    },
    'Педикюр (90 мин, 2500 руб)': {
        duration: '90 минут',
        price: '2500 руб',
        description: 'Полный уход за стопами и ногтями'
    },
    'Покрытие гель-лак (45 мин, 800 руб)': {
        duration: '45 минут',
        price: '800 руб',
        description: 'Долговременное покрытие на 2-3 недели'
    }
};

/**
 * Инициализация при загрузке страницы
 */
document.addEventListener('DOMContentLoaded', function() {
    // Расширяем WebApp на весь экран
    tg.expand();
    
    // Устанавливаем минимальную дату (сегодня)
    setMinDate();
    
    // Получаем элементы формы
    const form = document.getElementById('booking-form');
    const serviceSelect = document.getElementById('service');
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    const serviceInfo = document.getElementById('service-info');
    const serviceDetails = document.getElementById('service-details');
    
    // Обработчик изменения услуги - показываем информацию
    serviceSelect.addEventListener('change', function() {
        const selectedService = this.value;
        
        if (selectedService && servicesInfo[selectedService]) {
            const info = servicesInfo[selectedService];
            serviceDetails.innerHTML = `
                <p><strong>⏱ Длительность:</strong> ${info.duration}</p>
                <p><strong>💰 Стоимость:</strong> ${info.price}</p>
                <p><strong>📝 Описание:</strong> ${info.description}</p>
            `;
            serviceInfo.classList.remove('hidden');
        } else {
            serviceInfo.classList.add('hidden');
        }
    });
    
    // Обработчик отправки формы
    form.addEventListener('submit', handleSubmit);
    
    // Показываем главную кнопку Telegram (опционально)
    // tg.MainButton.setText('Записаться');
    // tg.MainButton.show();
    // tg.MainButton.onClick(handleSubmit);
});

/**
 * Устанавливает минимальную дату для выбора (сегодня)
 */
function setMinDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const minDate = `${year}-${month}-${day}`;
    
    document.getElementById('date').setAttribute('min', minDate);
}

/**
 * Обработчик отправки формы
 * @param {Event} event - Событие отправки формы
 */
async function handleSubmit(event) {
    event.preventDefault();
    
    // Получаем значения полей
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    
    // Валидация
    if (!service || !date || !time) {
        tg.showAlert('Пожалуйста, заполните все поля!');
        return;
    }
    
    // Проверка, что дата не в прошлом
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        tg.showAlert('Нельзя записаться на прошедшую дату!');
        return;
    }
    
    // Показываем индикатор загрузки
    showLoading();
    
    // Формируем данные для отправки
    const data = {
        service: service,
        date: date,
        time: time
    };
    
    try {
        // Отправляем данные в бот через Telegram WebApp API
        tg.sendData(JSON.stringify(data));
        
        // Закрываем WebApp (опционально - можно оставить)
        // tg.close();
        
    } catch (error) {
        console.error('Ошибка отправки данных:', error);
        hideLoading();
        tg.showAlert('Произошла ошибка при отправке. Попробуйте еще раз.');
    }
}

/**
 * Показывает индикатор загрузки
 */
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('submit-btn').disabled = true;
}

/**
 * Скрывает индикатор загрузки
 */
function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('submit-btn').disabled = false;
}

/**
 * Форматирует дату для отображения
 * @param {string} dateStr - Дата в формате YYYY-MM-DD
 * @returns {string} Отформатированная дата
 */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        weekday: 'long'
    };
    return date.toLocaleDateString('ru-RU', options);
}

// Логирование для отладки (можно убрать в продакшене)
console.log('WebApp инициализирован');
console.log('Платформа:', tg.platform);
console.log('Версия:', tg.version);
