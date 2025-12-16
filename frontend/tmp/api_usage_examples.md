Что создано:
1. api.js - Основной API сервис

Настроенный axios с interceptors
Автоматическое добавление токенов
Автоматическое обновление токенов при 401
Все endpoints разбиты по категориям:

categoriesAPI
organizersAPI
activitiesAPI
commentsAPI
authAPI



2. Composables - Переиспользуемые композиции Vue

useActivities() - работа с активностями
useComments() - работа с комментариями
useCategories() - работа с категориями
useAuth() - аутентификация
useSearch() - поиск и фильтрация

3. Pinia Stores - Глобальное состояние

activitiesStore - управление активностями
categoriesStore - управление категориями
authStore - управление авторизацией
commentsStore - управление комментариями

4. Документация

Примеры использования для всех случаев
Полная справка по всем endpoints
Описание параметров запросов

🚀 Как использовать:

Вариант 1: Прямое использование API
javascriptimport { activitiesAPI } from '@/services/api';

const activities = await activitiesAPI.getAll({ filter: 'upcoming' });
Вариант 2: Через Composables
javascriptimport { useActivities } from '@/composables/useActivities';

const { activities, loading, fetchActivities } = useActivities();
await fetchActivities({ filter: 'upcoming' });
Вариант 3: Через Pinia Store
javascriptimport { useActivitiesStore } from '@/stores/activitiesStore';

const store = useActivitiesStore();
await store.fetchActivities({ filter: 'upcoming' });

⚙️ Что нужно сделать:

Создать .env файл:

envVITE_API_BASE_URL=http://localhost:8000/api/v1

Установить зависимости:

bashnpm install axios

Проверить URL auth endpoints - возможно у вас другие пути (/auth/login/ vs /auth/token/)

Все готово к использованию! 🎉




# API Service - Примеры использования

## 📋 Полный список доступных endpoints

### 🏷️ **CATEGORIES**
```
GET    /api/v1/categories/                     - Все категории
GET    /api/v1/categories/{slug}/              - Категория по slug
GET    /api/v1/categories/{slug}/activities/   - Активности категории
POST   /api/v1/categories/                     - Создать (admin)
PATCH  /api/v1/categories/{slug}/              - Обновить (admin)
DELETE /api/v1/categories/{slug}/              - Удалить (admin)
```

### 🏢 **ORGANIZERS**
```
GET    /api/v1/organizers/                     - Все организаторы
GET    /api/v1/organizers/{slug}/              - Организатор по slug
GET    /api/v1/organizers/{slug}/activities/   - Активности организатора
POST   /api/v1/organizers/                     - Создать (auth)
PATCH  /api/v1/organizers/{slug}/              - Обновить (auth)
DELETE /api/v1/organizers/{slug}/              - Удалить (admin)
```

### 🎯 **ACTIVITIES**
```
GET    /api/v1/activities/                     - Все активности
GET    /api/v1/activities/{slug}/              - Активность по slug
POST   /api/v1/activities/                     - Создать (auth)
PATCH  /api/v1/activities/{slug}/              - Обновить (автор)
DELETE /api/v1/activities/{slug}/              - Удалить (автор)

# Адрес активности
GET    /api/v1/activities/{slug}/address/             - Получить адрес
POST   /api/v1/activities/{slug}/address_update/      - Создать/обновить (автор)
DELETE /api/v1/activities/{slug}/address_delete/      - Удалить (автор)

# Комментарии через activity
GET    /api/v1/activities/{slug}/comments/            - Все комментарии
POST   /api/v1/activities/{slug}/add_comment/         - Добавить (auth)
```

### 💬 **COMMENTS (Nested Routes)**
```
GET    /api/v1/activities/{slug}/comments/            - Все комментарии
GET    /api/v1/activities/{slug}/comments/{id}/       - Конкретный комментарий
POST   /api/v1/activities/{slug}/comments/            - Создать (auth)
PATCH  /api/v1/activities/{slug}/comments/{id}/       - Обновить (автор)
DELETE /api/v1/activities/{slug}/comments/{id}/       - Удалить (автор)
```

### 🔐 **AUTH**
```
POST   /api/v1/auth/register/              - Регистрация
POST   /api/v1/auth/login/                 - Логин
POST   /api/v1/auth/token/refresh/         - Обновить токен
POST   /api/v1/auth/logout/                - Логаут
GET    /api/v1/auth/me/                    - Текущий пользователь
```

---

## 🚀 Примеры использования в компонентах Vue

### 1. Получение всех активностей (главная страница)

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { activitiesAPI } from '@/services/api';

const activities = ref([]);
const loading = ref(false);
const error = ref(null);

