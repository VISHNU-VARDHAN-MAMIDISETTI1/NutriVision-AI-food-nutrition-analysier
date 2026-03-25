"use client";
import { useState, useEffect } from "react";
import { History as HistoryIcon, Zap, Heart, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function History() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('nutrivision_history');
        if (saved) {
            setLogs(JSON.parse(saved));
        }
    }, []);

    const clearHistory = () => {
        localStorage.removeItem('nutrivision_history');
        setLogs([]);
    };

    const COLORS = ['#12b886', '#ff8787', '#ffd43b', '#4dabf7'];

    return (
        <div className="animate-fade-in" style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto", marginTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "2rem", display: "flex", alignItems: "center", gap: "0.8rem", color: "var(--text-light)" }}>
                    <HistoryIcon size={28} color="var(--primary)" /> Food History
                </h1>
                {logs.length > 0 && (
                    <button onClick={clearHistory} className="btn" style={{ background: "rgba(255,0,0,0.1)", color: "#ff8787", padding: "0.5rem 1rem", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Trash2 size={16} /> Clear All
                    </button>
                )}
            </div>

            {logs.length === 0 ? (
                <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                    <p style={{ fontSize: "1.2rem" }}>No history found. Head to the Analyzer to log your first meal!</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {logs.map((log, index) => (
                        <div key={index} className="light-card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", padding: "1.5rem" }}>
                            <div style={{ borderRight: "1px solid rgba(0,0,0,0.05)", paddingRight: "2rem" }}>
                                <h3 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "0.3rem" }}>{log.name}</h3>
                                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
                                    {new Date(log.timestamp).toLocaleString()}
                                </p>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                    <Zap size={18} color="var(--primary)" />
                                    <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>{log.calories} Calories</span>
                                </div>
                                {log.health_score && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)" }}>
                                        <Heart size={16} color="var(--accent)" />
                                        <span>Health Score: {log.health_score}/10</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h4 style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: "1rem" }}>Macronutrients</h4>
                                <div style={{ display: "flex", gap: "2rem" }}>
                                    <div style={{ flex: 1, height: "100px" }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={log.macrosList} innerRadius={20} outerRadius={40} paddingAngle={5} dataKey="value">
                                                    {log.macrosList.map((entry, i) => (
                                                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ borderRadius: '8px', padding: '5px' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div style={{ flex: 2, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.8rem", alignContent: "center" }}>
                                        {log.macrosList.map((m, i) => (
                                            <div key={m.name} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                                                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i] }} />
                                                    {m.name}
                                                </span>
                                                <span><strong>{m.value}g</strong></span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
