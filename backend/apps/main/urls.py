# apps/main/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet,
    OrganizerViewSet,
    ActivityViewSet,
    CommentViewSet,
)

# Main router for top-level resources
router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'organizers', OrganizerViewSet, basename='organizer')
router.register(r'activities', ActivityViewSet, basename='activity')

app_name = 'main'

urlpatterns = [
    # Include main router
    path('', include(router.urls)),
    
    # ========================================================================
    # NESTED ROUTES - Activity Comments
    # ========================================================================
    # List/Create comments for activity
    path(
        'activities/<slug:activity_slug>/comments/',
        CommentViewSet.as_view({
            'get': 'list',
            'post': 'create'
        }),
        name='activity-comments-list'
    ),
    # Retrieve/Update/Delete specific comment
    path(
        'activities/<slug:activity_slug>/comments/<int:pk>/',
        CommentViewSet.as_view({
            'get': 'retrieve',
            'put': 'update',
            'patch': 'partial_update',
            'delete': 'destroy'
        }),
        name='activity-comments-detail'
    ),
]