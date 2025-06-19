-- Seed script for organizations table
-- Insert default organizations for immediate use

INSERT INTO organizations (org_code, name, billing_email) VALUES 
('INDIVIDUAL', 'Individual Users', NULL),
('TEST-ORG', 'Test Organization', 'test@example.com'),
('BELASTINGDIENST', 'Belastingdienst', 'admin@belastingdienst.nl'),
('SHELL', 'Shell Nederland', 'billing@shell.nl');

-- Verify the data was inserted
-- SELECT * FROM organizations ORDER BY org_code; 