# 📚 Полная справка по API Endpoints

## 🔗 Базовый URL
```
http://localhost:8000/api/v1
```

---

## 🏷️ CATEGORIES

### 1. Получить все категории
```http
GET /api/v1/categories/
```

**Query параметры:**
- `search` - поиск по названию
- `ordering` - сортировка: `name`, `-name`, `created_at`, `-created_at`

**Пример запроса:**
```javascript
categoriesAPI.getAll({ 
    search: 'concert',
    ordering: 'name' 
});
```

**Ответ:**
```json
[
  {
    "id": 1,
    "slug": "concerts",
    "name": "Concerts",
    "description": "...",
    "icon": "concert.svg",
    "created_at": "2024-12-09T10:00:00Z"
  }
]
```

---

### 2. Получить категорию по slug
```http
GET /api/v1/categories/{slug}/
```

**Пример:**
```javascript
categoriesAPI.getBySlug('concerts');
```

---

### 3. Получить активности категории
```http
GET /api/v1/categories/{slug}/activities/
```

**Описание:** Возвращает только опубликованные активности с `date >= сегодня`

**Пример:**
```javascript
categoriesAPI.getActivities('concerts');
```

---

### 4. Создать категорию (admin only)
```http
POST /api/v1/categories/
```

**Body:**
```json
{
  "name": "New Category",
  "slug": "new-category",
  "description": "Description",
  "icon": "icon.svg"
}
```

---

### 5. Обновить категорию (admin only)
```http
PATCH /api/v1/categories/{slug}/
```

---

### 6. Удалить категорию (admin only)
```http
DELETE /api/v1/categories/{slug}/
```

---

## 🏢 ORGANIZERS

### 1. Получить всех организаторов
```http
GET /api/v1/organizers/
```

**Query параметры:**
- `search` - поиск по названию
- `ordering` - `name`, `-name`, `created_at`, `-created_at`

**Права доступа:**
- Обычные пользователи видят только публичную информацию
- Staff/admin видят полную информацию (включая email, phone)

---

### 2. Получить организатора по slug
```http
GET /api/v1/organizers/{slug}/
```

---

### 3. Получить активности организатора
```http
GET /api/v1/organizers/{slug}/activities/
```

**Описание:**
- Staff видит все активности
- Остальные - только published с `date >= сегодня`

---

### 4. Создать организатора (auth required)
```http
POST /api/v1/organizers/
```

**Body:**
```json
{
  "name": "Organizer Name",
  "slug": "organizer-name",
  "description": "...",
  "email": "contact@org.com",
  "phone": "+32123456789",
  "website": "https://org.com",
  "logo": "file or url"
}
```

---

### 5. Обновить организатора (auth required)
```http
PATCH /api/v1/organizers/{slug}/
```

---

### 6. Удалить организатора (admin only)
```http
DELETE /api/v1/organizers/{slug}/
```

---

## 🎯 ACTIVITIES

### 1. Получить все активности
```http
GET /api/v1/activities/
```

**Query параметры:**

| Параметр | Тип | Описание | Примеры |
|----------|-----|----------|---------|
| `category` | int | Фильтр по ID категории | `1`, `2` |
| `organizer` | int | Фильтр по ID организатора | `5` |
| `status` | string | Фильтр по статусу | `draft`, `published`, `cancelled` |
| `search` | string | Поиск по названию, описанию | `jazz concert` |
| `ordering` | string | Сортировка | `date`, `-date`, `created_at`, `-created_at`, `views_count`, `-views_count`, `price`, `-price` |
| `date_from` | date | От даты | `2024-12-15` |
| `date_to` | date | До даты | `2025-01-15` |
| `filter` | string | Временной фильтр | `upcoming`, `past` |
| `price` | string | Фильтр по цене | `free`, `paid` |

**Пример запроса:**
```javascript
activitiesAPI.getAll({
    category: 1,
    filter: 'upcoming',
    price: 'free',
    ordering: '-date',
    search: 'jazz'
});
```

**Ответ:**
```json
[
  {
    "id": 1,
    "slug": "jazz-concert",
    "name": "Jazz Concert",
    "summary": "Short description",
    "description": "Full description",
    "date": "2024-12-20",
    "time": "20:00:00",
    "category": {
      "id": 1,
      "slug": "concerts",
      "name": "Concerts"
    },
    "organizer": {
      "id": 1,
      "slug": "org-name",
      "name": "Organizer"
    },
    "author": {
      "id": 1,
      "username": "user"
    },
    "price": 25.00,
    "image": "http://...image.jpg",
    "status": "published",
    "views_count": 150,
    "recommended": true,
    "created_at": "2024-12-09T10:00:00Z",
    "updated_at": "2024-12-09T11:00:00Z"
  }
]
```

---

### 2. Получить активность по slug
```http
GET /api/v1/activities/{slug}/
```

**Особенность:** Увеличивает счетчик просмотров для published активностей (кроме автора)

**Пример:**
```javascript
activitiesAPI.getBySlug('jazz-concert');
```

**Ответ:** Полная информация об активности + адрес (если есть) + комментарии

---

### 3. Создать активность (auth required)
```http
POST /api/v1/activities/
```

**Body (FormData для изображения):**
```json
{
  "name": "New Activity",
  "slug": "new-activity",
  "summary": "Short summary",
  "description": "Full description",
  "date": "2024-12-25",
  "time": "18:00:00",
  "category": 1,
  "organizer": 1,
  "price": 10.00,
  "image": <File>,
  "status": "draft"
}
```

**Пример с FormData:**
```javascript
const formData = new FormData();
formData.append('name', 'Concert');
formData.append('slug', 'concert-slug');
formData.append('date', '2024-12-25');
formData.append('category', 1);
formData.append('organizer', 1);
formData.append('image', imageFile);

activitiesAPI.create(formData);
```

