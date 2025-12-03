# API Usage Examples

"""
=============================================================================
ПРИМЕРЫ ЗАПРОСОВ К API
=============================================================================

1. CATEGORIES
-------------

# Получить все категории
GET /api/categories/
Response:
[
  {
    "id": 1,
    "name": "Music",
    "slug": "music",
    "image": "/media/categories/music.jpg"
  }
]

# Создать категорию
POST /api/categories/
{
  "name": "Theater",
  "image": <file>
}

# Получить мероприятия категории
GET /api/categories/music/activities/


2. ORGANIZERS
-------------

# Получить всех организаторов
GET /api/organizers/

# Поиск организатора
GET /api/organizers/?search=jazz

# Создать организатора
POST /api/organizers/
{
  "name": "Brussels Jazz Club",
  "email": "info@brusselsjazz.be",
  "phone": "+32123456789",
  "website": "https://brusselsjazz.be"
}

# Обновить организатора
PATCH /api/organizers/brussels-jazz-club/
{
  "phone": "+32987654321"
}

# Получить мероприятия организатора
GET /api/organizers/brussels-jazz-club/activities/


3. ACTIVITIES
-------------

# Получить все опубликованные мероприятия
GET /api/activities/

# Фильтрация и поиск
GET /api/activities/?category=music&status=published
GET /api/activities/?search=jazz&ordering=-date
GET /api/activities/?organizer=brussels-jazz-club
GET /api/activities/?date__gte=2024-12-01  # Только будущие

# Создать мероприятие с адресом
POST /api/activities/
{
  "name": "Winter Jazz Festival 2024",
  "date": "2024-12-20",
  "time": "19:00:00",
  "summary": "Amazing winter jazz concert with international artists",
  "description": "Full description of the event...",
  "poster": <file>,
  "price": "25.00",
  "website": "https://example.com",
  "organizer_id": 1,
  "category_id": 2,
  "status": "published",
  "address": {
    "place_name": "Grand Theatre",
    "address": "123 Music Street",
    "city": "Brussels",
    "postcode": "1000",
    "country": "Belgium",
    "longitude": 4.3517,
    "latitude": 50.8503
  }
}

# Получить детали мероприятия (счетчик просмотров увеличится)
GET /api/activities/winter-jazz-festival-2024/
Response:
{
  "id": 1,
  "name": "Winter Jazz Festival 2024",
  "slug": "winter-jazz-festival-2024",
  "date": "2024-12-20",
  "time": "19:00:00",
  "summary": "Amazing winter jazz concert...",
  "description": "Full description...",
  "poster": "/media/activities/posters/jazz.jpg",
  "price": "25.00",
  "website": "https://example.com",
  "organizer": {
    "id": 1,
    "name": "Brussels Jazz Club",
    "slug": "brussels-jazz-club",
    "email": "info@brusselsjazz.be",
    "phone": "+32123456789",
    "website": "https://brusselsjazz.be"
  },
  "category": {
    "id": 2,
    "name": "Music",
    "slug": "music",
    "image": "/media/categories/music.jpg"
  },
  "author": {
    "id": 5,
    "username": "john_doe",
    "email": "john@example.com",
    "avatar": "/media/avatars/john.jpg"
  },
  "address": {
    "place_name": "Grand Theatre",
    "address": "123 Music Street",
    "city": "Brussels",
    "postcode": "1000",
    "country": "Belgium",
    "coordinates": [4.3517, 50.8503],
    "latitude": 50.8503,
    "longitude": 4.3517
  },
  "photos": [],
  "comments": [],
  "status": "published",
  "views_count": 15,
  "is_free": false,
  "is_upcoming": true,
  "created_at": "2024-11-01T10:00:00Z",
  "updated_at": "2024-11-01T10:00:00Z"
}

# Обновить мероприятие
PATCH /api/activities/winter-jazz-festival-2024/
{
  "price": "30.00",
  "status": "published"
}

# Удалить мероприятие (только автор)
DELETE /api/activities/winter-jazz-festival-2024/


4. ADDRESS
----------

# Получить адрес мероприятия
GET /api/activities/winter-jazz-festival-2024/address/

# Обновить адрес (или создать если нет)
PATCH /api/activities/winter-jazz-festival-2024/update-address/
{
  "city": "Antwerp",
  "longitude": 4.4025,
  "latitude": 51.2194
}


5. COMMENTS
-----------

# Получить комментарии мероприятия
GET /api/activities/winter-jazz-festival-2024/comments/

# Добавить комментарий (требуется авторизация)
POST /api/activities/winter-jazz-festival-2024/add-comment/
{
  "text": "Looking forward to this event!"
}

Response:
{
  "id": 10,
  "author": {
    "id": 5,
    "username": "john_doe",
    "email": "john@example.com",
    "avatar": "/media/avatars/john.jpg"
  },
  "text": "Looking forward to this event!",
  "is_active": true,
  "created_at": "2024-11-15T14:30:00Z",
  "updated_at": "2024-11-15T14:30:00Z"
}

# Обновить свой комментарий
PATCH /api/activities/winter-jazz-festival-2024/comments/10/
{
  "text": "Updated comment text"
}

# Удалить свой комментарий
DELETE /api/activities/winter-jazz-festival-2024/comments/10/


6. PHOTOS
---------

# Получить фотографии мероприятия
GET /api/activities/winter-jazz-festival-2024/photos/

# Добавить фото (требуется авторизация, только автор)
POST /api/activities/winter-jazz-festival-2024/add-photo/
{
  "image": <file>,
  "caption": "Main stage setup",
  "order": 1
}

# Обновить фото
PATCH /api/activities/winter-jazz-festival-2024/photos/5/
{
  "caption": "Updated caption",
  "order": 2
}

# Удалить фото
DELETE /api/activities/winter-jazz-festival-2024/photos/5/


=============================================================================
PAGINATION
=============================================================================

Все списки поддерживают пагинацию:

GET /api/activities/?page=2

Response:
{
  "count": 45,
  "next": "http://api.example.com/api/activities/?page=3",
  "previous": "http://api.example.com/api/activities/?page=1",
  "results": [...]
}


=============================================================================
AUTHENTICATION
=============================================================================

# Session Authentication (для браузера)
POST /api-auth/login/
{
  "username": "user@example.com",
  "password": "password123"
}

# JWT Authentication (если настроен)
POST /api/token/
{
  "email": "user@example.com",
  "password": "password123"
}
Response:
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

# Использование токена
Headers:
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...


=============================================================================
ERROR RESPONSES
=============================================================================

# 400 Bad Request
{
  "name": ["This field is required."],
  "date": ["Activity date cannot be in the past."]
}

# 401 Unauthorized
{
  "detail": "Authentication credentials were not provided."
}

# 403 Forbidden
{
  "detail": "You do not have permission to perform this action."
}

# 404 Not Found
{
  "detail": "Not found."
}


=============================================================================
FILTERING & SEARCH EXAMPLES
=============================================================================

# Комбинированная фильтрация
GET /api/activities/?category=music&status=published&ordering=-date&search=jazz

# Диапазон дат
GET /api/activities/?date__gte=2024-12-01&date__lte=2024-12-31

# Только бесплатные мероприятия (через custom filter, если добавите)
GET /api/activities/?is_free=true

# Самые популярные
GET /api/activities/?ordering=-views_count

# Предстоящие мероприятия
GET /api/activities/?date__gte=2024-11-15&ordering=date


=============================================================================
BULK OPERATIONS (если нужно добавить)
=============================================================================

# В будущем можно добавить bulk операции:

# Удалить несколько комментариев
DELETE /api/comments/bulk/
{
  "ids": [1, 2, 3, 4]
}

# Обновить статус нескольких мероприятий
PATCH /api/activities/bulk-update-status/
{
  "ids": [10, 11, 12],
  "status": "published"
}
"""


