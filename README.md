# Aula Virtual Inteligente (AV-IA) 🚀

Este proyecto es un Sistema de Aula Virtual de última generación que integra un Asistente de IA con arquitectura RAG (Generación Aumentada por Recuperación). Permite que un modelo de lenguaje (Llama 3) responda preguntas basadas específicamente en los materiales cargados en el curso, proporcionando una experiencia de aprendizaje personalizada y contextualizada.

---

## 🛠️ Guía de Instalación Paso a Paso

Sigue estos pasos en orden para configurar y ejecutar la aplicación correctamente desde cero.

### 1. Requisitos Previos
Asegúrate de tener instalados los siguientes componentes:
- **[Node.js](https://nodejs.org/)** (Versión 18.0.0 o superior)
- **[Git](https://git-scm.com/)**
- Una cuenta en **[Supabase](https://supabase.com/)** (Base de datos y Autenticación)
- Una API Key de **[Groq](https://console.groq.com/keys)** (Para el motor de inferencia de IA)

---

### 2. Clonar e Instalar
Abre tu terminal y ejecuta los siguientes comandos:

```bash
# 1. Clonar el repositorio
git clone https://github.com/Gavyjose/AV-IA.git

# 2. Entrar a la carpeta del proyecto
cd AV-IA

# 3. Instalar las dependencias de Node.js
npm install
```

---

### 3. Configuración de la Base de Datos (Supabase)

Este es el paso más importante para que la IA funcione. Debes preparar tu proyecto de Supabase siguiendo este orden en el **SQL Editor**:

#### A. Habilitar Extensiones Necesarias
Ejecuta esto primero para permitir el manejo de vectores y IDs únicos:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

#### B. Script Maestro de Tablas
Copia y ejecuta el siguiente bloque SQL para crear toda la estructura del sistema (Perfiles, Cursos, IA y Analíticas):

```sql
-- 1. Perfiles de Usuario
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Cursos
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    teacher_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Documentos (Cerebro de la IA)
CREATE TABLE public.documents (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Secciones Vectorizadas (Para búsqueda semántica)
CREATE TABLE public.document_sections (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    document_id BIGINT REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding VECTOR(384), -- Dimensión para modelo All-MiniLM-L6-v2
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Analíticas y Logs de Chat
CREATE TABLE public.chat_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_query TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    liked BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Habilitar RLS (Row Level Security) - Básico
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for profiles" ON user_profiles FOR SELECT USING (true);
```

#### C. Crear Función de Búsqueda de IA (RPC)
Ejecuta este código para que la aplicación pueda consultar los vectores de conocimiento:

```sql
CREATE OR REPLACE FUNCTION match_document_sections (
  query_embedding VECTOR(384),
  match_threshold FLOAT,
  match_count INT,
  p_course_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id BIGINT,
  document_id BIGINT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    document_sections.id,
    document_sections.document_id,
    document_sections.content,
    1 - (document_sections.embedding <=> query_embedding) AS similarity
  FROM document_sections
  JOIN documents ON documents.id = document_sections.document_id
  WHERE (p_course_id IS NULL OR documents.course_id = p_course_id)
    AND 1 - (document_sections.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
```

---

### 4. Configurar Variables de Entorno

Crea un archivo llamado `.env.local` en la raíz del proyecto (donde está este README) y completa la siguiente información:

```env
# Supabase (Obtenlas en Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon
SUPABASE_SERVICE_ROLE_KEY=tu-clave-service-role # ¡CRÍTICO para la ingesta de IA!

# Groq (Obtenla en console.groq.com)
GROQ_API_KEY=gsk_tu_clave_aqui
```

---

### 5. ¿Cómo "Entrenar" la IA del Aula?

La IA utiliza un proceso llamado **RAG** para aprender. Sigue estos pasos para cargarle conocimiento:

1.  **Registra un Usuario**: Crea una cuenta en la app e inicia sesión.
2.  **Asigna Rol de Profesor**: En Supabase, cambia el `role` de tu usuario en la tabla `user_profiles` a `'teacher'`.
3.  **Crea un Curso**: Ve al panel y crea una materia (esto te dará un `course_id`).
4.  **Alimentar la IA**: Dirígete a `/dashboard/ai-admin`.
5.  **Carga Material**: Sube archivos (PDF, DOCX, TXT) o pega texto plano. El sistema:
    *   Dividirá el texto en fragmentos.
    *   Generará "vectores" (huellas digitales matemáticas) del contenido.
    *   Lo guardará en Supabase.
6.  **Prueba**: Ve al aula virtual de ese curso, abre el chat y pregunta sobre lo que acabas de subir.

---

### 6. Funciones Especiales de Usuario

*   **Administrador**: Gestión total de usuarios y perfiles globales (`/dashboard/admin`).
*   **Profesor**: Puede "entrenar" la IA, subir guías de estudio y ver analíticas de qué preguntan sus alumnos (`/dashboard/ai-analytics`).
*   **Estudiante**: Acceso a materiales interactivos y asistencia de IA 24/7 contextualizada a su materia.

---

### 7. Ejecución Local

Para ver los cambios en vivo, ejecuta:
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🚀 Notas de Mejora Continua
Si clonas este proyecto en otro equipo, asegúrate de:
1. Volver a instalar dependencias con `npm install`.
2. Verificar que el archivo `.env.local` tenga las llaves correctas del nuevo proyecto de Supabase.
3. El modelo de IA (`all-MiniLM-L6-v2`) se descarga automáticamente la primera vez que ingestas un documento (pesa aprox. 80MB).

---
© 2024 AV-IA Project - "IA al servicio de la educación".