---

### 4. Обновить активность (author only)
```http
PATCH /api/v1/activities/{slug}/
```

**Body:** Частичное обновление, можно отправить только измененные поля

---

### 5. Удалить активность (author only)
```http
DELETE /api/v1/activities/{slug}/
```

---

## 📍 ACTIVITY ADDRESS

### 1. Получить адрес активности
```http
GET /api/v1/activities/{slug}/address/
```

**Ответ:**
```json
{
  "id": 1,
  "street": "Rue de la Loi 123",
  "city": "Brussels",
  "postal_code": "1000",
  "country": "Belgium",
  "latitude": 50.8503,
  "longitude": 4.3517,
  "place_name": "Grand Place"
}
```

---

### 2. Создать/обновить адрес (author only)
```http
POST /api/v1/activities/{slug}/address_update/
PATCH /api/v1/activities/{slug}/address_update/
```

**Body:**
```json
{
  "street": "Rue de la Loi 123",
  "city": "Brussels",
  "postal_code": "1000",
  "country": "Belgium",
  "latitude": 50.8503,
  "longitude": 4.3517,
  "place_name": "Grand Place"
}
```

**Пример:**
```javascript
activitiesAPI.updateAddress('concert-slug', {
    street: 'New Street 45',
    city: 'Brussels',
    postal_code: '1000',
    country: 'Belgium'
});
```

---

### 3. Удалить адрес (author only)
```http
DELETE /api/v1/activities/{slug}/address_delete/
```

---

## 💬 COMMENTS (через activity)

### 1. Получить комментарии активности
```http
GET /api/v1/activities/{slug}/comments/
```

**Описание:** Возвращает только активные комментарии

**Ответ:**
```json
[
  {
    "id": 1,
    "author": {
      "id": 1,
      "username": "user"
    },
    "activity": 1,
    "text": "Great event!",
    "created_at": "2024-12-09T10:00:00Z",
    "updated_at": "2024-12-09T10:00:00Z",
    "is_active": true
  }
]
```

---

### 2. Добавить комментарий (auth required)
```http
POST /api/v1/activities/{slug}/add_comment/
```

**Body:**
```json
{
  "text": "My comment text"
}
```

**Ограничения:**
- Можно комментировать только published активности
- Требуется авторизация

**Пример:**
```javascript
activitiesAPI.addComment('concert-slug', {
    text: 'Great event!'
});
```

---

## 💬 COMMENTS (Nested Routes)

### 1. Список комментариев
```http
GET /api/v1/activities/{activity_slug}/comments/
```

---

### 2. Получить конкретный комментарий
```http
GET /api/v1/activities/{activity_slug}/comments/{id}/
```

---

### 3. Создать комментарий (auth required)
```http
POST /api/v1/activities/{activity_slug}/comments/
```

**Body:**
```json
{
  "text": "Comment text"
}
```

---

### 4. Обновить комментарий (author only)
```http
PATCH /api/v1/activities/{activity_slug}/comments/{id}/
```

**Body:**
```json
{
  "text": "Updated text"
}
```

---

### 5. Удалить комментарий (author only)
```http
DELETE /api/v1/activities/{activity_slug}/comments/{id}/
```

**Особенность:** Soft delete - комментарий помечается как `is_active = False`

---

## 🔐 AUTHENTICATION

### 1. Регистрация
```http
POST /api/v1/auth/register/
```

**Body:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword123",
  "password2": "securepassword123"
}
```

---

### 2. Логин (получение токенов)
```http
POST /api/v1/auth/login/
или
POST /api/v1/auth/token/
```

**Body:**
```json
{
  "username": "user",
  "password": "password"
}
```

**Ответ:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJh...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJh..."
}
```

---

### 3. Обновить access токен
```http
POST /api/v1/auth/token/refresh/
```

**Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJh..."
}
```

**Ответ:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJh..."
}
```

---

### 4. Логаут
```http
POST /api/v1/auth/logout/
```

---

### 5. Получить текущего пользователя
```http
GET /api/v1/auth/me/
или
GET /api/v1/auth/user/
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Ответ:**
```json
{
  "id": 1,
  "username": "user",
  "email": "user@example.com",
  "is_staff": false,
  "is_superuser": false,
  "date_joined": "2024-01-01T00:00:00Z"
}
```

---

## 🔑 Заголовки авторизации

Для защищенных endpoints добавляйте заголовок:

```javascript
headers: {
  'Authorization': 'Bearer <access_token>'
}
```

Это делается автоматически в `apiClient` interceptor.

---

## 📊 Pagination

Если бэкенд использует пагинацию, ответ будет иметь структуру:

```json
{
  "count": 100,
  "next": "http://api.../activities/?page=2",
  "previous": null,
  "results": [...]
}
```

Для получения следующей страницы:
```javascript
activitiesAPI.getAll({ page: 2 });
```

---

## ⚠️ Коды ошибок

| Код | Описание |
|-----|----------|
| 200 | OK |
| 201 | Created |
| 204 | No Content (успешное удаление) |
| 400 | Bad Request (ошибка валидации) |
| 401 | Unauthorized (не авторизован) |
| 403 | Forbidden (нет прав) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 🎯 Быстрый старт

```javascript
// 1. Импортируем API
import { activitiesAPI, authAPI } from '@/services/api';

// 2. Получаем данные
const activities = await activitiesAPI.getAll({ filter: 'upcoming' });

// 3. Авторизуемся
const response = await authAPI.login({ 
    username: 'user', 
    password: 'pass' 
});

// 4. Создаем активность
const newActivity = await activitiesAPI.create({
    name: 'New Event',
    date: '2024-12-25',
    // ...
});
```