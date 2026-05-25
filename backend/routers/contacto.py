from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models
import schemas
from routers.auth import get_admin_user

router = APIRouter()

# ─── ENVIAR MENSAJE (público) ───
@router.post("/", response_model=schemas.MensajeResponse)
def enviar_mensaje(
    mensaje: schemas.MensajeCreate,
    db: Session = Depends(get_db)
):
    nuevo_mensaje = models.Mensaje(**mensaje.model_dump())
    db.add(nuevo_mensaje)
    db.commit()
    db.refresh(nuevo_mensaje)
    return nuevo_mensaje

# ─── OBTENER TODOS LOS MENSAJES (solo admin) ───
@router.get("/", response_model=List[schemas.MensajeResponse])
def get_mensajes(
    leido: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_admin_user)
):
    query = db.query(models.Mensaje).order_by(models.Mensaje.fecha.desc())
    if leido is not None:
        query = query.filter(models.Mensaje.leido == leido)
    return query.all()

# ─── OBTENER UN MENSAJE (solo admin) ───
@router.get("/{mensaje_id}", response_model=schemas.MensajeResponse)
def get_mensaje(
    mensaje_id: int,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_admin_user)
):
    mensaje = db.query(models.Mensaje).filter(
        models.Mensaje.id == mensaje_id
    ).first()
    if not mensaje:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mensaje no encontrado"
        )
    return mensaje

# ─── MARCAR COMO LEÍDO (solo admin) ───
@router.patch("/{mensaje_id}/leido", response_model=schemas.MensajeResponse)
def marcar_leido(
    mensaje_id: int,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_admin_user)
):
    mensaje = db.query(models.Mensaje).filter(
        models.Mensaje.id == mensaje_id
    ).first()
    if not mensaje:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mensaje no encontrado"
        )
    mensaje.leido = True
    db.commit()
    db.refresh(mensaje)
    return mensaje

# ─── ELIMINAR MENSAJE (solo admin) ───
@router.delete("/{mensaje_id}")
def delete_mensaje(
    mensaje_id: int,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_admin_user)
):
    mensaje = db.query(models.Mensaje).filter(
        models.Mensaje.id == mensaje_id
    ).first()
    if not mensaje:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mensaje no encontrado"
        )
    db.delete(mensaje)
    db.commit()
    return {"mensaje": "Mensaje eliminado correctamente"}