# =============================================================================
# PYTHON CLIENT EXAMPLE (requests library)
# =============================================================================

import requests

BASE_URL = "http://localhost:8000/api"

# Get activities
response = requests.get(f"{BASE_URL}/activities/")
activities = response.json()

# Create activity (with authentication)
session = requests.Session()
session.post("http://localhost:8000/api-auth/login/", {
    "username": "user@example.com",
    "password": "password123"
})

activity_data = {
    "name": "New Event",
    "date": "2024-12-25",
    "time": "18:00:00",
    "summary": "Christmas concert",
    "description": "Full description...",
    "organizer_id": 1,
    "category_id": 2,
    "status": "published",
    "address": {
        "address": "Main Street 1",
        "city": "Brussels",
        "longitude": 4.3517,
        "latitude": 50.8503
    }
}

response = session.post(f"{BASE_URL}/activities/", json=activity_data)
new_activity = response.json()

print(f"Created activity: {new_activity['name']} with slug: {new_activity['slug']}")


# =============================================================================
# JAVASCRIPT/FETCH EXAMPLE
# =============================================================================

"""
// Get activities
fetch('http://localhost:8000/api/activities/')
  .then(response => response.json())
  .then(data => console.log(data));

// Create activity with JWT token
const activityData = {
  name: "New Event",
  date: "2024-12-25",
  time: "18:00:00",
  summary: "Christmas concert",
  description: "Full description...",
  organizer_id: 1,
  category_id: 2,
  status: "published",
  address: {
    address: "Main Street 1",
    city: "Brussels",
    longitude: 4.3517,
    latitude: 50.8503
  }
};

fetch('http://localhost:8000/api/activities/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + accessToken
  },
  body: JSON.stringify(activityData)
})
  .then(response => response.json())
  .then(data => console.log('Created:', data));
"""








