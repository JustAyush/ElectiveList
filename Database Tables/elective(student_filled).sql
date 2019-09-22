-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 22, 2019 at 07:30 AM
-- Server version: 5.7.21
-- PHP Version: 5.6.35

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `elective`
--

-- --------------------------------------------------------

--
-- Table structure for table `elective2`
--

DROP TABLE IF EXISTS `elective2`;
CREATE TABLE IF NOT EXISTS `elective2` (
  `elec2_id` varchar(15) NOT NULL,
  `elec2_name` varchar(50) NOT NULL,
  `elec2_sec` varchar(15) NOT NULL,
  PRIMARY KEY (`elec2_id`),
  KEY `elective2_ibfk_1` (`elec2_sec`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `elective2`
--

INSERT INTO `elective2` (`elec2_id`, `elec2_name`, `elec2_sec`) VALUES
('CT76502', 'Agile Software Development', 'BCT'),
('CT76503', 'Networking with IPV^', 'BCT'),
('CT76504', 'Advanced Computer Architecture', 'BCT'),
('CT76505', 'Information Systems', 'BCT'),
('CT76507', 'Big Data Technologies', 'BCT'),
('EX75506', 'Database Management Systems', 'BEX'),
('EX76501', 'Optical Fiber Communication System', 'BEX'),
('EX76503', 'Broadcast Engineering', 'BEX'),
('EX76504', 'Wireless Communication', 'BEX');

-- --------------------------------------------------------

--
-- Table structure for table `elective3`
--

DROP TABLE IF EXISTS `elective3`;
CREATE TABLE IF NOT EXISTS `elective3` (
  `elec3_id` varchar(15) NOT NULL,
  `elec3_name` varchar(50) NOT NULL,
  `elec3_sec` varchar(15) NOT NULL,
  PRIMARY KEY (`elec3_id`),
  KEY `elective3_ibfk_1` (`elec3_sec`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `elective3`
--

INSERT INTO `elective3` (`elec3_id`, `elec3_name`, `elec3_sec`) VALUES
('CT78501', 'Remote Sensing', 'BCT'),
('CT78503', 'Multimedia System', 'BCT'),
('CT78504', 'Enterprise Application Design and Development', 'BCT'),
('CT78505', 'XML: Foundations, Techniques and Applications', 'BCT'),
('CT78506', 'Artificial Intelligence', 'BCT'),
('CT78507', 'Geographical Information System', 'BCT'),
('CT78508', 'Speech Processing', 'BCT'),
('EE78507', 'Power Electronics', 'BEX'),
('EX78503', 'Telecommunication', 'BEX');

-- --------------------------------------------------------

--
-- Table structure for table `instructor`
--

DROP TABLE IF EXISTS `instructor`;
CREATE TABLE IF NOT EXISTS `instructor` (
  `ins_id` int(5) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(15) NOT NULL,
  `last_name` varchar(15) NOT NULL,
  `elec2_id` varchar(15) DEFAULT NULL,
  `elec3_id` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`ins_id`),
  UNIQUE KEY `elec2_id_2` (`elec2_id`),
  UNIQUE KEY `elec3_id_2` (`elec3_id`),
  KEY `elec2_id` (`elec2_id`),
  KEY `elec3_id` (`elec3_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `section`
--

DROP TABLE IF EXISTS `section`;
CREATE TABLE IF NOT EXISTS `section` (
  `sec` varchar(15) NOT NULL,
  PRIMARY KEY (`sec`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `section`
--

INSERT INTO `section` (`sec`) VALUES
('BCT'),
('BEX');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
CREATE TABLE IF NOT EXISTS `student` (
  `year` int(5) NOT NULL,
  `sec` varchar(15) NOT NULL,
  `stu_id` int(5) NOT NULL,
  `first_name` varchar(15) NOT NULL,
  `last_name` varchar(15) NOT NULL,
  PRIMARY KEY (`year`,`sec`,`stu_id`),
  KEY `stu_id` (`stu_id`),
  KEY `student_ibfk_1` (`sec`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`year`, `sec`, `stu_id`, `first_name`, `last_name`) VALUES
(72, 'BEX', 401, 'Aatish ', 'Shakya'),
(72, 'BEX', 402, 'Abhish ', 'Khanal'),
(72, 'BEX', 403, 'Alok', 'Regmi'),
(72, 'BEX', 404, 'Anil ', 'Paudel'),
(72, 'BEX', 405, 'Anuska', 'Pant'),
(72, 'BEX', 406, 'Ashish ', 'Gautam'),
(72, 'BEX', 407, 'Ayush ', 'Bajracharya'),
(72, 'BEX', 408, 'Bhabesh Raj ', 'Rai'),
(72, 'BEX', 409, 'Bibek ', 'Thapa'),
(72, 'BEX', 410, 'Bijay', 'Pandey'),
(72, 'BEX', 411, 'Binita ', 'Chand'),
(72, 'BEX', 412, 'Bipan ', 'Chhetri'),
(72, 'BEX', 413, 'Chandra prakash', 'Prakash'),
(72, 'BEX', 414, 'Chandra ', 'Shekhar'),
(72, 'BEX', 415, 'Chiranjibi ', 'Pandey'),
(72, 'BEX', 416, 'Deepak ', 'Chand'),
(72, 'BEX', 417, 'Deepak', 'Kandel'),
(72, 'BEX', 418, 'Dipesh ', 'Gyawali'),
(72, 'BEX', 419, 'Janardan ', 'Banjara'),
(72, 'BEX', 420, 'Jayshree', 'Rathi'),
(72, 'BEX', 421, 'Karuna ', 'Karki'),
(72, 'BEX', 422, 'Kaushal Raj', 'Mishra'),
(72, 'BEX', 423, 'Keshav', 'Chaurasiya'),
(72, 'BEX', 424, 'Manish', 'Gyawali'),
(72, 'BEX', 426, 'Milan', 'Maharjan'),
(72, 'BEX', 428, 'Neha ', 'Khachiboya'),
(72, 'BEX', 429, 'Prakash ', 'Chaudhary'),
(72, 'BEX', 430, 'Prastav ', 'Pokhrel'),
(72, 'BEX', 431, 'Prem ', 'Pandey'),
(72, 'BEX', 433, 'Raju', 'Mandal'),
(72, 'BEX', 434, 'Ravikiran ', 'Aryal'),
(72, 'BEX', 435, 'Sameer', 'Khannal'),
(72, 'BEX', 436, 'Santosh ', 'Acharya'),
(72, 'BEX', 439, 'Simran ', 'Tiwari'),
(72, 'BEX', 440, 'Sovit', 'Regmi'),
(72, 'BEX', 441, 'Srijana ', 'Bhusal'),
(72, 'BEX', 442, 'Subash ', 'Ghimire'),
(72, 'BEX', 443, 'Subash ', 'Timilsina'),
(72, 'BEX', 444, 'Sunidhi', 'Amatya'),
(72, 'BEX', 445, 'Sunil ', 'Bista'),
(72, 'BEX', 446, 'Suraj ', 'Aryal'),
(72, 'BEX', 447, 'Suraksha ', 'Sharma'),
(72, 'BEX', 448, 'Tejasvi ', 'Panta'),
(72, 'BEX', 449, 'Tribikram', 'Panthi'),
(72, 'BEX', 450, 'Madhusudan', 'Mainali'),
(72, 'BEX', 451, 'Anil Kumar', 'Shah'),
(72, 'BEX', 452, 'Anil', 'Dhakal');

-- --------------------------------------------------------

--
-- Table structure for table `takes`
--

DROP TABLE IF EXISTS `takes`;
CREATE TABLE IF NOT EXISTS `takes` (
  `year` int(5) NOT NULL,
  `sec` varchar(15) NOT NULL,
  `stu_id` int(5) NOT NULL,
  `elec2_id` varchar(15) NOT NULL,
  `elec3_id` varchar(15) NOT NULL,
  PRIMARY KEY (`year`,`sec`,`stu_id`),
  KEY `elec2_id` (`elec2_id`),
  KEY `elec3_id` (`elec3_id`),
  KEY `stu_id` (`stu_id`),
  KEY `takes_ibfk_3` (`sec`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `takes`
--

INSERT INTO `takes` (`year`, `sec`, `stu_id`, `elec2_id`, `elec3_id`) VALUES
(72, 'BEX', 401, 'EX75506', 'CT78504'),
(72, 'BEX', 402, 'EX75506', 'CT78501'),
(72, 'BEX', 403, 'EX75506', 'CT78506'),
(72, 'BEX', 404, 'CT76507', 'CT78506'),
(72, 'BEX', 405, 'EX75506', 'CT78504'),
(72, 'BEX', 406, 'CT76507', 'CT78506'),
(72, 'BEX', 407, 'EX75506', 'CT78504'),
(72, 'BEX', 408, 'EX75506', 'CT78501'),
(72, 'BEX', 409, 'EX75506', 'CT78506'),
(72, 'BEX', 410, 'EX75506', 'CT78501'),
(72, 'BEX', 411, 'EX75506', 'CT78506'),
(72, 'BEX', 412, 'EX75506', 'CT78504'),
(72, 'BEX', 413, 'CT76507', 'CT78506'),
(72, 'BEX', 414, 'CT76507', 'CT78506'),
(72, 'BEX', 415, 'EX75506', 'CT78504'),
(72, 'BEX', 416, 'EX75506', 'CT78506'),
(72, 'BEX', 417, 'EX75506', 'CT78506'),
(72, 'BEX', 418, 'CT76507', 'CT78506'),
(72, 'BEX', 419, 'EX75506', 'CT78501'),
(72, 'BEX', 420, 'EX75506', 'CT78501'),
(72, 'BEX', 421, 'EX75506', 'CT78501'),
(72, 'BEX', 422, 'EX75506', 'CT78501'),
(72, 'BEX', 423, 'CT76507', 'CT78501'),
(72, 'BEX', 424, 'EX75506', 'CT78506'),
(72, 'BEX', 426, 'CT76507', 'CT78504'),
(72, 'BEX', 428, 'EX75506', 'CT78506'),
(72, 'BEX', 429, 'EX75506', 'CT78506'),
(72, 'BEX', 430, 'EX75506', 'CT78506'),
(72, 'BEX', 431, 'CT76507', 'CT78501'),
(72, 'BEX', 433, 'CT76507', 'CT78506'),
(72, 'BEX', 434, 'CT76507', 'CT78506'),
(72, 'BEX', 435, 'EX75506', 'CT78504'),
(72, 'BEX', 436, 'EX75506', 'CT78506'),
(72, 'BEX', 439, 'CT76507', 'CT78506'),
(72, 'BEX', 440, 'CT76507', 'CT78504'),
(72, 'BEX', 441, 'EX75506', 'CT78504'),
(72, 'BEX', 442, 'EX75506', 'CT78501'),
(72, 'BEX', 443, 'EX75506', 'CT78501'),
(72, 'BEX', 444, 'EX75506', 'CT78501'),
(72, 'BEX', 445, 'EX75506', 'CT78504'),
(72, 'BEX', 446, 'EX75506', 'CT78504'),
(72, 'BEX', 447, 'EX75506', 'CT78506'),
(72, 'BEX', 448, 'CT76507', 'CT78504'),
(72, 'BEX', 449, 'CT76507', 'CT78504'),
(72, 'BEX', 450, 'EX75506', 'CT78501'),
(72, 'BEX', 451, 'CT76507', 'CT78506'),
(72, 'BEX', 452, 'EX75506', 'CT78506');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `elective2`
--
ALTER TABLE `elective2`
  ADD CONSTRAINT `elective2_ibfk_1` FOREIGN KEY (`elec2_sec`) REFERENCES `section` (`sec`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `elective3`
--
ALTER TABLE `elective3`
  ADD CONSTRAINT `elective3_ibfk_1` FOREIGN KEY (`elec3_sec`) REFERENCES `section` (`sec`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `instructor`
--
ALTER TABLE `instructor`
  ADD CONSTRAINT `instructor_ibfk_1` FOREIGN KEY (`elec2_id`) REFERENCES `elective2` (`elec2_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `instructor_ibfk_2` FOREIGN KEY (`elec3_id`) REFERENCES `elective3` (`elec3_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`sec`) REFERENCES `section` (`sec`);

--
-- Constraints for table `takes`
--
ALTER TABLE `takes`
  ADD CONSTRAINT `takes_ibfk_2` FOREIGN KEY (`stu_id`) REFERENCES `student` (`stu_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `takes_ibfk_4` FOREIGN KEY (`elec2_id`) REFERENCES `elective2` (`elec2_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `takes_ibfk_5` FOREIGN KEY (`elec3_id`) REFERENCES `elective3` (`elec3_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
