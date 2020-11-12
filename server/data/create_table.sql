CREATE TABLE `patient`(
	`patient_id` INT NOT NULL,
	`password` VARCHAR(50) NOT NULL,
	`name` VARCHAR(50) NOT NULL,
	`birthday` DATE,
	PRIMARY KEY(`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `doctor`(
	`doctor_id` INT NOT NULL AUTO_INCREMENT,
	`password` VARCHAR(50) NOT NULL,
	`name` VARCHAR(50) NOT NULL,
	`department` VARCHAR(50) NOT NULL,
	`title` VARCHAR(50),
	PRIMARY KEY(`doctor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `schedule`(
	`schedule_id` INT NOT NULL AUTO_INCREMENT,
	`doctor_id` INT NOT NULL,
	`start_time` TIME NOT NULL,
	`end_time` TIME NOT NULL,
	`capacity` INT NOT NULL,
	`weekday` INT NOT NULL,
	PRIMARY KEY(`schedule_id`),
	FOREIGN KEY(`doctor_id`) REFERENCES `doctor`(`doctor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `record`(
	`record_id` INT NOT NULL AUTO_INCREMENT,
	`patient_id` INT NOT NULL,
	`date` DATE NOT NULL,
	PRIMARY KEY(`record_id`),
	FOREIGN KEY(`patient_id`) REFERENCES `patient`(`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `appointment`(
	`appointment_id` INT NOT NULL AUTO_INCREMENT,
	`record_id` INT NOT NULL,
	`doctor_id` INT NOT NULL,
	`diagnosis` VARCHAR(10000),
	`drug` VARCHAR(500),
	`stage` INT NOT NULL,
	`schedule_id` INT NOT NULL,
	`schedule_date` DATE NOT NULL,
	`check_in_time` DATETIME,
	PRIMARY KEY(`appointment_id`),
	FOREIGN KEY(`record_id`) REFERENCES `record`(`record_id`),
	FOREIGN KEY(`schedule_id`) REFERENCES `schedule`(`schedule_id`)
    FOREIGN KEY(`doctor_id`) REFERENCES `doctor`(`doctor_id`)

) ENGINE=InnoDB DEFAULT CHARSET=latin1;


