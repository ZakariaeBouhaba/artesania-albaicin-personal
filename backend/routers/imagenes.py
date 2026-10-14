import logging
import os
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session

import models
import schemas
from cloudinary_utils import subir_imagen, borrar_imagen, public_id_desde_url
from database import get_db
from routers.auth import get_manager_user

logger = logging.getLogger(__name__)
router = APIRouter()

TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"]
TAMANO_MAXIMO = 5 * 1024 * 1024  # 5 MB


def _tamano_bytes(archivo: UploadFile) -> int:
    archivo.file.seek(0, os.SEEK_END)
    tamano = archivo.file.tell()
    archivo.file.seek(0)
    return tamano


# ─── SUBIR IMAGEN DE PRODUCTO (admin y encargado) ───
@router.post("/{producto_id}", response_model=schemas.ImagenProductoResponse)
def subir_imagen_producto(
    producto_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_manager_user)
):
    producto = db.query(models.Producto).filter(
        models.Producto.id == producto_id
    ).first()
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )

    if file.content_type not in TIPOS_PERMITIDOS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Solo se permiten imágenes JPG, PNG o WEBP"
        )

    if _tamano_bytes(file) > TAMANO_MAXIMO:
        raise HTTPException(
            status_code=413,
            detail="La imagen no puede superar los 5 MB"
        )

    try:
        resultado = subir_imagen(file.file, producto_id)
    except Exception:
        logger.exception("Error al subir la imagen a Cloudinary")
        raise HTTPException(
            status_code=502,
            detail="No se pudo subir la imagen"
        )

    nueva_imagen = models.ImagenProducto(
        producto_id=producto_id,
        imagen_url=resultado["secure_url"],
        public_id=resultado["public_id"]
    )
    db.add(nueva_imagen)

    if not producto.imagen_url:
        producto.imagen_url = resultado["secure_url"]

    db.commit()
    db.refresh(nueva_imagen)
    return nueva_imagen


# ─── OBTENER IMÁGENES DE UN PRODUCTO ───
@router.get("/{producto_id}", response_model=List[schemas.ImagenProductoResponse])
def get_imagenes(
    producto_id: int,
    db: Session = Depends(get_db)
):
    producto = db.query(models.Producto).filter(
        models.Producto.id == producto_id
    ).first()
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    return db.query(models.ImagenProducto).filter(
        models.ImagenProducto.producto_id == producto_id
    ).all()


# ─── ELIMINAR IMAGEN (admin y encargado) ───
@router.delete("/{imagen_id}")
def delete_imagen(
    imagen_id: int,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_manager_user)
):
    imagen = db.query(models.ImagenProducto).filter(
        models.ImagenProducto.id == imagen_id
    ).first()
    if not imagen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Imagen no encontrada"
        )

    url = imagen.imagen_url
    producto_id = imagen.producto_id
    public_id = imagen.public_id or public_id_desde_url(url)

    try:
        borrar_imagen(public_id)
    except Exception:
        logger.exception("No se pudo borrar %s de Cloudinary", public_id)
        raise HTTPException(
            status_code=502,
            detail="No se pudo eliminar la imagen de Cloudinary"
        )

    db.delete(imagen)
    db.flush()

    # Si era la imagen principal, usar otra del mismo producto (o ninguna)
    producto = db.query(models.Producto).filter(
        models.Producto.id == producto_id
    ).first()
    if producto and producto.imagen_url == url:
        otra = db.query(models.ImagenProducto).filter(
            models.ImagenProducto.producto_id == producto_id
        ).first()
        producto.imagen_url = otra.imagen_url if otra else None

    db.commit()
    return {"mensaje": "Imagen eliminada correctamente"}