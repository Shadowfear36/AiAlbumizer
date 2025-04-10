from django.db import models
from django.contrib.auth.models import User

class Photo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image_data = models.BinaryField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

class Album(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, null=True, blank=True)
    cluster_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    thumbnail_data = models.BinaryField(null=True, blank=True)

class Face(models.Model):
    photo = models.ForeignKey(Photo, on_delete=models.CASCADE)
    bounding_box = models.JSONField()
    embedding = models.BinaryField()
    cluster_id = models.IntegerField(null=True)
    album = models.ForeignKey(Album, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Face in cluster {self.cluster_id} ({self.album.name if self.album else 'Unlabeled'})"
