-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 18, 2023 at 05:39 AM
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
-- Database: `VehicleKeshavCRMDb`
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
SELECT et.*, COUNT(e.enquiry_category_id) AS total_enquiries
FROM enquiry_category AS et
LEFT JOIN enquiries AS e ON et.id = e.enquiry_category_id
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

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_selected_enquiry_fields_by_category` (IN `categoryId` INT)  BEGIN
SELECT f.field_id, ef.field FROM enquiry_category_field as f inner join enquiry_category as s on s.id = f.category_id inner join enquiry_fields as ef on ef.id = f.field_id where category_id = categoryId;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_task_list` ()  BEGIN
SELECT s.id, CONCAT(s.first_name, ' ', s.last_name) as employee, tt.tasktype_name, ts.task_name, att.taskcount ,att.startdate,att.enddate
FROM addtask_data AS att
INNER JOIN users AS s ON att.employee = s.id
INNER JOIN task_types AS tt ON att.tasktype = tt.tasktype_id
INNER JOIN tasks AS ts ON ts.id = att.task;
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
SELECT e.*, COUNT(e.enquiry_category_id) AS total_enquiries
FROM enquiries AS e
LEFT JOIN enquiry_category AS et ON et.id = e.enquiry_category_id
LEFT JOIN customers AS c ON c.id = e.customer_id WHERE c.village = villageId
GROUP BY e.enquiry_category_id;
END$$

CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_user_list` (IN `userId` INT(11), IN `branchId` INT(11), IN `isAdmin` BOOLEAN)  BEGIN
IF (isAdmin = TRUE) then
	SELECT distinct f.id, f.first_name, f.last_name, f.email, f.is_active, f.phone_number  FROM users as f  where f.id and f.is_delete = 0;
ELSE
    SELECT distinct f.id, f.first_name, f.last_name, f.email, f.is_active, f.phone_number  FROM users as f inner join branch_department_user as s on s.user_id = f.id  inner join branches as t on s.branch_id = t.id where s.branch_id = branchId and f.is_delete=0 and f.id not in((select user_id from branch_department_user where role_id  =1 limit 1), userId);
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
FROM users u
JOIN area_assign_user aau ON aau.user_id = u.id
JOIN enquiry_category ec ON ec.id = aau.category_id
JOIN village v ON aau.distribution_id = v.id
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
  `employee` varchar(255) DEFAULT NULL,
  `tasktype` varchar(255) DEFAULT NULL,
  `task` varchar(45) DEFAULT NULL,
  `taskcount` int(11) DEFAULT NULL,
  `startdate` date DEFAULT NULL,
  `enddate` date DEFAULT NULL
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

--
-- Dumping data for table `area_assign_user`
--

INSERT INTO `area_assign_user` (`id`, `user_id`, `distribution_id`, `distribution_type`, `category_id`) VALUES
(1, 2, '11', 1, '2'),
(2, 2, '66', 1, '2'),
(3, 2, '9', 1, '2'),
(4, 2, '10', 1, '2'),
(5, 2, '47', 1, '2'),
(6, 2, '64', 1, '2'),
(7, 2, '35', 1, '2'),
(8, 2, '50', 1, '2'),
(9, 2, '54', 1, '2'),
(10, 2, '24', 1, '2'),
(11, 2, '17', 1, '2'),
(12, 2, '31', 1, '2'),
(13, 2, '15', 1, '2'),
(14, 2, '32', 1, '2'),
(15, 2, '30', 1, '2'),
(16, 2, '40', 1, '2'),
(17, 2, '4', 1, '2'),
(18, 2, '2', 1, '2'),
(19, 2, '3', 1, '2'),
(20, 2, '43', 1, '2'),
(21, 2, '33', 1, '2'),
(22, 3, '56', 1, '2'),
(23, 3, '19', 1, '2'),
(24, 3, '59', 1, '2'),
(25, 3, '53', 1, '2'),
(26, 3, '34', 1, '2'),
(27, 3, '45', 1, '2'),
(28, 3, '6', 1, '2'),
(29, 3, '57', 1, '2'),
(30, 3, '39', 1, '2'),
(31, 3, '55', 1, '2'),
(32, 3, '36', 1, '2'),
(33, 3, '29', 1, '2'),
(34, 3, '27', 1, '2'),
(35, 3, '28', 1, '2'),
(36, 3, '20', 1, '2'),
(37, 3, '42', 1, '2'),
(38, 3, '41', 1, '2'),
(39, 3, '8', 1, '2'),
(40, 3, '68', 1, '2'),
(41, 3, '67', 1, '2'),
(42, 3, '46', 1, '2'),
(43, 3, '25', 1, '2'),
(44, 3, '44', 1, '2'),
(45, 3, '61', 1, '2'),
(46, 4, '5', 1, '2'),
(47, 4, '62', 1, '2'),
(48, 4, '37', 1, '2'),
(49, 4, '52', 1, '2'),
(50, 4, '48', 1, '2'),
(51, 4, '12', 1, '2'),
(52, 4, '23', 1, '2'),
(53, 4, '60', 1, '2'),
(54, 4, '26', 1, '2'),
(55, 4, '21', 1, '2'),
(56, 4, '63', 1, '2'),
(57, 4, '13', 1, '2'),
(58, 4, '16', 1, '2'),
(59, 4, '58', 1, '2'),
(60, 4, '18', 1, '2'),
(61, 4, '14', 1, '2'),
(62, 4, '65', 1, '2'),
(63, 4, '22', 1, '2'),
(64, 4, '51', 1, '2'),
(65, 4, '38', 1, '2'),
(66, 4, '49', 1, '2'),
(67, 4, '7', 1, '2'),
(68, 9, '125', 1, '2'),
(69, 9, '153', 1, '2'),
(70, 9, '139', 1, '2'),
(71, 9, '122', 1, '2'),
(72, 9, '49', 1, '2'),
(73, 9, '146', 1, '2'),
(74, 9, '178', 1, '2'),
(75, 9, '147', 1, '2'),
(76, 9, '188', 1, '2'),
(77, 9, '182', 1, '2'),
(78, 9, '134', 1, '2'),
(79, 9, '163', 1, '2'),
(80, 9, '202', 1, '2'),
(81, 9, '151', 1, '2'),
(82, 9, '155', 1, '2'),
(83, 9, '114', 1, '2'),
(84, 9, '129', 1, '2'),
(85, 9, '175', 1, '2'),
(86, 9, '120', 1, '2'),
(87, 9, '186', 1, '2'),
(88, 9, '187', 1, '2'),
(89, 9, '165', 1, '2'),
(90, 9, '166', 1, '2'),
(91, 9, '148', 1, '2'),
(92, 9, '161', 1, '2'),
(93, 9, '176', 1, '2'),
(94, 9, '160', 1, '2'),
(95, 9, '117', 1, '2'),
(96, 9, '194', 1, '2'),
(97, 9, '174', 1, '2'),
(98, 11, '83', 1, '2'),
(99, 11, '82', 1, '2'),
(100, 11, '112', 1, '2'),
(101, 11, '110', 1, '2'),
(102, 11, '111', 1, '2'),
(103, 11, '108', 1, '2'),
(104, 11, '109', 1, '2'),
(105, 11, '107', 1, '2'),
(106, 11, '106', 1, '2'),
(107, 11, '105', 1, '2'),
(108, 11, '104', 1, '2'),
(109, 11, '103', 1, '2'),
(110, 11, '102', 1, '2'),
(111, 11, '101', 1, '2'),
(112, 11, '100', 1, '2'),
(113, 11, '99', 1, '2'),
(114, 11, '98', 1, '2'),
(115, 11, '97', 1, '2'),
(116, 11, '96', 1, '2'),
(117, 11, '95', 1, '2'),
(118, 11, '94', 1, '2'),
(119, 11, '93', 1, '2'),
(120, 11, '92', 1, '2'),
(121, 11, '91', 1, '2'),
(122, 11, '90', 1, '2'),
(123, 11, '89', 1, '2'),
(124, 11, '88', 1, '2'),
(125, 11, '86', 1, '2'),
(126, 11, '87', 1, '2'),
(127, 11, '85', 1, '2'),
(128, 11, '84', 1, '2'),
(129, 11, '81', 1, '2'),
(130, 11, '80', 1, '2'),
(131, 11, '79', 1, '2'),
(132, 11, '78', 1, '2'),
(133, 11, '77', 1, '2'),
(134, 11, '76', 1, '2'),
(135, 11, '75', 1, '2'),
(136, 11, '74', 1, '2'),
(137, 11, '73', 1, '2'),
(138, 11, '72', 1, '2'),
(139, 11, '71', 1, '2'),
(140, 11, '70', 1, '2'),
(141, 11, '69', 1, '2'),
(142, 26, '167', 1, '2'),
(143, 26, '140', 1, '2'),
(144, 26, '150', 1, '2'),
(145, 26, '171', 1, '2'),
(146, 26, '144', 1, '2'),
(147, 26, '145', 1, '2'),
(148, 26, '189', 1, '2'),
(149, 26, '192', 1, '2'),
(150, 26, '170', 1, '2'),
(151, 26, '132', 1, '2'),
(152, 26, '137', 1, '2'),
(153, 26, '138', 1, '2'),
(154, 26, '154', 1, '2'),
(155, 26, '152', 1, '2'),
(156, 26, '121', 1, '2'),
(157, 26, '143', 1, '2'),
(158, 26, '136', 1, '2'),
(159, 26, '156', 1, '2'),
(160, 26, '169', 1, '2'),
(161, 26, '157', 1, '2'),
(162, 26, '149', 1, '2'),
(163, 26, '164', 1, '2'),
(164, 26, '185', 1, '2'),
(165, 26, '162', 1, '2'),
(166, 26, '142', 1, '2'),
(167, 26, '141', 1, '2'),
(168, 26, '116', 1, '2'),
(169, 26, '158', 1, '2'),
(170, 26, '135', 1, '2'),
(171, 26, '159', 1, '2'),
(172, 26, '127', 1, '2'),
(173, 26, '184', 1, '2'),
(174, 27, '128', 1, '2'),
(175, 27, '195', 1, '2'),
(176, 27, '115', 1, '2'),
(177, 27, '196', 1, '2'),
(178, 27, '191', 1, '2'),
(179, 27, '126', 1, '2'),
(180, 27, '119', 1, '2'),
(181, 27, '118', 1, '2'),
(182, 27, '180', 1, '2'),
(183, 27, '181', 1, '2'),
(184, 27, '133', 1, '2'),
(185, 27, '124', 1, '2'),
(186, 27, '173', 1, '2'),
(187, 27, '199', 1, '2'),
(188, 27, '201', 1, '2'),
(189, 27, '193', 1, '2'),
(190, 27, '200', 1, '2'),
(191, 27, '183', 1, '2'),
(192, 27, '172', 1, '2'),
(193, 27, '113', 1, '2'),
(194, 27, '168', 1, '2'),
(195, 27, '179', 1, '2'),
(196, 27, '190', 1, '2'),
(197, 27, '198', 1, '2'),
(198, 27, '131', 1, '2'),
(199, 27, '123', 1, '2'),
(200, 27, '130', 1, '2'),
(201, 27, '197', 1, '2'),
(202, 27, '203', 1, '2');

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
  `account_number` bigint(16) DEFAULT NULL,
  `account_type` text DEFAULT NULL,
  `ifsc_code` text DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bank_details`
