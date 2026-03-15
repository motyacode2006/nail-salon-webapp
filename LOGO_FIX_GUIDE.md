# 🔧 Исправление проблемы с логотипом в Telegram WebApp

## 📋 Проблема

При загрузке WebApp на GitHub Pages логотип `gonails.jpg` не отображается:
```
Failed to load resource: net::ERR_FILE_NOT_FOUND gonails.jpg:1
```

## 🔍 Причина

GitHub Pages размещает проекты в подпапке:
- URL: `https://username.github.io/nail-salon-webapp/`
- Путь к файлу: `/nail-salon-webapp/gonails.jpg`
- Относительный путь `gonails.jpg` не работает, потому что браузер ищет файл в корне домена

---

## ✅ ВАРИАНТ А: Правильный путь для GitHub Pages

### Решение 1: Абсолютный путь с именем репозитория

```html
<img src="/nail-salon-webapp/gonails.jpg" alt="GoNails">
```

**Плюсы:** Работает на GitHub Pages
**Минусы:** Не работает локально (нужно менять путь)

### Решение 2: Использовать `<base>` тег

Добавьте в `<head>`:
```html
<base href="/nail-salon-webapp/">
```

Теперь все относительные пути будут работать:
```html
<img src="gonails.jpg" alt="GoNails">  <!-- Резолвится в /nail-salon-webapp/gonails.jpg -->
```

**Важно:** Это влияет на ВСЕ относительные ссылки на странице!

---

## ✅ ВАРИАНТ Б: Универсальный код с fallback (РЕКОМЕНДУЕТСЯ)

Текущее решение в `index.html` автоматически:
1. Определяет тип хостинга (localhost, GitHub Pages, Telegram)
2. Подбирает правильный путь
3. Пробует несколько вариантов загрузки
4. Показывает CSS-логотип при ошибке

### Диагностика в консоли

Откройте DevTools (F12) → Console и увидите:

```
════════════════════════════════════════
🎨 ЗАГРУЗКА ЛОГОТИПА GoNails
════════════════════════════════════════
🔍 ДИАГНОСТИКА ПУТЕЙ:
   Hostname: motyacode2006.github.io
   Pathname: /nail-salon-webapp/
   Full URL: https://motyacode2006.github.io/nail-salon-webapp/
   Is GitHub Pages: true
   Repo name: nail-salon-webapp
   ✅ GitHub Pages path: /nail-salon-webapp/gonails.jpg

🔄 Пробуем путь: /nail-salon-webapp/gonails.jpg
   Response status: 200
   Response OK: true
   Content-Type: image/jpeg
   ✅ MIME-тип корректный: image/jpeg
   ✅ Image test SUCCESS: /nail-salon-webapp/gonails.jpg
════════════════════════════════════════
✅ ЛОГОТИП УСПЕШНО ЗАГРУЖЕН: /nail-salon-webapp/gonails.jpg
════════════════════════════════════════
```

---

## ✅ ВАРИАНТ В: Base64 (встроить картинку в HTML)

### Как конвертировать в base64:

1. Откройте https://www.base64-image.de/
2. Загрузите `gonails.jpg`
3. Скопируйте сгенерированный код

### Использование:

```html
<img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." alt="GoNails">
```

**Плюсы:**
- Работает везде (localhost, GitHub Pages, Telegram)
- Нет проблем с путями
- Нет CORS-проблем

**Минусы:**
- Увеличивает размер HTML-файла на ~30-50%
- Невозможно кэширование отдельно от HTML

### Оптимизация для base64:

Если размер файла большой, можно:
1. Сжать изображение (TinyPNG, Squoosh)
2. Использовать WebP формат (меньший размер)
3. Использовать SVG (если логотип векторный)

---

## 🚀 РЕКОМЕНДАЦИЯ

**Используйте текущий код с автоматическим определением путей + fallback на CSS-логотип.**

Это даёт:
- ✅ Работает локально
- ✅ Работает на GitHub Pages
- ✅ Работает в Telegram WebApp
- ✅ Красивый fallback при ошибке
- ✅ Подробная диагностика

---

## 📝 Дополнительные проверки

### 1. Проверка MIME-типа на GitHub Pages

GitHub Pages должен отдавать JPEG как `image/jpeg`. Проверьте:
```bash
curl -I https://motyacode2006.github.io/nail-salon-webapp/gonails.jpg
```

Должно быть:
```
Content-Type: image/jpeg
```

### 2. Проверка прав файла

Убедитесь, что файл `gonails.jpg`:
- Находится в той же папке, что и `index.html`
- Имеет права на чтение (chmod 644)
- Имеет корректное расширение (.jpg, не .jpeg или .JPG)

### 3. Проверка регистра имени

GitHub Pages чувствителен к регистру:
- `gonails.jpg` ≠ `GoNails.jpg` ≠ `GONAILS.JPG`

Убедитесь, что имя файла точно совпадает с `src` в HTML.

---

## 📞 Если проблема осталась

1. Откройте консоль браузера (F12 → Console)
2. Скопируйте весь вывод диагностики
3. Проверьте, что файл загружен на GitHub в правильную папку

Файловая структура должна быть:
```
nail-salon-webapp/
├── index.html
└── gonails.jpg      ← В той же папке!
```
