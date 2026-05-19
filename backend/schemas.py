from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# ─── USUARIOS ───
class UsuarioBase(BaseModel):
    nombre: str
    email: str
    rol: str = "encargado"

class UsuarioCreate(UsuarioBase):
    contrasena: str

class UsuarioResponse(UsuarioBase):
    id: int
    class Config:
        from_attributes = True

# ─── LOGIN ───
class LoginSchema(BaseModel):
    email: str
    contrasena: str

class TokenSchema(BaseModel):
    access_token: str
    token_type: str

# ─── CATEGORIAS ───
class CategoriaBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaResponse(CategoriaBase):
    id: int
    class Config:
        from_attributes = True

# ─── PRODUCTOS ───
class ProductoBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    origen: Optional[str] = None
    material: Optional[str] = None
    hecho_a_mano: bool = True
    categoria_id: int
    imagen_url: Optional[str] = None
    estado: str = "disponible"

class ProductoCreate(ProductoBase):
    pass

class ProductoUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    origen: Optional[str] = None
    material: Optional[str] = None
    hecho_a_mano: Optional[bool] = None
    categoria_id: Optional[int] = None
    imagen_url: Optional[str] = None
    estado: Optional[str] = None

class ImagenProductoResponse(BaseModel):
    id: int
    producto_id: int
    imagen_url: str
    class Config:
        from_attributes = True

class ProductoResponse(ProductoBase):
    id: int
    categoria: Optional[CategoriaResponse] = None
    imagenes: Optional[List[ImagenProductoResponse]] = None
    class Config:
        from_attributes = True

# ─── MENSAJES ───
class MensajeBase(BaseModel):
    nombre: str
    email: str
    asunto: str
    mensaje: str

class MensajeCreate(MensajeBase):
    pass

class MensajeResponse(MensajeBase):
    id: int
    fecha: datetime
    leido: bool
    class Config:
        from_attributes = True

# ─── VENTAS ───
class VentaBase(BaseModel):
    descripcion: str
    precio_original: float
    descuento: float = 0.0
    total_final: float
    metodo_pago: str
    notas: Optional[str] = None

class VentaCreate(VentaBase):
    pass

class VentaResponse(VentaBase):
    id: int
    fecha: datetime
    class Config:
        from_attributes = True

# ─── ESTADISTICAS ───
class EstadisticasResponse(BaseModel):
    total_hoy: float
    total_semana: float
    total_mes: float
    total_tpv: float
    total_efectivo: float
    num_ventas_hoy: int
    num_mensajes_sin_leer: int
    num_productos_agotados: int