--

INSERT INTO `bank_details` (`id`, `bank_name`, `bank_branch`, `account_number`, `account_type`, `ifsc_code`, `user_id`) VALUES
(1, 'State Bank of India (SBI)', 'DHRANGDHRA', 33972491033, 'Salery', ' SBIN0017321', 2),
(2, 'State Bank of India (SBI)', ' DHRANGDHRA', 38590814390, 'Savings', 'SBIN0004867', 3),
(3, 'State Bank of India (SBI)', 'DHRANGDHRA', 34580023579, 'Salery', 'SBIN0060100', 4),
(4, 'Bank of Baroda (BOB)', 'DHRANGADHRA', 25138100012298, 'Salery', 'BARB0DHRANG', 5),
(5, 'State Bank of India (SBI)', 'DHRANGADHRA', 2131113, 'Savings', 'none01', 8),
(6, 'ICICI Bank', 'MALVAN', 288801000639, 'Salery', 'ICIC0002888', 9),
(7, 'Bank of Baroda (BOB)', 'LAKHATAR', 43270100006418, 'Salery', 'BARB0LAKHTA', 11),
(8, 'State Bank of India (SBI)', 'LAKHATAR', 0, 'Salery', 'none01', 12),
(9, 'ICICI Bank', 'DHRANGADHRA', 363501500694, 'Salery', 'ICIC0003635', 13),
(10, 'Bank of Baroda (BOB)', 'PATDI', 3720100017756, 'Salery', 'BARB0PATRIX', 14),
(11, 'Bank of Baroda (BOB)', 'PATDI', 3720100021607, 'Salery', 'BARB0PATRIX', 15),
(12, 'ICICI Bank', 'DHRANGADHRA', 363501501370, 'Salery', 'ICIC0003635', 16),
(13, 'State Bank of India (SBI)', 'DHRANGADHRA', 1121, 'Salery', 'none11', 22),
(14, 'State Bank of India (SBI)', 'DHRANGADHRA', 333, 'Salery', 'none22', 24),
(15, 'ICICI Bank', 'DHRANGADHRA', 25260, 'Salery', 'ICIC0003635', 25),
(16, 'ICICI Bank', 'DHRANGADHRA', 25260, 'Salery', 'ICIC0003635', 26),
(17, 'ICICI Bank', 'DHRANGADHRA', 25260, 'Salery', 'ICIC0003635', 27);

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
(1, 'New Keshav Tractors (Dhrangadhra)', '9725579291', 'admin@newkeshav.com', 'At Dhrangandhra', '363310', '2023-04-08 19:16:06', '23WSE44', 'Main branch of New Keshav tractor agency', 1, 'Harilal Goraiya', 2, 2, 2, 2);

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

