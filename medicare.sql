-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 25, 2024 at 12:00 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `medicare`
--

-- --------------------------------------------------------

--
-- Table structure for table `address_detail`
--

CREATE TABLE `address_detail` (
  `address_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `address` varchar(300) NOT NULL DEFAULT '',
  `image` varchar(100) NOT NULL DEFAULT '',
  `latitude` varchar(30) NOT NULL DEFAULT '0.0',
  `longitude` varchar(30) NOT NULL DEFAULT '0.0',
  `is_default` int(1) NOT NULL DEFAULT 0 COMMENT ' 1= default',
  `status` int(11) NOT NULL DEFAULT 0 COMMENT '1 = active, 2 = Delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ads_detail`
--

CREATE TABLE `ads_detail` (
  `ad_id` int(11) NOT NULL,
  `image` varchar(150) NOT NULL DEFAULT '',
  `start_date` datetime NOT NULL DEFAULT current_timestamp(),
  `end_date` datetime NOT NULL DEFAULT current_timestamp(),
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = active, 2 = delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `booking_detail`
--

CREATE TABLE `booking_detail` (
  `ap_booking_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL DEFAULT 0,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `booking_date` datetime NOT NULL DEFAULT current_timestamp(),
  `reason` varchar(500) NOT NULL DEFAULT '',
  `message` varchar(2000) NOT NULL DEFAULT '',
  `fees_amount` varchar(20) NOT NULL DEFAULT '0.0',
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '0 = new, 1 = accept, 2 = doctor cancel, 3 = cancel, 4 = delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `category_detail`
--

CREATE TABLE `category_detail` (
  `cat_id` int(11) NOT NULL,
  `cat_name` varchar(150) NOT NULL DEFAULT '',
  `image` varchar(100) NOT NULL DEFAULT '',
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = active, 2 = Delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_delete`
--

CREATE TABLE `chat_delete` (
  `d_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `receiver_id` int(11) NOT NULL DEFAULT 0,
  `created_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_message_detail`
--

CREATE TABLE `chat_message_detail` (
  `chat_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL DEFAULT 0,
  `receiver_id` int(11) NOT NULL DEFAULT 0,
  `message` text NOT NULL DEFAULT '',
  `message_type` int(1) NOT NULL DEFAULT 1 COMMENT '1 = Text, 2 = File',
  `receiver_date` datetime DEFAULT NULL,
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '0 = send, 1= receive, 2 = view, 3 = sender delete, 4 = receiver delete. 5. = all delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `city_detail`
--

CREATE TABLE `city_detail` (
  `city_id` int(11) NOT NULL,
  `city_name` varchar(100) NOT NULL DEFAULT '',
  `latitude` varchar(30) NOT NULL DEFAULT '0.0',
  `longitude` varchar(30) NOT NULL DEFAULT '0.0',
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = Active, 2 = Delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doctor_degree_detail`
--

CREATE TABLE `doctor_degree_detail` (
  `degree_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `degree_name` varchar(100) NOT NULL DEFAULT '',
  `image` varchar(100) NOT NULL DEFAULT '',
  `status` int(11) NOT NULL DEFAULT 0 COMMENT '0 = new, 1 = verify, 2 = reject, 3 = delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doc_list_detail`
--

CREATE TABLE `doc_list_detail` (
  `doc_list_id` int(11) NOT NULL,
  `doc_name` varchar(100) NOT NULL DEFAULT '',
  `is_both` int(1) NOT NULL DEFAULT 2 COMMENT '1 = font side, 2 = back side',
  `user_type` varchar(30) NOT NULL DEFAULT '2,3,4',
  `status` int(1) NOT NULL DEFAULT 0 COMMENT ' 0 = inactive, 1 = active, 2 = delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `experience_detail`
--

CREATE TABLE `experience_detail` (
  `exp_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `info` varchar(500) NOT NULL DEFAULT '',
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = active, 2 = deleted',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `other_staff_detail`
--

CREATE TABLE `other_staff_detail` (
  `staff_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `staff_user_id` int(11) NOT NULL DEFAULT 0,
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = active, 2 = deleted',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_detail`
--

CREATE TABLE `payment_detail` (
  `payment_id` int(11) NOT NULL,
  `ap_booking_id` int(11) NOT NULL DEFAULT 0,
  `amount` varchar(20) NOT NULL DEFAULT '0.0',
  `payment_date` datetime NOT NULL DEFAULT current_timestamp(),
  `payment_method` int(1) NOT NULL DEFAULT 1 COMMENT '1 = Card , 2 = Other',
  `payment_status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = pending, 2 = success, 3 = fail, 4 = refund',
  `payment_payload` varchar(3000) NOT NULL DEFAULT '',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp(),
  `refund_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_modes`
--

CREATE TABLE `payment_modes` (
  `pay_mod_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `name` varchar(100) NOT NULL DEFAULT '',
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = active, 2 = inactive, 3 = delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rating_detail`
--

CREATE TABLE `rating_detail` (
  `rate_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `rate_user_id` int(11) NOT NULL DEFAULT 0,
  `rate` int(2) NOT NULL DEFAULT 5,
  `review_message` text NOT NULL DEFAULT '',
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = Rating, 2 = delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_detail`
--

CREATE TABLE `service_detail` (
  `service_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `service_name` varchar(300) NOT NULL DEFAULT '',
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = active, 2 = deleted',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `time_detail`
--

CREATE TABLE `time_detail` (
  `time_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `day_number` int(2) NOT NULL DEFAULT 0,
  `start_time` varchar(20) NOT NULL DEFAULT '',
  `end_time` varchar(20) NOT NULL DEFAULT '',
  `is_closed` int(1) NOT NULL DEFAULT 0 COMMENT '0 = open, 1 = closed',
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = active, 2 = delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_detail`
--

CREATE TABLE `user_detail` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL DEFAULT '',
  `middel_name` varchar(100) NOT NULL DEFAULT '',
  `last_name` varchar(100) NOT NULL DEFAULT '',
  `mobile_code` varchar(10) NOT NULL DEFAULT '',
  `mobile` varchar(20) NOT NULL DEFAULT '',
  `image` varchar(150) NOT NULL DEFAULT '',
  `email` varchar(100) NOT NULL DEFAULT '',
  `password` varchar(50) NOT NULL DEFAULT '',
  `year_experience` varchar(10) NOT NULL DEFAULT '1',
  `fees` varchar(20) NOT NULL DEFAULT '0.0',
  `latitude` varchar(30) NOT NULL DEFAULT '0.0',
  `longitude` varchar(30) NOT NULL DEFAULT '0.0',
  `os_type` varchar(5) NOT NULL DEFAULT 'A' COMMENT 'A = Android, I = iOS',
  `push_token` varchar(100) NOT NULL DEFAULT '',
  `auth_token` varchar(100) NOT NULL DEFAULT '',
  `is_verify` int(1) NOT NULL DEFAULT 0 COMMENT '0 = new, 1 = verify',
  `user_type` int(1) NOT NULL DEFAULT 1 COMMENT '1 = User, 2 = Doctor, 3 = Medical Shop, 4 = hospital, 5 = Admin',
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '0 = Block, 1 = Active, 2 = Delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_image_detail`
--

CREATE TABLE `user_image_detail` (
  `image_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `image` varchar(150) NOT NULL DEFAULT '',
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = active, 2 = delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `address_detail`
--
ALTER TABLE `address_detail`
  ADD PRIMARY KEY (`address_id`);

--
-- Indexes for table `ads_detail`
--
ALTER TABLE `ads_detail`
  ADD PRIMARY KEY (`ad_id`);

--
-- Indexes for table `booking_detail`
--
ALTER TABLE `booking_detail`
  ADD PRIMARY KEY (`ap_booking_id`);

--
-- Indexes for table `category_detail`
--
ALTER TABLE `category_detail`
  ADD PRIMARY KEY (`cat_id`);

--
-- Indexes for table `chat_delete`
--
ALTER TABLE `chat_delete`
  ADD PRIMARY KEY (`d_id`);

--
-- Indexes for table `chat_message_detail`
--
ALTER TABLE `chat_message_detail`
  ADD PRIMARY KEY (`chat_id`);

--
-- Indexes for table `city_detail`
--
ALTER TABLE `city_detail`
  ADD PRIMARY KEY (`city_id`);

--
-- Indexes for table `doctor_degree_detail`
--
ALTER TABLE `doctor_degree_detail`
  ADD PRIMARY KEY (`degree_id`);

--
-- Indexes for table `doc_list_detail`
--
ALTER TABLE `doc_list_detail`
  ADD PRIMARY KEY (`doc_list_id`);

--
-- Indexes for table `experience_detail`
--
ALTER TABLE `experience_detail`
  ADD PRIMARY KEY (`exp_id`);

--
-- Indexes for table `other_staff_detail`
--
ALTER TABLE `other_staff_detail`
  ADD PRIMARY KEY (`staff_id`);

--
-- Indexes for table `payment_detail`
--
ALTER TABLE `payment_detail`
  ADD PRIMARY KEY (`payment_id`);

--
-- Indexes for table `payment_modes`
--
ALTER TABLE `payment_modes`
  ADD PRIMARY KEY (`pay_mod_id`);

--
-- Indexes for table `rating_detail`
--
ALTER TABLE `rating_detail`
  ADD PRIMARY KEY (`rate_id`);

--
-- Indexes for table `service_detail`
--
ALTER TABLE `service_detail`
  ADD PRIMARY KEY (`service_id`);

--
-- Indexes for table `time_detail`
--
ALTER TABLE `time_detail`
  ADD PRIMARY KEY (`time_id`);

--
-- Indexes for table `user_detail`
--
ALTER TABLE `user_detail`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `user_image_detail`
--
ALTER TABLE `user_image_detail`
  ADD PRIMARY KEY (`image_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `address_detail`
--
ALTER TABLE `address_detail`
  MODIFY `address_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ads_detail`
--
ALTER TABLE `ads_detail`
  MODIFY `ad_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `booking_detail`
--
ALTER TABLE `booking_detail`
  MODIFY `ap_booking_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `category_detail`
--
ALTER TABLE `category_detail`
  MODIFY `cat_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_delete`
--
ALTER TABLE `chat_delete`
  MODIFY `d_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_message_detail`
--
ALTER TABLE `chat_message_detail`
  MODIFY `chat_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `city_detail`
--
ALTER TABLE `city_detail`
  MODIFY `city_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `doctor_degree_detail`
--
ALTER TABLE `doctor_degree_detail`
  MODIFY `degree_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `doc_list_detail`
--
ALTER TABLE `doc_list_detail`
  MODIFY `doc_list_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `experience_detail`
--
ALTER TABLE `experience_detail`
  MODIFY `exp_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `other_staff_detail`
--
ALTER TABLE `other_staff_detail`
  MODIFY `staff_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_detail`
--
ALTER TABLE `payment_detail`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_modes`
--
ALTER TABLE `payment_modes`
  MODIFY `pay_mod_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rating_detail`
--
ALTER TABLE `rating_detail`
  MODIFY `rate_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_detail`
--
ALTER TABLE `service_detail`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `time_detail`
--
ALTER TABLE `time_detail`
  MODIFY `time_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_detail`
--
ALTER TABLE `user_detail`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_image_detail`
--
ALTER TABLE `user_image_detail`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
