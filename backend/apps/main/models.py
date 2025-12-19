# apps/main/models.py

# from django.contrib.gis.db import models as gis_models
# from django.contrib.gis.geos import Point

from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.urls import reverse
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.db.models import F
from unidecode import unidecode
 

class Category(models.Model):
    """Category for activities"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    image = models.FileField(upload_to='categories/', blank=True, null=True)  # <--- FileField
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'categories'
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(unidecode(self.name))
            slug = base_slug
            counter = 1
            
            while Category.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            
            self.slug = slug
        super().save(*args, **kwargs)


class Organizer(models.Model):
    """Event organizer"""
    # Basic info
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    
    # Contact info
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    website = models.URLField(max_length=200, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'organizers'
        verbose_name = 'Organizer'
        verbose_name_plural = 'Organizers'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(unidecode(self.name))
            slug = base_slug
            counter = 1
            
            while Organizer.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            
            self.slug = slug
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('organizer-detail', kwargs={'slug': self.slug})

class Activity(models.Model):
    """Activity/Event model"""
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]
    
    # Basic info
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, blank=True, unique=True)
    date = models.DateField()
    time = models.TimeField()
    summary = models.CharField(max_length=300)
    description = models.TextField()
    poster = models.ImageField(
        upload_to='activities/posters/',
        blank=True,
        null=True
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Leave empty for free events'
    )
    website = models.URLField(max_length=200, blank=True)
    
    # Relations
    organizer = models.ForeignKey(
        Organizer,
        on_delete=models.CASCADE,
        related_name='activities'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='activities'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_activities'
    )
    
    # Metadata
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='draft'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views_count = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'activities'
        verbose_name = 'Activity'
        verbose_name_plural = 'Activities'
        ordering = ['-date', '-created_at']
        
        indexes = [
            models.Index(fields=['-date', '-created_at']),
            models.Index(fields=['status', '-date']),
            models.Index(fields=['category', '-date']),
            models.Index(fields=['organizer', '-date']),
        ]

    def __str__(self):
        return self.name
    
    def clean(self):
        """Validation"""
        super().clean()
        
        # Date validation
        if self.date and self.date < timezone.now().date():
            raise ValidationError({
                'date': 'Activity date cannot be in the past.'
            })
        
        # Price validation
        if self.price is not None and self.price < 0:
            raise ValidationError({
                'price': 'Price cannot be negative.'
            })

    def save(self, *args, **kwargs):
        """Save with slug generation and validation"""
        # ✅ ДОБАВЛЕНО: Вызываем валидацию перед сохранением
        # Пропускаем валидацию только при миграциях/фикстурах
        if not kwargs.pop('skip_validation', False):
            self.full_clean()
        
        # Generate slug if not exists
        if not self.slug:
            base_slug = slugify(unidecode(self.name))
            slug = base_slug
            counter = 1
            
            while Activity.objects.filter(
                slug=slug, 
                organizer=self.organizer
            ).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            
            self.slug = slug
        
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('activity-detail', kwargs={'slug': self.slug})
    
    @property
    def is_free(self):
        """Check if activity is free"""
        return self.price is None or self.price == 0
    
    @property
    def is_upcoming(self):
        """Check if activity is upcoming"""
        return self.date >= timezone.now().date()

    def increment_views(self):
        Activity.objects.filter(pk=self.pk).update(views_count=F('views_count') + 1)
        self.refresh_from_db(fields=['views_count'])



# class ActivityAddress(gis_models.Model):
#     """
#     Single address and location for activity.
#     One-to-one relationship with Activity.
#     """
#     activity = gis_models.OneToOneField(
#         Activity,
#         on_delete=gis_models.CASCADE,
#         related_name='address',
#         primary_key=True
#     )
    
#     # Address fields
#     place_name = gis_models.CharField(
#         max_length=200,
#         blank=True,
#         help_text='Venue name'
#     )
#     address = gis_models.CharField(max_length=300)
#     city = gis_models.CharField(max_length=100, blank=True)
#     postcode = gis_models.CharField(max_length=20, blank=True)
#     country = gis_models.CharField(max_length=100, default='Belgium')
    
#     # Geographic coordinates
#     location = gis_models.PointField(
#         geography=True,
#         null=True,
#         blank=True,
#         help_text='Geographic point (longitude, latitude)'
#     )
    
#     # Metadata
#     created_at = gis_models.DateTimeField(auto_now_add=True)
#     updated_at = gis_models.DateTimeField(auto_now=True)
    
#     class Meta:
#         db_table = 'activity_addresses'
#         verbose_name = 'Activity Address'
#         verbose_name_plural = 'Activity Addresses'
    
#     def __str__(self):
#         parts = [p for p in [
#             self.place_name,
#             self.address,
#             self.city,
#             self.postcode,
#             self.country
#         ] if p]
#         return ', '.join(parts) if parts else 'No address'
    
#     def clean(self):
#         """Validation: must have address or coordinates"""
#         super().clean()
#         if not self.address and not self.location:
#             raise ValidationError(
#                 'Either address or location coordinates must be provided.'
#             )
    
#     # ✅ ДОБАВЛЕНО: Вызываем валидацию перед сохранением
#     def save(self, *args, **kwargs):
#         """Save with validation"""
#         if not kwargs.pop('skip_validation', False):
#             self.full_clean()
#         super().save(*args, **kwargs)
    
#     @property
#     def latitude(self):
#         """Get latitude from PointField"""
#         return self.location.y if self.location else None
    
#     @property
#     def longitude(self):
#         """Get longitude from PointField"""
#         return self.location.x if self.location else None
    
#     @property
#     def coordinates(self):
#         """Get coordinates as [lng, lat] for frontend"""
#         if self.location:
#             return [self.location.x, self.location.y]
#         return None
    
#     def set_coordinates(self, longitude, latitude):
#         """
#         Set coordinates from separate values.
        
#         Args:
#             longitude (float): Longitude (-180 to 180)
#             latitude (float): Latitude (-90 to 90)
        
#         Raises:
#             ValueError: If coordinates are out of range
#         """
#         if not (-180 <= longitude <= 180):
#             raise ValueError('Longitude must be between -180 and 180')
#         if not (-90 <= latitude <= 90):
#             raise ValueError('Latitude must be between -90 and 90')
        
#         self.location = Point(longitude, latitude, srid=4326)
        
        
class Comment(models.Model):
    """Comments for activities"""
    activity = models.ForeignKey(
        Activity,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='activity_comments'
    )
    text = models.TextField(max_length=1000)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'activity_comments'
        verbose_name = 'Comment'
        verbose_name_plural = 'Comments'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['activity', '-created_at']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"Comment by {self.author.username} on {self.activity.name}"
