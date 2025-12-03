# apps/main/views.py

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.db.models import Prefetch, Q
from django.utils import timezone

from .models import Category, Organizer, Activity, ActivityPhoto, Comment, ActivityAddress
from .serializers import (
    CategorySerializer,
    OrganizerSerializer,
    OrganizerPublicSerializer,
    ActivityListSerializer,
    ActivityDetailSerializer,
    ActivityCreateSerializer,
    ActivityUpdateSerializer,
    ActivityPhotoSerializer,
    CommentSerializer,
    CommentCreateSerializer,
    ActivityAddressSerializer,
    ActivityAddressWriteSerializer,
)
from .permissions import IsAuthorOrReadOnly, IsAdminOrReadOnly, IsActivityAuthor


# ============================================================================
# CATEGORY VIEWSET
# ============================================================================

class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for categories.
    
    list: Get all categories
    retrieve: Get single category
    create: Create new category (admin only)
    update: Update category (admin only)
    destroy: Delete category (admin only)
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    @action(detail=True, methods=['get'])
    def activities(self, request, slug=None):
        """Get all activities for this category"""
        category = self.get_object()
        activities = category.activities.filter(
            status='published',
            date__gte=timezone.now().date()
        ).select_related('organizer', 'category')
        
        serializer = ActivityListSerializer(activities, many=True)
        return Response(serializer.data)


# ============================================================================
# ORGANIZER VIEWSET
# ============================================================================

