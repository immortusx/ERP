-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 12, 2023 at 12:55 PM
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

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_dsp_list` (IN `id` INT)  SELECT s.id, s.first_name, s.last_name  FROM dealer_department_user as f inner join users as s on  s.id = f.user_id and s.is_active = 1 where dealer_id = id$$

DELIMITER ;

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
(83, 'kevel', 'deshmukh', '', '98327387', '', 1, 'Ahemdabad', 'Sanand', '33', 'Badarkha');

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
(5, 'farmer agencty', '73827488', 'farmer@gmail.com', 'main mandi bharuch', '320344', '2023-06-12 19:16:06'),
(6, 'kiran tractors', '9284847', 'kiran.tractors@gmail.com', 'satyamev complex , ahemdabad', '392001', '2023-06-12 19:16:06');

-- --------------------------------------------------------

--
-- Table structure for table `dealer_department_user`
--

CREATE TABLE `dealer_department_user` (
  `id` int(11) NOT NULL,
  `dealer_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `dealer_department_user`
--

INSERT INTO `dealer_department_user` (`id`, `dealer_id`, `department_id`, `user_id`) VALUES
(1, 1, 1, 60),
(2, 1, 1, 61),
(3, 1, 1, 62),
(4, 2, 1, 64),
(5, 3, 1, 65);

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
(3, 2, 1, 64, 83, 8, '2023-04-14 11:41:55', '2023-04-19 11:41:55', 29, '1');

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
(7, 7, '7.1', 'roles', 'Roles');

-- --------------------------------------------------------

--
-- Table structure for table `inquiry_category`
--

