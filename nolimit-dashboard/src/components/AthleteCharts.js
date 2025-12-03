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
                <XAxis dataKey="dateShort" stroke="#666" tick={{ fontSize: 11 }} tickLine={false} interval="preserveStartEnd" />
                <YAxis stroke="#666" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="hrv" stroke="#3b82f6" strokeWidth={2} fill={darkMode ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)'} />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export const StrainChart = ({ data, darkMode = true }) => {
    const getColor = (strain) => strain >= 15 ? '#ef4444' : strain >= 10 ? '#f59e0b' : '#10b981';

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={tooltipStyle(darkMode)}>
                    <p style={{ color: '#666', fontSize: '0.75rem', marginBottom: '4px' }}>{label}</p>
                    <p style={{ color: getColor(payload[0].value), fontSize: '1.1rem', fontWeight: 600 }}>{payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1a1a1a' : '#e5e5e5'} vertical={false} />
                <XAxis dataKey="dateShort" stroke="#666" tick={{ fontSize: 11 }} tickLine={false} interval="preserveStartEnd" />
                <YAxis stroke="#666" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 21]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="strain" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={index} fill={getColor(entry.strain)} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export const SleepChart = ({ data, darkMode = true }) => {
    const dataWithTarget = data.map(d => ({ ...d, target: 8 }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={tooltipStyle(darkMode)}>
                    <p style={{ color: '#666', fontSize: '0.75rem', marginBottom: '4px' }}>{label}</p>
                    <p style={{ color: '#8b5cf6', fontSize: '1.1rem', fontWeight: 600 }}>{payload[0]?.value}h</p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={dataWithTarget} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1a1a1a' : '#e5e5e5'} vertical={false} />
                <XAxis dataKey="dateShort" stroke="#666" tick={{ fontSize: 11 }} tickLine={false} interval="preserveStartEnd" />
                <YAxis stroke="#666" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 12]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sleep" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="target" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export const WeeklyTrendChart = ({ data, darkMode = true }) => {
    const normalized = data.map(d => ({ ...d, strainNorm: (d.avgStrain / 21) * 100 }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={tooltipStyle(darkMode)}>
                    <p style={{ color: '#666', fontSize: '0.75rem', marginBottom: '8px' }}>{label}</p>
                    <p style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>Recovery: {payload[0]?.payload.avgRecovery}%</p>
                    <p style={{ color: '#f59e0b', fontSize: '0.85rem', fontWeight: 600 }}>Strain: {payload[0]?.payload.avgStrain}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={normalized} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1a1a1a' : '#e5e5e5'} vertical={false} />
                <XAxis dataKey="week" stroke="#666" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis stroke="#666" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="avgRecovery" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="strainNorm" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export const SessionPieChart = ({ data, darkMode = true }) => {
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={tooltipStyle(darkMode)}>
                    <p style={{ color: payload[0].payload.color, fontSize: '0.9rem', fontWeight: 600 }}>
                        {payload[0].name}: {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="sessions" nameKey="type">
                    {data.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
            </PieChart>
        </ResponsiveContainer>
    );
};
