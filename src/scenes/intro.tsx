/*
aaj ke samay me technologies bahut teji se grow kr rahi hai.

har thode time me new framwork / library / language aa jati hai.

lekin yeh sab chheze unke liye sense banati hai jo computer ki basis; samjh chuka ho.

hum humans iss innovation ki speed ko match nhi kr skte aur aane wali generation ke liye har roj burden badh rha.

log sirf latest tools ke tarf bhagte hai but wo shayad computer ke fundamentals ko bhul chuke hai.
*/

import {
  Grid,
  hue,
  Img,
  invert,
  Layout,
  Line,
  makeScene2D,
} from "@motion-canvas/2d";
import {
  all,
  cancel,
  chain,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  linear,
  loop,
  makeRef,
  range,
  sequence,
  waitUntil,
} from "@motion-canvas/core";
import Backround from "../components/GradientBackgroung";

import svg1 from "../assets/img/techIcons/svg1.svg";
import svg2 from "../assets/img/techIcons/2.svg";
import svg3 from "../assets/img/techIcons/3.svg";
import svg4 from "../assets/img/techIcons/4.svg";
import svg5 from "../assets/img/techIcons/5.svg";
import svg6 from "../assets/img/techIcons/6.svg";
import svg7 from "../assets/img/techIcons/7.svg";
import svg8 from "../assets/img/techIcons/8.svg";
import svg9 from "../assets/img/techIcons/9.svg";
import svg10 from "../assets/img/techIcons/10.svg";
import brain from "../assets/img/brain.svg?raw";
import { SmartSVG } from "../components/SmartSVG";

const svgs = [svg1, svg2, svg3, svg4, svg5, svg6, svg7, svg8, svg9, svg10];

interface Point {
  x: number;
  y: number;
}

interface Offset {
  x?: number;
  y?: number;
}

function getPointAtPercentage(
  points: number[][],
  percentage: number,
  offset: Offset = {}
): Point {
  // 1. Compute segment lengths
  const segments = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const length = Math.hypot(x2 - x1, y2 - y1);
    segments.push({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, length });
  }

  // 2. Total length
  const totalLength = segments.reduce((sum, s) => sum + s.length, 0);
  const targetDistance = percentage * totalLength;

  // 3. Find the segment where the target point lies
  let accumulated = 0;
  for (const seg of segments) {
    if (accumulated + seg.length >= targetDistance) {
      const t = (targetDistance - accumulated) / seg.length;
      const x = seg.start.x + t * (seg.end.x - seg.start.x) + (offset.x || 0);
      const y = seg.start.y + t * (seg.end.y - seg.start.y) + (offset.y || 0);
      return { x, y };
    }
    accumulated += seg.length;
  }

  // fallback: last point
  const last = segments[segments.length - 1].end;
  return { x: last.x + (offset.x || 0), y: last.y + (offset.y || 0) };
}