const fetchActivities = async () => {
    loading.value = true;
    error.value = null;
    
    try {
        const response = await activitiesAPI.getAll({
            filter: 'upcoming',      // только будущие
            ordering: '-date',       // сортировка по дате (новые сначала)
            status: 'published'      // только опубликованные
        });
        
        activities.value = response.data.results || response.data;
    } catch (err) {
        error.value = err.message;
        console.error('Error fetching activities:', err);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchActivities();
});
</script>

<template>
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error">Ошибка: {{ error }}</div>
    <div v-else>
        <ActivityCard 
            v-for="activity in activities" 
            :key="activity.id"
            :activity="activity"
        />
    </div>
</template>
```

### 2. Фильтрация активностей по категории

```vue
<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { activitiesAPI } from '@/services/api';
import { getCategoryBySlug } from '@/config/categoriesConfig';

const route = useRoute();
const activities = ref([]);

const fetchActivitiesByCategory = async (categorySlug) => {
    if (!categorySlug) return;
    
    try {
        // Получаем ID категории по slug
        const category = getCategoryBySlug(categorySlug);
        
        if (category) {
            const response = await activitiesAPI.getAll({
                category: category.id,  // фильтр по ID категории
                filter: 'upcoming'
            });
            
            activities.value = response.data.results || response.data;
        }
    } catch (err) {
        console.error('Error:', err);
    }
};

// Следим за изменением slug в URL
watch(() => route.params.slug, (newSlug) => {
    fetchActivitiesByCategory(newSlug);
}, { immediate: true });
</script>
```

### 3. Получение деталей активности

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { activitiesAPI } from '@/services/api';

const route = useRoute();
const activity = ref(null);
const address = ref(null);
const comments = ref([]);

const fetchActivityDetails = async () => {
    const slug = route.params.slug;
    
    try {
        // Получаем активность (счетчик просмотров увеличится)
        const activityResponse = await activitiesAPI.getBySlug(slug);
        activity.value = activityResponse.data;
        
        // Получаем адрес
        try {
            const addressResponse = await activitiesAPI.getAddress(slug);
            address.value = addressResponse.data;
        } catch (err) {
            // Адрес может отсутствовать
            console.log('No address found');
        }
        
        // Получаем комментарии
        const commentsResponse = await activitiesAPI.getComments(slug);
        comments.value = commentsResponse.data;
        
    } catch (err) {
        console.error('Error fetching activity:', err);
    }
};

onMounted(() => {
    fetchActivityDetails();
});
</script>
```

### 4. Поиск и фильтрация

```vue
<script setup>
import { ref, watch } from 'vue';
import { activitiesAPI } from '@/services/api';
import { useDebounceFn } from '@vueuse/core'; // опционально

const searchQuery = ref('');
const filters = ref({
    dateFrom: null,
    dateTo: null,
    price: null,  // 'free' | 'paid' | null
    category: null
});
const activities = ref([]);

const fetchFilteredActivities = async () => {
    try {
        const params = {
            search: searchQuery.value,
            date_from: filters.value.dateFrom,
            date_to: filters.value.dateTo,
            price: filters.value.price,
            category: filters.value.category,
            filter: 'upcoming',
            ordering: '-date'
        };
        
        // Удаляем пустые параметры
        Object.keys(params).forEach(key => {
            if (params[key] === null || params[key] === '') {
                delete params[key];
            }
        });
        
        const response = await activitiesAPI.getAll(params);
        activities.value = response.data.results || response.data;
    } catch (err) {
        console.error('Error:', err);
    }
};

// Debounce для поиска (опционально)
const debouncedSearch = useDebounceFn(fetchFilteredActivities, 500);

watch(searchQuery, () => {
    debouncedSearch();
});

watch(filters, () => {
    fetchFilteredActivities();
}, { deep: true });
</script>
```

### 5. Авторизация и логин

```vue
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authAPI, saveTokens } from '@/services/api';

const router = useRouter();
const credentials = ref({
    username: '',
    password: ''
});
const error = ref(null);
const loading = ref(false);

const login = async () => {
    loading.value = true;
    error.value = null;
    
    try {
        const response = await authAPI.login(credentials.value);
        
        // Сохраняем токены
        saveTokens(response.data.access, response.data.refresh);
        
        // Получаем информацию о пользователе (опционально)
        const userResponse = await authAPI.getCurrentUser();
        
        // Сохраняем пользователя в store
        // userStore.setUser(userResponse.data);
        
        // Редирект на главную
        router.push('/');
    } catch (err) {
        error.value = err.response?.data?.detail || 'Ошибка входа';
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <form @submit.prevent="login">
        <input v-model="credentials.username" placeholder="Username" />
        <input v-model="credentials.password" type="password" placeholder="Password" />
        <button type="submit" :disabled="loading">Войти</button>
        <p v-if="error" class="error">{{ error }}</p>
    </form>
</template>
```

### 6. Создание активности (с изображением)

