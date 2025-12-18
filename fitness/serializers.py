from rest_framework import serializers

from .models import MealPlan, ProgressLog, UserProfile, WorkoutPlan
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class UserProfileSerializer(serializers.ModelSerializer):
      user = UserSerializer(read_only=True)    

      class Meta:
        model = UserProfile
        fields = '__all__'  

        extra_kwargs = {
            "user": {"read_only": True},
        }


class WorkoutPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutPlan
        fields = '__all__'


class MealPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealPlan
        fields = '__all__'


class ProgressLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressLog
        fields = '__all__'  
        read_only_fields = ("user",)      

