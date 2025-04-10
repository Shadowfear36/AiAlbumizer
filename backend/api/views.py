from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import RegisterSerializer, UserSerializer
from django.contrib.auth.models import User
from api.models import Photo
from api.serializers import PhotoSerializer, AlbumSerializer, FaceSerializer
import cv2
from retinaface import RetinaFace
from deepface import DeepFace
import os
import numpy as np
from sklearn.cluster import DBSCAN
from api.models import Photo, Album, Face
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from scipy.spatial.distance import cosine
from django.core.files.uploadedfile import InMemoryUploadedFile
import tempfile

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            user_data = UserSerializer(user).data
            response = Response(user_data, status=status.HTTP_201_CREATED)

            response.set_cookie(
                key='access',
                value=access_token,
                httponly=True,
                samesite='Lax',
                max_age=60 * 5,  # 5 minutes
            )
            
            response.set_cookie(
                key='refresh',
                value=refresh_token,
                httponly=True,
                samesite='Lax',
                max_age=60 * 60 * 24 * 7,  # 7 days
            )
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data['access']
            refresh_token = response.data['refresh']

            response.set_cookie(
                key='access',
                value=access_token,
                httponly=True,
                samesite='Lax',
                max_age=60 * 5,
            )
            response.set_cookie(
                key='refresh',
                value=refresh_token,
                httponly=True,
                samesite='Lax',
                max_age=60 * 60 * 24 * 7,
            )
            
            user = User.objects.get(username=request.data['username'])
            user_data = UserSerializer(user).data
            response.data.clear()
            response.data.update(user_data)

        return response
    
class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh = request.COOKIES.get('refresh', None)
        if not refresh:
            return Response({'detail': 'No refresh token in cookies'}, status=status.HTTP_401_UNAUTHORIZED)

        request.data['refresh'] = refresh
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data['access']
            response.set_cookie(
                key='access',
                value=access_token,
                httponly=True,
                samesite='Lax',
                max_age=60 * 5,
            )
            del response.data['access']
        return response

class LogoutView(generics.CreateAPIView):
    def post(self, request):
        response = Response({"detail": "Logged out successfully."}, status=status.HTTP_200_OK)
        response.delete_cookie("access")
        response.delete_cookie("refresh")
        return response

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    

class UploadAndDetect(generics.CreateAPIView):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def perform_create(self, serializer):
        self.photo_instance = serializer.save(user=self.request.user)
        
    def get_existing_embeddings(self, user):
        faces = Face.objects.filter(photo__user=user)
        data = []
        for face in faces:
            embedding = np.frombuffer(face.embedding, dtype=np.float32)
            data.append((face.cluster_id, embedding))
        return data
    
    def find_matching_cluster(self, new_embedding, existing_data, threshold=0.35):
        for cluster_id, existing_emb in existing_data:
            similarity = cosine(new_embedding, existing_emb)
            if similarity < threshold:
                return cluster_id
        return None
    
    def perform_detection_and_save_faces(self, photo, image_path):
        user = photo.user
        face_instances = []

        try:
            img = cv2.imread(image_path)
            results = RetinaFace.detect_faces(image_path)
            embeddings = []
            face_data = []

            for key, face in results.items():
                x1, y1, x2, y2 = face["facial_area"]
                crop = img[y1:y2, x1:x2]

                temp_path = f"{image_path}_face_{key}.jpg"
                cv2.imwrite(temp_path, crop)

                embedding = DeepFace.represent(img_path=temp_path, model_name='ArcFace', enforce_detection=False)[0]["embedding"]
                embeddings.append(embedding)
                face_data.append((crop, [int(x1), int(y1), int(x2 - x1), int(y2 - y1)], embedding))
                os.remove(temp_path)

            if embeddings:
                existing_data = self.get_existing_embeddings(user)
                existing_cluster_ids = set([cid for cid, _ in existing_data])
                max_cluster_id = max(existing_cluster_ids, default=0)

                saved_clusters = set()

                for crop, bbox, embedding in face_data:
                    match_cluster = self.find_matching_cluster(embedding, existing_data)

                    if match_cluster is not None:
                        cluster_id = match_cluster
                    else:
                        max_cluster_id += 1
                        cluster_id = max_cluster_id
                        existing_data.append((cluster_id, np.array(embedding)))

                    album, _ = Album.objects.get_or_create(user=user, cluster_id=cluster_id)

                    if album.thumbnail_data is None:
                        _, img_encoded = cv2.imencode('.jpg', crop)
                        album.thumbnail_data = img_encoded.tobytes()
                        album.save()

                    if cluster_id not in saved_clusters:
                        face = Face.objects.create(
                            photo=photo,
                            bounding_box=bbox,
                            embedding=np.array(embedding).astype(np.float32).tobytes(),
                            cluster_id=cluster_id,
                            album=album
                        )
                        face_instances.append(face)
                        saved_clusters.add(cluster_id)

        except Exception as e:
            print("Face detection error:", str(e))

        return face_instances
            
    def post(self, request, *args, **kwargs):
        uploaded_file: InMemoryUploadedFile = request.FILES.get("image")
        if not uploaded_file:
            return Response({"error": "No image uploaded"}, status=400)
        
        image_bytes = uploaded_file.read()

        photo = Photo.objects.create(user=request.user, image_data=image_bytes)

        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file.write(image_bytes)
            temp_path = temp_file.name

        detected_faces = self.perform_detection_and_save_faces(photo, temp_path)
        
        os.remove(temp_path)

        photo_data = PhotoSerializer(photo).data
        face_data = FaceSerializer(detected_faces, many=True).data

        return Response({
            "photo": photo_data,
            "faces": face_data
        }, status=status.HTTP_201_CREATED)

    
class AlbumListView(generics.ListAPIView):
    serializer_class = AlbumSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Album.objects.filter(user=self.request.user)
    
class AlbumFacesView(generics.ListAPIView):
    serializer_class = FaceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Face.objects.filter(album_id=self.kwargs['album_id'], photo__user=self.request.user)
    
class AlbumUpdateView(generics.UpdateAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Album.objects.filter(user=self.request.user)
    
class UserPhotoListView(generics.ListAPIView):
    serializer_class = PhotoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Photo.objects.filter(user=self.request.user).order_by('-uploaded_at')
    
class FaceDeleteView(generics.DestroyAPIView):
    queryset = Face.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Face.objects.filter(photo__user=self.request.user)
    
class DeletePhotoView(generics.DestroyAPIView):
    queryset = Photo.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        photo_id = kwargs.get('pk')
        try:
            photo = Photo.objects.get(id=photo_id, user=request.user)
            photo.delete()
            return Response({"message": "Photo deleted."}, status=status.HTTP_204_NO_CONTENT)
        except Photo.DoesNotExist:
            return Response({"error": "Photo not found."}, status=status.HTTP_404_NOT_FOUND)