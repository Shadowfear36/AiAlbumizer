from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from api.views import RegisterView, UserListView, UploadAndDetect, AlbumListView, AlbumFacesView, CookieTokenRefreshView, CookieTokenObtainPairView, LogoutView, UserPhotoListView, AlbumUpdateView, FaceDeleteView, DeletePhotoView

urlpatterns = [
    path('token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('upload/', UploadAndDetect.as_view(), name='upload-and-detect'),
    path('albums/', AlbumListView.as_view(), name='album-list'),
    path('albums/<int:album_id>/faces/', AlbumFacesView.as_view(), name='album-faces'),
    path("albums/<int:pk>/", AlbumUpdateView.as_view(), name="album-update"),
    path('photos/', UserPhotoListView.as_view(), name='photo-list'),
    path('photos/<int:pk>/', DeletePhotoView.as_view(), name='delete-photo'),
    path('faces/<int:pk>/', FaceDeleteView.as_view(), name='face-delete'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
