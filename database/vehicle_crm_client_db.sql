-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 25, 2023 at 09:07 AM
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
-- Database: `new_keshav_vehicle_crm`
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
       (SELECT name FROM products WHERE id = product_id) AS product,
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
       (SELECT name FROM products WHERE id = product_id) AS product,
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

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_branch_list` (IN `branchId` INT(11), IN `isAdmin` BOOLEAN)  BEGIN
IF (isAdmin = true) THEN
	SELECT * from branches;
ELSE
	SELECT * from branches where id = branchId;
END IF;

END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_category_with_total_enquiry` (IN `villageId` INT)  BEGIN
SELECT et.*, COUNT(e.enquiry_type_id) AS total_enquiries
FROM enquiry_category AS et
LEFT JOIN enquiries AS e ON et.id = e.enquiry_type_id
LEFT JOIN customers AS c ON c.id = e.customer_id 
WHERE c.village = villageId
GROUP BY et.id;
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

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_enquiries_list` (IN `branchId` INT, IN `isAdmin` BOOLEAN)  BEGIN
    IF (isAdmin = TRUE) THEN
       SELECT s.id, s.first_name, s.last_name, s.phone_number, s.whatsapp_number, s.email,
       (SELECT name FROM products WHERE id = product_id) AS product,
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
ORDER BY f.date DESC;
    ELSE
        SELECT s.id, s.first_name, s.last_name, s.phone_number, s.whatsapp_number, s.email,
       (SELECT name FROM products WHERE id = product_id) AS product,
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
ORDER BY f.date DESC;

    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_enquiries_list_by_salesperson` (IN `branchId` INT, IN `isAdmin` BOOLEAN, IN `salespersonId` INT)  BEGIN
    IF (isAdmin = TRUE) THEN
       SELECT s.id, s.first_name, s.last_name, s.phone_number, s.whatsapp_number, s.email,
       (select modalName from enquiry_products as f1 inner join modal as s on s.id = f1.modal where f1.enquiry_id = f.id) AS product,
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
ORDER BY f.date DESC;
    ELSE
       SELECT s.id, s.first_name, s.last_name, s.phone_number, s.whatsapp_number, s.email,
       (select modalName from enquiry_products as f1 inner join modal as s on s.id = f1.modal where f1.enquiry_id = f.id) AS product,
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
ORDER BY f.date DESC;

    END IF;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_enquiry_list_by_time_interval` (IN `timeInterval` VARCHAR(20))  BEGIN
IF timeInterval = 'Today' THEN 
 SELECT s.id, s.first_name, s.last_name, s.phone_number, s.whatsapp_number, s.email,
           (SELECT name FROM products WHERE id = product_id) AS product,
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
           (SELECT name FROM products WHERE id = product_id) AS product,
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
           (SELECT name FROM products WHERE id = product_id) AS product,
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
LEFT JOIN products AS p ON p.id = f.product_id
LEFT JOIN district AS d ON d.id = s.district
LEFT JOIN taluka AS t1 ON t1.id = s.taluka
LEFT JOIN village AS v1 ON v1.id = s.village
LEFT JOIN state AS st ON st.state_id = s.state
LEFT JOIN enquiry_sources AS es ON es.id = f.enquiry_source_id
WHERE ((f.enquiry_stage IS NULL OR f.enquiry_stage <> 'INVALID') AND s.village = villageId AND f.enquiry_type_id = categoryId)
ORDER BY f.date DESC;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_enquiry_location_list` ()  BEGIN
SELECT *
FROM state
LEFT JOIN district ON state.state_id = district.state_id
LEFT JOIN taluka ON district.id = taluka.district_id
LEFT JOIN village ON taluka.id = village.taluka_id;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_last_month_enquiry_list` ()  BEGIN
SELECT s.id, s.first_name, s.last_name, s.phone_number, s.whatsapp_number, s.email,
       (select modalName from enquiry_products as f1 inner join modal as s on s.id = f1.modal where f1.enquiry_id = f.id) AS product,
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
AND DATE(f.date) >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
AND DATE(f.date) < CURDATE();
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_new_enquiry_list` ()  BEGIN
SELECT s.id, s.first_name, s.last_name, s.phone_number, s.whatsapp_number, s.email,
       (select modalName from enquiry_products as f1 inner join modal as s on s.id = f1.modal where f1.enquiry_id = f.id) AS product,
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
AND f.date >= NOW() - INTERVAL 24 HOUR;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_role_list` ()  BEGIN
	SELECT * from roles where id != 1 and `active` = 1 and `delete` = 0;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_todays_enquiry_list` ()  BEGIN