--
-- Dumping data for table `branch_department_user`
--

INSERT INTO `branch_department_user` (`id`, `branch_id`, `department_id`, `user_id`, `role_id`) VALUES
(1, 1, 1, 1, 1);

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

--
-- Dumping data for table `configuration`
--

INSERT INTO `configuration` (`id`, `setting`, `key_name`, `value`) VALUES
(1, 'agency', 'name', 'New Keshav Tractors'),
(2, 'agency', 'contact', 'Harilal Pael'),
(3, 'agency', 'email', 'newkeshav@gmail.com'),
(4, 'agency', 'logo', '/upload/logo_1694441895352.jpg');

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

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `first_name`, `middle_name`, `last_name`, `phone_number`, `whatsapp_number`, `email`, `is_active`, `state`, `district`, `taluka`, `block`, `village`, `city`) VALUES
(1, 'Mukesh', 'null', 'Patel', '918320022319', '918320022319', 'mukesh@balkrushna.com', 1, '2', '2', NULL, NULL, NULL, NULL),
(2, 'Mukesh', 'null', 'Patel', '8320022319', '8320022319', 'mukesh@balkrushna.com', 1, '2', '2', '2', NULL, '5', NULL);

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
(2, 'SURENDRANAGAR', 2, b'1');

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `document_id` int(11) NOT NULL,
  `document_path` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`document_id`, `document_path`, `created_at`) VALUES
