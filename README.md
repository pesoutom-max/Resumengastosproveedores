# Resumen de Gastos por Proveedor

Aplicación web para clasificar y resumir gastos mensuales por proveedor a partir de planillas Excel o CSV.

## Características

- ✅ Subida de planillas (Excel `.xlsx`, `.xls` o CSV)
- ✅ Clasificación automática de gastos por proveedor
- ✅ Resumen visual con gráficos (pastel, barras)
- ✅ Tabla de detalle de todos los gastos
- ✅ Almacenamiento en PostgreSQL (Supabase)
- ✅ API REST para procesamiento de datos

## Stack Tecnológico

### Frontend
- React 18
- Vite
- Recharts (gráficos)
- Axios (HTTP client)
- XLSX (procesamiento de Excel)

### Backend
- Node.js + Express
- Supabase/PostgreSQL
- Multer (carga de archivos)
- CSV-parser

### Base de Datos
- PostgreSQL (via Supabase)

## Requisitos Previos

- Node.js 16+
- npm o yarn
- Cuenta en Supabase

## Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/pesoutom-max/Resumengastosproveedores.git
cd Resumengastosproveedores
```

### 2. Instalar Dependencias

```bash
npm install
```

Esto instalará las dependencias de backend y frontend.

### 3. Configurar Variables de Entorno

#### Backend (.env)
Copia `.env.example` a `.env` y completa con tus credenciales de Supabase:

```bash
cp backend/.env.example backend/.env
```

Edita `backend/.env`:
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Crear Tabla en Supabase

Conectate a tu base de datos Supabase SQL y ejecuta:

```sql
CREATE TABLE expenses (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  date DATE NOT NULL,
  provider TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  category TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_provider ON expenses(provider);
CREATE INDEX idx_date ON expenses(date);
```

## Desarrollo

### Ejecutar en Modo Desarrollo

```bash
npm run dev
```

Esto inicia:
- Backend en `http://localhost:5000`
- Frontend en `http://localhost:3000`

### Estructura del Proyecto

```
Resumengastosproveedores/
├── backend/
│   ├── src/
│   │   └── index.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUploader.jsx
│   │   │   ├── ExpensesSummary.jsx
│   │   │   └── ExpensesTable.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json
└── .gitignore
```

## Uso

1. **Subir Planilla**: Haz clic en el área de carga o arrastra un archivo Excel/CSV
2. **Procesar**: El archivo se procesa y se clasifican los gastos
3. **Ver Resumen**: Visualiza gráficos y totales por proveedor
4. **Detalle**: En la tabla inferior ves todos los gastos individuales

### Formato de Planilla

Asegúrate de que tu planilla tenga las siguientes columnas:

| Fecha | Proveedor | Monto | Categoría | Descripción |
|-------|-----------|-------|-----------|------------|
| 2026-01-15 | Proveedor A | 1000.00 | Servicios | Descripción |
| 2026-01-16 | Proveedor B | 500.50 | Bienes | Descripción |

Las pequeñas variaciones en nombres (fecha/Fecha, monto/Monto) son toleradas.

## API Endpoints

### POST /api/upload
Subir y procesar gastos desde JSON.

```javascript
POST /api/upload
Content-Type: application/json

{
  "expenses": [
    {
      "date": "2026-01-15",
      "provider": "Proveedor A",
      "amount": 1000.00,
      "category": "Servicios",
      "description": "Descripción del gasto"
    }
  ]
}
```

Respuesta:
```json
{
  "success": true,
  "inserted": 1
}
```

### GET /api/expenses
Obtener todos los gastos.

```javascript
GET /api/expenses

Respuesta:
[
  {
    "id": 1,
    "date": "2026-01-15",
    "provider": "Proveedor A",
    "amount": 1000.00,
    "category": "Servicios",
    "description": "Descripción",
    "created_at": "2026-01-15T10:00:00Z"
  }
]
```

### GET /api/summary
Obtener resumen por proveedor.

```javascript
GET /api/summary

Respuesta:
{
  "Proveedor A": 2500.00,
  "Proveedor B": 1500.00
}
```

### GET /api/health
Verificar estado de la conexión.

```javascript
GET /api/health

Respuesta:
{
  "status": "ok",
  "database": "connected"
}
```

## Despliegue

### En Vercel

1. **Conecta tu repositorio**:
   - Ve a [Vercel](https://vercel.com)
   - Haz clic en "New Project"
   - Importa tu repositorio GitHub

2. **Configura las variables de entorno**:
   En `Project Settings` → `Environment Variables`, agrega:
   ```
   SUPABASE_URL=https://dnnnpvlfrjmgcurvcueg.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRubm5wdmxmcmptZ2N1cnZjdWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTU0OTgsImV4cCI6MjA5MTMzMTQ5OH0.1ybPgJevNZbiTKqucvpzrZasXfDZim49qrlX1hHJ2Ag
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRubm5wdmxmcmptZ2N1cnZjdWVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTc1NTQ5OCwiZXhwIjoyMDkxMzMxNDk4fQ.AJviVXMy6zlud6YLiRY-pniULYbklIaoanbdq5A96z0
   ```

3. **Despliega**:
   - Vercel detectará automáticamente la configuración
   - El frontend se construirá y las APIs estarán disponibles

### Verificación

Después del despliegue, verifica:
- **Frontend**: Tu dominio de Vercel debería mostrar la app
- **API Health**: `https://tu-dominio.vercel.app/api/health`
- **Subida**: Prueba subir una planilla Excel

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/mejora`
3. Haz commit: `git commit -m 'Agrega mejora'`
4. Push: `git push origin feature/mejora`
5. Abre un Pull Request

## Licencia

MIT

## Soporte

Para problemas o preguntas, abre un issue en el repositorio.
