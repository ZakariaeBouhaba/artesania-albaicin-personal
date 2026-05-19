from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
import cloudinary
import cloudinary.uploader
from routers.auth import get_admin_user
from config import settings

router = APIRouter()

# Configuración de Cloudinary desde .env
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

# ─── SUBIR IMAGEN DE PRODUCTO (solo admin) ───
@router.post("/{producto_id}", response_model=schemas.ImagenProductoResponse)
def subir_imagen(
    producto_id: int,
    file: UploadFile = File(...),
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

    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Solo se permiten imágenes JPG, PNG o WEBP"
        )

    resultado = cloudinary.uploader.upload(
        file.file,
        folder="artesania_albaicin",
        public_id=f"producto_{producto_id}_{file.filename}"
    )

    nueva_imagen = models.ImagenProducto(
        producto_id=producto_id,
        imagen_url=resultado["secure_url"]
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

# ─── ELIMINAR IMAGEN (solo admin) ───
@router.delete("/{imagen_id}")
def delete_imagen(
    imagen_id: int,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_admin_user)
):
    imagen = db.query(models.ImagenProducto).filter(
        models.ImagenProducto.id == imagen_id
    ).first()
    if not imagen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Imagen no encontrada"
        )

    public_id = f"artesania_albaicin/producto_{imagen.producto_id}_{imagen.imagen_url.split('/')[-1].split('.')[0]}"
    cloudinary.uploader.destroy(public_id)

    db.delete(imagen)
    db.commit()
    return {"mensaje": "Imagen eliminada correctamente"}