SELECT s.id, s.first_name, s.last_name, s.phone_number, s.whatsapp_number, s.email,
      (select modalName from enquiry_products as f1 inner join modal as s on s.id = f1.modal where f1.enquiry_id = f.id) AS product,
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
AND DATE(f.date) = CURDATE();

END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_total_enquiry_booking` ()  BEGIN
WITH EnquiryCounts AS (
    SELECT MONTHNAME(e.date) AS month,
           COUNT(*) AS totalEnquiry
    FROM enquiries e
    GROUP BY MONTH(e.date)
),
BookingCounts AS (
    SELECT MONTHNAME(e.delivery_date) AS month,
           COUNT(*) AS totalbooking
    FROM enquiries e
    GROUP BY MONTH(e.delivery_date)
)
SELECT ec.month,
       ec.totalEnquiry,
       bc.totalbooking
FROM EnquiryCounts ec
JOIN BookingCounts bc ON ec.month = bc.month;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_total_enquiry_perCategory` (IN `villageId` INT)  BEGIN
SELECT e.*, COUNT(e.enquiry_type_id) AS total_enquiries
FROM enquiries AS e
LEFT JOIN enquiry_types AS et ON et.id = e.enquiry_type_id
LEFT JOIN customers AS c ON c.id = e.customer_id WHERE c.village = villageId
GROUP BY e.enquiry_type_id;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_user_list` (IN `userId` INT(11), IN `branchId` INT(11), IN `isAdmin` BOOLEAN)  BEGIN
IF (isAdmin = TRUE) then
	SELECT distinct f.id, f.first_name, f.last_name, f.email, f.is_active, f.phone_number  FROM users as f  where f.id not in(userId) and user_type_id=1 and f.is_delete = 0;
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

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_village_list_by_total_enquiry` ()  BEGIN
SELECT v.*, COUNT(c.village) AS total_enquiries
FROM village AS v
LEFT JOIN customers AS c ON v.id = c.village
GROUP BY v.id
ORDER BY total_enquiries DESC, v.name ASC;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_work_assign_village_list` (IN `branchId` INT, IN `userId` INT)  BEGIN
SELECT u.id as user_id, CONCAT(u.first_name, ' ', u.last_name) AS salesperson,
       ec.category_name,
       GROUP_CONCAT(DISTINCT v.name) AS village_names
FROM vehical_crm_db.users u
JOIN vehical_crm_db.area_assign_user aau ON aau.user_id = u.id
JOIN vehical_crm_db.enquiry_category ec ON ec.id = aau.category_id
JOIN vehical_crm_db.village v ON aau.distribution_id = v.id
GROUP BY salesperson, ec.category_name;
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
	SELECT distinct email, first_name, last_name, phone_number, last_login ,CONCAT('[', GROUP_CONCAT(
    distinct CONCAT(
      '{ "page": ', t.page, ', "index_no": "', t.index_no, '", "feature": "', t.feature, '", "label": "', label, '"}'
    ) 
  ), ']') AS features
  FROM branch_department_user as f inner join role_features as s on s.role_id = f.role_id inner join features as t on s.feature_id = t.id  inner join users as fo on fo.id = f.user_id where f.user_id  = userId  and f.branch_id = branchId;
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
  `employee` varchar(255) NOT NULL,
  `tasktype` varchar(255) NOT NULL,
  `task` varchar(45) NOT NULL,
  `taskcount` int(11) NOT NULL,
  `startdate` date NOT NULL,
  `enddate` date NOT NULL
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
  `bank_name` text DEFAULT NULL,
  `bank_branch` text DEFAULT NULL,
  `account_number` int(11) DEFAULT NULL,
  `account_type` text DEFAULT NULL,
  `ifsc_code` text DEFAULT NULL,
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

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `name`, `mobile_number`, `email_id`, `address`, `code`, `create_date`, `gst_number`, `description`, `is_active`, `contact_person`, `state`, `district`, `taluka`, `village`) VALUES
(1, 'New Keshav Tractors', '8976543433', 'admin@newkeshav.com', 'At Dhrangandhra', '360606', '2023-04-08 19:16:06', '23WSE44', 'New Branch', 1, 'Harilal Goraiya', 1, 1, 1, 1);

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
  `value` varchar(100) DEFAULT NULL
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
(1, 'None', 'Department is not selected', 1);


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
  `is_active` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `district`
--

INSERT INTO `district` (`id`, `name`, `state_id`, `is_active`) VALUES
(1, 'None', 1, b'1');

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `document_id` int(11) NOT NULL,
  `table_entity_id` int(11) DEFAULT NULL,
  `document_value` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `enquiry_type_id` int(11) DEFAULT NULL,
  `salesperson_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `delivery_date` datetime DEFAULT NULL,
  `enquiry_source_id` varchar(11) DEFAULT NULL,
  `visitReason` varchar(100) DEFAULT NULL,
  `enquiry_stage` varchar(45) DEFAULT NULL,
  `enquiry_remarks` varchar(255) DEFAULT NULL
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
  `field` varchar(100) DEFAULT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `enquiry_fields`
