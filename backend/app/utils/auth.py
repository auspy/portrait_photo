import jwt
from typing import Tuple
from ..core.settings import settings


def verify_token(auth_header: str) -> Tuple[str, str]:
    """
    Verify JWT token and return user_id and plan
    """
    if not auth_header or not auth_header.startswith("Bearer "):
        raise ValueError("Invalid authorization header")

    token = auth_header.split("Bearer ")[1]

    try:
        # Verify the token
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )

        user_id = payload.get("userId")
        plan = payload.get("plan", "free")

        if not user_id:
            raise ValueError("Invalid token payload")

        return user_id, plan

    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")
    except Exception as e:
        raise ValueError(f"Token verification failed: {str(e)}")
