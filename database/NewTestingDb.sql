-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 05, 2023 at 12:21 PM
-- Server version: 10.2.43-MariaDB
-- PHP Version: 7.2.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `NewTestingDb`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`balkrush1`@`%` PROCEDURE `example` (IN `data` TEXT)  BEGIN 
SELECT JSON_EXTRACT(data, '$.firstname')as first_name, JSON_EXTRACT(data, '$.lastname') as last_name ,JSON_EXTRACT(data, '$.roles') as roles;



END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `get_enquiries_list` (IN `branchId` INT, IN `isAdmin` BOOLEAN, IN `salespersonId` INT)  BEGIN
    IF (isAdmin = TRUE) THEN
       SELECT s.id, s.first_name, s.last_name, s.phone_number, s.whatsapp_number, s.email,
       (SELECT modalName FROM modal WHERE id = modal_id) AS product,
       CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
       f.date, f.delivery_date,
       (SELECT id FROM district WHERE id = s.district) AS district_id,
       (SELECT name FROM district WHERE id = s.district) AS district,
       (SELECT name FROM taluka WHERE id = s.taluka) AS taluka,
       (SELECT id FROM taluka WHERE id = s.taluka) AS taluka_id,
       (SELECT name FROM village WHERE id = s.village) AS village,
       (SELECT id FROM village WHERE id = s.village) AS village_id,
       (SELECT state_id FROM state WHERE state_id = s.state) AS state_id,
       (SELECT state_name FROM state WHERE state_id = s.state) AS state,
       (SELECT name FROM enquiry_sources WHERE id = f.enquiry_source_id) AS enquiry_source,
       (SELECT next_followup_date FROM follow_up_details WHERE enquiry_id = f.id ORDER BY id DESC LIMIT 1) AS last_follow_up_date
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
INNER JOIN branches AS t ON f.branch_id = t.id
INNER JOIN users AS fo ON fo.id = f.salesperson_id
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
AND f.salesperson_id = salespersonId
ORDER BY f.date DESC;
    ELSE
        SELECT s.id, s.first_name, s.last_name, s.phone_number, s.whatsapp_number, s.email,
       (SELECT modalName FROM modal WHERE id = modal_id) AS product,
       CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
       f.date, f.delivery_date,
       (SELECT id FROM district WHERE id = s.district) AS district_id,
       (SELECT name FROM district WHERE id = s.district) AS district,
       (SELECT name FROM taluka WHERE id = s.taluka) AS taluka,
       (SELECT id FROM taluka WHERE id = s.taluka) AS taluka_id,
       (SELECT name FROM village WHERE id = s.village) AS village,
       (SELECT id FROM village WHERE id = s.village) AS village_id,
       (SELECT state_id FROM state WHERE state_id = s.state) AS state_id,
       (SELECT state_name FROM state WHERE state_id = s.state) AS state,
       (SELECT name FROM enquiry_sources WHERE id = f.enquiry_source_id) AS enquiry_source,
       (SELECT next_followup_date FROM follow_up_details WHERE enquiry_id = f.id ORDER BY id DESC LIMIT 1) AS last_follow_up_date
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
INNER JOIN branches AS t ON f.branch_id = t.id
INNER JOIN users AS fo ON fo.id = f.salesperson_id
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
AND (f.salesperson_id = salespersonId)
AND (f.branch_id = branchId)
ORDER BY f.date DESC;

    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `get_enquiry_by_newtractor` (IN `branchId` INT, IN `isAdmin` BOOLEAN, IN `salespersonId` INT)  BEGIN
SELECT
    s.id,
    s.first_name,
    s.last_name,
    s.phone_number,
    s.whatsapp_number,
    s.email,
    ep.manufacturer AS make,
    md.old_tractor AS oldOwned,
    (
        SELECT GROUP_CONCAT(s1.modalName)
        FROM enquiry_products AS f1
        INNER JOIN modal AS s1 ON s1.id = f1.modal
        WHERE f1.enquiry_id = f.id
    ) AS product,
    CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
    ecp.category_name,
    f.date,
    f.delivery_date,
    f.enquiry_category_id,
    f.modal_id,
    f.primary_source_id,
    f.enquiry_source_id,
    f.id AS enquiry_id,
    taluka.id AS taluka_id,
    taluka.name AS taluka,
    village.id AS village_id,
    village.name AS village,
    (
        SELECT name
        FROM enquiry_sources
        WHERE id = f.enquiry_source_id
    ) AS enquiry_source
FROM
    enquiries AS f
INNER JOIN
    customers AS s ON s.id = f.customer_id
INNER JOIN
    branches AS t ON f.branch_id = t.id
LEFT JOIN
    users AS fo ON fo.id = f.salesperson_id
INNER JOIN
    enquiry_category AS ecp ON ecp.id = f.enquiry_category_id
INNER JOIN
    enquiry_products AS ep ON ep.enquiry_id = f.id
INNER JOIN
    manufactur_details AS md ON md.enquiry_id = f.id
LEFT JOIN
    taluka ON taluka.id = s.taluka
LEFT JOIN
    village ON village.id = s.village
LEFT JOIN
    follow_up_details AS fud ON fud.enquiry_id = f.id
