from pydantic import BaseModel, Field


class StudentBase(BaseModel):
    name: str = Field(min_length=2, max_length=50)
    age: int = Field(ge=15, le=100)
    city: str


class StudentCreate(StudentBase):
    pass


class StudentOut(StudentBase):
    id: int

from pydantic import BaseModel

class StudentUpdate(BaseModel):
    name: str
    age: int
    city: str

