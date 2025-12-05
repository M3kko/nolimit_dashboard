import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './AthleteDetail.css';
import { getAthleteHistoricalData } from './data/athleteHistoricalData';
import { RecoveryChart, HRVChart, StrainChart, SleepChart, WeeklyTrendChart, SessionPieChart } from './components/AthleteCharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const AthleteDetail = ({ athletesData }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const fromPage = location.state?.from || 'athletes';

    const athlete = athletesData.find(a => a.id === parseInt(id));
    const [timeRange, setTimeRange] = React.useState('30d');
    const historicalData = getAthleteHistoricalData(parseInt(id));
    const filteredData = historicalData.dailyData.slice(-(timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30));

    if (!athlete) {
        return (
            <div className="athlete-detail-page">
                <div>athlete not found</div>
                <button className="back-button" onClick={() => navigate('/')}></button>
            </div>
        );
    }

    const biometrics = {
        recovery: {
            score: 87,
            trend: '+3',
            status: 'good'
        },
        hrv: {
            value: 65,
            trend: '+8',
            status: 'excellent',
            unit: 'ms'
        },
        rhr: {
            value: 52,
            trend: '-2',
            status: 'excellent',
            unit: 'bpm'
        },
        sleep: {
            total: 7.8,
            deep: 1.9,
            rem: 2.1,
            efficiency: 92,
            trend: '+0.5',
            status: 'good'
        },
        strain: {
            daily: 14.2,
            trend: '+1.8',
            status: 'moderate'
        },
        vo2max: {
            value: 58,
            trend: "+2",
            status: 'excellent',
            unit: 'ml/kg/min'
        },
        respiratoryRate: {
            value: 14.2,
            trend: '0',
            status: 'good',
            unit: 'brpm'
        },
        spo2: {
            value: 98,
            trend: '0',
            status: 'excellent',
            unit: '%'
        },
        skinTemp: {
            value: 33.4,
            trend: '+0.2',
            status: 'good',
            unit: '°C'
        },
        calories: {
            total: 2847,
            active: 847,
            trend: '+120'
        }
    };

    const getStatusClass = (status) => {
        switch(status?.toLowerCase()) {
            case 'excellent': return 'metric-excellent';
            case 'good': return 'metric-good';
            case 'moderate': return 'metric-moderate';
            case 'low': return 'metric-low';
            case 'active': return 'status-active';
            case 'recovery': return 'status-recovery';
            case 'injury': return 'status-injury';
            default: return 'metric-good';
        }
    };

    const getTrendIcon = (trend) => {
        if (!trend || trend === '0') return '→';
        return trend.startsWith('+') ? '↑' : '↓';
    };

    const getTrendClass = (trend, inverse = false) => {
        if (!trend || trend === '0') return 'trend-neutral';
        const isPositive = trend.startsWith('+');
        if (inverse) {
            return isPositive ? 'trend-negative' : 'trend-positive';
        }
        return isPositive ? 'trend-positive' : 'trend-negative';
    };
    
    const recentSessions = [
        { id: 1, date: '2025-11-19', type: 'Strength Training', duration: '45 min', avgHR: 142, maxHR: 178, strain: 16.2 },
        { id: 2, date: '2025-11-18', type: 'Cardio', duration: '30 min', avgHR: 155, maxHR: 172, strain: 12.8 },
        { id: 3, date: '2025-11-17', type: 'Recovery', duration: '20 min', avgHR: 98, maxHR: 115, strain: 4.2 },
        { id: 4, date: '2025-11-16', type: 'Strength Training', duration: '50 min', avgHR: 138, maxHR: 182, strain: 17.5 },
        { id: 5, date: '2025-11-15', type: 'HIIT', duration: '35 min', avgHR: 165, maxHR: 189, strain: 18.9 },
    ];

    const exportToPDF = async () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();

        const darkBg = [17, 17, 17];
        const cardBg = [26, 26, 26];
        const white = [255, 255, 255];
        const gray = [102, 102, 102];
        const green = [16, 185, 129];
        const blue = [59, 130, 246];
        const purple = [139, 92, 246];
        const amber = [245, 158, 11];

        pdf.setFillColor(...darkBg);
        pdf.rect(0, 0, pageWidth, pdf.internal.pageSize.getHeight(), 'F');

        let y = 20;

        pdf.setFillColor(...cardBg);
        pdf.roundedRect(15, y, pageWidth - 30, 35, 3, 3, 'F');

        pdf.setFillColor(...green);
        pdf.circle(30, y + 17, 10, 'F');
        pdf.setTextColor(...white);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(athlete.name.charAt(0), 27, y + 21);

        pdf.setFontSize(18);
        pdf.setTextColor(...white);
        pdf.text(athlete.name, 45, y + 14);
        pdf.setFontSize(10);
        pdf.setTextColor(...gray);
        pdf.text(athlete.sport, 45, y +22);

        const statusColor = athlete.status.tolowerCase() === 'active' ? green : athlete.status.toLowerCase() === 'recovery' ? amber : [239, 68, 68];
        pdf.setFillColor(...statusColor);
        pdf.roundedRect(pageWidth - 50, y +10, 25, 8, 2, 2, 'F');
        pdf.setFontSize(7);
        pdf.text(athlete.status, pageWidth - 45, y + 15);

        pdf.setFontSize(8);
        pdf.setTextColor(...gray);
        pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 55, y + 30);

        y += 45;

        pdf.setFontSize(8);
        pdf.setTextColor(...gray);
        pdf.text("TODAY'S SNAPSHOT", 15, y);
        y += 8;

        const primarymetrics = [
            { label: 'Recovery', value: `${biometrics.recovery.score}%`, color: green },
            { label: 'Strain', value: biometrics.strain.daily, color: amber },
            { label: 'Sleep', value: `${biometrics.sleep.total}h`, color: purple },
            { label: 'HRV', value: `${biometrics.hrv.value} ms`, color: blue }
        ];

        const cardWidth = (pageWidth - 45) / 4;
        primarymetrics.forEach((metric, i) => {
            const x = 15 + (i * (cardWidth + 5));
            pdf.setFillColor(...cardBg);
            pdf.roundedRect(x, y, cardWidth, 28, 2, 2, 'F');

            pdf.setFillColor(...metric.color);
            pdf.rect(x, y + 2, 1.5, 24, 'F');

            pdf.setFontSize(7);
            pdf.setTextColor(...gray);
            pdf.text(metric.label.toUpperCase(), x + 5, y + 8);

            pdf.setFontSize(16);
            pdf.setTextColor(...white);
            pdf.text(metric.label.toUpperCase(), x + 5, y + 8);

            pdf.setFillColor(...metric.color);
            pdf.rect(x, y + 2, 1.5, 24, 'F');
            
            pdf.setFontSize(7);
            pdf.setTextColor(...gray);
            pdf.text(metric.label.toUpperCase(), x +5, y + 8);

            pdf.setFontSize(16);
            pdf.setTextColor(...white);
            pdf.setFont('helvetica', bold);
            pdf.text(String(metric.value), x + 5, y +20);
            pdf.setFont('hlevetica', 'normal');
        });

        y += 38;

        pdf.setFontSize(8);
        pdf.setTextColor(...gray);
        pdf.text("DETAILED BIOMETRICS", 15, y);
        y += 8;

        const detailedMetrics = [
            { label: 'Resting HR', value: biometrics.rhr.value, unit: 'bpm' },
            { label: 'VO₂ Max', value: biometrics.vo2max.value, unit: 'ml/kg/min' },
            { label: 'SpO₂', value: biometrics.spo2.value, unit: '%' },
            { label: 'Resp. Rate', value: biometrics.respiratoryRate.value, unit: 'brpm' },
            { label: 'Skin Temp', value: biometrics.skinTemp.value, unit: '°C' },
            { label: 'Sleep Eff.', value: biometrics.sleep.efficiency, unit: '%' }
        ];

        const smallCardWiddth = (pageWidth - 40) / 6;
        detailedMetrics.forEach((metric, i) => {
            const x = 15 + (i * (smallCardWidth + 3));
            pdf.setFillColor(...cardBg);
            pdf.roundedRect(x, y, smallCardWidth, 24, 2, 2, 'F');

            pdf.setFontSize(6);
            pdf.setTextColor(...gray);
            pdf.text(metric.label.toUpperCase(), x + 3, y + 7);

            pdf.setFontSize(12);
            pdf.setTextColor(...white);
            pdf.setFont('helvetica', 'bold');
            pdf.text(String(metric.value), x +3, y +15);
            pdf.setFont('helvetica', 'normal');

            pdf.setFontSize(6);
            pdf.setTextColor(...gray);
            pdf.text(metric.unit, x + 3, y + 20);
        });

        y += 34;

        pdf.setFontSize(8);
        pdf.setTextColor(...gray);
        pdf.text("SLEEP BREAKDOWN", 15, y);
        y += 8;

        const sleepData = [
            { label: 'Deep', value: biometrics.sleep.deep, color: purple },
            { label: 'REM', value: biometrics.sleep.rem, color: blue },
            { label: 'Light', value: (biometrics.sleep.total - biometrics.sleep.deep - biometrics.sleep.rem).toFixed(1), color: green }
        ];

        const sleepCardWidth = (pageWidth - 40) / 3;
        sleepData.forEach((sleep, i) => {
            const x = 15 + (i * (sleepCardWidth + 5));
            pdf.setFillColor(...cardBg);
            pdf.roundedRect(x, y, sleepCardWidth, 22, 2, 2, 'F');

            pdf.setFontSize(7);
            pdf.setTextColor(...gray);
            pdf.text(sleep.label.toUpperCase(), x + 5, y + 7);

            pdf.seFontSize(14);
            pdf.setTextColor(...white);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${sleep.value}h`, x + 5, y + 16);
            pdf.setFont('helvetica', 'normal');

            const barWidth = sleepCardWidth - 10;
            const fillWidth = (sleep.value / biometrics.sleep.total) * barWidth;
            pdf.setFillColor(42, 42, 42);
            pdf.roundedRect(x + 5, y + 18, barWidth, 2, 1, 1, 'F');
            pdf.setFillColor(...sleep.color);
            pdf.roundedRect(x + 5, y + 18, fillWidth, 2, 1, 1, 'F');
        });

        y += 32;

        pdf.setFontSize(8);
        pdf.setTextColor(...gray);
        pdf.text("RECENT SESSIONS", 15, y);
        y += 8;

        pdf.setFillColor(10, 10, 10);
        pdf.roundedRect(15, y, pageWidth -30, 8, 2, 2, 'F');
        pdf.setFontSizes(6);
        pdf.setTextColor(...gray);
        const headers = ['DATE', 'TYPE', 'DURATION', 'AVG HR', 'MAX HR', 'STRAIN'];
        const colWidths = [25, 40, 25, 25, 25, 20];
        let xPos = 20;
        headers.forEach((header, i) => {
            pdf.text(header, xPos, y + 5);
            xPos += colWidths[i];
        });
        y += 10;

        recentSessions.slice(0, 5).forEach((session, i) => {
            pdf.setFillColor(...(i % 2 === 0 ? cardBg : darkBg));
            pdf.rect(15, y, pageWidth - 30, 7, 'F');

            pdf.setFontSize(7);
            pdf.setTextColor(...white);

            xPos = 20;
            pdf.setTextColor(...gray);
            pdf.text(session.date, xPos, y + 5);
            xPos += colWidths[0];

            pdf.setTextColor(...white);
            pdf.setFont('helvetica', 'bold');
            pdf.text(session.type, xPos, y + 5);
            pdf.setFont('helvetica', 'normal');
            xPos += colWidths[1];

            pdf.setTextColor(...white);
            pdf.text(session.duration, xPos, y + 5);
            xPos += colWidths[2];

            pdf.text(`${session.avgHR} bpm`, xPos, y + 5);
            xPos += colWidths[3];

            
        });
    }

    return (
        <div className="athlete-detail-page">
            <button className="back-button" onClick={() => navigate(fromPage === 'dashboard' ? '/' : '/athletes')}>
            ← Back
            </button>

            <div className="athlete-detail-header">
                <div className="athlete-detail-avatar">
                    {athlete.name.charAt(0)}
                </div>
                <div className="athlete-detail-info">
                    <h1 className="athlete-detail-name">{athlete.name}</h1>
                    <p className="athlete-detail-sport">{athlete.sport}</p>
                </div>
                <span className={`status-indicator ${getStatusClass(athlete.status)}`}>
                    {athlete.status}
                </span>
            </div>

            <div className="section-title-inline">Today's Snapshot</div>
            <div className="biometrics-grid-primary">
                <div className={`metric-card-compact ${getStatusClass(biometrics.recovery.status)}`}>
                    <div className="metric-label-compact">Recovery Score</div>
                    <div className="metric-value-large">{biometrics.recovery.score}%</div>
                    <div className={`metric-trend ${getTrendClass(biometrics.recovery.trend)}`}>
                        {getTrendIcon(biometrics.recovery.trend)} {biometrics.recovery.trend}
                    </div>
                </div>

                <div className={`metric-card-compact ${getStatusClass(biometrics.strain.status)}`}>
                    <div className="metric-label-compact">Daily Strain</div>
                    <div className="metric-value-large">{biometrics.strain.daily}</div>
                    <div className={`metric-trend ${getTrendClass(biometrics.strain.trend)}`}>
                        {getTrendIcon(biometrics.strain.trend)} {biometrics.strain.trend}
                    </div>
                </div>

                <div className={`metric-card-compact ${getStatusClass(biometrics.sleep.status)}`}>
                    <div className="metric-label-compact">Sleep</div>
                    <div className="metric-value-large">{biometrics.sleep.total}h</div>
                    <div className={`metric-trend ${getTrendClass(biometrics.sleep.trend)}`}>
                        {getTrendIcon(biometrics.sleep.trend)} {biometrics.sleep.trend}h
                    </div>
                </div>

                <div className={`metric-card-compact ${getStatusClass(biometrics.hrv.status)}`}>
                    <div className="metric-label-compact">HRV</div>
                    <div className="metric-value-large">{biometrics.hrv.value}</div>
                    <div className={`metric-trend ${getTrendClass(biometrics.hrv.trend)}`}>
                        {getTrendIcon(biometrics.hrv.trend)} {biometrics.hrv.trend} {biometrics.hrv.unit}
                    </div>
                </div>
            </div>

            <div className="section-title-inline">Detailed Biometrics</div>
            <div className="biometrics-grid-detailed">
                <div className="metric-card-small">
                    <div className="metric-label-small">Resting HR</div>
                    <div className={`metric-value-medium ${getStatusClass(biometrics.rhr.status)}`}>
                        {biometrics.rhr.value}
                    </div>
                    <div className="metric-unit">{biometrics.rhr.unit}</div>
                    <div className={`metric-trend-small ${getTrendClass(biometrics.rhr.trend, true)}`}>
                        {getTrendIcon(biometrics.rhr.trend)} {biometrics.rhr.trend}
                    </div>
                </div>

                <div className="metric-card-small">
                    <div className="metric-label-small">VO₂ Max</div>
                    <div className={`metric-value-medium ${getStatusClass(biometrics.vo2max.status)}`}>
                        {biometrics.vo2max.value}
                    </div>
                    <div className="metric-unit">{biometrics.vo2max.unit}</div>
                    <div className={`metric-trend-small ${getTrendClass(biometrics.vo2max.trend)}`}>
                        {getTrendIcon(biometrics.vo2max.trend)} {biometrics.vo2max.trend}
                    </div>
                </div>

                <div className="metric-card-small">
                    <div className="metric-label-small">SpO₂</div>
                    <div className={`metric-value-medium ${getStatusClass(biometrics.spo2.status)}`}>
                        {biometrics.spo2.value}
                    </div>
                    <div className="metric-unit">{biometrics.spo2.unit}</div>
                    <div className={`metric-trend-small ${getTrendClass(biometrics.spo2.trend)}`}>
                        {getTrendIcon(biometrics.spo2.trend)} {biometrics.spo2.trend}
                    </div>
                </div>

                <div className="metric-card-small">
                    <div className="metric-label-small">Resp. Rate</div>
                    <div className={`metric-value-medium ${getStatusClass(biometrics.respiratoryRate.status)}`}>
                        {biometrics.respiratoryRate.value}
                    </div>
                    <div className="metric-unit">{biometrics.respiratoryRate.unit}</div>
                    <div className={`metric-trend-small ${getTrendClass(biometrics.respiratoryRate.trend)}`}>
                        {getTrendIcon(biometrics.respiratoryRate.trend)}
                    </div>
                </div>

                <div className="metric-card-small">
                    <div className="metric-label-small">Skin Temp</div>
                    <div className={`metric-value-medium ${getStatusClass(biometrics.skinTemp.status)}`}>
                        {biometrics.skinTemp.value}
                    </div>
                    <div className="metric-unit">{biometrics.skinTemp.unit}</div>
                    <div className={`metric-trend-small ${getTrendClass(biometrics.skinTemp.trend)}`}>
                        {getTrendIcon(biometrics.skinTemp.trend)} {biometrics.skinTemp.trend}
                    </div>
                </div>

                <div className="metric-card-small">
                    <div className="metric-label-small">Sleep Efficiency</div>
                    <div className={`metric-value-medium ${getStatusClass(biometrics.sleep.status)}`}>
                        {biometrics.sleep.efficiency}
                    </div>
                    <div className="metric-unit">%</div>
                </div>
            </div>

            <div className="section-title-inline">Sleep Breakdown</div>
            <div className="sleep-breakdown-grid">
                <div className="sleep-stat">
                    <div className="sleep-label">Deep</div>
                    <div className="sleep-value">{biometrics.sleep.deep}h</div>
                    <div className="sleep-bar">
                    <div className="sleep-bar-fill deep" style={{ width: `${(biometrics.sleep.deep / biometrics.sleep.total) * 100}%` }}></div>
                    </div>
                </div>
                <div className="sleep-stat">
                    <div className="sleep-label">REM</div>
                    <div className="sleep-value">{biometrics.sleep.rem}h</div>
                    <div className="sleep-bar">
                        <div className="sleep-bar-fill rem" style={{ width: `${(biometrics.sleep.rem / biometrics.sleep.total) * 100}%` }}></div>
                    </div>
                </div>
                <div className="sleep-stat">
                    <div className="sleep-label">Light</div>
                    <div className="sleep-value">{(biometrics.sleep.total - biometrics.sleep.deep -  biometrics.sleep.rem).toFixed(1)}h</div>
                    <div className="sleep-bar">
                        <div className="sleep-bar-fill light" style={{ width: `${((biometrics.sleep.total - biometrics.sleep.deep -  biometrics.sleep.rem) / biometrics.sleep.total) * 100}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Activity & Calories */}
            <div className="section-title-inline">Activity</div>
            <div className="activity-grid">
                <div className="metric-card-small">
                    <div className="metric-label-small">Total Calories</div>
                    <div className="metric-value-medium">{biometrics.calories.total}</div>
                    <div className="metric-unit">kcal</div>
                    <div className={`metric-trend-small ${getTrendClass(biometrics.calories.trend)}`}>
                        {getTrendIcon(biometrics.calories.trend)} {biometrics.calories.trend}
                    </div>
                </div>
                <div className="metric-card-small">
                    <div className="metric-label-small">Active Calories</div>
                    <div className="metric-value-medium">{biometrics.calories.active}</div>
                    <div className="metric-unit">kcal</div>
                </div>
            </div>

            {/* Recent Sessions Table */}
            <div className="section-title-inline">Recent Sessions</div>
            <div className="sessions-table-container">
                <table className="sessions-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Duration</th>
                            <th>Avg HR</th>
                            <th>Max HR</th>
                            <th>Strain</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentSessions.map((session) => (
                            <tr key={session.id}>
                                <td className="session-date-cell">{session.date}</td>
                                <td className="session-type-cell">{session.type}</td>
                                <td>{session.duration}</td>
                                <td>{session.avgHR} bpm</td>
                                <td>{session.maxHR} bpm</td>
                                <td className={session.strain > 15 ? 'strain-high' : session.strain > 10 ? 'strain-medium' : 'strain-low'}>
                                    {session.strain}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Analytics Charts */}
            <div className="charts-section">
                <div className="section-title-inline" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Performance Analytics</span>
                    <div className="time-filter">
                        <button className={`time-filter-btn ${timeRange === '7d' ? 'active' : ''}`} onClick={() => setTimeRange('7d')}>7D</button>
                        <button className={`time-filter-btn ${timeRange === '14d' ? 'active' : ''}`} onClick={() => setTimeRange('14d')}>14D</button>
                        <button className={`time-filter-btn ${timeRange === '30d' ? 'active' : ''}`} onClick={() => setTimeRange('30d')}>30D</button>
                    </div>
                </div>

                <div className="charts-grid">
                    <div className="chart-card">
                        <div className="chart-header">
                            <span className="chart-title">Recovery Score</span>
                            <span className="chart-period">Daily</span>
                        </div>
                        <RecoveryChart data={filteredData} />
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <span className="chart-title">Heart Rate Variability</span>
                            <span className="chart-period">Daily</span>
                        </div>
                        <HRVChart data={filteredData} />
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <span className="chart-title">Daily Strain</span>
                            <span className="chart-period">Daily</span>
                        </div>
                        <StrainChart data={filteredData} />
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <span className="chart-title">Sleep Duration</span>
                            <span className="chart-period">vs 8h target</span>
                        </div>
                        <SleepChart data={filteredData} />
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <span className="chart-title">Weekly Trends</span>
                            <span className="chart-period">8 weeks</span>
                        </div>
                        <WeeklyTrendChart data={historicalData.weeklyData} />
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <span className="chart-title">Session Types</span>
                            <span className="chart-period">30 days</span>
                        </div>
                        <SessionPieChart data={historicalData.sessionBreakdown} />
                    </div>
                </div>
            </div>


            <div className="section-title-inline">Coach Notes</div>
            <div className="notes-container-compact">
                <textarea
                    className="notes-input-compact"
                    placeholder="Quick notes about this athlete..."
                    rows="3"
                />
                <button className="save-notes-btn-compact">Save</button>
            </div>
        </div>
    );
};

export default AthleteDetail;

