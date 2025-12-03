# apps/main/admin.py

from django.contrib import admin
from django.contrib.gis.admin import GISModelAdmin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Category, Organizer, Activity, ActivityAddress, Comment


# ============================================================================
# INLINE ADMINS
# ============================================================================

class ActivityAddressInline(admin.StackedInline):
    """Inline for activity address"""
    model = ActivityAddress
    extra = 0
    fields = [
        'place_name', 'address', 'city', 'postcode', 'country',
        'location'
    ]
    
    def has_delete_permission(self, request, obj=None):
        """Allow deletion of address"""
        return True


class CommentInline(admin.TabularInline):
    """Inline for activity comments"""
    model = Comment
    extra = 0
    fields = ['author', 'text', 'is_active', 'created_at']
    readonly_fields = ['author', 'created_at']
    can_delete = False
    
    def has_add_permission(self, request, obj=None):
        """Disable adding comments from inline"""
        return False


# ============================================================================
# CATEGORY ADMIN
# ============================================================================

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin for Category model"""
    list_display = ['name', 'slug', 'image_preview', 'activities_count', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['slug', 'created_at', 'image_preview']
    
    fieldsets = [
        ('Basic Info', {
            'fields': ['name', 'slug']
        }),
        ('Media', {
            'fields': ['image', 'image_preview']
        }),
        ('Metadata', {
            'fields': ['created_at'],
            'classes': ['collapse']
        })
    ]
    
    def image_preview(self, obj):
        """Display image preview"""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 100px; max-width: 200px;" />',
                obj.image.url
            )
        return '-'
    image_preview.short_description = 'Preview'
    
    def activities_count(self, obj):
        """Display count of activities"""
        count = obj.activities.count()
        url = reverse('admin:main_activity_changelist') + f'?category__id__exact={obj.id}'
        return format_html('<a href="{}">{} activities</a>', url, count)
    activities_count.short_description = 'Activities'


# ============================================================================
# ORGANIZER ADMIN
# ============================================================================

@admin.register(Organizer)
class OrganizerAdmin(admin.ModelAdmin):
    """Admin for Organizer model"""
    list_display = ['name', 'email', 'phone', 'website_link', 'activities_count', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'email', 'phone']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['slug', 'created_at', 'updated_at']
    
    fieldsets = [
        ('Basic Info', {
            'fields': ['name', 'slug']
        }),
        ('Contact Info', {
            'fields': ['email', 'phone', 'website']
        }),
        ('Metadata', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse']
        })
    ]
    
    def website_link(self, obj):
        """Display clickable website link"""
        if obj.website:
            return format_html('<a href="{}" target="_blank">{}</a>', obj.website, obj.website)
        return '-'
    website_link.short_description = 'Website'
    
    def activities_count(self, obj):
        """Display count of activities"""
        count = obj.activities.count()
        url = reverse('admin:main_activity_changelist') + f'?organizer__id__exact={obj.id}'
        return format_html('<a href="{}">{} activities</a>', url, count)
    activities_count.short_description = 'Activities'


# ============================================================================
# ACTIVITY ADMIN
# ============================================================================

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    """Admin for Activity model"""
    list_display = [
        'name', 'organizer', 'category', 'date', 'time',
        'status_badge', 'price_display', 'views_count', 'author'
    ]
    list_filter = ['status', 'category', 'organizer', 'date', 'created_at']
    search_fields = ['name', 'summary', 'description', 'organizer__name']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = [
        'slug', 'views_count', 'author',
        'created_at', 'updated_at', 'poster_preview'
    ]
    date_hierarchy = 'date'
    inlines = [ActivityAddressInline, CommentInline]
    
    fieldsets = [
        ('Basic Info', {
            'fields': ['name', 'slug', 'organizer', 'category', 'author']
        }),
        ('Event Details', {
            'fields': ['date', 'time', 'summary', 'description']
        }),
        ('Media & Pricing', {
            'fields': ['poster', 'poster_preview', 'price', 'website']
        }),
        ('Status', {
            'fields': ['status', 'views_count']
        }),
        ('Metadata', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse']
        })
    ]
    
    actions = ['publish_activities', 'unpublish_activities', 'reset_views']
    
    def save_model(self, request, obj, form, change):
        """Set author on creation"""
        if not change:  # Only on creation
            obj.author = request.user
        super().save_model(request, obj, form, change)
    
    def poster_preview(self, obj):
        """Display poster preview"""
        if obj.poster:
            return format_html(
                '<img src="{}" style="max-height: 200px; max-width: 300px;" />',
                obj.poster.url
            )
        return '-'
    poster_preview.short_description = 'Poster Preview'
    
    def status_badge(self, obj):
        """Display status as colored badge"""
        colors = {
            'draft': '#999',
            'published': '#28a745',
        }
        color = colors.get(obj.status, '#999')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-weight: bold;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def price_display(self, obj):
        """Display price or 'Free'"""
        if obj.is_free:
            return format_html('<span style="color: #28a745; font-weight: bold;">FREE</span>')
        return f'€{obj.price}'
    price_display.short_description = 'Price'
    
    # Admin actions
    
    @admin.action(description='Publish selected activities')
    def publish_activities(self, request, queryset):
        """Bulk publish activities"""
        updated = queryset.update(status='published')
        self.message_user(request, f'{updated} activities published.')
    
    @admin.action(description='Unpublish selected activities')
    def unpublish_activities(self, request, queryset):
        """Bulk unpublish activities"""
        updated = queryset.update(status='draft')
        self.message_user(request, f'{updated} activities unpublished.')
    
    @admin.action(description='Reset views count')
    def reset_views(self, request, queryset):
        """Reset views count to 0"""
        updated = queryset.update(views_count=0)
        self.message_user(request, f'Views reset for {updated} activities.')


# ============================================================================
# ACTIVITY ADDRESS ADMIN
# ============================================================================

@admin.register(ActivityAddress)
class ActivityAddressAdmin(GISModelAdmin):
    """Admin for ActivityAddress model with map"""
    list_display = ['activity', 'address', 'city', 'postcode', 'country', 'has_coordinates']
    list_filter = ['country', 'city']
    search_fields = ['place_name', 'address', 'city', 'activity__name']
    readonly_fields = ['created_at', 'updated_at', 'coordinates_display']
    
    fieldsets = [
        ('Activity', {
            'fields': ['activity']
        }),
        ('Address', {
            'fields': ['place_name', 'address', 'city', 'postcode', 'country']
        }),
        ('Location', {
            'fields': ['location', 'coordinates_display']
        }),
        ('Metadata', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse']
        })
    ]
    
    # GIS settings
    default_lon = 4.3517  # Brussels longitude
    default_lat = 50.8503  # Brussels latitude
    default_zoom = 10
    
    def has_coordinates(self, obj):
        """Check if coordinates are set"""
        if obj.location:
            return format_html('<span style="color: green;">✓</span>')
        return format_html('<span style="color: red;">✗</span>')
    has_coordinates.short_description = 'Has Coords'
    
    def coordinates_display(self, obj):
        """Display coordinates in readable format"""
        if obj.location:
            return f'Lat: {obj.latitude:.6f}, Lon: {obj.longitude:.6f}'
        return '-'
    coordinates_display.short_description = 'Coordinates'


# ============================================================================
# COMMENT ADMIN
# ============================================================================

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """Admin for Comment model"""
    list_display = ['activity', 'author', 'text_preview', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['text', 'activity__name', 'author__username']
    readonly_fields = ['author', 'activity', 'created_at', 'updated_at']
    
    fieldsets = [
        ('Comment Info', {
            'fields': ['activity', 'author', 'text', 'is_active']
        }),
        ('Metadata', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse']
        })
    ]
    
    actions = ['activate_comments', 'deactivate_comments']
    
    def text_preview(self, obj):
        """Show truncated comment text"""
        max_length = 60
        if len(obj.text) > max_length:
            return f'{obj.text[:max_length]}...'
        return obj.text
    text_preview.short_description = 'Comment'
    
    @admin.action(description='Activate selected comments')
    def activate_comments(self, request, queryset):
        """Bulk activate comments"""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} comments activated.')
    
    @admin.action(description='Deactivate selected comments')
    def deactivate_comments(self, request, queryset):
        """Bulk deactivate comments"""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} comments deactivated.')


# ============================================================================
# ADMIN SITE CUSTOMIZATION
# ============================================================================

# Customize admin site header and title
admin.site.site_header = 'Activities Management'
admin.site.site_title = 'Activities Admin'
admin.site.index_title = 'Welcome to Activities Administration'