from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select, SQLModel
from typing import List, Optional
from datetime import datetime

from ..core.database import get_session
from ..models.issue import Issue, IssueCreate, IssueRead, IssueStatus, IssueStatusUpdate, IssueCategory, IssueSeverity
from ..models.user import User
from ..models.verification import Verification

router = APIRouter()


def seed_demo_issues(session: Session):
    """Seed demo issues if DB is empty."""
    count = len(session.exec(select(Issue)).all())
    if count == 0:
        demo_issues = [
            Issue(
                title="Large pothole on SG Highway near Bopal",
                description="Deep pothole causing vehicle damage. Multiple complaints from residents.",
                category=IssueCategory.POTHOLE,
                severity=IssueSeverity.HIGH,
                status=IssueStatus.OPEN,
                latitude=23.0285, longitude=72.5050,
                address="SG Highway, Bopal, Ahmedabad",
                reporter_name="Rahul Sharma",
                verifications=12, ai_confidence=0.94,
                ai_description="Large pothole approximately 45cm wide and 15cm deep on main arterial road."
            ),
            Issue(
                title="Overflowing garbage bin near Maninagar",
                description="Garbage bin overflowing for 3 days. Health hazard in residential area.",
                category=IssueCategory.GARBAGE_OVERFLOW,
                severity=IssueSeverity.MEDIUM,
                status=IssueStatus.IN_PROGRESS,
                latitude=22.9999, longitude=72.6067,
                address="Maninagar Circle, Ahmedabad",
                reporter_name="Priya Patel",
                verifications=8, ai_confidence=0.88,
                ai_description="Overflowing municipal waste bin with debris scattered in 3-meter radius."
            ),
            Issue(
                title="Broken streetlight — Navrangpura",
                description="3 consecutive streetlights not working. Road dark and unsafe at night.",
                category=IssueCategory.DAMAGED_STREETLIGHT,
                severity=IssueSeverity.HIGH,
                status=IssueStatus.OPEN,
                latitude=23.0395, longitude=72.5590,
                address="Navrangpura, CG Road, Ahmedabad",
                reporter_name="Amit Joshi",
                verifications=15, ai_confidence=0.91,
                ai_description="Three consecutive streetlights non-functional on busy commercial road."
            ),
            Issue(
                title="Water main leak — Satellite Road",
                description="Underground water pipe burst causing road flooding.",
                category=IssueCategory.WATER_LEAKAGE,
                severity=IssueSeverity.HIGH,
                status=IssueStatus.RESOLVED,
                latitude=23.0195, longitude=72.5250,
                address="Satellite Road, Ahmedabad",
                reporter_name="Neha Gupta",
                verifications=21, ai_confidence=0.96,
                ai_description="Significant water main leak with standing water 15cm deep across 20m of road."
            ),
            Issue(
                title="Damaged footpath — Vastrapur Lake",
                description="Footpath tiles broken and raised, causing trip hazard for pedestrians.",
                category=IssueCategory.BROKEN_FOOTPATH,
                severity=IssueSeverity.LOW,
                status=IssueStatus.OPEN,
                latitude=23.0432, longitude=72.5239,
                address="Vastrapur Lake Road, Ahmedabad",
                reporter_name="Kavya Mehta",
                verifications=4, ai_confidence=0.83,
                ai_description="Multiple displaced footpath tiles creating uneven surface for pedestrians."
            ),
            Issue(
                title="Blocked storm drain — Paldi",
                description="Storm drain completely blocked with debris after recent rain.",
                category=IssueCategory.DRAINAGE_BLOCKED,
                severity=IssueSeverity.MEDIUM,
                status=IssueStatus.OPEN,
                latitude=23.0098, longitude=72.5625,
                address="Paldi, Ahmedabad",
                reporter_name="Vikram Singh",
                verifications=6, ai_confidence=0.89,
                ai_description="Storm drain blocked with plastic waste and debris causing localized flooding."
            ),
            Issue(
                title="Tree fallen across road — Thaltej",
                description="Large tree fallen blocking half the road. Traffic disrupted.",
                category=IssueCategory.TREE_FALLEN,
                severity=IssueSeverity.HIGH,
                status=IssueStatus.RESOLVED,
                latitude=23.0521, longitude=72.4971,
                address="Thaltej, Ahmedabad",
                reporter_name="Deepak Rao",
                verifications=18, ai_confidence=0.98,
                ai_description="Large tree approximately 20 meters tall fallen blocking 60% of road width."
            ),
            Issue(
                title="Road damage after digging — Bodakdev",
                description="Road not properly repaired after utility digging. Dangerous surface.",
                category=IssueCategory.ROAD_DAMAGE,
                severity=IssueSeverity.MEDIUM,
                status=IssueStatus.IN_PROGRESS,
                latitude=23.0372, longitude=72.5155,
                address="Bodakdev, Ahmedabad",
                reporter_name="Anita Desai",
                verifications=9, ai_confidence=0.87,
                ai_description="Poorly patched road surface after utility work creating bumps and uneven terrain."
            ),
        ]
        for issue in demo_issues:
            session.add(issue)
        session.commit()


