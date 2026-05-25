from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date
from database import get_db
import models
import schemas
from routers.auth import get_current_user, get_admin_user

router = APIRouter()

# ─── REGISTRAR VENTA (encargado y admin) ───
@router.post("/", response_model=schemas.VentaResponse)
def create_venta(
    venta: schemas.VentaCreate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    total_final = venta.precio_original - venta.descuento

    if total_final < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El descuento no puede ser mayor que el precio original"
        )

    if venta.metodo_pago not in ["TPV", "Efectivo"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Método de pago inválido. Debe ser TPV o Efectivo"
        )

    nueva_venta = models.Venta(
        descripcion=venta.descripcion,
        precio_original=venta.precio_original,
        descuento=venta.descuento,
        total_final=total_final,
        metodo_pago=venta.metodo_pago,
        notas=venta.notas
    )
    db.add(nueva_venta)
    db.commit()
    db.refresh(nueva_venta)
    return nueva_venta

# ─── OBTENER TODAS LAS VENTAS (encargado y admin) ───
@router.get("/", response_model=List[schemas.VentaResponse])
def get_ventas(
    metodo_pago: Optional[str] = None,
    fecha_desde: Optional[date] = None,
    fecha_hasta: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    query = db.query(models.Venta).order_by(models.Venta.fecha.desc())

    if metodo_pago:
        query = query.filter(models.Venta.metodo_pago == metodo_pago)
    if fecha_desde:
        query = query.filter(
            models.Venta.fecha >= datetime.combine(fecha_desde, datetime.min.time())
        )
    if fecha_hasta:
        query = query.filter(
            models.Venta.fecha <= datetime.combine(fecha_hasta, datetime.max.time())
        )

    return query.all()

# ─── OBTENER UNA VENTA (encargado y admin) ───
@router.get("/{venta_id}", response_model=schemas.VentaResponse)
def get_venta(
    venta_id: int,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    venta = db.query(models.Venta).filter(
        models.Venta.id == venta_id
    ).first()
    if not venta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venta no encontrada"
        )
    return venta

# ─── ELIMINAR VENTA (solo admin) ───
@router.delete("/{venta_id}")
def delete_venta(
    venta_id: int,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_admin_user)
):
    venta = db.query(models.Venta).filter(
        models.Venta.id == venta_id
    ).first()
    if not venta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Venta no encontrada"
        )

    db.delete(venta)
    db.commit()
    return {"mensaje": "Venta eliminada correctamente"}