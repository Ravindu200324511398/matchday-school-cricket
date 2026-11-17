import { integer, sqliteTable, text, index } from 'drizzle-orm/sqlite-core';
export const cricketMatches = sqliteTable('cricket_matches', {
 id: text('id').primaryKey(), ownerId: text('owner_id').notNull(),
 config: text('config').notNull(), journal: text('journal').notNull().default('[]'),
 revision: integer('revision').notNull().default(0),
 scorerEmail: text('scorer_email'),
 publicScore: integer('public_score').notNull().default(0),
 publishedAt: text('published_at'),
 approvedAt: text('approved_at'),
 createdAt: text('created_at').notNull(), updatedAt: text('updated_at').notNull(),
}, t => [index('matches_owner_updated').on(t.ownerId, t.updatedAt), index('matches_scorer_updated').on(t.scorerEmail,t.updatedAt), index('matches_published').on(t.publishedAt)]);

export const cricketSquads = sqliteTable('cricket_squads', {
 id: text('id').primaryKey(),
 ownerId: text('owner_id').notNull(),
 school: text('school').notNull(),
 team: text('team').notNull(),
 players: text('players').notNull(),
 revision: integer('revision').notNull().default(0),
}, t=>[index('squads_owner').on(t.ownerId)]);

export const cricketPoints = sqliteTable('cricket_points', {
 competition: text('competition').primaryKey(),
 ownerId: text('owner_id').notNull(),
 rules: text('rules').notNull(),
 revision: integer('revision').notNull().default(0),
});
