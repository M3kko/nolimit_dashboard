import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './AthleteDetail.css';
import { getAthleteHistoricalData } from './data/athleteHistoricalData';
import { RecoveryChart, HRVChart, StrainChart, SleepChart, WeeklyTrendChart, SessionPieChart } from './components/AthleteCharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const AthleteDetail = ({ athletesData, darkMode }) => {
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
        // Temporarily force light mode on charts for PDF export
        const chartsSection = document.querySelector('.charts-grid');
        const chartCards = chartsSection.querySelectorAll('.chart-card');
        const chartTitles = chartsSection.querySelectorAll('.chart-title');

        // Store original styles
        const originalStyles = [];
        chartCards.forEach((card, i) => {
            originalStyles[i] = {
                background: card.style.background,
                borderColor: card.style.borderColor
            };
            card.style.background = '#ffffff';
            card.style.borderColor = '#e5e5e5';
        });

        const originalTitleColors = [];
        chartTitles.forEach((title, i) => {
            originalTitleColors[i] = title.style.color;
            title.style.color = '#1a1a1a';
        });

        // Capture charts
        const chartCanvas = await html2canvas(chartsSection, {
            backgroundColor: '#ffffff',
            scale: 2
        });

        // Restore original styles
        chartCards.forEach((card, i) => {
            card.style.background = originalStyles[i].background;
            card.style.borderColor = originalStyles[i].borderColor;
        });
        chartTitles.forEach((title, i) => {
            title.style.color = originalTitleColors[i];
        });

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pageWidth - (margin * 2);

        // Helper functions
        const drawLine = (y) => {
            pdf.setDrawColor(200, 200, 200);
            pdf.setLineWidth(0.1);
            pdf.line(margin, y, pageWidth - margin, y);
        };

        const sectionTitle = (title, y) => {
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(40, 40, 40);
            pdf.text(title, margin, y);
            return y + 2;
        };

        const addNewPage = () => {
            pdf.addPage();
            return 20;
        };

        let y = 15;

        // === HEADER ===
        pdf.setFillColor(245, 245, 245);
        pdf.rect(0, 0, pageWidth, 45, 'F');

        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(30, 30, 30);
        pdf.text('ATHLETE PERFORMANCE REPORT', margin, 20);

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Confidential Medical/Training Document`, margin, 27);

        pdf.setFontSize(9);
        pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin - 50, 20);
        pdf.text(`Report ID: ${Date.now().toString(36).toUpperCase()}`, pageWidth - margin - 50, 26);

        y = 55;

        // === ATHLETE INFORMATION ===
        y = sectionTitle('ATHLETE INFORMATION', y);
        y += 5;

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);

        const infoCol1 = [
            ['Name:', athlete.name],
            ['Sport:', athlete.sport],
            ['Status:', athlete.status.toUpperCase()],
            ['Athlete ID:', `ATH-${String(athlete.id).padStart(4, '0')}`]
        ];

        const infoCol2 = [
            ['Age:', '24 years'],
            ['Height:', '183 cm / 6\'0"'],
            ['Weight:', '78 kg / 172 lbs'],
            ['Body Fat:', '12.4%']
        ];

        infoCol1.forEach((row, i) => {
            pdf.setFont('helvetica', 'bold');
            pdf.text(row[0], margin, y + (i * 5));
            pdf.setFont('helvetica', 'normal');
            pdf.text(row[1], margin + 25, y + (i * 5));
        });

        infoCol2.forEach((row, i) => {
            pdf.setFont('helvetica', 'bold');
            pdf.text(row[0], margin + 80, y + (i * 5));
            pdf.setFont('helvetica', 'normal');
            pdf.text(row[1], margin + 105, y + (i * 5));
        });

        y += 25;
        drawLine(y);
        y += 8;

        // === CURRENT BIOMETRICS ===
        y = sectionTitle('CURRENT BIOMETRICS (Today\'s Reading)', y);
        y += 6;

        pdf.setFontSize(8);
        const bioData = [
            ['METRIC', 'VALUE', 'UNIT', 'TREND', 'STATUS', 'REFERENCE RANGE'],
            ['Recovery Score', biometrics.recovery.score, '%', biometrics.recovery.trend, biometrics.recovery.status.toUpperCase(), '70-100% optimal'],
            ['HRV (RMSSD)', biometrics.hrv.value, 'ms', biometrics.hrv.trend, biometrics.hrv.status.toUpperCase(), '50-100ms normal'],
            ['Resting Heart Rate', biometrics.rhr.value, 'bpm', biometrics.rhr.trend, biometrics.rhr.status.toUpperCase(), '40-60 bpm athletic'],
            ['Daily Strain', biometrics.strain.daily, '/21', biometrics.strain.trend, biometrics.strain.status.toUpperCase(), '10-14 moderate'],
            ['VO2 Max', biometrics.vo2max.value, 'ml/kg/min', biometrics.vo2max.trend, biometrics.vo2max.status.toUpperCase(), '>50 excellent'],
            ['SpO2', biometrics.spo2.value, '%', biometrics.spo2.trend, biometrics.spo2.status.toUpperCase(), '95-100% normal'],
            ['Respiratory Rate', biometrics.respiratoryRate.value, 'brpm', biometrics.respiratoryRate.trend, biometrics.respiratoryRate.status.toUpperCase(), '12-20 brpm normal'],
            ['Skin Temperature', biometrics.skinTemp.value, '°C', biometrics.skinTemp.trend, biometrics.skinTemp.status.toUpperCase(), '33-34°C normal']
        ];

        const colWidths = [35, 18, 22, 15, 25, 40];
        let xPos = margin;

        // Table header
        pdf.setFillColor(50, 50, 50);
        pdf.rect(margin, y, contentWidth, 6, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        bioData[0].forEach((header, i) => {
            pdf.text(header, xPos + 2, y + 4);
            xPos += colWidths[i];
        });
        y += 6;

        // Table rows
        pdf.setTextColor(40, 40, 40);
        bioData.slice(1).forEach((row, rowIndex) => {
            if (rowIndex % 2 === 0) {
                pdf.setFillColor(248, 248, 248);
                pdf.rect(margin, y, contentWidth, 5, 'F');
            }
            xPos = margin;
            row.forEach((cell, i) => {
                pdf.setFont('helvetica', i === 0 ? 'bold' : 'normal');
                if (i === 4) {
                    const status = String(cell);
                    if (status === 'EXCELLENT') pdf.setTextColor(16, 185, 129);
                    else if (status === 'GOOD') pdf.setTextColor(59, 130, 246);
                    else if (status === 'MODERATE') pdf.setTextColor(245, 158, 11);
                    else pdf.setTextColor(239, 68, 68);
                }
                pdf.text(String(cell), xPos + 2, y + 3.5);
                pdf.setTextColor(40, 40, 40);
                xPos += colWidths[i];
            });
            y += 5;
        });

        y += 5;
        drawLine(y);
        y += 8;

        // === SLEEP ANALYSIS ===
        y = sectionTitle('SLEEP ANALYSIS', y);
        y += 6;

        const sleepAnalysis = [
            ['Total Sleep Duration', `${biometrics.sleep.total} hours`, biometrics.sleep.trend + 'h from avg', '7-9 hours recommended'],
            ['Deep Sleep', `${biometrics.sleep.deep} hours (${((biometrics.sleep.deep/biometrics.sleep.total)*100).toFixed(0)}%)`, '-', '1.5-2 hours (13-23%)'],
            ['REM Sleep', `${biometrics.sleep.rem} hours (${((biometrics.sleep.rem/biometrics.sleep.total)*100).toFixed(0)}%)`, '-', '1.5-2 hours (20-25%)'],
            ['Light Sleep', `${(biometrics.sleep.total - biometrics.sleep.deep - biometrics.sleep.rem).toFixed(1)} hours`, '-', '50% of total'],
            ['Sleep Efficiency', `${biometrics.sleep.efficiency}%`, '-', '>85% good']
        ];

        pdf.setFontSize(8);
        sleepAnalysis.forEach((row, i) => {
            if (i % 2 === 0) {
                pdf.setFillColor(248, 248, 248);
                pdf.rect(margin, y, contentWidth, 5, 'F');
            }
            pdf.setFont('helvetica', 'bold');
            pdf.text(row[0], margin + 2, y + 3.5);
            pdf.setFont('helvetica', 'normal');
            pdf.text(row[1], margin + 50, y + 3.5);
            pdf.text(row[2], margin + 95, y + 3.5);
            pdf.setTextColor(100, 100, 100);
            pdf.text(row[3], margin + 125, y + 3.5);
            pdf.setTextColor(40, 40, 40);
            y += 5;
        });

        y += 5;
        drawLine(y);
        y += 8;

        // === CALORIC/ENERGY DATA ===
        y = sectionTitle('ENERGY EXPENDITURE', y);
        y += 6;

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Total Daily Energy Expenditure: ${biometrics.calories.total} kcal`, margin, y);
        pdf.text(`Active Calories: ${biometrics.calories.active} kcal`, margin + 70, y);
        pdf.text(`Basal Metabolic Rate: ${biometrics.calories.total - biometrics.calories.active} kcal (est.)`, margin + 120, y);
        y += 8;

        drawLine(y);
        y += 8;

        // === TRAINING SESSIONS ===
        y = sectionTitle('RECENT TRAINING SESSIONS', y);
        y += 6;

        const sessionHeaders = ['DATE', 'SESSION TYPE', 'DURATION', 'AVG HR', 'MAX HR', 'STRAIN', 'ZONE'];
        const sessionColWidths = [22, 35, 20, 20, 20, 18, 30];

        pdf.setFillColor(50, 50, 50);
        pdf.rect(margin, y, contentWidth, 6, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7);
        xPos = margin;
        sessionHeaders.forEach((header, i) => {
            pdf.text(header, xPos + 1, y + 4);
            xPos += sessionColWidths[i];
        });
        y += 6;

        pdf.setTextColor(40, 40, 40);
        recentSessions.forEach((session, rowIndex) => {
            if (rowIndex % 2 === 0) {
                pdf.setFillColor(248, 248, 248);
                pdf.rect(margin, y, contentWidth, 5, 'F');
            }
            xPos = margin;
            const zone = session.strain > 15 ? 'HIGH INTENSITY' : session.strain > 10 ? 'MODERATE' : 'RECOVERY';
            const rowData = [session.date, session.type, session.duration, `${session.avgHR} bpm`, `${session.maxHR} bpm`, session.strain.toString(), zone];
            rowData.forEach((cell, i) => {
                pdf.setFont('helvetica', i === 1 ? 'bold' : 'normal');
                if (i === 6) {
                    if (cell === 'HIGH INTENSITY') pdf.setTextColor(239, 68, 68);
                    else if (cell === 'MODERATE') pdf.setTextColor(245, 158, 11);
                    else pdf.setTextColor(16, 185, 129);
                }
                pdf.text(cell, xPos + 1, y + 3.5);
                pdf.setTextColor(40, 40, 40);
                xPos += sessionColWidths[i];
            });
            y += 5;
        });

        // === PAGE 2: CHARTS ===
        y = addNewPage();

        pdf.setFillColor(245, 245, 245);
        pdf.rect(0, 0, pageWidth, 20, 'F');
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(30, 30, 30);
        pdf.text('PERFORMANCE ANALYTICS & TRENDS', margin, 13);

        y = 30;

        // Add charts image
        const imgData = chartCanvas.toDataURL('image/png');
        const imgWidth = contentWidth;
        const imgHeight = (chartCanvas.height / chartCanvas.width) * imgWidth;
        pdf.addImage(imgData, 'PNG', margin, y, imgWidth, Math.min(imgHeight, 180));

        y += Math.min(imgHeight, 180) + 10;

        // === CLINICAL NOTES SECTION ===
        if (y > pageHeight - 60) {
            y = addNewPage();
        }

        drawLine(y);
        y += 8;
        y = sectionTitle('CLINICAL NOTES / OBSERVATIONS', y);
        y += 5;

        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);

        const notes = [
            '• Recovery metrics indicate athlete is responding well to current training load.',
            '• HRV trending upward suggests good adaptation and readiness for increased intensity.',
            '• Sleep architecture shows adequate deep sleep; consider optimizing REM if performance plateaus.',
            '• Recommend maintaining current strain levels (10-15) for optimal progressive overload.',
            '• SpO2 and respiratory rate within normal limits - no respiratory concerns noted.'
        ];

        notes.forEach(note => {
            pdf.text(note, margin, y);
            y += 5;
        });

        y += 5;
        drawLine(y);
        y += 8;

        // === FOOTER ===
        pdf.setFontSize(7);
        pdf.setTextColor(150, 150, 150);
        pdf.text('CONFIDENTIAL - For authorized medical and coaching personnel only', margin, pageHeight - 15);
        pdf.text(`NoLimit Athletic Performance System | ${athlete.name} | ${new Date().toLocaleDateString()}`, margin, pageHeight - 10);
        pdf.text('Page 2 of 2', pageWidth - margin - 20, pageHeight - 10);

        // Add page number to first page
        pdf.setPage(1);
        pdf.setFontSize(7);
        pdf.setTextColor(150, 150, 150);
        pdf.text('CONFIDENTIAL - For authorized medical and coaching personnel only', margin, pageHeight - 15);
        pdf.text(`NoLimit Athletic Performance System | ${athlete.name} | ${new Date().toLocaleDateString()}`, margin, pageHeight - 10);
        pdf.text('Page 1 of 2', pageWidth - margin - 20, pageHeight - 10);

        pdf.save(`${athlete.name.toLowerCase().replace(' ', '_')}_medical_report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <div className="athlete-detail-page">
            <div className="athlete-detail-actions">
                <button className="back-button" onClick={() => navigate(fromPage === 'dashboard' ? '/' : '/athletes')}>
                    ← Back
                </button>
                <button className="export-btn" onClick={exportToPDF}>
                    Export PDF
                </button>
            </div>

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
                        <RecoveryChart data={filteredData} darkMode={darkMode} />
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <span className="chart-title">Heart Rate Variability</span>
                            <span className="chart-period">Daily</span>
                        </div>
                        <HRVChart data={filteredData} darkMode={darkMode} />
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <span className="chart-title">Daily Strain</span>
                            <span className="chart-period">Daily</span>
                        </div>
                        <StrainChart data={filteredData} darkMode={darkMode} />
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <span className="chart-title">Sleep Duration</span>
                            <span className="chart-period">vs 8h target</span>
                        </div>
                        <SleepChart data={filteredData} darkMode={darkMode} />
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <span className="chart-title">Weekly Trends</span>
                            <span className="chart-period">8 weeks</span>
                        </div>
                        <WeeklyTrendChart data={historicalData.weeklyData} darkMode={darkMode} />
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <span className="chart-title">Session Types</span>
                            <span className="chart-period">30 days</span>
                        </div>
                        <SessionPieChart data={historicalData.sessionBreakdown} darkMode={darkMode} />
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

