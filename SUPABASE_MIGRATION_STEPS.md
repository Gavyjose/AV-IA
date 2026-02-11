# Instrucciones para Ejecutar la Migración SQL en Supabase

## 🎯 Objetivo
Crear todas las tablas necesarias en tu base de datos de Supabase.

---

## 📋 Pasos a Seguir

### 1. Abrir el SQL Editor en Supabase

1. Ve a tu proyecto en Supabase: https://app.supabase.com
2. En el menú lateral izquierdo, busca y haz clic en **🗄️ SQL Editor**
3. Haz clic en el botón **"New query"** (arriba a la derecha)

### 2. Copiar el Script SQL

1. Abre el archivo: `d:/Desktop/Antigravity/AV-IA/supabase/migrations/001_initial_schema.sql`
2. Selecciona TODO el contenido (Ctrl+A)
3. Copia el contenido (Ctrl+C)

### 3. Pegar y Ejecutar

1. Vuelve al SQL Editor de Supabase
2. Pega el contenido completo en el editor (Ctrl+V)
3. Haz clic en el botón **"Run"** (o presiona Ctrl+Enter)
4. Espera unos segundos...

### 4. Verificar Resultado

Deberías ver un mensaje como:
```
✅ Success. No rows returned
```

Esto significa que todas las tablas se crearon correctamente.

### 5. Verificar Tablas Creadas

1. En el menú lateral, ve a **📊 Table Editor**
2. Deberías ver las siguientes 8 tablas:
   - ✅ `user_profiles`
   - ✅ `student_profiles`
   - ✅ `teacher_profiles`
   - ✅ `admin_profiles`
   - ✅ `careers`
   - ✅ `subjects`
   - ✅ `career_subjects`
   - ✅ `subject_prerequisites`

---

## 🚨 Si hay algún error

- **Error: "extension uuid-ossp does not exist"**
  - Esto es normal, Supabase lo creará automáticamente
  
- **Error: "relation already exists"**
  - Significa que ya ejecutaste el script antes
  - Puedes ignorarlo o eliminar las tablas y volver a ejecutar

---

## ✅ Una vez completado

Avísame cuando hayas ejecutado la migración exitosamente y continuaremos con:
- Crear el usuario administrador inicial
- Probar la conexión desde la aplicación
- Refactorizar el login para usar Supabase Auth
