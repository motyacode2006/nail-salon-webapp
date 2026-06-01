/**
 * API Client для GoNails
 * Автоопределение базового URL для работы и на localhost, и на продакшене
 */

// Определяем базовый URL API.
// Используем относительный путь /api — работает и на localhost, и на GitHub Pages
const API_BASE = '/api';

const TELEGRAM_USER = window.Telegram?.WebApp?.initDataUnsafe?.user || null;
const TELEGRAM_USER_ID = TELEGRAM_USER?.id || null;
const IS_ADMIN = TELEGRAM_USER_ID === 5662481961;

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
