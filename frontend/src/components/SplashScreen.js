"use client";
import { useState, useEffect } from "react";
import { Zap } from "lucide-react";


export default function SplashScreen({ onFinish }) {
    const [stage, setStage] = useState(0);

    useEffect(() => {
        // Sequence the animation stages
        const t1 = setTimeout(() => setStage(1), 500); // Wait 0.5s empty
        const t2 = setTimeout(() => setStage(2), 2000); // Show logo for 1.5s
        const t3 = setTimeout(() => {
            setStage(3); // Fade out
            setTimeout(onFinish, 600); // Unmount after fade out completes
        }, 2800);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [onFinish]);

    if (stage === 3) return null; // Wait for unmount from parent, but let CSS handle fade out

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'var(--bg-color)',
                zIndex: 9999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: stage === 3 ? 0 : 1,
                transition: 'opacity 0.6s ease-out',
                pointerEvents: 'none'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    opacity: stage >= 1 ? 1 : 0,
                    transform: stage >= 1 ? 'scale(1)' : 'scale(0.8)',
                    transition: 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
            >
                <div style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "var(--primary-gradient)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 0 40px rgba(18, 184, 134, 0.4)",
                    animation: "pulse 2s infinite"
                }}>
                    <Zap size={40} color="white" />
                </div>
                <h1 style={{
                    fontSize: "2.5rem",
                    fontWeight: "800",
                    background: "var(--primary-gradient)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "2px"
                }}>
                    NutriVision
                </h1>
            </div>

            <style jsx global>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(18, 184, 134, 0.7); }
          70% { box-shadow: 0 0 0 20px rgba(18, 184, 134, 0); }
          100% { box-shadow: 0 0 0 0 rgba(18, 184, 134, 0); }
        }
      `}</style>
        </div>
    );
}
