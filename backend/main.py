from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import productos, categorias, contacto, auth, ventas, estadisticas, imagenes
from routers.auth import get_admin_user
import os
import sqlite3
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler

# Crear las tablas en la base de datos
models.Base.metadata.create_all(bind=engine)

# ─── BACKUP AUTOMÁTICO ───
def hacer_backup():
    db_path = os.path.join(os.path.dirname(__file__), 'artesania.db')
    backup_dir = os.path.join(os.path.dirname(__file__), 'backups')
    os.makedirs(backup_dir, exist_ok=True)

    fecha = datetime.now().strftime('%Y-%m-%d_%H-%M')
    backup_path = os.path.join(backup_dir, f'artesania_backup_{fecha}.db')

    # Copia segura con la API de SQLite (válida aunque se esté escribiendo)
    origen = sqlite3.connect(db_path)
    destino = sqlite3.connect(backup_path)
    try:
        origen.backup(destino)
    finally:
        destino.close()
        origen.close()
    print(f"✅ Backup realizado: {backup_path}")

    # Mantener solo los últimos 7 backups
    backups = sorted([
        f for f in os.listdir(backup_dir) if f.endswith('.db')
    ])
    while len(backups) > 7:
        os.remove(os.path.join(backup_dir, backups.pop(0)))
        print("🗑️  Backup antiguo eliminado")

# Programar backup diario a medianoche
scheduler = BackgroundScheduler()
scheduler.add_job(hacer_backup, 'cron', hour=0, minute=0)
scheduler.start()

# Hacer backup al arrancar el servidor
hacer_backup()

# Crear la aplicación
app = FastAPI(
    title="Artesanía Albaicín API",
    description="API para la gestión de la tienda Artesanía Albaicín",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conectar los routers
app.include_router(auth.router, prefix="/auth", tags=["Autenticación"])
app.include_router(productos.router, prefix="/productos", tags=["Productos"])
app.include_router(categorias.router, prefix="/categorias", tags=["Categorías"])
app.include_router(contacto.router, prefix="/contacto", tags=["Contacto"])
app.include_router(ventas.router, prefix="/ventas", tags=["Ventas"])
app.include_router(estadisticas.router, prefix="/estadisticas", tags=["Estadísticas"])
app.include_router(imagenes.router, prefix="/imagenes", tags=["Imágenes"])

# Ruta principal
@app.get("/")
def root():
    return {"mensaje": "Bienvenido a la API de Artesanía Albaicín"}

# Ruta para hacer backup manual (solo admin)
@app.post("/backup")
def backup_manual(current_user: models.Usuario = Depends(get_admin_user)):
    try:
        hacer_backup()
        return {"mensaje": "Backup realizado correctamente"}
    except Exception:
        raise HTTPException(status_code=500, detail="No se pudo realizar el backup")

# Arrancar el servidor
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)