-- Drop existing table and constraints
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS reporting_categories;
SET FOREIGN_KEY_CHECKS = 1;

-- Create the new reporting_categories table (without FK constraint initially)
CREATE TABLE reporting_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    parent_id INT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Step 1: Insert all parent categories first with fixed IDs
INSERT INTO reporting_categories (id, name, parent_id, description) VALUES
(1, 'Bullying', NULL, 'Incidents related to bullying'),
(2, 'Physical Abuse', NULL, 'Physical abuse incidents'),
(3, 'Emotional Abuse', NULL, 'Emotional abuse and psychological incidents'),
(4, 'Neglect', NULL, 'Incidents of neglect'),
(5, 'Sexual Abuse', NULL, 'Sexual abuse incidents'),
(6, 'Self-Harm', NULL, 'Self-harm incidents'),
(7, 'Attendance', NULL, 'Attendance related incidents'),
(8, 'Mental Health', NULL, 'Mental health related concerns'),
(9, 'Other', NULL, 'Other incidents');

-- Step 2: Add the foreign key constraint
ALTER TABLE reporting_categories
ADD CONSTRAINT fk_parent
FOREIGN KEY (parent_id) 
REFERENCES reporting_categories(id)
ON DELETE CASCADE;

-- Step 3: Now safe to insert subcategories
INSERT INTO reporting_categories (name, parent_id, description) VALUES
-- Bullying subcategories
('Verbal Bullying', 1, 'Name calling, insults, teasing'),
('Physical Bullying', 1, 'Hitting, kicking, pushing'),
('Cyber Bullying', 1, 'Online harassment, social media bullying'),
('Social Bullying', 1, 'Excluding, spreading rumors'),

-- Physical Abuse subcategories
('Hitting', 2, 'Incidents of hitting'),
('Pushing', 2, 'Incidents of pushing'),
('Fighting', 2, 'Physical altercations'),

-- Emotional Abuse subcategories
('Verbal Abuse', 3, 'Verbal emotional abuse'),
('Intimidation', 3, 'Intimidating behavior'),
('Isolation', 3, 'Social isolation');

SET FOREIGN_KEY_CHECKS = 1;