(1, '/upload/1694775324615_newkeshav.png', '2023-09-15 10:55:25'),
(2, '/upload/1694775702006_newkeshav.png', '2023-09-15 11:01:43'),
(3, '/upload/1694777678500_newkeshav.png', '2023-09-15 11:34:44'),
(4, '/upload/1694777748631_newkeshav.png', '2023-09-15 11:35:52'),
(5, '/upload/1694778096795_newkeshav.png', '2023-09-15 11:41:40'),
(6, '/upload/1694778249412_newkeshav.png', '2023-09-15 11:44:13'),
(7, '/upload/1694778376145_newkeshav.png', '2023-09-15 11:46:20'),
(8, '/upload/1694778615864_newkeshav.png', '2023-09-15 11:50:20'),
(9, '/upload/1694778863771_newkeshav.png', '2023-09-15 11:54:27'),
(10, '/upload/1694779084594_newkeshav.png', '2023-09-15 11:58:08'),
(11, '/upload/1694779241737_newkeshav.png', '2023-09-15 12:00:45'),
(12, '/upload/1694779387496_newkeshav.png', '2023-09-15 12:03:11'),
(13, '/upload/1694779524462_newkeshav.png', '2023-09-15 12:05:28'),
(14, '/upload/1694780410533_newkeshav.png', '2023-09-15 12:20:14'),
(15, '/upload/1694780658495_newkeshav.png', '2023-09-15 12:24:22'),
(16, '/upload/1694780777700_newkeshav.png', '2023-09-15 12:26:20'),
(17, '/upload/1694781043374_newkeshav.png', '2023-09-15 12:30:47'),
(18, '/upload/1694781481611_newkeshav.png', '2023-09-15 12:38:05'),
(19, '/upload/1694781538839_newkeshav.png', '2023-09-15 12:39:02'),
(20, '/upload/1694781696838_newkeshav.png', '2023-09-15 12:41:40'),
(21, '/upload/1694781813883_newkeshav.png', '2023-09-15 12:43:38');

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

--
-- Dumping data for table `document_details`
--

INSERT INTO `document_details` (`id`, `document_id`, `mapping_id`, `mapping_table`) VALUES
(1, 1, 2, 'employee_profile'),
(2, 2, 3, 'employee_profile'),
(3, 3, 4, 'employee_profile'),
(4, 4, 5, 'employee_profile'),
(5, 5, 6, 'employee_profile'),
(6, 8, 8, 'employee_profile'),
(7, 9, 9, 'employee_profile'),
(8, 10, 11, 'employee_profile'),
(9, 11, 12, 'employee_profile'),
(10, 12, 13, 'employee_profile'),
(11, 13, 14, 'employee_profile'),
(12, 14, 15, 'employee_profile'),
(13, 15, 16, 'employee_profile'),
(14, 16, 17, 'employee_profile'),
(15, 16, 18, 'employee_profile'),
(16, 16, 19, 'employee_profile'),
(17, 17, 20, 'employee_profile'),
(18, 17, 21, 'employee_profile'),
(19, 17, 22, 'employee_profile'),
(20, 18, 24, 'employee_profile'),
(21, 19, 25, 'employee_profile'),
(22, 20, 26, 'employee_profile'),
(23, 21, 27, 'employee_profile');

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

--
-- Dumping data for table `employee_detail`
--

INSERT INTO `employee_detail` (`id`, `branch_id`, `department_id`, `user_id`, `role_id`) VALUES
(1, 1, 2, 2, 4),
(2, 1, 2, 3, 4),
(3, 1, 2, 4, 4),
(4, 1, 2, 5, 4),
(5, 1, 2, 8, 4),
(6, 1, 2, 9, 4),
(7, 1, 2, 11, 4),
(8, 1, 2, 12, 3),
(9, 1, 3, 13, 4),
(10, 1, 3, 14, 4),
(11, 1, 1, 15, 3),
(12, 1, 1, 16, 3),
(13, 1, 2, 22, 3),
(14, 1, 3, 24, 5),
(15, 1, 3, 25, 5),
(16, 1, 2, 26, 3),
(17, 1, 2, 27, 3);

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
  `enquiry_remarks` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `enquiries`
--

INSERT INTO `enquiries` (`id`, `branch_id`, `enquiry_category_id`, `salesperson_id`, `customer_id`, `modal_id`, `date`, `delivery_date`, `primary_source_id`, `enquiry_source_id`, `visitReason`, `enquiry_stage`, `enquiry_remarks`) VALUES
(2, 1, 2, 1, 2, 14, '2023-09-15 07:05:26', '2023-09-15 07:23:50', NULL, '1', '1', NULL, NULL);

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
(1, 'None', 'None', 1, 'None'),
(2, 'New Tractor', '', 1, 'Sales');

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

