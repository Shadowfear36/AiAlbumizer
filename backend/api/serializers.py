from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import Photo, Album, Face
import base64
from base64 import b64encode

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined']
        
class PhotoSerializer(serializers.ModelSerializer):
    image_base64 = serializers.SerializerMethodField()

    class Meta:
        model = Photo
        fields = ['id', 'uploaded_at', 'image_base64']

    def get_image_base64(self, obj):
        if obj.image_data:
            return f"data:image/jpeg;base64,{base64.b64encode(obj.image_data).decode()}"
        return None
        
class AlbumSerializer(serializers.ModelSerializer):
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = ['id', 'cluster_id', 'name', 'thumbnail_url']

    def get_thumbnail_url(self, obj):
        if obj.thumbnail_data:
            return f"data:image/jpeg;base64,{b64encode(obj.thumbnail_data).decode()}"
        return None
    
class FaceSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Face
        fields = ['id', 'bounding_box', 'cluster_id', 'photo_url']

    def get_photo_url(self, obj):
        if obj.photo and obj.photo.image_data:
            return f"data:image/jpeg;base64,{base64.b64encode(obj.photo.image_data).decode()}"
        return None
