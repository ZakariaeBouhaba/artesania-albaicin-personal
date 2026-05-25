from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models
import schemas
from routers.auth import get_current_user, get_admin_user

router = APIRouter()

# ─── OBTENER TODOS LOS PRODUCTOS ───
@router.get("/", response_model=List[schemas.ProductoResponse])
def get_productos(
    categoria_id: Optional[int] = None,
    estado: Optional[str] = None,
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
    estado: str,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    if estado not in ["disponible", "agotado", "bajo_pedido"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Estado inválido. Debe ser: disponible, agotado o bajo_pedido"
        )

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

    db.query(models.ImagenProducto).filter(
        models.ImagenProducto.producto_id == producto_id
    ).delete()

    db.delete(producto)
    db.commit()
    return {"mensaje": "Producto eliminado correctamente"}