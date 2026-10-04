import re


def sanitize_input(text: str) -> str:
    """Strip dangerous characters or excess whitespace from user queries."""
    if not text:
        return ""
    # Strip null bytes and normalize line breaks
    cleaned = text.replace("\x00", "").strip()
    return cleaned


def mask_secret(secret: str) -> str:
    """Mask sensitive keys for logging or error reporting."""
    if not secret or len(secret) < 8:
        return "***"
    return f"{secret[:4]}...{secret[-4:]}"
