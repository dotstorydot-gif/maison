-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_days_off ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
-- 1. Public Read Access (for Booking Flow)
DROP POLICY IF EXISTS "Public can see categories" ON categories;
CREATE POLICY "Public can see categories" ON categories FOR
SELECT TO PUBLIC USING (true);
DROP POLICY IF EXISTS "Public can see services" ON services;
CREATE POLICY "Public can see services" ON services FOR
SELECT TO PUBLIC USING (true);
DROP POLICY IF EXISTS "Public can see employees" ON employees;
CREATE POLICY "Public can see employees" ON employees FOR
SELECT TO PUBLIC USING (true);
DROP POLICY IF EXISTS "Public can see employee services" ON employee_services;
CREATE POLICY "Public can see employee services" ON employee_services FOR
SELECT TO PUBLIC USING (true);
DROP POLICY IF EXISTS "Public can see availability" ON availability;
CREATE POLICY "Public can see availability" ON availability FOR
SELECT TO PUBLIC USING (true);
DROP POLICY IF EXISTS "Public can see employee days off" ON employee_days_off;
CREATE POLICY "Public can see employee days off" ON employee_days_off FOR
SELECT TO PUBLIC USING (true);
-- 2. Customer Access
-- Customers can insert themselves (sign up/booking)
DROP POLICY IF EXISTS "Anyone can insert customers" ON customers;
CREATE POLICY "Anyone can insert customers" ON customers FOR
INSERT WITH CHECK (true);
-- Customers can see their own profile (linked by auth.uid)
DROP POLICY IF EXISTS "Customers can view own profile" ON customers;
CREATE POLICY "Customers can view own profile" ON customers FOR
SELECT USING (auth.uid() = user_id);
-- Customers can update their own profile
DROP POLICY IF EXISTS "Customers can update own profile" ON customers;
CREATE POLICY "Customers can update own profile" ON customers FOR
UPDATE USING (auth.uid() = user_id);
-- 3. Appointment Access
DROP POLICY IF EXISTS "Public can insert appointments" ON appointments;
CREATE POLICY "Public can insert appointments" ON appointments FOR
INSERT WITH CHECK (true);
-- Customers can view their own appointments (linked via customer_id -> user_id)
DROP POLICY IF EXISTS "Customers can view own appointments" ON appointments;
CREATE POLICY "Customers can view own appointments" ON appointments FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM customers
            WHERE customers.id = appointments.customer_id
                AND customers.user_id = auth.uid()
        )
    );