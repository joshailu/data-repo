import { useState, useMemo } from "react";
import * as Slider from "@radix-ui/react-slider";
import "./TimeRangeSlider.css";

interface TimeRangeSliderProps {
    startDate: Date;
    endDate: Date;
    value: [Date, Date];
    onValueChange: (range: [Date, Date]) => void;
}

type TimeUnit = "seconds" | "minutes" | "hours" | "days" | "months" | "years";

function TimeRangeSlider({
    startDate,
    endDate,
    value,
    onValueChange,
}: TimeRangeSliderProps) {
    const { unit, step, totalSteps } = useMemo(() => {
        const diffMs = endDate.getTime() - startDate.getTime();
        const diffSeconds = diffMs / 1000;
        const diffMinutes = diffSeconds / 60;
        const diffHours = diffMinutes / 60;
        const diffDays = diffHours / 24;
        const diffMonths = diffDays / 30.44; // Average month
        const diffYears = diffDays / 365.25;

        let unit: TimeUnit;
        let step: number;
        let totalSteps: number;

        if (diffYears >= 2) {
            unit = "years";
            step = diffYears > 50 ? 5 : diffYears > 10 ? 1 : 0.5;
            totalSteps = Math.ceil(diffYears / step);
        } else if (diffMonths >= 2) {
            unit = "months";
            step = 1;
            totalSteps = Math.ceil(diffMonths);
        } else if (diffDays >= 2) {
            unit = "days";
            step = diffDays > 60 ? 7 : 1;
            totalSteps = Math.ceil(diffDays / step);
        } else if (diffHours >= 2) {
            unit = "hours";
            step = diffHours > 48 ? 6 : 1;
            totalSteps = Math.ceil(diffHours / step);
        } else if (diffMinutes >= 2) {
            unit = "minutes";
            step = diffMinutes > 120 ? 15 : diffMinutes > 30 ? 5 : 1;
            totalSteps = Math.ceil(diffMinutes / step);
        } else {
            unit = "seconds";
            step = diffSeconds > 120 ? 10 : diffSeconds > 30 ? 5 : 1;
            totalSteps = Math.ceil(diffSeconds / step);
        }

        return { unit, step, totalSteps };
    }, [startDate, endDate]);

    const dateToSliderValue = (date: Date): number => {
        const diffMs = date.getTime() - startDate.getTime();
        const totalMs = endDate.getTime() - startDate.getTime();
        return (diffMs / totalMs) * totalSteps;
    };

    const sliderValueToDate = (sliderValue: number): Date => {
        const totalMs = endDate.getTime() - startDate.getTime();
        const ratio = sliderValue / totalSteps;
        return new Date(startDate.getTime() + ratio * totalMs);
    };

    const formatDate = (date: Date): string => {
        if (unit === "years" || unit === "months") {
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } else if (unit === "days") {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } else {
            return date.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        }
    };

    const sliderValues = [dateToSliderValue(value[0]), dateToSliderValue(value[1])];

    return (
        <div className="time-range-slider">
            <div className="time-range-header">
                <span className="time-range-label">
                    {formatDate(value[0])} — {formatDate(value[1])}
                </span>
                <span className="time-range-unit">
                    Step: {step} {unit}
                </span>
            </div>
            <Slider.Root
                value={sliderValues}
                onValueChange={(vals) => {
                    const newStart = sliderValueToDate(vals[0] ?? 0);
                    const newEnd = sliderValueToDate(vals[1] ?? totalSteps);
                    onValueChange([newStart, newEnd]);
                }}
                min={0}
                max={totalSteps}
                step={1}
                minStepsBetweenThumbs={0}
                className="slider-root"
            >
                <Slider.Track className="slider-track">
                    <Slider.Range className="slider-range" />
                </Slider.Track>
                <Slider.Thumb className="slider-thumb" />
                <Slider.Thumb className="slider-thumb" />
            </Slider.Root>
        </div>
    );
}

export default TimeRangeSlider;
