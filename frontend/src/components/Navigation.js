"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
    const pathname = usePathname();

    const getStyle = (path) => {
        return {
            color: pathname === path ? "white" : "var(--text-muted)",
            textDecoration: "none",
            padding: pathname === path ? "0.5rem 1rem" : "0",
            fontSize: "0.9rem"
        };
    };

    const getClass = (path) => pathname === path ? "btn btn-primary" : "";

    return (
        <nav className="glass-panel" style={{ margin: "1rem", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "var(--radius-lg)" }}>
            <div style={{ fontWeight: "700", fontSize: "1.5rem", background: "var(--primary-gradient)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                NutriVision
            </div>
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                <Link href="/dashboard" className={getClass('/dashboard')} style={getStyle('/dashboard')}>Dashboard</Link>
                <Link href="/history" className={getClass('/history')} style={getStyle('/history')}>History</Link>
                <Link href="/" className={getClass('/')} style={getStyle('/')}>Analyzer</Link>
            </div>
        </nav>
    );
}
