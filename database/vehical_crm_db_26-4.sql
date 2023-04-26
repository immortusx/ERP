-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 26, 2023 at 06:16 AM
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
CREATE DATABASE IF NOT EXISTS `vehical_crm_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `vehical_crm_db`;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

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
(66, 'Aniruddh', 'b', 'dave', '98373678', 'AniruddhDave@gmail.com', 1, 'vadodara', 'vadodara', '1', 'padra'),
(67, 'Virendrasinh', 'n', 'Jadeja', '823838338', 'Virendrasinh@gmail.com', 1, 'aravalli', 'meghraj', '2', NULL),
(68, '	Kantibhai ', 'k', 'Kharadi', '28839389', '	KantibhaiKharadi@gmail.com', 1, 'surat', 'surat', '1', NULL),
(69, 'Aniketbhai', 'p', 'Thakar', '928498289', 'Aniketbhai.Thakar@gmail.com', 1, 'navsari', 'navsari', '3', NULL),
(70, '	Praveen', 'k', 'patel', '937487488', '	Praveenbhai@gmail.com', 1, 'vadodara', 'padra', '4', 'dabhoi'),
(71, '	Dinesh ', 't', 'barot', '912738738', '	Dinesh2022@gmail.com', 1, 'ahemdabad', 'daskori', '3', NULL),
(83, 'kevel', 'deshmukh', '', '98327387', '', 1, 'Ahemdabad', 'Sanand', '33', 'Badarkha'),
(84, 'harshil', 'naresh bhai', 'raval', '9283839', 'harshil@123', 1, 'Ahemdabad', 'Dholka', '11', 'Ambada'),
(86, 'sunil', 'keshav', 'dutt', '38889298', 'sunil@123', 1, '1', '2', '11', '2'),
(87, 'kailash', 'kantibhai', 'dave', '923839', 'keshav@123', 1, '1', '2', '22', '2'),
(88, 'jjjj', 'jjjj', 'jjjj', '4932093', 'jjjj@123', 1, '1', '2', '11', '1');

-- --------------------------------------------------------

--
-- Table structure for table `dealers`
--

CREATE TABLE `dealers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `mobile_number` varchar(15) DEFAULT NULL,
  `email_id` varchar(45) DEFAULT NULL,
  `address` varchar(45) DEFAULT NULL,
  `code` varchar(10) DEFAULT NULL,
  `create_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `dealers`
--

INSERT INTO `dealers` (`id`, `name`, `mobile_number`, `email_id`, `address`, `code`, `create_date`) VALUES
(1, 'new keshav tractors', '93838', 'newKeshav@gmail.com', 'near krishna circle, vadodara ', '382430', '2023-04-08 19:16:06'),
(2, 'jay mata ji tractors', '232332', 'jaymataji@gmail.com', 'gotri vadodara', '312940', '2023-06-12 19:16:06'),
(3, 'prabhu tractors', '38328893', 'prabhu.tractors@gmail.com', NULL, '382000', '2023-06-12 19:16:06'),
(4, 'khodiyar auto agency', '92847688', 'jaykhodiyar@gmail.com', 'bhavnagar road amreli', '340302', '2023-06-12 19:16:06'),
(5, 'farmer agency', '73827488', 'farmer@gmail.com', 'main mandi bharuch', '320344', '2023-06-12 19:16:06'),
(6, 'kiran tractors', '9284847', 'kiran.tractors@gmail.com', 'satyamev complex , ahemdabad', '392001', '2023-06-12 19:16:06');

-- --------------------------------------------------------

--
-- Table structure for table `dealer_department_user`
--

CREATE TABLE `dealer_department_user` (
  `id` int(11) NOT NULL,
  `dealer_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `dealer_department_user`
--

INSERT INTO `dealer_department_user` (`id`, `dealer_id`, `department_id`, `user_id`, `role_id`) VALUES
(3, 1, 1, 62, 2),
(4, 2, 1, 64, 2),
(5, 3, 1, 65, 2),
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
(42, 2, 1, 66, 4),
(45, 2, 1, 60, 3),
(46, 6, 1, 75, 2),
(47, 2, 1, 71, 4),
(48, 5, 1, 71, 25),
(49, 5, 1, 71, 5),
(50, 6, 1, 71, 3),
(51, 6, 1, 71, 25),
(52, 2, 1, 74, 25);

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

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

