from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from schemas import ProjectCreate, ProjectResponse


app = FastAPI(
    title="TaskFlow API",
    version="1.0.0"
)


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# DATABASE (TEMPORARY)
# =========================

db_projects = [
    {
        "id": 1,
        "name": "E-Commerce Sales Analytics",
        "client": "Retail Corp",
        "status": "In Progress",
        "progress": 75,
    },
    {
        "id": 2,
        "name": "Cashflow Dashboard",
        "client": "Finance Team",
        "status": "Completed",
        "progress": 100,
    },
    {
        "id": 3,
        "name": "Interiority Mobile Site",
        "client": "Design Studio",
        "status": "In Progress",
        "progress": 40,
    },
]


# =========================
# HOME
# =========================

@app.get("/")
def home():
    return {
        "message": "TaskFlow API is running"
    }


# =========================
# GET ALL PROJECTS
# =========================

@app.get(
    "/api/projects",
    response_model=List[ProjectResponse]
)
def get_projects():
    return db_projects


# =========================
# GET SINGLE PROJECT
# =========================

@app.get(
    "/api/projects/{project_id}",
    response_model=ProjectResponse
)
def get_project(project_id: int):

    for project in db_projects:

        if project["id"] == project_id:
            return project

    raise HTTPException(
        status_code=404,
        detail="Project not found"
    )


# =========================
# CREATE PROJECT
# =========================

@app.post(
    "/api/projects",
    response_model=ProjectResponse,
    status_code=201
)
def create_project(project: ProjectCreate):

    new_id = max(
        [project["id"] for project in db_projects],
        default=0
    ) + 1

    new_project = {
        "id": new_id,
        **project.model_dump()
    }

    db_projects.append(new_project)

    return new_project


# =========================
# UPDATE PROJECT
# =========================

@app.put(
    "/api/projects/{project_id}",
    response_model=ProjectResponse
)
def update_project(
    project_id: int,
    project: ProjectCreate
):

    for index, existing_project in enumerate(db_projects):

        if existing_project["id"] == project_id:

            updated_project = {
                "id": project_id,
                **project.model_dump()
            }

            db_projects[index] = updated_project

            return updated_project

    raise HTTPException(
        status_code=404,
        detail="Project not found"
    )


# =========================
# DELETE PROJECT
# =========================

@app.delete("/api/projects/{project_id}")
def delete_project(project_id: int):

    for index, project in enumerate(db_projects):

        if project["id"] == project_id:

            db_projects.pop(index)

            return {
                "message": "Project deleted successfully",
                "id": project_id
            }

    raise HTTPException(
        status_code=404,
        detail="Project not found"
    )