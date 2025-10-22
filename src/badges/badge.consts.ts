import { BadgeType, BadgeRarity } from '@prisma/client';

export const defaultBadges = [
    // Streak badges
    {
        name: 'First Steps',
        description: 'Complete a habit for 7 consecutive days',
        type: BadgeType.STREAK,
        rarity: BadgeRarity.COMMON,
        criteria: { targetStreak: 7 },
        points: 50,
    },
    {
        name: 'Week Warrior',
        description: 'Maintain a 30-day streak',
        type: BadgeType.STREAK,
        rarity: BadgeRarity.RARE,
        criteria: { targetStreak: 30 },
        points: 200,
    },
    {
        name: 'Streak Master',
        description: 'Achieve a 100-day streak',
        type: BadgeType.STREAK,
        rarity: BadgeRarity.EPIC,
        criteria: { targetStreak: 100 },
        points: 500,
    },

    // Level badges
    {
        name: 'Rising Star',
        description: 'Reach level 5',
        type: BadgeType.LEVEL,
        rarity: BadgeRarity.COMMON,
        criteria: { targetLevel: 5 },
        points: 100,
    },
    {
        name: 'Habit Hero',
        description: 'Reach level 25',
        type: BadgeType.LEVEL,
        rarity: BadgeRarity.RARE,
        criteria: { targetLevel: 25 },
        points: 300,
    },
    {
        name: 'Legend',
        description: 'Reach level 50',
        type: BadgeType.LEVEL,
        rarity: BadgeRarity.LEGENDARY,
        criteria: { targetLevel: 50 },
        points: 1000,
    },

    // Habit count badges
    {
        name: 'Getting Started',
        description: 'Create 3 habits',
        type: BadgeType.HABIT_COUNT,
        rarity: BadgeRarity.COMMON,
        criteria: { targetCount: 3 },
        points: 25,
    },
    {
        name: 'Habit Collector',
        description: 'Create 10 habits',
        type: BadgeType.HABIT_COUNT,
        rarity: BadgeRarity.RARE,
        criteria: { targetCount: 10 },
        points: 150,
    },

    // Category badges
    {
        name: 'Health Enthusiast',
        description: 'Create 3 health-related habits',
        type: BadgeType.CATEGORY,
        rarity: BadgeRarity.COMMON,
        criteria: { category: 'health', targetCount: 3 },
        points: 75,
    },
    {
        name: 'Learning Machine',
        description: 'Create 5 learning habits',
        type: BadgeType.CATEGORY,
        rarity: BadgeRarity.RARE,
        criteria: { category: 'learning', targetCount: 5 },
        points: 250,
    },

    // Social badges
    {
        name: 'Social Butterfly',
        description: 'Add 5 friends',
        type: BadgeType.SOCIAL,
        rarity: BadgeRarity.COMMON,
        criteria: { action: 'add_friend', targetCount: 5 },
        points: 100,
    },

    // Consistency badges
    {
        name: 'Consistent',
        description: 'Complete habits on 10 different days in the last 14 days',
        type: BadgeType.CONSISTENCY,
        rarity: BadgeRarity.COMMON,
        criteria: { targetDays: 10, withinDays: 14 },
        points: 75,
    },
    {
        name: 'Unstoppable',
        description: 'Complete habits on 25 different days in the last 30 days',
        type: BadgeType.CONSISTENCY,
        rarity: BadgeRarity.RARE,
        criteria: { targetDays: 25, withinDays: 30 },
        points: 300,
    },

    // Competitive badges
    {
        name: 'Competitive Spirit',
        description: 'Create or join your first competitive habit',
        type: BadgeType.COMPETITIVE,
        rarity: BadgeRarity.COMMON,
        criteria: { action: 'first_competitive' },
        points: 100,
    },
    {
        name: 'Challenge Champion',
        description: 'Win your first habit challenge',
        type: BadgeType.COMPETITIVE,
        rarity: BadgeRarity.RARE,
        criteria: { action: 'first_win' },
        points: 250,
    },
    {
        name: 'Competition Master',
        description: 'Win 5 habit challenges',
        type: BadgeType.COMPETITIVE,
        rarity: BadgeRarity.EPIC,
        criteria: { action: 'multiple_wins', targetWins: 5 },
        points: 500,
    },
];