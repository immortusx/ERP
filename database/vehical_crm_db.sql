-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 25, 2023 at 10:41 AM
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
-- Database: `vehical_crm_db`
--
DROP DATABASE IF EXISTS `vehical_crm_db`;
CREATE DATABASE IF NOT EXISTS `vehical_crm_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `vehical_crm_db`;

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `example`$$
CREATE DEFINER=`balkrush1`@`%` PROCEDURE `example` (IN `data` TEXT)  BEGIN 
SELECT JSON_EXTRACT(data, '$.firstname')as first_name, JSON_EXTRACT(data, '$.lastname') as last_name ,JSON_EXTRACT(data, '$.roles') as roles;



END$$

DROP PROCEDURE IF EXISTS `sp_get_branch_list`$$
CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_branch_list` (IN `branchId` INT(11), IN `isAdmin` BOOLEAN)  BEGIN
IF (isAdmin = true) THEN
	SELECT * from branches;
ELSE
	SELECT * from branches where id = branchId;
END IF;

END$$

DROP PROCEDURE IF EXISTS `sp_get_dsp_list`$$
CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_dsp_list` (IN `branchId` INT, IN `userId` INT)  BEGIN
SELECT distinct  s.id, s.first_name, s.last_name  FROM branch_department_user as f inner join users as s on  s.id = f.user_id and s.is_active = 1 where branch_id = branchId and user_id not in (20,userId);
END$$

DROP PROCEDURE IF EXISTS `sp_get_enquiries_list`$$
CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_enquiries_list` (IN `branchId` INT, IN `isAdmin` BOOLEAN)  BEGIN
IF (isAdmin = TRUE) then
	select s.first_name , s.last_name, s.phone_number, s.email ,(select name from products where id = product_id) as product ,concat(fo.first_name ,' ', fo.last_name) as sales_person ,f.date,f.delivery_date,(select name from district where id = s.district) as district ,(select name from taluka where id = s.taluka) as taluka ,(select name from village where id = s.village) as village ,(select name from enquiry_sources where id = f.enquiry_source_id)as enquiry_source from enquiries as f inner join customers as s on s.id = f.customer_id  inner join branches as t on f.branch_id = t.id inner join users as fo on fo.id = f.salesperson_id;
ELSE 
	select s.first_name , s.last_name, s.phone_number, s.email ,(select name from products where id = product_id) as product ,concat(fo.first_name ,' ', fo.last_name) as sales_person ,f.date,f.delivery_date,(select name from district where id = s.district) as district ,(select name from taluka where id = s.taluka) as taluka ,(select name from village where id = s.village) as village ,(select name from enquiry_sources where id = f.enquiry_source_id)as enquiry_source from enquiries as f inner join customers as s on s.id = f.customer_id  inner join branches as t on f.branch_id = t.id inner join users as fo on fo.id = f.salesperson_id where f.branch_id = branchId;
END IF;
END$$

DROP PROCEDURE IF EXISTS `sp_get_role_list`$$
CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_role_list` ()  BEGIN
	SELECT * from roles where id != 1 and active = 1;
END$$

DROP PROCEDURE IF EXISTS `sp_get_user_list`$$
CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_get_user_list` (IN `userId` INT(11), IN `branchId` INT(11), IN `isAdmin` BOOLEAN)  BEGIN
IF (isAdmin = TRUE) then
	SELECT distinct f.id, f.first_name, f.last_name, f.email, f.is_active, f.phone_number  FROM users as f  where f.id not in(userId);
ELSE
    SELECT distinct f.id, f.first_name, f.last_name, f.email, f.is_active, f.phone_number  FROM users as f inner join branch_department_user as s on s.user_id = f.id  inner join branches as t on s.branch_id = t.id where s.branch_id = branchId and f.id not in((select user_id from branch_department_user where role_id  =1 limit 1), userId);
END IF;	
END$$

DROP PROCEDURE IF EXISTS `sp_profile_data`$$
CREATE DEFINER=`balkrush1`@`%` PROCEDURE `sp_profile_data` (IN `branchId` INT(11), IN `userId` INT(11), IN `isAdmin` BOOLEAN)  BEGIN 
IF (isAdmin = FALSE) THEN
	SELECT distinct email, first_name, last_name, last_login ,CONCAT('[', GROUP_CONCAT(
    distinct CONCAT(
      '{ "page": ', t.page, ', "index_no": "', t.index_no, '", "feature": "', t.feature, '", "label": "', label, '"}'
    ) 
  ), ']') AS features
  FROM branch_department_user as f inner join role_features as s on s.role_id = f.role_id inner join features as t on s.feature_id = t.id  inner join users as fo on fo.id = f.user_id where f.user_id  = userId  and f.branch_id = branchId;
ELSE
    SELECT distinct email, first_name, last_name, last_login ,(select distinct CONCAT('[', GROUP_CONCAT(
    distinct CONCAT(
      '{ "page": ', page, ', "index_no": "', index_no, '", "feature": "', feature, '", "label": "', label, '"}'
    )
  ), ']') from features) AS features
  FROM users where id  = 20;
  end IF;
