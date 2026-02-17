-- Clean Reset
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS employee_days_off CASCADE;
DROP TABLE IF EXISTS employee_services CASCADE;
DROP TABLE IF EXISTS availability CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- 1. Categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    icon_name TEXT,
    -- To match lucide-react icons: Heart, Sparkles, Scissors, User, Zap, Star
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 2. Services
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE
    SET NULL,
        name TEXT NOT NULL,
        description TEXT,
        duration INTEGER NOT NULL,
        -- in minutes
        price DECIMAL(10, 2) NOT NULL,
        image_url TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 3. Employees (Staff)
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    bio TEXT,
    image_url TEXT,
    date_joined DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 4. Employee Services (Junction Table)
CREATE TABLE employee_services (
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    PRIMARY KEY (employee_id, service_id)
);
-- 5. Employee Availability (Weekly Schedule)
CREATE TABLE availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (
        day_of_week BETWEEN 0 AND 6
    ),
    -- 0 = Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_working BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 6. Employee Days Off (Specific Dates)
CREATE TABLE employee_days_off (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    off_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 7. Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE,
    -- Linked to Supabase Auth
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 8. Appointments
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE
    SET NULL,
        service_id UUID REFERENCES services(id) ON DELETE
    SET NULL,
        appointment_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        status TEXT DEFAULT 'pending' CHECK (
            status IN ('pending', 'confirmed', 'cancelled', 'completed')
        ),
        total_amount DECIMAL(10, 2) NOT NULL,
        payment_status TEXT DEFAULT 'unpaid' CHECK (
            payment_status IN ('unpaid', 'paid', 'partially_paid')
        ),
        stripe_payment_intent_id TEXT,
        notes TEXT,
        admin_notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- RLS Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_days_off ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can see categories" ON categories FOR
SELECT TO PUBLIC USING (true);
CREATE POLICY "Public can see services" ON services FOR
SELECT TO PUBLIC USING (true);
CREATE POLICY "Public can see employees" ON employees FOR
SELECT TO PUBLIC USING (true);
CREATE POLICY "Public can see employee services" ON employee_services FOR
SELECT TO PUBLIC USING (true);
CREATE POLICY "Public can see availability" ON availability FOR
SELECT TO PUBLIC USING (true);
CREATE POLICY "Public can see employee days off" ON employee_days_off FOR
SELECT TO PUBLIC USING (true);
CREATE POLICY "Anyone can insert appointments" ON appointments FOR
INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert customers" ON customers FOR
INSERT WITH CHECK (true);
CREATE POLICY "Public can see customers" ON customers FOR
SELECT TO PUBLIC USING (true);
CREATE POLICY "Anyone can see appointments" ON appointments FOR
SELECT USING (true);
-- Initial Data: Categories
INSERT INTO categories (name, icon_name)
VALUES ('Waxing', 'Scissors'),
    ('Eyelashes & Eyebrows', 'Sparkles'),
    ('Aesthetics', 'Heart'),
    ('Semi permanent makeup', 'Star'),
    ('Nails', 'Scissors'),
    ('Hair', 'User'),
    ('Face', 'Sparkles'),
    ('Consultation', 'User'),
    ('Body', 'Heart');
-- Initial Data: Services (Waxing)
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Underarm wax',
    20,
    20.00,
    'Smooth and clean underarm waxing.'
FROM categories
WHERE name = 'Waxing';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Half Arm wax',
    30,
    30.00,
    'Excludes shoulders.'
FROM categories
WHERE name = 'Waxing';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Full arm wax',
    40,
    40.00,
    'Complete arm hair removal.'
FROM categories
WHERE name = 'Waxing';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Full back wax',
    50,
    30.00,
    'Clean and smooth back.'
FROM categories
WHERE name = 'Waxing';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Stomach Wax',
    40,
    20.00,
    'Lower and upper stomach area.'
FROM categories
WHERE name = 'Waxing';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Half leg wax',
    30,
    30.00,
    'Up to the knee.'
FROM categories
WHERE name = 'Waxing';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Full leg wax',
    45,
    40.00,
    'Smooth legs from top to bottom.'
FROM categories
WHERE name = 'Waxing';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Eyebrow Wax',
    20,
    20.00,
    'Precise brow shaping.'
FROM categories
WHERE name = 'Waxing';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Chin Wax',
    15,
    10.00,
    'Gentle chin hair removal.'
FROM categories
WHERE name = 'Waxing';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Upper lip Wax',
    15,
    10.00,
    'Smooth upper lip.'
FROM categories
WHERE name = 'Waxing';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Side burn wax',
    15,
    10.00,
    'Clean side burn area.'
FROM categories
WHERE name = 'Waxing';
-- Initial Data: Services (Eyelashes & Eyebrows)
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Eyelash extensions Russian volume',
    120,
    145.00,
    'Ultra-fine multiple lashes for full, fluffy look.'
FROM categories
WHERE name = 'Eyelashes & Eyebrows';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Eyelash extensions Hybrid',
    120,
    115.00,
    'The perfect mix of classic and volume.'
FROM categories
WHERE name = 'Eyelashes & Eyebrows';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Eyelash extension Infill',
    90,
    40.00,
    'Refresh and fill your existing extensions.'
FROM categories
WHERE name = 'Eyelashes & Eyebrows';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Mega Russian volume eyelashes',
    120,
    145.00,
    'Maximum density and drama.'
FROM categories
WHERE name = 'Eyelashes & Eyebrows';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'HD brows',
    60,
    70.00,
    'High-definition brow transformation.'
FROM categories
WHERE name = 'Eyelashes & Eyebrows';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Eyebrow shape',
    60,
    35.00,
    'Expert architecture for your brows.'
FROM categories
WHERE name = 'Eyelashes & Eyebrows';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Eyebrow Lamination',
    30,
    70.00,
    'Smooth, groomed and uniform brow shape.'
FROM categories
WHERE name = 'Eyelashes & Eyebrows';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'EyeLash removal',
    20,
    30.00,
    'Safe and gentle removal of extensions.'
FROM categories
WHERE name = 'Eyelashes & Eyebrows';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Eyelash lift',
    60,
    70.00,
    'Natural lash curl for an open-eye look.'
FROM categories
WHERE name = 'Eyelashes & Eyebrows';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Eyelash Tint',
    30,
    30.00,
    'Darker, fuller looking natural lashes.'
FROM categories
WHERE name = 'Eyelashes & Eyebrows';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Eyebrow tint',
    60,
    45.00,
    'Defined and filled brow color.'
FROM categories
WHERE name = 'Eyelashes & Eyebrows';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Eyelash lift & Tint',
    60,
    70.00,
    'The ultimate natural lash treatment.'
FROM categories
WHERE name = 'Eyelashes & Eyebrows';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Eyebrow shape & tint',
    45,
    50.00,
    'Complete brow grooming package.'
FROM categories
WHERE name = 'Eyelashes & Eyebrows';
-- Initial Data: Services (Aesthetics)
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Face Consultation',
    60,
    50.00,
    'Personalized aesthetic analysis and planning.'
FROM categories
WHERE name = 'Aesthetics';
-- Initial Data: Services (Semi permanent makeup)
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Lip blush',
    180,
    500.00,
    'Enhance lip color and shape.'
FROM categories
WHERE name = 'Semi permanent makeup';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Lip blush touch up',
    60,
    200.00,
    'Maintain your lip blush vibrancy.'
FROM categories
WHERE name = 'Semi permanent makeup';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Microblading Eyebrows',
    180,
    650.00,
    'Natural hair-like strokes for perfect brows.'
FROM categories
WHERE name = 'Semi permanent makeup';
INSERT INTO services (category_id, name, duration, price, description)
SELECT id,
    'Eyebrow touch up',
    60,
    300.00,
    'Maintain your microbladed brows.'
FROM categories
WHERE name = 'Semi permanent makeup';
-- Initial Data: Services (Nails)
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Classic manicure',
    60,
    55.00
FROM categories
WHERE name = 'Nails';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Gel manicure',
    60,
    65.00
FROM categories
WHERE name = 'Nails';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'BIAB manicure',
    70,
    80.00
FROM categories
WHERE name = 'Nails';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Gel Poupée luxury manicure',
    90,
    95.00
FROM categories
WHERE name = 'Nails';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Hard gel extensions',
    120,
    120.00
FROM categories
WHERE name = 'Nails';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Japanese manicure',
    60,
    50.00
FROM categories
WHERE name = 'Nails';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Japanese pedicure',
    60,
    50.00
FROM categories
WHERE name = 'Nails';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Classic pedicure',
    60,
    60.00
FROM categories
WHERE name = 'Nails';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Gel pedicure',
    60,
    70.00
FROM categories
WHERE name = 'Nails';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'BIAB pedicure',
    70,
    80.00
FROM categories
WHERE name = 'Nails';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Gel Poupée luxury pedicure',
    90,
    95.00
FROM categories
WHERE name = 'Nails';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'BIAB take off',
    20,
    10.00
FROM categories
WHERE name = 'Nails';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Gel take off',
    20,
    10.00
FROM categories
WHERE name = 'Nails';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Extension take off',
    30,
    20.00
FROM categories
WHERE name = 'Nails';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'French tip (add on)',
    20,
    20.00
FROM categories
WHERE name = 'Nails';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Nail art (add on)',
    10,
    30.00
FROM categories
WHERE name = 'Nails';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Nail effect (add on)',
    10,
    30.00
FROM categories
WHERE name = 'Nails';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Rubber base (add on)',
    15,
    20.00
FROM categories
WHERE name = 'Nails';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Gel nail repair (per nail)',
    15,
    5.00
FROM categories
WHERE name = 'Nails';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Extension nail repair - (per nail)',
    10,
    10.00
FROM categories
WHERE name = 'Nails';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Classic File and polish',
    30,
    30.00
FROM categories
WHERE name = 'Nails';
-- Initial Data: Services (Hair)
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Olaplex hair treatment',
    60,
    100.00
FROM categories
WHERE name = 'Hair';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Treatment mask',
    60,
    70.00
FROM categories
WHERE name = 'Hair';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Scrub Hair Detox',
    60,
    70.00
FROM categories
WHERE name = 'Hair';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Root',
    60,
    160.00
FROM categories
WHERE name = 'Hair';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Full Head Short Hair',
    60,
    0.00
FROM categories
WHERE name = 'Hair';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Full Head Long Hair',
    60,
    220.00
FROM categories
WHERE name = 'Hair';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Hair extension removal',
    90,
    250.00
FROM categories
WHERE name = 'Hair';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Hair extensions correction',
    75,
    0.00
FROM categories
WHERE name = 'Hair';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Keratin bond hair extensions',
    180,
    0.00
FROM categories
WHERE name = 'Hair';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Micro rings hair extensions',
    180,
    0.00
FROM categories
WHERE name = 'Hair';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Tape hair extensions',
    180,
    0.00
FROM categories
WHERE name = 'Hair';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Weft hair extensions',
    180,
    0.00
FROM categories
WHERE name = 'Hair';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Wash and blow dry',
    60,
    50.00
FROM categories
WHERE name = 'Hair';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Cut',
    60,
    0.00
FROM categories
WHERE name = 'Hair';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Hair Mask',
    60,
    70.00
FROM categories
WHERE name = 'Hair';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Hair Styling',
    60,
    70.00
FROM categories
WHERE name = 'Hair';
-- Initial Data: Services (Face)
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Full Face',
    60,
    0.00
FROM categories
WHERE name = 'Face';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'face threading',
    60,
    0.00
FROM categories
WHERE name = 'Face';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Makeup Glam',
    60,
    0.00
FROM categories
WHERE name = 'Face';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Lift and firm collagen facial',
    30,
    110.00
FROM categories
WHERE name = 'Face';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Poupée detox facial',
    70,
    240.00
FROM categories
WHERE name = 'Face';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Obagi blue peel facial rejuvenation',
    30,
    240.00
FROM categories
WHERE name = 'Face';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Alumier.Md chemical peel facial rejuvenation',
    60,
    200.00
FROM categories
WHERE name = 'Face';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Skinpen micro needling (one area) facial rejuvenation',
    75,
    350.00
FROM categories
WHERE name = 'Face';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Hair removal - upper lip',
    15,
    20.00
FROM categories
WHERE name = 'Face';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Dermal Filler standard area 0.5ml',
    30,
    0.00
FROM categories
WHERE name = 'Face';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Dermal Filler standard area 1ml',
    40,
    0.00
FROM categories
WHERE name = 'Face';
-- Initial Data: Services (Consultation)
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Skin Analysis',
    15,
    0.00
FROM categories
WHERE name = 'Consultation';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Hair Consultation',
    20,
    0.00
FROM categories
WHERE name = 'Consultation';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Medical Consultation',
    20,
    0.00
FROM categories
WHERE name = 'Consultation';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Patch Test',
    20,
    0.00
FROM categories
WHERE name = 'Consultation';
-- Initial Data: Services (Body)
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    '30 Minutes Massage',
    30,
    60.00
FROM categories
WHERE name = 'Body';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    '60 Minutes Body Massage',
    60,
    120.00
FROM categories
WHERE name = 'Body';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Body Contour 1 Session',
    40,
    200.00
FROM categories
WHERE name = 'Body';
INSERT INTO services (category_id, name, duration, price)
SELECT id,
    'Body Sculpt 1 Session',
    40,
    200.00
FROM categories
WHERE name = 'Body';