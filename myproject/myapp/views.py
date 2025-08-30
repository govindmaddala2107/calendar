# from django.http import HttpResponse
from django.http import JsonResponse
import json

## CSRF 
# from django.views.decorators.csrf import csrf_exempt


from django.views.decorators.csrf import ensure_csrf_cookie
# from django.middleware.csrf import get_token

# @ensure_csrf_cookie
# def get_csrf_token(request):
#     return JsonResponse({"detail": "CSRF cookie set"})

from django.middleware.csrf import get_token

@ensure_csrf_cookie
def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({"csrfToken": token})

    
def home(request):
    return HttpResponse("Hello, Django! 🚀")

# @csrf_exempt
def validate_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    try:
        # Parse JSON body
        body = json.loads(request.body.decode("utf-8"))
        print("body: ", body)
        username = body.get("username", "")
        password = body.get("password", "")
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    # Validation rules
    if len(username) < 3:
        return JsonResponse({"error": "Username must be at least 3 characters"}, status=400)
    if len(password) < 6:
        return JsonResponse({"error": "Password must be at least 6 characters"}, status=400)

    # ✅ If everything fine
    return JsonResponse({"success": True})