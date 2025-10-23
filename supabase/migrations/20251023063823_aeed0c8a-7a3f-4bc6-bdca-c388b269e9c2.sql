-- Create qr-codes storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('qr-codes', 'qr-codes', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for qr-codes bucket
CREATE POLICY "Anyone can view QR codes"
ON storage.objects FOR SELECT
USING (bucket_id = 'qr-codes');

CREATE POLICY "Service role can insert QR codes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'qr-codes' AND auth.role() = 'service_role');

CREATE POLICY "Service role can update QR codes"
ON storage.objects FOR UPDATE
USING (bucket_id = 'qr-codes' AND auth.role() = 'service_role');

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_registrations_qr_code ON registrations(qr_code);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_event_status ON registrations(event_id, status);