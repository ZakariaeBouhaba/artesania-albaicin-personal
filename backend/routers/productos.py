import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import models
import schemas
from cloudinary_utils import borrar_imagen, public_id_desde_url
from database import get_db
from routers.auth import get_current_user, get_admin_user

logger = logging.getLogger(__name__)
router = APIRouter()

# ─── OBTENER TODOS LOS PRODUCTOS ───
@router.get("/", response_model=List[schemas.ProductoResponse])
def get_productos(
    categoria_id: Optional[int] = None,
    estado: Optional[schemas.EstadoProducto] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Producto)
    if categoria_id:
        query = query.filter(models.Producto.categoria_id == categoria_id)
    if estado:
        query = query.filter(models.Producto.estado == estado)
    return query.all()

# ─── OBTENER UN PRODUCTO ───
@router.get("/{producto_id}", response_model=schemas.ProductoResponse)
def get_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(models.Producto).filter(
        models.Producto.id == producto_id
    ).first()
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    return producto

# ─── CREAR PRODUCTO (solo admin) ───
@router.post("/", response_model=schemas.ProductoResponse)
def create_producto(
    producto: schemas.ProductoCreate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_admin_user)
):
    categoria = db.query(models.Categoria).filter(
        models.Categoria.id == producto.categoria_id
    ).first()
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada"
        )

    nuevo_producto = models.Producto(**producto.model_dump())
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    return nuevo_producto

# ─── ACTUALIZAR PRODUCTO (solo admin) ───
@router.put("/{producto_id}", response_model=schemas.ProductoResponse)
def update_producto(
    producto_id: int,
    producto_update: schemas.ProductoUpdate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_admin_user)
):
    producto = db.query(models.Producto).filter(
        models.Producto.id == producto_id
    ).first()
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )

    datos = producto_update.model_dump(exclude_unset=True)
    for key, value in datos.items():
        setattr(producto, key, value)

    db.commit()
    db.refresh(producto)
    return producto

# ─── ACTUALIZAR ESTADO (encargado y admin) ───
@router.patch("/{producto_id}/estado", response_model=schemas.ProductoResponse)
def update_estado(
    producto_id: int,
    estado: schemas.EstadoProducto,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    producto = db.query(models.Producto).filter(
        models.Producto.id == producto_id
    ).first()
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )

    producto.estado = estado
    db.commit()
    db.refresh(producto)
    return producto

# ─── ELIMINAR PRODUCTO (solo admin) ───
@router.delete("/{producto_id}")
def delete_producto(
    producto_id: int,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_admin_user)
):
    producto = db.query(models.Producto).filter(
        models.Producto.id == producto_id
    ).first()
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )

    # Borrar también las fotos de Cloudinary (si falla, se registra y se continúa)
    imagenes = db.query(models.ImagenProducto).filter(
        models.ImagenProducto.producto_id == producto_id
    ).all()
    for imagen in imagenes:
        public_id = imagen.public_id or public_id_desde_url(imagen.imagen_url)
        try:
            borrar_imagen(public_id)
        except Exception:
            logger.exception("No se pudo borrar %s de Cloudinary", public_id)
        db.delete(imagen)

    db.delete(producto)
    db.commit()
    return {"mensaje": "Producto eliminado correctamente"}