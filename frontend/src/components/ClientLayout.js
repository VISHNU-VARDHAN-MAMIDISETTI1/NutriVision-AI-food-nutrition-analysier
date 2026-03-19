"use client";
import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import SplashScreen from './SplashScreen';

export default function ClientLayout({ children }) {
    const [showSplash, setShowSplash] = useState(true);

    return (
        <>
            {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
            {!showSplash && (
                <>
                    <Navigation />
                    <main className="container animate-fade-in">
                        {children}
                    </main>
                </>
            )}
        </>
    );
}
