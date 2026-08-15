CREATE TABLE `rsvpResponses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(160) NOT NULL,
	`phoneNumber` varchar(40) NOT NULL,
	`attendanceStatus` enum('attending','not_attending') NOT NULL,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rsvpResponses_id` PRIMARY KEY(`id`)
);
