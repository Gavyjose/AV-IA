# Aula Virtual IA (AV-IA) 🚀

Sistema de Aula Virtual inteligente con integración RAG (Retrieval-Augmented Generation) utilizando modelos de IA Open Source a través de Groq y almacenamiento vectorial en Supabase.

## 📋 Prerrequisitos

- **Node.js**: Versión 18.x o superior.
- **Supabase Account**: Para la base de datos y búsqueda vectorial.
- **Groq API Key**: Para el motor de inferencia Llama 3.

---

## 🛠️ Configuración de la Base de Datos (Supabase)

Para que el sistema de IA funcione, debes configurar Supabase con soporte para vectores:

### 1. Habilitar pgvector
Entra al Editor SQL de tu proyecto en Supabase y ejecuta:
```sql
create extension if not exists vector;
```

### 2. Crear Tablas de Documentos
Ejecuta el siguiente script para crear las tablas necesarias para la IA:

```sql
-- Tabla principal de documentos
create table documents (
  id bigint generated share as identity primary key,
  name text not null,
  storage_path text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Secciones vectorizadas de los documentos
create table document_sections (
  id bigint generated share as identity primary key,
  document_id bigint references documents(id) on delete cascade,
  content text not null,
  embedding vector(384), -- Usando All-MiniLM-L6-v2 (384 dimensiones)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Logs de chat para analíticas
create table chat_logs (
  id bigint generated share as identity primary key,
  user_query text not null,
  ai_response text not null,
  liked boolean,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 3. Crear Función de Búsqueda Vectorial
Ejecuta esto para habilitar la búsqueda por similitud de coseno:

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

## 🔑 Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
# Supabase (Public)
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key

# Supabase (Server Side - CRITICAL: No compartir)
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Groq (Motor IA)
GROQ_API_KEY=tu_gsk_xxx_key
```

---

## 🧠 Entrenamiento y Configuración de IA

El "entrenamiento" en este sistema se realiza mediante la ingesta de documentos (RAG).

1. **Acceso**: Inicia sesión como administrador y ve a `/dashboard/ai-admin`.
2. **Carga**: Sube archivos de texto o pega contenido directamente.
3. **Procesamiento**: El sistema dividirá el texto en fragmentos (chunks) y generará embeddings de forma local usando `Transformers.js`.
4. **Almacenamiento**: Los vectores se guardarán en Supabase para que el asistente pueda consultarlos en tiempo real.

---

## 🚀 Ejecución Local

1. Instala dependencias:
   ```bash
   npm install
   ```

2. Inicia el modo desarrollo:
   ```bash
   npm run dev
   ```

3. Abre [http://localhost:3000](http://localhost:3000).

---

## 👥 Vistas Disponibles

- **Estudiante**: Acceso al aula virtual y chat de asistencia.
- **Docente**: Gestión de clases y **Panel de Analíticas de IA** para ver dudas de alumnos.
- **Administrador**: Gestión global y **Vista Previa de Roles** para testear interfaces.

---
© 2024 AV-IA - Sistema de Aula Virtual Inteligente.
