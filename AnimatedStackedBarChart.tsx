// ============================================================
// IMPORTS
// ============================================================

// useMemo: a React hook that caches ("memoizes") the result of
// an expensive calculation so it only re-runs when its inputs change.
import { useMemo } from "react";

// d3 is a powerful data visualization library.
// We use it here only for color generation (quantize + interpolateSpectral).
import * as d3 from "d3";

// react-spring handles smooth animations in React.
// - `animated` is a set of SVG/HTML elements (like animated.rect) that can
//   have their properties smoothly interpolated over time.
// - `useSprings` creates multiple independent spring animations at once,
//   one per bar segment.
import { animated, useSprings } from "@react-spring/web";

// visx/axis draws the X and Y axis lines, ticks, and labels on the chart.
import { AxisBottom, AxisLeft } from "@visx/axis";

// visx/grid draws the faint horizontal lines behind the bars,
// making it easier to read values at a glance.
import { GridRows } from "@visx/grid";

// visx/group renders an SVG <g> (group) element with convenient
// `top` and `left` offset props, so we don't have to write
// transform="translate(x, y)" by hand.
import { Group } from "@visx/group";

// LegendOrdinal renders a color-coded legend row (e.g. ■ Create  ■ Update …)
// It reads directly from a visx ordinal scale, so it always stays in sync
// with the actual bar colors.
import { LegendOrdinal } from "@visx/legend";

// visx/scale wraps D3 scales in a friendlier API:
// - scaleBand  → evenly spaces categorical values (our group names) across a pixel range
// - scaleLinear → maps a continuous number range (0 → maxTotal) to a pixel range
// - scaleOrdinal → maps discrete categories (action names) to discrete values (colors)
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";

// BarStack takes our data plus the two scales and computes the exact
// x, y, width, and height of every stacked bar segment for us.
import { BarStack } from "@visx/shape";

// ============================================================
// CONSTANTS & TYPES
// ============================================================

// The five action categories that appear as stacked segments in each bar.
// `as const` makes TypeScript treat this as a fixed tuple of literal strings
// rather than a generic string[]. This lets us derive the ActionKey union type below.
const actionKeys = ["Create", "Update", "Delete", "Approve", "Reject"] as const;

// ActionKey is a union type: "Create" | "Update" | "Delete" | "Approve" | "Reject"
// Derived automatically from actionKeys so the two can never go out of sync.
type ActionKey = (typeof actionKeys)[number];

// GroupDatum describes one bar group (one cluster of stacked segments).
// It always has a `group` string (the x-axis label) PLUS one numeric field
// for every ActionKey. The `& Record<ActionKey, number>` part enforces
// that all five action counts are always present.
type GroupDatum = {
    group: string;
} & Record<ActionKey, number>;

// Props accepted by the top-level AnimatedStackedBarChart component.
// All are optional — the component supplies sensible defaults for everything.
type AnimatedStackedBarChartProps = {
    width?: number; // total SVG width in pixels
    height?: number; // total SVG height in pixels
    data?: GroupDatum[]; // if omitted, DEFAULT_DATA is used
};

// ============================================================
// COLOR SCALE
// ============================================================

// d3.quantize samples a continuous color interpolator at N evenly-spaced
// points between 0 and 1, returning an array of N hex color strings.
// d3.interpolateSpectral is a rainbow-like palette (red → yellow → green → blue).
// We shrink the sample range to t * 0.8 + 0.1 to avoid the very dark ends.
// .reverse() so the warmer colors (red/orange) end up at the bottom of the bars
// and cooler ones (blue/green) at the top — purely a visual preference.
const colors = d3
    .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), actionKeys.length)
    .reverse();

// ============================================================
// DEFAULT DATA
// ============================================================

// This is the fallback dataset used when no `data` prop is passed in.
// Each object represents one group (one cluster of stacked bars).
// The keys match ActionKey exactly — TypeScript will error if any are missing.
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

// ============================================================
// HELPERS
// ============================================================

// totalForDatum adds up every action count for a single group.
// Used to find the tallest bar so the Y axis can be scaled appropriately.
// Array.reduce walks the actionKeys array, accumulating a running sum.
function totalForDatum(datum: GroupDatum) {
    return actionKeys.reduce((sum, key) => sum + datum[key], 0);
}

// ============================================================
// FLAT BAR TYPE
// ============================================================

// BarStack (visx) gives us nested data structures. We flatten everything
// into a simple array of FlatBar objects so react-spring can animate them
// without needing to understand visx's internal data shapes.
type FlatBar = {
    key: string; // unique identifier used by React's reconciler (key prop)
    x: number; // left edge of the bar segment in pixels
    y: number; // top edge of the bar segment in pixels (SVG y grows downward)
    width: number; // bar segment width in pixels
    height: number; // bar segment height in pixels
    color: string; // hex fill color for this action
    action: string; // which action this segment represents (e.g. "Create")
    group: string; // which group this bar belongs to (e.g. "Group A")
    value: number; // raw count value, shown in the tooltip
};