CREATE TABLE `district` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `district`
--

INSERT INTO `district` (`id`, `name`) VALUES
(1, 'Ahemdabad'),
(2, 'Amreli'),
(3, 'Anand'),
(4, 'Banas'),
(5, 'Bharuch'),
(6, 'Bhavnagar'),
(7, 'Dohad'),
(8, 'Gandhinagar'),
(9, 'Jamnagar'),
(10, 'Junagadh'),
(11, 'Kachchh'),
(12, 'Kheda'),
(13, 'Mahesana'),
(14, 'Narmada'),
(15, 'Navsari'),
(16, 'Panch'),
(17, 'Patan'),
(18, 'Porbandar'),
(19, 'Rajkot'),
(20, 'Sabar'),
(21, 'Surat'),
(22, 'Surendranagar'),
(23, 'Tapi'),
(24, 'The'),
(25, 'Vadodara'),
(26, 'Valsad');

-- --------------------------------------------------------

--
-- Table structure for table `enquiries`
--

CREATE TABLE `enquiries` (
  `id` int(11) NOT NULL,
  `dealer_id` int(11) NOT NULL,
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

INSERT INTO `enquiries` (`id`, `dealer_id`, `enquiry_type_id`, `salesperson_id`, `customer_id`, `product_id`, `date`, `delivery_date`, `enquiry_source_id`, `visitReason`) VALUES
(3, 2, 1, 64, 83, 8, '2023-04-14 11:41:55', '2023-04-19 11:41:55', 29, '1'),
(4, 1, 1, 60, 84, 1, '2023-04-13 05:58:55', '2023-04-13 05:58:55', 26, '1'),
(5, 2, 1, 64, 86, 5, '2023-04-15 11:06:59', '2023-04-28 11:06:59', 32, '1'),
(6, 2, 1, 64, 87, 5, '2023-04-13 11:29:58', '2023-04-13 11:29:58', 29, '1'),
(7, 1, 1, 62, 88, 1, '2023-04-13 13:08:17', '2023-04-16 18:30:00', 25, '1');

-- --------------------------------------------------------

--
-- Table structure for table `enquiry_category`
--

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
(13, 'companyName', 'Company Name');

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
(12, 10, '10.1', 'manage', 'Manage');

-- --------------------------------------------------------

--
-- Table structure for table `manufacturers`
--

CREATE TABLE `manufacturers` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `manufacturers`
--

INSERT INTO `manufacturers` (`id`, `name`, `description`) VALUES
(1, 'Mahindra Gujrat', NULL),
(2, 'Sonalika ', NULL),
(3, 'Force Motors', NULL);

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
(1, 'Mahindra  Red 31-62 Mahindra gujarat Tractor', 1),
(2, 'Mahindra 265 DI, 30 hp Tractor, 1200 kg', 1),
(3, 'Mahindra Yuvo 275 DI, 35 hp Tractor, 1500 kg', 1),
(4, 'SONALIKA TIGER 75', 2),
(5, 'SONALIKA gt 20 Tractors', 2),
(6, 'Force BALWAN 450', 3),
(7, 'Force SANMAN 6000', 3),
(8, 'Force ABHUMAN ', 3);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

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
(5, 'editor', '1', 'null'),
(25, 'sales', '1', 'sales can show profile, products, and sales page');

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
(11, 1, 6),
(47, 1, 7),
(83, 25, 5),
(84, 25, 2),
(85, 25, 11),
(86, 5, 3),
(87, 5, 4),
(88, 5, 2),
(89, 5, 1),
(90, 5, 7),
(91, 5, 8),
(92, 4, 5),
(93, 4, 1),
(94, 4, 2),
(95, 4, 4),
(96, 4, 3),
(97, 4, 12),
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
(113, 3, 5);

-- --------------------------------------------------------

--
-- Table structure for table `taluka`
--

CREATE TABLE `taluka` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `district_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `taluka`
--

INSERT INTO `taluka` (`id`, `name`, `district_id`) VALUES
(1, 'Ahmadabad City', 1),
(2, 'Barwala', 1),
(3, 'Bavla', 1),
(4, 'Daskroi', 1),
(5, 'Detroj-Rampura', 1),
(6, 'Dhandhuka', 1),
(7, 'Dholka', 1),
(8, 'Mandal', 1),
(9, 'Ranpur', 1),
(10, 'Sanand', 1),
(11, 'Viramgam', 1);

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
  `current_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `is_active`, `phone_number`, `last_login`, `current_login`) VALUES
