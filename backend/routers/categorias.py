from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
from routers.auth import get_admin_user

router = APIRouter()

# ─── OBTENER TODAS LAS CATEGORÍAS ───
@router.get("/", response_model=List[schemas.CategoriaResponse])
def get_categorias(db: Session = Depends(get_db)):
    return db.query(models.Categoria).all()

# ─── OBTENER UNA CATEGORÍA ───
@router.get("/{categoria_id}", response_model=schemas.CategoriaResponse)
def get_categoria(categoria_id: int, db: Session = Depends(get_db)):
    categoria = db.query(models.Categoria).filter(
        models.Categoria.id == categoria_id
    ).first()
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada"
        )
    return categoria

# ─── CREAR CATEGORÍA (solo admin) ───
@router.post("/", response_model=schemas.CategoriaResponse)
def create_categoria(
    categoria: schemas.CategoriaCreate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_admin_user)
):
    existe = db.query(models.Categoria).filter(
        models.Categoria.nombre == categoria.nombre
    ).first()
    if existe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una categoría con ese nombre"
        )

    nueva_categoria = models.Categoria(**categoria.model_dump())
    db.add(nueva_categoria)
    db.commit()
    db.refresh(nueva_categoria)
    return nueva_categoria

# ─── ACTUALIZAR CATEGORÍA (solo admin) ───
@router.put("/{categoria_id}", response_model=schemas.CategoriaResponse)
def update_categoria(
    categoria_id: int,
    categoria_update: schemas.CategoriaCreate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_admin_user)
):
    categoria = db.query(models.Categoria).filter(
        models.Categoria.id == categoria_id
    ).first()
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada"
        )

    datos = categoria_update.model_dump(exclude_unset=True)
    for key, value in datos.items():
        setattr(categoria, key, value)

    db.commit()
    db.refresh(categoria)
    return categoria

# ─── ELIMINAR CATEGORÍA (solo admin) ───
@router.delete("/{categoria_id}")
def delete_categoria(
    categoria_id: int,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_admin_user)
):
    categoria = db.query(models.Categoria).filter(
        models.Categoria.id == categoria_id
    ).first()
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada"
        )

    productos = db.query(models.Producto).filter(
        models.Producto.categoria_id == categoria_id
    ).first()
    if productos:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede eliminar una categoría que tiene productos asociados"
        )

    db.delete(categoria)
    db.commit()
    return {"mensaje": "Categoría eliminada correctamente"}