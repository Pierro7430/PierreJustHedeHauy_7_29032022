-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: bdd_p7
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `comment_Id` int unsigned NOT NULL AUTO_INCREMENT,
  `comment_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `comment_imgUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `comment_date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment_date_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment_creator` int unsigned NOT NULL,
  `comment_postId` int unsigned NOT NULL,
  `comment_updated` tinyint NOT NULL,
  `comment_edit_byAdmin` tinyint NOT NULL,
  PRIMARY KEY (`comment_Id`),
  KEY `comment_FK` (`comment_creator`),
  KEY `comment_FK_1` (`comment_postId`),
  CONSTRAINT `comment_FK` FOREIGN KEY (`comment_creator`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comment_FK_1` FOREIGN KEY (`comment_postId`) REFERENCES `posts` (`post_Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `likes_comment`
--

DROP TABLE IF EXISTS `likes_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes_comment` (
  `like_comment_Id` int unsigned NOT NULL AUTO_INCREMENT,
  `like_comment_type` tinyint DEFAULT NULL,
  `like_comment_userId` int unsigned NOT NULL,
  `like_comment_commentId` int unsigned NOT NULL,
  PRIMARY KEY (`like_comment_Id`),
  KEY `like_FK` (`like_comment_userId`) USING BTREE,
  KEY `like_FK_1` (`like_comment_commentId`) USING BTREE,
  CONSTRAINT `likes_comment_FK` FOREIGN KEY (`like_comment_userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `likes_comment_FK_1` FOREIGN KEY (`like_comment_commentId`) REFERENCES `comments` (`comment_Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `likes_post`
--

DROP TABLE IF EXISTS `likes_post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes_post` (
  `like_post_Id` int unsigned NOT NULL AUTO_INCREMENT,
  `like_post_type` tinyint DEFAULT NULL,
  `like_post_userId` int unsigned NOT NULL,
  `like_post_postId` int unsigned NOT NULL,
  PRIMARY KEY (`like_post_Id`),
  KEY `like_FK` (`like_post_userId`),
  KEY `like_FK_1` (`like_post_postId`),
  CONSTRAINT `like_FK` FOREIGN KEY (`like_post_userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `like_FK_1` FOREIGN KEY (`like_post_postId`) REFERENCES `posts` (`post_Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `post_Id` int unsigned NOT NULL AUTO_INCREMENT,
  `post_title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `post_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `post_imgUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `post_date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `post_date_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `post_creator` int unsigned NOT NULL,
  `post_updated` tinyint NOT NULL,
  `post_edit_byAdmin` tinyint NOT NULL,
  PRIMARY KEY (`post_Id`),
  KEY `post_FK` (`post_creator`),
  CONSTRAINT `post_FK` FOREIGN KEY (`post_creator`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `lastname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `firstname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `signup_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `location` varchar(100) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `is_admin` tinyint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=138 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'bdd_p7'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-14 22:18:03
