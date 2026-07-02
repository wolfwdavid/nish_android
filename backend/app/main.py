from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.clerk_jwt import ClerkJWTMiddleware
from app.core.database import engine, Base

import app.models

from app.router.user import router as user_router
from app.router.dashboard_layout import router as dashboard_router
from app.router.profile import router as profile_router
from app.router.project import router as project_router
from app.router.bookmark import router as bookmark_router
from app.router.live_projects import router as live_project_router
from app.router.feed_event import router as feed_event_router
from app.router.dashboard import router as main_dashboard_router
from app.api.v1.support import router as support_router
from app.api.v1.feedback import router as feedback_router
from app.api.v1 import admin
from app.router.follow import router as follow_router
from app.router.search import router as search_router
from app.router.changelog import router as changelog_router
from app.router.app_notice import router as app_notice_router



@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield


app = FastAPI(
    title="DevManiac API",
    version="1.0.0",
    lifespan=lifespan,
)



origins = [
    "http://localhost:3000",
    "https://devmaniac.com",
    "https://www.devmaniac.com",
]

# Verifies Clerk JWTs when CLERK_JWT_ISSUER is set; pass-through otherwise.
# Added before CORSMiddleware so CORS stays outermost and still decorates
# 401 responses for browser clients.
app.add_middleware(ClerkJWTMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user_router)
app.include_router(dashboard_router)
app.include_router(profile_router)
app.include_router(project_router)
app.include_router(bookmark_router)
app.include_router(live_project_router)
app.include_router(feed_event_router)
app.include_router(main_dashboard_router)
app.include_router(support_router)
app.include_router(feedback_router)
app.include_router(admin.router)
app.include_router(follow_router)
app.include_router(search_router)
app.include_router(changelog_router)
app.include_router(app_notice_router)


@app.get("/")
async def root():
    return {"message": "DevManiac API"}


@app.get("/health")
async def health():
    return {"status": "ok"}