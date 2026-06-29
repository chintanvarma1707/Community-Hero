from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from collections import Counter
from typing import List

from ..core.database import get_session
from ..models.issue import Issue, IssueStatus, IssueSeverity, IssueCategory
from ..services.prediction import generate_predictive_insights

router = APIRouter()


@router.get("/stats")
def get_stats(session: Session = Depends(get_session)):
    issues = session.exec(select(Issue)).all()

    total = len(issues)
    open_count = sum(1 for i in issues if i.status == IssueStatus.OPEN)
    in_progress = sum(1 for i in issues if i.status == IssueStatus.IN_PROGRESS)
    resolved = sum(1 for i in issues if i.status == IssueStatus.RESOLVED)
    high_severity = sum(1 for i in issues if i.severity == IssueSeverity.HIGH)
    total_verifications = sum(i.verifications for i in issues)

    # Category breakdown
    categories = Counter(i.category for i in issues)
    severity_breakdown = Counter(i.severity for i in issues)

    # Resolution rate
    resolution_rate = round((resolved / total * 100) if total > 0 else 0, 1)

    return {
        "total_issues": total,
        "open": open_count,
        "in_progress": in_progress,
        "resolved": resolved,
        "high_severity": high_severity,
        "total_verifications": total_verifications,
        "resolution_rate": resolution_rate,
        "top_category": categories.most_common(1)[0][0] if categories else "N/A",
        "category_breakdown": dict(categories),
        "severity_breakdown": dict(severity_breakdown),
    }


@router.get("/heatmap")
def get_heatmap(session: Session = Depends(get_session)):
    """Return GeoJSON FeatureCollection for map heatmap."""
    issues = session.exec(select(Issue)).all()

    features = []
    for issue in issues:
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [issue.longitude, issue.latitude]
            },
            "properties": {
                "id": issue.id,
                "title": issue.title,
                "category": issue.category,
                "severity": issue.severity,
                "status": issue.status,
                "verifications": issue.verifications,
                "weight": {"Low": 1, "Medium": 2, "High": 3}.get(issue.severity, 1)
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }


@router.get("/predictions")
def get_predictions(session: Session = Depends(get_session)):
    issues = session.exec(select(Issue)).all()
    issue_dicts = [
        {
            "category": i.category,
            "severity": i.severity,
            "status": i.status,
            "latitude": i.latitude,
            "longitude": i.longitude,
        }
        for i in issues
    ]
    return generate_predictive_insights(issue_dicts)
