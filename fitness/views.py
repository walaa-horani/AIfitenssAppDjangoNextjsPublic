from django.conf import settings
from django.contrib.auth.models import User
from openai import OpenAI
import os
import json
import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions, viewsets
from rest_framework.response import Response

from fitness.openrouter import call_openrouter
from fitness.serializers import MealPlanSerializer, ProgressLogSerializer, UserProfileSerializer, WorkoutPlanSerializer
from .models import MealPlan, ProgressLog, UserProfile, WorkoutPlan

# Remove module-level client initialization to prevent startup errors
# client = OpenAI(api_key=settings.OPENAI_API_KEY)


def save_exercise_image(image_data, exercise_name):
    """Save image bytes to file and return absolute URL"""
    exercises_path = os.path.join(settings.MEDIA_ROOT, "exercises")
    os.makedirs(exercises_path, exist_ok=True)
    
    # Clean filename
    filename = exercise_name.replace(" ", "_").lower()
    filename = "".join(c for c in filename if c.isalnum() or c == "_") + ".png"
    
    # Save file
    with open(os.path.join(exercises_path, filename), "wb") as f:
        f.write(image_data)
    
    return f"https://aifitnessappnew.pythonanywhere.com/media/exercises/{filename}"


def generate_thumbnail(exercise_name):
    """Generate AI image for exercise"""
    
    # Initialize client here to handle missing API key gracefully
    api_key = settings.OPENAI_API_KEY
    if not api_key:
        print(f"⚠️ Warning: OPENAI_API_KEY is missing. Skipping image generation for {exercise_name}.")
        return None  # Or return a placeholder URL

    try:
        client = OpenAI(api_key=api_key)
        prompt = f"A person doing {exercise_name} exercise, gym setting, clean illustration style"
        
        # Generate with DALL-E
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1
        )
    except Exception as e:
        print(f"❌ OpenAI Error in generate_thumbnail: {e}")
        return None
    
    if not response:
        return None

    # Download and save image
    try:
        image_url = response.data[0].url
        img_response = requests.get(image_url, timeout=30)
        img_response.raise_for_status()
        
        return save_exercise_image(img_response.content, exercise_name)
    except Exception as e:
        print(f"❌ Error saving image: {e}")
        return None


# ================== WORKOUT GENERATION ==================

def parse_workout_json(raw_response):
    """Clean and parse AI response into JSON"""
    raw = raw_response.strip()
    
    # Remove markdown code blocks
    if raw.startswith("```json"):
        raw = raw[7:]
    if raw.startswith("```"):
        raw = raw[3:]
    if raw.endswith("```"):
        raw = raw[:-3]
    
    return json.loads(raw.strip())


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def generate_workout(request):
    print("🏋️  Starting workout generation...")
    
    # Get user profile
    try:
        profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        return Response({"error": "User profile not found"}, status=404)
    
    # Generate workout plan with AI
    prompt = f"""
Create a JSON structured 4-day workout plan for:
Age: {profile.age}, Weight: {profile.weight}, Height: {profile.height}
Gender: {profile.gender}, Goal: {profile.goal}, Activity: {profile.activity_level}

FORMAT: [
  {{"day": "Day 1", "exercises": [{{"name": "Bench Press", "sets": 4, "reps": 10, "rest": 90}}]}}
]

JSON ONLY — NO explanations, no markdown, no backticks.
"""
    
    # Parse AI response
    try:
        raw_response = call_openrouter(prompt)
        workout_days = parse_workout_json(raw_response)
    except json.JSONDecodeError as e:
        return Response({"error": "AI did not return valid JSON", "details": str(e)}, status=400)
    
    # Get unique exercises
    unique_exercises = set()
    for day in workout_days:
        for exercise in day.get("exercises", []):
            unique_exercises.add(exercise["name"])
    
    print(f"📋 Found {len(unique_exercises)} unique exercises")
    
    # Generate images for first 6 exercises
    exercise_images = {}
    for i, exercise_name in enumerate(list(unique_exercises)[:6], 1):
        try:
            print(f"[{i}/6] Generating image: {exercise_name}")
            exercise_images[exercise_name] = generate_thumbnail(exercise_name)
        except Exception as e:
            print(f"❌ Failed: {e}")
    
    if not exercise_images:
        return Response({"error": "Failed to generate any images"}, status=500)
    
    # Assign images to exercises
    placeholder = list(exercise_images.values())[0]
    for day in workout_days:
        for exercise in day.get("exercises", []):
            exercise["image"] = exercise_images.get(exercise["name"], placeholder)
    

    WorkoutPlan.objects.update_or_create(
        user=request.user,
        defaults={"plan_json": workout_days}
    )
    print("🎉 Workout generation complete!")
    return Response({"plan": workout_days})

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def generate_meal_plan(request):
    profile = UserProfile.objects.get(user=request.user)

    prompt = f"""
    Create a JSON structured daily meal plan.
    User details:
    Age: {profile.age}
    Weight: {profile.weight}
    Height: {profile.height}
    Goal: {profile.goal}
    Gender: {profile.gender}
    FORMAT EXAMPLE:
    [
      {{
        "name": "Breakfast",
        "calories": 450,
        "protein": 25,
        "carbs": 40,
        "fats": 15
      }},
      {{
        "name": "Lunch",
        "calories": 600,
        "protein": 35,
        "carbs": 55,
        "fats": 20
      }}
    ]

    JSON ONLY. NO MARKDOWN. NO ``` . NO TEXT.


    """

    result = call_openrouter(prompt)

    cleaned = result.replace("```json", "").replace("```", "").strip()
   

    try:
        meals = json.loads(result)
    except Exception as e:
        return Response({
            "error": "AI returned invalid JSON",
            "result": cleaned
        }, status=400)


    MealPlan.objects.update_or_create(
        user=request.user,
        defaults={"meals_json": meals}
    )    
    return Response({"meals": meals})    



@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])

def ai_chat(request):
    user_msg = request.data.get("message")

    prompt = f"""
    You are an AI fitness coach.
    User says: {user_msg}
    Respond helpful and personalized.
    """

    answer = call_openrouter(prompt)
    return Response({"reply": answer})
class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes =  [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user = self.request.user)


      
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class WorkoutPlanViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WorkoutPlan.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user) 



class MealPlanViewSet(viewsets.ModelViewSet):
    serializer_class = MealPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MealPlan.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class ProgressLogViewSet(viewsets.ModelViewSet):
    serializer_class = ProgressLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProgressLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def register(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    user = User.objects.create_user(username=username, password=password)

    return Response({"message": "User registered successfully"}, status=201)

# Create your views here.


