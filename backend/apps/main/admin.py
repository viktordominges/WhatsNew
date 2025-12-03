# apps/activities/admin.py

from django.contrib import admin
from .models import Organizer, Activity, OrganizerReview


@admin.register(Organizer)
class OrganizerAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'organizer_type', 'email', 'phone',
        'is_verified', 'activities_count', 'created_at'
    )
    list_filter = ('organizer_type', 'is_verified', 'created_at')
    search_fields = ('name', 'email', 'phone')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at', 'verified_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'organizer_type', 'description', 'logo')
        }),
        ('Contact Information', {
            'fields': ('email', 'phone', 'address', 'website')
        }),
        ('Account & Verification', {
            'fields': ('user', 'is_verified', 'verified_at')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['verify_organizers', 'unverify_organizers']
    
    def verify_organizers(self, request, queryset):
        for organizer in queryset:
            organizer.verify()
        self.message_user(request, f"{queryset.count()} organizers verified.")
    verify_organizers.short_description = "Verify selected organizers"
    
    def unverify_organizers(self, request, queryset):
        queryset.update(is_verified=False, verified_at=None)
        self.message_user(request, f"{queryset.count()} organizers unverified.")
    unverify_organizers.short_description = "Unverify selected organizers"


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = (
        'activity_name', 'organizer', 'category', 'activity_date',
        'status', 'views_count', 'created_at'
    )
    list_filter = ('status', 'category', 'activity_date', 'created_at')
    search_fields = ('activity_name', 'organizer__name', 'activity_description')
    prepopulated_fields = {'activity_slug': ('activity_name',)}
    readonly_fields = ('created_at', 'updated_at', 'views_count')
    
    fieldsets = (
        ('Activity Information', {
            'fields': (
                'activity_name', 'activity_slug', 'organizer', 'category',
                'activity_date', 'activity_time', 'activity_summary',
                'activity_description', 'activity_poster', 'activity_price',
                'activity_site'
            )
        }),
        ('Publishing', {
            'fields': ('author', 'status')
        }),
        ('Statistics', {
            'fields': ('views_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(OrganizerReview)
class OrganizerReviewAdmin(admin.ModelAdmin):
    list_display = ('organizer', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('organizer__name', 'user__username', 'comment')
    readonly_fields = ('created_at', 'updated_at')
