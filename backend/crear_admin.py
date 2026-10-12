"""
Crea (o actualiza) un usuario administrador.

Uso, desde la carpeta backend:
    python3 crear_admin.py

El script pide el email y la contraseña por teclado, así que no
queda ninguna credencial escrita en el código ni en el historial de Git.
"""
import getpass
import sys

import bcrypt

import models
from database import SessionLocal, engine

MIN_LONGITUD_CONTRASENA = 8


def pedir_contrasena() -> str:
    while True:
        contrasena = getpass.getpass("Contraseña (no se ve al escribir): ")
        if len(contrasena) < MIN_LONGITUD_CONTRASENA:
            print(f"Debe tener al menos {MIN_LONGITUD_CONTRASENA} caracteres.")
            continue
        if contrasena != getpass.getpass("Repite la contraseña: "):
            print("Las contraseñas no coinciden. Inténtalo de nuevo.")
            continue
        return contrasena


def encriptar(contrasena: str) -> str:
    return bcrypt.hashpw(contrasena.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def main() -> None:
    # Por si es la primera vez y la base de datos todavía no existe
    models.Base.metadata.create_all(bind=engine)

    email = input("Email del administrador: ").strip().lower()
    if "@" not in email or "." not in email.split("@")[-1]:
        print("El email no parece válido.")
        sys.exit(1)

    db = SessionLocal()
    try:
        usuario = db.query(models.Usuario).filter(models.Usuario.email == email).first()

        if usuario:
            respuesta = input(
                "Ese usuario ya existe. ¿Cambiar su contraseña y dejarlo como admin? (s/n): "
            ).strip().lower()
            if respuesta != "s":
                print("No se ha cambiado nada.")
                return
            usuario.contrasena = encriptar(pedir_contrasena())
            usuario.rol = "admin"
            db.commit()
            print(f"✅ Usuario {email} actualizado como admin.")
            return

        nombre = input("Nombre: ").strip() or "Administrador"
        nuevo = models.Usuario(
            nombre=nombre,
            email=email,
            contrasena=encriptar(pedir_contrasena()),
            rol="admin",
        )
        db.add(nuevo)
        db.commit()
        print(f"✅ Administrador {email} creado correctamente.")
    finally:
        db.close()


if __name__ == "__main__":
    main()