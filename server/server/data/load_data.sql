INSERT INTO `patient`(`patient_id`, `password`, `name`, `birthday`) VALUES
(0, 'a3018c96a8cdc6e3e6dc47733832925c', 'test', '2000-01-01');

INSERT INTO `doctor`(`password`, `name`, `department`, `title`) VALUES
('a3018c96a8cdc6e3e6dc47733832925c', 'John', 'Cardiology', 'Intern');

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
('front', 'a3018c96a8cdc6e3e6dc47733832925c', 'front'),
('dispenser', 'a3018c96a8cdc6e3e6dc47733832925c', 'dispenser');

INSERT INTO `admin`(`admin_id`, `name`, `password`) VALUES
(0, 'test', 'a3018c96a8cdc6e3e6dc47733832925c');