# apps/main/admin.py

from django.contrib import admin
from django.contrib.gis.admin import GISModelAdmin
from .models import Category, Organizer, Activity, ActivityPhoto, Comment, ActivityAddress


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at']


@admin.register(Organizer)
class OrganizerAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'email', 'phone', 'created_at']
    search_fields = ['name', 'email']
    list_filter = ['created_at']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']


class ActivityPhotoInline(admin.TabularInline):
    model = ActivityPhoto
    extra = 1
    fields = ['image', 'caption', 'order']


class ActivityAddressInline(admin.StackedInline):
    model = ActivityAddress
    can_delete = False
    fields = ['place_name', 'address', 'city', 'postcode', 'country', 'location']


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'organizer', 'category', 'date', 'status', 'views_count', 'created_at']
    list_filter = ['status', 'category', 'date', 'created_at']
    search_fields = ['name', 'summary', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at', 'views_count']
    date_hierarchy = 'date'
    inlines = [ActivityAddressInline, ActivityPhotoInline]
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'slug', 'summary', 'description', 'poster')
        }),
        ('Event Details', {
            'fields': ('date', 'time', 'price', 'website')
        }),
        ('Relations', {
            'fields': ('organizer', 'category', 'author')
        }),
        ('Status', {
            'fields': ('status', 'views_count')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:  # Creating new object
            obj.author = request.user
        super().save_model(request, obj, form, change)


@admin.register(ActivityPhoto)
class ActivityPhotoAdmin(admin.ModelAdmin):
    list_display = ['activity', 'caption', 'order', 'uploaded_at']
    list_filter = ['uploaded_at']
    search_fields = ['activity__name', 'caption']
    readonly_fields = ['uploaded_at']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['author', 'activity', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['author__username', 'activity__name', 'text']
    readonly_fields = ['created_at', 'updated_at']
    actions = ['activate_comments', 'deactivate_comments']
    
    def activate_comments(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} comments activated.')
    activate_comments.short_description = 'Activate selected comments'
    
    def deactivate_comments(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} comments deactivated.')
    deactivate_comments.short_description = 'Deactivate selected comments'


@admin.register(ActivityAddress)
class ActivityAddressAdmin(GISModelAdmin):
    """Admin with map widget for geographic fields"""
    list_display = ['activity', 'place_name', 'city', 'country']
    search_fields = ['activity__name', 'place_name', 'address', 'city']
    readonly_fields = ['created_at', 'updated_at']
    
    # GIS settings
    default_lon = 4.3517  # Brussels longitude
    default_lat = 50.8503  # Brussels latitude
    default_zoom = 12


# =============================================================================
# SETTINGS.PY additions (что нужно добавить в settings.py)
# =============================================================================

"""
# apps/main/settings_additions.py
# Скопируйте это в ваш settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.gis',  # ← Для геолокации
    
    # Third party
    'rest_framework',
    'django_filters',
    'corsheaders',  # Если нужен CORS
    
    # Your apps
    'apps.accounts',
    'apps.main',
]

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        # 'rest_framework_simplejwt.authentication.JWTAuthentication',  # Если используете JWT
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

# GDAL/GEOS configuration (для PostGIS)
if os.name == 'nt':  # Windows
    GDAL_LIBRARY_PATH = r'C:\OSGeo4W\bin\gdal304.dll'
    GEOS_LIBRARY_PATH = r'C:\OSGeo4W\bin\geos_c.dll'

# Database with PostGIS
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'your_db_name',
        'USER': 'your_db_user',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# CORS settings (если фронтенд на другом порту)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
]

# AUTH_USER_MODEL уже должен быть настроен
AUTH_USER_MODEL = 'accounts.User'
"""