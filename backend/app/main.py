from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from app.models import StudentCreate, StudentOut
from app.storage import load_students, save_students
from app.models import StudentUpdate

app = FastAPI(
    title="Hiraiable",
    description="Students currently in the bootcamp",
    version="1.0",
)

origin = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
     "http://127.0.0.1:3000",
     "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origin,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def home():
    return {"app": "Hiraiable", "message": "Welcome to the bootcamp student tracker"}


@app.get("/students", response_model=list[StudentOut])
def list_students():
    return load_students()


@app.get("/students/{student_id}", response_model=StudentOut)
def get_student(student_id: int):
    for student in load_students():
        if student["id"] == student_id:
            return student
    raise HTTPException(status_code=404, detail=f"Student {student_id} not found")


@app.post("/students", status_code=status.HTTP_201_CREATED, response_model=StudentOut)
def create_student(student: StudentCreate):
    students = load_students()
    new_id = max((s["id"] for s in students), default=0) + 1
    new_student = {"id": new_id, **student.model_dump()}
    students.append(new_student)
    save_students(students)
    return new_student


@app.delete("/students/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(student_id: int):
    students = load_students()
    remaining = [s for s in students if s["id"] != student_id]
    if len(remaining) == len(students):
        raise HTTPException(status_code=404, detail=f"Student {student_id} not found")
    save_students(remaining)


# 1. Edit ke liye hamesha @app.patch ya @app.put use hota hai
@app.patch("/students/{student_id}")
def edit_student(student_id: int, student_data: dict):
    students = load_students()
    
    for s in students:
        if s["id"] == student_id:
            if "name" in student_data:
                s["name"] = student_data["name"]
                
            save_students(students) #
            return s 
            

    raise HTTPException(status_code=404, detail=f"Student {student_id} not found")

@app.put("/students/{student_id}", response_model=StudentOut)
def update_student(student_id: int, updated_data: StudentUpdate):
    students = load_students()

    
    for student in students:
        if student["id"] == student_id:
            student["name"] = updated_data.name
            student["age"] = updated_data.age
            student["city"] = updated_data.city
            
            save_students(students)
            return student
            
    raise HTTPException(status_code=404, detail=f"Student {student_id} not found")