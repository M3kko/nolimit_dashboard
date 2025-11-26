import React from 'react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, ComposedChart,
    PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine
} from 'recharts';

const tooltipStyle = (darkMode) => ({
    background: darkMode ? '#111111' : '#ffffff',
    border: `1px solid ${darkMode ? '#2a2a2a' : '#e5e5e5'}`,
    borderRadius: '8px',
    padding: '10px 14px',
});

export const RecoveryChart = ({ data, darkMode = true }) => {
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={tooltipStyle(darkMode)}>
                    <p style={{ color: '#666', fontSize: '0.75rem', marginBottom: '4px' }}>{label}</p>
                    <p style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: 600 }}>{payload[0].value}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1a1a1a' : '#e5e5e5'} vertical={false} />
            <XAxis dataKey="dateShort" stroke="#666" tick={{ fontSize: 11 }} tickLine={false} interval="preserveStartEnd" />
            <YAxis stroke="#666" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={70} stroke="#f59e0b" strokeDasharray="5 5" strokeOpacity={0.5} />
            <Line type="monotone" dataKey="recovery" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export const HRVChart = ({ data, darkMode = true }) => {
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={tooltipStyle(darkMode)}>
                    <p style={{ color: '#666', fontSize: '0.75rem', marginBottom: '4px' }}>{label}</p>
                    <p style={{ color: '#3b82f6', fontSize: '1.1rem', fontWeight: 600 }}>{payload[0].value} ms</p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={200}>
             <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
             <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1a1a1a' : '#e5e5e5'} vertical={false} />
             </AreaChart>
        </ResponsiveContainer>
    )
}
