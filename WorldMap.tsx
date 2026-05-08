import { scaleQuantize } from "@visx/scale";
import { Mercator, Graticule } from "@visx/geo";
import * as topojson from "topojson-client";
import type {
    Feature,
    FeatureCollection,
    MultiPolygon,
    Polygon,
} from "geojson";

import topology from "./world-topo.json";

type WorldProperties = {
    name?: string;
};

type WorldGeometry = Polygon | MultiPolygon;
type WorldFeature = Feature<WorldGeometry, WorldProperties>;

export type MapPoint = {
    id: string;
    latitude: number;
    longitude: number;
};

type WorldMapProps = {
    width: number;
    height: number;
    points?: MapPoint[];
    events?: boolean;
};

const background = "#f9f7e8";

const world = topojson.feature(
    topology as any,
    (topology as any).objects.units,
) as unknown as FeatureCollection<WorldGeometry, WorldProperties>;

const coordinateLength = (feature: WorldFeature) => {
    return feature.geometry.coordinates.length;
};

const color = scaleQuantize<string>({
    domain: [
        Math.min(...world.features.map(coordinateLength)),
        Math.max(...world.features.map(coordinateLength)),
    ],
    range: [
        "#ffb01d",
        "#ffa020",
        "#ff9221",
        "#ff8424",
        "#ff7425",
        "#fc5e2f",
        "#f94b3a",
        "#f63a48",
    ],
});

export default function WorldMap({
    width,
    height,
    points = [],
    events = false,
}: WorldMapProps) {
    const centerX = width / 2;
    const centerY = height / 2;

    const scale = Math.min(width, height) / 2.8;

    if (width < 10 || height < 10) {
        return null;
    }

    return (
        <svg width={width} height={height}>
            <rect x={0} y={0} width={width} height={height} fill={background} />

            <Mercator
                data={world.features}
                scale={scale}
                translate={[centerX, centerY]}
            >
                {(mercator) => (
                    <g>
                        <Graticule
                            graticule={(g) => mercator.path(g) || ""}
                            stroke="rgba(33,33,33,0.05)"
                        />

                        {mercator.features.map(({ feature, path }, i) => {
                            const typedFeature = feature as WorldFeature;

                            return (
                                <path
                                    key={`map-feature-${i}`}
                                    d={path || ""}
                                    fill={color(coordinateLength(typedFeature))}
                                    stroke={background}
                                    strokeWidth={0.5}
                                    onClick={() => {
                                        if (events) {
                                            alert(
                                                `Clicked: ${
                                                    typedFeature.properties
                                                        ?.name ?? "Unknown"
                                                } (${typedFeature.id ?? "no id"})`,
                                            );
                                        }
                                    }}
                                />
                            );
                        })}

                        {points.map((point) => {
                            const projected = mercator.projection([
                                point.longitude,
                                point.latitude,
                            ]);

                            if (!projected) {
                                return null;
                            }

                            const [x, y] = projected;

                            return (
                                <circle
                                    key={point.id}
                                    cx={x}
                                    cy={y}
                                    r={4}
                                    fill="black"
                                />
                            );
                        })}
                    </g>
                )}
            </Mercator>
        </svg>
    );
}
