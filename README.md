# Aula Virtual Inteligente (AV-IA) 🚀

Este proyecto es un Sistema de Aula Virtual de última generación que integra un Asistente de IA con arquitectura RAG (Generación Aumentada por Recuperación), permitiendo que un modelo de lenguaje (Llama 3) responda preguntas basadas específicamente en los materiales cargados en el curso.

---

## 🛠️ Guía de Instalación Paso a Paso

Sigue estos pasos en orden para configurar y ejecutar la aplicación correctamente.

### 1. Requisitos Previos
Asegúrate de tener instalados los siguientes componentes:
- [Node.js](https://nodejs.org/) (Versión 18 o superior)
- [Git](https://git-scm.com/)
- Una cuenta en [Supabase](https://supabase.com/)
- Una API Key de [Groq](https://console.groq.com/keys) (Gratuita)

---

### 2. Clonar e Instalar
Abre una terminal y ejecuta:

```bash
# Clonar el repositorio
git clone https://github.com/Gavyjose/AV-IA.git

# Entrar a la carpeta
cd AV-IA

# Instalar dependencias
npm install
```

---

### 3. Configuración de la Base de Datos (Supabase)
Debes preparar tu proyecto de Supabase para manejar vectores y analíticas.

1. Ve a tu proyecto en Supabase -> **SQL Editor**.
2. Ejecuta los siguientes scripts en orden:

#### A. Habilitar la extensión de vectores:
```sql
create extension if not exists vector;
```

#### B. Crear tablas del sistema:
```sql
-- Tabla principal de documentos
create table documents (
  id bigint generated always as identity primary key,
  title text not null,
  content text not null,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Secciones vectorizadas de los documentos
create table document_sections (
  id bigint generated always as identity primary key,
  document_id bigint references documents(id) on delete cascade,
  content text not null,
  embedding vector(384), -- Usando All-MiniLM-L6-v2 (384 dimensiones)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabla de registro de consultas (Analíticas)
create table chat_logs (
  id bigint generated always as identity primary key,
  user_query text not null,
  ai_response text not null,
  liked boolean, -- Feedback 👍/👎
  created_at timestamp with time zone default now() not null
);
```

#### C. Crear función de búsqueda IA:
```sql
create or replace function match_document_sections (
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  document_id bigint,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    document_sections.id,
    document_sections.document_id,
    document_sections.content,
    1 - (document_sections.embedding <=> query_embedding) as similarity
  from document_sections
  where 1 - (document_sections.embedding <=> query_embedding) > match_threshold
  order by document_sections.embedding <=> query_embedding
  limit match_count;
end;
$$;
```

---

### 4. Configurar Variables de Entorno
Crea un archivo llamado `.env.local` en la raíz del proyecto y pega tus credenciales:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY # Necesaria para la ingesta de documentos

# Groq (Inferencia IA rápida)
GROQ_API_KEY=gsk_tu_clave_de_groq_aqui
```

---

### 5. Iniciar la Aplicación
En la terminal, ejecuta:

```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 🧠 ¿Cómo "Entrenar" la IA del Aula?

La IA no sabe nada al principio. Debes cargarle información:

1. **Panel de Admin**: Ve a la ruta `/dashboard/ai-admin`.
2. **Subir Contenido**: Pega texto de tus clases o sube materiales informativos.
3. **Procesamiento**: Haz clic en "Procesar/Ingestar". El sistema generará vectores locales y los guardará en tu base de datos.
4. **¡Listo!**: Abre el chat flotante en cualquier página y pregunta sobre los materiales cargados.

---

## 📊 Funciones Especiales de Usuario

- **Vista de Administrador**: Accede a `/dashboard/admin` para gestionar el sistema.
- **Vista Previa de Roles**: Desde el panel de admin, usa la tarjeta "Vista de Roles" para probar la plataforma como estudiante o docente sin cambiar de cuenta.
- **Analíticas de IA**: El docente puede visualizar en tiempo real qué están preguntando los alumnos en `/dashboard/ai-analytics`.

---
© 2024 AV-IA Project - Desarrollado para una educación más inteligente.
