from enum import Enum
from typing import Optional, Dict, Any
from fastapi import HTTPException
from fastapi.responses import JSONResponse


class ErrorType(str, Enum):
    VALIDATION_ERROR = "VALIDATION_ERROR"
    PROCESSING_ERROR = "PROCESSING_ERROR"
    FILE_ERROR = "FILE_ERROR"
    SERVER_ERROR = "SERVER_ERROR"
    NOT_FOUND = "NOT_FOUND"
    RATE_LIMIT_ERROR = "RATE_LIMIT_ERROR"
    UNAUTHORIZED = "UNAUTHORIZED"


class AppError(HTTPException):
    def __init__(
        self,
        error_type: ErrorType,
        message: str,
        status_code: int,
        details: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ):
        self.error_type = error_type
        self.details = details
        self.metadata = metadata or {}
        super().__init__(
            status_code=status_code,
            detail={
                "type": error_type,
                "message": message,
                "details": details,
                "metadata": self.metadata,
            },
        )


def unauthorized_error(message: str, details: Optional[str] = None) -> AppError:
    return AppError(
        error_type=ErrorType.UNAUTHORIZED,
        message=message,
        status_code=401,
        details=details,
    )


def validation_error(message: str, details: Optional[str] = None) -> AppError:
    return AppError(
        error_type=ErrorType.VALIDATION_ERROR,
        message=message,
        status_code=400,
        details=details,
    )


def processing_error(message: str, details: Optional[str] = None) -> AppError:
    return AppError(
        error_type=ErrorType.PROCESSING_ERROR,
        message=message,
        status_code=500,
        details=details,
    )


def file_error(message: str, details: Optional[str] = None) -> AppError:
    return AppError(
        error_type=ErrorType.FILE_ERROR,
        message=message,
        status_code=400,
        details=details,
    )


def server_error(
    message: str = "Internal server error", details: Optional[str] = None
) -> AppError:
    return AppError(
        error_type=ErrorType.SERVER_ERROR,
        message=message,
        status_code=500,
        details=details,
    )


def not_found_error(message: str, details: Optional[str] = None) -> AppError:
    return AppError(
        error_type=ErrorType.NOT_FOUND,
        message=message,
        status_code=404,
        details=details,
    )


def rate_limit_error(message: str, details: Optional[str] = None) -> AppError:
    return AppError(
        error_type=ErrorType.RATE_LIMIT_ERROR,
        message=message,
        status_code=429,
        details=details,
    )


def create_error_response(
    status_code: int, error_type: str, message: str, details: any = None
) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"type": error_type, "message": message, "details": details},
    )


def file_error(message: str, details: any = None) -> HTTPException:
    return HTTPException(
        status_code=400,
        detail=create_error_response(400, "FILE_ERROR", message, details).body,
    )


def processing_error(message: str, details: any = None) -> HTTPException:
    return HTTPException(
        status_code=500,
        detail=create_error_response(500, "PROCESSING_ERROR", message, details).body,
    )


def validation_error(message: str, details: any = None) -> HTTPException:
    return HTTPException(
        status_code=400,
        detail=create_error_response(400, "VALIDATION_ERROR", message, details).body,
    )


def rate_limit_error(message: str, details: any = None) -> HTTPException:
    return HTTPException(
        status_code=429,
        detail=create_error_response(429, "RATE_LIMIT_ERROR", message, details).body,
    )
