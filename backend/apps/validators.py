# backend/apps/validators.py

from rest_framework import serializers


def validate_image_file(value, max_size_mb=5):
    """
    Универсальный валидатор для изображений
    
    Args:
        value: Загружаемый файл
        max_size_mb: Максимальный размер в МБ (по умолчанию 5)
    
    Raises:
        serializers.ValidationError: Если файл не проходит валидацию
    """
    if not value:
        return value
    
    # Проверка размера
    max_size = max_size_mb * 1024 * 1024
    if value.size > max_size:
        raise serializers.ValidationError(
            f"Image size must be less than {max_size_mb}MB. "
            f"Current size: {value.size / (1024*1024):.2f}MB"
        )
    
    # Проверка MIME типа
    allowed_types = [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/gif',
        'image/webp'
    ]
    if value.content_type not in allowed_types:
        raise serializers.ValidationError(
            f"Unsupported file type: {value.content_type}. "
            "Allowed types: JPEG, PNG, GIF, WEBP"
        )
    
    # Проверка расширения (дополнительная защита)
    allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    filename = value.name.lower()
    if not any(filename.endswith(ext) for ext in allowed_extensions):
        raise serializers.ValidationError(
            f"Unsupported file extension. "
            f"Allowed: {', '.join(allowed_extensions)}"
        )
    
    return value