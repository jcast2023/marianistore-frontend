-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--

-- ------------------------------------------------------
-- Server version	8.4.4

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
-- Table structure for table `carrito`
--

DROP TABLE IF EXISTS `carrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito` (
  `id_carrito` int NOT NULL AUTO_INCREMENT,
  `estado` varchar(255) DEFAULT NULL,
  `fecha_creacion` datetime(6) DEFAULT NULL,
  `id_usuario` int NOT NULL,
  PRIMARY KEY (`id_carrito`),
  KEY `FKkg5h8ejijsgwfr68aoggh4l8m` (`id_usuario`),
  CONSTRAINT `FKkg5h8ejijsgwfr68aoggh4l8m` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito`
--

LOCK TABLES `carrito` WRITE;
/*!40000 ALTER TABLE `carrito` DISABLE KEYS */;
INSERT INTO `carrito` VALUES (1,'ACTIVO','2025-10-21 19:00:00.000000',2),(2,'ACTIVO','2025-10-21 19:00:00.000000',4),(4,'ACTIVO','2025-10-21 19:00:00.000000',6);
/*!40000 ALTER TABLE `carrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Laptops'),(2,'Celulares'),(3,'Accesorios'),(7,'Monitores');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `direcciones`
--

DROP TABLE IF EXISTS `direcciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `direcciones` (
  `id_direccion` int NOT NULL AUTO_INCREMENT,
  `calle` varchar(255) NOT NULL,
  `ciudad` varchar(255) NOT NULL,
  `codigo_postal` varchar(255) NOT NULL,
  `estado` varchar(255) NOT NULL,
  `pais` varchar(255) NOT NULL,
  `id_usuario` int NOT NULL,
  PRIMARY KEY (`id_direccion`),
  KEY `FKk9knhuryk5fsqnn5blyo4f57` (`id_usuario`),
  CONSTRAINT `FKk9knhuryk5fsqnn5blyo4f57` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direcciones`
--

LOCK TABLES `direcciones` WRITE;
/*!40000 ALTER TABLE `direcciones` DISABLE KEYS */;
INSERT INTO `direcciones` VALUES (1,'Calle Principal 123','Medellín','050001','Antioquia','Colombia',2),(2,'Av. Paseo de la Reforma 350','Ciudad de México','06500','CDMX','México',4),(3,'Calle Florida 1025','Buenos Aires','C1005AAJ','Buenos Aires','Argentina',5),(4,'Av. Arequipa 2400','Lima','15046','Lima Metropolitana','Perú',5),(6,'Av. Puno 1415','Puno','12046','Puno','Perú',7),(7,'Av. Ancash 5415','Ancash','89046','Ancash','Perú',8);
/*!40000 ALTER TABLE `direcciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items_carrito`
--

DROP TABLE IF EXISTS `items_carrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items_carrito` (
  `id_item` int NOT NULL AUTO_INCREMENT,
  `cantidad` int DEFAULT NULL,
  `id_carrito` int NOT NULL,
  `id_producto` int NOT NULL,
  PRIMARY KEY (`id_item`),
  KEY `FKi46y5s5tjx8vfdn8p78e2e7s9` (`id_carrito`),
  KEY `FKohh8pmo6fyfy0jonnx5a3efp1` (`id_producto`),
  CONSTRAINT `FKi46y5s5tjx8vfdn8p78e2e7s9` FOREIGN KEY (`id_carrito`) REFERENCES `carrito` (`id_carrito`) ON DELETE CASCADE,
  CONSTRAINT `FKohh8pmo6fyfy0jonnx5a3efp1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items_carrito`
--

LOCK TABLES `items_carrito` WRITE;
/*!40000 ALTER TABLE `items_carrito` DISABLE KEYS */;
INSERT INTO `items_carrito` VALUES (1,10,1,2),(2,4,2,1),(4,2,1,4);
/*!40000 ALTER TABLE `items_carrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items_pedido`
--

DROP TABLE IF EXISTS `items_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items_pedido` (
  `id_item_pedido` int NOT NULL AUTO_INCREMENT,
  `cantidad` int DEFAULT NULL,
  `precio_unitario` double NOT NULL,
  `id_pedido` int NOT NULL,
  `id_producto` int NOT NULL,
  PRIMARY KEY (`id_item_pedido`),
  KEY `FKnjusrcisyppjrenkhvx9oqv6i` (`id_pedido`),
  KEY `FKbh95ags3r0c293bawbpnk53x7` (`id_producto`),
  CONSTRAINT `FKbh95ags3r0c293bawbpnk53x7` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `FKnjusrcisyppjrenkhvx9oqv6i` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=159 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items_pedido`
--

LOCK TABLES `items_pedido` WRITE;
/*!40000 ALTER TABLE `items_pedido` DISABLE KEYS */;
INSERT INTO `items_pedido` VALUES (1,3,120.5,2,2),(2,3,5899.9,4,1),(4,10,239,7,4),(5,5,119.9,7,2),(6,1,239,8,4),(7,1,119.9,8,2),(8,1,119.9,9,2),(9,1,119.9,10,2),(10,1,5899.9,11,1),(11,1,119.9,12,2),(12,1,1399.5,12,3),(13,1,119.9,13,2),(14,1,1399.5,13,3),(15,1,5899.9,13,1),(16,1,239,13,4),(17,2,5899.9,14,1),(18,1,5899.9,15,1),(19,1,239,15,4),(20,1,119.9,16,2),(21,1,5899.9,17,1),(22,1,119.9,17,2),(23,1,1399.5,17,3),(24,1,239,17,4),(25,1,5899.9,18,1),(26,1,119.9,19,2),(27,1,1399.5,20,3),(28,1,119.9,20,2),(29,1,119.9,21,2),(30,1,1399.5,22,3),(31,1,239,23,4),(32,1,119.9,24,2),(33,1,239,25,4),(34,1,5899.9,26,1),(35,1,5899.9,27,1),(36,1,119.9,28,2),(37,1,239,29,4),(38,1,5899.9,30,1),(39,1,119.9,30,2),(40,1,1399.5,30,3),(41,1,239,30,4),(42,1,1399.5,31,3),(43,1,5899.9,32,1),(44,1,119.9,33,2),(45,1,119.9,34,2),(46,1,119.9,35,2),(47,1,119.9,36,2),(48,1,5899.9,37,1),(49,1,119.9,38,2),(50,1,1399.5,38,3),(51,1,239,39,4),(52,1,119.9,40,2),(53,1,239,40,4),(54,1,119.9,41,2),(55,1,1399.5,41,3),(56,1,5899.9,41,1),(57,1,239,41,4),(58,1,5899.9,42,1),(59,1,239,43,4),(60,1,119.9,44,2),(61,1,5899.9,45,1),(62,1,119.9,46,2),(63,1,5899.9,47,1),(64,1,119.9,48,2),(65,1,5899.9,49,1),(66,1,1399.5,50,3),(67,1,5899.9,51,1),(68,1,5899.9,52,1),(69,1,119.9,53,2),(70,1,119.9,54,2),(71,1,119.9,55,2),(72,1,119.9,56,2),(73,3,119.9,57,2),(74,1,119.9,58,2),(75,1,5899.9,59,1),(76,1,5899.9,60,1),(77,1,119.9,60,2),(78,1,1399.5,60,3),(79,1,239,60,4),(80,2,119.9,61,2),(81,1,1399.5,62,3),(82,1,5899.9,63,1),(83,3,119.9,64,2),(84,5,119.9,65,2),(85,2,119.9,66,2),(86,2,239,67,4),(87,3,5899.9,68,1),(88,3,239,69,4),(89,1,5899.9,70,1),(90,3,1399.5,71,3),(91,2,5899.9,72,1),(92,1,5899.9,73,1),(93,1,119.9,74,2),(94,2,1399.5,75,3),(95,2,5899.9,76,1),(96,1,119.9,76,2),(97,2,119.9,77,2),(98,5,5899.9,78,1),(99,1,1399.5,79,3),(100,1,119.9,80,2),(101,1,239,81,4),(102,1,119.9,82,2),(103,1,1399.5,83,3),(104,2,5899.9,84,1),(105,2,119.9,85,2),(106,1,5899.9,86,1),(107,4,119.9,87,2),(108,2,119.9,88,2),(109,2,119.9,89,2),(110,2,5899.9,90,1),(111,1,119.9,91,2),(112,3,119.9,92,2),(113,5,239,93,4),(114,2,5899.9,94,1),(115,1,5899.9,95,1),(116,1,5899.9,96,1),(117,2,119.9,97,2),(118,1,1399.5,98,3),(119,1,1399.5,99,3),(120,3,150,100,13),(121,1,1200,101,12),(122,1,1200,102,12),(123,1,1399.5,103,3),(124,1,5899.9,104,1),(125,2,5899.9,105,1),(126,3,1200,106,12),(127,2,119.9,107,2),(128,1,1399.5,107,3),(129,1,1399.5,108,3),(130,1,1200,108,12),(131,2,1200,109,12),(132,1,119.9,110,2),(133,2,1200,111,12),(134,1,5899.9,112,1),(135,1,239,113,4),(136,1,239,114,4),(137,1,5899.9,115,1),(138,1,999,116,23),(139,1,219,117,24),(140,2,119.9,118,2),(141,2,219,119,24),(142,3,119.9,119,2),(143,4,3799,119,29),(144,1,119.9,120,2),(145,1,1399.5,121,3),(146,1,119.9,122,2),(147,1,3799,123,29),(148,2,119.9,124,2),(149,50,5899.9,125,1),(150,6,5899.9,126,1),(151,2,119.9,127,2),(152,2,5899.9,127,1),(153,2,1399.5,127,3),(154,1,3799,128,29),(155,1,999,129,23),(156,2,219,130,24),(157,1,599,131,22),(158,2,5899.9,132,1);
/*!40000 ALTER TABLE `items_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newsletter`
--

DROP TABLE IF EXISTS `newsletter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `newsletter` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newsletter`
--

LOCK TABLES `newsletter` WRITE;
/*!40000 ALTER TABLE `newsletter` DISABLE KEYS */;
INSERT INTO `newsletter` VALUES (1,'jul_ed@hotmail.com','2026-01-16 21:11:18'),(2,'jorge@cibertec.com','2026-01-16 21:12:11'),(3,'nancy@gmail.com','2026-01-16 22:01:49'),(4,'julio.castillo.ita@gmail.com','2026-01-17 03:53:49'),(5,'juliedcita@gmail.com','2026-01-17 04:22:34'),(6,'carl@gmail.com','2026-01-18 04:50:15'),(7,'arturo@techshop.com','2026-01-18 10:09:35'),(10,'lili@cibertec.com','2026-01-19 10:04:57'),(11,'ricardo@techshop.com','2026-01-19 20:42:40'),(12,'raul@cibertec.com','2026-01-24 07:04:53');
/*!40000 ALTER TABLE `newsletter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id_pedido` int NOT NULL AUTO_INCREMENT,
  `estado` varchar(255) NOT NULL,
  `fecha_pedido` datetime(6) DEFAULT NULL,
  `total` double NOT NULL,
  `id_usuario` int NOT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `FK4a0lfwlpmytywxpwjfa1a3ar2` (`id_usuario`),
  CONSTRAINT `FK4a0lfwlpmytywxpwjfa1a3ar2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (2,'ENVIADO','2025-10-21 19:00:00.000000',400,2),(4,'ENVIADO','2025-10-21 19:00:00.000000',250.9,4),(5,'ENTREGADO','2025-10-21 19:00:00.000000',120.5,6),(7,'ENVIADO','2025-10-21 19:00:00.000000',20.5,8),(8,'PENDIENTE_PAGO','2026-01-05 13:29:51.552000',358.9,8),(9,'ENVIADO','2026-01-05 14:20:23.956000',119.9,8),(10,'PENDIENTE_PAGO','2026-01-05 19:48:03.402000',119.9,8),(11,'PENDIENTE_PAGO','2026-01-05 19:49:59.179000',5899.9,8),(12,'PENDIENTE_PAGO','2026-01-05 20:06:56.633000',1519.4,8),(13,'PENDIENTE_PAGO','2026-01-05 20:08:02.516000',7658.299999999999,8),(14,'ENVIADO','2026-01-05 20:21:45.176000',11799.8,8),(15,'ENVIADO','2026-01-06 10:59:19.953000',6138.9,7),(16,'ENVIADO','2026-01-06 11:47:20.910000',119.9,7),(17,'ENVIADO','2026-01-06 12:11:35.940000',7658.299999999999,7),(18,'PAGADO','2026-01-06 12:36:29.931000',5899.9,9),(19,'PAGADO','2026-01-06 12:39:10.751000',119.9,7),(20,'PAGADO','2026-01-06 12:59:54.710000',1519.4,7),(21,'ENVIADO','2026-01-06 14:45:35.288000',119.9,7),(22,'ENVIADO','2026-01-06 15:16:44.512000',1399.5,7),(23,'PAGADO','2026-01-06 15:25:01.898000',239,9),(24,'PAGADO','2026-01-06 15:32:29.936000',119.9,9),(25,'PAGADO','2026-01-06 15:34:16.715000',239,9),(26,'PAGADO','2026-01-06 15:56:00.084000',5899.9,9),(27,'PAGADO','2026-01-06 16:05:40.358000',5899.9,9),(28,'PAGADO','2026-01-06 16:22:16.023000',119.9,9),(29,'PAGADO','2026-01-06 16:34:31.782000',239,9),(30,'PAGADO','2026-01-06 16:35:34.418000',7658.299999999999,9),(31,'PAGADO','2026-01-06 19:41:41.749000',1399.5,7),(32,'PAGADO','2026-01-06 22:20:49.919000',5899.9,7),(33,'PAGADO','2026-01-06 22:31:50.646000',119.9,7),(34,'PAGADO','2026-01-07 18:15:02.949000',119.9,7),(35,'PAGADO','2026-01-07 18:16:13.828000',119.9,7),(36,'PAGADO','2026-01-07 18:20:56.507000',119.9,8),(37,'PAGADO','2026-01-07 19:07:57.365000',5899.9,7),(38,'PAGADO','2026-01-07 19:11:53.910000',1519.4,7),(39,'PAGADO','2026-01-07 19:56:09.129000',239,7),(40,'PENDIENTE_PAGO','2026-01-07 19:57:22.310000',358.9,7),(41,'PAGADO','2026-01-07 19:58:06.799000',7658.299999999999,7),(42,'PENDIENTE_PAGO','2026-01-07 21:23:09.472000',5899.9,7),(43,'PENDIENTE_PAGO','2026-01-07 21:23:58.939000',239,7),(44,'PENDIENTE_PAGO','2026-01-07 21:24:27.867000',119.9,7),(45,'PENDIENTE_PAGO','2026-01-07 21:34:01.482000',5899.9,7),(46,'PENDIENTE_PAGO','2026-01-07 21:34:52.419000',119.9,7),(47,'PAGADO','2026-01-07 21:42:57.053000',5899.9,7),(48,'PAGADO','2026-01-07 21:43:51.386000',119.9,7),(49,'PAGADO','2026-01-07 21:44:38.114000',5899.9,8),(50,'PAGADO','2026-01-08 15:16:43.218000',1399.5,7),(51,'PAGADO','2026-01-08 15:19:32.232000',5899.9,8),(52,'PAGADO','2026-01-08 15:28:39.783000',5899.9,8),(53,'PAGADO','2026-01-08 15:30:24.174000',119.9,8),(54,'PAGADO','2026-01-08 15:43:56.856000',119.9,8),(55,'PAGADO','2026-01-08 15:45:44.992000',119.9,7),(56,'PAGADO','2026-01-08 20:23:30.102000',119.9,7),(57,'PAGADO','2026-01-08 20:24:08.445000',359.70000000000005,7),(58,'PENDIENTE','2026-01-09 18:39:50.200000',119.9,7),(59,'PENDIENTE','2026-01-09 18:40:57.266000',5899.9,7),(60,'PAGADO','2026-01-09 19:10:17.477000',7658.299999999999,7),(61,'PAGADO','2026-01-09 19:11:12.794000',239.8,7),(62,'PAGADO','2026-01-09 19:12:58.226000',1399.5,8),(63,'PAGADO','2026-01-09 19:18:01.434000',5899.9,8),(64,'PAGADO','2026-01-10 11:48:37.024000',359.70000000000005,8),(65,'PAGADO','2026-01-10 13:19:16.234000',599.5,8),(66,'ENVIADO','2026-01-10 18:53:19.567000',239.8,7),(67,'PAGADO','2026-01-10 21:05:58.364000',478,8),(68,'PAGADO','2026-01-10 21:07:18.680000',17699.699999999997,7),(69,'ENVIADO','2026-01-11 18:08:57.116000',717,7),(70,'ENVIADO','2026-01-11 18:16:29.913000',5899.9,8),(71,'ENVIADO','2026-01-11 19:34:30.643000',4198.5,8),(72,'PAGADO','2026-01-11 20:36:42.473000',11799.8,8),(73,'PAGADO','2026-01-11 20:41:51.498000',5899.9,7),(74,'PAGADO','2026-01-12 12:44:17.790000',119.9,8),(75,'PAGADO','2026-01-12 15:49:29.812000',2799,7),(76,'PAGADO','2026-01-12 15:54:50.557000',11919.699999999999,7),(77,'ENVIADO','2026-01-12 19:50:18.326000',239.8,13),(78,'ENVIADO','2026-01-12 20:01:09.944000',29499.5,14),(79,'ENVIADO','2026-01-12 20:11:47.396000',1399.5,13),(80,'PAGADO','2026-01-12 20:13:50.205000',119.9,8),(81,'PAGADO','2026-01-12 20:16:11.780000',239,14),(82,'ENVIADO','2026-01-13 12:20:30.908000',119.9,13),(83,'ENVIADO','2026-01-13 12:23:42.080000',1399.5,8),(84,'ENVIADO','2026-01-13 12:26:55.519000',11799.8,15),(85,'ENVIADO','2026-01-14 11:39:38.763000',239.8,16),(86,'ENVIADO','2026-01-14 14:56:34.187000',5899.9,17),(87,'ENVIADO','2026-01-14 22:41:57.382000',479.6,16),(88,'ENVIADO','2026-01-15 17:20:09.037000',239.8,8),(89,'PAGADO','2026-01-15 17:39:01.559000',239.8,18),(90,'ENVIADO','2026-01-15 19:23:20.371000',11799.8,18),(91,'ENVIADO','2026-01-15 19:24:00.195000',119.9,18),(92,'ENVIADO','2026-01-15 22:12:27.527000',359.70000000000005,19),(93,'ENVIADO','2026-01-15 22:23:45.987000',1195,20),(94,'ENVIADO','2026-01-16 17:35:17.941000',11799.8,20),(95,'PAGADO','2026-01-16 17:38:10.862000',5899.9,8),(96,'PAGADO','2026-01-16 17:38:46.670000',5899.9,8),(97,'PAGADO','2026-01-16 23:04:51.841000',239.8,20),(98,'PENDIENTE','2026-01-16 23:07:11.476000',1399.5,20),(99,'PAGADO','2026-01-16 23:09:51.739000',1399.5,20),(100,'PAGADO','2026-01-16 23:13:55.442000',450,20),(101,'PAGADO','2026-01-16 23:15:28.820000',1200,20),(102,'PAGADO','2026-01-16 23:17:58.613000',1200,20),(103,'PAGADO','2026-01-16 23:20:48.177000',1399.5,20),(104,'PAGADO','2026-01-17 00:06:41.189000',5899.9,20),(105,'ENVIADO','2026-01-17 00:11:01.705000',11799.8,20),(106,'PAGADO','2026-01-17 00:21:52.062000',3600,8),(107,'ENVIADO','2026-01-17 00:37:53.638000',1639.3,8),(108,'ENVIADO','2026-01-17 23:34:52.625000',2599.5,24),(109,'ENVIADO','2026-01-17 23:51:23.771000',2400,26),(110,'ENVIADO','2026-01-18 00:04:35.453000',119.9,26),(111,'ENVIADO','2026-01-18 04:53:33.754000',2400,14),(112,'ENVIADO','2026-01-18 04:54:28.916000',5899.9,14),(113,'ENVIADO','2026-01-18 04:55:28.004000',239,14),(114,'PENDIENTE','2026-01-18 05:17:13.770000',239,14),(115,'ENVIADO','2026-01-19 00:20:47.462000',5899.9,13),(116,'ENVIADO','2026-01-19 04:59:32.267000',999,13),(117,'ENVIADO','2026-01-19 05:00:11.503000',219,13),(118,'ENVIADO','2026-01-19 15:44:21.385000',239.8,13),(119,'ENVIADO','2026-01-19 23:06:49.919000',15993.7,13),(120,'PAGADO','2026-01-19 23:57:36.190000',119.9,8),(121,'PAGADO','2026-01-20 00:09:31.482000',1399.5,8),(122,'ENVIADO','2026-01-20 00:35:08.619000',119.9,8),(123,'ENVIADO','2026-01-20 00:38:37.556000',3799,13),(124,'PAGADO','2026-01-20 00:50:10.083000',239.8,8),(125,'PAGADO','2026-01-20 00:55:40.389000',294995,8),(126,'ENVIADO','2026-01-20 00:59:18.941000',35399.399999999994,8),(127,'ENVIADO','2026-01-20 16:27:26.671000',14838.599999999999,13),(128,'ENVIADO','2026-01-20 16:32:05.498000',3799,8),(129,'ENVIADO','2026-01-24 01:57:52.704000',999,13),(130,'ENVIADO','2026-01-24 01:59:16.585000',438,13),(131,'ENVIADO','2026-01-24 03:22:30.877000',599,13),(132,'ENVIADO','2026-01-24 04:52:53.486000',11799.8,20);
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) NOT NULL,
  `fecha_creacion` datetime(6) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `precio` double NOT NULL,
  `stock` int NOT NULL,
  `id_categoria` int DEFAULT NULL,
  PRIMARY KEY (`id_producto`),
  KEY `FKdtoa37luoxhhvbicrfiu5ygbj` (`id_categoria`),
  CONSTRAINT `FKdtoa37luoxhhvbicrfiu5ygbj` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  CONSTRAINT `chk_stock_no_negativo` CHECK ((`stock` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Laptop con procesador Ryzen 7, 16GB RAM, SSD 1TB y GPU RTX 4060.',NULL,'laptop-asus-tuf.jpg','Laptop Gamer ASUS TUF',5899.9,48,1),(2,'Mouse inalámbrico silencioso con tecnología Bluetooth y 2.4 GHz, batería de larga duración.',NULL,'mouse-logitech-m590.jpg','Mouse Logitech M590 Silent',119.9,41,3),(3,'Monitor curvo QHD 144Hz con pantalla VA, ideal para gaming y diseño gráfico.',NULL,'monitor-samsung-g5.jpg','Monitor Samsung Odyssey G5 27”',1399.5,23,7),(4,'Teclado mecánico compacto con switches rojos y retroiluminación RGB personalizable.',NULL,'teclado-redragon-k552.jpg','Teclado Redragon Kumara K552 RGB',239,27,3),(12,'Chip A17 Pro, cámara de 48MP y acabado en titanio',NULL,'iPhone-15-Pro-Max.jpg','iPhone 15 Pro Max',1200,40,2),(13,'Cancelación de ruido líder en la industria y 30 horas de batería',NULL,'Audífonos-Sony-WH-1000XM5.jpg','Audífonos Sony WH-1000XM5',150,47,3),(22,'Galaxy A16 128GB Black',NULL,'Galaxy-A16.jpg','Galaxy A16',599,49,2),(23,'Fusión 8GB + 256GB',NULL,'Moto-Edge-60.jpg','Moto Edge 60',999,48,2),(24,'IPS 100 Hz VGA HDMI Negro C22X3F',NULL,'monitores1.jpg','Monitor Oficina Caixun 22\" FHD',219,45,7),(25,'23.8 IPS 120HZ 1MS HDMI PARLANTE FHD',NULL,'monitores2.jpg','Monitor Teros 24\" TE-2415S',273,50,7),(26,'1 Tb Ssd 15.6\" Fhd 15-fc0276la',NULL,'laptop1.jpg','Laptop Hp Amd Ryzen 7 16 Gb',2299,50,1),(28,'Ryzen 7 7730u 16gb 512gbssd 15.6\" Fhd',NULL,'laptop2.jpg','Laptop Vivobook 15 Amd',2199,50,1),(29,'Ryzen 7 Rtx 4060 16gb',NULL,'laptop3.jpg','Laptop Gamer Loq Amd ',3799,48,1);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_roles`
--

DROP TABLE IF EXISTS `usuario_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_roles` (
  `usuario_id_usuario` int NOT NULL,
  `roles` varchar(255) DEFAULT NULL,
  KEY `FKgjr579eo1qu3eb1hcbisabp6y` (`usuario_id_usuario`),
  CONSTRAINT `FKgjr579eo1qu3eb1hcbisabp6y` FOREIGN KEY (`usuario_id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_roles`
--

LOCK TABLES `usuario_roles` WRITE;
/*!40000 ALTER TABLE `usuario_roles` DISABLE KEYS */;
INSERT INTO `usuario_roles` VALUES (2,'USER'),(4,'USER'),(2,'ADMIN'),(5,'USER'),(5,'ADMIN'),(6,'USER'),(6,'ADMIN'),(7,'USER'),(8,'USER'),(8,'ADMIN'),(9,'USER'),(13,'USER'),(14,'USER'),(15,'USER'),(16,'USER'),(17,'USER'),(18,'USER'),(19,'USER'),(20,'USER'),(21,'USER'),(22,'USER'),(23,'USER'),(24,'USER'),(25,'USER'),(26,'USER');
/*!40000 ALTER TABLE `usuario_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `fecha_creacion` datetime(6) DEFAULT NULL,
  `nombre` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (2,'admin@tushop.com','2025-10-21 16:50:35.530000','Administrador','$2a$10$KPn.qfDp/pkqsF9ygL13E.d5yJqUS/lu6y2.EiZbViMMYlyxOYDwa','admin'),(4,'user2@example.com','2025-10-21 17:27:20.891000','Usuario2','$2a$10$mmdBnJxeomw2NJRh5zB7s.dgppjuQ/7iPe2A.leiz1jio/cLHfHJK','user2'),(5,'nuevoadmin@tushop.com','2025-10-21 19:15:48.235000','NuevoAdmin','$2a$10$HJQgffN4JxOZwx4ySz5lJ.x/.7JTDAwIL5i.xEPdFPzqYiqzs2dRu','nuevoadmin'),(6,'juan@example.com','2025-10-21 23:12:21.280000','Juan Perez','$2a$10$zArCLf1nUXeMxunjBjvZQ.C8IuJDTyWSTkDDJu1fVxBApB9miGNqi','juan123'),(7,'jj@gmail.com','2025-10-22 07:56:16.855000','Julio Julian','$2a$10$T9DbQgcT/dw9XhqAcLV.p..esUoj9VjK1yf6flLTn8K23rjlUL/96','jjulian'),(8,'johndoe@gmail.com','2025-10-22 08:10:18.184000','Jhon Doe','$2a$10$XOpCU.4iIZkW08tQKZGmiuYO9duyBK7LaTbfrlallJh3QwBS4mqsK','john123'),(9,'juan@techshop.com','2025-12-01 15:51:06.336000','Juan Pérez','$2a$10$4toQ25lKXo.wRcxSZ9HgPOaJuranjieT0Rs.imaV24QOjLeVOK2e.','juanperez'),(13,'maria@techshop.com',NULL,'Maria Castillo','$2a$10$eC/iPpvuCmIn0qCRcPy0euVffW265UlG2i2Noxh4.qDu.drJK8sLy','Maria'),(14,'mariana@techshop.com',NULL,'Mariana Castrillon','$2a$10$H6NFE5yw6zYcN05sDC2aFe0.HFiGjYVXJhAmuq0MK2mw/EMTBY8kS','Mariana'),(15,'fede@techshop.com','2026-01-13 12:25:37.021000','Pedro Federico Rosas','$2a$10$9.w.Cp1ehGhKeFbhzqyVE.wWl50YnjWk9LfbAhJ.0Jmolx9E4.Kd6','fede2020'),(16,'gonzalo@techshop.com','2026-01-14 11:38:52.482000','Gonzalo Diez','$2a$10$3dIjNGJbZkOuJM4ihatUYeZgVJboVVOKuOUsSt4RuxvJk8fCtLG72','Gonzalo'),(17,'blanca@techshop.com','2026-01-14 14:56:00.063000','Blanca Perez','$2a$10$sbNfJ5dEJVkx/Vt92KYttOlij5HOkLGZPcK04/SxKCgLux7Stuhdm','Blanca'),(18,'zoila@techshop.com','2026-01-15 17:38:32.771000','Zoila Ita','$2a$10$wQXewa3zteRaftNK5LwNTuxGoi7GJLt1Q4UJJ5K5349l8bZqSaKo6','zoila'),(19,'melina@techshop.com','2026-01-15 22:11:39.095000','Melina Mejia','$2a$10$axyCRSI/jh9rk5DBbWkQu.AbRzb/cosxgIV/rJ5EGPO2Pl1URl9QW','melina'),(20,'diego@techshop.com','2026-01-15 22:23:05.356000','Diego Flores','$2a$10$UwOfLaoK6ytTnzGYIwZjLuKdRqzAkrKMpo23LVrQjcalyjpE4Hgay','diego'),(21,'nelson@techshop.com','2026-01-17 00:40:48.808000','Nelson Caballero','$2a$10$mFngB8ekI/C1AyZq6tcyZuoDa2FZ4ZP7tt4pxl5Hx2WGSnq1Y54gq','Nelson'),(22,'santiago@techshop.com','2026-01-17 00:45:01.855000','Santiago Salazar','$2a$10$kWJNf76RCXTexy8f4EHhi.P5GH55CMx7fR6LWoWERLUOVJ3w871H.','Santiago'),(23,'mm@gmail.com','2026-01-17 23:30:42.980000','gisselli rivera','$2a$10$yZ6IoYdJyJWNGWSSn7VtsegC2DPHODUxeq2yXwJcKs0yyseIPzXSC','mel'),(24,'mmejia@gmail.com','2026-01-17 23:33:06.396000','gisel mejia','$2a$10$36tXIvqjBCZoKE3rc4HgpO7BdwCH9n06fK5AC9uBrtPiDo8C3Sh/C','rivera'),(25,'nelly@techshop.com','2026-01-17 23:40:14.373000','nelly diaz','$2a$10$QJ5HrMFaduSKaDh1UnR/buQt2eIz2O51.S48qO1.p5Kb5qMC1zGbO','nelly'),(26,'ursula@techshop.com','2026-01-17 23:48:19.743000','Ursula Castro','$2a$10$Tm7s2KOlqXhiIvfYNAVN7uL9U7Hi4/cyqBPveoyL899f6fLGyVmQS','Ursula');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-24 12:48:33