END$$

DROP PROCEDURE IF EXISTS `sp_user_details_branches_roles`$$
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

DROP PROCEDURE IF EXISTS `user_details_branches_roles`$$
CREATE DEFINER=`balkrush1`@`%` PROCEDURE `user_details_branches_roles` (IN `userId` INT(11))  BEGIN

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
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
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
  `village` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `name`, `mobile_number`, `email_id`, `address`, `code`, `create_date`, `gst_number`, `description`, `is_active`, `contact_person`, `state`, `district`, `taluka`, `village`) VALUES
(1, 'new keshav tractors', '93838', 'newKeshav@gmail.com', 'near krishna circle, vadodara ', '382430', '2023-04-08 19:16:06', '3jb23diu', 'contract based', 1, 'shailesh', 1, 1, 2, 12),
(2, 'jay mata ji tractors', '232332', 'jaymataji@gmail.com', 'gotri ,vadodara', '312940', '2023-06-12 19:16:06', '23d23', 'contract based', 1, 'shailesh', 1, 1, 2, 1),
(3, 'prabhu tractors', '38328893', 'prabhu.tractors@gmail.com', 'new tajpur', '382000', '2023-06-12 19:16:06', 'd23ddscccc', 'part dealer', 1, 'chirag bhai', 1, 1, 2, 7),
(4, 'khodiyar auto agency', '92847688', 'jaykhodiyar@gmail.com', 'bhavnagar road amreli', '340302', '2023-06-12 19:16:06', 'd23d', '', 1, NULL, 1, 1, 2, 1),
(5, 'farmer agency', '73827488', 'farmer@gmail.com', 'main mandi bharuch', '320344', '2023-06-12 19:16:06', '23d23d', '', 1, NULL, 1, 1, 2, 1),
(6, 'kiran tractors', '9284847', 'kiran.tractors@gmail.com', 'satyamev complex , ahemdabad', '392001', '2023-06-12 19:16:06', '2d32', 'dealing', 1, 'tejas kumar', 1, 1, 2, 7),
(7, 'FARMER FIRST', '9392383', 'farmerfirst@123', 'new devi circle , raigadh, surat', '294828', '2023-05-23 18:11:35', 'jksdn23jnsdc', 'for getting agency', 1, 'rohan bhai', 1, 1, 2, 16);

-- --------------------------------------------------------

--
-- Table structure for table `branch_department_user`
--

