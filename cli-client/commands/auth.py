import os

TOKEN_FILE = "token.txt"  # Τοπική αποθήκευση του token

def get_token():
    """Διαβάζει το αποθηκευμένο token από το αρχείο."""
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, "r") as f:
            return f.read().strip()
    return None
