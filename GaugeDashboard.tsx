import { useState } from "react";
import { Group } from "@visx/group";
import { useSpring, animated, config } from "react-spring";
import * as d3 from "d3";
import TimeRangeSlider from "./TimeRangeSlider";
import "./GaugeDashboard.css";

interface GaugeProps {
    value: number;
    min?: number;
    max?: number;
    label?: string;
}

interface NumberDisplayProps {
    value: number;
    label: string;
    unit?: string;
}

const AnimatedPath = animated.path;

function GaugeChart({
    value,
    min = 0,
    max = 100,
    label = "Gauge",
}: GaugeProps) {
    const ARC_WIDTH = 40;
    const LABEL_PADDING = 40;
    const gaugeRadius = 120;
    const width = gaugeRadius * 2 + LABEL_PADDING * 2 + ARC_WIDTH;
    const height = gaugeRadius + LABEL_PADDING + 40;
    const centerX = width / 2;
    const centerY = gaugeRadius + 20;

    // Calculate angles
    const startAngle = -Math.PI / 2;
    const endAngle = Math.PI / 2;
    const targetAngle = startAngle + ((value - min) / (max - min)) * Math.PI;

    // Animated value and angle
    const springProps = useSpring({
        animatedValue: value,
        animatedAngle: targetAngle,
        config: config.slow,
    });

    // Create arc path generator using D3
    const innerRadius = gaugeRadius - ARC_WIDTH;
    const outerRadius = gaugeRadius;

    // D3 arc generator
    const arcGenerator = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    // Background arc path
    const backgroundPath = arcGenerator({
        startAngle,
        endAngle,
    } as any);

    return (
        <div className="gauge-chart">
            <h3 className="gauge-title">{label}</h3>
            <svg width={width} height={height}>
                <Group top={centerY} left={centerX}>
                    {/* Background arc */}
                    <path d={backgroundPath || ""} fill="#e0e0e0" />

                    {/* Animated value arc */}
                    <AnimatedPath
                        d={springProps.animatedAngle.to((angle) => {
                            return (
                                arcGenerator({
                                    startAngle,
                                    endAngle: angle,
                                } as any) || ""
                            );
                        })}
                        fill="#4a90e2"
                    />

                    {/* Animated center text - value */}
                    <animated.text
                        x={0}
                        y={0}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={48}
                        fontWeight="bold"
                        fill="#333"
                    >
                        {springProps.animatedValue.to((val) => val.toFixed(0))}
                    </animated.text>

                    {/* Min label (left) */}
                    <text
                        x={-gaugeRadius - ARC_WIDTH}
                        y={0}
                        textAnchor="start"
                        dominantBaseline="middle"
                        fontSize={16}
                        fill="#666"
                    >
                        {min}%
                    </text>

                    {/* Max label (right) */}
                    <text
                        x={gaugeRadius + ARC_WIDTH + 10}
                        y={0}
                        textAnchor="end"
                        dominantBaseline="middle"
                        fontSize={16}
                        fill="#666"
                    >
                        {max}%
                    </text>
                </Group>
            </svg>
        </div>
    );
}

function NumberDisplay({ value, label, unit = "" }: NumberDisplayProps) {
    const springProps = useSpring({
        animatedValue: value,
        config: config.molasses,
    });

    return (
        <div className="number-display">
            <div className="number-value">
                <animated.span>
                    {springProps.animatedValue.to((val) =>
                        Math.floor(val).toLocaleString(),
                    )}
                </animated.span>
                {unit && <span className="number-unit">{unit}</span>}
            </div>
            <div className="number-label">{label}</div>
        </div>
    );
}

function GaugeDashboard() {
    // Time range state
    const absoluteStart = new Date("2024-01-01T00:00:00");
    const absoluteEnd = new Date("2024-12-31T23:59:59");
    const [timeRange, setTimeRange] = useState<[Date, Date]>([
        new Date("2024-03-01T00:00:00"),
        new Date("2024-09-30T23:59:59"),
    ]);

    // Sample data
    const gaugeData = {
        speed: 72,
        efficiency: 85,
    };

    const numberData = [
        { value: 12543, label: "Total Users", unit: "" },
        { value: 89, label: "Active Sessions", unit: "" },
        { value: 456, label: "Revenue", unit: "K" },
        { value: 98.5, label: "Uptime", unit: "%" },
    ];

    return (
        <div className="gauge-dashboard">
            <div className="time-slider-container">
                <TimeRangeSlider
                    startDate={absoluteStart}
                    endDate={absoluteEnd}
                    value={timeRange}
                    onValueChange={setTimeRange}
                />
            </div>
            <div className="dashboard-content">
                <div className="numbers-grid">
                    {numberData.map((item, index) => (
                        <NumberDisplay
                            key={index}
                            value={item.value}
                            label={item.label}
                            unit={item.unit}
                        />
                    ))}
                </div>
                <div className="gauges-container">
                    <div className="gauge-wrapper">
                        <GaugeChart
                            value={gaugeData.speed}
                            min={0}
                            max={100}
                            label="%T spent in autonomy"
                        />
                    </div>
                    <div className="gauge-wrapper">
                        <GaugeChart
                            value={gaugeData.efficiency}
                            min={0}
                            max={100}
                            label="%D spent in autonomy"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GaugeDashboard;
