from django.urls import path
from rest_framework.routers import DefaultRouter

from fitness.views import MealPlanViewSet, ProgressLogViewSet, UserProfileViewSet, WorkoutPlanViewSet, ai_chat, generate_meal_plan, generate_workout, register


router = DefaultRouter()
router.register(r'profile', UserProfileViewSet, basename='profile')
router.register(r'meal-plans', MealPlanViewSet,  basename='mealplan')
router.register(r'workout-plans', WorkoutPlanViewSet, basename='workoutplan')
router.register(r'progress', ProgressLogViewSet,basename='progress')


urlpatterns = [
    path('generate-workout/', generate_workout),
    path('generate-meal-plan/', generate_meal_plan),
    path('chat/', ai_chat),
    path("register/", register),
]
urlpatterns += router.urls