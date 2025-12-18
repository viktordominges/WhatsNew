# OrganizerForm - Документация

## 📋 Особенности компонента

### ✨ Функционал
- ✅ Два режима: создание и редактирование
- ✅ Валидация всех полей в реальном времени
- ✅ Валидация email формата
- ✅ Валидация международных номеров телефонов
- ✅ Валидация URL (http/https)
- ✅ Website - необязательное поле
- ✅ Счетчики символов для длинных полей
- ✅ Подсказки для пользователя
- ✅ Отображение ошибок от сервера
- ✅ Сообщение об успехе
- ✅ Автоочистка формы после создания
- ✅ Спиннер загрузки
- ✅ Адаптивный дизайн
- ✅ Поддержка тёмной темы

---

## 🚀 Базовое использование

### Создание нового организатора

```vue
<script setup>
import OrganizerForm from '@/components/OrganizerForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleSuccess = (data) => {
    console.log('Организатор создан:', data);
    // Редирект на страницу организатора
    router.push(`/organizers/${data.slug}`);
};

const handleError = (error) => {
    console.error('Ошибка:', error);
};
</script>

<template>
    <OrganizerForm 
        @success="handleSuccess"
        @error="handleError"
    />
</template>
```

### Редактирование организатора

```vue
<script setup>
import { ref, onMounted } from 'vue';
import OrganizerForm from '@/components/OrganizerForm.vue';
import { organizersAPI } from '@/services/api';
import { useRoute } from 'vue-router';

const route = useRoute();
const organizer = ref(null);

onMounted(async () => {
    // Получаем данные организатора
    const response = await organizersAPI.getBySlug(route.params.slug);
    organizer.value = response.data;
});

const handleSuccess = (data) => {
    console.log('Организатор обновлен:', data);
};
</script>

<template>
    <OrganizerForm 
        v-if="organizer"
        :edit-mode="true"
        :organizer-data="organizer"
        @success="handleSuccess"
    />
</template>
```

---

## ⚙️ Props

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `editMode` | Boolean | `false` | Режим редактирования (true) или создания (false) |
| `organizerData` | Object | `null` | Данные организатора для редактирования |

### Структура organizerData:

```javascript
{
    slug: 'organization-slug',
    name: 'Organization Name',
    email: 'contact@organization.com',
    phone: '+32 123 456 789',
    website: 'https://organization.com'
}
```

---

## 📤 Events

### `@success`
Вызывается при успешной отправке формы.

**Payload (create):**
```javascript
{
    id: 1,
    slug: 'new-organizer',
    name: 'New Organizer',
    email: 'contact@new.com',
    phone: '+32123456789',
    website: 'https://new.com',
    created_at: '2024-12-16T10:00:00Z'
}
```

**Payload (update):**
```javascript
{
    // обновленные данные организатора
}
```

### `@error`
Вызывается при ошибке отправки.

**Payload:**
```javascript
{
    response: {
        data: {
            name: ['Organization with this name already exists'],
            email: ['Enter a valid email'],
            // ...
        }
    }
}
```

### `@cancel`
Вызывается при нажатии кнопки "Отмена" (только в режиме редактирования).

---

## 🔧 Exposed методы

```vue
<script setup>
import { ref } from 'vue';
import OrganizerForm from '@/components/OrganizerForm.vue';

const formRef = ref(null);

// Сброс формы извне
const reset = () => {
    formRef.value?.resetForm();
};

// Отправка формы извне
const submit = () => {
    formRef.value?.submitForm();
};
</script>

<template>
    <OrganizerForm ref="formRef" />
    <button @click="reset">Сброс</button>
    <button @click="submit">Отправить</button>
</template>
```

---

## 🎨 Валидация полей

### Name (Название)
- **Обязательное поле**
- Минимум: 2 символа
- Максимум: 200 символов
- Должно быть уникальным (проверяется на сервере)

### Email
- **Обязательное поле**
- Проверка формата: `example@domain.com`
- Стандартная валидация email

### Phone (Телефон)
- **Обязательное поле**
- Разрешены: цифры, пробелы, дефисы, +, скобки
- Минимум: 7 цифр (после очистки от форматирования)
- Максимум: 20 символов
- Примеры валидных номеров:
  - `+32 123 456 789`
  - `+1 (555) 123-4567`
  - `0123456789`

### Website (Веб-сайт)
- **Необязательное поле**
- Должен начинаться с `http://` или `https://`
- Максимум: 200 символов
- Примеры:
  - `https://example.com`
  - `http://www.organization.be`

---

## 🔌 Backend интеграция

### Django Model

```python
# models.py
from django.db import models
from django.utils.text import slugify

class Organizer(models.Model):
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    
    # Contact info
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    website = models.URLField(max_length=200, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
```

### Django Serializer

```python
# serializers.py
from rest_framework import serializers
from .models import Organizer

class OrganizerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organizer
        fields = ['id', 'slug', 'name', 'email', 'phone', 'website', 
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
    
    def validate_name(self, value):
        # Проверка уникальности при обновлении
        if self.instance:
            if Organizer.objects.exclude(pk=self.instance.pk).filter(name=value).exists():
                raise serializers.ValidationError(
                    'Организатор с таким названием уже существует'
                )
        return value
    
    def validate_phone(self, value):
        # Дополнительная валидация телефона
        import re
        clean_phone = re.sub(r'[\s\-\(\)]', '', value)
        if len(clean_phone) < 7:
            raise serializers.ValidationError(
                'Номер телефона должен содержать минимум 7 цифр'
            )
        return value
    
    def validate_website(self, value):
        if value and not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError(
                'URL должен начинаться с http:// или https://'
            )
        return value
```

### Django ViewSet (уже есть в вашем проекте)