```vue
<script setup>
import { ref } from 'vue';
import { activitiesAPI } from '@/services/api';

const form = ref({
    name: '',
    slug: '',
    summary: '',
    description: '',
    date: '',
    time: '',
    category: null,
    organizer: null,
    price: null,
    image: null,
    status: 'draft'
});

const imageFile = ref(null);

const handleImageUpload = (event) => {
    imageFile.value = event.target.files[0];
};

const createActivity = async () => {
    try {
        // Создаем FormData для отправки файла
        const formData = new FormData();
        
        // Добавляем все поля
        Object.keys(form.value).forEach(key => {
            if (form.value[key] !== null) {
                formData.append(key, form.value[key]);
            }
        });
        
        // Добавляем изображение
        if (imageFile.value) {
            formData.append('image', imageFile.value);
        }
        
        const response = await activitiesAPI.create(formData);
        
        console.log('Activity created:', response.data);
        // Редирект на страницу активности
    } catch (err) {
        console.error('Error creating activity:', err);
    }
};
</script>
```

### 7. Добавление комментария

```vue
<script setup>
import { ref } from 'vue';
import { activitiesAPI } from '@/services/api';

const props = defineProps({
    activitySlug: String
});

const commentText = ref('');
const comments = ref([]);

const addComment = async () => {
    if (!commentText.value.trim()) return;
    
    try {
        const response = await activitiesAPI.addComment(
            props.activitySlug,
            { text: commentText.value }
        );
        
        // Добавляем новый комментарий в список
        comments.value.push(response.data);
        
        // Очищаем форму
        commentText.value = '';
    } catch (err) {
        if (err.response?.status === 401) {
            alert('Необходимо авторизоваться');
        } else {
            alert('Ошибка добавления комментария');
        }
    }
};
</script>

<template>
    <div class="comments">
        <h3>Комментарии</h3>
        
        <div v-for="comment in comments" :key="comment.id">
            {{ comment.text }}
        </div>
        
        <form @submit.prevent="addComment">
            <textarea v-model="commentText" placeholder="Ваш комментарий" />
            <button type="submit">Отправить</button>
        </form>
    </div>
</template>
```

### 8. Работа с адресом активности

```vue
<script setup>
import { ref } from 'vue';
import { activitiesAPI } from '@/services/api';

const props = defineProps({
    activitySlug: String
});

const address = ref({
    street: '',
    city: '',
    postal_code: '',
    country: 'Belgium',
    latitude: null,
    longitude: null,
    place_name: ''
});

const saveAddress = async () => {
    try {
        const response = await activitiesAPI.updateAddress(
            props.activitySlug,
            address.value
        );
        
        console.log('Address saved:', response.data);
    } catch (err) {
        console.error('Error saving address:', err);
    }
};

const deleteAddress = async () => {
    if (!confirm('Удалить адрес?')) return;
    
    try {
        await activitiesAPI.deleteAddress(props.activitySlug);
        
        // Очищаем форму
        address.value = {
            street: '',
            city: '',
            postal_code: '',
            country: 'Belgium',
            latitude: null,
            longitude: null,
            place_name: ''
        };
    } catch (err) {
        console.error('Error deleting address:', err);
    }
};
</script>
```

---

## 🔧 Настройка переменных окружения

Создайте файл `.env` в корне frontend:

```env
# Development
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Production
# VITE_API_BASE_URL=https://your-api.com/api/v1
```

---

## 📦 Использование в Pinia Store

```javascript
// stores/activitiesStore.js
import { defineStore } from 'pinia';
import { activitiesAPI } from '@/services/api';

export const useActivitiesStore = defineStore('activities', {
    state: () => ({
        activities: [],
        currentActivity: null,
        loading: false,
        error: null
    }),

    actions: {
        async fetchActivities(params = {}) {
            this.loading = true;
            this.error = null;
            
            try {
                const response = await activitiesAPI.getAll(params);
                this.activities = response.data.results || response.data;
            } catch (err) {
                this.error = err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async fetchActivity(slug) {
            this.loading = true;
            
            try {
                const response = await activitiesAPI.getBySlug(slug);
                this.currentActivity = response.data;
            } catch (err) {
                this.error = err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        }
    }
});
```

---

## ⚠️ Обработка ошибок

```javascript
try {
    const response = await activitiesAPI.getAll();
} catch (error) {
    // error.response - объект ответа от сервера
    if (error.response) {
        // Сервер вернул ошибку
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
        
        if (error.response.status === 404) {
            // Не найдено
        } else if (error.response.status === 401) {
            // Не авторизован
        } else if (error.response.status === 403) {
            // Нет прав доступа
        }
    } else if (error.request) {
        // Запрос был отправлен, но ответа нет
        console.log('No response received');
    } else {
        // Ошибка при настройке запроса
        console.log('Error:', error.message);
    }
}
```