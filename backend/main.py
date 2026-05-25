from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import productos, categorias, contacto, auth, ventas, estadisticas, imagenes

# Crear las tablas en la base de datos
models.Base.metadata.create_all(bind=engine)

# Crear la aplicación
app = FastAPI(
    title="Artesanía Albaicín API",
    description="API para la gestión de la tienda Artesanía Albaicín",
    version="1.0.0"
)

# Configurar CORS para que el frontend pueda llamar al backend
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

# Arrancar el servidor
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)