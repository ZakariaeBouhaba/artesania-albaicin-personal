"""Funciones para hablar con Cloudinary. Un solo sitio para toda la configuración."""
from urllib.parse import unquote

import cloudinary
import cloudinary.uploader

from config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)

CARPETA = "artesania_albaicin"


def subir_imagen(archivo, producto_id: int) -> dict:
    """Sube una imagen con un nombre único generado por Cloudinary."""
    return cloudinary.uploader.upload(
        archivo,
        folder=CARPETA,
        tags=[f"producto_{producto_id}"],
    )


def borrar_imagen(public_id: str) -> None:
    """Borra una imagen. Lanza error si Cloudinary no responde bien."""
    resultado = cloudinary.uploader.destroy(public_id)
    if resultado.get("result") not in ("ok", "not found"):
        raise RuntimeError(f"Cloudinary respondió: {resultado}")


def public_id_desde_url(url: str) -> str:
    """Para fotos antiguas sin public_id guardado: lo deduce de la URL."""
    ruta = unquote(url.split("/upload/", 1)[-1])
    partes = ruta.split("/")
    if partes and partes[0].startswith("v") and partes[0][1:].isdigit():
        partes = partes[1:]
    ruta = "/".join(partes)
    return ruta.rsplit(".", 1)[0] if "." in ruta.split("/")[-1] else ruta