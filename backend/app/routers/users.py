from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from ..core.database import get_session
from ..models.user import User, UserCreate, UserRead, UserUpdate

router = APIRouter()


def seed_demo_users(session: Session):
    count = len(session.exec(select(User)).all())
    if count == 0:
        demo_users = [
            User(name="Admin", email="admin@ahmedabad.gov.in", phone="+91 0000000000", password="admin", role="admin", avatar_emoji="🏛️", points=0),
            User(name="Rahul Sharma", email="rahul@example.com", phone="+91 9825012345", avatar_emoji="🦸", points=485, reports_count=18,
                 verifications_count=32, resolved_count=6, badges_json='["First Steps","Watchdog","City Builder"]'),
            User(name="Priya Patel", email="priya@example.com", phone="+91 9825023456", avatar_emoji="🌟", points=360, reports_count=14,
                 verifications_count=28, resolved_count=4, badges_json='["First Steps","Watchdog"]'),
            User(name="Amit Joshi", email="amit@example.com", phone="+91 9825034567", avatar_emoji="🔥", points=290, reports_count=11,
                 verifications_count=19, resolved_count=3, badges_json='["First Steps","Watchdog"]'),
            User(name="Neha Gupta", email="neha@example.com", phone="+91 9825045678", avatar_emoji="💎", points=220, reports_count=8,
                 verifications_count=14, resolved_count=2, badges_json='["First Steps"]'),
            User(name="Vikram Singh", email="vikram@example.com", phone="+91 9825056789", avatar_emoji="⚡", points=175, reports_count=6,
                 verifications_count=11, resolved_count=1, badges_json='["First Steps"]'),
            User(name="Kavya Mehta", email="kavya@example.com", phone="+91 9825067890", avatar_emoji="🌸", points=140, reports_count=5,
                 verifications_count=8, resolved_count=1, badges_json='["First Steps"]'),
            User(name="Deepak Rao", email="deepak@example.com", phone="+91 9825078901", avatar_emoji="🎯", points=110, reports_count=4,
                 verifications_count=6, resolved_count=0, badges_json='["First Steps"]'),
            User(name="Anita Desai", email="anita@example.com", phone="+91 9825089012", avatar_emoji="🌈", points=85, reports_count=3,
                 verifications_count=5, resolved_count=0, badges_json='["First Steps"]'),
        ]
        for u in demo_users:
            session.add(u)
        session.commit()


@router.post("/login", response_model=UserRead)
def login_or_register_user(user_data: UserCreate, session: Session = Depends(get_session)):
    seed_demo_users(session)
    # Check if user exists by email
    if user_data.email:
        existing = session.exec(select(User).where(User.email == user_data.email)).first()
        if existing:
            # If user provided a password and it doesn't match
            if existing.password and user_data.password and existing.password != user_data.password:
                raise HTTPException(status_code=401, detail="Invalid password")
            # Update name, phone, emoji if provided
            existing.name = user_data.name
            if user_data.phone:
                existing.phone = user_data.phone
            if user_data.avatar_emoji:
                existing.avatar_emoji = user_data.avatar_emoji
            session.add(existing)
            session.commit()
            session.refresh(existing)
            return existing

    # Create new user
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        password=user_data.password,
        role=user_data.role,
        avatar_emoji=user_data.avatar_emoji,
        points=10,
        badges_json='["First Steps"]'
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user


@router.get("/leaderboard", response_model=List[UserRead])
def get_leaderboard(limit: int = 10, session: Session = Depends(get_session)):
    seed_demo_users(session)
    users = session.exec(
        select(User).order_by(User.points.desc()).limit(limit)
    ).all()
    return users


@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/{user_id}", response_model=UserRead)
def update_user(user_id: int, user_update: UserUpdate, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)
        
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.post("/", response_model=UserRead, status_code=201)
def create_user(user_data: UserCreate, session: Session = Depends(get_session)):
    user = User(**user_data.model_dump())
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