export default makeScene2D(function* (view) {
  view.add(<Backround />);

  const xAxis = createRef<Line>();
  const yAxis = createRef<Line>();
  const grid = createRef<Grid>();
  const line = createRef<Line>();
  const dottedLines: Line[] = [];

  view.add(
    <Layout>
      {/* x */}

      <Line
        ref={xAxis}
        points={[
          [-750, 480],
          [-750, -510],
        ]}
        stroke={"lightseagreen"}
        lineWidth={5}
        radius={10}
        endArrow
        lineCap={"square"}
        arrowSize={15}
        end={0}
      />

      {/* y */}
      <Line
        ref={yAxis}
        points={[
          [-750, 480],
          [720, 480],
        ]}
        stroke={"lightseagreen"}
        lineWidth={5}
        radius={10}
        endArrow
        arrowSize={15}
        lineCap={"square"}
        end={0}
      />

      {/* Grid Lines */}
      <Grid
        ref={grid}
        width={"75%"}
        height={"89%"}
        x={-25}
        // spacing={80}
        stroke={"#999"}
        end={0}
      />
    </Layout>
  );

  yield* all(xAxis().end(1, 0.5), yAxis().end(1, 0.5));

  yield* all(grid().end(1, 0.5));

  const cellSize = 80;
  const points = [
    [-664, 400],
    [-664 + cellSize * 3, 400 - cellSize * 5],
    [-664 + cellSize * 5, 400 - cellSize * 2],
    [-664 + cellSize * 9, 400 - cellSize * 8],
    [-664 + cellSize * 11, 400 - cellSize * 5],
    [-664 + cellSize * 15, 400 - cellSize * 10],
  ];

  view.add(
    <>
      {/* dotted line */}
      {...range(10).map((index) => (
        <Line
          ref={makeRef(dottedLines, index)}
          points={[
            getPointAtPercentage(points, 0.1 * (index + 1)),
            [getPointAtPercentage(points, 0.1 * (index + 1)).x, 476],
          ]}
          end={0}
          opacity={0}
          stroke={"#999"}
          lineDash={[12, 16]}
          lineWidth={4}
          lineCap={"square"}
        />
      ))}

      {/* Growing Line */}
      <Line
        ref={line}
        points={[
          [-664, 400],
          [-664 + cellSize * 3, 400 - cellSize * 5],
          [-664 + cellSize * 5, 400 - cellSize * 2],
          [-664 + cellSize * 9, 400 - cellSize * 8],
          [-664 + cellSize * 11, 400 - cellSize * 5],
          [-664 + cellSize * 15, 400 - cellSize * 10],
        ]}
        end={0}
        shadowColor={"#fff"}
        shadowBlur={30}
        opacity={0}
        stroke={"#ddd"}
        lineWidth={20}
        radius={2}
        // endArrow

        arrowSize={40}
        lineCap={"round"}
      />
    </>
  );

  yield line().opacity(1, 0.1);
  yield* all(
    line().end(1, 0.6, linear),
    chain(
      ...dottedLines.map((dotLine) =>
        all(dotLine.opacity(1, 0.06), dotLine.end(1, 0.06))
      )
    )
  );

  const offset = 150;
  const percentageOffset = [
    0.03, 0.15, 0.23, 0.38, 0.45, 0.54, 0.65, 0.77, 0.8, 98,
  ];

  const svgRefs: Img[] = [];

  view.add(
    <Layout>
      {...svgs.map((svg, i) => (
        <Img
          ref={makeRef(svgRefs, i)}
          src={svg}
          scale={0.5}
          // opacity={0}
          position={() =>
            getPointAtPercentage(points, percentageOffset[i], {
              y: i % 2 === 0 ? -offset : offset,
            })
          }
        />
      ))}
    </Layout>
  );

  svgRefs.forEach((icon, i) => {
    icon.save();
    icon.position.y(getPointAtPercentage(points, percentageOffset[i]).y);
    icon.scale(0);
  });

  yield* waitUntil("icons");

  yield sequence(
    0.1,
    ...svgRefs.flatMap((icon) =>
      all(icon.restore(0.4, easeOutCubic), icon.opacity(1, 0.4, easeOutCubic))
    )
  );

  const brainRef = createRef<SmartSVG>();

  view.add(
    <SmartSVG
      ref={brainRef}
      lineWidth={1}
      filters={[invert(1), hue(100)]}
      scale={0.3}
      svg={brain}
      y={0}
      x={840}
    />
  );

  yield* waitUntil("brain");
  const logoMove = yield loop(() =>
    chain(brainRef().y(-100, 1, easeInOutCubic).to(100, 1, easeInOutCubic))
  );
  yield* brainRef().reveal(0.3, 0.4);

  yield* waitUntil("end");
  cancel(logoMove);

  yield* all(
    brainRef().hide(1),
    brainRef().opacity(0, 0.5),

    ...dottedLines
      .reverse()
      .map((dotLine) => all(dotLine.start(1, 0.1), dotLine.opacity(0, 0.3))),
    ...svgRefs.reverse().map((sv) => sv.scale(0, 0.3)),
    line().start(1, 0.5),
    line().opacity(0, 0.5),
    grid().end(0, 0.5),
    grid().opacity(0, 0.5),
    xAxis().start(1, 0.5),
    xAxis().opacity(0, 0.5),
    yAxis().start(1, 0.5),
    yAxis().opacity(0, 0.5)
  );
});
