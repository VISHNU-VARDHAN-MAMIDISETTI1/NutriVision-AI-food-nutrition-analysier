"use client";
import { useState, useEffect } from "react";
import { Activity, Heart, Zap, Flame, ShieldCheck, ShieldAlert, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell } from 'recharts';

export default function Dashboard() {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({
        totalCalories: 0,
        avgHealthScore: 0,
        totalMeals: 0,
        macros: { protein: 0, carbs: 0, fats: 0, fiber: 0 }
    });

    useEffect(() => {
        const saved = localStorage.getItem('nutrivision_history');
        if (saved) {
            const parsedLogs = JSON.parse(saved);
            setLogs(parsedLogs);

            let cal = 0, health = 0, p = 0, c = 0, f = 0, fib = 0;
            parsedLogs.forEach(log => {
                cal += log.calories || 0;
                health += log.health_score || 0;
                log.macrosList?.forEach(m => {
                    if (m.name === 'Protein') p += m.value;
                    if (m.name === 'Carbs') c += m.value;
                    if (m.name === 'Fats') f += m.value;
                    if (m.name === 'Fiber') fib += m.value;
                });
            });

            setStats({
                totalCalories: cal,
                avgHealthScore: parsedLogs.length > 0 ? (health / parsedLogs.length).toFixed(1) : 0,
                totalMeals: parsedLogs.length,
                macros: { protein: p, carbs: c, fats: f, fiber: fib }
            });
        }
    }, []);

    // Format data for time-series chart
    const timeData = [...logs].reverse().map((log, i) => ({
        name: `Meal ${i + 1}`,
        calories: log.calories,
        score: log.health_score
    }));

    const macroData = [
        { name: 'Protein', value: stats.macros.protein, fill: '#12b886' },
        { name: 'Carbs', value: stats.macros.carbs, fill: '#ff8787' },
        { name: 'Fats', value: stats.macros.fats, fill: '#ffd43b' },
        { name: 'Fiber', value: stats.macros.fiber, fill: '#4dabf7' }
    ];

    return (
        <div className="animate-fade-in" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", marginTop: "1rem" }}>
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "2rem", display: "flex", alignItems: "center", gap: "0.8rem", color: "var(--text-light)" }}>
                    <Target size={28} color="var(--primary)" /> Nutrition Insights
                </h1>
                <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>Aggregated analysis of your logged meals.</p>
            </div>

            {logs.length === 0 ? (
                <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                    <p style={{ fontSize: "1.2rem" }}>No data to display. Start logging meals in the Analyzer!</p>
                </div>
            ) : (
                <div style={{ display: "grid", gap: "2rem" }}>

                    {/* Top KPI Cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
                        <div className="light-card" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                            <div style={{ padding: "1rem", background: "rgba(255,135,135,0.1)", borderRadius: "50%", color: "var(--accent)" }}><Flame size={32} /></div>
                            <div>
                                <div style={{ fontSize: "2rem", fontWeight: "700" }}>{stats.totalCalories}</div>
                                <div style={{ color: "var(--text-muted)" }}>Total Calories</div>
                            </div>
                        </div>
                        <div className="light-card" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                            <div style={{ padding: "1rem", background: "rgba(18,184,134,0.1)", borderRadius: "50%", color: "var(--primary)" }}><Heart size={32} /></div>
                            <div>
                                <div style={{ fontSize: "2rem", fontWeight: "700" }}>{stats.avgHealthScore}/10</div>
                                <div style={{ color: "var(--text-muted)" }}>Avg Health Score</div>
                            </div>
                        </div>
                        <div className="light-card" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                            <div style={{ padding: "1rem", background: "rgba(77,171,247,0.1)", borderRadius: "50%", color: "#4dabf7" }}><Activity size={32} /></div>
                            <div>
                                <div style={{ fontSize: "2rem", fontWeight: "700" }}>{stats.totalMeals}</div>
                                <div style={{ color: "var(--text-muted)" }}>Meals Logged</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
                        {/* Calorie Trend Chart */}
                        <div className="glass-panel" style={{ padding: "1.5rem" }}>
                            <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "1.5rem", color: "var(--text-light)" }}>Caloric Trend</h3>
                            <div style={{ height: "300px" }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={timeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                                        <YAxis stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--surface-border)', borderRadius: '8px' }} />
                                        <Area type="monotone" dataKey="calories" stroke="var(--accent)" fillOpacity={1} fill="url(#colorCal)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Total Macros Bar Chart */}
                        <div className="light-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
                            <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "1.5rem" }}>Aggregate Macros</h3>
                            <div style={{ flex: 1, minHeight: "250px" }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={macroData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                                        <Bar dataKey="value" radius={[0, 4, 4, 0]} label={{ position: 'right', fill: 'var(--text-muted)' }}>
                                            {macroData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Recent Meals Classification */}
                    <div>
                        <h3 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "1.5rem", color: "var(--text-light)" }}>Recent Meal Classifications</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
                            {logs.slice(0, 6).map((log, i) => {
                                const isHealthy = log.health_score >= 6.5;
                                return (
                                    <div key={i} className="glass-panel" style={{ padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div>
                                            <div style={{ fontWeight: "600", color: "var(--text-light)", marginBottom: "0.2rem" }}>{log.name}</div>
                                            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{log.calories} Cal &bull; Score: {log.health_score}/10</div>
                                        </div>
                                        <div>
                                            {isHealthy ? (
                                                <div style={{ background: "rgba(18,184,134,0.1)", color: "var(--primary)", padding: "0.3rem 0.8rem", borderRadius: "30px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.3rem", fontWeight: "600" }}>
                                                    <ShieldCheck size={14} /> Healthy
                                                </div>
                                            ) : (
                                                <div style={{ background: "rgba(255,135,135,0.1)", color: "var(--accent)", padding: "0.3rem 0.8rem", borderRadius: "30px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.3rem", fontWeight: "600" }}>
                                                    <ShieldAlert size={14} /> Unhealthy
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
