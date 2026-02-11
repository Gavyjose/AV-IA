-- =====================================================
-- MIGRATION 001: Initial Schema
-- Description: Create base tables for authentication and user management
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USER PROFILES (extends Supabase Auth)
-- =====================================================

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

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- =====================================================
-- 2. STUDENT PROFILES
-- =====================================================

CREATE TABLE public.student_profiles (
    id UUID PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
    student_code TEXT UNIQUE NOT NULL,
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    current_semester INTEGER,
    gpa DECIMAL(3,2) DEFAULT 0.00 CHECK (gpa >= 0 AND gpa <= 10),
    total_credits_approved INTEGER DEFAULT 0 CHECK (total_credits_approved >= 0),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'suspended'))
);

ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own profile"
    ON student_profiles FOR SELECT
    USING (auth.uid() = id);

-- =====================================================
-- 3. TEACHER PROFILES
-- =====================================================

CREATE TABLE public.teacher_profiles (
    id UUID PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
    employee_code TEXT UNIQUE NOT NULL,
    department TEXT,
    specialization TEXT,
    hire_date DATE NOT NULL DEFAULT CURRENT_DATE
);

ALTER TABLE teacher_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view own profile"
    ON teacher_profiles FOR SELECT
    USING (auth.uid() = id);

-- =====================================================
-- 4. ADMIN PROFILES
-- =====================================================

CREATE TABLE public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
    admin_level TEXT DEFAULT 'support' CHECK (admin_level IN ('super', 'academic', 'support'))
);

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view own profile"
    ON admin_profiles FOR SELECT
    USING (auth.uid() = id);

-- =====================================================
-- 5. CAREERS
-- =====================================================

CREATE TABLE public.careers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    duration_semesters INTEGER NOT NULL CHECK (duration_semesters > 0),
    total_credits INTEGER NOT NULL CHECK (total_credits > 0),
    modality TEXT DEFAULT 'semester' CHECK (modality IN ('semester', 'trimester', 'quarter')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE careers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active careers"
    ON careers FOR SELECT
    USING (is_active = true);

-- =====================================================
-- 6. SUBJECTS
-- =====================================================

CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    credits INTEGER NOT NULL CHECK (credits > 0),
    hours_per_week INTEGER CHECK (hours_per_week > 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active subjects"
    ON subjects FOR SELECT
    USING (is_active = true);

-- =====================================================
-- 7. CAREER SUBJECTS (Pensum)
-- =====================================================

CREATE TABLE public.career_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    semester INTEGER NOT NULL CHECK (semester > 0),
    is_required BOOLEAN DEFAULT true,
    UNIQUE(career_id, subject_id)
);

ALTER TABLE career_subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view career subjects"
    ON career_subjects FOR SELECT
    USING (true);

-- =====================================================
-- 8. SUBJECT PREREQUISITES
-- =====================================================

CREATE TABLE public.subject_prerequisites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    prerequisite_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE(subject_id, prerequisite_id),
    CHECK (subject_id != prerequisite_id)
);

ALTER TABLE subject_prerequisites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view prerequisites"
    ON subject_prerequisites FOR SELECT
    USING (true);

-- =====================================================
-- INDEXES for Performance
-- =====================================================

CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_student_profiles_code ON student_profiles(student_code);
CREATE INDEX idx_teacher_profiles_code ON teacher_profiles(employee_code);
CREATE INDEX idx_careers_code ON careers(code);
CREATE INDEX idx_subjects_code ON subjects(code);
CREATE INDEX idx_career_subjects_career ON career_subjects(career_id);
CREATE INDEX idx_career_subjects_subject ON career_subjects(subject_id);

-- =====================================================
-- TRIGGERS for updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
