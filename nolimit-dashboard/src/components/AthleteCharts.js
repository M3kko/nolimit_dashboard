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
        
    )
}