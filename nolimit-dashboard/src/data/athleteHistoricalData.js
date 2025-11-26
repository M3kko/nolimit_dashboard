export const getAthleteHistoricalData = (athleteId) => {
    const baseData = {
        1: { name: "Alexander", baseRecovery: 85, baseHRV: 62, baseStrain: 13, baseSleep: 7.5 },
        2: { name: "Natalie", baseRecovery: 80, baseHRV: 58, baseStrain: 12, baseSleep: 7.2 },
        3: { name: "Sofia", baseRecovery: 75, baseHRV: 55, baseStrain: 10, baseSleep: 8.0 },
        4: { name: "James", baseRecovery: 70, baseHRV: 50, baseStrain: 14, baseSleep: 6.8 },
        5: { name: "Emma", baseRecovery: 82, baseHRV: 60, baseStrain: 11, baseSleep: 7.4 },
        6: { name: "Lucas", baseRecovery: 55, baseHRV: 42, baseStrain: 8, baseSleep: 6.5 },
        7: { name: "Olivia", baseRecovery: 88, baseHRV: 65, baseStrain: 15, baseSleep: 7.8 },
    };

    const athlete = baseData[athleteId] || baseData[1];
    const today = new Date();

    const dailyData = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        const variance = () => (Math.random() - 0.5) * 20;
        const smallVariance = () => (Math.random() - 0.5) * 10;

        dailyData.push({
            date: date.toISOString().split('T')[0],
            dateShort: `${date.getMonth() + 1}/${date.getDate()}`,
            recovery: Math.min(100, Math.max(30, Math.round(athlete.baseRecovery + variance()))),
            hrv: Math.max(25, Math.round(athlete.baseHRV + smallVariance())),
            strain: Math.min(21, Math.max(2, +(athlete.baseStrain + (Math.random() - 0.5) * 6).toFixed(1))),
            sleep: Math.min(10, Math.max(4, +(athlete.baseSleep + (Math.random() - 0.5) * 2).toFixed(1))),
            rhr: Math.max(40, Math.round(52 + smallVariance() * 0.5)),
        });
    }

    const weeklyData = [];
    for (let i = 7; i >= 0; i--) {
        weeklyData.push({
            week: `W${8 - i}`,
            avgRecovery: Math.min(100, Math.max(40, Math.round(athlete.baseRecovery + (Math.random() - 0.5) * 15))),
            avgStrain: Math.min(18, Math.max(5, +(athlete.baseStrain + (Math.random() - 0.5) * 4).toFixed(1))),
        });
    }

    const sessionBreakdown = [
        { type: 'Strength', sessions: Math.floor(Math.random() * 8) + 4, color: '#3b82f6' },
        { type: 'Cardio', sessions: Math.floor(Math.random() * 6) + 3, color: '#10b981' },
        { type: 'HIIT', sessions: Math.floor(Math.random() * 5) + 2, color: '#f59e0b' },
        { type: 'Recovery', sessions: Math.floor(Math.random() * 4) + 2, color: '#8b5cf6' },
    ];

    return { dailyData, weeklyData, sessionBreakdown };
};