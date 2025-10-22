export const WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function extractRepetitionDays(repetitionDays: number): string[] {
    const result: string[] = [];
    let idx = 0;
    while (repetitionDays) {
        if (repetitionDays % 2) {
            result.push(WEEK_DAYS[idx]);
        }
        repetitionDays = Math.floor(repetitionDays / 2);
        idx++;
    }
    return result;
}

export function isHabitActive(repetitionDays: number, lastCompletedAt: Date | null): boolean {
    const today = new Date().getDay();
    const activeDays = extractRepetitionDays(repetitionDays);
    return activeDays.includes(WEEK_DAYS[today]) && (!lastCompletedAt || lastCompletedAt.toDateString() !== new Date().toDateString());
}