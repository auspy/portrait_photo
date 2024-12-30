"""
Rate limiting service using Upstash Ratelimit
"""

from typing import Optional, Tuple, Dict, Any
from upstash_ratelimit import Ratelimit, SlidingWindow
from upstash_redis import Redis
from ..utils.error_handler import rate_limit_error, AppError
from ..core.settings import settings

# Initialize rate limiter with sliding window algorithm
# Using sliding window for better request distribution and reduced boundary issues
ratelimit = Ratelimit(
    redis=Redis(
        url=settings.UPSTASH_REDIS_REST_URL, token=settings.UPSTASH_REDIS_REST_TOKEN
    ),
    limiter=SlidingWindow(
        max_requests=settings.FREE_RATE_LIMIT,
        window=settings.FREE_RATE_WINDOW,
    ),
    prefix="portrait_photo_free",
)

# Pro user rate limiter with higher limits
pro_ratelimit = Ratelimit(
    redis=Redis(
        url=settings.UPSTASH_REDIS_REST_URL, token=settings.UPSTASH_REDIS_REST_TOKEN
    ),
    limiter=SlidingWindow(
        max_requests=settings.PRO_RATE_LIMIT,
        window=settings.PRO_RATE_WINDOW,
    ),
    prefix="portrait_photo_pro",
)


def get_rate_limiter(plan: str = "free") -> Ratelimit:
    """Get appropriate rate limiter based on plan"""
    return pro_ratelimit if plan == "pro" else ratelimit


def get_identifier(user_id: str, plan: str = "free") -> str:
    """Get identifier for rate limiter"""
    return f"user_{user_id}_{plan}"


def check_rate_limit(user_id: str, plan: str = "free") -> Dict[str, Any]:
    """
    Check if user has exceeded their rate limit
    Returns: Dictionary with rate limit info
    """
    if plan == "pro":
        return {"remaining": float("inf"), "plan": plan}

    limiter = get_rate_limiter(plan)
    identifier = get_identifier(user_id, plan)
    remaining = limiter.get_remaining(identifier)
    print(f"Remaining: {remaining}, plan: {plan}, user_id: {user_id}")
    return {
        "remaining": remaining,
        "plan": plan,
    }


def consume_rate_limit(user_id: str, plan: str = "free") -> bool:
    """
    Consume a rate limit token
    Returns: True if successful, False if rate limited
    """
    if plan == "pro":
        return True

    limiter = get_rate_limiter(plan)
    identifier = get_identifier(user_id, plan)
    response = limiter.limit(identifier)
    print(f"Response: {response}, plan: {plan}, user_id: {user_id}")
    return response


def validate_auth_header(auth_header: Optional[str]) -> Tuple[str, str]:
    """Validate auth header and extract user_id and plan"""
    if not auth_header or not auth_header.startswith("Bearer "):
        raise rate_limit_error("Unauthorized", "Invalid authorization header")

    key = auth_header.split("Bearer ")[1]
    user_id, plan = key.split("|")
    return user_id, plan