CREATE TABLE `inquiry_category` (
  `id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `inquiry_category`
--

INSERT INTO `inquiry_category` (`id`, `category_name`) VALUES
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
-- Table structure for table `inquiry_category_field`
--

CREATE TABLE `inquiry_category_field` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `field_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `inquiry_category_field`
--

INSERT INTO `inquiry_category_field` (`id`, `category_id`, `field_id`) VALUES
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
-- Table structure for table `inquiry_data`
--

CREATE TABLE `inquiry_data` (
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
-- Table structure for table `inquiry_fields`
--

CREATE TABLE `inquiry_fields` (
  `id` int(11) NOT NULL,
  `field` varchar(100) DEFAULT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `inquiry_fields`
--

INSERT INTO `inquiry_fields` (`id`, `field`, `name`) VALUES
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
(5, 'editor', '1', NULL),
(25, 'sales_a', '1', ''),
(27, 'newRole', '1', 'just shows edit-role and home profile');

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
(13, 5, 3),
(14, 5, 4),
(15, 5, 6),
(47, 1, 7),
(48, 2, 2),
(49, 2, 3),
(50, 2, 4),
(51, 2, 5),
(52, 2, 7),
(53, 2, 6),
(54, 2, 1),
(57, 4, 5),
(58, 4, 1),
(59, 4, 2),
(60, 3, 2),
(61, 3, 5),
(62, 3, 4),
(63, 27, 2),
(64, 27, 7),
(65, 27, 6),
(71, 25, 5),
(72, 25, 2);

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
(20, 'admin', 'admin', 'admin@123', '$2b$10$fotQWIMxEDM7NEQut5bYnun1rfpWQj9JJt/d/qZniQwCXsbtxBva2', 1, '7272727', '2023-04-12 14:52:22', '2023-04-12 12:24:04'),
(60, 'harshil', 'raval', 'harshil@123', '$2b$10$.2sfB9x23hOZffgcSXWKLO7f1I1oC.3x9/1ky0MJZgjWmu9Lzcnfm', 1, '11111', NULL, NULL),
(61, 'kartik', 'dave', 'kartik@gmail.com', '$2b$10$.2sfB9x23hOZffgcSXWKLO7f1I1oC.3x9/1ky0MJZgjWmu9Lzcnfm', 1, '39839', '2023-03-30 12:53:40', '2023-04-03 11:50:49'),
(62, 'karan', 'thakkar', 'karan@gmail.com', '$2b$10$.2sfB9x23hOZffgcSXWKLO7f1I1oC.3x9/1ky0MJZgjWmu9Lzcnfm', 1, '32938', NULL, '2023-03-30 12:51:30'),
(63, 'urvish', 'vaghela', 'urvish@gmail.com', '$2b$10$.2sfB9x23hOZffgcSXWKLO7f1I1oC.3x9/1ky0MJZgjWmu9Lzcnfm', 1, '34893823728', '2023-04-04 12:03:38', '2023-04-04 12:10:50'),
(64, 'kiran', 'shah', 'kiran@gmail.com', '$2b$10$.2sfB9x23hOZffgcSXWKLO7f1I1oC.3x9/1ky0MJZgjWmu9Lzcnfm', 1, '8888', '2023-04-11 17:23:32', '2023-04-12 07:34:16'),
(65, 'dev', 'patel', 'dev@gmail.com', '$2b$10$.2sfB9x23hOZffgcSXWKLO7f1I1oC.3x9/1ky0MJZgjWmu9Lzcnfm', 1, '98763525', NULL, NULL),
(66, 'mukesh', 'patel', 'mukesh@gmail.com', '$2b$10$PGtPS9UZL6hKYgOm9YQcy.BSDmUoJjH.Zb3mf81hR4FbKLiu6ZHge', 1, '938394982', NULL, '2023-04-12 06:32:51');

-- --------------------------------------------------------

--
-- Table structure for table `user_role`
--

CREATE TABLE `user_role` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_role`
--

INSERT INTO `user_role` (`id`, `user_id`, `role_id`) VALUES
(6, 20, 1),
(80, 60, 3),
(81, 61, 27),
(82, 62, 2),
(84, 63, 27),
(85, 63, 25),
(87, 65, 3),
(88, 64, 2),
(89, 66, 2);

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
  ADD KEY `user_id_idx` (`user_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name_UNIQUE` (`name`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`);

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
-- Indexes for table `inquiry_category`
--
ALTER TABLE `inquiry_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inquiry_category_field`
--
ALTER TABLE `inquiry_category_field`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id_idx` (`category_id`),
  ADD KEY `field_id_idx` (`field_id`);

--
-- Indexes for table `inquiry_data`
--
ALTER TABLE `inquiry_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inquiry_fields`
--
ALTER TABLE `inquiry_fields`
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
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_role`
--
ALTER TABLE `user_role`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_idx` (`user_id`),
  ADD KEY `role_id_idx` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `dealer_department_user`
--
ALTER TABLE `dealer_department_user`
  MODIFY `dealer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `enquiries`
--
ALTER TABLE `enquiries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `inquiry_category`
--
ALTER TABLE `inquiry_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `inquiry_category_field`
--
ALTER TABLE `inquiry_category_field`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `inquiry_data`
--
ALTER TABLE `inquiry_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inquiry_fields`
--
ALTER TABLE `inquiry_fields`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `user_role`
--
ALTER TABLE `user_role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

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
-- Constraints for table `enquiry_sources`
--
ALTER TABLE `enquiry_sources`
  ADD CONSTRAINT `primary_source_id` FOREIGN KEY (`primary_source_id`) REFERENCES `enquiry_primary_sources` (`id`);

--
-- Constraints for table `inquiry_category_field`
--
ALTER TABLE `inquiry_category_field`
  ADD CONSTRAINT `category_id` FOREIGN KEY (`category_id`) REFERENCES `inquiry_category` (`id`),
  ADD CONSTRAINT `field_id` FOREIGN KEY (`field_id`) REFERENCES `inquiry_fields` (`id`);

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
-- Constraints for table `user_role`
--
ALTER TABLE `user_role`
  ADD CONSTRAINT `role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
