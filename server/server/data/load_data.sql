INSERT INTO `patient`(`patient_id`, `password`, `name`, `birthday`) VALUES
(0, '098f6bcd4621d373cade4e832627b4f6', 'test', '2000-01-01');

INSERT INTO `doctor`(`password`, `name`, `department`, `title`) VALUES
('098f6bcd4621d373cade4e832627b4f6', 'John', 'Cardiology', 'Intern');

INSERT INTO `schedule`(`doctor_id`,	`start_time`, `end_time`, `capacity`, `weekday`) VALUES
(1, '9:00', '11:00', 10, 1),
(1, '14:00', '16:00', 10, 1),
(1, '9:00', '11:00', 10, 2),
(1, '14:00', '16:00', 10, 2),
(1, '9:00', '11:00', 10, 5),
(1, '14:00', '16:00', 10, 5);

INSERT INTO `record`(`patient_id`, `stage`, `date`) VALUES
(0, 'Upcoming', '2020-11-15');

INSERT INTO `staff`(`name`, `password`, `role`) VALUES
('front', '098f6bcd4621d373cade4e832627b4f6', 'front'),
('dispenser', '098f6bcd4621d373cade4e832627b4f6', 'dispenser');

INSERT INTO `admin`(`admin_id`, `name`, `password`) VALUES
(0, 'test', '098f6bcd4621d373cade4e832627b4f6');