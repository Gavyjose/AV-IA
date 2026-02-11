-- =====================================================
-- SEED DATA: Create Initial Admin User
-- =====================================================

-- Step 1: First, create the user in Supabase Auth Dashboard
-- Go to Authentication > Users > Add user
-- Email: admin@avirtualia.com
-- Password: Admin123!@# (or your preferred password)
-- Auto Confirm User: YES
-- Copy the UUID generated

-- Step 2: Once you have the UUID, run this SQL replacing YOUR_USER_UUID
-- Example UUID: a1b2c3d4-e5f6-7890-abcd-ef1234567890

-- Insert user profile
INSERT INTO user_profiles (id, email, full_name, role, is_active)
VALUES (
    'fcd46adc-e2ea-4bfc-97ec-54677977c3f3', -- ID del usuario autenticado
    'admin@avirtualia.com',
    'Administrador Principal',
    'admin',
    true
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active;

-- Insert admin profile
INSERT INTO admin_profiles (id, admin_level)
VALUES (
    'fcd46adc-e2ea-4bfc-97ec-54677977c3f3', -- Mismo ID anterior
    'super'
)
ON CONFLICT (id) DO UPDATE SET
    admin_level = EXCLUDED.admin_level;

-- =====================================================
-- SEED DATA: Sample Careers and Subjects (Optional)
-- =====================================================

-- Insert sample career
INSERT INTO careers (code, name, description, duration_semesters, total_credits, modality)
VALUES 
    ('ING-SIS', 'Ingeniería en Sistemas', 'Carrera de desarrollo de software y sistemas', 10, 180, 'semester'),
    ('ING-INF', 'Ingeniería Informática', 'Carrera de tecnologías de información', 10, 175, 'semester');

-- Insert sample subjects
INSERT INTO subjects (code, name, description, credits, hours_per_week)
VALUES 
    ('MAT-101', 'Matemática I', 'Fundamentos de cálculo diferencial', 4, 6),
    ('PRG-101', 'Programación I', 'Introducción a la programación', 4, 6),
    ('FIS-101', 'Física I', 'Mecánica clásica', 4, 6),
    ('ALG-101', 'Álgebra Lineal', 'Matrices y vectores', 3, 4);

-- Verify data
SELECT 'User Profiles' as table_name, COUNT(*) as count FROM user_profiles
UNION ALL
SELECT 'Admin Profiles', COUNT(*) FROM admin_profiles
UNION ALL
SELECT 'Careers', COUNT(*) FROM careers
UNION ALL
SELECT 'Subjects', COUNT(*) FROM subjects;
