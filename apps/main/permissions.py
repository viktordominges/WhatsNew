# apps/main/permissions.py

from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .models import Activity


class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Permission to only allow authors of an object to edit it.
    Read permissions are allowed to any request.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions (GET, HEAD, OPTIONS) for everyone
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for author
        if hasattr(obj, 'author'):
            return obj.author == request.user
        elif hasattr(obj, 'activity'):
            # For nested objects like photos, comments
            return obj.activity.author == request.user
        
        return False


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission for objects that have 'user' field instead of 'author'.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions for everyone
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for owner
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permission to only allow admins to edit.
    Read permissions are allowed to any request.
    """
    
    def has_permission(self, request, view):
        # Read permissions for everyone
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for staff/admin
        return request.user and request.user.is_staff


class IsActivityAuthor(permissions.BasePermission):
    """
    Check if user is the author of the activity.
    For use in nested viewsets (photos, comments).
    """
    
    def has_permission(self, request, view):
        # Read permissions for everyone
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # For write operations, check if user is authenticated
        if not request.user or not request.user.is_authenticated:
            return False
        
        # For create action, verify activity ownership
        if view.action == 'create':
            activity_slug = view.kwargs.get('activity_slug')
            if activity_slug:
                try:
                    activity = Activity.objects.get(slug=activity_slug)
                    return activity.author == request.user
                except Activity.DoesNotExist:
                    return False
        
        return True
    
    def has_object_permission(self, request, view, obj):
        # Read permissions for everyone
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Check activity author
        if hasattr(obj, 'activity'):
            return obj.activity.author == request.user
        
        return False