@router.get("/", response_model=List[IssueRead])
def get_issues(
    status: Optional[str] = None,
    category: Optional[str] = None,
    severity: Optional[str] = None,
    session: Session = Depends(get_session)
):
    seed_demo_issues(session)
    query = select(Issue)
    if status:
        query = query.where(Issue.status == status)
    if category:
        query = query.where(Issue.category == category)
    if severity:
        query = query.where(Issue.severity == severity)
    issues = session.exec(query.order_by(Issue.created_at.desc())).all()
    return issues


@router.get("/{issue_id}", response_model=IssueRead)
def get_issue(issue_id: int, session: Session = Depends(get_session)):
    issue = session.get(Issue, issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return issue


@router.post("/", response_model=IssueRead, status_code=201)
def create_issue(issue_data: IssueCreate, session: Session = Depends(get_session)):
    issue = Issue(**issue_data.model_dump())
    session.add(issue)
    session.commit()
    session.refresh(issue)

    # Award points to reporter
    user = session.get(User, issue_data.reporter_id)
    if user:
        user.add_points(10)
        user.reports_count += 1
        user._check_badges()
        session.add(user)
        session.commit()

    return issue


@router.patch("/{issue_id}/ai", response_model=IssueRead)
def update_issue_ai(
    issue_id: int,
    category: str,
    severity: str,
    confidence: float,
    description: str,
    cost: str = "",
    materials: str = "",
    session: Session = Depends(get_session)
):
    issue = session.get(Issue, issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    issue.category = category
    issue.severity = severity
    issue.ai_confidence = confidence
    issue.ai_description = description
    if cost:
        issue.ai_cost = cost
    if materials:
        issue.ai_materials = materials
    issue.updated_at = datetime.utcnow()
    session.add(issue)
    session.commit()
    session.refresh(issue)
    return issue


@router.post("/{issue_id}/verify", response_model=IssueRead)
def verify_issue(issue_id: int, user_id: int = 1, session: Session = Depends(get_session)):
    issue = session.get(Issue, issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    # Check if already verified by this user
    existing = session.exec(
        select(Verification).where(
            Verification.issue_id == issue_id,
            Verification.user_id == user_id
        )
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Already verified by this user")

    verification = Verification(issue_id=issue_id, user_id=user_id)
    session.add(verification)

    issue.verifications += 1
    issue.updated_at = datetime.utcnow()
    session.add(issue)

    # Award points to verifier
    user = session.get(User, user_id)
    if user:
        user.add_points(3)
        user.verifications_count += 1
        user._check_badges()
        session.add(user)

    session.commit()
    session.refresh(issue)
    return issue


@router.patch("/{issue_id}/status", response_model=IssueRead)
def update_status(issue_id: int, update: IssueStatusUpdate, session: Session = Depends(get_session)):
    issue = session.get(Issue, issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    old_status = issue.status
    issue.status = update.status
    issue.updated_at = datetime.utcnow()
    session.add(issue)

    # Award points if resolved
    if update.status == IssueStatus.RESOLVED and old_status != IssueStatus.RESOLVED:
        reporter = session.get(User, issue.reporter_id)
        if reporter:
            reporter.add_points(20)
            reporter.resolved_count += 1
            reporter._check_badges()
            session.add(reporter)

    session.commit()
    session.refresh(issue)
    return issue


class IssueDepartmentUpdate(SQLModel):
    department: str

@router.patch("/{issue_id}/department", response_model=IssueRead)
def update_department(issue_id: int, update: IssueDepartmentUpdate, session: Session = Depends(get_session)):
    issue = session.get(Issue, issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    issue.department = update.department
    issue.updated_at = datetime.utcnow()
    session.add(issue)
    session.commit()
    session.refresh(issue)
    return issue


@router.delete("/{issue_id}", status_code=204)
def delete_issue(issue_id: int, session: Session = Depends(get_session)):
    issue = session.get(Issue, issue_id)
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    session.delete(issue)
    session.commit()
    return {"ok": True}

