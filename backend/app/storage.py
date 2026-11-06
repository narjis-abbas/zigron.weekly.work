import json
from pathlib import Path

DATA_FILE = Path("data/students.txt")


def _ensure_file() -> None:
    """Create the data folder and students.txt if they don't exist."""
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    if not DATA_FILE.exists():
        DATA_FILE.write_text("", encoding="utf-8")


def load_students() -> list[dict]:
    """Read all students from the file (one JSON object per line)."""
    _ensure_file()
    students = []
    with open(DATA_FILE, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                students.append(json.loads(line))
    return students


def save_students(students: list[dict]) -> None:
    """Write all students back to the file."""
    _ensure_file()
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        for student in students:
            f.write(json.dumps(student) + "\n")



def edit_students(students: list[dict]) -> None:
    """Update all students"""
    _ensure_file()
    with open(DATA_FILE, "w", encoding="utf-8") as f:
            for student in students:
                f.write(json.dumps(student) + "\n")
    
    
