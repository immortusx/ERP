-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: rbac_db
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone_number` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `is_active` tinyint NOT NULL DEFAULT '1',
  `district` varchar(45) DEFAULT NULL,
  `taluka` varchar(45) DEFAULT NULL,
  `block` varchar(45) DEFAULT NULL,
  `village` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dealer_department_user`
--

DROP TABLE IF EXISTS `dealer_department_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dealer_department_user` (
  `dealer_id` int NOT NULL AUTO_INCREMENT,
  `department_id` int NOT NULL,
  `user_id` int NOT NULL,
  KEY `dealer_id_idx` (`dealer_id`),
  KEY `department_id_idx` (`department_id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `mapping_dealer_id` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`id`),
  CONSTRAINT `mapping_department_id` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `mapping_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dealer_department_user`
--

LOCK TABLES `dealer_department_user` WRITE;
/*!40000 ALTER TABLE `dealer_department_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `dealer_department_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dealers`
--

DROP TABLE IF EXISTS `dealers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dealers` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `mobile_number` varchar(15) DEFAULT NULL,
  `email_id` varchar(45) DEFAULT NULL,
  `address` varchar(45) DEFAULT NULL,
  `code` varchar(10) DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dealers`
--

LOCK TABLES `dealers` WRITE;
/*!40000 ALTER TABLE `dealers` DISABLE KEYS */;
/*!40000 ALTER TABLE `dealers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enquiries`
--

DROP TABLE IF EXISTS `enquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enquiries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dealer_id` int NOT NULL,
  `enquiry_type_id` int NOT NULL,
  `salesperson_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `product_id` int NOT NULL,
  `date` datetime NOT NULL,
  `delivery_date` datetime DEFAULT NULL,
  `enquiry_source_id` int NOT NULL,
  `visitReason` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `customer_id_idx` (`customer_id`),
  KEY `dealer_id_idx` (`dealer_id`),
  KEY `product_id_idx` (`product_id`),
  KEY `salesperson_id_idx` (`salesperson_id`),
  KEY `enquiry_type_id_idx` (`enquiry_type_id`),
  KEY `enquiry_source_id_idx` (`enquiry_source_id`),
  CONSTRAINT `customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `dealer_id` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`id`),
  CONSTRAINT `enquiry_source_id` FOREIGN KEY (`enquiry_source_id`) REFERENCES `enquiry_sources` (`id`),
  CONSTRAINT `enquiry_type_id` FOREIGN KEY (`enquiry_type_id`) REFERENCES `enquiry_types` (`id`),
  CONSTRAINT `product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `salesperson_id` FOREIGN KEY (`salesperson_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enquiries`
--

LOCK TABLES `enquiries` WRITE;
/*!40000 ALTER TABLE `enquiries` DISABLE KEYS */;
/*!40000 ALTER TABLE `enquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enquiry_primary_sources`
--

DROP TABLE IF EXISTS `enquiry_primary_sources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enquiry_primary_sources` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enquiry_primary_sources`
--

LOCK TABLES `enquiry_primary_sources` WRITE;
/*!40000 ALTER TABLE `enquiry_primary_sources` DISABLE KEYS */;
/*!40000 ALTER TABLE `enquiry_primary_sources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enquiry_sources`
--

DROP TABLE IF EXISTS `enquiry_sources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enquiry_sources` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `primary_source_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `primary_source_id` (`primary_source_id`),
  CONSTRAINT `primary_source_id` FOREIGN KEY (`primary_source_id`) REFERENCES `enquiry_primary_sources` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enquiry_sources`
--

LOCK TABLES `enquiry_sources` WRITE;
/*!40000 ALTER TABLE `enquiry_sources` DISABLE KEYS */;
/*!40000 ALTER TABLE `enquiry_sources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enquiry_types`
--

DROP TABLE IF EXISTS `enquiry_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enquiry_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enquiry_types`
--

LOCK TABLES `enquiry_types` WRITE;
/*!40000 ALTER TABLE `enquiry_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `enquiry_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `features`
--

DROP TABLE IF EXISTS `features`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `features` (
  `id` int NOT NULL AUTO_INCREMENT,
  `page` int NOT NULL,
  `index_no` varchar(150) NOT NULL,
  `feature` varchar(150) NOT NULL,
  `label` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `features`
--

LOCK TABLES `features` WRITE;
/*!40000 ALTER TABLE `features` DISABLE KEYS */;
INSERT INTO `features` VALUES (1,1,'1.1','users','Users'),(2,2,'2.1','profile','Profile'),(3,3,'3.1','add-user','Add user'),(4,4,'4.1','edit-user','Edit user'),(5,5,'5.1','products','Products'),(6,6,'6.1','add-role','Add role'),(7,7,'7.1','roles','Roles');
/*!40000 ALTER TABLE `features` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inquiry_category`
--

DROP TABLE IF EXISTS `inquiry_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inquiry_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiry_category`
--

LOCK TABLES `inquiry_category` WRITE;
/*!40000 ALTER TABLE `inquiry_category` DISABLE KEYS */;
INSERT INTO `inquiry_category` VALUES (1,'NEW TRACTOR INQUIRY'),(2,'OLD TRACTOR INQUIRY'),(3,'NEW TRACTOR INQsUIRY'),(4,'jjjj'),(5,'sdcsd'),(6,'hiii'),(7,'newOne'),(8,'sdckjsd'),(9,'kjdcnsd'),(10,'kskdcn');
/*!40000 ALTER TABLE `inquiry_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inquiry_category_field`
--

DROP TABLE IF EXISTS `inquiry_category_field`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inquiry_category_field` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `field_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiry_category_field`
--

LOCK TABLES `inquiry_category_field` WRITE;
/*!40000 ALTER TABLE `inquiry_category_field` DISABLE KEYS */;
INSERT INTO `inquiry_category_field` VALUES (65,2,2),(66,2,3),(67,2,8),(68,2,11),(73,4,2),(74,4,3),(75,7,5),(76,7,3),(77,5,1),(78,1,4),(79,1,6),(80,1,8),(81,1,11),(82,1,1),(83,1,3),(84,1,2),(85,1,5),(86,1,7),(87,1,9),(88,1,10),(89,1,12),(90,1,13);
/*!40000 ALTER TABLE `inquiry_category_field` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inquiry_data`
--

DROP TABLE IF EXISTS `inquiry_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inquiry_data` (
  `id` int NOT NULL AUTO_INCREMENT,
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
  `companyName` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiry_data`
--

LOCK TABLES `inquiry_data` WRITE;
/*!40000 ALTER TABLE `inquiry_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `inquiry_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inquiry_fields`
--

DROP TABLE IF EXISTS `inquiry_fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inquiry_fields` (
  `id` int NOT NULL AUTO_INCREMENT,
  `field` varchar(100) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiry_fields`
--

LOCK TABLES `inquiry_fields` WRITE;
/*!40000 ALTER TABLE `inquiry_fields` DISABLE KEYS */;
INSERT INTO `inquiry_fields` VALUES (1,'firstName','First Name'),(2,'lastName','Last Name'),(3,'state','State'),(4,'city','City'),(5,'district','District'),(6,'taluko','Taluko'),(7,'village','Village'),(8,'mobileNumber','Mobile Number'),(9,'whatsappNumber','Whatsapp Number'),(10,'visitReason','Visit Reason'),(11,'sourceOfInquiry','Source Of Inquiry'),(12,'email','Email'),(13,'companyName','Company Name');
/*!40000 ALTER TABLE `inquiry_fields` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manufacturers`
--

DROP TABLE IF EXISTS `manufacturers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manufacturers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manufacturers`
--

LOCK TABLES `manufacturers` WRITE;
/*!40000 ALTER TABLE `manufacturers` DISABLE KEYS */;
/*!40000 ALTER TABLE `manufacturers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `manufacturer_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `manufacturer_id_idx` (`manufacturer_id`),
  CONSTRAINT `manufacturer_id` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_features`
--

DROP TABLE IF EXISTS `role_features`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_features` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `feature_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_features`
--

LOCK TABLES `role_features` WRITE;
/*!40000 ALTER TABLE `role_features` DISABLE KEYS */;
INSERT INTO `role_features` VALUES (1,1,1),(2,1,2),(3,1,3),(4,1,4),(5,1,5),(11,1,6),(13,5,3),(14,5,4),(15,5,6),(47,1,7),(48,2,2),(49,2,3),(50,2,4),(51,2,5),(52,2,7),(53,2,6),(54,2,1),(57,4,5),(58,4,1),(59,4,2),(60,3,2),(61,3,5),(62,3,4),(63,27,2),(64,27,7),(65,27,6),(66,25,5),(67,25,3),(68,25,2),(69,25,4),(70,25,6);
/*!40000 ALTER TABLE `role_features` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(100) NOT NULL,
  `active` varchar(45) NOT NULL DEFAULT '1',
  `description` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'super_admin','1',NULL),(2,'admin','1','admin hav right to add and view'),(3,'user','1','okay'),(4,'manager','1','managaer can show product and show users'),(5,'editor','1',NULL),(25,'sales_a','1',''),(27,'newRole','1','just shows edit-role and home profile');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `role_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (6,20,'1'),(80,60,'3'),(81,61,'27'),(82,62,'2'),(84,63,'27'),(85,63,'25'),(86,64,'25');
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `is_active` tinyint NOT NULL DEFAULT '1',
  `phone_number` varchar(100) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `current_login` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (20,'admin','admin','admin@123','$2b$10$fotQWIMxEDM7NEQut5bYnun1rfpWQj9JJt/d/qZniQwCXsbtxBva2',1,'7272727','2023-04-04 12:11:52','2023-04-08 16:26:11'),(60,'harshil','raval','harshil@123','$2b$10$8lq09K.q..pqCA5WmhHsuebScP20ouCcpMR5WhGkX5u3McwB9vwaG',1,'11111',NULL,NULL),(61,'newProfile','newProfile','newProfile','$2b$10$5g1zBntOhdejjBowcl3QNOCxkC7hD.iCPtvW7NRHvJ5nT1C2uzCZ2',1,'39839','2023-03-30 12:53:40','2023-04-03 11:50:49'),(62,'forAdmin','forAdmin','forAdmin','$2b$10$6i1JIEQZSlz35DXbe54WaOIM59OCozDrNwp7kRlG7TBa.gSERsLqK',1,'32938',NULL,'2023-03-30 12:51:30'),(63,'exampleNew','exampleNew','exampleNew','$2b$10$EKqyBh4efNwW876WIoc5cOC8m9zI4aNskWO0Y461LRvK9.XOhtnEG',1,'34893823728','2023-04-04 12:03:38','2023-04-04 12:10:50'),(64,'kkk','kkkk','kkk','$2b$10$UEaPxtSvsNMjXdcBt2ziQey.OhUXH/y6NfBLSqDw2LTYfamGAU4sC',1,'8888',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-04-08 17:36:37
