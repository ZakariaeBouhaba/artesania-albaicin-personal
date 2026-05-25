from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    contrasena = Column(String, nullable=False)
    rol = Column(String, default="encargado")  # admin / encargado

class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(String, nullable=True)
    imagen_url = Column(String, nullable=True)
    productos = relationship("Producto", back_populates="categoria")

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(Text, nullable=True)
    origen = Column(String, nullable=True)
    material = Column(String, nullable=True)
    hecho_a_mano = Column(Boolean, default=True)
    categoria_id = Column(Integer, ForeignKey("categorias.id"))
    imagen_url = Column(String, nullable=True)
    estado = Column(String, default="disponible")  # disponible / agotado / bajo_pedido
    categoria = relationship("Categoria", back_populates="productos")
    imagenes = relationship("ImagenProducto", back_populates="producto")

class ImagenProducto(Base):
    __tablename__ = "imagenes_productos"

    id = Column(Integer, primary_key=True, index=True)
    producto_id = Column(Integer, ForeignKey("productos.id"))
    imagen_url = Column(String, nullable=False)
    producto = relationship("Producto", back_populates="imagenes")

class Mensaje(Base):
    __tablename__ = "mensajes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    email = Column(String, nullable=False)
    asunto = Column(String, nullable=False)
    mensaje = Column(Text, nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow)
    leido = Column(Boolean, default=False)

class Venta(Base):
    __tablename__ = "ventas"

    id = Column(Integer, primary_key=True, index=True)
    fecha = Column(DateTime, default=datetime.utcnow)
    descripcion = Column(String, nullable=False)
    precio_original = Column(Float, nullable=False)
    descuento = Column(Float, default=0.0)
    total_final = Column(Float, nullable=False)
    metodo_pago = Column(String, nullable=False)  # TPV / Efectivo
    notas = Column(String, nullable=True)