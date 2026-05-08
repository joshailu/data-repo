import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleLinear } from "@visx/scale";

// Install for a Vite React/TypeScript app:
// npm i @visx/axis @visx/scale

export type PointRecord = Record<string, any> & {
    latitude: number;
    longitude: number;
};

type SimpleScatterChartProps = {
    records?: Record<string, PointRecord>;
    width?: number;
    height?: number;
};

const sampleRecords: Record<string, PointRecord> = {
    p01: { latitude: 47.6062, longitude: -122.3321 },
    p02: { latitude: 45.5152, longitude: -122.6784 },
    p03: { latitude: 37.7749, longitude: -122.4194 },
    p04: { latitude: 34.0522, longitude: -118.2437 },
    p05: { latitude: 36.1699, longitude: -115.1398 },
    p06: { latitude: 33.4484, longitude: -112.074 },
    p07: { latitude: 39.7392, longitude: -104.9903 },
    p08: { latitude: 40.7608, longitude: -111.891 },
    p09: { latitude: 35.0844, longitude: -106.6504 },
    p10: { latitude: 41.8781, longitude: -87.6298 },
    p11: { latitude: 44.9778, longitude: -93.265 },
    p12: { latitude: 29.7604, longitude: -95.3698 },
    p13: { latitude: 32.7767, longitude: -96.797 },
    p14: { latitude: 39.0997, longitude: -94.5786 },
    p15: { latitude: 36.1627, longitude: -86.7816 },
    p16: { latitude: 33.749, longitude: -84.388 },
    p17: { latitude: 25.7617, longitude: -80.1918 },
    p18: { latitude: 38.9072, longitude: -77.0369 },
    p19: { latitude: 40.7128, longitude: -74.006 },
    p20: { latitude: 42.3601, longitude: -71.0589 },
};

export default function SimpleScatterChart({
    records = sampleRecords,
    width = 700,
    height = 400,
}: SimpleScatterChartProps) {
    const points = Object.entries(records).map(([id, record]) => ({
        id,
        latitude: record.latitude,
        longitude: record.longitude,
    }));

    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const longitudes = points.map((point) => point.longitude);
    const latitudes = points.map((point) => point.latitude);

    const xScale = scaleLinear<number>({
        domain: [Math.min(...longitudes), Math.max(...longitudes)],
        range: [0, innerWidth],
        nice: true,
    });

    const yScale = scaleLinear<number>({
        domain: [Math.min(...latitudes), Math.max(...latitudes)],
        range: [innerHeight, 0],
        nice: true,
    });

    return (
        <svg width={width} height={height}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                <AxisBottom
                    top={innerHeight}
                    scale={xScale}
                    label="Longitude"
                />
                <AxisLeft scale={yScale} label="Latitude" />

                {points.map((point) => (
                    <circle
                        key={point.id}
                        cx={xScale(point.longitude)}
                        cy={yScale(point.latitude)}
                        r={4}
                    />
                ))}
            </g>
        </svg>
    );
}