--

INSERT INTO `enquiry_fields` (`id`, `field`, `name`) VALUES
(1, 'firstName', 'First Name'),
(2, 'lastName', 'Last Name'),
(3, 'state', 'State'),
(4, 'city', 'City'),
(5, 'district', 'District'),
(6, 'taluko', 'Taluko'),
(7, 'village', 'Village'),
(8, 'mobileNumber', 'Mobile Number'),
(9, 'whatsappNumber', 'Whatsapp Number'),
(10, 'visitReason', 'Visit Reason'),
(11, 'sourceOfInquiry', 'Source Of Inquiry'),
(12, 'email', 'Email'),
(13, 'companyName', 'Company Name'),
(14, 'location', 'Location'),
(15, 'modal', 'Modal'),
(16, 'deliveryDate', 'Delivery Date'),
(17, 'oldTractor', 'Old Tractor Owned');

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
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `enquiry_primary_sources`
--

INSERT INTO `enquiry_primary_sources` (`id`, `name`) VALUES
(1, 'Digital'),
(2, 'Telemarketing'),
(3, 'News'),
(4, 'Visit'),
(5, 'Other');

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

--
-- Dumping data for table `enquiry_sources`
--

INSERT INTO `enquiry_sources` (`id`, `name`, `primary_source_id`) VALUES
(1, 'Web advertisement', 1),
(2, 'App recommandation', 1),
(3, 'Calling inquiry', 2),
(4, 'Newspaper', 3),
(5, 'News advertisement', 3),
(6, 'Work shop visit', 4),
(7, 'Show room visit', 4),
(8, 'Reference', 5);

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
(1, 1, '1.1', 'agency-profile', 'Agency', 0, b'00000000000'),
(2, 1, '1.2', 'dashboard', 'Dashboard', 0, b'00000000000'),
(3, 1, '1.3', 'user-profile', 'profile', 0, b'00000000001'),
(4, 2, '2.1', 'sales', 'Sales', 0, b'00000000001'),
(5, 3, '3.1', 'service', 'Services', 0, b'00000000001'),
(6, 4, '3.1', 'manage', 'Manage', 0, b'00000000001'),
(7, 5, '7.1', 'roles', 'Roles', 0, b'00000000001'),
(8, 5, '6.1', 'add-role', 'Add role', 7, b'00000000001'),
(9, 5, '1.1', 'users', 'Users', 0, b'00000000001'),
(10, 5, '3.1', 'add-user', 'Add user', 1, b'00000000001'),
(11, 5, '4.1', 'edit-user', 'Edit user', 1, b'00000000001'),
(12, 5, '5.1', 'products', 'Products', 3, b'00000000001'),
(13, 5, '2', 'configuration', 'Configuration', 3, b'00000000000'),
(14, 5, '8.1', 'agency', 'Agency', 0, b'00000000001'),
(15, 5, '11.1', 'branch', 'Branch', 0, b'00000000001'),
(16, 5, '14', 'work-assign', 'Work Assign', 0, b'00000000000'),
(17, 5, '21', 'employee', 'Employee', 0, b'00000000000'),
(18, 5, '2', 'report', 'Report', 3, b'00000000000');

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
-- Table structure for table `modal`
--

