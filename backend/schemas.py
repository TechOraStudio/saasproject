from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    client: str = Field(min_length=1, max_length=150)
    status: str = "In Progress"
    progress: int = Field(default=0, ge=0, le=100)


class ProjectResponse(ProjectCreate):
    id: int

    class Config:
        from_attributes = True