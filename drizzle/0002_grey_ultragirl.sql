ALTER TABLE `cricket_matches` ADD `published_at` text;--> statement-breakpoint
CREATE INDEX `matches_published` ON `cricket_matches` (`published_at`);