CREATE TABLE `modal` (
  `id` int(11) NOT NULL,
  `modalName` varchar(100) DEFAULT NULL,
  `manufacturerId` int(11) DEFAULT NULL,
  `isActive` bit(11) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `manufactur_year` date DEFAULT NULL,
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
(1, 'super_admin', '1', 'Super Admin', '0', 1);

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
(18, 1, 18);

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
  `is_active` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `state`
--

INSERT INTO `state` (`state_id`, `state_name`, `description`, `is_active`) VALUES
(1, 'None', 'No state selected', b'1'),
(2, 'Gujarat', 'Gujarat is a western Indian state known for its rich cultural heritage', b'1');

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
(1, 'None', -1, -1, b'1'),
(2, 'Dhrangadhra', 1, 1, b'1');

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
(10, 'RTO', 'Send details in whatsup.', 3);


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
(-1, 'None', -1, -1, -1, b'1');


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
  ADD KEY `product_id_idx` (`product_id`),
  ADD KEY `salesperson_id_idx` (`salesperson_id`),
  ADD KEY `enquiry_type_id_idx` (`enquiry_type_id`),
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
-- AUTO_INCREMENT for dumped tables
--

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;;

--
-- AUTO_INCREMENT for table `distributionType`
--
ALTER TABLE `distributionType`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;;

--
-- AUTO_INCREMENT for table `district`
--
ALTER TABLE `district`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `document_id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;;

--
-- AUTO_INCREMENT for table `enquiry_lost_reasons`
--
ALTER TABLE `enquiry_lost_reasons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;;

--
-- AUTO_INCREMENT for table `enquiry_primary_sources`
--
ALTER TABLE `enquiry_primary_sources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;;

--
-- AUTO_INCREMENT for table `enquiry_products`
--
ALTER TABLE `enquiry_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enquiry_sources`
--
ALTER TABLE `enquiry_sources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;;

--
-- AUTO_INCREMENT for table `enquiry_stages`
--
ALTER TABLE `enquiry_stages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enquiry_types`
--
ALTER TABLE `enquiry_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `features`
--
ALTER TABLE `features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;;

--
-- AUTO_INCREMENT for table `follow_up_details`
--
ALTER TABLE `follow_up_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lost_enquiries`
--
ALTER TABLE `lost_enquiries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `manufacturers`
--
ALTER TABLE `manufacturers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `manufactur_details`
--
ALTER TABLE `manufactur_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `modal`
--
ALTER TABLE `modal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;;

--
-- AUTO_INCREMENT for table `role_features`
--
ALTER TABLE `role_features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;;

--
-- AUTO_INCREMENT for table `rto_detail`
--
ALTER TABLE `rto_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `state`
--
ALTER TABLE `state`
  MODIFY `state_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;;

--
-- AUTO_INCREMENT for table `taluka`
--
ALTER TABLE `taluka`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;;

--
-- AUTO_INCREMENT for table `taxes`
--
ALTER TABLE `taxes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;;

--
-- AUTO_INCREMENT for table `tax_details`
--
ALTER TABLE `tax_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_types`
--
ALTER TABLE `user_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;;

--
-- AUTO_INCREMENT for table `variant`
--
ALTER TABLE `variant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `village`
--
ALTER TABLE `village`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;;

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
  ADD CONSTRAINT `enquiry_type_id` FOREIGN KEY (`enquiry_type_id`) REFERENCES `enquiry_types` (`id`),
  ADD CONSTRAINT `product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
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