```python
# views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Organizer
from .serializers import OrganizerSerializer

class OrganizerViewSet(viewsets.ModelViewSet):
    queryset = Organizer.objects.all()
    serializer_class = OrganizerSerializer
    lookup_field = 'slug'
    permission_classes = [IsAuthenticatedOrReadOnly]
```

---

## 💡 Примеры использования

### 1. В модальном окне

```vue
<script setup>
import { ref } from 'vue';
import OrganizerForm from '@/components/OrganizerForm.vue';

const showModal = ref(false);

const handleSuccess = () => {
    showModal.value = false;
    // Обновить список организаторов
};
</script>

<template>
    <button @click="showModal = true">Добавить организатора</button>
    
    <div v-if="showModal" class="modal">
        <div class="modal-content">
            <OrganizerForm 
                @success="handleSuccess"
                @cancel="showModal = false"
            />
        </div>
    </div>
</template>
```

### 2. На отдельной странице

```vue
<!-- AddOrganizerPage.vue -->
<script setup>
import OrganizerForm from '@/components/OrganizerForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleSuccess = (data) => {
    router.push(`/organizers/${data.slug}`);
};

const handleCancel = () => {
    router.back();
};
</script>

<template>
    <div class="page">
        <div class="container">
            <OrganizerForm 
                @success="handleSuccess"
                @cancel="handleCancel"
            />
        </div>
    </div>
</template>

<style scoped>
.page {
    min-height: 100vh;
    padding: 60px 0;
    background-color: var(--color-light-background);
}
</style>
```

### 3. С Pinia Store

```vue
<script setup>
import { useOrganizersStore } from '@/stores/organizersStore';
import OrganizerForm from '@/components/OrganizerForm.vue';

const store = useOrganizersStore();

const handleSuccess = async (data) => {
    // Добавляем в store
    store.addOrganizer(data);
    
    // Показываем уведомление
    showNotification('Организатор успешно создан!');
};
</script>

<template>
    <OrganizerForm @success="handleSuccess" />
</template>
```

### 4. Редактирование с предзагрузкой

```vue
<!-- EditOrganizerPage.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import OrganizerForm from '@/components/OrganizerForm.vue';
import { organizersAPI } from '@/services/api';

const route = useRoute();
const router = useRouter();
const organizer = ref(null);
const loading = ref(true);

onMounted(async () => {
    try {
        const response = await organizersAPI.getBySlug(route.params.slug);
        organizer.value = response.data;
    } catch (error) {
        console.error('Error loading organizer:', error);
        router.push('/organizers');
    } finally {
        loading.value = false;
    }
});

const handleSuccess = (data) => {
    router.push(`/organizers/${data.slug}`);
};

const handleCancel = () => {
    router.push(`/organizers/${route.params.slug}`);
};
</script>

<template>
    <div class="page">
        <div v-if="loading">Загрузка...</div>
        <OrganizerForm 
            v-else-if="organizer"
            :edit-mode="true"
            :organizer-data="organizer"
            @success="handleSuccess"
            @cancel="handleCancel"
        />
    </div>
</template>
```

---

## 🧪 Тестирование

```javascript
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import OrganizerForm from '@/components/OrganizerForm.vue';

describe('OrganizerForm', () => {
    it('validates email format', async () => {
        const wrapper = mount(OrganizerForm);
        
        await wrapper.find('#email').setValue('invalid-email');
        await wrapper.find('#email').trigger('blur');
        
        expect(wrapper.text()).toContain('Введите корректный email');
    });
    
    it('validates phone format', async () => {
        const wrapper = mount(OrganizerForm);
        
        await wrapper.find('#phone').setValue('123');
        await wrapper.find('#phone').trigger('blur');
        
        expect(wrapper.text()).toContain('корректный номер телефона');
    });
    
    it('makes website optional', async () => {
        const wrapper = mount(OrganizerForm);
        
        // Заполняем обязательные поля
        await wrapper.find('#name').setValue('Test Org');
        await wrapper.find('#email').setValue('test@test.com');
        await wrapper.find('#phone').setValue('+32123456789');
        // website оставляем пустым
        
        expect(wrapper.vm.isFormValid).toBe(true);
    });
    
    it('emits success on successful submit', async () => {
        const wrapper = mount(OrganizerForm);
        
        // Mock API
        vi.mock('@/services/api', () => ({
            organizersAPI: {
                create: vi.fn(() => Promise.resolve({ 
                    data: { id: 1, name: 'Test' } 
                }))
            }
        }));
        
        // Заполняем форму
        await wrapper.find('#name').setValue('Test Org');
        await wrapper.find('#email').setValue('test@test.com');
        await wrapper.find('#phone').setValue('+32123456789');
        
        await wrapper.find('form').trigger('submit');
        
        expect(wrapper.emitted('success')).toBeTruthy();
    });
});
```

---

## 🎨 Кастомизация

### Переопределение стилей

```vue
<style>
/* Изменить цвет основной кнопки */
.organizer-form .primary-form-btn {
    background-color: var(--color-orange);
}

/* Изменить радиус границ */
.organizer-form .form {
    border-radius: 20px;
}

/* Изменить стиль инпутов */
.organizer-form .form-input {
    border-radius: 8px;
    padding: 16px;
}
</style>
```

---

## 📱 Адаптивность

Компонент полностью адаптивен:
- На мобильных устройствах уменьшаются отступы
- Кнопки занимают всю ширину
- Шрифты адаптируются под размер экрана

---

## 🌙 Тёмная тема

Компонент поддерживает тёмную тему через `prefers-color-scheme`:
- Автоматическое переключение цветов
- Использование CSS переменных из вашей палитры
- Сохранение читаемости в обоих режимах