DROP TABLE IF EXISTS `branch_department_user`;
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
(3, 1, 1, 62, 2),
(11, 5, 1, 68, 2),
(12, 5, 1, 68, 25),
(13, 5, 1, 68, 5),
(19, 1, 1, 20, 1),
(20, 3, 1, 69, 2),
(21, 3, 1, 69, 4),
(22, 1, 1, 61, 2),
(23, 6, 1, 61, 3),
(26, 2, 1, 70, 4),
(27, 5, 1, 70, 25),
(34, 3, 1, 73, 3),
(35, 5, 1, 73, 4),
(36, 4, 1, 72, 3),
(37, 5, 1, 72, 4),
(39, 2, 1, 63, 3),
(41, 3, 1, 67, 5),
(45, 2, 1, 60, 3),
(47, 2, 1, 71, 4),
(48, 5, 1, 71, 25),
(49, 5, 1, 71, 5),
(50, 6, 1, 71, 3),
(51, 6, 1, 71, 25),
(52, 2, 1, 74, 25),
(56, 3, 1, 76, 25),
(57, 4, 1, 76, 2),
(61, 1, 1, 66, 2),
(62, 5, 1, 66, 4),
(63, 1, 1, 77, 5),
(64, 1, 1, 77, 25),
(65, 1, 1, 77, 2),
(66, 1, 1, 78, 2),
(72, 2, 1, 75, 2),
(73, 6, 1, 75, 2),
(74, 4, 1, 80, 3),
(75, 1, 1, 81, 1),
(76, 1, 1, 82, 1),
(77, 1, 1, 83, 1),
(78, 1, 1, 84, 1),
(79, 1, 1, 87, 1),
(80, 2, 1, 79, 2),
(81, 2, 1, 79, 4),
(82, 2, 1, 79, 25),
(83, 5, 1, 79, 25),
(85, 5, 1, 88, 2),
(86, 5, 1, 64, 4),
(87, 7, 1, 64, 4),
(88, 3, 1, 65, 2);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone_number` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `district` varchar(45) DEFAULT NULL,
  `taluka` varchar(45) DEFAULT NULL,
  `block` varchar(45) DEFAULT NULL,
  `village` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `first_name`, `middle_name`, `last_name`, `phone_number`, `email`, `is_active`, `district`, `taluka`, `block`, `village`) VALUES
(66, 'Aniruddh', 'b', 'dave', '98373678', 'AniruddhDave@gmail.com', 1, '1', '2', '11', '2'),
(67, 'Virendrasinh', 'n', 'Jadeja', '823838338', 'Virendrasinh@gmail.com', 1, '1', '2', '11', '2'),
(68, '	Kantibhai ', 'k', 'Kharadi', '28839389', '	KantibhaiKharadi@gmail.com', 1, '1', '2', '11', '2'),
(69, 'Aniketbhai', 'p', 'Thakar', '928498289', 'Aniketbhai.Thakar@gmail.com', 1, '1', '2', '11', '2'),
(70, '	Praveen', 'k', 'patel', '937487488', '	Praveenbhai@gmail.com', 1, '1', '2', '11', '2'),
(71, '	Dinesh ', 't', 'barot', '912738738', '	Dinesh2022@gmail.com', 1, '1', '2', '11', '2'),
(83, 'kevel', 'deshmukh', '', '98327387', '', 1, '1', '2', '11', '2'),
(84, 'harshil', 'naresh bhai', 'raval', '9283839', 'harshil@123', 1, '1', '2', '11', '2'),
(86, 'sunil', 'keshav', 'dutt', '38889298', 'sunil@123', 1, '1', '2', '11', '2'),
(87, 'kailash', 'kantibhai', 'dave', '923839', 'keshav@123', 1, '1', '2', '11', '2'),
(88, 'jjjj', 'jjjj', 'jjjj', '4932093', 'jjjj@123', 1, '1', '2', '11', '2'),
(89, 'mukesh', 'g', 'm', '1234567890', 'm@a.com', 1, '1', '2', '11', '2'),
(90, 'mukesh', 'g', 'm', '1234567890', 'm@a.com', 1, '1', '2', '11', '3'),
(91, 'dinesh', 'm', 'rajput', '9378478', 'dinesh@12', 1, '1', '2', '11', '2'),
(92, 'dinesh', 'm', 'rajput', '9378478', 'dinesh@12', 1, '1', '2', '11', '2'),
(93, 'dinesh', 'm', 'rajput', '9378478', 'dinesh@12', 1, '1', '2', '11', '2'),
(94, 'keyur', 'k', 'parmar', '83839', 'keyur@123', 1, '1', '2', '22', '11'),
(95, 'keyur', 'k', 'parmar', '83839', 'keyur@123', 1, '1', '2', '22', '11'),
(96, 'keyur', 'k', 'parmar', '83839', 'keyur@123', 1, '1', '2', '22', '11'),
(97, 'laukesh', 'm', 'koli', '939389', 'moli@123', 1, '1', '2', '11', '1'),
(98, 'mehul', 'j', 'aarya', '233', 'meul@123', 1, '1', '2', '11', '12'),
(100, 'susil', 'punit bhai', 'makwana', '932839', 'susil@123', 1, '1', '2', '11', '1'),
(101, 'lalo', 'k', 'desai', '99228', 'lalo@123', 1, '1', '2', '11', '1'),
(102, 'rakesh', 'k', 'lal', '94383832', 'rakesh@123', 1, '1', '2', '22', '7'),
(103, 'vishal', 'tawde bhau', 'gawde', '942723', 'vishal@123', 1, '1', '2', '11', '1');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `description`) VALUES
(1, 'sales', 'all sales person are here'),
(2, 'manager', ''),
(3, 'finance', NULL),
(4, 'operations', NULL),
(5, 'marketing', NULL),
(6, 'service', NULL),
(7, 'administration', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `district`;
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
(1, 'Ahemdabad', 1, b'1'),
(2, 'Amrelifffff', 4, b'0'),
(3, 'Anand', 1, b'1'),
(4, 'Banas', 1, b'0'),
(5, 'Bharuch', 1, b'1'),
(6, 'Bhavnagar', 1, b'1'),
(7, 'Dohad', 1, b'1'),
(8, 'Gandhinagar', 1, b'1'),
(9, 'Jamnagar', 1, b'1'),
(10, 'Junagadhy', 5, b'1'),
(11, 'Kachchh', 1, b'1'),
(12, 'Kheda', 1, b'1'),
(13, 'Mahesana', 1, b'1'),
(14, 'Narmada', 1, b'1'),
(15, 'Navsari', 1, b'1'),
(16, 'Panch', 1, b'1'),
(17, 'Patan', 1, b'1'),
(18, 'Porbandar', 1, b'1'),
(19, 'Rajkot', 1, b'1'),
(20, 'Sabar', 1, b'1'),
(21, 'Surat', 1, b'1'),
(22, 'Surendranagar', 1, b'1'),
(23, 'Tapi', 1, b'1'),
(24, 'The', 1, b'1'),
(25, 'Vadodara', 1, b'1'),
(26, 'Valsad', 1, b'1'),
(33, 'Amreli37', 1, b'1'),
(34, 'Kutiaana', 3, b'1'),
(35, 'Baaaaa', 6, b'0'),
(36, 'RRRRRRR', 4, b'1'),
(37, 'Nandurbar', 2, b'1');

-- --------------------------------------------------------

--
-- Table structure for table `enquiries`
--

DROP TABLE IF EXISTS `enquiries`;
CREATE TABLE `enquiries` (
  `id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `enquiry_type_id` int(11) NOT NULL,
  `salesperson_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `delivery_date` datetime DEFAULT NULL,
  `enquiry_source_id` int(11) NOT NULL,
  `visitReason` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `enquiries`
--

INSERT INTO `enquiries` (`id`, `branch_id`, `enquiry_type_id`, `salesperson_id`, `customer_id`, `product_id`, `date`, `delivery_date`, `enquiry_source_id`, `visitReason`) VALUES
(3, 2, 1, 64, 83, 8, '2023-04-14 11:41:55', '2023-04-19 11:41:55', 29, '1'),
(4, 1, 1, 60, 84, 1, '2023-04-13 05:58:55', '2023-04-13 05:58:55', 26, '1'),
(5, 2, 1, 64, 86, 5, '2023-04-15 11:06:59', '2023-04-28 11:06:59', 32, '1'),
(6, 2, 1, 64, 87, 5, '2023-04-13 11:29:58', '2023-04-13 11:29:58', 29, '1'),
(7, 1, 1, 62, 88, 1, '2023-04-13 13:08:17', '2023-04-16 18:30:00', 25, '1'),
(8, 1, 1, 77, 93, 2, '2023-05-20 05:37:05', '2023-05-16 18:30:00', 25, '1'),
(9, 1, 1, 62, 97, 3, '2023-05-02 06:02:54', '2023-05-02 06:02:54', 29, '1'),
(10, 1, 1, 61, 98, 3, '2023-05-11 06:06:10', '2023-05-27 06:06:10', 29, '1'),
(11, 5, 1, 68, 100, 5, '2023-05-03 07:24:31', '2023-08-25 07:24:31', 27, '1'),
(12, 6, 1, 61, 101, 1, '2023-04-05 09:00:23', '2023-05-07 09:00:23', 25, '1'),
(13, 2, 1, 70, 102, 5, '2023-05-09 12:50:07', '2023-05-09 12:50:07', 27, '1'),
(14, 5, 1, 73, 103, 1, '2023-05-23 09:24:22', '2023-05-23 09:24:22', 25, '1');

-- --------------------------------------------------------

--
-- Table structure for table `enquiry_category`
--

DROP TABLE IF EXISTS `enquiry_category`;
CREATE TABLE `enquiry_category` (
  `id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `enquiry_category`
