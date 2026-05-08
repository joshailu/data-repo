import * as React from "react";
import {
    DoubleSidedSlider,
    type RangeValue,
} from "./components/DoubleSidedSlider.tsx";
import { RangeConstantSaver } from "./components/RangeConstantSaver.tsx";
import DateTimeRangeSelectorDemo from "./components/DateTimeRangeSelectorDemo.tsx";
import ChartDashboard from "./components/ChartDashboard.tsx";
import Chart from "./components/Chart.tsx";
import SimpleDateRangePickerDemo from "./components/SimpleDateRangePickerDemo.tsx";
import LineChartDemo from "./components/LineChartDemo.tsx";
import GaugeDashboardDemo from "./components/StaticDashboard/GaugeDashboardDemo.tsx";
import AnimatedStackedBarChart from "./components/StaticDashboard/AnimatedStackedBarChart.tsx";
import WorldMap, { type MapPoint } from "./components/WorldMap.tsx";

import { useEffect, useState } from "react";

function useWindowSize() {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return size;
}

type PointRecord = Record<
    string,
    {
        latitude: number;
        longitude: number;
    }
>;

const samplePoints: PointRecord = {
    p1: { latitude: 40.7128, longitude: -74.006 }, // New York
    p2: { latitude: 34.0522, longitude: -118.2437 }, // Los Angeles
    p3: { latitude: 51.5074, longitude: -0.1278 }, // London
    p4: { latitude: 48.8566, longitude: 2.3522 }, // Paris
    p5: { latitude: 35.6762, longitude: 139.6503 }, // Tokyo
    p6: { latitude: -33.8688, longitude: 151.2093 }, // Sydney
    p7: { latitude: 28.6139, longitude: 77.209 }, // Delhi
    p8: { latitude: -23.5505, longitude: -46.6333 }, // São Paulo
};

export default function App() {
    // const [showDashboard, setShowDashboard] = React.useState(true);
    // const [rangeValue, setRangeValue] = React.useState<RangeValue>([
    //     20, 80,
    // ] as const);

    // if (showDashboard) {
    //     return <ChartDashboard />;
    // }

    const { width, height } = useWindowSize();
    const points: MapPoint[] = Object.entries(samplePoints).map(
        ([id, value]) => ({
            id,
            latitude: value.latitude,
            longitude: value.longitude,
        }),
    );

    return (
        <WorldMap width={width} height={height} points={points} />
        // <GaugeDashboardDemo />
        // <LineChartDemo />
        // <SimpleDateRangePickerDemo />
        // <Chart />
        // <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
        //     <button
        //         onClick={() => setShowDashboard(true)}
        //         style={{
        //             padding: "12px 24px",
        //             marginBottom: 20,
        //             background: "#00d4ff",
        //             color: "#0a0e27",
        //             border: "none",
        //             borderRadius: 6,
        //             cursor: "pointer",
        //             fontWeight: 600,
        //         }}
        //     >
        //         View Chart Dashboard
        //     </button>

        //     <DateTimeRangeSelectorDemo />

        //     <hr style={{ margin: "40px 0", border: "1px solid #ddd" }} />

        //     <h1 style={{ marginBottom: 12 }}>Double-sided (range) slider</h1>

        //     <DoubleSidedSlider
        //         value={rangeValue}
        //         onValueChange={setRangeValue}
        //         min={0}
        //         max={100}
        //         step={1}
        //         aria-label="Price range"
        //     />

        //     <div style={{ marginTop: 12 }}>
        //         <div>
        //             Selected: <b>{rangeValue[0]}</b> — <b>{rangeValue[1]}</b>
        //         </div>

        //         <div style={{ marginTop: 12 }}>
        //             <h2 style={{ fontSize: 14, marginBottom: 6 }}>
        //                 Saved as a constant
        //             </h2>
        //             <RangeConstantSaver value={rangeValue} />
        //         </div>
        //     </div>
        // </div>
    );
}
