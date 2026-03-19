"use client";
import { useState, useEffect } from "react";
import { analyzeFoodImage, chatWithAI } from "../lib/api";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Camera, Upload, Send, Activity, Heart, Zap, Search, History } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [foodData, setFoodData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', content: 'Here are some balanced options for you! What can I help you track today?' }
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [historyLogs, setHistoryLogs] = useState([]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('nutrivision_history');
    if (saved) setHistoryLogs(JSON.parse(saved));
  }, []);

  const saveToHistory = (data) => {
    const newLog = { ...data, timestamp: new Date().toISOString() };
    const updated = [newLog, ...historyLogs];
    setHistoryLogs(updated);
    localStorage.setItem('nutrivision_history', JSON.stringify(updated));
  };

  const COLORS = ['#12b886', '#ff8787', '#ffd43b', '#4dabf7'];

  const handleAnalysis = async (inputObj) => {
    setLoading(true);
    setFoodData(null);
    try {
      const data = await analyzeFoodImage(inputObj);
      const macrosList = [
        { name: 'Protein', value: data.macros.protein || 0 },
        { name: 'Carbs', value: data.macros.carbs || 0 },
        { name: 'Fats', value: data.macros.fats || 0 },
        { name: 'Fiber', value: data.macros.fiber || 0 }
      ];

      const microsData = Object.entries(data.micros || {}).map(([key, val]) => ({
        subject: key, A: parseInt(val.replace('%', '')) || 0, fullMark: 100
      }));

      const finalData = { ...data, macrosList, microsData };
      setFoodData(finalData);
      saveToHistory(finalData);

      setChatMessages(prev => [...prev, { role: 'ai', content: `I've analyzed your ${data.name}! It contains roughly ${data.calories} calories. What would you like to know about it?` }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'ai', content: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) handleAnalysis({ file });
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) handleAnalysis({ text: textInput });
  };

  const handleChatSend = async () => {
    if (!inputMsg.trim()) return;
    const msg = inputMsg;
    setChatMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInputMsg("");

    try {
      const contextName = foodData ? foodData.name : "";
      const data = await chatWithAI(msg, contextName);
      setChatMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'ai', content: `Error: ${err.message}` }]);
    }
  };

  return (
    <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "2rem", marginTop: "1rem" }}>
      {/* Left Column: Input Methods & History Shortcut */}
      <div className="flex-col gap-8" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Input Methods */}
        <div className="glass-panel animate-fade-in" style={{ padding: "2rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "var(--text-light)" }}>Log Your Meal</h2>

          <form onSubmit={handleTextSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="E.g., 2 slices avocado toast, 1 boiled egg..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              style={{ flex: 1, padding: "0.8rem", borderRadius: "var(--radius-sm)", border: "none", background: "rgba(255,255,255,0.1)", color: "white" }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: "0 1.5rem", borderRadius: "var(--radius-sm)" }}><Search size={20} /></button>
          </form>

          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ flex: 1, padding: "2rem 1rem", border: "2px dashed var(--surface-border)", borderRadius: "var(--radius-sm)", cursor: "pointer", position: "relative" }} className="upload-dropzone">
              <Upload size={28} color="var(--primary)" style={{ margin: "0 auto", marginBottom: "1rem" }} />
              <p style={{ color: "var(--text-light)", fontSize: "0.9rem" }}>Upload from Gallery</p>
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }} />
            </div>

            <div style={{ flex: 1, padding: "2rem 1rem", border: "2px solid var(--surface-border)", background: "rgba(18,184,134,0.05)", borderRadius: "var(--radius-sm)", cursor: "pointer", position: "relative" }} className="upload-dropzone">
              <Camera size={28} color="var(--primary)" style={{ margin: "0 auto", marginBottom: "1rem" }} />
              <p style={{ color: "var(--text-light)", fontSize: "0.9rem" }}>Take a Photo</p>
              {/* The capture="environment" attribute naturally opens the rear camera on mobile devices! */}
              <input type="file" accept="image/*" capture="environment" onChange={handleFileUpload} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }} />
            </div>
          </div>
          {loading && <p style={{ marginTop: "1rem", color: "var(--primary)" }}>Analyzing with Gemini Vision...</p>}
        </div>

        {/* Floating HealthifyMe Style Tracker Card */}
        {foodData && (
          <div className="light-card animate-fade-in" style={{ position: 'relative', marginTop: "1rem" }}>
            <h3 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "0.5rem" }}>{foodData.name}</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", marginBottom: "1.5rem" }}>{foodData.calories} Cal</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {foodData.macrosList.map((m, i) => (
                <div key={m.name} className="metric-box">
                  <div style={{ fontSize: "1.2rem", fontWeight: "700", color: COLORS[i] }}>{m.value}g</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{m.name}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
              <div style={{ flex: 1, height: "150px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={foodData.macrosList} innerRadius={30} outerRadius={50} paddingAngle={5} dataKey="value">
                      {foodData.macrosList.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1, height: "150px" }}>
                {foodData.microsData.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={foodData.microsData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
                      <Radar name="Micros" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "var(--text-muted)" }}>
              <Activity size={16} /> Tracked Successfully
            </div>
          </div>
        )}
      </div>

      {/* Right Column: AI Chatbot & Charts */}
      <div className="flex-col gap-8" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Chatbot Light Card */}
        <div className="light-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
            <div style={{ background: "var(--primary-gradient)", color: "white", padding: "0.5rem", borderRadius: "50%", display: "flex" }}>
              <Zap size={20} />
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "600" }}>Ria (NutriVision AI)</h3>
          </div>

          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem", paddingRight: "0.5rem" }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                background: msg.role === 'user' ? "rgba(0,0,0,0.05)" : "transparent",
                color: "var(--text-main)",
                padding: "1rem",
                borderRadius: "var(--radius-md)",
                borderBottomLeftRadius: msg.role === 'ai' ? 0 : "var(--radius-md)",
                borderBottomRightRadius: msg.role === 'user' ? 0 : "var(--radius-md)",
                maxWidth: "85%",
                lineHeight: "1.5"
              }}>
                {msg.content}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "1rem" }}>
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
              placeholder="How to improve my sleep?"
              style={{ flex: 1, padding: "0.8rem", borderRadius: "30px", border: "1px solid rgba(0,0,0,0.1)", background: "rgba(0,0,0,0.02)" }}
            />
            <button onClick={handleChatSend} className="btn btn-primary" style={{ padding: "0 1.2rem", borderRadius: "30px" }}>
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Macro Bar Chart if Data exists */}
        {foodData && (
          <div className="glass-panel animate-fade-in" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", color: "var(--text-light)", marginBottom: "1rem", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Heart size={16} color="var(--primary)" /> Macro Breakdown
            </h3>
            <div style={{ height: "200px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={foodData.macrosList} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "var(--text-light)" }} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ borderRadius: '8px', background: 'var(--bg-color)', border: 'none' }} />
                  <Bar dataKey="value" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