(20, 'admin', 'admin', 'admin@123', '$2b$10$fotQWIMxEDM7NEQut5bYnun1rfpWQj9JJt/d/qZniQwCXsbtxBva2', 1, '7272727', '2023-04-26 10:59:23', '2023-04-26 11:03:02'),
(60, 'harshil', 'dave', 'harshil@123', '$2b$10$.2sfB9x23hOZffgcSXWKLO7f1I1oC.3x9/1ky0MJZgjWmu9Lzcnfm', 1, '11111', '2023-04-13 18:19:29', '2023-04-21 15:23:53'),
(61, 'kartik', 'dave', 'kartik@gmail.com', '$2b$10$.2sfB9x23hOZffgcSXWKLO7f1I1oC.3x9/1ky0MJZgjWmu9Lzcnfm', 1, '39839', '2023-03-30 12:53:40', '2023-04-03 11:50:49'),
(62, 'karan', 'thakkar', 'karan@123', '$2b$10$5id0ZHa/MKD.cXLiEVomYe0V2ENY0zZRtv8cQ1lmXahpv9MH3Iu/.', 1, '32938', '2023-04-24 15:41:44', '2023-04-24 16:45:09'),
(63, 'urvish', 'vaghela', 'urvish@gmail.com', '$2b$10$.2sfB9x23hOZffgcSXWKLO7f1I1oC.3x9/1ky0MJZgjWmu9Lzcnfm', 1, '34893823728', '2023-04-04 12:03:38', '2023-04-04 12:10:50'),
(64, 'kiran', 'shah', 'kiran@gmail.com', '$2b$10$.2sfB9x23hOZffgcSXWKLO7f1I1oC.3x9/1ky0MJZgjWmu9Lzcnfm', 1, '8888', '2023-04-14 12:45:15', '2023-04-24 15:52:51'),
(65, 'dev', 'patel', 'dev@gmail.com', '$2b$10$.2sfB9x23hOZffgcSXWKLO7f1I1oC.3x9/1ky0MJZgjWmu9Lzcnfm', 1, '98763525', NULL, '2023-04-14 12:45:31'),
(66, 'mukesh', 'patel', 'mukesh@gmail.com', '$2b$10$PGtPS9UZL6hKYgOm9YQcy.BSDmUoJjH.Zb3mf81hR4FbKLiu6ZHge', 1, '938394982', '2023-04-13 17:50:51', '2023-04-13 18:20:22'),
(67, 'abhijit', 'shah', 'abhijit@123', '$2b$10$QmfmDPRjTSja1g86sqPHBuU0myvv/hh8zohn.hJaB2cGkt92uAJUi', 1, '98274748', NULL, NULL),
(68, 'abhimanyu', 'dave', 'abhimanyu@123', '$2b$10$.RqpItyOs/a7.ghGMvKqU.if60GEKsELHXUM.vMvClPsZX64In9CK', 1, '123', NULL, NULL),
(69, 'laxman', 'veer', 'laxman@123', '$2b$10$zx8snctd92SteS6v9GeSOugaw6PDxDPaGdCjGF8o0xT5Ckl85WL0W', 1, '938382', NULL, '2023-04-19 12:49:01'),
(70, 'kamlesh', 'bharwad', 'kamlesh@123', '$2b$10$KhPughqh9oJrWcZE4ORnXe4bZb2mIeanmEj.29aZwpXlmxpMLo05G', 1, '123', '2023-04-20 15:55:58', '2023-04-20 16:00:08'),
(71, 'bhavesh ', 'koli', 'bhavesh@123', '$2b$10$XM/sxdGRtswahsijFarltezF3P3Sxl2IpO1W06upRlAk7cYYuKumu', 1, '123', '2023-04-26 10:37:28', '2023-04-26 11:03:38'),
(72, 'kevel', 'ahe', 'kevel@123', '$2b$10$5id0ZHa/MKD.cXLiEVomYe0V2ENY0zZRtv8cQ1lmXahpv9MH3Iu/.', 1, '123', '2023-04-24 15:12:06', '2023-04-24 15:23:32'),
(73, 'raffu', 'manek', 'raffu@123', '$2b$10$7rA8j3rlaXvKw5BAQk6o3eQtegCvQBhZvcGfSYWZfh7g2xaM/I1/i', 1, '123', '2023-04-21 12:58:13', '2023-04-21 16:20:38'),
(74, 'shruuti', 'patel', 'shruti@123', '$2b$10$fP1qgqvaSEJo2ztdsFCreeziwQRSpAFQMctAbpz7URWWimcvJCbze', 1, '213232', '2023-04-21 15:32:54', '2023-04-21 15:36:10'),
(75, 'umesh', 'barot', 'umesh@123', '$2b$10$LQ1/Lc./OPW/pu8cGALmIuINMG7pYNuCCIkDSGo0e55/qGAm7lOoK', 1, '123', '2023-04-24 15:54:34', '2023-04-24 16:09:05');

