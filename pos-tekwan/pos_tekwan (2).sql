-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 18, 2026 at 10:59 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pos_tekwan`
--

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` int NOT NULL,
  `stock` int NOT NULL,
  `category` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`id`, `name`, `price`, `stock`, `category`) VALUES
(1, 'Tekwan Original', 14000, 50, 'Tekwan'),
(2, 'Tekwan Spesial (Udang)', 20000, 30, 'Tekwan'),
(3, 'Tekwan Bakso', 18000, 40, 'Tekwan'),
(4, 'Pangsit Goreng', 12000, 60, 'Lainnya'),
(5, 'Nasi Tekwan', 22000, 25, 'Tekwan'),
(6, 'Es Teh Manis', 5000, 98, 'Lainnya'),
(7, 'Kerupuk', 3000, 198, 'Lainnya'),
(8, 'Tekwan Paket Hemat', 10000, 98, 'Tekwan'),
(9, 'Tekwan Original', 15000, 50, 'Tekwan'),
(10, 'Tekwan Spesial (Udang)', 20000, 30, 'Tekwan'),
(11, 'Tekwan Bakso', 18000, 40, 'Tekwan'),
(12, 'Pangsit Goreng', 12000, 60, 'Lainnya'),
(13, 'Nasi Tekwan', 22000, 25, 'Tekwan'),
(14, 'Es Teh Manis', 5000, 100, 'Lainnya'),
(15, 'Kerupuk', 3000, 200, 'Lainnya'),
(16, 'Tekwan Original', 15000, 50, 'Tekwan'),
(17, 'Tekwan Spesial (Udang)', 20000, 30, 'Tekwan'),
(18, 'Tekwan Bakso', 18000, 40, 'Tekwan'),
(19, 'Pangsit Goreng', 12000, 60, 'Lainnya'),
(20, 'Nasi Tekwan', 22000, 25, 'Tekwan'),
(21, 'Es Teh Manis', 5000, 100, 'Lainnya'),
(22, 'Kerupuk', 3000, 200, 'Lainnya');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `date` datetime NOT NULL,
  `subtotal` int NOT NULL DEFAULT '0',
  `discount` int NOT NULL DEFAULT '0',
  `paid` int NOT NULL DEFAULT '0',
  `total` int NOT NULL,
  `cashier` varchar(50) DEFAULT NULL,
  `kasir_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `date`, `subtotal`, `discount`, `paid`, `total`, `cashier`, `kasir_id`) VALUES
(2, '2026-01-19 03:52:35', 0, 0, 0, 34000, NULL, NULL),
(3, '2026-01-18 22:41:47', 0, 0, 0, 30000, NULL, NULL),
(4, '2026-01-18 22:43:39', 0, 0, 0, 30000, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `transaction_items`
--

CREATE TABLE `transaction_items` (
  `id` int NOT NULL,
  `transaction_id` int NOT NULL,
  `menu_id` int DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `price` int NOT NULL,
  `qty` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `transaction_items`
--

INSERT INTO `transaction_items` (`id`, `transaction_id`, `menu_id`, `name`, `price`, `qty`) VALUES
(2, 2, 7, 'Kerupuk', 3000, 2),
(3, 2, 6, 'Es Teh Manis', 5000, 2),
(4, 2, 8, 'Tekwan Paket Hemat', 10000, 2),
(5, 3, 1, 'Tekwan Original', 15000, 2),
(6, 4, 1, 'Tekwan Original', 15000, 2);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `role` enum('admin','kasir') NOT NULL,
  `password` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `name`, `role`, `password`) VALUES
(8, 'admin2', 'wisnu', 'admin', '$2y$10$JWSasvsjkFU/pau.uky.5O1YTpwX4MVBtGH3SPZs3WfJA97fNvhbK'),
(9, 'kasir1', 'zasqia', 'kasir', '$2y$10$qz8823zuJUI0FsExczqdFOKa8xUbneQTvkBrRt97Cq.CJ96qYveca');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_kasir` (`kasir_id`);

--
-- Indexes for table `transaction_items`
--
ALTER TABLE `transaction_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transaction_id` (`transaction_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `transaction_items`
--
ALTER TABLE `transaction_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `fk_kasir` FOREIGN KEY (`kasir_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `transaction_items`
--
ALTER TABLE `transaction_items`
  ADD CONSTRAINT `transaction_items_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
