import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useTheme } from "../context/ThemeContext";

const AnimatedBackground = () => {
    const { theme } = useTheme();

    const particlesInit = useCallback(async (engine) => {
        // load the lightweight version of tsParticles
        await loadSlim(engine);
    }, []);

    const isDark = theme === 'dark';

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            className="absolute inset-0 z-0"
            options={{
                background: {
                    color: {
                        value: isDark ? "#080b15" : "#f1f6f9", // Deep space or clean light gray
                    },
                },
                fpsLimit: 60,
                interactivity: {
                    events: {
                        onHover: {
                            enable: true,
                            mode: "grab",
                        },
                        resize: true,
                    },
                    modes: {
                        grab: {
                            distance: 140,
                            links: {
                                opacity: 0.8,
                                color: isDark ? "#0ea5e9" : "#3b82f6" // Cyan or blue links on hover
                            },
                        },
                    },
                },
                particles: {
                    color: {
                        value: isDark ? "#38bdf8" : "#93c5fd", // Light blue particles
                    },
                    links: {
                        color: isDark ? "#0284c7" : "#bfdbfe",
                        distance: 150,
                        enable: true,
                        opacity: 0.4,
                        width: 1,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: true,
                        speed: 0.8,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 60, // Minimalist high-end look
                    },
                    opacity: {
                        value: 0.6,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 3 },
                    },
                },
                detectRetina: true,
            }}
        />
    );
};

export default AnimatedBackground;
