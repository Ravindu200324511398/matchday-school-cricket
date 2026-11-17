CREATE TABLE `cricket_points` (
	`competition` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`rules` text NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cricket_squads` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`school` text NOT NULL,
	`team` text NOT NULL,
	`players` text NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `squads_owner` ON `cricket_squads` (`owner_id`);--> statement-breakpoint
ALTER TABLE `cricket_matches` ADD `public_score` integer DEFAULT 0 NOT NULL;