class OrganizerViewSet(viewsets.ModelViewSet):
    """
    ViewSet for organizers.
    
    list: Get all organizers (public info only)
    retrieve: Get single organizer (full info for staff/admin)
    create: Create new organizer (authenticated users)
    update: Update organizer (authenticated users)
    destroy: Delete organizer (admin only)
    """
    queryset = Organizer.objects.all()
    lookup_field = 'slug'
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Return full serializer for staff/admin, public for others"""
        if self.request.user and self.request.user.is_staff:
            return OrganizerSerializer
        return OrganizerPublicSerializer
    
    def perform_destroy(self, instance):
        """Only admin can delete organizers"""
        if not self.request.user.is_staff:
            raise PermissionDenied("Only administrators can delete organizers.")
        super().perform_destroy(instance)
    
    @action(detail=True, methods=['get'])
    def activities(self, request, slug=None):
        """Get all activities for this organizer"""
        organizer = self.get_object()
        
        # Show all activities for staff, only published for others
        if request.user and request.user.is_staff:
            activities = organizer.activities.all()
        else:
            activities = organizer.activities.filter(
                status='published',
                date__gte=timezone.now().date()
            )
        
        activities = activities.select_related('category', 'organizer')
        serializer = ActivityListSerializer(activities, many=True)
        return Response(serializer.data)


# ============================================================================
# ACTIVITY VIEWSET
# ============================================================================

class ActivityViewSet(viewsets.ModelViewSet):
    """
    ViewSet for activities.
    
    list: Get all published activities
    retrieve: Get single activity (increments views)
    create: Create new activity
    update: Update activity (author only)
    destroy: Delete activity (author only)
    """
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'organizer', 'status']
    search_fields = ['name', 'summary', 'description']
    ordering_fields = ['date', 'created_at', 'views_count', 'price']
    ordering = ['-date', '-created_at']
    
    def get_queryset(self):
        """
        Get queryset with optimized select/prefetch.
        Show all for staff, only published for others.
        """
        queryset = Activity.objects.select_related(
            'organizer', 'category', 'author', 'address'
        )
        
        # Optimize prefetch based on action
        if self.action == 'retrieve':
            queryset = queryset.prefetch_related(
                'photos',
                Prefetch(
                    'comments',
                    queryset=Comment.objects.filter(is_active=True).select_related('author')
                )
            )
        
        # Filter by status for non-staff users
        if not (self.request.user and self.request.user.is_staff):
            queryset = queryset.filter(status='published')
        
        # Filter by date range if provided
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        
        # Filter upcoming/past
        filter_type = self.request.query_params.get('filter')
        if filter_type == 'upcoming':
            queryset = queryset.filter(date__gte=timezone.now().date())
        elif filter_type == 'past':
            queryset = queryset.filter(date__lt=timezone.now().date())
        
        # Filter by price
        price_filter = self.request.query_params.get('price')
        if price_filter == 'free':
            queryset = queryset.filter(Q(price__isnull=True) | Q(price=0))
        elif price_filter == 'paid':
            queryset = queryset.filter(price__gt=0)
        
        return queryset
    
    def get_serializer_class(self):
        """Choose serializer based on action"""
        if self.action == 'list':
            return ActivityListSerializer
        elif self.action == 'create':
            return ActivityCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ActivityUpdateSerializer
        return ActivityDetailSerializer
    
    def retrieve(self, request, *args, **kwargs):
        """Get activity detail and increment views"""
        instance = self.get_object()
        
        # Increment views for published activities (only for non-authors)
        if instance.status == 'published' and instance.author != request.user:
            instance.increment_views()
            # Refresh instance to get updated views_count
            instance.refresh_from_db()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def address(self, request, slug=None):
        """Get activity address"""
        activity = self.get_object()
        
        if not hasattr(activity, 'address'):
            return Response(
                {'detail': 'No address found for this activity.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ActivityAddressSerializer(activity.address)
        return Response(serializer.data)
    
    @action(
        detail=True,
        methods=['post', 'patch'],
        permission_classes=[IsAuthenticated, IsAuthorOrReadOnly]
    )
    def address_update(self, request, slug=None):
        """Create or update activity address"""
        activity = self.get_object()
        
        # Check permissions
        self.check_object_permissions(request, activity)
        
        # Check if address exists
        if hasattr(activity, 'address'):
            # Update existing address
            serializer = ActivityAddressWriteSerializer(
                activity.address,
                data=request.data,
                partial=True
            )
        else:
            # Create new address
            serializer = ActivityAddressWriteSerializer(data=request.data)
        
        serializer.is_valid(raise_exception=True)
        
        if hasattr(activity, 'address'):
            serializer.save()
        else:
            serializer.save(activity=activity)
        
        return Response(
            ActivityAddressSerializer(activity.address).data,
            status=status.HTTP_200_OK
        )
    
    @action(
        detail=True,
        methods=['delete'],
        permission_classes=[IsAuthenticated, IsAuthorOrReadOnly]
    )
    def address_delete(self, request, slug=None):
        """Delete activity address"""
        activity = self.get_object()
        
        # Check permissions
        self.check_object_permissions(request, activity)
        
        if not hasattr(activity, 'address'):
            return Response(
                {'detail': 'No address found for this activity.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        activity.address.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['get'])
    def comments(self, request, slug=None):
        """Get all active comments for activity"""
        activity = self.get_object()
        comments = activity.comments.filter(is_active=True).select_related('author')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_comment(self, request, slug=None):
        """Add comment to activity"""
        activity = self.get_object()
        
        # Only allow comments on published activities
        if activity.status != 'published':
            return Response(
                {'detail': 'Cannot comment on unpublished activities.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = CommentCreateSerializer(
            data=request.data,
            context={'request': request, 'activity': activity}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(
            CommentSerializer(serializer.instance).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['get'])
    def photos(self, request, slug=None):
        """Get all photos for activity"""
        activity = self.get_object()
        photos = activity.photos.all()
        serializer = ActivityPhotoSerializer(photos, many=True)
        return Response(serializer.data)
    
    @action(
        detail=True,
        methods=['post'],
        permission_classes=[IsAuthenticated, IsAuthorOrReadOnly]
    )
    def add_photo(self, request, slug=None):
        """Add photo to activity"""
        activity = self.get_object()
        
        # Check permissions
        self.check_object_permissions(request, activity)
        
        serializer = ActivityPhotoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(activity=activity)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ============================================================================
# ACTIVITY PHOTO VIEWSET
# ============================================================================

class ActivityPhotoViewSet(viewsets.ModelViewSet):
    """
    ViewSet for activity photos.
    Nested under activities.
    """
    serializer_class = ActivityPhotoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsActivityAuthor]
    
    def get_queryset(self):
        """Get photos for specific activity"""
        activity_slug = self.kwargs.get('activity_slug')
        return ActivityPhoto.objects.filter(
            activity__slug=activity_slug
        ).select_related('activity')
    
    def perform_create(self, serializer):
        """Create photo for specific activity"""
        activity_slug = self.kwargs.get('activity_slug')
        activity = get_object_or_404(Activity, slug=activity_slug)
        
        # Verify user is the activity author
        if activity.author != self.request.user:
            raise PermissionDenied("You can only add photos to your own activities.")
        
        serializer.save(activity=activity)
    
    def perform_update(self, serializer):
        """Update photo"""
        # Permission already checked by IsActivityAuthor
        serializer.save()
    
    def perform_destroy(self, instance):
        """Delete photo"""
        # Permission already checked by IsActivityAuthor
        instance.delete()


# ============================================================================
# COMMENT VIEWSET
# ============================================================================

class CommentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for comments.
    Nested under activities.
    """
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    
    def get_queryset(self):
        """Get active comments for specific activity"""
        activity_slug = self.kwargs.get('activity_slug')
        return Comment.objects.filter(
            activity__slug=activity_slug,
            is_active=True
        ).select_related('author', 'activity')
    
    def get_serializer_class(self):
        """Choose serializer based on action"""
        if self.action == 'create':
            return CommentCreateSerializer
        return CommentSerializer
    
    def perform_create(self, serializer):
        """Create comment for specific activity"""
        activity_slug = self.kwargs.get('activity_slug')
        activity = get_object_or_404(Activity, slug=activity_slug)
        
        # Only allow comments on published activities
        if activity.status != 'published':
            raise PermissionDenied("Cannot comment on unpublished activities.")
        
        serializer.save(
            author=self.request.user,
            activity=activity
        )
    
    def perform_update(self, serializer):
        """Update comment (only author can update)"""
        # Permission already checked by IsAuthorOrReadOnly
        serializer.save()
    
    def perform_destroy(self, instance):
        """Soft delete comment (set is_active=False)"""
        # Permission already checked by IsAuthorOrReadOnly
        instance.is_active = False
        instance.save()