# Activities API - Installation Guide

## 📋 Требования

- Python 3.9+
- PostgreSQL 13+ с расширением PostGIS
- pip (package manager)

## 🚀 Установка

### 1. Установить зависимости

```bash
pip install django djangorestframework
pip install django-filter
pip install psycopg2-binary  # или psycopg2
pip install Pillow  # для изображений
pip install unidecode  # для транслитерации
pip install drf-nested-routers  # опционально, для вложенных роутов
pip install django-cors-headers  # опционально, для CORS
```

Или создать `requirements.txt`:

```
Django>=4.2
djangorestframework>=3.14
django-filter>=23.0
psycopg2-binary>=2.9
Pillow>=10.0
unidecode>=1.3
drf-nested-routers>=0.93
django-cors-headers>=4.0
```

Установить:
```bash
pip install -r requirements.txt
```

### 2. Настроить PostgreSQL с PostGIS

```sql
-- Создать базу данных
CREATE DATABASE whatsnew_db;

-- Подключиться к базе
\c whatsnew_db

-- Установить расширение PostGIS
CREATE EXTENSION postgis;

-- Проверить установку
SELECT PostGIS_version();
```

### 3. Настроить settings.py

```python
# settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.gis',  # PostGIS
    
    # Third party
    'rest_framework',
    'django_filters',
    'corsheaders',
    
    # Your apps
    'apps.accounts',
    'apps.main',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # CORS
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'whatsnew_db',
        'USER': 'postgres',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Custom User Model
AUTH_USER_MODEL = 'accounts.User'

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# CORS (для фронтенда)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
]

# GDAL/GEOS (для Windows, если нужно)
if os.name == 'nt':
    GDAL_LIBRARY_PATH = r'C:\OSGeo4W\bin\gdal304.dll'
    GEOS_LIBRARY_PATH = r'C:\OSGeo4W\bin\geos_c.dll'
```

### 4. Создать и применить миграции

```bash
# Создать миграции
python manage.py makemigrations

# Применить миграции
python manage.py migrate

# Создать суперпользователя
python manage.py createsuperuser
```

### 5. Запустить сервер

```bash
python manage.py runserver
```

## 📁 Структура проекта

```
your_project/
├── apps/
│   ├── accounts/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   └── main/
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── permissions.py
│       ├── urls.py
│       └── admin.py
├── media/
│   ├── activities/
│   │   └── posters/
│   ├── categories/
│   └── avatars/
├── project/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py
└── requirements.txt
```

## 🧪 Тестирование API

### Через браузер
1. Откройте: `http://localhost:8000/api/`
2. Используйте Django REST Framework browsable API

### Через curl

```bash
# Получить список мероприятий
curl http://localhost:8000/api/activities/

# Создать категорию
curl -X POST http://localhost:8000/api/categories/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Music"}'

# Получить детали мероприятия
curl http://localhost:8000/api/activities/winter-jazz-festival/
```

### Через Postman/Insomnia
1. Импортировать коллекцию
2. Настроить базовый URL: `http://localhost:8000/api`
3. Тестировать эндпоинты

## 🔑 Аутентификация

### Session Authentication (для браузера)
```bash
# Login
curl -X POST http://localhost:8000/api-auth/login/ \
  -d "username=user@example.com&password=password123"

# Logout
curl -X POST http://localhost:8000/api-auth/logout/
```

### Token/JWT (если настроен)
```bash
# Получить токен
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Использовать токен
curl http://localhost:8000/api/activities/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📊 Создание тестовых данных

### Через Django shell

```bash
python manage.py shell
```

```python
from apps.main.models import Category, Organizer, Activity, ActivityAddress
from apps.accounts.models import User
from datetime import date, time
from django.contrib.gis.geos import Point

# Создать пользователя
user = User.objects.create_user(
    email='test@example.com',
    username='testuser',
    password='password123'
)

# Создать категорию
category = Category.objects.create(name='Music')

# Создать организатора
organizer = Organizer.objects.create(
    name='Brussels Jazz Club',
    email='info@jazz.be',
    phone='+32123456789',
    website='https://jazz.be'
)

# Создать мероприятие
activity = Activity.objects.create(
    name='Winter Jazz Festival',
    date=date(2024, 12, 20),
    time=time(19, 0),
    summary='Amazing jazz concert',
    description='Full description of the event',
    price=25.00,
    organizer=organizer,
    category=category,
    author=user,
    status='published'
)

# Создать адрес
address = ActivityAddress.objects.create(
    activity=activity,
    place_name='Grand Theatre',
    address='123 Music Street',
    city='Brussels',
    postcode='1000',
    country='Belgium'
)
address.set_coordinates(4.3517, 50.8503)
address.save()

print(f"Created: {activity.name}")
print(f"URL: /api/activities/{activity.slug}/")
```

### Через management command (создать свой)

```python
# apps/main/management/commands/create_test_data.py

from django.core.management.base import BaseCommand
from apps.main.models import Category, Organizer
from apps.accounts.models import User

class Command(BaseCommand):
    help = 'Create test data'

    def handle(self, *args, **options):
        # Создать тестовые данные
        categories = ['Music', 'Theater', 'Sports', 'Art']
        for cat_name in categories:
            Category.objects.get_or_create(name=cat_name)
        
        self.stdout.write(self.style.SUCCESS('Test data created!'))
```

Запустить:
```bash
python manage.py create_test_data
```

## 🐛 Troubleshooting

### PostGIS не установлен
```
ERROR: could not find extension "postgis"
```
**Решение:** Установите PostGIS для PostgreSQL

### GDAL/GEOS ошибки (Windows)
```
Could not find the GDAL library
```
**Решение:** Установите OSGeo4W или настройте пути в settings.py

### Ошибки миграций
```
Dependency error
```
**Решение:** 
```bash
python manage.py migrate --run-syncdb
python manage.py makemigrations
python manage.py migrate
```

## 📚 Полезные команды

```bash
# Создать fixtures
python manage.py dumpdata main --indent 2 > fixtures.json

# Загрузить fixtures
python manage.py loaddata fixtures.json

# Собрать статику
python manage.py collectstatic

# Создать кеш таблицы
python manage.py createcachetable

# Проверить deployment
python manage.py check --deploy
```

## 🚀 Production Deployment

### Checklist

1. ✅ DEBUG = False
2. ✅ SECRET_KEY в environment variable
3. ✅ ALLOWED_HOSTS настроен
4. ✅ Используется PostgreSQL
5. ✅ Настроен HTTPS
6. ✅ Настроены CORS правильно
7. ✅ Собрана статика (collectstatic)
8. ✅ Настроен Gunicorn/uWSGI
9. ✅ Настроен Nginx
10. ✅ Настроен supervisor/systemd

### Пример Gunicorn

```bash
gunicorn project.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers 4 \
  --timeout 120
```

### Пример Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /media/ {
        alias /path/to/media/;
    }

    location /static/ {
        alias /path/to/staticfiles/;
    }
}
```

## 📝 Дополнительно

- Документация API: Можно добавить drf-spectacular для OpenAPI/Swagger
- Кеширование: Redis для кеша запросов
- Celery: Для фоновых задач (например, email уведомления)
- Elasticsearch: Для полнотекстового поиска