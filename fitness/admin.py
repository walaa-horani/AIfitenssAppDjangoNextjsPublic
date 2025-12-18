from django.contrib import admin
from .models import UserProfile, WorkoutPlan, MealPlan, ProgressLog



# Register your models here.
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):

     list_display = ("user", "age", "weight", "height", "gender", "goal", "activity_level")


@admin.register(WorkoutPlan)
class WorkoutPlanAdmin(admin.ModelAdmin):
    list_display = ("user", "created_at")
    search_fields = ("user__username",)


@admin.register(MealPlan)
class MealPlanAdmin(admin.ModelAdmin):
    list_display = ("user", "created_at")
    search_fields = ("user__username",)


@admin.register(ProgressLog)
class ProgressLogAdmin(admin.ModelAdmin):
    list_display = ("user", "date", "weight", "calories", "workouts_done")
    list_filter = ("date",)
    search_fields = ("user__username",)

