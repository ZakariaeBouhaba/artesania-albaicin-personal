from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from database import get_db
import models
import schemas
from routers.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=schemas.EstadisticasResponse)
def get_estadisticas(
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    ahora = datetime.utcnow()
    inicio_hoy = ahora.replace(hour=0, minute=0, second=0, microsecond=0)
    inicio_semana = ahora - timedelta(days=ahora.weekday())
    inicio_semana = inicio_semana.replace(hour=0, minute=0, second=0, microsecond=0)
    inicio_mes = ahora.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    total_hoy = db.query(func.sum(models.Venta.total_final)).filter(
        models.Venta.fecha >= inicio_hoy
    ).scalar() or 0.0

    total_semana = db.query(func.sum(models.Venta.total_final)).filter(
        models.Venta.fecha >= inicio_semana
    ).scalar() or 0.0

    total_mes = db.query(func.sum(models.Venta.total_final)).filter(
        models.Venta.fecha >= inicio_mes
    ).scalar() or 0.0

    total_tpv = db.query(func.sum(models.Venta.total_final)).filter(
        models.Venta.metodo_pago == "TPV"
    ).scalar() or 0.0

    total_efectivo = db.query(func.sum(models.Venta.total_final)).filter(
        models.Venta.metodo_pago == "Efectivo"
    ).scalar() or 0.0

    num_ventas_hoy = db.query(models.Venta).filter(
        models.Venta.fecha >= inicio_hoy
    ).count()

    num_mensajes_sin_leer = db.query(models.Mensaje).filter(
        models.Mensaje.leido == False
    ).count()

    num_productos_agotados = db.query(models.Producto).filter(
        models.Producto.estado == "agotado"
    ).count()

    return {
        "total_hoy": total_hoy,
        "total_semana": total_semana,
        "total_mes": total_mes,
        "total_tpv": total_tpv,
        "total_efectivo": total_efectivo,
        "num_ventas_hoy": num_ventas_hoy,
        "num_mensajes_sin_leer": num_mensajes_sin_leer,
        "num_productos_agotados": num_productos_agotados
    }