// ============================================================
// ANIMATED BARS COMPONENT
// ============================================================

// AnimatedBars receives the flat list of all bar segments and renders
// each one as an animated SVG <rect> that grows upward from the baseline
// when the chart first mounts.
//
// It is a separate component from the main chart so that useSprings
// (which must always be called with the same number of springs) is
// isolated. Keeping animation logic here also keeps the main component clean.
function AnimatedBars({ bars }: { bars: FlatBar[] }) {
    // useSprings creates one independent spring animation per bar segment.
    // Each spring starts at the `from` state and smoothly transitions to `to`.
    const springs = useSprings(
        bars.length, // how many springs to create — must match bars.length
        bars.map((bar) => ({
            // `from` is the initial state — the bar starts at zero height,
            // positioned at the bottom of where it will eventually sit.
            // y starts below the final position (y + height) so it appears
            // to grow upward as height animates from 0 to its real value.
            from: {
                x: bar.x,
                y: bar.y + bar.height, // start at the bottom edge
                width: bar.width,
                height: 0, // invisible at first
                opacity: 0.55,
            },
            // `to` is the final resting state after the animation completes.
            to: {
                x: bar.x,
                y: bar.y, // move up to the correct top position
                width: bar.width,
                height: bar.height, // grow to full height
                opacity: 1,
            },
            // Spring physics: tension controls speed (higher = faster snap),
            // friction controls how much it slows down (higher = less bounce).
            config: { tension: 210, friction: 24 },
        })),
    );

    return (
        <>
            {springs.map((spring, index) => {
                const bar = bars[index];

                return (
                    // animated.rect is like a normal SVG <rect> except its
                    // numeric props (x, y, width, height, opacity) are driven
                    // by the spring — they update every animation frame automatically.
                    <animated.rect
                        key={bar.key}
                        x={spring.x}
                        y={spring.y}
                        width={spring.width}
                        height={spring.height}
                        fill={bar.color}
                        opacity={spring.opacity}
                    >
                        {/* <title> adds a native browser tooltip on hover,
                            showing the group name, action, and raw count. */}
                        <title>{`${bar.group} • ${bar.action}: ${bar.value}`}</title>
                    </animated.rect>
                );
            })}
        </>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

// AnimatedStackedBarChart is the default export — the component you drop
// into any page to render the chart.
// Props are all optional; the chart works out-of-the-box with DEFAULT_DATA.
export default function AnimatedStackedBarChart({
    width = 820, // default total SVG width
    height = 460, // default total SVG height
    data, // optional external dataset; falls back to DEFAULT_DATA
}: AnimatedStackedBarChartProps) {
    // If no `data` prop is provided, use the hardcoded DEFAULT_DATA.
    // useMemo means this only recomputes when `data` actually changes.
    const chartData = useMemo(() => data ?? DEFAULT_DATA, [data]);

    // margin defines the whitespace (in pixels) between the SVG edge and the
    // plot area. This space is where the axes and their labels are drawn.
    const margin = { top: 24, right: 32, bottom: 72, left: 56 };

    // xMax / yMax are the pixel dimensions of the inner plot area
    // (i.e. the total size minus the margins on each side).
    // Math.max(..., 0) prevents negative values if the component is very small.
    const xMax = Math.max(width - margin.left - margin.right, 0);
    const yMax = Math.max(height - margin.top - margin.bottom, 0);

    // Find the tallest bar by summing all action counts for each group,
    // then taking the maximum. This drives the top of the Y axis.
    const maxTotal = Math.max(...chartData.map(totalForDatum));

    // xScale maps each group name (a string) to a horizontal pixel position.
    // scaleBand divides the available width into equal bands, one per group.
    // `padding: 0.28` leaves 28% of each band as a gap between bars.
    const xScale = useMemo(
        () =>
            scaleBand<string>({
                domain: chartData.map((datum) => datum.group), // ["Group A", "Group B", ...]
                range: [0, xMax], // maps across the full plot width
                padding: 0.28,
            }),
        [chartData, xMax],
    );

    // yScale maps a count value (0 → maxTotal) to a vertical pixel position.
    // Importantly the range is [yMax, 0] — reversed — because SVG y=0 is at
    // the TOP of the screen, so higher count values must map to smaller y numbers.
    // Math.ceil(maxTotal / 10) * 10 rounds the domain up to the nearest 10
    // so the top of the axis is a clean round number.
    const yScale = useMemo(
        () =>
            scaleLinear<number>({
                domain: [0, Math.ceil(maxTotal / 10) * 10],
                range: [yMax, 0], // note: reversed so bars grow upward
                nice: true, // `nice` rounds the domain endpoints to tidy values
            }),
        [maxTotal, yMax],
    );

    // colorScale maps each ActionKey string to a hex color string.
    // It uses the `colors` array generated from the Spectral palette above.
    // The empty dependency array [] means this scale is created once and reused —
    // colors never change, so there's no need to recreate it.
    const colorScale = useMemo(
        () =>
            scaleOrdinal<ActionKey, string>({
                domain: [...actionKeys], // spread to convert readonly → mutable (TypeScript requirement)
                range: colors,
            }),
        [],
    );

    // Safety guard: if the SVG is too small to draw anything meaningful, render nothing.
    if (width < 10 || height < 10) return null;

    return (
        // Outer div constrains the chart to its intended max width and sets the font.
        <div
            style={{
                width: "100%",
                maxWidth: width,
                fontFamily: "Inter, system-ui, sans-serif",
            }}
        >
            {/* The SVG element is the canvas on which everything is drawn.
                role="img" and aria-label make it accessible to screen readers. */}
            <svg
                width={width}
                height={height}
                role="img"
                aria-label="Stacked bar chart of action counts by group"
            >
                {/* White rounded background rectangle — gives the chart a card-like appearance. */}
                <rect width={width} height={height} rx={16} fill="#ffffff" />

                {/* Group shifts the coordinate origin by the margin so that (0,0)
                    inside the group refers to the top-left of the inner plot area.
                    All axes and bars are rendered relative to this offset. */}
                <Group left={margin.left} top={margin.top}>
                    {/* GridRows draws faint horizontal dashed lines at each Y tick,
                        making it easier to estimate bar heights at a glance.
                        pointerEvents="none" means the grid lines don't capture mouse events. */}
                    <GridRows
                        scale={yScale}
                        width={xMax}
                        stroke="#e5e7eb"
                        strokeDasharray="4,4"
                        pointerEvents="none"
                    />

                    {/* BarStack is the core visx component that computes stacked bar geometry.
                        It uses a render-prop pattern: instead of rendering bars itself, it
                        calls the child function with computed `barStacks` data and lets us
                        decide how to render each segment (here: as animated rects).

                        Generic parameters <GroupDatum, ActionKey> tell TypeScript the exact
                        shape of the data and the key type so all property accesses are safe. */}
                    <BarStack<GroupDatum, ActionKey>
                        data={chartData}
                        keys={[...actionKeys]} // spread to satisfy TypeScript's mutable array requirement
                        x={(datum) => datum.group} // accessor: which field is the x-axis category?
                        xScale={xScale}
                        yScale={yScale}
                        color={colorScale}
                    >
                        {(barStacks) => {
                            // barStacks is an array with one entry per ActionKey.
                            // Each barStack.bars contains one entry per group (one bar segment).
                            // We flatten this into a single array of FlatBar objects so that
                            // AnimatedBars can receive them as a simple list.
                            const bars: FlatBar[] = barStacks.flatMap(
                                (barStack) =>
                                    barStack.bars.map((bar) => {
                                        // barStack.key is the action name (e.g. "Create").
                                        // We cast it to ActionKey so TypeScript allows using it
                                        // as an index into GroupDatum.
                                        const action =
                                            barStack.key as ActionKey;

                                        return {
                                            key: `${action}-${bar.index}`, // unique key for React
                                            x: bar.x, // pixel x position from xScale
                                            y: bar.y, // pixel y position from yScale
                                            width: bar.width, // bar width from scaleBand
                                            height: bar.height, // segment height (count → pixels)
                                            color: bar.color, // from colorScale
                                            action,
                                            group: bar.bar.data.group, // e.g. "Group A"
                                            value: bar.bar.data[action], // raw count
                                        };
                                    }),
                            );

                            return <AnimatedBars bars={bars} />;
                        }}
                    </BarStack>

                    {/* AxisLeft draws the vertical Y axis on the left side of the plot.
                        numTicks limits how many tick marks appear (keeps it uncluttered).
                        tickLabelProps returns style props for each individual tick label. */}
                    <AxisLeft
                        scale={yScale}
                        numTicks={5}
                        stroke="#374151"
                        tickStroke="#374151"
                        tickLabelProps={() => ({
                            fill: "#374151",
                            fontSize: 12,
                            textAnchor: "end", // right-align so labels sit flush with the axis
                            dy: "0.33em", // slight vertical nudge to vertically center on tick
                        })}
                        label="Total count"
                        labelProps={{
                            fill: "#111827",
                            fontSize: 13,
                            textAnchor: "middle",
                        }}
                    />

                    {/* AxisBottom draws the horizontal X axis at the bottom of the plot.
                        `top={yMax}` positions it at the bottom of the inner plot area. */}
                    <AxisBottom
                        top={yMax}
                        scale={xScale}
                        stroke="#374151"
                        tickStroke="#374151"
                        tickLabelProps={() => ({
                            fill: "#374151",
                            fontSize: 12,
                            textAnchor: "middle",
                            dy: "0.75em", // push labels down slightly so they don't overlap the axis line
                        })}
                    />
                </Group>
            </svg>

            {/* Legend row below the chart — shows a color swatch and label for each action.
                LegendOrdinal reads the colorScale directly so it always matches the bars. */}
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
                    itemMargin="0 14px 0 0" // spacing between legend items
                    labelFormat={(label) => label} // display the action name as-is
                />
            </div>
        </div>
    );
}
