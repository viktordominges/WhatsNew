# Преимущества использования Slug для категорий

## Что изменилось

### Структура категории
```javascript
{
  id: 1,                    // Числовой ID для БД
  slug: 'concerts',         // URL-friendly идентификатор
  name: 'Concerts',         // Отображаемое название
  icon: 'concert'           // Имя иконки
}
```

## Преимущества slug

### 1. **SEO-дружественные URL**
```
❌ Плохо: /category/1
✅ Хорошо: /category/concerts
✅ Отлично: /concerts
```

### 2. **Читаемость**
Пользователи видят понятные URL:
- `/category/festivals` - сразу понятно, что это фестивали
- `/category/theatre` - страница театра

### 3. **Меньше зависимость от ID**
- ID могут меняться при миграции БД
- Slug стабилен и не меняется
- Slug можно использовать как в URL, так и в данных JSON

### 4. **Гибкость структуры данных**
```javascript
// В activities.json
{
  "id": 1,
  "name": "Concert de Jazz",
  "category_slug": "concerts",  // Связь через slug
  "date": "2024-12-20"
}

// В categories
{
  "id": 1,
  "slug": "concerts",
  "name": "Concerts"
}
```

### 5. **Легкость локализации**
```javascript
// Slug остается неизменным
{
  slug: 'concerts',
  name: {
    fr: 'Concerts',
    en: 'Concerts',
    nl: 'Concerten'
  }
}
```

## Два варианта использования

### Вариант 1: Без роутинга (текущий)
**Когда использовать:** Простое приложение, фильтры на одной странице

```vue
<CategoriesList 
  variant="menu" 
  :showIcons="true" 
  :useRouting="false"  <!-- Без роутинга -->
/>
```

**Поведение:** Клик по категории обновляет store, фильтрует на месте

### Вариант 2: С роутингом
**Когда использовать:** 
- Нужны отдельные страницы для категорий
- Важно SEO
- Нужна история браузера (кнопка назад)
- Хотите делиться ссылками на категории

```vue
<CategoriesList 
  variant="menu" 
  :showIcons="true" 
  :useRouting="true"  <!-- С роутингом -->
/>
```

**Поведение:** Клик переводит на `/category/concerts`

## Структура файлов

```
frontend/src/
├── config/
│   └── categoriesConfig.js    # Единый источник категорий
├── stores/
│   ├── eventsFilterStore.js   # categorySlug вместо category
│   └── headerStore.js          # Работа со slug
├── components/
│   ├── CategoriesList.vue     # Универсальный компонент
│   └── activities/
│       └── ActivitiesList.vue # Фильтрация по slug
└── data/
    └── activities.json         # category_slug в данных
```

## Примеры использования

### Фильтрация активностей
```javascript
// Фильтр по slug
if (filterStore.categorySlug) {
    result = result.filter(a => 
        a.category_slug === filterStore.categorySlug
    );
}
```

### Получение категории
```javascript
import { getCategoryBySlug, getCategoryName } from '@/config/categoriesConfig';

// По slug
const category = getCategoryBySlug('concerts');
// { id: 1, slug: 'concerts', name: 'Concerts', icon: 'concert' }

// Только название
const name = getCategoryName('concerts');
// 'Concerts'
```

### Работа с URL
```javascript
// Установить категорию из URL
const slug = route.params.slug;
filterStore.setCategoryBySlug(slug);

// Перейти на категорию
router.push(`/category/${category.slug}`);
```

## Миграция с ID на Slug

Если у вас уже есть данные с `category_id`:

```javascript
// Маппинг старых ID на slug
const ID_TO_SLUG = {
  1: 'concerts',
  2: 'festivals',
  3: 'enfants',
  // ...
};

// При загрузке данных
activities.map(a => ({
  ...a,
  category_slug: ID_TO_SLUG[a.category_id]
}));
```

## Рекомендации

1. **Используйте slug везде** - в URL, фильтрах, данных
2. **ID храните для БД** - связи в базе данных
3. **Slug никогда не меняйте** - это постоянный идентификатор
4. **Slug в lowercase** - всегда маленькие буквы, без пробелов
5. **Используйте дефисы** - `art-moderne`, `theatre-national`

## Заключение

Использование slug:
- ✅ Улучшает SEO
- ✅ Делает URL читаемыми
- ✅ Упрощает отладку
- ✅ Стабилизирует идентификаторы
- ✅ Облегчает локализацию

**Рекомендация:** Всегда используйте slug для публичных идентификаторов!