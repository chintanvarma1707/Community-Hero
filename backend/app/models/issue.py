from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class IssueCategory(str, Enum):
    POTHOLE = "Pothole"
    WATER_LEAKAGE = "Water Leakage"
    DAMAGED_STREETLIGHT = "Damaged Streetlight"
    GARBAGE_OVERFLOW = "Garbage Overflow"
    BROKEN_FOOTPATH = "Broken Footpath"
    ENCROACHMENT = "Encroachment"
    TREE_FALLEN = "Tree Fallen"
    DRAINAGE_BLOCKED = "Drainage Blocked"
    ROAD_DAMAGE = "Road Damage"
    OTHER = "Other"


class IssueSeverity(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class IssueStatus(str, Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"


class Issue(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(min_length=3, max_length=200)
    description: str = Field(default="")
    category: IssueCategory = Field(default=IssueCategory.OTHER)
    severity: IssueSeverity = Field(default=IssueSeverity.LOW)
    status: IssueStatus = Field(default=IssueStatus.OPEN)
    latitude: float
    longitude: float
    address: str = Field(default="")
    image_url: str = Field(default="")  # base64 data URL or GCS URL
    reporter_id: int = Field(default=1)
    reporter_name: str = Field(default="Anonymous")
    verifications: int = Field(default=0)
    ai_confidence: float = Field(default=0.0)
    ai_description: str = Field(default="")
    ai_cost: str = Field(default="")
    ai_materials: str = Field(default="")
    department: str = Field(default="Unassigned")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class IssueCreate(SQLModel):
    title: str
    description: str = ""
    latitude: float
    longitude: float
    address: str = ""
    image_url: str = ""
    reporter_id: int = 1
    reporter_name: str = "Anonymous"


class IssueRead(SQLModel):
    id: int
    title: str
    description: str
    category: IssueCategory
    severity: IssueSeverity
    status: IssueStatus
    latitude: float
    longitude: float
    address: str
    image_url: str
    reporter_id: int
    reporter_name: str
    verifications: int
    ai_confidence: float
    ai_description: str
    ai_cost: str
    ai_materials: str
    department: str
    created_at: datetime
    updated_at: datetime


class IssueStatusUpdate(SQLModel):
    status: IssueStatus