--

INSERT INTO `enquiry_category` (`id`, `category_name`) VALUES
(1, 'NEW TRACTOR INQUIRY'),
(2, 'OLD TRACTOR INQUIRY'),
(3, 'NEW TRACTOR INQsUIRY'),
(4, 'jjjj'),
(5, 'sdcsd'),
(6, 'hiii'),
(7, 'newOne'),
(8, 'sdckjsd'),
(9, 'kjdcnsd'),
(10, 'kskdcn');

-- --------------------------------------------------------

--
-- Table structure for table `enquiry_category_field`
--

DROP TABLE IF EXISTS `enquiry_category_field`;
CREATE TABLE `enquiry_category_field` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `field_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `enquiry_category_field`
--

INSERT INTO `enquiry_category_field` (`id`, `category_id`, `field_id`) VALUES
(65, 2, 2),
(66, 2, 3),
(67, 2, 8),
(68, 2, 11),
(73, 4, 2),
(74, 4, 3),
(75, 7, 5),
(76, 7, 3),
(77, 5, 1),
(78, 1, 4),
(79, 1, 6),
(80, 1, 8),
(81, 1, 11),
(82, 1, 1),
(83, 1, 3),
(84, 1, 2),
(85, 1, 5),
(86, 1, 7),
(87, 1, 9),
(88, 1, 10),
(89, 1, 12),
(90, 1, 13);

-- --------------------------------------------------------

--
-- Table structure for table `enquiry_data`
--

DROP TABLE IF EXISTS `enquiry_data`;
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

DROP TABLE IF EXISTS `enquiry_fields`;
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
(13, 'companyName', 'Company Name');

-- --------------------------------------------------------

--
-- Table structure for table `enquiry_primary_sources`
--

DROP TABLE IF EXISTS `enquiry_primary_sources`;
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
-- Table structure for table `enquiry_sources`
--

DROP TABLE IF EXISTS `enquiry_sources`;
CREATE TABLE `enquiry_sources` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `primary_source_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `enquiry_sources`
--

INSERT INTO `enquiry_sources` (`id`, `name`, `primary_source_id`) VALUES
(25, 'Web advertisement', 1),
(26, 'App recommandation', 1),
(27, 'Calling inquiry', 2),
(28, 'Newspaper', 3),
(29, 'News advertisement', 3),
(30, 'Work shop visit', 4),
(31, 'Show room visit', 4),
(32, 'Reference', 5);

