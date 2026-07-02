from fastapi import APIRouter , Depends, Query 
from app.service.profile import get_user_profile_data , update_user_profile_data , get_my_profile_data
from app.schema.profile import get_profile_data as profile_schema , update_profile_data
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db 


router = APIRouter(prefix="/profile" , tags=["Profile"])

@router.get("/me", response_model=profile_schema)
async def get_my_profile(
    clerk_user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    return await get_my_profile_data(
        db=db,
        clerk_user_id=clerk_user_id,
    )

@router.get("/{username}" , response_model=profile_schema)
async def get_user_profile(
    username: str,
    db: AsyncSession = Depends(get_db),
):
    return await get_user_profile_data(
        db=db , 
        username=username,
    )

@router.patch("/me" , response_model=update_profile_data)
async def update_profile_data(data : update_profile_data , 
                              db: AsyncSession = Depends(get_db) , 
                              clerk_user_id : str = Query(...) ):
    return await update_user_profile_data(
        db=db , 
        clerk_user_id=clerk_user_id , 
        data=data
    )