WHERE
    (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
    AND fud.enquiry_id IS NULL
    AND ecp.category_name = 'New Tractor'  -- Filter by the category name
ORDER BY
    f.date DESC;

END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `InsertCustomerData` (IN `p_json` JSON)  BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE total_records INT;
    DECLARE customerId INT;
    DECLARE enquiryId INT;

    -- Get the total number of records in the JSON array
    SET total_records = JSON_LENGTH(p_json);

    -- Loop through the JSON array and insert each record
    WHILE i < total_records DO
        SET @json = JSON_UNQUOTE(JSON_EXTRACT(p_json, CONCAT('$[', i, ']')));

        SET @first_name = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.first_name'));
        SET @middle_name = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.middle_name'));
        SET @last_name = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.last_name'));
        SET @phone_number = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.phone_number'));
        SET @whatsapp_number = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.whatsapp_number'));
        SET @email = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.email'));
        SET @state = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.state'));
        SET @district = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.district'));
        SET @taluka = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.taluka'));
        SET @village = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.village'));
        SET @branchId = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.branch_id'));
        SET @enquiryCategoryId = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.enquiry_category_id'));
        SET @dsp = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.salesperson_id'));
        SET @model = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.modal_id'));
        SET @enquiryDate = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.date'));
        SET @deliveryDate = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.delivery_date'));
        SET @enquiryPrimarySource = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.primary_source_id'));
        SET @sourceOfEnquiry = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.enquiry_source_id'));
        SET @manufacturer = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.manufacturer'));
        SET @modal = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.modal'));
        SET @maker = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.maker'));
        SET @modalName = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.modalName'));
        SET @modelYear = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.year_of_manufactur'));
        SET @modalCondition = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.condition_of'));
        SET @oldTractorOwned = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.old_tractor'));

        -- Initialize variables to hold customer and enquiry IDs
        SET customerId = NULL;
        SET enquiryId = NULL;

        -- Check if a record with the same mobile number already exists
        
		-- Insert customer data
		INSERT INTO customers (first_name, last_name, middle_name, phone_number, whatsapp_number, email, is_active, state, district, taluka, village)
		VALUES (@first_name, @last_name, @middle_name, @phone_number, @whatsapp_number, @email, 1, @state, @district, @taluka, @village);

		-- Get the last inserted customer ID
		SET customerId = LAST_INSERT_ID();
            
        -- Insert enquiry data
        INSERT INTO enquiries (branch_id, enquiry_category_id, salesperson_id, customer_id, modal_id, date, delivery_date, primary_source_id, enquiry_source_id, visitReason, user_created)
        VALUES (@branchId, @enquiryCategoryId, @dsp, customerId, @model, @enquiryDate, @deliveryDate, @enquiryPrimarySource, @sourceOfEnquiry, 1, 1);

        -- Get the last inserted enquiry ID
        SET enquiryId = LAST_INSERT_ID();

        -- Insert enquiry product data
        INSERT INTO enquiry_products (enquiry_id, manufacturer, modal)
        VALUES (enquiryId, @manufacturer, @modal);

        -- Insert manufacturer details if old tractor is owned
        IF @oldTractorOwned = 'Yes' THEN
            INSERT INTO manufactur_details (enquiry_id, maker, modalName, year_of_manufactur, condition_of, old_tractor)
            VALUES (enquiryId, @maker, @modalName, @modelYear, @modalCondition, @oldTractorOwned);
        ELSE
            INSERT INTO manufactur_details (enquiry_id, old_tractor)
            VALUES (enquiryId, @oldTractorOwned);
        END IF;

        SET i = i + 1;
    END WHILE;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `InsertEnquiryData` (IN `p_json` JSON)  BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE total_records INT;
    DECLARE customerId INT;
    DECLARE enquiryId INT;

    -- Get the total number of records in the JSON array
    SET total_records = JSON_LENGTH(p_json);

    -- Loop through the JSON array and insert each record
    WHILE i < total_records DO
        SET @json = JSON_UNQUOTE(JSON_EXTRACT(p_json, CONCAT('$[', i, ']')));

        SET @first_name = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.first_name'));
        SET @middle_name = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.middle_name'));
        SET @last_name = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.last_name'));
        SET @phone_number = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.phone_number'));
        SET @whatsapp_number = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.whatsapp_number'));
        SET @email = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.email'));
        SET @state = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.state'));
        SET @district = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.district'));
        SET @taluka = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.taluka'));
        SET @village = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.village'));
        SET @branchId = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.branch_id'));
        SET @enquiryCategoryId = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.enquiry_category_id'));
        SET @dsp = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.salesperson_id'));
        SET @model = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.modal_id'));
        SET @enquiryDate = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.date'));
        SET @deliveryDate = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.delivery_date'));
        SET @enquiryPrimarySource = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.primary_source_id'));
        SET @sourceOfEnquiry = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.enquiry_source_id'));
        SET @manufacturer = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.manufacturer'));
        SET @modal = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.modal'));
        SET @maker = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.maker'));
        SET @modalName = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.modalName'));
        SET @modelYear = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.year_of_manufactur'));
        SET @modalCondition = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.condition_of'));
        SET @oldTractorOwned = JSON_UNQUOTE(JSON_EXTRACT(@json, '$.old_tractor'));

        -- Initialize variables to hold customer and enquiry IDs
        SET customerId = NULL;
        SET enquiryId = NULL;

        -- Check if a record with the same mobile number already exists
        
		-- Insert customer data
		INSERT INTO customers (first_name, last_name, middle_name, phone_number, whatsapp_number, email, is_active, state, district, taluka, village)
		VALUES (@first_name, @last_name, @middle_name, @phone_number, @whatsapp_number, @email, 1, @state, @district, @taluka, @village);

		-- Get the last inserted customer ID
		SET customerId = LAST_INSERT_ID();
            
        -- Insert enquiry data
        INSERT INTO enquiries (branch_id, enquiry_category_id, salesperson_id, customer_id, modal_id, date, delivery_date, primary_source_id, enquiry_source_id, visitReason, user_created)
        VALUES (@branchId, @enquiryCategoryId, @dsp, customerId, @model, @enquiryDate, @deliveryDate, @enquiryPrimarySource, @sourceOfEnquiry, 1, 1);

        -- Get the last inserted enquiry ID
        SET enquiryId = LAST_INSERT_ID();

        -- Insert enquiry product data
        INSERT INTO enquiry_products (enquiry_id, manufacturer, modal)
        VALUES (enquiryId, @manufacturer, @modal);

        -- Insert manufacturer details if old tractor is owned
        IF @oldTractorOwned = 'Yes' THEN
            INSERT INTO manufactur_details (enquiry_id, maker, modalName, year_of_manufactur, condition_of, old_tractor)
            VALUES (enquiryId, @maker, @modalName, @modelYear, @modalCondition, @oldTractorOwned);
        ELSE
            INSERT INTO manufactur_details (enquiry_id, old_tractor)
            VALUES (enquiryId, @oldTractorOwned);
        END IF;

        SET i = i + 1;
    END WHILE;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_all_user` ()  BEGIN
    SELECT id, CONCAT(first_name, ' ', last_name) AS name  FROM users WHERE is_active = 1;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_areaAssign_user` ()  BEGIN
SELECT u.id,u.phone_number,u.first_name, u.last_name, ic.category_name,d.distribution_type ,a.category_id,a.distribution_type as dId FROM area_assign_user a JOIN users u ON a.user_id = u.id JOIN enquiry_category ic ON a.category_id = ic.id JOIN distributionType d ON a.distribution_type = d.id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_areaAssign_userPerId` (IN `input_id` INT)  BEGIN

    SELECT
    f.id,
        s.phone_number,
        s.first_name,
        s.last_name,
        t.category_name,
        fo.distribution_type AS dType,
        (
            SELECT GROUP_CONCAT(fi.name)
            FROM village AS fi
            WHERE FIND_IN_SET(fi.id, f.distribution_id)
        ) AS name,
        f.user_id,
        f.category_id,
        f.distribution_type,
        f.distribution_id
    FROM
        area_assign_user AS f 
        LEFT JOIN users AS s ON s.id = f.user_id 
        LEFT JOIN enquiry_category AS t ON t.id = f.category_id 
        LEFT JOIN distributionType AS fo ON fo.id = f.distribution_type
    WHERE
        f.user_id = input_id;
        
        
        
        
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_assigned_area_perUser` (IN `input_data` JSON)  BEGIN
    DECLARE user_id INT;
    DECLARE distribution_id INT; -- Changed data type to INT
    DECLARE distribution_data JSON; -- Changed data type to JSON
    DECLARE data_area JSON; -- Changed data type to JSON
    DECLARE category_id INT; -- Changed data type to INT
    DECLARE i INT DEFAULT 0;
    DECLARE j INT DEFAULT 0;
    
    WHILE JSON_LENGTH(input_data) > 0 DO
    
        SET user_id = JSON_EXTRACT(input_data, '$[0].id');
        SET data_area = JSON_EXTRACT(input_data, '$[0].category');
        
        SET j = JSON_LENGTH(data_area);
        
        WHILE j > 0 DO
            SET category_id = JSON_UNQUOTE(JSON_EXTRACT(data_area, CONCAT('$[', j - 1, '].category')));
            SET distribution_data = JSON_EXTRACT(data_area, CONCAT('$[', j - 1, '].value'));
            
            SET i = JSON_LENGTH(distribution_data);
            
            WHILE i > 0 DO
                SET distribution_id = JSON_UNQUOTE(JSON_EXTRACT(distribution_data, CONCAT('$[', i - 1, '].value')));
                
                INSERT INTO area_assign_user (user_id, distribution_id, category_id)
                VALUES (user_id, distribution_id, category_id);
                
                SET i = i - 1;
            END WHILE;
            
            SET j = j - 1;
        END WHILE;
        
        SET input_data = JSON_REMOVE(input_data, '$[0]');
    END WHILE;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_check_enquiry_mobile_number_exist` (IN `phoneNumber` VARCHAR(100), `categoryId` INT)  BEGIN
  SELECT u.phone_number, f.enquiry_category_id, DATEDIFF(NOW(), f.date) AS date_diff
  FROM enquiries AS f
  INNER JOIN customers AS u ON u.id = f.customer_id 
  WHERE u.phone_number = phoneNumber AND f.enquiry_category_id = categoryId AND u.is_active != 0
  HAVING date_diff <= 180;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_branch_list` (IN `branchId` INT(11), IN `isAdmin` BOOLEAN)  BEGIN
IF (isAdmin = true) THEN
	SELECT * from branches;
ELSE
	SELECT * from branches where id = branchId;
END IF;

END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_category_with_total_enquiry` (IN `villageId` INT)  BEGIN
SELECT et.*, COUNT(e.enquiry_category_id) AS total_enquiries
FROM enquiry_category AS et
LEFT JOIN enquiries AS e ON et.id = e.enquiry_category_id
LEFT JOIN customers AS c ON c.id = e.customer_id 
WHERE c.village = villageId
GROUP BY et.id;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_cold_enquiry` (IN `branchId` INT, IN `isAdmin` BOOLEAN, IN `salespersonId` INT, IN `categoryId` INT)  BEGIN
IF (isAdmin = TRUE) THEN
                 WITH MaxFollowup AS (
    SELECT customer_id, MAX(next_followup_date) AS max_followup_date
    FROM follow_up_details
    GROUP BY customer_id
)


SELECT
    s.id,
    s.first_name,
    s.last_name,
    s.phone_number,
    s.whatsapp_number,
    s.email,
    ep.manufacturer AS make,
    md.old_tractor AS oldOwned,
    (
        SELECT modalName
        FROM enquiry_products AS f1
        INNER JOIN modal AS s1 ON s1.id = f1.modal
        WHERE f1.enquiry_id = f.id
    ) AS product,
    CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
    ecp.category_name,
    f.date,
    f.delivery_date,
    f.enquiry_category_id,
    f.modal_id,
    f.primary_source_id,
    f.enquiry_source_id,
    f.id AS enquiry_id,
    fud.next_followup_date,
    (SELECT name FROM taluka WHERE id = s.taluka) AS taluka,
    (SELECT id FROM taluka WHERE id = s.taluka) AS taluka_id,
    (SELECT name FROM village WHERE id = s.village) AS village,
    (SELECT id FROM village WHERE id = s.village) AS village_id,
    (SELECT name FROM enquiry_sources WHERE id = f.enquiry_source_id) AS enquiry_source,
    fud.last_discussion
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
INNER JOIN branches AS t ON f.branch_id = t.id
LEFT JOIN users AS fo ON fo.id = f.salesperson_id
LEFT JOIN enquiry_category AS ecp ON ecp.id = f.enquiry_category_id
INNER JOIN enquiry_products AS ep ON ep.enquiry_id = f.id
INNER JOIN manufactur_details AS md ON md.enquiry_id = f.id
INNER JOIN MaxFollowup AS mf ON mf.customer_id = s.id
INNER JOIN follow_up_details AS fud ON fud.enquiry_id = f.id AND fud.customer_id = s.id AND fud.next_followup_date = mf.max_followup_date
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
AND (f.enquiry_category_id =categoryId)
    AND EXTRACT(YEAR FROM fud.next_followup_date) = EXTRACT(YEAR FROM CURRENT_DATE)
    AND EXTRACT(MONTH FROM fud.next_followup_date) = EXTRACT(MONTH FROM CURRENT_DATE) + 1;
  
    ELSE
       WITH MaxFollowup AS (
    SELECT customer_id, MAX(next_followup_date) AS max_followup_date
    FROM follow_up_details
    GROUP BY customer_id
)

SELECT
    s.id,
    s.first_name,
    s.last_name,
    s.phone_number,
    s.whatsapp_number,
    s.email,
    ep.manufacturer AS make,
    md.old_tractor AS oldOwned,
    (
        SELECT modalName
        FROM enquiry_products AS f1
        INNER JOIN modal AS s1 ON s1.id = f1.modal
        WHERE f1.enquiry_id = f.id
    ) AS product,
    CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
    ecp.category_name,
    f.date,
    f.delivery_date,
    f.enquiry_category_id,
    f.modal_id,
    f.primary_source_id,
    f.enquiry_source_id,
    f.id AS enquiry_id,
    fud.next_followup_date,
    (SELECT name FROM taluka WHERE id = s.taluka) AS taluka,
    (SELECT id FROM taluka WHERE id = s.taluka) AS taluka_id,
    (SELECT name FROM village WHERE id = s.village) AS village,
    (SELECT id FROM village WHERE id = s.village) AS village_id,
    (SELECT name FROM enquiry_sources WHERE id = f.enquiry_source_id) AS enquiry_source,
    fud.last_discussion
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
INNER JOIN branches AS t ON f.branch_id = t.id
LEFT JOIN users AS fo ON fo.id = f.salesperson_id
LEFT JOIN enquiry_category AS ecp ON ecp.id = f.enquiry_category_id
INNER JOIN enquiry_products AS ep ON ep.enquiry_id = f.id
INNER JOIN manufactur_details AS md ON md.enquiry_id = f.id
INNER JOIN MaxFollowup AS mf ON mf.customer_id = s.id
INNER JOIN follow_up_details AS fud ON fud.enquiry_id = f.id AND fud.customer_id = s.id AND fud.next_followup_date = mf.max_followup_date
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
AND f.salesperson_id = salespersonId
AND (f.enquiry_category_id =categoryId)
    AND EXTRACT(YEAR FROM fud.next_followup_date) = EXTRACT(YEAR FROM CURRENT_DATE)
    AND EXTRACT(MONTH FROM fud.next_followup_date) = EXTRACT(MONTH FROM CURRENT_DATE) + 1;
   
    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_cold_enquiry_list_total_count` (IN `isAdmin` BOOLEAN, IN `salespersonId` INT, IN `categoryId` INT)  BEGIN
IF (isAdmin = TRUE) THEN
SELECT COUNT(*) AS total_count
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
LEFT JOIN (
    SELECT enquiry_id, customer_id, MAX(next_followup_date) AS max_followup_date
    FROM follow_up_details
    GROUP BY enquiry_id, customer_id
) AS mf ON f.id = mf.enquiry_id AND s.id = mf.customer_id AND EXTRACT(YEAR FROM mf.max_followup_date) = EXTRACT(YEAR FROM CURRENT_DATE) AND EXTRACT(MONTH FROM mf.max_followup_date) = EXTRACT(MONTH FROM CURRENT_DATE) + 1
LEFT JOIN follow_up_details AS fud ON fud.enquiry_id = f.id AND fud.customer_id = s.id AND fud.next_followup_date = mf.max_followup_date
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
AND (f.enquiry_category_id = categoryId)
AND EXTRACT(YEAR FROM fud.next_followup_date) = EXTRACT(YEAR FROM CURRENT_DATE)
AND EXTRACT(MONTH FROM fud.next_followup_date) = EXTRACT(MONTH FROM CURRENT_DATE) + 1;
    ELSE
SELECT COUNT(*) AS total_count
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
LEFT JOIN (
    SELECT enquiry_id, customer_id, MAX(next_followup_date) AS max_followup_date
    FROM follow_up_details
    GROUP BY enquiry_id, customer_id
) AS mf ON f.id = mf.enquiry_id AND s.id = mf.customer_id AND EXTRACT(YEAR FROM mf.max_followup_date) = EXTRACT(YEAR FROM CURRENT_DATE) AND EXTRACT(MONTH FROM mf.max_followup_date) = EXTRACT(MONTH FROM CURRENT_DATE) + 1
LEFT JOIN follow_up_details AS fud ON fud.enquiry_id = f.id AND fud.customer_id = s.id AND fud.next_followup_date = mf.max_followup_date
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
AND f.salesperson_id = salespersonId
AND (f.enquiry_category_id = categoryId)
AND EXTRACT(YEAR FROM fud.next_followup_date) = EXTRACT(YEAR FROM CURRENT_DATE)
AND EXTRACT(MONTH FROM fud.next_followup_date) = EXTRACT(MONTH FROM CURRENT_DATE) + 1;


    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_customers_whatsapp_number` (IN `chatID` INT)  BEGIN
SELECT 
  CASE 
    WHEN c.whatsapp_number LIKE '91%' THEN c.whatsapp_number
    ELSE CONCAT('91', c.whatsapp_number)
  END AS customerNumber
FROM customers AS c
WHERE c.whatsapp_number IS NOT NULL AND c.whatsapp_number <> 'null';
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_customer_message_data` (IN `enquiryId` INT)  BEGIN
SELECT f.id, CONCAT_WS(' ', c.first_name, c.last_name) AS customerName, c.phone_number, c.whatsapp_number, p.id AS modalId, p.modalName AS product, p.manufacturerId AS manufacturerId, m.name as manufactureName, CONCAT_WS(' ', u.first_name, u.last_name) AS salesPersonName,
	CASE 
        WHEN u.phone_number LIKE '91%' THEN u.phone_number
        ELSE CONCAT('91', u.phone_number)
    END AS SSPNumber
FROM enquiries AS f
LEFT JOIN users AS u ON u.id = f.salesperson_id
LEFT JOIN customers AS c ON c.id = f.customer_id
LEFT JOIN modal AS p ON p.id = f.modal_id
LEFT JOIN manufacturers AS m ON m.id = p.manufacturerId
WHERE f.id = enquiryId;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_delivery_list` ()  BEGIN
SELECT b.id AS deliveryId, CONCAT(c.first_name, IF(c.last_name IS NOT NULL AND c.last_name != '', CONCAT(' ', c.last_name), '')) AS CustomerName,
b.phone_number AS mobileNumber,
b.chassis_no AS ChassisNo,
b.delivery_date AS DeliveryDate,
b.retail_date AS RetailDate,
concat(m.modalName, ' ', v.variantName) AS Product
FROM booking AS b 
JOIN customers AS c ON b.customer_id = c.id
JOIN modal AS m ON b.modal = m.id
JOIN variant AS v ON b.variant = v.id;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_dsp_enquerylist` (IN `branchId` INT, IN `userId` INT)  BEGIN
    SELECT
        s.id,
        s.first_name,
        s.last_name,
        COALESCE((SELECT COUNT(*) FROM enquiries e WHERE e.salesperson_id = s.id), 0) AS totalenquery
    FROM branch_department_user as f
    INNER JOIN users as s ON s.id = f.user_id AND s.is_active = 1
    WHERE branch_id = branchId AND user_id NOT IN (20, userId);
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_dsp_list` (IN `branchId` INT, IN `userId` INT)  BEGIN
SELECT distinct  s.id, s.first_name, s.last_name  FROM branch_department_user as f inner join users as s on  s.id = f.user_id and s.is_active = 1 where branch_id = branchId and user_id not in (20,userId);
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_enquiries_by_enquiry_category` (IN `categoryId` INT)  BEGIN
 IF (categoryId = 1) THEN
          SELECT s.id, s.first_name, s.last_name, s.phone_number, s.whatsapp_number, s.email, ep.manufacturer AS make, md.old_tractor AS oldOwned,
       (SELECT modalName FROM enquiry_products AS f1 INNER JOIN modal AS s ON s.id = f1.modal WHERE f1.enquiry_id = f.id) AS product,
       CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
       ecp.category_name,
       f.date, f.delivery_date, f.enquiry_category_id, f.modal_id, f.primary_source_id, f.enquiry_source_id, f.id AS enquiry_id,
       (SELECT name FROM taluka WHERE id = s.taluka) AS taluka,
       (SELECT id FROM taluka WHERE id = s.taluka) AS taluka_id,
       (SELECT name FROM village WHERE id = s.village) AS village,
       (SELECT id FROM village WHERE id = s.village) AS village_id,
       (SELECT name FROM enquiry_sources WHERE id = f.enquiry_source_id) AS enquiry_source
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
INNER JOIN branches AS t ON f.branch_id = t.id
LEFT JOIN users AS fo ON fo.id = f.salesperson_id
LEFT JOIN enquiry_category AS ecp on ecp.id = f.enquiry_category_id
INNER JOIN enquiry_products AS ep ON ep.enquiry_id = f.id
INNER JOIN manufactur_details AS md ON md.enquiry_id = f.id
INNER JOIN follow_up_details AS fud ON fud.enquiry_id = f.id
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID') AND fud.enquiry_id = f.id
GROUP BY f.id
ORDER BY f.date DESC;
    ELSE
         SELECT s.id, s.first_name, s.last_name, s.phone_number, s.whatsapp_number, s.email, ep.manufacturer AS make, md.old_tractor AS oldOwned,
       (SELECT modalName FROM enquiry_products AS f1 INNER JOIN modal AS s ON s.id = f1.modal WHERE f1.enquiry_id = f.id) AS product,
       CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
       ecp.category_name,
       f.date, f.delivery_date, f.enquiry_category_id, f.modal_id, f.primary_source_id, f.enquiry_source_id, f.id AS enquiry_id,
       (SELECT name FROM taluka WHERE id = s.taluka) AS taluka,
       (SELECT id FROM taluka WHERE id = s.taluka) AS taluka_id,
       (SELECT name FROM village WHERE id = s.village) AS village,
       (SELECT id FROM village WHERE id = s.village) AS village_id,
       (SELECT name FROM enquiry_sources WHERE id = f.enquiry_source_id) AS enquiry_source
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
INNER JOIN branches AS t ON f.branch_id = t.id
LEFT JOIN users AS fo ON fo.id = f.salesperson_id
LEFT JOIN enquiry_category AS ecp on ecp.id = f.enquiry_category_id
INNER JOIN enquiry_products AS ep ON ep.enquiry_id = f.id
INNER JOIN manufactur_details AS md ON md.enquiry_id = f.id
INNER JOIN follow_up_details AS fud ON fud.enquiry_id = f.id
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID') AND fud.enquiry_id = f.id AND (f.enquiry_category_id = categoryId)
GROUP BY f.id
ORDER BY f.date DESC;
    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_enquiries_by_mobile_number` (IN `mobileNumber` VARCHAR(255), IN `categoryId` INT)  BEGIN
    SET @mobilePattern = CONCAT(mobileNumber, '%'); -- Concatenate the parameter with a '%' wildcard
    SELECT
        s.id,
        s.first_name,
        s.last_name,
        s.phone_number,
        s.whatsapp_number,
        s.email,
        ep.manufacturer AS make,
        md.old_tractor AS oldOwned,
        (
            SELECT GROUP_CONCAT(modalName)
            FROM enquiry_products AS f1
            INNER JOIN modal AS s1 ON s1.id = f1.modal
            WHERE f1.enquiry_id = f.id
        ) AS product,
        CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
        ecp.category_name,
        f.date,
        f.delivery_date,
        f.enquiry_category_id,
        f.modal_id,
        f.primary_source_id,
        f.enquiry_source_id,
        f.id AS enquiry_id,
        taluka.id AS taluka_id,
        taluka.name AS taluka,
        village.id AS village_id,
        village.name AS village,
        (
            SELECT name
            FROM enquiry_sources
            WHERE id = f.enquiry_source_id
        ) AS enquiry_source
    FROM
        enquiries AS f
    INNER JOIN
        customers AS s ON s.id = f.customer_id
    INNER JOIN
        branches AS t ON f.branch_id = t.id
    LEFT JOIN
        users AS fo ON fo.id = f.salesperson_id
    LEFT JOIN
        enquiry_category AS ecp ON ecp.id = f.enquiry_category_id
    INNER JOIN
        enquiry_products AS ep ON ep.enquiry_id = f.id
    INNER JOIN
        manufactur_details AS md ON md.enquiry_id = f.id
    LEFT JOIN
        taluka ON taluka.id = s.taluka
    LEFT JOIN
        village ON village.id = s.village
    LEFT JOIN
        follow_up_details AS fud ON fud.enquiry_id = f.id
    WHERE
        (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
        AND fud.enquiry_id IS NULL
        AND s.phone_number LIKE @mobilePattern
        AND f.enquiry_category_id = categoryId
    ORDER BY
        f.date DESC;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_enquiries_by_mobile_number_and_category` (IN `mobileNumber` VARCHAR(100), IN `category_name` VARCHAR(100))  BEGIN
   SELECT
    s.id,
    s.first_name,
    s.last_name,
    s.phone_number,
    s.whatsapp_number,
    s.email,
    ep.manufacturer AS make,
    md.old_tractor AS oldOwned,
    (
        SELECT GROUP_CONCAT(modalName)
        FROM enquiry_products AS f1
        INNER JOIN modal AS s1 ON s1.id = f1.modal
        WHERE f1.enquiry_id = f.id
    ) AS product,
    CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
    ecp.category_name,
    f.date,
    f.delivery_date,
    f.enquiry_category_id,
    f.modal_id,
    f.primary_source_id,
    f.enquiry_source_id,
    f.id AS enquiry_id,
    taluka.id AS taluka_id,
    taluka.name AS taluka,
    village.id AS village_id,
    village.name AS village,
    (
        SELECT name
        FROM enquiry_sources
        WHERE id = f.enquiry_source_id
    ) AS enquiry_source
FROM
    enquiries AS f
INNER JOIN
    customers AS s ON s.id = f.customer_id
INNER JOIN
    branches AS t ON f.branch_id = t.id
LEFT JOIN
    users AS fo ON fo.id = f.salesperson_id
LEFT JOIN
    enquiry_category AS ecp ON ecp.id = f.enquiry_category_id
INNER JOIN
    enquiry_products AS ep ON ep.enquiry_id = f.id
INNER JOIN
    manufactur_details AS md ON md.enquiry_id = f.id
LEFT JOIN
    taluka ON taluka.id = s.taluka
LEFT JOIN
    village ON village.id = s.village
LEFT JOIN
    follow_up_details AS fud ON fud.enquiry_id = f.id
WHERE
    (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
    AND fud.enquiry_id IS NULL
    AND s.phone_number LIKE CONCAT(mobileNumber, '%')
    AND ecp.category_name = category_name
ORDER BY
    f.date DESC;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_enquiries_list` (IN `branchId` INT, IN `isAdmin` BOOLEAN)  BEGIN
    IF (isAdmin = TRUE) THEN
       SELECT s.id, s.first_name, s.last_name, s.phone_number, s.whatsapp_number, s.email,
       (SELECT modalName FROM modal WHERE id = modal_id) AS product,
       CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
       f.date, f.delivery_date,
       (SELECT id FROM district WHERE id = s.district) AS district_id,
       (SELECT name FROM district WHERE id = s.district) AS district,
       (SELECT name FROM taluka WHERE id = s.taluka) AS taluka,
       (SELECT id FROM taluka WHERE id = s.taluka) AS taluka_id,
       (SELECT name FROM village WHERE id = s.village) AS village,
       (SELECT id FROM village WHERE id = s.village) AS village_id,
       (SELECT state_id FROM state WHERE state_id = s.state) AS state_id,
       (SELECT state_name FROM state WHERE state_id = s.state) AS state,
       (SELECT name FROM enquiry_sources WHERE id = f.enquiry_source_id) AS enquiry_source,
       (SELECT next_followup_date FROM follow_up_details WHERE enquiry_id = f.id ORDER BY id DESC LIMIT 1) AS last_follow_up_date
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
INNER JOIN branches AS t ON f.branch_id = t.id
INNER JOIN users AS fo ON fo.id = f.salesperson_id
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
ORDER BY s.id DESC;
    ELSE
        SELECT s.id, s.first_name, s.last_name, s.phone_number, s.whatsapp_number, s.email,
       (SELECT modalName FROM modal WHERE id = modal_id) AS product,
       CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
       f.date, f.delivery_date,
       (SELECT id FROM district WHERE id = s.district) AS district_id,
       (SELECT name FROM district WHERE id = s.district) AS district,
       (SELECT name FROM taluka WHERE id = s.taluka) AS taluka,
       (SELECT id FROM taluka WHERE id = s.taluka) AS taluka_id,
       (SELECT name FROM village WHERE id = s.village) AS village,
       (SELECT id FROM village WHERE id = s.village) AS village_id,
       (SELECT state_id FROM state WHERE state_id = s.state) AS state_id,
       (SELECT state_name FROM state WHERE state_id = s.state) AS state,
       (SELECT name FROM enquiry_sources WHERE id = f.enquiry_source_id) AS enquiry_source,
       (SELECT next_followup_date FROM follow_up_details WHERE enquiry_id = f.id ORDER BY id DESC LIMIT 1) AS last_follow_up_date
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
INNER JOIN branches AS t ON f.branch_id = t.id
INNER JOIN users AS fo ON fo.id = f.salesperson_id
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
ORDER BY s.id DESC;

    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_enquiries_list_by_salesperson` (IN `branchId` INT, IN `isAdmin` BOOLEAN, IN `salespersonId` INT)  BEGIN
    IF (isAdmin = TRUE) THEN
         SELECT s.id, s.first_name, s.last_name, s.phone_number, s.whatsapp_number, s.email, ep.manufacturer AS make, md.old_tractor AS oldOwned,
       (SELECT modalName FROM enquiry_products AS f1 INNER JOIN modal AS s ON s.id = f1.modal WHERE f1.enquiry_id = f.id) AS product,
       CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
       ecp.category_name,
       f.date, f.delivery_date, f.enquiry_category_id, f.modal_id, f.primary_source_id, f.enquiry_source_id, f.id AS enquiry_id,
       (SELECT id FROM district WHERE id = s.district) AS district_id,
       (SELECT name FROM district WHERE id = s.district) AS district,
       (SELECT name FROM taluka WHERE id = s.taluka) AS taluka,
       (SELECT id FROM taluka WHERE id = s.taluka) AS taluka_id,
       (SELECT name FROM village WHERE id = s.village) AS village,
       (SELECT id FROM village WHERE id = s.village) AS village_id,
       (SELECT state_id FROM state WHERE state_id = s.state) AS state_id,
       (SELECT state_name FROM state WHERE state_id = s.state) AS state,
       (SELECT name FROM enquiry_sources WHERE id = f.enquiry_source_id) AS enquiry_source,
       (SELECT next_followup_date FROM follow_up_details WHERE enquiry_id = f.id ORDER BY id DESC LIMIT 1) AS last_follow_up_date
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
INNER JOIN branches AS t ON f.branch_id = t.id
LEFT JOIN users AS fo ON fo.id = f.salesperson_id
LEFT JOIN enquiry_category AS ecp on ecp.id = f.enquiry_category_id
INNER JOIN enquiry_products AS ep ON ep.enquiry_id = f.id
INNER JOIN manufactur_details AS md ON md.enquiry_id = f.id
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
ORDER BY f.date DESC;
    ELSE
        SELECT s.id, s.first_name, s.last_name, s.phone_number, s.whatsapp_number, s.email, ep.manufacturer AS make, md.old_tractor AS oldOwned,
       (SELECT modalName FROM enquiry_products AS f1 INNER JOIN modal AS s ON s.id = f1.modal WHERE f1.enquiry_id = f.id) AS product,
       CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
       ecp.category_name,
       f.date, f.delivery_date, f.enquiry_category_id, f.modal_id, f.primary_source_id, f.enquiry_source_id, f.id AS enquiry_id,
       (SELECT id FROM district WHERE id = s.district) AS district_id,
       (SELECT name FROM district WHERE id = s.district) AS district,
       (SELECT name FROM taluka WHERE id = s.taluka) AS taluka,
       (SELECT id FROM taluka WHERE id = s.taluka) AS taluka_id,
       (SELECT name FROM village WHERE id = s.village) AS village,
       (SELECT id FROM village WHERE id = s.village) AS village_id,
       (SELECT state_id FROM state WHERE state_id = s.state) AS state_id,
       (SELECT state_name FROM state WHERE state_id = s.state) AS state,
       (SELECT name FROM enquiry_sources WHERE id = f.enquiry_source_id) AS enquiry_source,
       (SELECT next_followup_date FROM follow_up_details WHERE enquiry_id = f.id ORDER BY id DESC LIMIT 1) AS last_follow_up_date
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
INNER JOIN branches AS t ON f.branch_id = t.id
LEFT JOIN users AS fo ON fo.id = f.salesperson_id -- Use LEFT JOIN to include null salesperson_id
LEFT JOIN enquiry_category AS ecp on ecp.id = f.enquiry_category_id
INNER JOIN enquiry_products AS ep ON ep.enquiry_id = f.id
INNER JOIN manufactur_details AS md ON md.enquiry_id = f.id
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
AND (f.salesperson_id = salespersonId OR f.salesperson_id IS NULL) -- Include null salesperson_id
ORDER BY f.date DESC;
    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_enquiry_by_newtractor` (IN `branchId` INT, IN `isAdmin` BOOLEAN, IN `salespersonId` INT)  BEGIN
SELECT
    s.id,
    s.first_name,
    s.last_name,
    s.phone_number,
    s.whatsapp_number,
    s.email,
    ep.manufacturer AS make,
    md.old_tractor AS oldOwned,
    (
        SELECT GROUP_CONCAT(s1.modalName)
        FROM enquiry_products AS f1
        INNER JOIN modal AS s1 ON s1.id = f1.modal
        WHERE f1.enquiry_id = f.id
    ) AS product,
    CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
    ecp.category_name,
    f.date,
    f.delivery_date,
    f.enquiry_category_id,
    f.modal_id,
    f.primary_source_id,
    f.enquiry_source_id,
    f.id AS enquiry_id,
    taluka.id AS taluka_id,
    taluka.name AS taluka,
    village.id AS village_id,
    village.name AS village,
    (
        SELECT name
        FROM enquiry_sources
        WHERE id = f.enquiry_source_id
    ) AS enquiry_source
FROM
    enquiries AS f
INNER JOIN
    customers AS s ON s.id = f.customer_id
INNER JOIN
    branches AS t ON f.branch_id = t.id
LEFT JOIN
    users AS fo ON fo.id = f.salesperson_id
INNER JOIN
    enquiry_category AS ecp ON ecp.id = f.enquiry_category_id
INNER JOIN
    enquiry_products AS ep ON ep.enquiry_id = f.id
INNER JOIN
    manufactur_details AS md ON md.enquiry_id = f.id
LEFT JOIN
    taluka ON taluka.id = s.taluka
LEFT JOIN
    village ON village.id = s.village
LEFT JOIN
    follow_up_details AS fud ON fud.enquiry_id = f.id
WHERE
    (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
    AND fud.enquiry_id IS NULL
    AND ecp.category_name = 'Old Tractor'  -- Filter by the category name
ORDER BY
    f.date DESC;

END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_enquiry_list_by_time_interval` (IN `timeInterval` VARCHAR(20))  BEGIN
IF timeInterval = 'Today' THEN 
 SELECT s.id, s.first_name, s.last_name, s.phone_number, s.whatsapp_number, s.email,
           (SELECT modalName FROM modal WHERE id = modal_id) AS product,
           CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
           f.date, f.delivery_date,
           (SELECT id FROM district WHERE id = s.district) AS district_id,
           (SELECT name FROM district WHERE id = s.district) AS district,
           (SELECT name FROM taluka WHERE id = s.taluka) AS taluka,
           (SELECT id FROM taluka WHERE id = s.taluka) AS taluka_id,
           (SELECT name FROM village WHERE id = s.village) AS village,
           (SELECT id FROM village WHERE id = s.village) AS village_id,
           (SELECT state_id FROM state WHERE state_id = s.state) AS state_id,
           (SELECT state_name FROM state WHERE state_id = s.state) AS state,
           (SELECT name FROM enquiry_sources WHERE id = f.enquiry_source_id) AS enquiry_source,
           (SELECT next_followup_date FROM follow_up_details WHERE enquiry_id = f.id ORDER BY id DESC LIMIT 1) AS last_follow_up_date
    FROM enquiries AS f
    INNER JOIN customers AS s ON s.id = f.customer_id
    INNER JOIN branches AS t ON f.branch_id = t.id
    INNER JOIN users AS fo ON fo.id = f.salesperson_id
    WHERE DATE(f.date) = CURDATE()
    ORDER BY f.date DESC;
  
  ELSEIF timeInterval = 'LastWeek' THEN
    SELECT s.id, s.first_name, s.last_name, s.phone_number, s.whatsapp_number, s.email,
           (SELECT modalName FROM modal WHERE id = modal_id) AS product,
           CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
           f.date, f.delivery_date,
           (SELECT id FROM district WHERE id = s.district) AS district_id,
           (SELECT name FROM district WHERE id = s.district) AS district,
           (SELECT name FROM taluka WHERE id = s.taluka) AS taluka,
           (SELECT id FROM taluka WHERE id = s.taluka) AS taluka_id,
           (SELECT name FROM village WHERE id = s.village) AS village,
           (SELECT id FROM village WHERE id = s.village) AS village_id,
           (SELECT state_id FROM state WHERE state_id = s.state) AS state_id,
           (SELECT state_name FROM state WHERE state_id = s.state) AS state,
           (SELECT name FROM enquiry_sources WHERE id = f.enquiry_source_id) AS enquiry_source,
           (SELECT next_followup_date FROM follow_up_details WHERE enquiry_id = f.id ORDER BY id DESC LIMIT 1) AS last_follow_up_date
    FROM enquiries AS f
    INNER JOIN customers AS s ON s.id = f.customer_id
    INNER JOIN branches AS t ON f.branch_id = t.id
    INNER JOIN users AS fo ON fo.id = f.salesperson_id
    WHERE f.date >= CURDATE() - INTERVAL DAYOFWEEK(CURDATE()) + 6 DAY
      AND f.date < CURDATE() - INTERVAL DAYOFWEEK(CURDATE()) - 1 DAY
    ORDER BY f.date DESC;
  
  ELSEIF timeInterval = 'LastMonth' THEN
    SELECT s.id, s.first_name, s.last_name, s.phone_number, s.whatsapp_number, s.email,
           (SELECT modalName FROM modal WHERE id = modal_id) AS product,
           CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
           f.date, f.delivery_date,
           (SELECT id FROM district WHERE id = s.district) AS district_id,
           (SELECT name FROM district WHERE id = s.district) AS district,
           (SELECT name FROM taluka WHERE id = s.taluka) AS taluka,
           (SELECT id FROM taluka WHERE id = s.taluka) AS taluka_id,
           (SELECT name FROM village WHERE id = s.village) AS village,
           (SELECT id FROM village WHERE id = s.village) AS village_id,
           (SELECT state_id FROM state WHERE state_id = s.state) AS state_id,
           (SELECT state_name FROM state WHERE state_id = s.state) AS state,
           (SELECT name FROM enquiry_sources WHERE id = f.enquiry_source_id) AS enquiry_source,
           (SELECT next_followup_date FROM follow_up_details WHERE enquiry_id = f.id ORDER BY id DESC LIMIT 1) AS last_follow_up_date
    FROM enquiries AS f
    INNER JOIN customers AS s ON s.id = f.customer_id
    INNER JOIN branches AS t ON f.branch_id = t.id
    INNER JOIN users AS fo ON fo.id = f.salesperson_id
    WHERE f.date >= CURDATE() - INTERVAL 1 MONTH + INTERVAL DAYOFMONTH(CURDATE()) - 1 DAY
      AND f.date < CURDATE() - INTERVAL DAYOFMONTH(CURDATE()) DAY
    ORDER BY f.date DESC;
    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_enquiry_list_by_village` (IN `villageId` INT, IN `categoryId` INT)  BEGIN
SELECT s.id,
       s.first_name,
       s.last_name,
       s.phone_number,
       s.whatsapp_number,
       s.email,
       (select modalName from enquiry_products as f1 inner join modal as s on s.id = f1.modal where f1.enquiry_id = f.id) AS product,
       CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
       f.date,
       f.delivery_date,
       d.id AS district_id,
       d.name AS district,
       t1.name AS taluka,
       s.taluka AS taluka_id,
       v1.name AS village,
       s.village AS village_id,
       st.state_id,
       st.state_name AS state,
       es.name AS enquiry_source,
       (SELECT next_followup_date
        FROM follow_up_details
        WHERE enquiry_id = f.id
        ORDER BY id DESC
        LIMIT 1) AS last_follow_up_date
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
INNER JOIN branches AS t ON f.branch_id = t.id
INNER JOIN users AS fo ON fo.id = f.salesperson_id
LEFT JOIN modal AS p ON p.id = f.modal_id
LEFT JOIN district AS d ON d.id = s.district
LEFT JOIN taluka AS t1 ON t1.id = s.taluka
LEFT JOIN village AS v1 ON v1.id = s.village
LEFT JOIN state AS st ON st.state_id = s.state
LEFT JOIN enquiry_sources AS es ON es.id = f.enquiry_source_id
WHERE ((f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID') AND s.village = villageId AND f.enquiry_category_id = categoryId)
ORDER BY f.date DESC;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_enquiry_location_list` ()  BEGIN
SELECT *
FROM state
LEFT JOIN district ON state.state_id = district.state_id
LEFT JOIN taluka ON district.id = taluka.district_id
LEFT JOIN village ON taluka.id = village.taluka_id;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_followed_enquiry` (IN `branchId` INT, IN `isAdmin` BOOLEAN, IN `salespersonId` INT)  BEGIN
IF (isAdmin = TRUE) THEN
         SELECT s.id, s.first_name, s.last_name, s.phone_number, s.whatsapp_number, s.email, ep.manufacturer AS make, md.old_tractor AS oldOwned,
       (SELECT modalName FROM enquiry_products AS f1 INNER JOIN modal AS s ON s.id = f1.modal WHERE f1.enquiry_id = f.id) AS product,
       CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
       ecp.category_name,
       f.date, f.delivery_date, f.enquiry_category_id, f.modal_id, f.primary_source_id, f.enquiry_source_id, f.id AS enquiry_id,
       (SELECT name FROM taluka WHERE id = s.taluka) AS taluka,
       (SELECT id FROM taluka WHERE id = s.taluka) AS taluka_id,
       (SELECT name FROM village WHERE id = s.village) AS village,
       (SELECT id FROM village WHERE id = s.village) AS village_id,
       (SELECT name FROM enquiry_sources WHERE id = f.enquiry_source_id) AS enquiry_source
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
INNER JOIN branches AS t ON f.branch_id = t.id
LEFT JOIN users AS fo ON fo.id = f.salesperson_id
LEFT JOIN enquiry_category AS ecp on ecp.id = f.enquiry_category_id
INNER JOIN enquiry_products AS ep ON ep.enquiry_id = f.id
INNER JOIN manufactur_details AS md ON md.enquiry_id = f.id
INNER JOIN follow_up_details AS fud ON fud.enquiry_id = f.id
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID') AND fud.enquiry_id = f.id
GROUP BY f.id
ORDER BY f.date DESC;
    ELSE
        SELECT s.id, s.first_name, s.last_name, s.phone_number, s.whatsapp_number, s.email, ep.manufacturer AS make, md.old_tractor AS oldOwned,
       (SELECT modalName FROM enquiry_products AS f1 INNER JOIN modal AS s ON s.id = f1.modal WHERE f1.enquiry_id = f.id) AS product,
       CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
       ecp.category_name,
       f.date, f.delivery_date, f.enquiry_category_id, f.modal_id, f.primary_source_id, f.enquiry_source_id, f.id AS enquiry_id,
       (SELECT name FROM taluka WHERE id = s.taluka) AS taluka,
       (SELECT id FROM taluka WHERE id = s.taluka) AS taluka_id,
       (SELECT name FROM village WHERE id = s.village) AS village,
       (SELECT id FROM village WHERE id = s.village) AS village_id,
       (SELECT name FROM enquiry_sources WHERE id = f.enquiry_source_id) AS enquiry_source
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
INNER JOIN branches AS t ON f.branch_id = t.id
LEFT JOIN users AS fo ON fo.id = f.salesperson_id
LEFT JOIN enquiry_category AS ecp on ecp.id = f.enquiry_category_id
INNER JOIN enquiry_products AS ep ON ep.enquiry_id = f.id
INNER JOIN manufactur_details AS md ON md.enquiry_id = f.id
INNER JOIN follow_up_details AS fud ON fud.enquiry_id = f.id
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID') AND fud.enquiry_id = f.id AND f.salesperson_id = salespersonId
GROUP BY f.id
ORDER BY f.date DESC;
    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_hot_enquiry` (IN `branchId` INT, IN `isAdmin` BOOLEAN, IN `salespersonId` INT, IN `categoryId` INT)  BEGIN
IF (isAdmin = TRUE) THEN
         WITH MaxFollowup AS (
    SELECT
        customer_id,
        MAX(next_followup_date) AS max_followup_date
    FROM follow_up_details
    GROUP BY customer_id
)

SELECT
    s.id,
    s.first_name,
    s.last_name,
    s.phone_number,
    s.whatsapp_number,
    s.email,
    ep.manufacturer AS make,
    md.old_tractor AS oldOwned,
    (
        SELECT modalName
        FROM enquiry_products AS f1
        INNER JOIN modal AS s1 ON s1.id = f1.modal
        WHERE f1.enquiry_id = f.id
    ) AS product,
    CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
    ecp.category_name,
    f.date,
    f.delivery_date,
    f.enquiry_category_id,
    f.modal_id,
    f.primary_source_id,
    f.enquiry_source_id,
    f.id AS enquiry_id,
    fud.next_followup_date,
    (
        SELECT name
        FROM taluka
        WHERE id = s.taluka
    ) AS taluka,
    (
        SELECT id
        FROM taluka
        WHERE id = s.taluka
    ) AS taluka_id,
    (
        SELECT name
        FROM village
        WHERE id = s.village
    ) AS village,
    (
        SELECT id
        FROM village
        WHERE id = s.village
    ) AS village_id,
    (
        SELECT name
        FROM enquiry_sources
        WHERE id = f.enquiry_source_id
    ) AS enquiry_source,
    fud.last_discussion
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
INNER JOIN branches AS t ON f.branch_id = t.id
LEFT JOIN users AS fo ON fo.id = f.salesperson_id
LEFT JOIN enquiry_category AS ecp ON ecp.id = f.enquiry_category_id
INNER JOIN enquiry_products AS ep ON ep.enquiry_id = f.id
INNER JOIN manufactur_details AS md ON md.enquiry_id = f.id
INNER JOIN MaxFollowup AS mf ON mf.customer_id = s.id
INNER JOIN follow_up_details AS fud ON fud.enquiry_id = f.id AND fud.customer_id = s.id AND fud.next_followup_date = mf.max_followup_date
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
AND (f.enquiry_category_id = categoryId)
    AND EXTRACT(MONTH FROM fud.next_followup_date) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND (
        EXTRACT(YEAR FROM fud.next_followup_date) < EXTRACT(YEAR FROM CURRENT_DATE)
        OR (
            EXTRACT(YEAR FROM fud.next_followup_date) = EXTRACT(YEAR FROM CURRENT_DATE)
            AND EXTRACT(MONTH FROM fud.next_followup_date) <= EXTRACT(MONTH FROM CURRENT_DATE)
        )
    );

    ELSE
       WITH MaxFollowup AS (
    SELECT
        customer_id,
        MAX(next_followup_date) AS max_followup_date
    FROM follow_up_details
    GROUP BY customer_id
)

SELECT
    s.id,
    s.first_name,
    s.last_name,
    s.phone_number,
    s.whatsapp_number,
    s.email,
    ep.manufacturer AS make,
    md.old_tractor AS oldOwned,
    (
        SELECT modalName
        FROM enquiry_products AS f1
        INNER JOIN modal AS s1 ON s1.id = f1.modal
        WHERE f1.enquiry_id = f.id
    ) AS product,
    CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
    ecp.category_name,
    f.date,
    f.delivery_date,
    f.enquiry_category_id,
    f.modal_id,
    f.primary_source_id,
    f.enquiry_source_id,
    f.id AS enquiry_id,
    fud.next_followup_date,
    (
        SELECT name
        FROM taluka
        WHERE id = s.taluka
    ) AS taluka,
    (
        SELECT id
        FROM taluka
        WHERE id = s.taluka
    ) AS taluka_id,
    (
        SELECT name
        FROM village
        WHERE id = s.village
    ) AS village,
    (
        SELECT id
        FROM village
        WHERE id = s.village
    ) AS village_id,
    (
        SELECT name
        FROM enquiry_sources
        WHERE id = f.enquiry_source_id
    ) AS enquiry_source,
    fud.last_discussion
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
INNER JOIN branches AS t ON f.branch_id = t.id
LEFT JOIN users AS fo ON fo.id = f.salesperson_id
LEFT JOIN enquiry_category AS ecp ON ecp.id = f.enquiry_category_id
INNER JOIN enquiry_products AS ep ON ep.enquiry_id = f.id
INNER JOIN manufactur_details AS md ON md.enquiry_id = f.id
INNER JOIN MaxFollowup AS mf ON mf.customer_id = s.id
INNER JOIN follow_up_details AS fud ON fud.enquiry_id = f.id AND fud.customer_id = s.id AND fud.next_followup_date = mf.max_followup_date
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
AND f.salesperson_id = salespersonId
AND (f.enquiry_category_id = categoryId)
    AND EXTRACT(MONTH FROM fud.next_followup_date) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND (
        EXTRACT(YEAR FROM fud.next_followup_date) < EXTRACT(YEAR FROM CURRENT_DATE)
        OR (
            EXTRACT(YEAR FROM fud.next_followup_date) = EXTRACT(YEAR FROM CURRENT_DATE)
            AND EXTRACT(MONTH FROM fud.next_followup_date) <= EXTRACT(MONTH FROM CURRENT_DATE)
        )
    );
    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_hot_enquiry_list_total_count` (IN `isAdmin` BOOLEAN, IN `salespersonId` INT, IN `categoryId` INT)  BEGIN
IF (isAdmin = TRUE) THEN
 

SELECT COUNT(*) AS total_count
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
LEFT JOIN (
    SELECT enquiry_id, customer_id, MAX(next_followup_date) AS max_followup_date
    FROM follow_up_details
    GROUP BY enquiry_id, customer_id
) AS mf ON f.id = mf.enquiry_id AND s.id = mf.customer_id
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
    AND (f.enquiry_category_id = categoryId)
    AND (
        EXTRACT(MONTH FROM mf.max_followup_date) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND (
            EXTRACT(YEAR FROM mf.max_followup_date) < EXTRACT(YEAR FROM CURRENT_DATE)
            OR (
                EXTRACT(YEAR FROM mf.max_followup_date) = EXTRACT(YEAR FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM mf.max_followup_date) <= EXTRACT(MONTH FROM CURRENT_DATE)
            )
        )
    );

    ELSE
 
SELECT COUNT(*) AS total_count
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
LEFT JOIN (
    SELECT enquiry_id, customer_id, MAX(next_followup_date) AS max_followup_date
    FROM follow_up_details
    GROUP BY enquiry_id, customer_id
) AS mf ON f.id = mf.enquiry_id AND s.id = mf.customer_id
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
AND f.salesperson_id = salespersonId
    AND (f.enquiry_category_id = categoryId)
    AND (
        EXTRACT(MONTH FROM mf.max_followup_date) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND (
            EXTRACT(YEAR FROM mf.max_followup_date) < EXTRACT(YEAR FROM CURRENT_DATE)
            OR (
                EXTRACT(YEAR FROM mf.max_followup_date) = EXTRACT(YEAR FROM CURRENT_DATE)
                AND EXTRACT(MONTH FROM mf.max_followup_date) <= EXTRACT(MONTH FROM CURRENT_DATE)
            )
        )
    );

    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_last_month_enquiry_list` (IN `branchId` INT, IN `isAdmin` BOOLEAN, IN `salespersonId` INT)  BEGIN
IF (isAdmin = TRUE) THEN
         SELECT
    s.id,
    s.first_name,
    s.last_name,
    s.phone_number,
    s.whatsapp_number,
    s.email,
    ep.manufacturer AS make,
    md.old_tractor AS oldOwned,
    (
        SELECT GROUP_CONCAT(modalName)
        FROM enquiry_products AS f1
        INNER JOIN modal AS s1 ON s1.id = f1.modal
        WHERE f1.enquiry_id = f.id
    ) AS product,
    CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
    ecp.category_name,
    f.date,
    f.delivery_date,
    f.enquiry_category_id,
    f.modal_id,
    f.primary_source_id,
    f.enquiry_source_id,
    f.id AS enquiry_id,
    taluka.id AS taluka_id,
    taluka.name AS taluka,
    village.id AS village_id,
    village.name AS village,
    (
        SELECT name
        FROM enquiry_sources
        WHERE id = f.enquiry_source_id
    ) AS enquiry_source
FROM
    enquiries AS f
INNER JOIN
    customers AS s ON s.id = f.customer_id
INNER JOIN
    branches AS t ON f.branch_id = t.id
LEFT JOIN
    users AS fo ON fo.id = f.salesperson_id
LEFT JOIN
    enquiry_category AS ecp ON ecp.id = f.enquiry_category_id
INNER JOIN
    enquiry_products AS ep ON ep.enquiry_id = f.id
INNER JOIN
    manufactur_details AS md ON md.enquiry_id = f.id
LEFT JOIN
    taluka ON taluka.id = s.taluka
LEFT JOIN
    village ON village.id = s.village
WHERE
    (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
    AND DATE_FORMAT(f.date, '%Y-%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m')
ORDER BY
    f.date DESC;
    ELSE
        SELECT
    s.id,
    s.first_name,
    s.last_name,
    s.phone_number,
    s.whatsapp_number,
    s.email,
    ep.manufacturer AS make,
    md.old_tractor AS oldOwned,
    (
        SELECT GROUP_CONCAT(modalName)
        FROM enquiry_products AS f1
        INNER JOIN modal AS s1 ON s1.id = f1.modal
        WHERE f1.enquiry_id = f.id
    ) AS product,
    CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
    ecp.category_name,
    f.date,
    f.delivery_date,
    f.enquiry_category_id,
    f.modal_id,
    f.primary_source_id,
    f.enquiry_source_id,
    f.id AS enquiry_id,
    taluka.id AS taluka_id,
    taluka.name AS taluka,
    village.id AS village_id,
    village.name AS village,
    (
        SELECT name
        FROM enquiry_sources
        WHERE id = f.enquiry_source_id
    ) AS enquiry_source
FROM
    enquiries AS f
INNER JOIN
    customers AS s ON s.id = f.customer_id
INNER JOIN
    branches AS t ON f.branch_id = t.id
LEFT JOIN
    users AS fo ON fo.id = f.salesperson_id
LEFT JOIN
    enquiry_category AS ecp ON ecp.id = f.enquiry_category_id
INNER JOIN
    enquiry_products AS ep ON ep.enquiry_id = f.id
INNER JOIN
    manufactur_details AS md ON md.enquiry_id = f.id
LEFT JOIN
    taluka ON taluka.id = s.taluka
LEFT JOIN
    village ON village.id = s.village
WHERE
    (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
    AND DATE_FORMAT(f.date, '%Y-%m') = DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m')
    AND (f.salesperson_id = salespersonId)
ORDER BY
    f.date DESC;
    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_leave_details` (IN `userId` INT, IN `isAdmin` BOOLEAN)  BEGIN
IF (isAdmin = TRUE) THEN
SELECT  f.id AS EmployeeId, CONCAT(f.first_name, ' ', f.last_name) AS Employee,
       ld.LeaveType AS leaveid,
       lt.leave_type AS LeaveType,
       ld.startDate,
       ld.endDate,
       ld.reason,
       ld.email,
       ld.userName
FROM leave_details AS ld
INNER JOIN users AS f ON f.id = ld.user_id
INNER JOIN leave_type AS lt ON  ld.LeaveType = lt.id;
 ELSE
 SELECT  f.id AS EmployeeId, CONCAT(f.first_name, ' ', f.last_name) AS Employee,
       ld.LeaveType AS leaveid,
       lt.leave_type AS LeaveType,
       ld.startDate,
       ld.endDate,
       ld.reason,
       ld.email,
        ld.userName
FROM leave_details AS ld
INNER JOIN users AS f ON f.id = ld.user_id
INNER JOIN leave_type AS lt ON  ld.LeaveType = lt.id
WHERE f.id = userId;
 END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_new_enquiry_list` (IN `branchId` INT, IN `isAdmin` BOOLEAN, IN `salespersonId` INT, IN `categoryId` INT)  BEGIN
IF (isAdmin = TRUE) THEN
         SELECT
    s.id,
    s.first_name,
    s.last_name,
    s.phone_number,
    s.whatsapp_number,
    s.email,
    ep.manufacturer AS make,
    md.old_tractor AS oldOwned,
    (
        SELECT GROUP_CONCAT(modalName)
        FROM enquiry_products AS f1
        INNER JOIN modal AS s1 ON s1.id = f1.modal
        WHERE f1.enquiry_id = f.id
    ) AS product,
    CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
    ecp.category_name,
    f.date,
    f.delivery_date,
    f.enquiry_category_id,
    f.modal_id,
    f.primary_source_id,
    f.enquiry_source_id,
    f.id AS enquiry_id,
    taluka.id AS taluka_id,
    taluka.name AS taluka,
    village.id AS village_id,
    village.name AS village,
    (
        SELECT name
        FROM enquiry_sources
        WHERE id = f.enquiry_source_id
    ) AS enquiry_source
FROM
    enquiries AS f
INNER JOIN
    customers AS s ON s.id = f.customer_id
INNER JOIN
    branches AS t ON f.branch_id = t.id
LEFT JOIN
    users AS fo ON fo.id = f.salesperson_id
LEFT JOIN
    enquiry_category AS ecp ON ecp.id = f.enquiry_category_id
INNER JOIN
    enquiry_products AS ep ON ep.enquiry_id = f.id
INNER JOIN
    manufactur_details AS md ON md.enquiry_id = f.id
LEFT JOIN
    taluka ON taluka.id = s.taluka
LEFT JOIN
    village ON village.id = s.village
LEFT JOIN
    follow_up_details AS fud ON fud.enquiry_id = f.id
WHERE
    (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
    AND fud.enquiry_id IS NULL
    AND (f.enquiry_category_id = categoryId)
ORDER BY
    f.date DESC;
    ELSE
        SELECT
    s.id,
    s.first_name,
    s.last_name,
    s.phone_number,
    s.whatsapp_number,
    s.email,
    ep.manufacturer AS make,
    md.old_tractor AS oldOwned,
    (
        SELECT GROUP_CONCAT(modalName)
        FROM enquiry_products AS f1
        INNER JOIN modal AS s1 ON s1.id = f1.modal
        WHERE f1.enquiry_id = f.id
    ) AS product,
    CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
    ecp.category_name,
    f.date,
    f.delivery_date,
    f.enquiry_category_id,
    f.modal_id,
    f.primary_source_id,
    f.enquiry_source_id,
    f.id AS enquiry_id,
    taluka.id AS taluka_id,
    taluka.name AS taluka,
    village.id AS village_id,
    village.name AS village,
    (
        SELECT name
        FROM enquiry_sources
        WHERE id = f.enquiry_source_id
    ) AS enquiry_source
FROM
    enquiries AS f
INNER JOIN
    customers AS s ON s.id = f.customer_id
INNER JOIN
    branches AS t ON f.branch_id = t.id
LEFT JOIN
    users AS fo ON fo.id = f.salesperson_id
LEFT JOIN
    enquiry_category AS ecp ON ecp.id = f.enquiry_category_id
INNER JOIN
    enquiry_products AS ep ON ep.enquiry_id = f.id
INNER JOIN
    manufactur_details AS md ON md.enquiry_id = f.id
LEFT JOIN
    taluka ON taluka.id = s.taluka
LEFT JOIN
    village ON village.id = s.village
LEFT JOIN
    follow_up_details AS fud ON fud.enquiry_id = f.id
WHERE
    (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
    AND (f.salesperson_id = salespersonId)
    AND (f.enquiry_category_id = categoryId)
    AND fud.enquiry_id IS NULL
ORDER BY
    f.date DESC;
    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_new_enquiry_list_total_count` (IN `isAdmin` BOOLEAN, IN `salespersonId` INT, IN `categoryId` INT)  BEGIN
IF (isAdmin = TRUE) THEN
 

-- Total count query
SELECT COUNT(*) AS total_count
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
LEFT JOIN follow_up_details AS fud ON fud.enquiry_id = f.id
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
    AND fud.enquiry_id IS NULL
    AND (f.enquiry_category_id = categoryId);
    ELSE
 
-- Total count query
SELECT COUNT(*) AS total_count
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
LEFT JOIN follow_up_details AS fud ON fud.enquiry_id = f.id
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
    AND fud.enquiry_id IS NULL
    AND (f.enquiry_category_id = categoryId)
 AND (f.salesperson_id = salespersonId);
    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_no_work_report_for_currentdate` ()  BEGIN
SELECT 
    CONCAT(f.first_name, ' ', f.last_name) AS Employee,
    f.Phone_Number,
    tt.TaskType_Name,
    ts.Task_Name,
    IFNULL(SUM(wl.id IS NOT NULL), 0) AS TaskCompleted,
    COALESCE(atd.taskcount, 0) AS TotalTask,
    tp.Period_Name
FROM 
    users AS f
INNER JOIN 
    addtask_data AS atd ON atd.employee = f.id
INNER JOIN 
    task_types AS tt ON tt.tasktype_id = atd.tasktype
INNER JOIN 
    tasks AS ts ON ts.id = atd.task
LEFT JOIN 
    worklog AS wl ON f.id = wl.user_id AND wl.tasktype = atd.tasktype AND wl.task = atd.task AND DATE(wl.datetime) = CURDATE()
LEFT JOIN 
    tasktime_period AS tp ON tp.id = atd.tasktime_period
WHERE
    DATE(wl.datetime) != CURDATE() OR wl.user_id IS NULL
GROUP BY 
    f.id, CONCAT(f.first_name, ' ', f.last_name), tt.TaskType_Name, ts.Task_Name, tp.Period_Name;

END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_old_products` (IN `enquiryId` INT)  BEGIN
SELECT
	op.enquiry_id,
    op.maker, 
    mf.name AS company, 
    op.modalName, 
    ml.modalName, 
    op.variantName, 
    vi.variantName, 
    op.year_of_manufactur
FROM
    manufactur_details AS op
LEFT JOIN
    manufacturers AS mf ON mf.id = op.maker
LEFT JOIN
    modal AS ml ON ml.id = op.modalName
LEFT JOIN
    variant AS vi ON vi.id = op.variantName
WHERE
    op.enquiry_id = enquiryId;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_product_documents_details` (IN `mappingId` INT, IN `productType` INT)  BEGIN
    IF productType = 1 THEN
        SELECT ds.document_path, ds.link
        FROM document_details AS dd
        LEFT JOIN manufacturers AS ms ON ms.id = dd.mapping_id
        LEFT JOIN documents AS ds ON ds.document_id = dd.document_id
        WHERE dd.mapping_id = mappingId AND dd.mapping_table = 'manufacturer_data';
    ELSE
        SELECT ds.document_path, ds.link
        FROM document_details AS dd
        LEFT JOIN modal AS ms ON ms.id = dd.mapping_id
        LEFT JOIN documents AS ds ON ds.document_id = dd.document_id
        WHERE dd.mapping_id = mappingId AND dd.mapping_table = 'manufacturerModal_data';
    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_role_list` ()  BEGIN
	SELECT * from roles where `active` = 1 and `delete` = 0;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_selected_enquiry_fields_by_category` (IN `categoryId` INT)  BEGIN
SELECT f.field_id, ef.field FROM enquiry_category_field as f inner join enquiry_category as s on s.id = f.category_id inner join enquiry_fields as ef on ef.id = f.field_id where category_id = categoryId;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_ssp_message_data` (IN `enquiryId` INT)  BEGIN
SELECT f.id, CONCAT_WS(' ', c.first_name, c.last_name) AS customerName, c.phone_number, p.modalName AS product, CONCAT_WS(' ', u.first_name, u.last_name) AS salesPersonName,
	CASE 
        WHEN u.phone_number LIKE '91%' THEN u.phone_number
        ELSE CONCAT('91', u.phone_number)
    END AS SSPNumber
FROM enquiries AS f
LEFT JOIN users AS u ON u.id = f.salesperson_id
LEFT JOIN customers AS c ON c.id = f.customer_id
LEFT JOIN modal AS p ON p.id = f.modal_id
WHERE f.id = enquiryId;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_task_assignment_notification_data` (IN `employeeId` INT)  BEGIN
SELECT CONCAT_WS(' ', u.first_name, u.last_name) AS sales_person,
	CASE 
        WHEN u.phone_number LIKE '91%' THEN u.phone_number
        ELSE CONCAT('91', u.phone_number)
    END AS ssp_number
FROM users AS u WHERE u.id = employeeId;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_task_assign_employee_list` (IN `userId` INT, IN `isAdmin` BOOLEAN, IN `startDate` DATE, IN `endDate` DATE)  BEGIN
    IF isAdmin THEN
        SELECT 
            s.id,
            CONCAT(s.first_name, ' ', s.last_name) AS employee,
            att.taskcount,
            att.startdate,
            att.enddate
        FROM addtask_data AS att
        INNER JOIN users AS s ON att.employee = s.id
        WHERE att.startdate >= startDate AND att.enddate <= endDate
      GROUP BY att.employee;

    ELSE
        SELECT 
            s.id,
            CONCAT(s.first_name, ' ', s.last_name) AS employee,
            att.taskcount,
            att.startdate,
            att.enddate
        FROM addtask_data AS att
        INNER JOIN users AS s ON att.employee = s.id
        WHERE att.employee = userId AND att.startdate >= startDate AND att.enddate <= endDate
       GROUP BY att.employee;
    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_task_completed_by_employee` (IN `userId` INT, IN `isAdmin` BOOLEAN, IN `EmployeeId` INT)  BEGIN
    IF (isAdmin = TRUE) THEN
          SELECT 
    f.id AS EmployeeId, 
    CONCAT(f.first_name, ' ', f.last_name) AS Employee, 
    tt.tasktype_name, 
    ts.task_name, 
    wl.work_description, 
    wl.datetime, 
    wl.spendtime
FROM worklog AS wl
INNER JOIN users AS f ON f.id = wl.user_id
INNER JOIN task_types AS tt ON tt.tasktype_id = wl.tasktype
INNER JOIN tasks AS ts ON ts.id = wl.task;
    ELSE
     SELECT f.id AS EmployeeId, CONCAT(f.first_name, ' ', f.last_name) AS Employee, tt.tasktype_name, ts.task_name, wl.work_description, wl.datetime, wl.spendtime
        FROM worklog AS wl
        INNER JOIN users AS f ON f.id = wl.user_id
        INNER JOIN task_types AS tt ON tt.tasktype_id = wl.tasktype
        INNER JOIN tasks AS ts ON ts.id = wl.task
        WHERE wl.user_id = userId;

    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_task_for_currentdate` ()  BEGIN
    SELECT 
        CONCAT(s.first_name, ' ', s.last_name) AS Employee,
        tt.Tasktype_Name,
        t.Task_Name,
        tp.Period_Name,
        att.TaskCount,
        att.StartDate,
        att.EndDate
    FROM 
        addtask_data AS att
    INNER JOIN 
        users AS s ON att.employee = s.id
    LEFT JOIN 
        task_types AS tt ON tt.tasktype_id = att.tasktype
    LEFT JOIN 
        tasks AS t ON t.id = att.task
    LEFT JOIN 
        tasktime_period AS tp ON tp.id = att.tasktime_period
    WHERE 
        DATE(att.startdate) = CURDATE() 
        AND CURDATE() <= DATE(att.enddate)
    GROUP BY 
        att.employee, tt.Tasktype_Name, t.Task_Name, tp.Period_Name;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_task_list` ()  BEGIN
SELECT att.id as id, s.id as EmployeeId, CONCAT(s.first_name, ' ', s.last_name) as employee, tt.tasktype_name, ts.task_name, att.taskcount, att.startdate, att.enddate, tp.period_name,tts.task_status, att.task_status,tc.category_name, att.category_name as category
FROM addtask_data AS att
INNER JOIN users AS s ON att.employee = s.id
INNER JOIN task_types AS tt ON att.tasktype = tt.tasktype_id
INNER JOIN tasks AS ts ON ts.id = att.task
INNER JOIN tasktime_period AS tp ON att.tasktime_period = tp.id
INNER JOIN task_status AS tts ON att.task_status=tts.id
INNER JOIN enquiry_category AS tc ON att.category_name=tc.id
ORDER BY att.id ASC;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_todays_enquiry_bookin_count` ()  BEGIN

   
WITH DayOfWeek AS (
    SELECT 1 AS day_num, 'Monday' AS day_name
    UNION SELECT 2, 'Tuesday'
    UNION SELECT 3, 'Wednesday'
    UNION SELECT 4, 'Thursday'
    UNION SELECT 5, 'Friday'
    UNION SELECT 6, 'Saturday'
    UNION SELECT 0, 'Sunday'
),
EnquiryCounts AS (
    SELECT 
        DAYNAME(e.date) AS day,
        COUNT(*) AS totalEnquiry
    FROM 
        enquiries e
    WHERE
        DATE(e.date) BETWEEN 
            CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 2) DAY  -- Filter from Monday
            AND CURDATE() + INTERVAL (6 - DAYOFWEEK(CURDATE())) DAY  -- Filter to Sunday
    GROUP BY 
        DAY(e.date)
),
BookingCounts AS (
    SELECT 
        DAYNAME(b.booking_date) AS day,
        COUNT(*) AS totalbooking
    FROM 
        booking b
    WHERE
        DATE(b.booking_date) BETWEEN 
            CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 2) DAY  -- Filter from Monday
            AND CURDATE() + INTERVAL (6 - DAYOFWEEK(CURDATE())) DAY  -- Filter to Sunday
    GROUP BY 
        DAY(b.booking_date)
)

SELECT 
    dw.day_name AS day,
    COALESCE(ec.totalEnquiry, 0) AS totalEnquiry,
    COALESCE(bc.totalbooking, 0) AS totalbooking
FROM 
    DayOfWeek dw
LEFT JOIN 
    EnquiryCounts ec
ON 
    dw.day_name = ec.day
LEFT JOIN 
    BookingCounts bc
ON 
    dw.day_name = bc.day
ORDER BY
    dw.day_num;





   

END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_todays_enquiry_list` (IN `branchId` INT, IN `isAdmin` BOOLEAN, IN `salespersonId` INT)  BEGIN
IF (isAdmin = TRUE) THEN
         SELECT
    s.id,
    s.first_name,
    s.last_name,
    s.phone_number,
    s.whatsapp_number,
    s.email,
    ep.manufacturer AS make,
    md.old_tractor AS oldOwned,
    (
        SELECT GROUP_CONCAT(modalName)
        FROM enquiry_products AS f1
        INNER JOIN modal AS s1 ON s1.id = f1.modal
        WHERE f1.enquiry_id = f.id
    ) AS product,
    CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
    ecp.category_name,
    f.date,
    f.delivery_date,
    f.enquiry_category_id,
    f.modal_id,
    f.primary_source_id,
    f.enquiry_source_id,
    f.id AS enquiry_id,
    taluka.id AS taluka_id,
    taluka.name AS taluka,
    village.id AS village_id,
    village.name AS village,
    (
        SELECT name
        FROM enquiry_sources
        WHERE id = f.enquiry_source_id
    ) AS enquiry_source
FROM
    enquiries AS f
INNER JOIN
    customers AS s ON s.id = f.customer_id
INNER JOIN
    branches AS t ON f.branch_id = t.id
LEFT JOIN
    users AS fo ON fo.id = f.salesperson_id
LEFT JOIN
    enquiry_category AS ecp ON ecp.id = f.enquiry_category_id
INNER JOIN
    enquiry_products AS ep ON ep.enquiry_id = f.id
INNER JOIN
    manufactur_details AS md ON md.enquiry_id = f.id
LEFT JOIN
    taluka ON taluka.id = s.taluka
LEFT JOIN
    village ON village.id = s.village
WHERE
    (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
    AND DATE(f.date) = CURDATE()
ORDER BY
    f.date DESC;
    ELSE
        SELECT
    s.id,
    s.first_name,
    s.last_name,
    s.phone_number,
    s.whatsapp_number,
    s.email,
    ep.manufacturer AS make,
    md.old_tractor AS oldOwned,
    (
        SELECT GROUP_CONCAT(modalName)
        FROM enquiry_products AS f1
        INNER JOIN modal AS s1 ON s1.id = f1.modal
        WHERE f1.enquiry_id = f.id
    ) AS product,
    CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
    ecp.category_name,
    f.date,
    f.delivery_date,
    f.enquiry_category_id,
    f.modal_id,
    f.primary_source_id,
    f.enquiry_source_id,
    f.id AS enquiry_id,
    taluka.id AS taluka_id,
    taluka.name AS taluka,
    village.id AS village_id,
    village.name AS village,
    (
        SELECT name
        FROM enquiry_sources
        WHERE id = f.enquiry_source_id
    ) AS enquiry_source
FROM
    enquiries AS f
INNER JOIN
    customers AS s ON s.id = f.customer_id
INNER JOIN
    branches AS t ON f.branch_id = t.id
LEFT JOIN
    users AS fo ON fo.id = f.salesperson_id
LEFT JOIN
    enquiry_category AS ecp ON ecp.id = f.enquiry_category_id
INNER JOIN
    enquiry_products AS ep ON ep.enquiry_id = f.id
INNER JOIN
    manufactur_details AS md ON md.enquiry_id = f.id
LEFT JOIN
    taluka ON taluka.id = s.taluka
LEFT JOIN
    village ON village.id = s.village
WHERE
    (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
    AND (f.salesperson_id = salespersonId)
    AND DATE(f.date) = CURDATE()
ORDER BY
    f.date DESC;
    END IF;


END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_total_enquiry_booking` ()  BEGIN
WITH EnquiryCounts AS (
    SELECT MONTHNAME(e.date) AS month,
           COUNT(*) AS totalEnquiry
    FROM enquiries e
    GROUP BY MONTH(e.date)
),
BookingCounts AS (
    SELECT MONTHNAME(b.booking_date) AS month,
           COUNT(*) AS totalbooking
    FROM booking b
    GROUP BY MONTH(b.booking_date)
)
SELECT ec.month,
       ec.totalEnquiry,
       bc.totalbooking
FROM EnquiryCounts ec
 left JOIN BookingCounts bc ON ec.month = bc.month;

END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_total_enquiry_perCategory` (IN `villageId` INT)  BEGIN
SELECT e.*, COUNT(e.enquiry_category_id) AS total_enquiries
FROM enquiries AS e
LEFT JOIN enquiry_category AS et ON et.id = e.enquiry_category_id
LEFT JOIN customers AS c ON c.id = e.customer_id WHERE c.village = villageId
GROUP BY e.enquiry_category_id;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_user_created_enquiry` (IN `userId` INT, IN `categoryId` INT)  BEGIN
SELECT
    s.id,
    s.first_name,
    s.last_name,
    s.phone_number,
    s.whatsapp_number,
    s.email,
    ep.manufacturer AS make,
    md.old_tractor AS oldOwned,
    GROUP_CONCAT(modalName) AS product,
    CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
    ecp.category_name,
    f.date,
    f.delivery_date,
    f.enquiry_category_id,
    f.modal_id,
    f.primary_source_id,
    f.enquiry_source_id,
    f.id AS enquiry_id,
    taluka.id AS taluka_id,
    taluka.name AS taluka,
    village.id AS village_id,
    village.name AS village,
    (SELECT name FROM enquiry_sources WHERE id = f.enquiry_source_id) AS enquiry_source
FROM
    enquiries AS f
INNER JOIN
    customers AS s ON s.id = f.customer_id
INNER JOIN
    branches AS t ON f.branch_id = t.id
LEFT JOIN
    users AS fo ON fo.id = f.salesperson_id
LEFT JOIN
    enquiry_category AS ecp ON ecp.id = f.enquiry_category_id
INNER JOIN
    enquiry_products AS ep ON ep.enquiry_id = f.id
INNER JOIN
    manufactur_details AS md ON md.enquiry_id = f.id
LEFT JOIN
    taluka ON taluka.id = s.taluka
LEFT JOIN
    village ON village.id = s.village
LEFT JOIN
    follow_up_details AS fud ON fud.enquiry_id = f.id
WHERE
    (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
    AND (f.user_created = userId)
    AND (f.enquiry_category_id = categoryId)
GROUP BY
    f.id  -- Group by the enquiry ID to combine related data into one row
ORDER BY
    f.date DESC;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_user_created_enquiry_list_total_count` (IN `userId` INT, IN `categoryId` INT)  BEGIN

SELECT COUNT(*) AS total_count
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
LEFT JOIN follow_up_details AS fud ON fud.enquiry_id = f.id
WHERE
    (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
    AND (f.user_created = userId)
    AND (f.enquiry_category_id = categoryId);

END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_user_list` (IN `userId` INT(11), IN `branchId` INT(11), IN `isAdmin` BOOLEAN)  BEGIN
IF (isAdmin = TRUE) then
SELECT distinct f.id, f.first_name, f.last_name, f.email, f.is_active, f.phone_number  FROM users as f  where f.id and f.is_delete = 0;
ELSE
    SELECT distinct f.id, f.first_name, f.last_name, f.email, f.is_active, f.phone_number  FROM users as f inner join branch_department_user as s on s.user_id = f.id  inner join branches as t on s.branch_id = t.id where s.branch_id = branchId and user_type_id=1 and f.is_delete=0 and f.id not in((select user_id from branch_department_user where role_id  =1 limit 1), userId);
END IF;	
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_user_sale_person` (IN `distributionId` INT, IN `categoryId` INT)  BEGIN
SELECT a.user_id AS userId, CONCAT(u.first_name, ' ', u.last_name) AS sale_person
    FROM area_assign_user AS a
    JOIN users AS u ON a.user_id = u.id
    WHERE a.distribution_id = distributionId AND a.category_id = categoryId;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_user_task_by_UserId` (IN `userId` INT, IN `isAdmin` BOOLEAN, IN `startDate` DATE, IN `endDate` DATE)  BEGIN
 IF isAdmin THEN
 SELECT 
    s.id,
    CONCAT(s.first_name, ' ', s.last_name) AS employee,
    tt.tasktype_name,
    att.tasktype,
    ts.task_name,
    att.task,
    ec.category_name,
    att.category_name AS category_id,
    att.taskcount,
    att.startdate,
    att.enddate,
    tp.period_name,
    COUNT(wl.user_id) AS taskCompleted
FROM addtask_data AS att
INNER JOIN users AS s ON att.employee = s.id
INNER JOIN task_types AS tt ON att.tasktype = tt.tasktype_id
INNER JOIN tasks AS ts ON ts.id = att.task
INNER JOIN tasktime_period AS tp ON att.tasktime_period = tp.id
INNER JOIN enquiry_category AS ec ON  ec.id = att.category_name
LEFT JOIN worklog AS wl ON wl.user_id = att.employee AND wl.tasktype = att.tasktype AND wl.task = att.task
  WHERE att.employee = userId AND att.startdate >= startDate AND att.enddate <= endDate
GROUP BY att.employee, att.tasktype, att.task;
  ELSE
         SELECT 
    s.id,
    CONCAT(s.first_name, ' ', s.last_name) AS employee,
    tt.tasktype_name,
    att.tasktype,
    ts.task_name,
    att.task,
    ec.category_name,
    att.category_name AS category_id,
    att.taskcount,
    att.startdate,
    att.enddate,
    tp.period_name,
    COUNT(wl.user_id) AS taskCompleted
FROM addtask_data AS att
INNER JOIN users AS s ON att.employee = s.id
INNER JOIN task_types AS tt ON att.tasktype = tt.tasktype_id
INNER JOIN tasks AS ts ON ts.id = att.task
INNER JOIN tasktime_period AS tp ON att.tasktime_period = tp.id
INNER JOIN enquiry_category AS ec ON  ec.id = att.category_name
LEFT JOIN worklog AS wl ON wl.user_id = att.employee AND wl.tasktype = att.tasktype AND wl.task = att.task
   WHERE att.employee = userId AND att.startdate >= startDate AND att.enddate <= endDate 
GROUP BY att.employee, att.tasktype, att.task;
  END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_user_task_list_by_user` (IN `userId` INT, IN `isAdmin` BOOLEAN)  BEGIN
    IF isAdmin THEN
        SELECT 
    s.id,
    CONCAT(s.first_name, ' ', s.last_name) AS employee,
    tt.tasktype_name,
    att.tasktype,
    ts.task_name,
    att.task,
    ec.category_name,
    att.category_name AS category_id,
    att.taskcount,
    att.startdate,
    att.enddate,
    tp.period_name,
    COUNT(wl.user_id) AS taskCompleted
FROM addtask_data AS att
INNER JOIN users AS s ON att.employee = s.id
INNER JOIN task_types AS tt ON att.tasktype = tt.tasktype_id
INNER JOIN tasks AS ts ON ts.id = att.task
INNER JOIN tasktime_period AS tp ON att.tasktime_period = tp.id
INNER JOIN enquiry_category AS ec ON  ec.id = att.category_name
LEFT JOIN worklog AS wl ON wl.user_id = att.employee AND wl.tasktype = att.tasktype AND wl.task = att.task
GROUP BY att.employee, att.tasktype, att.task, att.category_name;

    ELSE
        SELECT 
    s.id,
    CONCAT(s.first_name, ' ', s.last_name) AS employee,
    tt.tasktype_name,
    att.tasktype,
    ts.task_name,
    att.task,
    ec.category_name,
    att.category_name AS category_id,
    att.taskcount,
    att.startdate,
    att.enddate,
    tp.period_name,
    COUNT(wl.user_id) AS taskCompleted
FROM addtask_data AS att
INNER JOIN users AS s ON att.employee = s.id
INNER JOIN task_types AS tt ON att.tasktype = tt.tasktype_id
INNER JOIN tasks AS ts ON ts.id = att.task
INNER JOIN tasktime_period AS tp ON att.tasktime_period = tp.id
INNER JOIN enquiry_category AS ec ON  ec.id = att.category_name
LEFT JOIN worklog AS wl ON wl.user_id = att.employee AND wl.tasktype = att.tasktype AND wl.task = att.task
WHERE att.employee = userId
GROUP BY att.employee, att.tasktype, att.task;

    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_village_list_by_total_enquiry` ()  BEGIN
SELECT v.*, COUNT(c.village) AS total_enquiries
FROM village AS v
LEFT JOIN customers AS c ON v.id = c.village
GROUP BY v.id
ORDER BY total_enquiries DESC, v.name ASC;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_warm_enquiry` (IN `branchId` INT, IN `isAdmin` BOOLEAN, IN `salespersonId` INT, IN `categoryId` INT)  BEGIN
IF (isAdmin = TRUE) THEN
        WITH MaxFollowup AS (
    SELECT
        customer_id,
        MAX(next_followup_date) AS max_followup_date
    FROM follow_up_details
    GROUP BY customer_id
)

SELECT
    s.id,
    s.first_name,
    s.last_name,
    s.phone_number,
    s.whatsapp_number,
    s.email,
    ep.manufacturer AS make,
    md.old_tractor AS oldOwned,
    (
        SELECT modalName
        FROM enquiry_products AS f1
        INNER JOIN modal AS s1 ON s1.id = f1.modal
        WHERE f1.enquiry_id = f.id
    ) AS product,
    CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
    ecp.category_name,
    f.date,
    f.delivery_date,
    f.enquiry_category_id,
    f.modal_id,
    f.primary_source_id,
    f.enquiry_source_id,
    f.id AS enquiry_id,
    fud.next_followup_date,
    (
        SELECT name
        FROM taluka
        WHERE id = s.taluka
    ) AS taluka,
    (
        SELECT id
        FROM taluka
        WHERE id = s.taluka
    ) AS taluka_id,
    (
        SELECT name
        FROM village
        WHERE id = s.village
    ) AS village,
    (
        SELECT id
        FROM village
        WHERE id = s.village
    ) AS village_id,
    (
        SELECT name
        FROM enquiry_sources
        WHERE id = f.enquiry_source_id
    ) AS enquiry_source,
    fud.last_discussion
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
INNER JOIN branches AS t ON f.branch_id = t.id
LEFT JOIN users AS fo ON fo.id = f.salesperson_id
LEFT JOIN enquiry_category AS ecp ON ecp.id = f.enquiry_category_id
INNER JOIN enquiry_products AS ep ON ep.enquiry_id = f.id
INNER JOIN manufactur_details AS md ON md.enquiry_id = f.id
INNER JOIN MaxFollowup AS mf ON mf.customer_id = s.id
INNER JOIN follow_up_details AS fud ON fud.enquiry_id = f.id AND fud.customer_id = s.id AND fud.next_followup_date = mf.max_followup_date
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
AND (f.enquiry_category_id = categoryId)
    AND (
        (EXTRACT(YEAR FROM fud.next_followup_date) = EXTRACT(YEAR FROM CURRENT_DATE) AND
        EXTRACT(MONTH FROM fud.next_followup_date) > EXTRACT(MONTH FROM CURRENT_DATE) + 1)
        OR
        (EXTRACT(YEAR FROM fud.next_followup_date) > EXTRACT(YEAR FROM CURRENT_DATE))
    );
    ELSE
       WITH MaxFollowup AS (
    SELECT
        customer_id,
        MAX(next_followup_date) AS max_followup_date
    FROM follow_up_details
    GROUP BY customer_id
)

SELECT
    s.id,
    s.first_name,
    s.last_name,
    s.phone_number,
    s.whatsapp_number,
    s.email,
    ep.manufacturer AS make,
    md.old_tractor AS oldOwned,
    (
        SELECT modalName
        FROM enquiry_products AS f1
        INNER JOIN modal AS s1 ON s1.id = f1.modal
        WHERE f1.enquiry_id = f.id
    ) AS product,
    CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
    ecp.category_name,
    f.date,
    f.delivery_date,
    f.enquiry_category_id,
    f.modal_id,
    f.primary_source_id,
    f.enquiry_source_id,
    f.id AS enquiry_id,
    fud.next_followup_date,
    (
        SELECT name
        FROM taluka
        WHERE id = s.taluka
    ) AS taluka,
    (
        SELECT id
        FROM taluka
        WHERE id = s.taluka
    ) AS taluka_id,
    (
        SELECT name
        FROM village
        WHERE id = s.village
    ) AS village,
    (
        SELECT id
        FROM village
        WHERE id = s.village
    ) AS village_id,
    (
        SELECT name
        FROM enquiry_sources
        WHERE id = f.enquiry_source_id
    ) AS enquiry_source,
    fud.last_discussion
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
INNER JOIN branches AS t ON f.branch_id = t.id
LEFT JOIN users AS fo ON fo.id = f.salesperson_id
LEFT JOIN enquiry_category AS ecp ON ecp.id = f.enquiry_category_id
INNER JOIN enquiry_products AS ep ON ep.enquiry_id = f.id
INNER JOIN manufactur_details AS md ON md.enquiry_id = f.id
INNER JOIN MaxFollowup AS mf ON mf.customer_id = s.id
INNER JOIN follow_up_details AS fud ON fud.enquiry_id = f.id AND fud.customer_id = s.id AND fud.next_followup_date = mf.max_followup_date
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
AND f.salesperson_id = salespersonId
AND (f.enquiry_category_id = categoryId)
    AND (
        (EXTRACT(YEAR FROM fud.next_followup_date) = EXTRACT(YEAR FROM CURRENT_DATE) AND
        EXTRACT(MONTH FROM fud.next_followup_date) > EXTRACT(MONTH FROM CURRENT_DATE) + 1)
        OR
        (EXTRACT(YEAR FROM fud.next_followup_date) > EXTRACT(YEAR FROM CURRENT_DATE))
    );
    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_warm_enquiry_list_total_count` (IN `isAdmin` BOOLEAN, IN `salespersonId` INT, IN `categoryId` INT)  BEGIN
IF (isAdmin = TRUE) THEN
SELECT COUNT(*) AS total_count
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
LEFT JOIN (
    SELECT enquiry_id, customer_id, MAX(next_followup_date) AS max_followup_date
    FROM follow_up_details
    GROUP BY enquiry_id, customer_id
) AS mf ON f.id = mf.enquiry_id AND s.id = mf.customer_id
LEFT JOIN follow_up_details AS fud ON fud.enquiry_id = f.id AND fud.customer_id = s.id AND fud.next_followup_date = mf.max_followup_date
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
AND (f.enquiry_category_id = categoryId)
AND (
    (EXTRACT(YEAR FROM mf.max_followup_date) = EXTRACT(YEAR FROM CURRENT_DATE) AND
    EXTRACT(MONTH FROM mf.max_followup_date) > EXTRACT(MONTH FROM CURRENT_DATE) + 1)
    OR
    (EXTRACT(YEAR FROM mf.max_followup_date) > EXTRACT(YEAR FROM CURRENT_DATE))
);
    ELSE
SELECT COUNT(*) AS total_count
FROM enquiries AS f
INNER JOIN customers AS s ON s.id = f.customer_id
LEFT JOIN (
    SELECT enquiry_id, customer_id, MAX(next_followup_date) AS max_followup_date
    FROM follow_up_details
    GROUP BY enquiry_id, customer_id
) AS mf ON f.id = mf.enquiry_id AND s.id = mf.customer_id
LEFT JOIN follow_up_details AS fud ON fud.enquiry_id = f.id AND fud.customer_id = s.id AND fud.next_followup_date = mf.max_followup_date
WHERE (f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID')
AND (f.salesperson_id = salespersonId)
AND (f.enquiry_category_id = categoryId)
AND (
    (EXTRACT(YEAR FROM mf.max_followup_date) = EXTRACT(YEAR FROM CURRENT_DATE) AND
    EXTRACT(MONTH FROM mf.max_followup_date) > EXTRACT(MONTH FROM CURRENT_DATE) + 1)
    OR
    (EXTRACT(YEAR FROM mf.max_followup_date) > EXTRACT(YEAR FROM CURRENT_DATE))
);
 
    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_whatsapp_number` (IN `chatID` INT)  BEGIN
    IF chatID = 1 THEN
        -- for chatID 1
        SELECT 
            CASE 
                WHEN c.whatsapp_number LIKE '91%' THEN c.whatsapp_number
                ELSE CONCAT('91', c.whatsapp_number)
            END AS whatsAppNumber
        FROM customers AS c
        WHERE c.whatsapp_number IS NOT NULL AND c.whatsapp_number <> 'null';
    ELSEIF chatID = 2 THEN
        -- for chatID 2
        SELECT 
            CASE 
                WHEN c.phone_number LIKE '91%' THEN c.phone_number
                ELSE CONCAT('91', c.phone_number)
            END AS whatsAppNumber
        FROM users AS c
        WHERE c.phone_number IS NOT NULL AND c.phone_number <> 'null'  AND c.user_type_id = 2;
    ELSE
        -- for chatID 3 or any other condition
        SELECT 
            CASE 
                WHEN e.phone_number LIKE '91%' THEN e.phone_number
                ELSE CONCAT('91', e.phone_number)
            END AS whatsAppNumber
        FROM users AS e
        WHERE e.phone_number IS NOT NULL AND e.phone_number <> 'null' AND e.user_type_id = 1;
    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_works` (IN `employeeId` INT, IN `taskId` INT, IN `row_index` INT)  BEGIN
  DECLARE offset INT;
  SET offset = (row_index - 1);

  SELECT 
	c.id,
	c.first_name, 
    c.last_name, 
    c.phone_number, 
    c.whatsapp_number, 
    c.email, 
    ep.manufacturer AS make,
    md.old_tractor AS oldOwned,
    (
        SELECT GROUP_CONCAT(modalName)
        FROM enquiry_products AS f1
        INNER JOIN modal AS s1 ON s1.id = f1.modal
        WHERE f1.enquiry_id = ef.id
    ) AS product,
    CONCAT(fo.first_name, ' ', fo.last_name) AS sales_person,
    ecp.category_name,
    ef.date,
    ef.delivery_date,
    ef.enquiry_category_id,
    ef.modal_id,
    ef.primary_source_id,
    ef.enquiry_source_id,
    ef.id AS enquiry_id,
    taluka.id AS taluka_id,
    taluka.name AS taluka,
    village.id AS village_id,
    village.name AS village,
    (
        SELECT name
        FROM enquiry_sources
        WHERE id = ef.enquiry_source_id
    ) AS enquiry_source
  FROM addtask_data AS att
  INNER JOIN users AS u ON u.id = att.employee
  INNER JOIN enquiries AS ef ON ef.salesperson_id = att.employee
  INNER JOIN customers AS c ON c.id = ef.customer_id
  LEFT JOIN enquiry_products AS ep ON ep.enquiry_id = ef.id
  LEFT JOIN manufactur_details AS md ON md.enquiry_id = ef.id
  LEFT JOIN users AS fo ON fo.id = ef.salesperson_id
  LEFT JOIN enquiry_category AS ecp ON ecp.id = ef.enquiry_category_id
  LEFT JOIN taluka ON taluka.id = c.taluka 
  LEFT JOIN village ON village.id = c.village
  WHERE att.employee = employeeId AND att.task = taskId
  GROUP BY c.id
  ORDER BY ef.date DESC
  LIMIT offset, 1;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_work_assign_village_list` (IN `branchId` INT, IN `userId` INT)  BEGIN
SELECT u.id as user_id, CONCAT(u.first_name, ' ', u.last_name) AS salesperson,
       ec.category_name,
       GROUP_CONCAT(DISTINCT v.name) AS village_names
FROM users u
JOIN area_assign_user aau ON aau.user_id = u.id
JOIN enquiry_category ec ON ec.id = aau.category_id
JOIN village v ON aau.distribution_id = v.id
GROUP BY salesperson, ec.category_name;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_work_report` ()  BEGIN
SELECT 
    f.id AS EmployeeId,
    CONCAT(f.first_name, ' ', f.last_name) AS Employee,
    tt.tasktype_name,
    ts.task_name,
    wl.work_description,
    COUNT(wl.user_id) AS TaskCompleted,
    COALESCE(atd.taskcount, 0) AS TotalTask
FROM 
    worklog AS wl
INNER JOIN 
    users AS f ON f.id = wl.user_id
INNER JOIN 
    task_types AS tt ON tt.tasktype_id = wl.tasktype
INNER JOIN 
    tasks AS ts ON ts.id = wl.task
LEFT JOIN 
    addtask_data AS atd ON atd.employee = wl.user_id
    AND DATE(wl.datetime) BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND CURDATE()
WHERE 
    ts.tasktype_id = tt.tasktype_id
GROUP BY 
    f.id, CONCAT(f.first_name, ' ', f.last_name), tt.tasktype_name, ts.task_name;

END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_work_report_by_employee` (IN `userId` INT, IN `isAdmin` BOOLEAN, IN `EmployeeId` INT, IN `taskTypeId` INT, IN `taskId` INT)  BEGIN
    IF (isAdmin = TRUE) THEN
        SELECT f.id AS EmployeeId, CONCAT(f.first_name, ' ', f.last_name) AS Employee, tt.tasktype_name, ts.task_name, wl.work_description, wl.datetime, wl.spendtime
        FROM worklog AS wl
        INNER JOIN users AS f ON f.id = wl.user_id
        INNER JOIN task_types AS tt ON tt.tasktype_id = wl.tasktype
        INNER JOIN tasks AS ts ON ts.id = wl.task
        WHERE wl.user_id = EmployeeId AND wl.tasktype = taskTypeId AND wl.task = taskId;
    ELSE
        SELECT f.id AS EmployeeId, CONCAT(f.first_name, ' ', f.last_name) AS Employee, tt.tasktype_name, ts.task_name, wl.work_description, wl.datetime, wl.spendtime
        FROM worklog AS wl
        INNER JOIN users AS f ON f.id = wl.user_id
        INNER JOIN task_types AS tt ON tt.tasktype_id = wl.tasktype
        INNER JOIN tasks AS ts ON ts.id = wl.task
        WHERE wl.user_id = userId AND wl.tasktype = taskTypeId AND wl.task = taskId;
    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_work_report_detail_for_currentdate` ()  BEGIN
SELECT 
    main.Employee,
    main.Phone_Number,
    main.TaskType_Name,
    main.Task_Name,
    main.Period_Name,
    sub.Work_Description AS AllWorkDescriptions,
     main.TaskCompleted,
    main.TotalTask,
    main.DateTime
FROM (
    SELECT 
        CONCAT(f.first_name, ' ', f.last_name) AS Employee,
        f.Phone_Number,
        tt.TaskType_Name,
        ts.Task_Name,
        COUNT(wl.user_id) AS TaskCompleted,
        COALESCE(atd.taskcount, 0) AS TotalTask,
        tp.Period_Name,
        wl.datetime
    FROM 
        worklog AS wl
    INNER JOIN 
        users AS f ON f.id = wl.user_id
    INNER JOIN 
        task_types AS tt ON tt.tasktype_id = wl.tasktype
    INNER JOIN 
        tasks AS ts ON ts.id = wl.task
    LEFT JOIN 
        addtask_data AS atd ON atd.employee = wl.user_id 
                            AND wl.tasktype = atd.tasktype 
                            AND wl.task = atd.task
    LEFT JOIN 
        tasktime_period AS tp ON tp.id = atd.tasktime_period
    WHERE 
        ts.tasktype_id = tt.tasktype_id
        AND DATE(wl.datetime) = CURDATE() 
    GROUP BY 
        f.id, CONCAT(f.first_name, ' ', f.last_name), tt.TaskType_Name, ts.Task_Name, tp.Period_Name, wl.datetime
) AS main
JOIN (
    SELECT 
        CONCAT(f.first_name, ' ', f.last_name) AS Employee,
        wl.Work_Description,
        wl.DateTime
    FROM 
        worklog AS wl
    INNER JOIN 
        users AS f ON f.id = wl.user_id
    INNER JOIN 
        task_types AS tt ON tt.tasktype_id = wl.tasktype
    INNER JOIN 
        tasks AS ts ON ts.id = wl.task
    LEFT JOIN 
        addtask_data AS atd ON atd.employee = wl.user_id 
                            AND wl.tasktype = atd.tasktype 
                            AND wl.task = atd.task
    LEFT JOIN 
        tasktime_period AS tp ON tp.id = atd.tasktime_period
    WHERE 
        ts.tasktype_id = tt.tasktype_id
        AND DATE(wl.datetime) = CURDATE()
) AS sub
ON main.Employee = sub.Employee AND main.datetime = sub.datetime;

END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_work_report_for_currentdate` ()  BEGIN
SELECT 
    CONCAT(f.first_name, ' ', f.last_name) AS Employee,
     f.Phone_Number,
    tt.TaskType_Name,
    ts.Task_Name,
    COUNT(wl.user_id) AS TaskCompleted,
     COALESCE(atd.taskcount, 0) AS TotalTask,
    tp.Period_Name
FROM 
    worklog AS wl
INNER JOIN 
    users AS f ON f.id = wl.user_id
INNER JOIN 
    task_types AS tt ON tt.tasktype_id = wl.tasktype
INNER JOIN 
    tasks AS ts ON ts.id = wl.task
LEFT JOIN 
    addtask_data AS atd ON atd.employee = wl.user_id AND wl.tasktype = atd.tasktype AND wl.task = atd.task
    LEFT JOIN tasktime_period AS tp ON tp.id = atd.tasktime_period
    WHERE 
    ts.tasktype_id = tt.tasktype_id
    AND DATE(wl.datetime) = CURDATE() -- Filter for the current date
GROUP BY 
    f.id, CONCAT(f.first_name, ' ', f.last_name), tt.tasktype_name, ts.task_name, tp.period_name;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_work_report_monthly` ()  BEGIN
   SELECT 
        f.id AS EmployeeId,
        CONCAT(f.first_name, ' ', f.last_name) AS Employee,
        tt.tasktype_name,
        ts.task_name,
        wl.work_description,
        COUNT(wl.user_id) AS TaskCompleted,
        COALESCE(atd.taskcount, 0) AS TotalTask
    FROM 
        worklog AS wl
    INNER JOIN 
        users AS f ON f.id = wl.user_id
    INNER JOIN 
        task_types AS tt ON tt.tasktype_id = wl.tasktype
    INNER JOIN 
        tasks AS ts ON ts.id = wl.task
    LEFT JOIN 
        addtask_data AS atd ON atd.employee = wl.user_id
    WHERE 
        ts.tasktype_id = tt.tasktype_id
     AND DATE(wl.datetime) BETWEEN DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND CURDATE() 
    GROUP BY 
        f.id, CONCAT(f.first_name, ' ', f.last_name), tt.tasktype_name, ts.task_name;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_work_report_today` ()  BEGIN
 SELECT 
        f.id AS EmployeeId,
        CONCAT(f.first_name, ' ', f.last_name) AS Employee,
        tt.tasktype_name,
        ts.task_name,
        wl.work_description,
        COUNT(wl.user_id) AS TaskCompleted,
        COALESCE(atd.taskcount, 0) AS TotalTask
    FROM 
        worklog AS wl
    INNER JOIN 
        users AS f ON f.id = wl.user_id
    INNER JOIN 
        task_types AS tt ON tt.tasktype_id = wl.tasktype
    INNER JOIN 
        tasks AS ts ON ts.id = wl.task
    LEFT JOIN 
        addtask_data AS atd ON atd.employee = wl.user_id
    WHERE 
        ts.tasktype_id = tt.tasktype_id
          AND DATE(wl.datetime)= CURDATE() 
    GROUP BY 
        f.id, CONCAT(f.first_name, ' ', f.last_name), tt.tasktype_name, ts.task_name;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_work_report_weekly` ()  BEGIN
   SELECT 
        f.id AS EmployeeId,
        CONCAT(f.first_name, ' ', f.last_name) AS Employee,
        tt.tasktype_name,
        ts.task_name,
        wl.work_description,
        COUNT(wl.user_id) AS TaskCompleted,
        COALESCE(atd.taskcount, 0) AS TotalTask
    FROM 
        worklog AS wl
    INNER JOIN 
        users AS f ON f.id = wl.user_id
    INNER JOIN 
        task_types AS tt ON tt.tasktype_id = wl.tasktype
    INNER JOIN 
        tasks AS ts ON ts.id = wl.task
    LEFT JOIN 
        addtask_data AS atd ON atd.employee = wl.user_id
      
    WHERE 
        ts.tasktype_id = tt.tasktype_id
    AND DATE(wl.datetime) BETWEEN CURDATE() - INTERVAL 6 DAY AND CURDATE() 
    GROUP BY 
        f.id, CONCAT(f.first_name, ' ', f.last_name), tt.tasktype_name, ts.task_name;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insert_area_assign_user` (IN `input_data` JSON)  BEGIN
    DECLARE user_id INT;
    DECLARE distribution_id VARCHAR(255); -- Use VARCHAR to store the comma-separated string
    DECLARE category_id INT;

    SET user_id = JSON_EXTRACT(input_data, '$.id');
    SET distribution_id = JSON_EXTRACT(input_data, '$.village');

    -- Create a temporary table to store the extracted category IDs
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_categories (category_id INT);

    -- Insert the category IDs from the JSON array into the temporary table
    INSERT INTO temp_categories (category_id)
    SELECT JSON_UNQUOTE(JSON_EXTRACT(input_data, '$.category[*]'));

    -- Loop through the temporary table and insert the data into area_assign_user
    WHILE (SELECT COUNT(*) FROM temp_categories) > 0 DO
        SET category_id = (SELECT category_id FROM temp_categories LIMIT 1);

        INSERT INTO area_assign_user (user_id, distribution_id, category_id)
        VALUES (user_id, distribution_id, category_id);

        DELETE FROM temp_categories WHERE category_id = category_id;
    END WHILE;

    -- Drop the temporary table
    DROP TEMPORARY TABLE IF EXISTS temp_categories;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insert_assigned_area` (IN `input_array` JSON)  BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE array_length INT;
    DECLARE current_value INT;
    DECLARE current_label VARCHAR(255);
    DECLARE current_id INT;
    DECLARE current_dType INT;
    DECLARE current_category INT;

    -- Temporary table to store the array data
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_assigned_area_data (
        value INT,
        label VARCHAR(255),
        id INT,
        dTypeId INT,
        category INT
    );

    -- Insert the array data into the temporary table
    SET array_length = JSON_LENGTH(input_array);
    WHILE i < array_length DO
        SET current_value = JSON_EXTRACT(input_array, CONCAT('$[', i, '].value'));
        SET current_label = JSON_EXTRACT(input_array, CONCAT('$[', i, '].label'));
        SET current_id = JSON_EXTRACT(input_array, CONCAT('$[', i, '].id'));
        SET current_dType = JSON_EXTRACT(input_array, CONCAT('$[', i, '].distributionType'));
        SET current_category = JSON_EXTRACT(input_array, CONCAT('$[', i, '].category'));

        INSERT INTO temp_assigned_area_data (value, label, id, dTypeId, category)
        VALUES (current_value, current_label, current_id, current_dType, current_category);

        SET i = i + 1;
    END WHILE;

    -- Loop through the array data and insert into the assigned_area table
    SET i = 0;
    WHILE i < array_length DO
        SET i = i + 1;

        SELECT value INTO current_value
        FROM temp_assigned_area_data
        WHERE id = i;

        -- Insert the current row data into the assigned_area table
        INSERT INTO area_assign_user (user_id, distribution_id, distribution_type, category_id)
        VALUES (current_id, current_value, current_dType, current_category);
    END WHILE;

    -- Drop the temporary table
    DROP TEMPORARY TABLE IF EXISTS temp_assigned_area_data;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_insert_assigned_area1` (IN `input_array` JSON)  BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE array_length INT;
    DECLARE current_value INT;
    DECLARE current_label VARCHAR(255);
    DECLARE current_id INT;
    DECLARE current_dType INT;
    DECLARE current_category INT;
    DECLARE user_id INT;
    DECLARE distribution_id INT;
    DECLARE distribution_type INT;
    DECLARE category_id INT;
    DECLARE duplicateee INT;

    -- Temporary table to store the array data
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_assigned_area_data (
        id INT,
        valuea INT,
        uid INT,
        dTypeId INT,
        category INT
    );
     CREATE TEMPORARY TABLE IF NOT EXISTS temp_assigned_area_data2 (
        userid INT,
        villageid INT,
         duplicate INT
       
    );

    -- Insert the array data into the temporary table
    SET array_length = JSON_LENGTH(input_array);
    WHILE i < array_length DO
   
        SET current_value = JSON_EXTRACT(input_array, CONCAT('$[', i, '].value'));
        SET current_label = JSON_EXTRACT(input_array, CONCAT('$[', i, '].label'));
        SET current_id = JSON_EXTRACT(input_array, CONCAT('$[', i, '].id'));
        SET current_dType = JSON_EXTRACT(input_array, CONCAT('$[', i, '].distributionType'));
        SET current_category = JSON_EXTRACT(input_array, CONCAT('$[', i, '].category'));

     
        INSERT INTO temp_assigned_area_data (id,valuea, uid, dTypeId, category)
        VALUES (i,current_value, current_id, current_dType, current_category);  

         SET i = i + 1;
    END WHILE;
    

  SET i = 0;
WHILE i < array_length DO
    -- Get the current_value and current_id
    SELECT valuea, uid INTO current_value, current_id
    FROM temp_assigned_area_data
    WHERE id = i;
    
    -- Check for duplication
    SELECT COUNT(*) INTO duplicateee
    FROM area_assign_user
    WHERE user_id = current_id
        AND distribution_id = current_value;
    
    
    
    IF duplicateee = 0 THEN
        -- Insert the current row data into the assigned_area table
        INSERT INTO area_assign_user (user_id, distribution_id, distribution_type, category_id)
        VALUES (current_id, current_value, current_dType, current_category);
    END IF;
     SELECT COUNT(*) INTO duplicateee
        FROM area_assign_user
        WHERE user_id = current_id
            AND distribution_id = current_value;

        INSERT INTO temp_assigned_area_data2 (userid, villageid, duplicate)
        VALUES (current_id, current_value, duplicateee);
    
    SET i = i + 1;
END WHILE;


select * from temp_assigned_area_data2;
    -- Drop the temporary table
    DROP TEMPORARY TABLE IF EXISTS temp_assigned_area_data;
     DROP TEMPORARY TABLE IF EXISTS temp_assigned_area_data2;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_profile_data` (IN `branchId` INT(11), IN `userId` INT(11), IN `isAdmin` BOOLEAN)  BEGIN 
IF (isAdmin = FALSE) THEN
	SELECT distinct email, first_name, last_name, phone_number, last_login, document_path ,CONCAT('[', GROUP_CONCAT(
    distinct CONCAT(
      '{ "page": ', t.page, ', "index_no": "', t.index_no, '", "feature": "', t.feature, '", "label": "', label, '"}'
    ) 
  ), ']') AS features
  FROM branch_department_user as f inner join role_features as s on s.role_id = f.role_id inner join features as t on s.feature_id = t.id  inner join users as fo on fo.id = f.user_id inner join documents as d on d.document_id  where f.user_id  = userId  and f.branch_id = branchId;
ELSE
    SELECT distinct email, first_name, last_name, phone_number, last_login ,(select distinct CONCAT('[', GROUP_CONCAT(
    distinct CONCAT(
      '{ "page": ', page, ', "index_no": "', index_no, '", "feature": "', feature, '", "label": "', label, '"}'
    )
  ), ']') from features) AS features
  FROM users where id  = userId;
  end IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_retrieve_sales_person` (IN `villageId` INT, IN `CategoryId` INT)  BEGIN
SELECT u.id, CONCAT(first_name, ' ', last_name) AS salesperson
FROM users u
JOIN area_assign_user aau ON aau.user_id = u.id
WHERE aau.distribution_id = villageId AND aau.category_id = CategoryId;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_user_details_branches_roles` (IN `userId` INT(11))  BEGIN

SELECT 
  concat('{',
    GROUP_CONCAT(
      distinct CONCAT(
       '"', d.branch_id ,'" :' , (
        select CONCAT(
    '[',
    GROUP_CONCAT(
    distinct CONCAT(
    role_id
      ) SEPARATOR ','
    ),
    ']'
  ) AS role from branch_department_user where branch_id = d.branch_id and user_id = d.user_id
        )
      )
       ORDER BY d.branch_id ASC
      SEPARATOR ','
    ),'}'
  ) AS branchesRole
FROM 
  users u
  INNER JOIN branch_department_user d ON d.user_id = u.id
WHERE 
  u.id = userId
GROUP BY 
  u.id;

END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `addtask_data`
--

CREATE TABLE `addtask_data` (
  `id` int(11) NOT NULL,
  `employee` varchar(255) DEFAULT NULL,
  `tasktype` varchar(255) DEFAULT NULL,
  `task` varchar(45) DEFAULT NULL,
  `taskcount` int(11) DEFAULT NULL,
  `startdate` date DEFAULT NULL,
  `enddate` date DEFAULT NULL,
  `tasktime_period` varchar(100) DEFAULT NULL,
  `task_status` varchar(100) DEFAULT NULL,
  `category_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `area_assign_user`
--

CREATE TABLE `area_assign_user` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `distribution_id` varchar(45) DEFAULT NULL,
  `distribution_type` tinyint(4) DEFAULT 1,
  `category_id` varchar(225) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `area_region`
--

CREATE TABLE `area_region` (
  `region_id` int(11) DEFAULT NULL,
  `region_name` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `bank_details`
--

CREATE TABLE `bank_details` (
  `id` int(11) NOT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `bank_branch` varchar(55) DEFAULT NULL,
  `account_number` bigint(16) DEFAULT NULL,
  `account_type` varchar(55) DEFAULT NULL,
  `ifsc_code` varchar(55) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `enquiry_id` int(11) DEFAULT NULL,
  `phone_number` varchar(45) DEFAULT NULL,
  `modal` varchar(255) DEFAULT NULL,
  `variant` varchar(255) DEFAULT NULL,
  `chassis_no` varchar(45) DEFAULT NULL,
  `mode_of_finance` varchar(55) DEFAULT NULL,
  `bank_name` varchar(55) DEFAULT NULL,
  `booking_date` date DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `retail_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `mobile_number` varchar(15) DEFAULT NULL,
  `email_id` varchar(45) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `code` varchar(10) DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `gst_number` varchar(100) NOT NULL,
  `description` varchar(200) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `contact_person` varchar(100) DEFAULT NULL,
  `state` int(11) NOT NULL,
  `district` int(11) NOT NULL,
  `taluka` int(11) NOT NULL,
  `village` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `branches_new`
--

CREATE TABLE `branches_new` (
  `id` int(255) NOT NULL,
  `product` varchar(255) NOT NULL,
  `rto_detail` varchar(255) NOT NULL,
  `payment` int(255) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `Customer_id` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `branch_department_user`
--

CREATE TABLE `branch_department_user` (
  `id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `category_field`
--

CREATE TABLE `category_field` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `field_id` varchar(45) NOT NULL,
  `type` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `configuration`
--

CREATE TABLE `configuration` (
  `id` int(11) NOT NULL,
  `setting` varchar(100) DEFAULT NULL,
  `key_name` varchar(100) DEFAULT NULL,
  `value` varchar(499) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `middle_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phone_number` varchar(100) DEFAULT NULL,
  `whatsapp_number` varchar(45) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT 1,
  `state` varchar(45) DEFAULT NULL,
  `district` varchar(45) DEFAULT NULL,
  `taluka` varchar(45) DEFAULT NULL,
  `block` varchar(45) DEFAULT NULL,
  `village` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `description`, `is_active`) VALUES
(1, 'None', 'Department is not selected', 1),
(2, 'Sales', 'Sales department is responsible for the selling the products or services', 1),
(3, 'Service', 'Service department is responsible to provide service to the customers', 1),
(4, 'Market', 'Manages marketing and promotional activities related to vehicle services and sales.', 1),
(5, 'Public Relations', 'Manages public relations and communication strategies for the organization.', 1);

-- --------------------------------------------------------

--
-- Table structure for table `distributionType`
--

CREATE TABLE `distributionType` (
  `id` int(255) NOT NULL,
  `distribution_type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `distributionType`
--

INSERT INTO `distributionType` (`id`, `distribution_type`) VALUES
(1, 'area wise');

-- --------------------------------------------------------

--
-- Table structure for table `district`
--

CREATE TABLE `district` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `state_id` int(11) NOT NULL,
  `is_active` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `district`
--

INSERT INTO `district` (`id`, `name`, `state_id`, `is_active`) VALUES
(1, 'None', 1, b'1'),
(2, 'Surendranagar', 2, b'1');

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `document_id` int(11) NOT NULL,
  `document_path` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `link` varchar(455) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `document_details`
--

CREATE TABLE `document_details` (
  `id` int(11) NOT NULL,
  `document_id` int(11) DEFAULT NULL,
  `mapping_id` int(11) DEFAULT NULL,
  `mapping_table` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `employee_detail`
--

CREATE TABLE `employee_detail` (
  `id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role_id` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `enquiries`
--

CREATE TABLE `enquiries` (
  `id` int(11) NOT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `enquiry_category_id` int(11) DEFAULT NULL,
  `salesperson_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `modal_id` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `delivery_date` datetime DEFAULT NULL,
  `primary_source_id` varchar(11) DEFAULT NULL,
  `enquiry_source_id` varchar(11) DEFAULT NULL,
  `visitReason` varchar(100) DEFAULT NULL,
  `enquiry_stage` varchar(45) DEFAULT NULL,
  `enquiry_remarks` varchar(255) DEFAULT NULL,
  `user_created` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `enquiry_category`
--

CREATE TABLE `enquiry_category` (
  `id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `category_description` varchar(100) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `department` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `enquiry_category`
--

INSERT INTO `enquiry_category` (`id`, `category_name`, `category_description`, `is_active`, `department`) VALUES
(1, 'None', 'None', 1, '1');

-- --------------------------------------------------------

--
-- Table structure for table `enquiry_category_field`
--

CREATE TABLE `enquiry_category_field` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `field_id` int(11) NOT NULL,
  `type` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `enquiry_data`
--

CREATE TABLE `enquiry_data` (
  `id` int(11) NOT NULL,
  `firstName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `district` varchar(45) DEFAULT NULL,
  `taluko` varchar(45) DEFAULT NULL,
  `village` varchar(45) DEFAULT NULL,
  `mobileNumber` varchar(45) DEFAULT NULL,
  `whatsappNumber` varchar(45) DEFAULT NULL,
  `visitReason` varchar(45) DEFAULT NULL,
  `sourceOfInquiry` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `companyName` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `enquiry_fields`
--

CREATE TABLE `enquiry_fields` (
  `id` int(11) NOT NULL,
  `field` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `enquiry_fields`
--

INSERT INTO `enquiry_fields` (`id`, `field`, `name`) VALUES
(1, 'branchId', 'Branch'),
(2, 'firstName', 'First Name'),
(3, 'lastName', 'Last Name '),
(4, 'fatherName', 'Father Name'),
(5, 'email', 'Email'),
(6, 'mobileNumber', 'Mobile Number'),
(7, 'whatsappNumber', 'Whatsapp Number'),
(8, 'state', 'State'),
(9, 'district', 'District'),
(10, 'taluko', 'Taluko'),
(11, 'village', 'Village'),
(12, 'dsp', 'DSP'),
(13, 'make', 'Make'),
(14, 'modal', 'Modal'),
(15, 'primarySource', 'Primary Source '),
(16, 'sourceOfEnquiry', 'Source Of Inquiry'),
(17, 'enquiryDate', 'Enquiry Date'),
(18, 'deliveryDate', 'Delivery Date'),
(19, 'modeOfFinance', 'Mode Of Finance'),
(20, 'bank', 'Bank'),
(21, 'city', 'City'),
(22, 'visitReason', 'Visit Reason'),
(23, 'companyName', 'Compaony Name'),
(24, 'location', 'Location'),
(25, 'oldTractor', 'Old Tractor Owend');

-- --------------------------------------------------------

--
-- Table structure for table `enquiry_lost_reasons`
--

CREATE TABLE `enquiry_lost_reasons` (
  `id` int(11) NOT NULL,
  `commercial_reasons` varchar(155) DEFAULT NULL,
  `non_commercial_reasons` varchar(155) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `enquiry_lost_reasons`
--

INSERT INTO `enquiry_lost_reasons` (`id`, `commercial_reasons`, `non_commercial_reasons`) VALUES
(1, 'Price', 'Personal Preferences'),
(2, 'Competitor Offer', 'Changed Circumstances'),
(3, 'Features', 'Recommendation'),
(4, 'Availability', 'Ethical Considerations'),
(5, 'Service and Support', 'Localization'),
(6, 'Customer Service Experience', 'User Experience'),
(7, 'Financing Options', 'Customization');

-- --------------------------------------------------------

--
-- Table structure for table `enquiry_primary_sources`
--

CREATE TABLE `enquiry_primary_sources` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `enquiry_primary_sources`
--

INSERT INTO `enquiry_primary_sources` (`id`, `name`, `description`) VALUES
(1, 'Digital', NULL),
(2, 'Telemarketing', NULL),
(3, 'News', NULL),
(4, 'Visit', NULL),
(5, 'Other', NULL),
(6, 'Test', 'Test ');

-- --------------------------------------------------------

--
-- Table structure for table `enquiry_products`
--

CREATE TABLE `enquiry_products` (
  `id` int(11) NOT NULL,
  `enquiry_id` int(11) DEFAULT NULL,
  `manufacturer` varchar(255) DEFAULT NULL,
  `modal` varchar(255) DEFAULT NULL,
  `variant` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `enquiry_sources`
--

CREATE TABLE `enquiry_sources` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `primary_source_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `enquiry_stages`
--

CREATE TABLE `enquiry_stages` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `enquiry_id` int(11) DEFAULT NULL,
  `followUp` tinyint(4) DEFAULT NULL,
  `delivery` tinyint(4) DEFAULT NULL,
  `drop` tinyint(4) DEFAULT NULL,
  `invalid` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `enquiry_types`
--

CREATE TABLE `enquiry_types` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `enquiry_types`
--

INSERT INTO `enquiry_types` (`id`, `name`) VALUES
(1, 'New Tractor'),
(2, 'Old Tractor');

-- --------------------------------------------------------

--
-- Table structure for table `features`
--

CREATE TABLE `features` (
  `id` int(11) NOT NULL,
  `page` int(11) NOT NULL,
  `index_no` varchar(150) NOT NULL,
  `feature` varchar(150) NOT NULL,
  `label` varchar(150) NOT NULL,
  `parent_Id` int(255) NOT NULL DEFAULT 0,
  `is_active` bit(11) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `features`
--

INSERT INTO `features` (`id`, `page`, `index_no`, `feature`, `label`, `parent_Id`, `is_active`) VALUES
(1, 1, '1.1', 'profile', 'profile', 0, b'00000000001'),
(2, 1, '1.2', 'agency', 'Agency', 0, b'00000000001'),
(3, 1, '1.3', 'dashboard', 'Dashboard', 0, b'00000000001'),
(4, 1, '1.4', 'user-profile', 'profile', 0, b'00000000001'),
(5, 2, '2.1', 'sales', 'Sales', 0, b'00000000001'),
(6, 3, '3.1', 'service', 'Services', 0, b'00000000001'),
(7, 4, '4.1', 'manage', 'Manage', 0, b'00000000001'),
(8, 5, '5.1', 'roles', 'Roles', 0, b'00000000001'),
(9, 5, '5.2', 'add-role', 'Add role', 7, b'00000000001'),
(10, 5, '5.3', 'users', 'Users', 0, b'00000000001'),
(11, 5, '5.4', 'add-user', 'Add user', 1, b'00000000001'),
(12, 5, '5.5', 'edit-user', 'Edit user', 1, b'00000000001'),
(13, 4, '4.2', 'products', 'Products', 3, b'00000000001'),
(14, 5, '5.6', 'configuration', 'Configuration', 3, b'00000000001'),
(15, 5, '5.7', 'agency', 'Agency', 0, b'00000000001'),
(16, 5, '5.8', 'branch', 'Branch', 0, b'00000000001'),
(17, 5, '5.9', 'assign-task', 'Assign Task', 0, b'00000000001'),
(18, 5, '5.10', 'employee', 'Employee', 0, b'00000000001'),
(19, 5, '5.11', 'report', 'Report', 3, b'00000000001');

-- --------------------------------------------------------

--
-- Table structure for table `follow_up_details`
--

CREATE TABLE `follow_up_details` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `enquiry_id` int(11) DEFAULT NULL,
  `last_discussion` varchar(255) DEFAULT NULL,
  `followup_date` date DEFAULT NULL,
  `next_followup_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `holiday_data`
--

CREATE TABLE `holiday_data` (
  `id` int(11) NOT NULL,
  `holidayname` varchar(45) DEFAULT NULL,
  `holiday_date` date DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `leave_details`
--

CREATE TABLE `leave_details` (
  `id` int(11) NOT NULL,
  `LeaveType` int(11) DEFAULT NULL,
  `StartDate` date DEFAULT NULL,
  `EndDate` date DEFAULT NULL,
  `Reason` varchar(255) DEFAULT NULL,
  `Email` varchar(45) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `userName` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `leave_type`
--

CREATE TABLE `leave_type` (
  `id` int(11) NOT NULL,
  `leave_type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `leave_type`
--

INSERT INTO `leave_type` (`id`, `leave_type`) VALUES
(1, 'Casual Leave'),
(2, 'Leave Without Pay'),
(3, 'Health Issue');

-- --------------------------------------------------------

--
-- Table structure for table `lost_enquiries`
--

CREATE TABLE `lost_enquiries` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `enquiry_id` int(11) DEFAULT NULL,
  `maker` int(11) DEFAULT NULL,
  `modal` int(11) DEFAULT NULL,
  `variant` int(11) DEFAULT NULL,
  `commercial_reason_1` varchar(45) DEFAULT NULL,
  `non_commercial_reason_2` varchar(45) DEFAULT NULL,
  `lost_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `manufacturers`
--

CREATE TABLE `manufacturers` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `isActive` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `manufacturers`
--

INSERT INTO `manufacturers` (`id`, `name`, `description`, `isActive`) VALUES
(1, 'None', 'None', 1),
(2, 'SONALIKA', 'Sonalika', 1);

-- --------------------------------------------------------

--
-- Table structure for table `manufactur_details`
--

CREATE TABLE `manufactur_details` (
  `id` int(11) NOT NULL,
  `enquiry_id` int(11) DEFAULT NULL,
  `maker` varchar(45) DEFAULT NULL,
  `modalName` varchar(45) DEFAULT NULL,
  `variantName` varchar(45) DEFAULT NULL,
  `year_of_manufactur` int(11) DEFAULT NULL,
  `condition_of` varchar(45) DEFAULT NULL,
  `old_tractor` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `category` int(11) DEFAULT NULL,
  `action` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `message` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `message_action`
--

CREATE TABLE `message_action` (
  `id` int(11) NOT NULL,
  `msg_action` varchar(55) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `message_action`
--

INSERT INTO `message_action` (`id`, `msg_action`) VALUES
(1, 'Add Enquiry'),
(2, 'Edit Enquiry'),
(3, 'Delete Enquiry');

-- --------------------------------------------------------

--
-- Table structure for table `modal`
--

CREATE TABLE `modal` (
  `id` int(11) NOT NULL,
  `modalName` varchar(100) DEFAULT NULL,
  `manufacturerId` int(11) DEFAULT NULL,
  `isActive` bit(11) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `modal`
--

INSERT INTO `modal` (`id`, `modalName`, `manufacturerId`, `isActive`) VALUES
(1, 'None', 1, b'00000000001'),
(2, 'DI-430I', 2, b'00000000001');

-- --------------------------------------------------------

--
-- Table structure for table `old_tractor_details`
--

CREATE TABLE `old_tractor_details` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `enquiry_id` int(11) DEFAULT NULL,
  `maker` int(11) DEFAULT NULL,
  `modal` int(11) DEFAULT NULL,
  `variant` int(11) DEFAULT NULL,
  `manufactur_year` int(11) DEFAULT NULL,
  `tractor_condition` varchar(45) DEFAULT NULL,
  `dealer_purcahse_price` decimal(9,2) DEFAULT NULL,
  `market_price` decimal(9,2) DEFAULT NULL,
  `old_tractor_chassis_no` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `parts`
--

CREATE TABLE `parts` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `part_no` varchar(100) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `hsn_no` varchar(100) DEFAULT NULL,
  `is_active` varchar(45) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `manufacturer_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `role` varchar(100) NOT NULL,
  `active` varchar(45) NOT NULL DEFAULT '1',
  `description` varchar(300) DEFAULT NULL,
  `delete` varchar(45) NOT NULL DEFAULT '0',
  `role_emp` int(255) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role`, `active`, `description`, `delete`, `role_emp`) VALUES
(1, 'super_admin', '1', 'Super Admin', '0', 0),
(2, 'Admin', '1', 'Admin has all access of the current branch', '0', 1),
(3, 'Manager', '1', 'Manager can manager his personal profile and his reporter profile', '0', 1),
(4, 'Employee', '1', 'Employee role can only view to his thing', '0', 1),
(5, 'Customers', '1', 'purchases goods or services', '1', 1),
(6, 'Employeer', '1', 'employerr', '1', 0);

-- --------------------------------------------------------

--
-- Table structure for table `role_features`
--

CREATE TABLE `role_features` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `feature_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `role_features`
--

INSERT INTO `role_features` (`id`, `role_id`, `feature_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 1, 4),
(5, 1, 5),
(6, 1, 6),
(7, 1, 7),
(8, 1, 8),
(9, 1, 9),
(10, 1, 10),
(11, 1, 11),
(12, 1, 12),
(13, 1, 13),
(14, 1, 14),
(15, 1, 15),
(16, 1, 16),
(17, 1, 17),
(18, 1, 18),
(19, 1, 19);

-- --------------------------------------------------------

--
-- Table structure for table `rto_detail`
--

CREATE TABLE `rto_detail` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `rto_tax` varchar(45) DEFAULT NULL,
  `rto_passing` varchar(45) DEFAULT NULL,
  `insurance` varchar(45) DEFAULT NULL,
  `agent_fee` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `state`
--

CREATE TABLE `state` (
  `state_id` int(11) NOT NULL,
  `state_name` varchar(150) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `is_active` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `state`
--

INSERT INTO `state` (`state_id`, `state_name`, `description`, `is_active`) VALUES
(1, 'None', 'None', b'1'),
(2, 'Gujarat', 'None', b'1');

-- --------------------------------------------------------

--
-- Table structure for table `taluka`
--

CREATE TABLE `taluka` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `district_id` int(11) NOT NULL,
  `state_id` int(11) NOT NULL,
  `is_active` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `taluka`
--

INSERT INTO `taluka` (`id`, `name`, `district_id`, `state_id`, `is_active`) VALUES
(1, 'None', 1, 1, b'1'),
(2, 'Dhrangadhra', 2, 2, b'1');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `task_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `tasktype_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `task_name`, `description`, `tasktype_id`) VALUES
(1, 'Call', 'Call the customer.', 1),
(2, 'SMS', 'Message the customer.', 1),
(3, 'Whatsapp', 'Send details in whatsup.', 1),
(4, 'Field Visit', 'Visit the customer', 1),
(5, 'Cleaning service', 'Call the customer.', 2),
(6, 'AMC Service', 'Message the customer.', 2),
(7, 'Reparing', 'Send details in whatsup.', 2),
(8, 'Loan', 'Send details in whatsup.', 3),
(9, 'Insurence', 'Send details in whatsup.', 3),
(10, 'RTO', 'Send details in whatsup.', 3),
(11, 'Add Enquiry', 'add enquiry', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tasktime_period`
--

CREATE TABLE `tasktime_period` (
  `id` int(11) NOT NULL,
  `period_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tasktime_period`
--

INSERT INTO `tasktime_period` (`id`, `period_name`) VALUES
(1, 'Daily'),
(2, 'Weekly'),
(3, 'Time Period');

-- --------------------------------------------------------

--
-- Table structure for table `task_status`
--

CREATE TABLE `task_status` (
  `id` int(11) NOT NULL,
  `task_status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `task_status`
--

INSERT INTO `task_status` (`id`, `task_status`) VALUES
(1, 'New'),
(2, 'In Progress'),
(3, 'On Hold'),
(4, 'Discard'),
(5, 'Done');

-- --------------------------------------------------------

--
-- Table structure for table `task_types`
--

CREATE TABLE `task_types` (
  `tasktype_id` int(11) NOT NULL,
  `tasktype_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `task_types`
--

INSERT INTO `task_types` (`tasktype_id`, `tasktype_name`) VALUES
(1, 'Sales'),
(2, 'Services'),
(3, 'Government');

-- --------------------------------------------------------

--
-- Table structure for table `taxes`
--

CREATE TABLE `taxes` (
  `id` int(11) NOT NULL,
  `tax` varchar(200) NOT NULL,
  `percentage` varchar(200) NOT NULL,
  `slabrate` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `taxes`
--

INSERT INTO `taxes` (`id`, `tax`, `percentage`, `slabrate`) VALUES
(1, 'IGST', '17', 'IGST@17%'),
(2, 'IGST', '12', 'IGST@12%'),
(3, 'GST', '9', 'GST@9%'),
(4, 'IGST', '3', 'IGST@3%'),
(5, 'GST', '5', 'GST@5%'),
(6, 'GST', '18', 'GST@18%');

-- --------------------------------------------------------

--
-- Table structure for table `tax_details`
--

CREATE TABLE `tax_details` (
  `id` int(11) NOT NULL,
  `label` varchar(45) DEFAULT NULL,
  `gst_rate` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tax_details`
--

INSERT INTO `tax_details` (`id`, `label`, `gst_rate`) VALUES
(1, 'With GST', '18.00'),
(2, 'Without GST', '0.00');

-- --------------------------------------------------------

--
-- Table structure for table `types`
--

CREATE TABLE `types` (
  `id` int(11) NOT NULL,
  `type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `types`
--

INSERT INTO `types` (`id`, `type`) VALUES
(1, 'Customers'),
(2, 'SSP');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `phone_number` varchar(100) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `current_login` datetime DEFAULT NULL,
  `bloodgroup` varchar(45) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `user_type_id` int(11) DEFAULT NULL,
  `is_delete` int(255) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user_types`
--

CREATE TABLE `user_types` (
  `id` int(11) NOT NULL,
  `type` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_types`
--

INSERT INTO `user_types` (`id`, `type`) VALUES
(1, 'user'),
(2, 'employee');

-- --------------------------------------------------------

--
-- Table structure for table `variant`
--

CREATE TABLE `variant` (
  `id` int(11) NOT NULL,
  `variantName` varchar(100) DEFAULT NULL,
  `modalid` int(11) DEFAULT NULL,
  `manufacturerId` int(11) DEFAULT NULL,
  `isActive` bit(11) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `village`
--

CREATE TABLE `village` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `taluka_id` int(11) NOT NULL,
  `district_id` int(11) NOT NULL,
  `state_id` int(11) NOT NULL,
  `is_active` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `village`
--

INSERT INTO `village` (`id`, `name`, `taluka_id`, `district_id`, `state_id`, `is_active`) VALUES
(1, 'None', 1, 1, 1, b'1'),
(2, 'BAISABGADH', 2, 2, 2, b'1'),
(3, 'BAVLI', 2, 2, 2, b'1'),
(4, 'BHARAD', 2, 2, 2, b'1'),
(5, 'BHARADA', 2, 2, 2, b'1'),
(6, 'BHECHDA', 2, 2, 2, b'1'),
(7, 'CHANDRASAR', 2, 2, 2, b'1'),
(8, 'CHULI', 2, 2, 2, b'1'),
(9, 'DEVCHARADI', 2, 2, 2, b'1'),
(10, 'DHOLI', 2, 2, 2, b'1'),
(11, 'DHRANGADHRA', 2, 2, 2, b'1'),
(12, 'DHRUMATH', 2, 2, 2, b'1'),
(13, 'DUDAPUR', 2, 2, 2, b'1'),
(14, 'DUMANA', 2, 2, 2, b'1'),
(15, 'GAJANVAV', 2, 2, 2, b'1'),
(16, 'GALA', 2, 2, 2, b'1'),
(17, 'GANJELA', 2, 2, 2, b'1'),
(18, 'GHANSYAMGADH', 2, 2, 2, b'1'),
(19, 'GOPALGADH', 2, 2, 2, b'1'),
(20, 'GUJRVADI', 2, 2, 2, b'1'),
(21, 'HAMPAR', 2, 2, 2, b'1'),
(22, 'HARIPAR', 2, 2, 2, b'1'),
(23, 'HIRAPUR', 2, 2, 2, b'1'),
(24, 'ISDRA', 2, 2, 2, b'1'),
(25, 'JASAPAR', 2, 2, 2, b'1'),
(26, 'JASMATPUR', 2, 2, 2, b'1'),
(27, 'JEGADVA', 2, 2, 2, b'1'),
(28, 'JESDA', 2, 2, 2, b'1'),
(29, 'JIVA', 2, 2, 2, b'1'),
(30, 'KALYANPUR', 2, 2, 2, b'1'),
(31, 'KANKAVATI', 2, 2, 2, b'1'),
(32, 'KHAMBHADA', 2, 2, 2, b'1'),
(33, 'KONDH/   ???', 2, 2, 2, b'1'),
(34, 'KOPENI', 2, 2, 2, b'1'),
(35, 'KRASNANAGAR', 2, 2, 2, b'1'),
(36, 'KUDA', 2, 2, 2, b'1'),
(37, 'MANPUR', 2, 2, 2, b'1'),
(38, 'METHAN', 2, 2, 2, b'1'),
(39, 'MOTA ANKEVALIYA', 2, 2, 2, b'1'),
(40, 'MOTI MALVAN', 2, 2, 2, b'1'),
(41, 'NARALI', 2, 2, 2, b'1'),
(42, 'NARICHANA', 2, 2, 2, b'1'),
(43, 'NAVALGADH / ?????', 2, 2, 2, b'1'),
(44, 'NIMAKNAGAR', 2, 2, 2, b'1'),
(45, 'PIPLA', 2, 2, 2, b'1'),
(46, 'PRATHUGADH', 2, 2, 2, b'1'),
(47, 'RAJCHARADI', 2, 2, 2, b'1'),
(48, 'RAJGADH', 2, 2, 2, b'1'),
(49, 'RAJPAR', 2, 2, 2, b'1'),
(50, 'RAJSITAPUR', 2, 2, 2, b'1'),
(51, 'RAMDEVPUR', 2, 2, 2, b'1'),
(52, 'RAMGADH', 2, 2, 2, b'1'),
(53, 'RAMPARA', 2, 2, 2, b'1'),
(54, 'RATNPAR', 2, 2, 2, b'1'),
(55, 'RAVLIYAVADAR', 2, 2, 2, b'1'),
(56, 'RAYGADH', 2, 2, 2, b'1'),
(57, 'SAJANPUR', 2, 2, 2, b'1'),
(58, 'SARVAL', 2, 2, 2, b'1'),
(59, 'SATAPAR', 2, 2, 2, b'1'),
(60, 'SOKHDA', 2, 2, 2, b'1'),
(61, 'SOLDI', 2, 2, 2, b'1'),
(62, 'SULTANPUR', 2, 2, 2, b'1'),
(63, 'THALA', 2, 2, 2, b'1'),
(64, 'VAGHGADH', 2, 2, 2, b'1'),
(65, 'VASADAVA', 2, 2, 2, b'1'),
(66, 'VAVDI', 2, 2, 2, b'1'),
(67, 'VIRENDRAGADH', 2, 2, 2, b'1'),
(68, 'VRAJPAR', 2, 2, 2, b'1'),
(69, 'ADALSAR', 3, 2, 2, b'1'),
(70, 'ANIYARI', 3, 2, 2, b'1'),
(71, 'BABAJIPARA', 3, 2, 2, b'1'),
(72, 'BAJRANGPURA', 3, 2, 2, b'1'),
(73, 'BHADVANA', 3, 2, 2, b'1'),
(74, 'BHALADA', 3, 2, 2, b'1'),
(75, 'BHASHAKRPURA', 3, 2, 2, b'1'),
(76, 'BHATHARIYA', 3, 2, 2, b'1'),
(77, 'CHARAD', 3, 2, 2, b'1'),
(78, 'DERVADA', 3, 2, 2, b'1'),
(79, 'DEVDIYA', 3, 2, 2, b'1'),
(80, 'DHANKI', 3, 2, 2, b'1'),
(81, 'GANGAD', 3, 2, 2, b'1'),
(82, 'GANGAD', 3, 2, 2, b'1'),
(83, 'GHANAD', 3, 2, 2, b'1'),
(84, 'INGRODI', 3, 2, 2, b'1'),
(85, 'JYOTIPURA', 3, 2, 2, b'1'),
(86, 'KADAM', 3, 2, 2, b'1'),
(87, 'KADU', 3, 2, 2, b'1'),
(88, 'KALIYANPURA', 3, 2, 2, b'1'),
(89, 'KARELA', 3, 2, 2, b'1'),
(90, 'KESHARIYA', 3, 2, 2, b'1'),
(91, 'LAKHATAR', 3, 2, 2, b'1'),
(92, 'LARKHADIYA', 3, 2, 2, b'1'),
(93, 'LILAPUR', 3, 2, 2, b'1'),
(94, 'MALIKA', 3, 2, 2, b'1'),
(95, 'MODHAVANA', 3, 2, 2, b'1'),
(96, 'NANA AKEVADIYA', 3, 2, 2, b'1'),
(97, 'ODAK', 3, 2, 2, b'1'),
(98, 'PETHDA', 3, 2, 2, b'1'),
(99, 'SADAD', 3, 2, 2, b'1'),
(100, 'SAKAR', 3, 2, 2, b'1'),
(101, 'SAVALANA', 3, 2, 2, b'1'),
(102, 'TALSHANA', 3, 2, 2, b'1'),
(103, 'TALVANI', 3, 2, 2, b'1'),
(104, 'TANMANIYA', 3, 2, 2, b'1'),
(105, 'TAVI', 3, 2, 2, b'1'),
(106, 'VADEKHAN', 3, 2, 2, b'1'),
(107, 'VADLA', 3, 2, 2, b'1'),
(108, 'VALSHANI', 3, 2, 2, b'1'),
(109, 'VANA', 3, 2, 2, b'1'),
(110, 'VITHALAPARA', 3, 2, 2, b'1'),
(111, 'VITHALGADHA', 3, 2, 2, b'1'),
(112, 'ZAMAR', 3, 2, 2, b'1'),
(113, 'ADARIYANA', 4, 2, 2, b'1'),
(114, 'AKHIYANA', 4, 2, 2, b'1'),
(115, 'ALMAPUR', 4, 2, 2, b'1'),
(116, 'AMBADA', 4, 2, 2, b'1'),
(117, 'AMNAGAR', 4, 2, 2, b'1'),
(118, 'AREVADA', 4, 2, 2, b'1'),
(119, 'ASAVADA', 4, 2, 2, b'1'),
(120, 'BAJANA', 4, 2, 2, b'1'),
(121, 'BAMNVA', 4, 2, 2, b'1'),
(122, 'BHADENA', 4, 2, 2, b'1'),
(123, 'BHALGAM', 4, 2, 2, b'1'),
(124, 'BUBANA', 4, 2, 2, b'1'),
(125, 'CHABALI', 4, 2, 2, b'1'),
(126, 'CHATROT', 4, 2, 2, b'1'),
(127, 'CHIKASAR', 4, 2, 2, b'1'),
(128, 'DASHADA', 4, 2, 2, b'1'),
(129, 'DEGAM', 4, 2, 2, b'1'),
(130, 'DHAMA', 4, 2, 2, b'1'),
(131, 'FETAPUR', 4, 2, 2, b'1'),
(132, 'GASHAPUR', 4, 2, 2, b'1'),
(133, 'GAVANA', 4, 2, 2, b'1'),
(134, 'GEDIAY', 4, 2, 2, b'1'),
(135, 'GORIYAVAD', 4, 2, 2, b'1'),
(136, 'GOSHANA', 4, 2, 2, b'1'),
(137, 'HARIPURA', 4, 2, 2, b'1'),
(138, 'HATHIPURA', 4, 2, 2, b'1'),
(139, 'HEBATPUR', 4, 2, 2, b'1'),
(140, 'HIMATPURA', 4, 2, 2, b'1'),
(141, 'JADISAN', 4, 2, 2, b'1'),
(142, 'JAINABAD', 4, 2, 2, b'1'),
(143, 'JARVALA', 4, 2, 2, b'1'),
(144, 'JIVANGADHA', 4, 2, 2, b'1'),
(145, 'JORAVPURA', 4, 2, 2, b'1'),
(146, 'KACHOLIYA', 4, 2, 2, b'1'),
(147, 'KAMLPAR', 4, 2, 2, b'1'),
(148, 'KAMLPUR', 4, 2, 2, b'1'),
(149, 'KATHADA', 4, 2, 2, b'1'),
(150, 'KHARAGODHA', 4, 2, 2, b'1'),
(151, 'KHERVA', 4, 2, 2, b'1'),
(152, 'KOCHADA', 4, 2, 2, b'1'),
(153, 'LIMBAD', 4, 2, 2, b'1'),
(154, 'MALNPUR', 4, 2, 2, b'1'),
(155, 'MALVAN', 4, 2, 2, b'1'),
(156, 'MANAVADA', 4, 2, 2, b'1'),
(157, 'MERA', 4, 2, 2, b'1'),
(158, 'METASAR', 4, 2, 2, b'1'),
(159, 'MITHAGODHA', 4, 2, 2, b'1'),
(160, 'MOTA UBHADA', 4, 2, 2, b'1'),
(161, 'MOTI METHEJI', 4, 2, 2, b'1'),
(162, 'MULADA', 4, 2, 2, b'1'),
(163, 'NAGDKA', 4, 2, 2, b'1'),
(164, 'NAGVADA', 4, 2, 2, b'1'),
(165, 'NANA GORIYA', 4, 2, 2, b'1'),
(166, 'NANI METHAJI', 4, 2, 2, b'1'),
(167, 'NARANPURA', 4, 2, 2, b'1'),
(168, 'NAVAGAM', 4, 2, 2, b'1'),
(169, 'NAVIYANAI', 4, 2, 2, b'1'),
(170, 'NAVRANGPURA', 4, 2, 2, b'1'),
(171, 'ODU', 4, 2, 2, b'1'),
(172, 'PADIVADA', 4, 2, 2, b'1'),
(173, 'PANVA', 4, 2, 2, b'1'),
(174, 'PATDI', 4, 2, 2, b'1'),
(175, 'PIPADI', 4, 2, 2, b'1'),
(176, 'POYADA', 4, 2, 2, b'1'),
(177, 'RAJAPR', 4, 2, 2, b'1'),
(178, 'RAMGARI', 4, 2, 2, b'1'),
(179, 'ROZAVA', 4, 2, 2, b'1'),
(180, 'RUSHULABAD', 4, 2, 2, b'1'),
(181, 'RUSTAMGADHA', 4, 2, 2, b'1'),
(182, 'SADLA', 4, 2, 2, b'1'),
(183, 'SALI', 4, 2, 2, b'1'),
(184, 'SAVADA', 4, 2, 2, b'1'),
(185, 'SAVANI', 4, 2, 2, b'1'),
(186, 'SAVLAS', 4, 2, 2, b'1'),
(187, 'SEDLA', 4, 2, 2, b'1'),
(188, 'SIDHADAR', 4, 2, 2, b'1'),
(189, 'SURAJPURA', 4, 2, 2, b'1'),
(190, 'SUREL', 4, 2, 2, b'1'),
(191, 'SUSHIYA', 4, 2, 2, b'1'),
(192, 'UPARIYADA', 4, 2, 2, b'1'),
(193, 'VADGAM', 4, 2, 2, b'1'),
(194, 'VAKHADA', 4, 2, 2, b'1'),
(195, 'VALEVADA', 4, 2, 2, b'1'),
(196, 'VANOD', 4, 2, 2, b'1'),
(197, 'VASHARAJPURA', 4, 2, 2, b'1'),
(198, 'VISHANGAR', 4, 2, 2, b'1'),
(199, 'VISHAVDI', 4, 2, 2, b'1'),
(200, 'ZADIYANA', 4, 2, 2, b'1'),
(201, 'ZEZARA', 4, 2, 2, b'1'),
(202, 'ZEZARI', 4, 2, 2, b'1'),
(203, 'ZIZUVADA', 4, 2, 2, b'1'),
(204, 'Jeetap', 3, 4, 4, b'0'),
(205, 'Bholi', 2, 2, 2, b'0'),
(206, 'Bhadrod', 2, 2, 2, b'0'),
(207, 'Halvad', 2, 2, 2, b'1');

-- --------------------------------------------------------

--
-- Table structure for table `worklog`
--

CREATE TABLE `worklog` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `tasktype` int(11) DEFAULT NULL,
  `task` int(11) DEFAULT NULL,
  `work_description` varchar(255) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL,
  `spendtime` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addtask_data`
--
ALTER TABLE `addtask_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `area_assign_user`
--
ALTER TABLE `area_assign_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bank_details`
--
ALTER TABLE `bank_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `branches_new`
--
ALTER TABLE `branches_new`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `branch_department_user`
--
ALTER TABLE `branch_department_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `branch_id_idx` (`branch_id`),
  ADD KEY `department_id_idx` (`department_id`),
  ADD KEY `user_id_idx` (`user_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `category_field`
--
ALTER TABLE `category_field`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `configuration`
--
ALTER TABLE `configuration`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name_UNIQUE` (`name`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`);

--
-- Indexes for table `distributionType`
--
ALTER TABLE `distributionType`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `district`
--
ALTER TABLE `district`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`document_id`);

--
-- Indexes for table `document_details`
--
ALTER TABLE `document_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee_detail`
--
ALTER TABLE `employee_detail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enquiries`
--
ALTER TABLE `enquiries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id_idx` (`customer_id`),
  ADD KEY `modal_id_idx` (`modal_id`),
  ADD KEY `salesperson_id_idx` (`salesperson_id`),
  ADD KEY `enquiry_category_id_idx` (`enquiry_category_id`),
  ADD KEY `enquiry_source_id_idx` (`enquiry_source_id`);

--
-- Indexes for table `enquiry_category`
--
ALTER TABLE `enquiry_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enquiry_category_field`
--
ALTER TABLE `enquiry_category_field`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id_idx` (`category_id`),
  ADD KEY `field_id_idx` (`field_id`);

--
-- Indexes for table `enquiry_data`
--
ALTER TABLE `enquiry_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enquiry_fields`
--
ALTER TABLE `enquiry_fields`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enquiry_lost_reasons`
--
ALTER TABLE `enquiry_lost_reasons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enquiry_primary_sources`
--
ALTER TABLE `enquiry_primary_sources`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enquiry_products`
--
ALTER TABLE `enquiry_products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enquiry_sources`
--
ALTER TABLE `enquiry_sources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `primary_source_id` (`primary_source_id`);

--
-- Indexes for table `enquiry_stages`
--
ALTER TABLE `enquiry_stages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enquiry_types`
--
ALTER TABLE `enquiry_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `features`
--
ALTER TABLE `features`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `follow_up_details`
--
ALTER TABLE `follow_up_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `holiday_data`
--
ALTER TABLE `holiday_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leave_details`
--
ALTER TABLE `leave_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leave_type`
--
ALTER TABLE `leave_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lost_enquiries`
--
ALTER TABLE `lost_enquiries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `manufacturers`
--
ALTER TABLE `manufacturers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name_UNIQUE` (`name`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`);

--
-- Indexes for table `manufactur_details`
--
ALTER TABLE `manufactur_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `message_action`
--
ALTER TABLE `message_action`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `modal`
--
ALTER TABLE `modal`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `old_tractor_details`
--
ALTER TABLE `old_tractor_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `parts`
--
ALTER TABLE `parts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name_UNIQUE` (`name`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`),
  ADD KEY `manufacturer_id_idx` (`manufacturer_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role_features`
--
ALTER TABLE `role_features`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id_idx` (`role_id`),
  ADD KEY `feature_id_idx` (`feature_id`);

--
-- Indexes for table `rto_detail`
--
ALTER TABLE `rto_detail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `state`
--
ALTER TABLE `state`
  ADD PRIMARY KEY (`state_id`);

--
-- Indexes for table `taluka`
--
ALTER TABLE `taluka`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tasktype_id` (`tasktype_id`);

--
-- Indexes for table `tasktime_period`
--
ALTER TABLE `tasktime_period`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `task_status`
--
ALTER TABLE `task_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `task_types`
--
ALTER TABLE `task_types`
  ADD PRIMARY KEY (`tasktype_id`);

--
-- Indexes for table `taxes`
--
ALTER TABLE `taxes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tax_details`
--
ALTER TABLE `tax_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `types`
--
ALTER TABLE `types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_types`
--
ALTER TABLE `user_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `variant`
--
ALTER TABLE `variant`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `village`
--
ALTER TABLE `village`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `worklog`
--
ALTER TABLE `worklog`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addtask_data`
--
ALTER TABLE `addtask_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `area_assign_user`
--
ALTER TABLE `area_assign_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bank_details`
--
ALTER TABLE `bank_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `branches_new`
--
ALTER TABLE `branches_new`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `branch_department_user`
--
ALTER TABLE `branch_department_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `category_field`
--
ALTER TABLE `category_field`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `configuration`
--
ALTER TABLE `configuration`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `distributionType`
--
ALTER TABLE `distributionType`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `district`
--
ALTER TABLE `district`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `document_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `document_details`
--
ALTER TABLE `document_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee_detail`
--
ALTER TABLE `employee_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enquiries`
--
ALTER TABLE `enquiries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enquiry_category`
--
ALTER TABLE `enquiry_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `enquiry_category_field`
--
ALTER TABLE `enquiry_category_field`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enquiry_data`
--
ALTER TABLE `enquiry_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enquiry_fields`
--
ALTER TABLE `enquiry_fields`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `enquiry_lost_reasons`
--
ALTER TABLE `enquiry_lost_reasons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `enquiry_primary_sources`
--
ALTER TABLE `enquiry_primary_sources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `enquiry_products`
--
ALTER TABLE `enquiry_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enquiry_sources`
--
ALTER TABLE `enquiry_sources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enquiry_stages`
--
ALTER TABLE `enquiry_stages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enquiry_types`
--
ALTER TABLE `enquiry_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `features`
--
ALTER TABLE `features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `follow_up_details`
--
ALTER TABLE `follow_up_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `holiday_data`
--
ALTER TABLE `holiday_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leave_details`
--
ALTER TABLE `leave_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leave_type`
--
ALTER TABLE `leave_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `lost_enquiries`
--
ALTER TABLE `lost_enquiries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `manufacturers`
--
ALTER TABLE `manufacturers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `manufactur_details`
--
ALTER TABLE `manufactur_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `message_action`
--
ALTER TABLE `message_action`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `modal`
--
ALTER TABLE `modal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `old_tractor_details`
--
ALTER TABLE `old_tractor_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `parts`
--
ALTER TABLE `parts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `role_features`
--
ALTER TABLE `role_features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `rto_detail`
--
ALTER TABLE `rto_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `state`
--
ALTER TABLE `state`
  MODIFY `state_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `taluka`
--
ALTER TABLE `taluka`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `taxes`
--
ALTER TABLE `taxes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tax_details`
--
ALTER TABLE `tax_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `types`
--
ALTER TABLE `types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_types`
--
ALTER TABLE `user_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `variant`
--
ALTER TABLE `variant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `village`
--
ALTER TABLE `village`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=208;

--
-- AUTO_INCREMENT for table `worklog`
--
ALTER TABLE `worklog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `branch_department_user`
--
ALTER TABLE `branch_department_user`
  ADD CONSTRAINT `mapping_department_id` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `mapping_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `enquiries`
--
ALTER TABLE `enquiries`
  ADD CONSTRAINT `customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `enquiry_category_id` FOREIGN KEY (`enquiry_category_id`) REFERENCES `enquiry_category` (`id`),
  ADD CONSTRAINT `modal_id` FOREIGN KEY (`modal_id`) REFERENCES `modal` (`id`),
  ADD CONSTRAINT `salesperson_id` FOREIGN KEY (`salesperson_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `enquiry_category_field`
--
ALTER TABLE `enquiry_category_field`
  ADD CONSTRAINT `category_id` FOREIGN KEY (`category_id`) REFERENCES `enquiry_category` (`id`),
  ADD CONSTRAINT `field_id` FOREIGN KEY (`field_id`) REFERENCES `enquiry_fields` (`id`);

--
-- Constraints for table `enquiry_sources`
--
ALTER TABLE `enquiry_sources`
  ADD CONSTRAINT `primary_source_id` FOREIGN KEY (`primary_source_id`) REFERENCES `enquiry_primary_sources` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `manufacturer_id` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`);

--
-- Constraints for table `role_features`
--
ALTER TABLE `role_features`
  ADD CONSTRAINT `mapping_feature_id` FOREIGN KEY (`feature_id`) REFERENCES `features` (`id`),
  ADD CONSTRAINT `mapping_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`tasktype_id`) REFERENCES `task_types` (`tasktype_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
