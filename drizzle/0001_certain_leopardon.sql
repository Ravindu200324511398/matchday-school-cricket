ALTER TABLE `cricket_matches` ADD `scorer_email` text;--> statement-breakpoint
ALTER TABLE `cricket_matches` ADD `approved_at` text;--> statement-breakpoint
CREATE INDEX `matches_scorer_updated` ON `cricket_matches` (`scorer_email`,`updated_at`);