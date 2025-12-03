
# config/urls.py (главный файл URL проекта)

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/v1/auth/', include('apps.accounts.urls')),  # Ваше существующее приложение
    path('api/v1/', include('apps.main.urls')),  # Activities API
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


# =============================================================================
# ИТОГОВЫЕ ЭНДПОИНТЫ API:
# =============================================================================

"""
CATEGORIES:
- GET    /api/v1/categories/                    - List all categories
- POST   /api/v1/categories/                    - Create category (admin only)
- GET    /api/v1/categories/{slug}/             - Get category detail
- PUT    /api/v1/categories/{slug}/             - Update category (admin only)
- PATCH  /api/v1/categories/{slug}/             - Partial update category (admin only)
- DELETE /api/v1/categories/{slug}/             - Delete category (admin only)
- GET    /api/v1/categories/{slug}/activities/  - Get category activities


ORGANIZERS:
- GET    /api/v1/organizers/                    - List all organizers
- POST   /api/v1/organizers/                    - Create organizer
- GET    /api/v1/organizers/{slug}/             - Get organizer detail
- PUT    /api/v1/organizers/{slug}/             - Update organizer
- PATCH  /api/v1/organizers/{slug}/             - Partial update organizer
- DELETE /api/v1/organizers/{slug}/             - Delete organizer
- GET    /api/v1/organizers/{slug}/activities/  - Get organizer activities


ACTIVITIES:
- GET    /api/v1/activities/                            - List activities (with filters)
- POST   /api/v1/activities/                            - Create activity
- GET    /api/v1/activities/{slug}/                     - Get activity detail
- PUT    /api/v1/activities/{slug}/                     - Update activity
- PATCH  /api/v1/activities/{slug}/                     - Partial update activity
- DELETE /api/v1/activities/{slug}/                     - Delete activity
- GET    /api/v1/activities/{slug}/address/             - Get activity address
- PATCH  /api/v1/activities/{slug}/update-address/      - Update activity address
- GET    /api/v1/activities/{slug}/comments/            - Get activity comments
- POST   /api/v1/activities/{slug}/add-comment/         - Add comment

NESTED ROUTES (если используете drf-nested-routers):

- GET    /api/v1/activities/{slug}/comments/            - List comments
- POST   /api/v1/activities/{slug}/comments/            - Create comment
- GET    /api/v1/activities/{slug}/comments/{id}/       - Get comment
- PUT    /api/v1/activities/{slug}/comments/{id}/       - Update comment
- DELETE /api/v1/activities/{slug}/comments/{id}/       - Delete comment

FILTERS & SEARCH:
Activities поддерживают фильтрацию:
- ?category=slug          - Filter by category
- ?organizer=slug         - Filter by organizer
- ?status=published       - Filter by status
- ?search=keyword         - Search in name/summary/description
- ?ordering=-date         - Order by date (add '-' for descending)
- ?ordering=views_count   - Order by views

Примеры:
/api/v1/activities/?category=music&status=published
/api/v1/activities/?search=jazz&ordering=-date
/api/v1/activities/?organizer=some-org&ordering=date
"""