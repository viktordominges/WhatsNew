# ContactForm - Документация и примеры

## 📋 Особенности компонента

### ✨ Функционал
- ✅ Валидация всех полей в реальном времени
- ✅ **Максимум 1000 символов** для текста сообщения
- ✅ Прогресс-бар заполнения текста с цветовой индикацией
- ✅ Счетчик символов с отображением остатка
- ✅ Предупреждение о превышении лимита
- ✅ Проверка email формата
- ✅ Отображение ошибок от сервера
- ✅ Сообщение об успешной отправке
- ✅ Автоочистка формы после успеха
- ✅ Спиннер загрузки
- ✅ Блокировка кнопки до валидной формы
- ✅ Адаптивный дизайн

---

## 🚀 Базовое использование

```vue
<script setup>
import ContactForm from '@/components/ContactForm.vue';

const handleSuccess = (data) => {
    console.log('Сообщение отправлено:', data);
};

const handleError = (error) => {
    console.error('Ошибка отправки:', error);
};
</script>

<template>
    <ContactForm 
        @success="handleSuccess"
        @error="handleError"
    />
</template>
```

---

## ⚙️ Props

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `apiEndpoint` | String | `/api/v1/contact/` | URL для отправки формы |

### Пример с кастомным endpoint:

```vue
<ContactForm api-endpoint="https://myapi.com/api/contact/" />
```

---

## 📤 Events

### `@success`
Вызывается при успешной отправке формы.

**Payload:**
```javascript
{
    message: "Message sent successfully",
    id: 123
}
```

### `@error`
Вызывается при ошибке отправки.

**Payload:**
```javascript
{
    username: ["This field is required"],
    email: ["Enter a valid email"],
    // или
    detail: "Something went wrong"
}
```

---

## 🔧 Exposed методы

Компонент экспортирует методы через `defineExpose`:

```vue
<script setup>
import { ref } from 'vue';
import ContactForm from '@/components/ContactForm.vue';

const formRef = ref(null);

// Сброс формы извне
const resetFormExternal = () => {
    formRef.value?.resetForm();
};

// Отправка формы извне
const submitFormExternal = () => {
    formRef.value?.submitForm();
};
</script>

<template>
    <ContactForm ref="formRef" />
    <button @click="resetFormExternal">Очистить</button>
</template>
```

---

## 🎨 Кастомизация стилей

### Использование CSS переменных

```vue
<style>
.contact-form {
    --primary-color: #667eea;
    --error-color: #c33;
    --success-color: #27ae60;
}
</style>
```

### Переопределение классов

```vue
<style>
/* Изменить цвет кнопки */
.contact-form .btn-primary {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

/* Изменить стиль инпутов */
.contact-form .form-input {
    border-radius: 20px;
}
</style>
```

---

## 🔌 Backend API интеграция

### Django REST Framework

```python
# views.py
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.mail import send_mail

@api_view(['POST'])
def contact_view(request):
    """
    Обработка контактной формы
    """
    username = request.data.get('username')
    email = request.data.get('email')
    topic = request.data.get('topic')
    text = request.data.get('text')
    
    # Валидация
    errors = {}
    
    if not username or len(username) < 2:
        errors['username'] = ['Имя должно содержать минимум 2 символа']
    
    if not email or '@' not in email:
        errors['email'] = ['Введите корректный email']
    
    if not topic or len(topic) < 5:
        errors['topic'] = ['Тема должна содержать минимум 5 символов']
    
    if not text:
        errors['text'] = ['Сообщение обязательно для заполнения']
    elif len(text) > 1000:
        errors['text'] = ['Сообщение не должно превышать 1000 символов']
    
    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Отправка email
    try:
        send_mail(
            subject=f'Контактная форма: {topic}',
            message=f'От: {username} ({email})\n\n{text}',
            from_email='noreply@yoursite.com',
            recipient_list=['admin@yoursite.com'],
            fail_silently=False,
        )
        
        return Response({
            'message': 'Сообщение успешно отправлено',
            'id': 123  # ID созданного сообщения в БД
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'detail': 'Ошибка отправки письма'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# urls.py
from django.urls import path
from .views import contact_view

urlpatterns = [
    path('api/v1/contact/', contact_view, name='contact'),
]
```

### Serializer (опционально)

```python
# serializers.py
from rest_framework import serializers

class ContactSerializer(serializers.Serializer):
    username = serializers.CharField(min_length=2, max_length=100)
    email = serializers.EmailField()
    topic = serializers.CharField(min_length=5, max_length=200)
    text = serializers.CharField(max_length=1000)  # Максимум 1000 символов
    
    def validate_text(self, value):
        if len(value) > 1000:
            raise serializers.ValidationError(
                'Текст сообщения не может превышать 1000 символов'
            )
        return value
    
    def create(self, validated_data):
        # Отправка email или сохранение в БД
        from django.core.mail import send_mail
        
        send_mail(
            subject=f"Contact Form: {validated_data['topic']}",
            message=validated_data['text'],
            from_email='noreply@site.com',
            recipient_list=['admin@site.com'],
        )
        
        return validated_data

# views.py (с serializer)
from rest_framework import generics

class ContactCreateView(generics.CreateAPIView):
    serializer_class = ContactSerializer
```

---

## 🌐 API Service

Создайте отдельный API сервис:

