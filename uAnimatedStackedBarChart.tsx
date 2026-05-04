import { useMemo } from "react";
import * as d3 from "d3";
import { animated, useSprings } from "@react-spring/web";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { LegendOrdinal } from "@visx/legend";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { BarStack } from "@visx/shape";

const actionKeys = ["Create", "Update", "Delete", "Approve", "Reject"] as const;
type ActionKey = (typeof actionKeys)[number];

type GroupDatum = {
    group: string;
} & Record<ActionKey, number>;

type AnimatedStackedBarChartProps = {
    width?: number;
    height?: number;
    data?: GroupDatum[];
};

// Generate N evenly-spaced colors from D3's Spectral palette,
// the same way PieChart.tsx does it. Reversing keeps warm tones on top.
const colors = d3
    .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), actionKeys.length)
    .reverse();

// Hardcoded sample dataset — replace with real data via the `data` prop.
const DEFAULT_DATA: GroupDatum[] = [
    {
        group: "Group A",
        Create: 14,
        Update: 8,
        Delete: 3,
        Approve: 11,
        Reject: 5,
    },
    {
        group: "Group B",
        Create: 7,
        Update: 15,
        Delete: 9,
        Approve: 4,
        Reject: 12,
    },
    {
        group: "Group C",
        Create: 10,
        Update: 6,
        Delete: 17,
        Approve: 8,
        Reject: 2,
    },
    {
        group: "Group D",
        Create: 3,
        Update: 12,
        Delete: 5,
        Approve: 16,
        Reject: 9,
    },
    {
        group: "Group E",
        Create: 18,
        Update: 4,
        Delete: 11,
        Approve: 7,
        Reject: 13,
    },
    {
        group: "Group F",
        Create: 6,
        Update: 19,
        Delete: 8,
        Approve: 3,
        Reject: 7,
    },
];

function totalForDatum(datum: GroupDatum) {
    return actionKeys.reduce((sum, key) => sum + datum[key], 0);
}

type FlatBar = {
    key: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    action: string;
    group: string;
    value: number;
};

function AnimatedBars({ bars }: { bars: FlatBar[] }) {
    const springs = useSprings(
        bars.length,
        bars.map((bar) => ({
            from: {
                x: bar.x,
                y: bar.y + bar.height,
                width: bar.width,
                height: 0,
                opacity: 0.55,
            },
            to: {
                x: bar.x,
                y: bar.y,
                width: bar.width,
                height: bar.height,
                opacity: 1,
            },
            config: { tension: 210, friction: 24 },
        })),
    );

    return (
        <>
            {springs.map((spring, index) => {
                const bar = bars[index];

                return (
                    <animated.rect
                        key={bar.key}
                        x={spring.x}
                        y={spring.y}
                        width={spring.width}
                        height={spring.height}
                        fill={bar.color}
                        opacity={spring.opacity}
                    >
                        <title>{`${bar.group} • ${bar.action}: ${bar.value}`}</title>
                    </animated.rect>
                );
            })}
        </>
    );
}

export default function AnimatedStackedBarChart({
    width = 820,
    height = 460,
    data,
}: AnimatedStackedBarChartProps) {
    const chartData = useMemo(() => data ?? DEFAULT_DATA, [data]);

    const margin = { top: 24, right: 32, bottom: 72, left: 56 };
    const xMax = Math.max(width - margin.left - margin.right, 0);
    const yMax = Math.max(height - margin.top - margin.bottom, 0);

    const maxTotal = Math.max(...chartData.map(totalForDatum));

    const xScale = useMemo(
        () =>
            scaleBand<string>({
                domain: chartData.map((datum) => datum.group),
                range: [0, xMax],
                padding: 0.28,
            }),
        [chartData, xMax],
    );

    const yScale = useMemo(
        () =>
            scaleLinear<number>({
                domain: [0, Math.ceil(maxTotal / 10) * 10],
                range: [yMax, 0],
                nice: true,
            }),
        [maxTotal, yMax],
    );

    const colorScale = useMemo(
        () =>
            scaleOrdinal<ActionKey, string>({
                domain: [...actionKeys],
                range: colors,
            }),
        [],
    );

    if (width < 10 || height < 10) return null;

    return (
        <div
            style={{
                width: "100%",
                maxWidth: width,
                fontFamily: "Inter, system-ui, sans-serif",
            }}
        >
            <svg
                width={width}
                height={height}
                role="img"
                aria-label="Stacked bar chart of action counts by group"
            >
                <rect width={width} height={height} rx={16} fill="#ffffff" />

                <Group left={margin.left} top={margin.top}>
                    <GridRows
                        scale={yScale}
                        width={xMax}
                        stroke="#e5e7eb"
                        strokeDasharray="4,4"
                        pointerEvents="none"
                    />

                    <BarStack<GroupDatum, ActionKey>
                        data={chartData}
                        keys={[...actionKeys]}
                        x={(datum) => datum.group}
                        xScale={xScale}
                        yScale={yScale}
                        color={colorScale}
                    >
                        {(barStacks) => {
                            const bars: FlatBar[] = barStacks.flatMap(
                                (barStack) =>
                                    barStack.bars.map((bar) => {
                                        const action =
                                            barStack.key as ActionKey;

                                        return {
                                            key: `${action}-${bar.index}`,
                                            x: bar.x,
                                            y: bar.y,
                                            width: bar.width,
                                            height: bar.height,
                                            color: bar.color,
                                            action,
                                            group: bar.bar.data.group,
                                            value: bar.bar.data[action],
                                        };
                                    }),
                            );

                            return <AnimatedBars bars={bars} />;
                        }}
                    </BarStack>

                    <AxisLeft
                        scale={yScale}
                        numTicks={5}
                        stroke="#374151"
                        tickStroke="#374151"
                        tickLabelProps={() => ({
                            fill: "#374151",
                            fontSize: 12,
                            textAnchor: "end",
                            dy: "0.33em",
                        })}
                        label="Total count"
                        labelProps={{
                            fill: "#111827",
                            fontSize: 13,
                            textAnchor: "middle",
                        }}
                    />

                    <AxisBottom
                        top={yMax}
                        scale={xScale}
                        stroke="#374151"
                        tickStroke="#374151"
                        tickLabelProps={() => ({
                            fill: "#374151",
                            fontSize: 12,
                            textAnchor: "middle",
                            dy: "0.75em",
                        })}
                    />
                </Group>
            </svg>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 8,
                }}
            >
                <LegendOrdinal
                    scale={colorScale}
                    direction="row"
                    itemMargin="0 14px 0 0"
                    labelFormat={(label) => label}
                />
            </div>
        </div>
    );
}
