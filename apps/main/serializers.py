# apps/main/serializers.py

from rest_framework import serializers
from django.utils import timezone
from .models import Category, Organizer, Activity, Comment, ActivityAddress


# ============================================================================
# USER SERIALIZER (minimal, for nested use)
# ============================================================================

class UserSerializer(serializers.Serializer):
    """Read-only user info for nested serialization"""
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(read_only=True)
    avatar = serializers.ImageField(read_only=True)


# ============================================================================
# CATEGORY SERIALIZERS
# ============================================================================

class CategorySerializer(serializers.ModelSerializer):
    """Category serializer"""
    activities_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'activities_count']
        read_only_fields = ['id', 'slug', 'activities_count']
    
    def get_activities_count(self, obj):
        """Get count of published activities in this category"""
        return obj.activities.filter(status='published').count()


# ============================================================================
# ORGANIZER SERIALIZERS
# ============================================================================

class OrganizerPublicSerializer(serializers.ModelSerializer):
    """Public organizer serializer without sensitive data"""
    activities_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Organizer
        fields = ['id', 'name', 'slug', 'website', 'activities_count']
        read_only_fields = ['id', 'slug', 'activities_count']
    
    def get_activities_count(self, obj):
        """Get count of published activities"""
        return obj.activities.filter(status='published').count()


class OrganizerSerializer(serializers.ModelSerializer):
    """Full organizer serializer with contact info"""
    activities_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Organizer
        fields = ['id', 'name', 'slug', 'email', 'phone', 'website', 'activities_count', 'created_at']
        read_only_fields = ['id', 'slug', 'activities_count', 'created_at']
    
    def get_activities_count(self, obj):
        """Get count of published activities"""
        return obj.activities.filter(status='published').count()
    
    def validate_email(self, value):
        """Check email uniqueness on update"""
        instance = self.instance
        if instance and Organizer.objects.filter(email=value).exclude(pk=instance.pk).exists():
            raise serializers.ValidationError("Organizer with this email already exists.")
        return value


# ============================================================================
# ACTIVITY ADDRESS SERIALIZERS
# ============================================================================

class ActivityAddressSerializer(serializers.ModelSerializer):
    """Address serializer with coordinates"""
    coordinates = serializers.ListField(
        child=serializers.FloatField(),
        read_only=True,
        help_text="[longitude, latitude]"
    )
    latitude = serializers.FloatField(read_only=True)
    longitude = serializers.FloatField(read_only=True)
    
    class Meta:
        model = ActivityAddress
        fields = [
            'place_name', 'address', 'city', 'postcode', 'country',
            'coordinates', 'latitude', 'longitude'
        ]
        read_only_fields = ['coordinates', 'latitude', 'longitude']


class ActivityAddressWriteSerializer(serializers.ModelSerializer):
    """Address serializer for create/update with coordinate input"""
    longitude = serializers.FloatField(write_only=True, required=False, allow_null=True)
    latitude = serializers.FloatField(write_only=True, required=False, allow_null=True)
    
    class Meta:
        model = ActivityAddress
        fields = [
            'place_name', 'address', 'city', 'postcode', 'country',
            'longitude', 'latitude'
        ]
    
    def validate(self, attrs):
        """Validate that we have either address or coordinates"""
        longitude = attrs.get('longitude')
        latitude = attrs.get('latitude')
        address = attrs.get('address')
        
        if not address and not (longitude and latitude):
            raise serializers.ValidationError(
                "Provide either address or both longitude and latitude."
            )
        
        # Validate coordinate ranges
        if longitude is not None and not (-180 <= longitude <= 180):
            raise serializers.ValidationError({
                'longitude': 'Must be between -180 and 180'
            })
        
        if latitude is not None and not (-90 <= latitude <= 90):
            raise serializers.ValidationError({
                'latitude': 'Must be between -90 and 90'
            })
        
        return attrs
    
    def _apply_coordinates(self, instance, longitude, latitude):
        """Helper method to set coordinates on instance"""
        if longitude is not None and latitude is not None:
            instance.set_coordinates(longitude, latitude)
    
    def create(self, validated_data):
        """Create address with coordinates"""
        longitude = validated_data.pop('longitude', None)
        latitude = validated_data.pop('latitude', None)
        
        address = ActivityAddress(**validated_data)
        self._apply_coordinates(address, longitude, latitude)
        address.save()
        return address
    
    def update(self, instance, validated_data):
        """Update address with coordinates"""
        longitude = validated_data.pop('longitude', None)
        latitude = validated_data.pop('latitude', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        self._apply_coordinates(instance, longitude, latitude)
        instance.save()
        return instance


# ============================================================================
# COMMENT SERIALIZERS
# ============================================================================

class CommentSerializer(serializers.ModelSerializer):
    """Comment serializer"""
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'author', 'text', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'is_active', 'created_at', 'updated_at']