-- --------------------------------------------------------

--
-- Table structure for table `village`
--

CREATE TABLE `village` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `taluka_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `village`
--

INSERT INTO `village` (`id`, `name`, `taluka_id`) VALUES
(1, 'Ankevaliya', 2),
(2, 'Barwala', 2),
(3, 'Bela', 2),
(4, 'Chachariya', 2),
(5, 'Chokdi', 2),
(6, 'Dhadhodar', 2),
(7, 'Hebatpur', 2),
(8, 'Jharvaliya', 2),
(9, 'Kapadiyali', 2),
(10, 'Khadsaliya', 2),
(11, 'Khambhada', 2),
(12, 'Khamidana', 2),
(13, 'Kundal', 2),
(14, 'Nabhoi', 2),
(15, 'Navda', 2),
(16, 'Pipariya', 2),
(17, 'Polarpur', 2),
(18, 'Rampura', 2),
(19, 'Ranpari', 2),
(20, 'Refda', 2),
(21, 'Rojid', 2),
(22, 'Salangpur', 2),
(23, 'Sangasar', 2),
(24, 'Shahpur', 2),
(25, 'Sodhi', 2),
(26, 'Timbla', 2),
(27, 'Vadhela', 2),
(28, 'Vahiya', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dealers`
--
ALTER TABLE `dealers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dealer_department_user`
--
ALTER TABLE `dealer_department_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dealer_id_idx` (`dealer_id`),
  ADD KEY `department_id_idx` (`department_id`),
  ADD KEY `user_id_idx` (`user_id`),
  ADD KEY `role_id` (`role_id`);

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
  ADD KEY `dealer_id_idx` (`dealer_id`),
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
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT for table `dealer_department_user`
--
ALTER TABLE `dealer_department_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `district`
--
ALTER TABLE `district`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `enquiries`
--
ALTER TABLE `enquiries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `manufacturers`
--
ALTER TABLE `manufacturers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `role_features`
--
ALTER TABLE `role_features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `taluka`
--
ALTER TABLE `taluka`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `village`
--
ALTER TABLE `village`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dealer_department_user`
--
ALTER TABLE `dealer_department_user`
  ADD CONSTRAINT `mapping_dealer_id` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`id`),
  ADD CONSTRAINT `mapping_department_id` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `mapping_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `enquiries`
--
ALTER TABLE `enquiries`
  ADD CONSTRAINT `customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `dealer_id` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`id`),
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