--
-- Dumping data for table `enquiry_category_field`
--

INSERT INTO `enquiry_category_field` (`id`, `category_id`, `field_id`, `type`) VALUES
(1, 2, 1, 'enquiry'),
(2, 2, 2, 'enquiry'),
(3, 2, 3, 'enquiry'),
(4, 2, 5, 'enquiry'),
(5, 2, 6, 'enquiry'),
(6, 2, 7, 'enquiry'),
(7, 2, 8, 'enquiry'),
(8, 2, 9, 'enquiry'),
(9, 2, 10, 'enquiry'),
(10, 2, 11, 'enquiry'),
(11, 2, 12, 'enquiry'),
(12, 2, 13, 'enquiry'),
(13, 2, 14, 'enquiry'),
(14, 2, 15, 'enquiry'),
(15, 2, 16, 'enquiry'),
(16, 2, 17, 'enquiry'),
(17, 2, 18, 'enquiry'),
(18, 2, 19, 'enquiry'),
(19, 2, 20, 'enquiry'),
(20, 2, 21, 'enquiry'),
(21, 2, 22, 'enquiry'),
(22, 2, 24, 'enquiry'),
(23, 2, 25, 'enquiry');

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
(25, 'oldTractor', ' Old Tractor Owend');

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
(17, 5, '5.9', 'work-assign', 'Work Assign', 0, b'00000000001'),
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
(1, 'SONALIKA', 'SONALIKA', 1),
(2, 'ACE', 'ACE', 1),
(3, 'Captain Tractor', 'Captain Tractor', 1),
(4, 'EICHER', 'EICHER', 1),
(5, 'ESCORTS', 'ESCORTS', 1),
(6, 'FORCE MOTORS', 'FORCE MOTORS', 1),
(7, 'HMT', 'HMT', 1),
(8, 'INDOFARM', 'INDOFARM', 1),
(9, 'ITL', 'ITL', 1),
(10, 'ITL-NAVYUG', 'ITL-NAVYUG', 1),
(11, 'JD', 'JD', 1),
(12, 'Kubota', 'Kubota', 1),
(13, 'M & M', 'M & M', 1),
(14, 'MF/TAFE', 'MF/TAFE', 1),
(15, 'MGT', 'MGT', 1),
(16, 'NHF', 'NHF', 1),
(17, 'PREET', 'PREET', 1),
(18, 'PTL', 'PTL', 1),
(19, 'SAME', 'SAME', 1),
(20, 'SAS', 'SAS', 1),
(21, 'STANDARD', 'STANDARD', 1),
(22, 'SWARAJ', 'SWARAJ', 1),
(23, 'VST', 'VST', 1);

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

--
-- Dumping data for table `manufactur_details`
--

