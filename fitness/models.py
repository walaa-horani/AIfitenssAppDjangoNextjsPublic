from django.db import models
from django.contrib.auth.models import User




class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.IntegerField()
    weight = models.FloatField()
    height = models.FloatField()
    gender = models.CharField(max_length=10)
    goal = models.CharField(max_length=50)
    activity_level = models.CharField(max_length=50)


    def __str__(self):
        return self.user.username

        
class WorkoutPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plan_json = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"WorkoutPlan - {self.user.username}"



class MealPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    meals_json = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"MealPlan - {self.user.username}"



class ProgressLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    weight = models.FloatField(null=True, blank=True)
    calories = models.IntegerField(null=True, blank=True)
    workouts_done = models.IntegerField(default=0)

    def __str__(self):
        return f"Progress - {self.user.username} - {self.date}"



# Create your models here.
