/**
 * API Client для GoNails
 * Автоопределение базового URL для работы и на localhost, и на продакшене
 */

// Определяем базовый URL API:
// - localhost / *.onrender.com — webapp раздаётся тем же сервером, что и API → относительный путь
// - *.github.io — статика на GitHub Pages, API живёт на Render → абсолютный URL
const API_BASE = (() => {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('onrender.com')) {
        return '/api';
    }
    if (host.endsWith('github.io')) {
        return 'https://gonails-api.onrender.com/api';
    }
    return '/api';
})();

const TELEGRAM_USER = window.Telegram?.WebApp?.initDataUnsafe?.user || null;
const TELEGRAM_USER_ID = TELEGRAM_USER?.id || null;

// user_id может прийти и query-параметром (бот добавляет ?user_id=... при открытии панели)
const QUERY_USER_ID = new URLSearchParams(window.location.search).get('user_id');
const EFFECTIVE_USER_ID = TELEGRAM_USER_ID || (QUERY_USER_ID ? Number(QUERY_USER_ID) : null);

// Клиентский гейт — мягкий: пускаем env-админа или того, кто пришёл по ссылке из бота
// (?user_id= добавляется ботом при открытии панели). Реальную проверку прав делает сервер.
const ADMIN_USER_IDS = [5662481961];
const IS_ADMIN = ADMIN_USER_IDS.includes(EFFECTIVE_USER_ID) || !!QUERY_USER_ID;

async function apiGet(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

async function apiPost(endpoint, body) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

async function apiPatch(endpoint, body) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

async function apiDelete(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}