class CommentCreateSerializer(serializers.ModelSerializer):
    """Comment create serializer"""
    
    class Meta:
        model = Comment
        fields = ['text']
    
    def validate_text(self, value):
        """Validate comment text"""
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Comment must be at least 3 characters long.")
        return value
    
    def create(self, validated_data):
        """Create comment with author and activity from context"""
        validated_data['author'] = self.context['request'].user
        validated_data['activity'] = self.context['activity']
        return super().create(validated_data)


# ============================================================================
# ACTIVITY SERIALIZERS
# ============================================================================

class ActivityListSerializer(serializers.ModelSerializer):
    """Activity list serializer - minimal fields"""
    organizer = OrganizerPublicSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    is_free = serializers.BooleanField(read_only=True)
    is_upcoming = serializers.BooleanField(read_only=True)
    has_address = serializers.SerializerMethodField()
    
    class Meta:
        model = Activity
        fields = [
            'id', 'name', 'slug', 'date', 'time',
            'summary', 'poster', 'price', 'is_free',
            'organizer', 'category', 'status',
            'is_upcoming', 'views_count', 'has_address'
        ]
        read_only_fields = ['id', 'slug', 'views_count']
    
    def get_has_address(self, obj):
        """Check if activity has address"""
        return hasattr(obj, 'address')


class ActivityDetailSerializer(serializers.ModelSerializer):
    """Activity detail serializer - full data"""
    organizer = OrganizerPublicSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    author = UserSerializer(read_only=True)
    address = ActivityAddressSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    is_free = serializers.BooleanField(read_only=True)
    is_upcoming = serializers.BooleanField(read_only=True)
    comments_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Activity
        fields = [
            'id', 'name', 'slug', 'date', 'time',
            'summary', 'description', 'poster', 'price', 'website',
            'organizer', 'category', 'author',
            'address', 'comments',
            'status', 'views_count',
            'is_free', 'is_upcoming',
            'comments_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'slug', 'author', 'views_count',
            'created_at', 'updated_at'
        ]
    
    def get_comments_count(self, obj):
        """Get active comments count"""
        return obj.comments.filter(is_active=True).count()


class ActivityCreateSerializer(serializers.ModelSerializer):
    """Activity create serializer"""
    organizer_id = serializers.PrimaryKeyRelatedField(
        queryset=Organizer.objects.all(),
        source='organizer',
        write_only=True
    )
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        required=False,
        allow_null=True
    )
    address = ActivityAddressWriteSerializer(required=False)
    
    class Meta:
        model = Activity
        fields = [
            'name', 'date', 'time', 'summary', 'description',
            'poster', 'price', 'website',
            'organizer_id', 'category_id', 'status',
            'address'
        ]
    
    def validate_date(self, value):
        """Check that date is not in the past"""
        if value < timezone.now().date():
            raise serializers.ValidationError("Activity date cannot be in the past.")
        return value
    
    def validate_price(self, value):
        """Check that price is not negative"""
        if value is not None and value < 0:
            raise serializers.ValidationError("Price cannot be negative.")
        return value
    
    def validate_summary(self, value):
        """Validate summary length"""
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Summary must be at least 10 characters long.")
        return value
    
    def validate_description(self, value):
        """Validate description length"""
        if len(value.strip()) < 20:
            raise serializers.ValidationError("Description must be at least 20 characters long.")
        return value
    
    def create(self, validated_data):
        """Create activity with address"""
        address_data = validated_data.pop('address', None)
        
        # Set author from request
        validated_data['author'] = self.context['request'].user
        
        activity = Activity.objects.create(**validated_data)
        
        # Create address if provided
        if address_data:
            longitude = address_data.pop('longitude', None)
            latitude = address_data.pop('latitude', None)
            
            address = ActivityAddress.objects.create(
                activity=activity,
                **address_data
            )
            
            if longitude is not None and latitude is not None:
                address.set_coordinates(longitude, latitude)
                address.save()
        
        return activity


class ActivityUpdateSerializer(serializers.ModelSerializer):
    """Activity update serializer"""
    organizer_id = serializers.PrimaryKeyRelatedField(
        queryset=Organizer.objects.all(),
        source='organizer',
        write_only=True,
        required=False
    )
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = Activity
        fields = [
            'name', 'date', 'time', 'summary', 'description',
            'poster', 'price', 'website',
            'organizer_id', 'category_id', 'status'
        ]
    
    def validate_date(self, value):
        """Check that date is not in the past"""
        if value < timezone.now().date():
            raise serializers.ValidationError("Activity date cannot be in the past.")
        return value
    
    def validate_price(self, value):
        """Check that price is not negative"""
        if value is not None and value < 0:
            raise serializers.ValidationError("Price cannot be negative.")
        return value


# ============================================================================
# MINIMAL SERIALIZERS (for nested use in other apps)
# ============================================================================

class ActivityMinimalSerializer(serializers.ModelSerializer):
    """Minimal activity data for nested use"""
    
    class Meta:
        model = Activity
        fields = ['id', 'name', 'slug', 'date', 'poster']
        read_only_fields = fields


class OrganizerMinimalSerializer(serializers.ModelSerializer):
    """Minimal organizer data for nested use"""
    
    class Meta:
        model = Organizer
        fields = ['id', 'name', 'slug']
        read_only_fields = fields