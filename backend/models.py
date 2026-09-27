from sqlalchemy import Column, Integer, String
from database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    client = Column(String(150), nullable=False)
    status = Column(String(50), nullable=False, default="In Progress")
    progress = Column(Integer, nullable=False, default=0)