```javascript
// src/services/contactAPI.js
import apiClient from './api';

export const contactAPI = {
    /**
     * Отправить сообщение
     * POST /api/v1/contact/
     */
    sendMessage(data) {
        return apiClient.post('/contact/', data);
    }
};
```

Используйте в компоненте:

```vue
<script setup>
import { contactAPI } from '@/services/contactAPI';

async function submitForm() {
    try {
        const response = await contactAPI.sendMessage(form);
        success.value = true;
    } catch (error) {
        // обработка ошибки
    }
}
</script>
```

---

## 📧 Email шаблоны

### HTML email шаблон (Django)

```html
<!-- templates/emails/contact_message.html -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #667eea; color: white; padding: 20px; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { padding: 20px; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Новое сообщение с сайта</h1>
        </div>
        <div class="content">
            <p><strong>От:</strong> {{ username }}</p>
            <p><strong>Email:</strong> {{ email }}</p>
            <p><strong>Тема:</strong> {{ topic }}</p>
            <hr>
            <p>{{ text }}</p>
        </div>
        <div class="footer">
            <p>Это автоматическое сообщение с контактной формы</p>
        </div>
    </div>
</body>
</html>
```

### Отправка HTML email

```python
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

def send_contact_email(username, email, topic, text):
    subject = f'Контактная форма: {topic}'
    
    # Plain text версия
    text_content = f'От: {username} ({email})\n\n{text}'
    
    # HTML версия
    html_content = render_to_string('emails/contact_message.html', {
        'username': username,
        'email': email,
        'topic': topic,
        'text': text
    })
    
    msg = EmailMultiAlternatives(
        subject,
        text_content,
        'noreply@yoursite.com',
        ['admin@yoursite.com']
    )
    msg.attach_alternative(html_content, "text/html")
    msg.send()
```

---

## 🧪 Тестирование

### Unit тест (Vitest)

```javascript
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ContactForm from '@/components/ContactForm.vue';

describe('ContactForm', () => {
    it('validates email format', async () => {
        const wrapper = mount(ContactForm);
        
        await wrapper.find('#email').setValue('invalid-email');
        await wrapper.find('#email').trigger('blur');
        
        expect(wrapper.text()).toContain('Введите корректный email');
    });
    
    it('requires maximum 1000 characters in text', async () => {
        const wrapper = mount(ContactForm);
        
        await wrapper.find('#text').setValue('a'.repeat(1001));
        await wrapper.find('#text').trigger('blur');
        
        expect(wrapper.text()).toContain('Превышен лимит');
    });
    
    it('emits success event on successful submit', async () => {
        const wrapper = mount(ContactForm);
        
        // Заполняем форму
        await wrapper.find('#username').setValue('John Doe');
        await wrapper.find('#email').setValue('john@example.com');
        await wrapper.find('#topic').setValue('Test Subject');
        await wrapper.find('#text').setValue('Valid message text');  // До 1000 символов
        
        // Mock fetch
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: 'Success' })
            })
        );
        
        await wrapper.find('form').trigger('submit');
        
        expect(wrapper.emitted('success')).toBeTruthy();
    });
});
```

---

## 💡 Полезные доработки

### 1. Добавить Captcha

```vue
<script setup>
import { VueRecaptcha } from 'vue-recaptcha';

const recaptchaToken = ref('');

const onCaptchaVerify = (token) => {
    recaptchaToken.value = token;
};
</script>

<template>
    <VueRecaptcha
        :sitekey="RECAPTCHA_SITE_KEY"
        @verify="onCaptchaVerify"
    />
</template>
```

### 2. Добавить прикрепление файлов

```vue
<script setup>
const attachments = ref([]);

const handleFileUpload = (event) => {
    attachments.value = Array.from(event.target.files);
};
</script>

<template>
    <input 
        type="file" 
        multiple 
        @change="handleFileUpload"
        accept=".pdf,.doc,.docx,.jpg,.png"
    />
</template>
```

### 3. Сохранение в localStorage (черновик)

```vue
<script setup>
import { watch } from 'vue';

// Автосохранение черновика
watch(form, (newForm) => {
    localStorage.setItem('contactFormDraft', JSON.stringify(newForm));
}, { deep: true });

// Восстановление черновика
onMounted(() => {
    const draft = localStorage.getItem('contactFormDraft');
    if (draft) {
        Object.assign(form, JSON.parse(draft));
    }
});
</script>
```

---

## 🎯 Готовый пример интеграции

```vue
<!-- ContactPage.vue -->
<script setup>
import ContactForm from '@/components/ContactForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleSuccess = () => {
    // Редирект на страницу благодарности
    setTimeout(() => {
        router.push('/thank-you');
    }, 2000);
};

const handleError = (error) => {
    console.error('Contact form error:', error);
};
</script>

<template>
    <div class="contact-page">
        <div class="container">
            <ContactForm 
                api-endpoint="/api/v1/contact/"
                @success="handleSuccess"
                @error="handleError"
            />
        </div>
    </div>
</template>

<style scoped>
.contact-page {
    min-height: 100vh;
    padding: 60px 0;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
</style>
```

---

## 📱 Мобильная версия

Компонент полностью адаптивен и отлично работает на мобильных устройствах:

- Изменение layout кнопок на вертикальный
- Уменьшение padding для экономии места
- Адаптация размеров шрифтов
- Touch-friendly элементы управления