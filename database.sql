-- Creates tables with 'dic_' prefix and populates with real drug names
-- The DROP TABLE commands allow you to re-run this script safely for testing

DROP TABLE IF EXISTS `dic_test_drugs`;
DROP TABLE IF EXISTS `dic_user_tests`;
DROP TABLE IF EXISTS `dic_drugs`;
DROP TABLE IF EXISTS `dic_users`;

CREATE TABLE `dic_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL
);

CREATE TABLE `dic_drugs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL
);

CREATE TABLE `dic_user_tests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `test_name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `dic_users`(`id`) ON DELETE CASCADE
);

CREATE TABLE `dic_test_drugs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `test_id` INT NOT NULL,
  `drug_id` INT NOT NULL,
  FOREIGN KEY (`test_id`) REFERENCES `dic_user_tests`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`drug_id`) REFERENCES `dic_drugs`(`id`) ON DELETE CASCADE
);

-- Populate with real clinical drugs for demonstration
INSERT INTO `dic_drugs` (`name`) VALUES
('Lisinopril'), ('Atorvastatin'), ('Metformin'), ('Warfarin'),
('Aspirin'), ('Ibuprofen'), ('Amoxicillin'), ('Alprazolam');