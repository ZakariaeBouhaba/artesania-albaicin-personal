from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Optional, List, Literal
from datetime import datetime

# ─── VALORES PERMITIDOS ───
Rol = Literal["admin", "encargado"]
EstadoProducto = Literal["disponible", "agotado", "bajo_pedido"]
MetodoPago = Literal["TPV", "Efectivo"]


# ─── USUARIOS ───
class UsuarioBase(BaseModel):
    nombre: str = Field(min_length=1, max_length=100)
    email: EmailStr
    rol: Rol = "encargado"

class UsuarioCreate(UsuarioBase):
    contrasena: str = Field(min_length=8, max_length=128)

class UsuarioResponse(UsuarioBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# ─── LOGIN ───
class LoginSchema(BaseModel):
    email: EmailStr
    contrasena: str

class TokenSchema(BaseModel):
    access_token: str
    token_type: str

# ─── CATEGORIAS ───
class CategoriaBase(BaseModel):
    nombre: str = Field(min_length=1, max_length=100)
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaResponse(CategoriaBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# ─── PRODUCTOS ───
class ProductoBase(BaseModel):
    nombre: str = Field(min_length=1, max_length=200)
    descripcion: Optional[str] = None
    origen: Optional[str] = None
    material: Optional[str] = None
    hecho_a_mano: bool = True
    categoria_id: int
    imagen_url: Optional[str] = None
    estado: EstadoProducto = "disponible"

class ProductoCreate(ProductoBase):
    pass

class ProductoUpdate(BaseModel):
    nombre: Optional[str] = Field(default=None, min_length=1, max_length=200)
    descripcion: Optional[str] = None
    origen: Optional[str] = None
    material: Optional[str] = None
    hecho_a_mano: Optional[bool] = None
    categoria_id: Optional[int] = None
    imagen_url: Optional[str] = None
    estado: Optional[EstadoProducto] = None

class ImagenProductoResponse(BaseModel):
    id: int
    producto_id: int
    imagen_url: str
    model_config = ConfigDict(from_attributes=True)

class ProductoResponse(ProductoBase):
    id: int
    categoria: Optional[CategoriaResponse] = None
    imagenes: Optional[List[ImagenProductoResponse]] = None
    model_config = ConfigDict(from_attributes=True)

# ─── MENSAJES ───
class MensajeBase(BaseModel):
    nombre: str = Field(min_length=1, max_length=100)
    email: EmailStr
    asunto: str = Field(min_length=1, max_length=200)
    mensaje: str = Field(min_length=1, max_length=2000)

class MensajeCreate(MensajeBase):
    pass

class MensajeResponse(MensajeBase):
    id: int
    fecha: datetime
    leido: bool
    model_config = ConfigDict(from_attributes=True)

# ─── VENTAS ───
class VentaBase(BaseModel):
    descripcion: str = Field(min_length=1, max_length=300)
    precio_original: float = Field(gt=0)
    descuento: float = Field(default=0.0, ge=0)
    metodo_pago: MetodoPago
    notas: Optional[str] = None

class VentaCreate(VentaBase):
    # El total NO lo envía el cliente: lo calcula el servidor
    pass

class VentaResponse(VentaBase):
    id: int
    fecha: datetime
    total_final: float
    model_config = ConfigDict(from_attributes=True)

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