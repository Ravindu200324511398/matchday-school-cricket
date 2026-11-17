CREATE TABLE `cricket_matches` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`config` text NOT NULL,
	`journal` text DEFAULT '[]' NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `matches_owner_updated` ON `cricket_matches` (`owner_id`,`updated_at`);