-- --------------------------------------------------------

--
-- Table structure for table `enquiry_types`
--

DROP TABLE IF EXISTS `enquiry_types`;
CREATE TABLE `enquiry_types` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `enquiry_types`
--

INSERT INTO `enquiry_types` (`id`, `name`) VALUES
(1, 'new tractors'),
(2, 'old tractors');

-- --------------------------------------------------------

--
-- Table structure for table `features`
--

DROP TABLE IF EXISTS `features`;
CREATE TABLE `features` (
  `id` int(11) NOT NULL,
  `page` int(11) NOT NULL,
  `index_no` varchar(150) NOT NULL,
  `feature` varchar(150) NOT NULL,
  `label` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `features`
--

INSERT INTO `features` (`id`, `page`, `index_no`, `feature`, `label`) VALUES
(1, 1, '1.1', 'users', 'Users'),
(2, 2, '2.1', 'profile', 'Profile'),
(3, 3, '3.1', 'add-user', 'Add user'),
(4, 4, '4.1', 'edit-user', 'Edit user'),
(5, 5, '5.1', 'products', 'Products'),
(6, 6, '6.1', 'add-role', 'Add role'),
(7, 7, '7.1', 'roles', 'Roles'),
(8, 8, '8.1', 'agency', 'Agency'),
(11, 9, '9.1', 'sales', 'Sales'),
(12, 10, '10.1', 'manage', 'Manage'),
(13, 11, '11.1', 'branch', 'Branch');

-- --------------------------------------------------------

--
-- Table structure for table `manufacturers`
--

DROP TABLE IF EXISTS `manufacturers`;
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
(1, 'Mahindra Gujrat', NULL, 1),
(2, 'Sonalika ', NULL, 1),
(3, 'Force Motors', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `parts`
--

DROP TABLE IF EXISTS `parts`;
CREATE TABLE `parts` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `part_no` varchar(100) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `hsn_no` varchar(100) DEFAULT NULL,
  `is_active` varchar(45) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `parts`
--

INSERT INTO `parts` (`id`, `name`, `part_no`, `description`, `hsn_no`, `is_active`) VALUES
(1, 'Timing belt', 'FD23456', 'timing bell/chain effective', '7654', '0'),
(2, 'Brake Pad', 'BP001', 'High-quality brake pad for improved braking performance', '870830', '0'),
(3, 'Fuel Pump', 'AS2345', 'high capacity fuel pump with smartfilter', '4567', '0'),
(4, 'Clutch Brake', 'SA0034', 'high qoaulity', '234569', '1'),
(5, 'Wheel Bearing', 'DF34567', 'very smooth and flexible', '234567', '1'),
(6, 'Exhaust System', 'WD87654', 'Smart Exhasut system with 0 percent emission', '0015311', '1'),
(7, 'Battery', 'QA96709', 'High efficiency battery with stand by mode 172Hr', '876543', '0'),
(8, 'Cooling System', 'CS02400', 'high quality cooling system', '345678', '1');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `manufacturer_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `manufacturer_id`) VALUES
(1, 'Mahindra  Red 31-62 Mahindra gujarat Tractor', 1),
(2, 'Mahindra 265 DI, 30 hp Tractor, 1200 kg', 1),
(3, 'Mahindra Yuvo 275 DI, 35 hp Tractor, 1500 kg', 1),
(4, 'SONALIKA TIGER 75', 2),
(5, 'SONALIKA gt 20 Tractors', 2),
(6, 'Force BALWAN 450', 3),
(7, 'Force SANMAN 6000', 3),
(8, 'Force ABHIMAN ', 3);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `role` varchar(100) NOT NULL,
  `active` varchar(45) NOT NULL DEFAULT '1',
  `description` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role`, `active`, `description`) VALUES
(1, 'super_admin', '1', NULL),
(2, 'admin', '1', 'admin hav right to add and view'),
(3, 'user', '1', 'okay'),
(4, 'manager', '1', 'managaer can show product and show users'),
(5, 'editor', '1', 'roles with editor can modify the details'),
(25, 'sales', '1', 'sales can show profile, products, and sales page'),
(28, 'service_er', '1', 'they can edit.');

-- --------------------------------------------------------

--
-- Table structure for table `role_features`
--

DROP TABLE IF EXISTS `role_features`;
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
(11, 1, 6),
(47, 1, 7),
(83, 25, 5),
(84, 25, 2),
(85, 25, 11),
(101, 2, 2),
(102, 2, 3),
(103, 2, 4),
(104, 2, 5),
(105, 2, 7),
(106, 2, 6),
(107, 2, 1),
(108, 2, 8),
(109, 2, 11),
(110, 2, 12),
(111, 3, 2),
(112, 3, 1),
(113, 3, 5),
(114, 4, 5),
(115, 4, 2),
(116, 4, 12),
(120, 28, 4),
(121, 28, 12),
(122, 28, 2),
(129, 5, 3),
(130, 5, 4),
(131, 5, 2),
(132, 5, 1),
(133, 5, 7),
(134, 5, 8);

-- --------------------------------------------------------

--
-- Table structure for table `state`
--

DROP TABLE IF EXISTS `state`;
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
(1, 'GUJRAT', 'SURENDHRNAGAR', b'1'),
(2, 'Maharashtra', 'Maharashtra is a state in the western peninsular region of India occupying a substantial portion of the', b'1'),
(3, 'Punjab_bt', 'Punjab, a state bordering Pakistan, is the heart of India Sikh community.qwreytuy', b'0'),
(4, 'Rajasthan', 'Rajasthan is a state in northern India. It covers 342,239 square kilometres', b'1'),
(5, 'Kerala', 'Kerala, a state on India tropical Malabar Coast, has nearly 600km of Arabian Sea shoreline.', b'1'),
(6, 'Andhra Pradesh', 'Andhra Pradesh is a state in the southern coastal region of India.', b'0');

-- --------------------------------------------------------

--
-- Table structure for table `taluka`
--

DROP TABLE IF EXISTS `taluka`;
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
(1, 'Ahmadabad City', 1, 1, b'0'),
(2, 'Barwala', 1, 1, b'1'),
(3, 'Bavla12', 37, 2, b'0'),
(4, 'Daskroi', 1, 1, b'1'),
(5, 'Detroj-Rampura', 1, 1, b'1'),
(6, 'Dhandhuka', 1, 1, b'1'),
(7, 'Dholka', 1, 1, b'1'),
(8, 'Mandal', 1, 1, b'1'),
(9, 'Ranpur', 1, 1, b'1'),
(10, 'Sanand', 1, 1, b'1'),
(11, 'Viramgam', 1, 1, b'1'),
(12, 'Shihor', 6, 1, b'1'),
(13, 'Qqqqqq', 1, 1, b'1'),
(14, 'Cochin123', 7, 1, b'0');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `phone_number` varchar(100) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `current_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `is_active`, `phone_number`, `last_login`, `current_login`) VALUES
(20, 'admin', 'admin', 'admin@123', '$2b$10$fotQWIMxEDM7NEQut5bYnun1rfpWQj9JJt/d/qZniQwCXsbtxBva2', 1, '7272727', '2023-05-25 10:33:10', '2023-05-25 16:03:49'),
(60, 'harshil', 'dave', 'harshil@123', '$2b$10$.2sfB9x23hOZffgcSXWKLO7f1I1oC.3x9/1ky0MJZgjWmu9Lzcnfm', 1, '11111', '2023-04-13 18:19:29', '2023-04-21 15:23:53'),
(61, 'kartik', 'dave', 'kartik@gmail.com', '$2b$10$.2sfB9x23hOZffgcSXWKLO7f1I1oC.3x9/1ky0MJZgjWmu9Lzcnfm', 1, '39839', '2023-03-30 12:53:40', '2023-04-03 11:50:49'),
(62, 'karan', 'thakkar', 'karan@123', '$2b$10$5id0ZHa/MKD.cXLiEVomYe0V2ENY0zZRtv8cQ1lmXahpv9MH3Iu/.', 1, '32938', '2023-05-01 05:25:22', '2023-05-02 04:44:28'),
(63, 'urvish', 'vaghela', 'urvish@gmail.com', '$2b$10$.2sfB9x23hOZffgcSXWKLO7f1I1oC.3x9/1ky0MJZgjWmu9Lzcnfm', 1, '34893823728', '2023-04-04 12:03:38', '2023-04-04 12:10:50'),
(64, 'kiran', 'dave', 'kiran@gmail.com', '$2b$10$.2sfB9x23hOZffgcSXWKLO7f1I1oC.3x9/1ky0MJZgjWmu9Lzcnfm', 1, '8888', '2023-04-14 12:45:15', '2023-04-24 15:52:51'),
(65, 'dev', 'patel', 'dev@gmail.com', '$2b$10$iFzMzXxSQv0b1JkEynNCYOnbzZI0P8d0OelXh1K.4WqIH973u44lG', 1, '98763525', '2023-05-02 04:44:43', '2023-05-24 18:45:34'),
(66, 'mukesh', 'patel', 'mukesh@gmail.com', '$2b$10$PGtPS9UZL6hKYgOm9YQcy.BSDmUoJjH.Zb3mf81hR4FbKLiu6ZHge', 1, '938394982', '2023-05-17 10:02:05', '2023-05-18 13:18:12'),
(67, 'abhijit', 'shah', 'abhijit@123', '$2b$10$QmfmDPRjTSja1g86sqPHBuU0myvv/hh8zohn.hJaB2cGkt92uAJUi', 1, '98274748', NULL, NULL),
(68, 'abhimanyu', 'dave', 'abhimanyu@123', '$2b$10$.RqpItyOs/a7.ghGMvKqU.if60GEKsELHXUM.vMvClPsZX64In9CK', 1, '123', NULL, NULL),
(69, 'laxman', 'veer', 'laxman@123', '$2b$10$zx8snctd92SteS6v9GeSOugaw6PDxDPaGdCjGF8o0xT5Ckl85WL0W', 1, '938382', NULL, '2023-04-19 12:49:01'),
(70, 'kamlesh', 'bharwad', 'kamlesh@123', '$2b$10$KhPughqh9oJrWcZE4ORnXe4bZb2mIeanmEj.29aZwpXlmxpMLo05G', 1, '123', '2023-04-20 15:55:58', '2023-04-20 16:00:08'),
(71, 'bhavesh ', 'koli', 'bhavesh@123', '$2b$10$XM/sxdGRtswahsijFarltezF3P3Sxl2IpO1W06upRlAk7cYYuKumu', 1, '123', '2023-05-24 18:07:49', '2023-05-25 10:31:49'),
(72, 'kevel', 'ahe', 'kevel@123', '$2b$10$5id0ZHa/MKD.cXLiEVomYe0V2ENY0zZRtv8cQ1lmXahpv9MH3Iu/.', 1, '123', '2023-05-02 17:51:03', '2023-05-08 07:27:17'),
(73, 'raffu', 'manek', 'raffu@123', '$2b$10$7rA8j3rlaXvKw5BAQk6o3eQtegCvQBhZvcGfSYWZfh7g2xaM/I1/i', 1, '123', '2023-04-21 12:58:13', '2023-04-21 16:20:38'),
(74, 'shruuti', 'patel', 'shruti@123', '$2b$10$fP1qgqvaSEJo2ztdsFCreeziwQRSpAFQMctAbpz7URWWimcvJCbze', 1, '213232', '2023-04-28 17:41:53', '2023-04-28 13:39:13'),
(75, 'umesh', 'barot', 'umesh@123', '$2b$10$LQ1/Lc./OPW/pu8cGALmIuINMG7pYNuCCIkDSGo0e55/qGAm7lOoK', 1, '1233223', '2023-04-28 16:57:51', '2023-04-28 17:42:12'),
(76, 'tirth', 'vyas', 'tirth@123', '$2b$10$KpDFOyvLW7Ye8j7wT6OsUO3S8CEI81/TF5aYaC3EkoaCa3O8QP1/q', 1, '123', '2023-05-02 04:45:25', '2023-05-02 04:46:28'),
(77, 'yogesh', 'p', 'y@a.com', '$2b$10$oxEI2JIbTzsdRSEUA.k8Ae3bWHEumpDEnmWxUHS3kRRzFFpDahVQK', 1, '1234567890', NULL, NULL),
(78, 'laxmi', 'chaudhri', 'laxmi@123', '$2b$10$.wELREJc3zc2OcHCwsRfPeMYoCduHd3ObPJMUoUQM3xJSsx6Fd34O', 1, '2398', '2023-05-04 06:23:35', '2023-05-04 12:43:56'),
(79, 'ravi', 'desai', 'ravi@123', '$2b$10$rWoO3RQZ3YRVaqh7YfZgVeLDluC00bI74Uun.dy.slGRfrpHB.Uj.', 1, '98274781111', '2023-05-25 09:46:09', '2023-05-25 15:44:32'),
(80, 'Ankita', 'Patel', 'abc@gmail.com', '$2b$10$rMgI6h7EdFVGl4aLnRsrfeVJ1RBO8FvQp5Mh5djVFRMszu3YvZDty', 1, '3245478809867', NULL, NULL),
(81, 'dfdffds', 'dsdssd', 'admin@123', '$2b$10$IUNz3t.0HAA2RdxNkOGe7.qx0vPqahMp6EoS7x3YC.cQekvhygXT.', 1, '9767401107', NULL, NULL),
(82, 'dfdffds', 'dsdssd', 'admin@123', '$2b$10$94JC4tTH5uCZZNT8RYxhj.d0xEYXtXsIoe7aISipQPSTG2rS68i9q', 1, '9767401107', NULL, NULL),
(83, 'dfdffds', 'trtyrt', 'admin@123', '$2b$10$yF09Rxw9FomM9CLcJu5.oOxt59Ahp3WBEzSv7U0cOh9J8sRY1OoUa', 1, '9767832915', NULL, NULL),
(84, 'dfdf', 'xsds', 'admin@123', '$2b$10$IZBIcY1G18iTRu4VclLAG./lcr75DELmSiDdkLiFYBiyWl.Rf5xAK', 1, '6789543218', NULL, NULL),
(85, 'xbcnxbcnxb', 'mncnxvn', 'admin@123', '$2b$10$qlHMvMZ9CUMyrowAp0FNd.ZOWJPNJz5GHoGT2ahG/tqrvH9oFCsq2', 1, '4567328192', NULL, NULL),
(86, 'ncxm', 'nmbxcb', 'admin@123', '$2b$10$tkf3hRTjU0S8vT0AKbFNZeUz8avtduc2TCxh9QCILDH3U/BuQgN8a', 1, '2345678912', NULL, NULL),
(87, 'laxmi', 'patile', 'admin@123', '$2b$10$cn84UnUJNqBt6YbMZmi7j.Due.fd1394bDVDy7PN3FleGIAj9YeRq', 1, '2345678901', NULL, NULL),
(88, 'neha', 'suthar', 'neha@123', '$2b$10$L.5IuSlz.T5iXy1SpNp/FOu1Ky0t7OX50k6zyYnZqFlQM2/P9xpFu', 1, '93888888', NULL, '2023-05-23 15:45:24');

-- --------------------------------------------------------

--
-- Table structure for table `village`
--

DROP TABLE IF EXISTS `village`;
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
(1, 'Ankevaliya', 2, 0, 0, b'1'),
(2, 'Barwala', 2, 0, 0, b'1'),
(3, 'Bela', 2, 0, 0, b'1'),
(4, 'Chachariya', 2, 0, 0, b'1'),
(5, 'Chokdi', 2, 0, 0, b'1'),
(6, 'Dhadhodar', 2, 0, 0, b'1'),
(7, 'Hebatpur', 2, 0, 0, b'1'),
(8, 'Jharvaliya', 2, 0, 0, b'1'),
(9, 'Kapadiyali', 2, 0, 0, b'1'),
(10, 'Khadsaliya', 2, 0, 0, b'1'),
(11, 'Khambhada', 2, 0, 0, b'1'),
(12, 'Khamidana', 2, 0, 0, b'1'),
(13, 'Kundal', 2, 0, 0, b'1'),
(14, 'Nabhoi', 2, 0, 0, b'1'),
(15, 'Navda', 2, 0, 0, b'1'),
(16, 'Pipariya', 2, 0, 0, b'1'),
(17, 'Polarpur', 2, 0, 0, b'1'),
(18, 'Rampura', 2, 0, 0, b'1'),
(19, 'Ranpari', 2, 0, 0, b'1'),
(20, 'Refda', 2, 0, 0, b'1'),
(21, 'Rojid', 2, 0, 0, b'1'),
(22, 'Salangpur', 2, 0, 0, b'1'),
(23, 'Sangasar', 2, 0, 0, b'1'),
(24, 'Shahpur', 2, 0, 0, b'1'),
(25, 'Sodhi', 2, 0, 0, b'1'),
(26, 'Timbla', 2, 0, 0, b'1'),
(27, 'Vadhela', 2, 0, 0, b'1'),
(28, 'Vahiya', 2, 0, 0, b'1'),
(29, 'Sssssssss', 12, 6, 1, b'1'),
(30, 'Ssssssss', 12, 6, 1, b'1'),
(31, 'Siiiiii', 12, 6, 1, b'1'),
(32, 'Ddddddddddddddddddddddddddd', 12, 6, 1, b'1'),
(33, 'Xxxxx', 2, 1, 1, b'1'),
(34, 'VillageOfBarwalattttddddd', 4, 1, 1, b'0');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
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
-- Indexes for table `district`
--
ALTER TABLE `district`
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
-- Indexes for table `enquiry_primary_sources`
--
ALTER TABLE `enquiry_primary_sources`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enquiry_sources`
--
ALTER TABLE `enquiry_sources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `primary_source_id` (`primary_source_id`);

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
-- Indexes for table `manufacturers`
--
ALTER TABLE `manufacturers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name_UNIQUE` (`name`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`);

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
-- Indexes for table `users`
--
ALTER TABLE `users`
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
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `branch_department_user`
--
ALTER TABLE `branch_department_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `district`
--
ALTER TABLE `district`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `enquiries`
--
ALTER TABLE `enquiries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `enquiry_category`
--
ALTER TABLE `enquiry_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `enquiry_category_field`
--
ALTER TABLE `enquiry_category_field`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `enquiry_data`
--
ALTER TABLE `enquiry_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `enquiry_fields`
--
ALTER TABLE `enquiry_fields`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `enquiry_primary_sources`
--
ALTER TABLE `enquiry_primary_sources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `enquiry_sources`
--
ALTER TABLE `enquiry_sources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `enquiry_types`
--
ALTER TABLE `enquiry_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `features`
--
ALTER TABLE `features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `manufacturers`
--
ALTER TABLE `manufacturers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `parts`
--
ALTER TABLE `parts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `role_features`
--
ALTER TABLE `role_features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=135;

--
-- AUTO_INCREMENT for table `state`
--
ALTER TABLE `state`
  MODIFY `state_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `taluka`
--
ALTER TABLE `taluka`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT for table `village`
--
ALTER TABLE `village`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

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
  ADD CONSTRAINT `enquiry_source_id` FOREIGN KEY (`enquiry_source_id`) REFERENCES `enquiry_sources` (`id`),
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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
