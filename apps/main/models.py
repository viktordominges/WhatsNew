from django.contrib.gis.db import models as gis_models
from django.contrib.gis.geos import Point

from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.urls import reverse
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.db.models import F, Count, Avg
from unidecode import unidecode


class Category(models.Model):
    """
    Модель категории для мероприятий.
    """
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
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

    @property
    def activities_count(self):
        """Количество мероприятий в категории"""
        return self.activities.filter(status='published').count()


class Organizer(models.Model):
    """
    Модель организатора мероприятий.
    Может быть связан с пользователем или существовать независимо.
    """
    # Основная информация
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)

    # Описание и медиа
    description = models.TextField(blank=True, help_text='About the organizer')
    logo = models.ImageField(upload_to='organizers/logos/', blank=True, null=True)
    
    # Контактная информация
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=300, blank=True)
    website = models.URLField(max_length=200, blank=True, null=True)
    
    # Связь с пользователем (опционально)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='organizer_profile',
        help_text='Link to user account if organizer is registered'
    )
    
    # Верификация
    is_verified = models.BooleanField(
        default=False,
        help_text='Verified organizer badge'
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    
    # Метаданные
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'organizers'
        verbose_name = 'Organizer'
        verbose_name_plural = 'Organizers'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_verified']),
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        verified_badge = "✓" if self.is_verified else ""
        return f"{self.name} {verified_badge}".strip()
    
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
    
    @property
    def activities_count(self):
        """Количество мероприятий организатора"""
        return self.activities.filter(status='published').count()
    
    @property
    def upcoming_activities_count(self):
        """Количество предстоящих мероприятий"""
        return self.activities.filter(
            status='published',
            date__gte=timezone.now().date()
        ).count()
    
    @property
    def total_views(self):
        """Общее количество просмотров всех мероприятий"""
        return self.activities.aggregate(
            total=models.Sum('views_count')
        )['total'] or 0
    
    def verify(self):
        """Верифицировать организатора"""
        self.is_verified = True
        self.verified_at = timezone.now()
        self.save(update_fields=['is_verified', 'verified_at'])
        
    def unverify(self):
        """Снять верификацию организатора"""
        self.is_verified = False
        self.verified_at = None
        self.save(update_fields=['is_verified', 'verified_at'])


class PublishedActivityManager(models.Manager):
    """Manager для получения только опубликованных мероприятий"""
    def get_queryset(self):
        return super().get_queryset().filter(status='published')


class Activity(models.Model):
    """
    Модель мероприятия.
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]
    
    # Информация о мероприятии
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    date = models.DateField()
    time = models.TimeField()
    summary = models.CharField(
        max_length=300,
        help_text='Short description (max 300 characters)'
    )
    description = models.TextField()
    poster = models.ImageField(
        upload_to='activities/posters/',
        blank=True,
        null=True,
        help_text='Main poster image'
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Leave empty for free events'
    )
    website = models.URLField(max_length=200, blank=True, null=True)
    
    # Связи
    organizer = models.ForeignKey(
        Organizer,
        on_delete=models.CASCADE,
        related_name='activities',
        help_text='Event organizer'
    )
    
    category = models.ForeignKey(
        'Category',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='activities'
    )
    
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_activities',
        help_text='User who created this activity'
    )
    
    # Метаданные
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='draft'  # Изменил на draft по умолчанию
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views_count = models.PositiveIntegerField(default=0)

    # Managers
    objects = models.Manager()
    published = PublishedActivityManager()

    class Meta:
        db_table = 'activities'
        verbose_name = 'Activity'
        verbose_name_plural = 'Activities'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['category', '-created_at']),
            models.Index(fields=['author', '-created_at']),
            models.Index(fields=['organizer', '-created_at']),
            models.Index(fields=['date']),
        ]

    def __str__(self):
        return self.name
    def clean(self):
        """Валидация полей модели"""
        super().clean()
        
        # Проверка что дата мероприятия не в прошлом (только для новых)
        if not self.pk and self.date and self.date < timezone.now().date():
            raise ValidationError({
                'date': 'Activity date cannot be in the past.'
            })
        
        # Проверка что цена не отрицательная
        if self.price and self.price < 0:
            raise ValidationError({
                'price': 'Price cannot be negative.'
            })

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(unidecode(self.name))
            slug = base_slug
            counter = 1
            
            while Activity.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            
            self.slug = slug
        
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('activity-detail', kwargs={'slug': self.slug})
    
    @property
    def primary_address(self):
        """Получить основной адрес мероприятия"""
        return self.addresses.first()
    
    @property
    def location_coordinates(self):
        """Получить координаты для карты"""
        address = self.primary_address
        return address.coordinates if address else None

    @property
    def comments_count(self):
        """Количество комментариев к мероприятию"""
        return self.comments.filter(is_active=True).count()

    @property
    def is_upcoming(self):
        """Проверяет, является ли мероприятие предстоящим"""
        return self.date >= timezone.now().date()

    @property
    def is_past(self):
        """Проверяет, прошло ли мероприятие"""
        return self.date < timezone.now().date()

    @property
    def days_until_event(self):
        """Количество дней до мероприятия"""
        delta = self.date - timezone.now().date()
        return delta.days if delta.days >= 0 else 0

    @property
    def is_free(self):
        """Проверяет, бесплатное ли мероприятие"""
        return self.price is None or self.price == 0
    
    @property
    def organizer_contact(self):
        """Быстрый доступ к контактам организатора"""
        return {
            'name': self.organizer.name,
            'email': self.organizer.email,
            'phone': self.organizer.phone,
            'website': self.organizer.website,
        }

    def increment_views(self):
        """Увеличивает счетчик просмотров мероприятия на 1 (thread-safe)"""
        Activity.objects.filter(pk=self.pk).update(views_count=F('views_count') + 1)
        self.refresh_from_db(fields=['views_count'])


class ActivityPhoto(models.Model):
    """
    Модель для хранения дополнительных фотографий мероприятия.
    """
    activity = models.ForeignKey(
        Activity,
        on_delete=models.CASCADE,
        related_name='photos'
    )
    image = models.ImageField(upload_to='activities/photos/')
    caption = models.CharField(max_length=200, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    order = models.PositiveIntegerField(default=0, help_text='Display order')

    class Meta:
        db_table = 'activity_photos'
        verbose_name = 'Activity Photo'
        verbose_name_plural = 'Activity Photos'
        ordering = ['order', 'uploaded_at']

    def __str__(self):
        return f"Photo for {self.activity.name}"
    

class ActivityAddress(gis_models.Model):
    """
    Модель для хранения адреса и геолокации мероприятия.
    Поддерживает как текстовый адрес, так и координаты на карте.
    """
    activity = gis_models.ForeignKey(
        'Activity',  # Используйте строку если Activity объявлена после
        on_delete=models.CASCADE,
        related_name='addresses'
    )
    
    # Адресные поля
    address = gis_models.CharField(
        max_length=300,
        help_text='Street address (e.g., 123 Main Street)'
    )
    city = gis_models.CharField(max_length=100, blank=True)
    country = gis_models.CharField(max_length=100, default='Belgium')
    postcode = gis_models.CharField(max_length=20, blank=True)
    
    # Географическое поле (основное хранилище координат)
    location = gis_models.PointField(
        geography=True,
        null=True,
        blank=True,
        help_text='Geographic point (longitude, latitude)'
    )
    
    # Метаданные
    created_at = gis_models.DateTimeField(auto_now_add=True)
    updated_at = gis_models.DateTimeField(auto_now=True)
    
    # Дополнительное поле для фронтенда с названием помещения в котором проводится мероприятие 
    place_name = gis_models.CharField(
        max_length=200,
        blank=True,
        help_text='Name of the venue/place (optional)'
    )
    
    class Meta:
        db_table = 'activity_addresses'
        verbose_name = 'Activity Address'
        verbose_name_plural = 'Activity Addresses'
        ordering = ['-created_at']
        indexes = [
            gis_models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        parts = []
        if self.place_name:
            parts.append(self.place_name)
        if self.address:
            parts.append(self.address)
        if self.city:
            parts.append(self.city)
        if self.postcode:
            parts.append(self.postcode)
        if self.country:
            parts.append(self.country)
        
        return ', '.join(parts) if parts else 'No address provided'
    
    def clean(self):
        """Валидация: должен быть либо адрес, либо координаты"""
        super().clean()
        
        if not self.address and not self.location:
            raise ValidationError(
                'Either address or location coordinates must be provided.'
            )
    
    @property
    def latitude(self):
        """Получить широту из PointField"""
        return self.location.y if self.location else None
    
    @property
    def longitude(self):
        """Получить долготу из PointField"""
        return self.location.x if self.location else None
    
    @property
    def coordinates(self):
        """Получить координаты в формате [lng, lat] для фронтенда"""
        if self.location:
            return [self.location.x, self.location.y]
        return None
    
    @property
    def full_address(self):
        """Полный адрес одной строкой"""
        return str(self)
    
    def set_coordinates(self, longitude, latitude):
        """
        Установить координаты из отдельных значений.
        
        Args:
            longitude (float): Долгота (-180 до 180)
            latitude (float): Широта (-90 до 90)
        """
        
        if not (-180 <= longitude <= 180):
            raise ValidationError('Longitude must be between -180 and 180')
        if not (-90 <= latitude <= 90):
            raise ValidationError('Latitude must be between -90 and 90')
        
        self.location = Point(longitude, latitude, srid=4326)
    
    def get_nearby_activities(self, radius_km=10):
        """
        Найти ближайшие мероприятия в радиусе.
        
        Args:
            radius_km (int): Радиус поиска в километрах
            
        Returns:
            QuerySet: Ближайшие мероприятия
        """
        from django.contrib.gis.measure import D
        from django.contrib.gis.db.models.functions import Distance
        
        if not self.location:
            return ActivityAddress.objects.none()
        
        return ActivityAddress.objects.filter(
            location__distance_lte=(self.location, D(km=radius_km))
        ).exclude(
            pk=self.pk
        ).annotate(
            distance=Distance('location', self.location)
        ).order_by('distance')
    
    def distance_to(self, other_address):
        """
        Рассчитать расстояние до другого адреса.
        
        Args:
            other_address (ActivityAddress): Другой адрес
            
        Returns:
            Distance: Расстояние в метрах
        """
        from django.contrib.gis.measure import D
        
        if not self.location or not other_address.location:
            return None
        
        return self.location.distance(other_address.location)
