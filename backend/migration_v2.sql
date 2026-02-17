-- 1. Create junction table for multi-service support
CREATE TABLE IF NOT EXISTS appointment_services (
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    PRIMARY KEY (appointment_id, service_id)
);
-- 2. Add new columns to appointments table
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS is_group_booking BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS group_size INTEGER DEFAULT 1,
    ADD COLUMN IF NOT EXISTS deposit_amount DECIMAL(10, 2) DEFAULT 0.00,
    ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10, 2) DEFAULT 0.00,
    ADD COLUMN IF NOT EXISTS payment_choice TEXT DEFAULT 'full';
-- 'deposit' or 'full'
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = 'Anyone can insert appointment services'
) THEN CREATE POLICY "Anyone can insert appointment services" ON appointment_services FOR
INSERT WITH CHECK (true);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE policyname = 'Anyone can see appointment services'
) THEN CREATE POLICY "Anyone can see appointment services" ON appointment_services FOR
SELECT USING (true);
END IF;
END $$;
-- 4. (Optional) Migrate existing single-service appointments to the junction table
INSERT INTO appointment_services (appointment_id, service_id)
SELECT id,
    service_id
FROM appointments
WHERE service_id IS NOT NULL ON CONFLICT DO NOTHING;