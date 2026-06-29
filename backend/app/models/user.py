from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime
import json


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(min_length=1, max_length=100)
    email: Optional[str] = Field(default=None, index=True)
    phone: Optional[str] = Field(default=None)
    password: Optional[str] = Field(default=None)
    role: str = Field(default="citizen")
    avatar_emoji: str = Field(default="🦸")
    points: int = Field(default=0)
    reports_count: int = Field(default=0)
    verifications_count: int = Field(default=0)
    resolved_count: int = Field(default=0)
    badges_json: str = Field(default="[]")  # JSON array of badge names
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @property
    def badges(self) -> List[str]:
        return json.loads(self.badges_json)

    def add_badge(self, badge: str):
        current = self.badges
        if badge not in current:
            current.append(badge)
            self.badges_json = json.dumps(current)

    def add_points(self, pts: int):
        self.points += pts
        self._check_badges()

    def _check_badges(self):
        if self.reports_count >= 1:
            self.add_badge("First Steps")
        if self.verifications_count >= 10:
            self.add_badge("Watchdog")
        if self.resolved_count >= 5:
            self.add_badge("City Builder")
        if self.points >= 500:
            self.add_badge("Hero")
        if self.reports_count >= 25:
            self.add_badge("Guardian")


class UserCreate(SQLModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None
    role: str = "citizen"
    avatar_emoji: str = "🦸"


class UserUpdate(SQLModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    avatar_emoji: Optional[str] = None


class UserRead(SQLModel):
    id: int
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    role: str
    avatar_emoji: str
    points: int
    reports_count: int
    verifications_count: int
    resolved_count: int
    badges_json: str
    created_at: datetime
