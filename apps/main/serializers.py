# apps/activities/serializers.py

from rest_framework import serializers
from .models import Organizer, Activity, OrganizerReview


class OrganizerSerializer(serializers.ModelSerializer):
    """Сериализатор для организатора"""
    activities_count = serializers.IntegerField(read_only=True)
    upcoming_activities_count = serializers.IntegerField(read_only=True)
    total_views = serializers.IntegerField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    
    class Meta:
        model = Organizer
        fields = (
            'id', 'name', 'slug', 'organizer_type', 'description',
            'email', 'phone', 'address', 'website', 'logo',
            'is_verified', 'activities_count', 'upcoming_activities_count',
            'total_views', 'average_rating', 'created_at'
        )
        read_only_fields = ('slug', 'is_verified', 'created_at')


class OrganizerListSerializer(serializers.ModelSerializer):
    """Краткий сериализатор для списков"""
    activities_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Organizer
        fields = ('id', 'name', 'slug', 'logo', 'is_verified', 'activities_count')


class ActivitySerializer(serializers.ModelSerializer):
    """Сериализатор для мероприятия"""
    organizer = OrganizerListSerializer(read_only=True)
    organizer_id = serializers.PrimaryKeyRelatedField(
        queryset=Organizer.objects.all(),
        source='organizer',
        write_only=True
    )
    organizer_contact = serializers.DictField(read_only=True)
    is_free = serializers.BooleanField(read_only=True)
    days_until_event = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Activity
        fields = (
            'id', 'activity_name', 'activity_slug', 'organizer',
            'organizer_id', 'organizer_contact', 'category',
            'activity_date', 'activity_time', 'activity_summary',
            'activity_description', 'activity_poster', 'activity_price',
            'is_free', 'activity_site', 'status', 'views_count',
            'days_until_event', 'created_at'
        )
        read_only_fields = ('activity_slug', 'views_count', 'created_at')