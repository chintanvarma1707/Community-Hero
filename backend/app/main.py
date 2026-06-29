from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .core.database import create_db_and_tables
from .routers import issues, users, analysis, dashboard


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(
    title="Community Hero API",
    description="Civic-tech platform for reporting and tracking local infrastructure issues",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(issues.router, prefix="/api/issues", tags=["Issues"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])


@app.get("/")
def read_root():
    return {
        "status": "ok",
        "message": "Community Hero API",
        "docs": "/docs"
    }