INSERT INTO `manufactur_details` (`id`, `enquiry_id`, `maker`, `modalName`, `variantName`, `year_of_manufactur`, `condition_of`, `old_tractor`) VALUES
(1, 2, '4', '13', 'null', 1, '3', 'Yes');

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
(2, 'DI-745III', 1, b'00000000001'),
(3, 'GT-20', 1, b'00000000001'),
(4, 'GT-22', 1, b'00000000001'),
(5, 'DI-734 P+', 1, b'00000000001'),
(6, 'DI-35 13.6 CG', 1, b'00000000001'),
(7, 'DI-50', 1, b'00000000001'),
(8, 'NT-30', 1, b'00000000001'),
(9, 'RX-47', 1, b'00000000001'),
(10, 'MM-18', 1, b'00000000001'),
(11, 'Baagban-30 NT', 1, b'00000000001'),
(12, 'DI-745 14.9', 1, b'00000000001'),
(13, '188', 4, b'00000000001'),
(14, '25', 5, b'00000000001'),
(15, 'A211N', 12, b'00000000001'),
(16, '717', 22, b'00000000001'),
(17, '841 XM', 22, b'00000000001'),
(18, '30 DI J(2Cyl)', 14, b'00000000001'),
(19, 'JIVO 225', 13, b'00000000001'),
(20, '2211', 7, b'00000000001');

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

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `manufacturer_id`) VALUES
(1, 'DI 35', 1);

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
(5, 'customer', '1', 'purchases goods or services', '1', 1);

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
(1, 'None', 'No Selected State', b'1'),
(2, 'GUJARAT', 'Gujarat is a vibrant state located on the western coast of India', b'1');

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
(2, 'Dhrangadhra', 2, 2, b'1'),
(3, 'Maniyahu', 4, 4, b'0');

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

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `is_active`, `phone_number`, `last_login`, `current_login`, `bloodgroup`, `dob`, `user_type_id`, `is_delete`) VALUES
(1, 'Harilal', 'Patel', 'newkeshav@gmail.com', '$2b$10$dHj8ggO9IJ9ObDAUfoUPaOGkGzpOlSyKfR5QEgyk4bFjNduAGVRxi', 1, '9725579291', '2023-09-11 14:17:35', '2023-09-11 14:39:32', NULL, NULL, NULL, 0),
(2, 'BHARATBHAI ', 'KHATANA', ' KHATANABHARAT51@GMAIL.COM', '$2b$10$VXtnFftyX1dGB0jgv88EqugL.m9bamgD1GIROOpuDaXjJ5RSm8PPG', 1, ' 9879546234', NULL, NULL, '', '2023-09-16', 2, 0),
(3, 'MAHESHBHAI', ' KAlOTARA', 'rabarim008@gmail.com', '$2b$10$dhUTciEEjv26uBLQiBkFv.dTximdgmqbAzSpTgnyU5es6PMPaePha', 1, '1234567890', NULL, NULL, '', '2023-09-16', 2, 0),
(4, 'BRIJRAJSINH ', 'JADEJA', ' sonalikabrijraj@gmail.com', '$2b$10$e85hf8HaDh8CnqqtEiBtG.EE.TCwGM018lSE5WYZgAWHpEX39K0ha', 1, '8238322266', NULL, NULL, '', '2023-09-16', 2, 0),
(5, 'NIVEDANBHAI ', 'HAREJA', 'harejanivedan@gmail.com', '$2b$10$NJvzEh63ieuTF572XymXA.XV7DihFCnbD2QnA9jB8wOtmDqKdsyIu', 1, '8780056174', NULL, NULL, '', '2023-09-16', 2, 0),
(8, 'RAJUBHAI ', 'PATEL', 'patelraju2204@gamil.com', '$2b$10$0k1w3Gis5UhFwo0lJvVuZ..uRsVHFH0WUeYIGc1cg1EplMyY7.XAi', 1, '9998979555', NULL, NULL, '', '2023-09-16', 2, 0),
(9, 'VINODBHAI ', 'MAKVANA', ' prakash.thakor.7390@gmail.com', '$2b$10$6AJJbqme3KGVF9O4N0tHVewA2K/xHJaWNgARwUu6j4oezNQ2gB1a2', 1, '8238544222', NULL, NULL, '', '2023-09-16', 2, 0),
(11, 'AJAMALBHAI ', 'PARMAR', ' ajmal@gmail.com', '$2b$10$uqTKVH5b/xDRSC4W.YlweOyyAqQ7ePAQBdC1FrFQyL5dXoup8D0T.', 1, '9875053248', NULL, NULL, '', '2023-09-16', 2, 0),
(12, 'HARILAL ', 'DEALER', 'harilalsonalika@gmail.com', '$2b$10$6ByVUoaZ1g0lgekV5FD99exO1kBTTtwUxgHTU9pNmeaOTrIbXuPYi', 1, '8238566222', NULL, NULL, 'AB+', '2023-09-15', 2, 0),
(13, 'VIPULKUMAR ', 'PATEL', ' sonalikavipul@gmail.com', '$2b$10$11hN1MTAuMLiYuOrmCt8W.WVkKIeV/bVx8X.vtNEo.gcLyEZDEXQS', 1, '9265763819', NULL, NULL, '', '2023-09-16', 2, 0),
(14, 'MUKESH ', 'RAJOSANIYA', 'mukeshthakor0111@gmail.com', '$2b$10$KqyIYdlft4ZdvteppdR/jusqHFzCrfg9tF/.jloFT7GZcwNMaBa4G', 1, '7575038456', NULL, NULL, '', '2023-09-16', 2, 0),
(15, 'MAYURSINH ', 'ZALA', 'zalamayursinh48@gmail.com', '$2b$10$weaAdL6dtjrtaq23vCqaCeCEeRBPbyoH8Y3ZJYOTpBeiF5awwzuC2', 1, '9265758542', NULL, NULL, '', '2023-09-15', 2, 0),
(16, 'GHANGHAR ', 'DEVAJIBHAI', ' ghanghardevji@gmail.com', '$2b$10$c47cBcl8NXm24u6XDm3aZeHH8wDLbNwqfdG4Nnma556kvkXspB6Z2', 1, '9033243313', NULL, NULL, '', '2023-09-15', 2, 0),
(22, '	ASHOKBHAI', 'none', ' AMITK4330@GMAIL.COM', '$2b$10$h/zy/4TAvEVnoDGaX0VK6.a3fJ2mV8upMQ6RJpJpr5A.taJrsY.p.', 1, '9510029913', NULL, NULL, 'B+', '2023-09-15', 2, 0),
(24, 'PRAJAPATI ', 'PINALBEN', ' pinalnagpara@gmail.com', '$2b$10$ZoDlBwYQAfbDbPlJmDFxuOnKIzrRKl1Uz3p2IjUacP0vT0IuF26hm', 1, '7016564044', NULL, NULL, 'B-', '2023-09-15', 2, 0),
(25, 'ASHOKBHAI ', 'HEMUBHAI', ' ASHOKBHAI@GMAIL.COM', '$2b$10$q49QjXS/BPVD1/cwv.Tk3u3h9cPHoKlWOkWZcNpv2xpN0xUqlezaa', 1, '8401602023', NULL, NULL, 'AB-', '2023-09-15', 2, 0),
(26, 'CLUSTER 1', 'none', ' mukeshthakor0111@gmail.com', '$2b$10$AA1iEDUZpRTnSdUddHYaIO141jYo4GkGriW1jhPr0qrWihd56joX.', 1, '9898989898', NULL, NULL, 'AB+', '2023-09-15', 2, 0),
(27, 'CLUSTER 2', 'none', ' mukeshthakor0112@gmail.com', '$2b$10$N5y79QqJqC5WbPpENRZUx.6SumBe1amiAXCB/x.uPTCetOOpKYUOC', 1, '9797979797', NULL, NULL, 'AB-', '2023-09-15', 2, 0);

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
(204, 'Jeetap', 3, 4, 4, b'0');

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
-- AUTO_INCREMENT for table `addtask_data`
--
ALTER TABLE `addtask_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `area_assign_user`
--
ALTER TABLE `area_assign_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=203;

--
-- AUTO_INCREMENT for table `bank_details`
--
ALTER TABLE `bank_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `branches_new`
--
ALTER TABLE `branches_new`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `branch_department_user`
--
ALTER TABLE `branch_department_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `category_field`
--
ALTER TABLE `category_field`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `configuration`
--
ALTER TABLE `configuration`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  MODIFY `document_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `document_details`
--
ALTER TABLE `document_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `employee_detail`
--
ALTER TABLE `employee_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `enquiries`
--
ALTER TABLE `enquiries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `enquiry_category`
--
ALTER TABLE `enquiry_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `enquiry_category_field`
--
ALTER TABLE `enquiry_category_field`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `enquiry_products`
--
ALTER TABLE `enquiry_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enquiry_sources`
--
ALTER TABLE `enquiry_sources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
-- AUTO_INCREMENT for table `lost_enquiries`
--
ALTER TABLE `lost_enquiries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `manufacturers`
--
ALTER TABLE `manufacturers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `manufactur_details`
--
ALTER TABLE `manufactur_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `modal`
--
ALTER TABLE `modal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `old_tractor_details`
--
ALTER TABLE `old_tractor_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `parts`
--
ALTER TABLE `parts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=205;

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
