import {
  Camera,
  Icon,
  Img,
  invert,
  Layout,
  Line,
  LineProps,
  makeScene2D,
  Node,
  Ray,
  Rect,
  Txt,
  TxtProps,
  Video,
  View2D,
} from "@motion-canvas/2d";
import {
  all,
  cancel,
  chain,
  clamp,
  createRef,
  createSignal,
  delay,
  easeInElastic,
  easeInExpo,
  easeOutBack,
  easeOutElastic,
  easeOutExpo,
  linear,
  loop,
  makeRef,
  range,
  Reference,
  ThreadGenerator,
  useScene,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import Backround from "../components/GradientBackgroung";

import thinkingBase from "../assets/img/thinkingBase.svg";
import thinkingIdea from "../assets/img/thinkingIdea.svg";
import questionMarksImage from "../assets/img/questionMark.jpg";
import blinkVid from "../assets/vid/blink.mp4";
import strangerThingsImg from "../assets/img/strangerThings.jpg";
import { Torch } from "../components/Torch";
import { SoundVisualizer } from "../components/SoundVisualizer";
import {
  SYMBOLS_COLLECTION,
  getMorseInfo,
  MORSE_CODE_TABLE,
  ALPHABETS_COLLECTION,
  NUMBERS_COLLECTION,
} from "../utils/morseCode";

export default makeScene2D(function* (view) {
  const isFinal = useScene().variables.get("isFinal", true)();

  view.add(<Backround />);

  const thinkingBaseRef = createRef<Img>();
  const thinkingIdeaRef = createRef<Img>();
  const questionMarksRef: Txt[] = [];
  view.add(
    <>
      <Img ref={thinkingBaseRef} src={thinkingBase} scale={8.3} />
      <Txt
        ref={makeRef(questionMarksRef, 0)}
        x={-150}
        y={-360}
        // rotation={-10}
        rotation={0}
        text={"?"}
        scale={0}
        fontSize={360}
        fontWeight={900}
        fill={"#e5dfff"}
      />

      <Txt
        ref={makeRef(questionMarksRef, 1)}
        x={-350}
        y={20}
        // rotation={-20}
        rotation={0}
        text={"?"}
        scale={0}
        fontSize={300}
        fontWeight={900}
        fill={"#ffd7a9"}
      />

      <Txt
        ref={makeRef(questionMarksRef, 2)}
        x={450}
        y={-50}
        // rotation={20}
        rotation={0}
        text={"?"}
        scale={0}
        fontSize={300}
        fontWeight={900}
        fill={"#ff6a51"}
      />
    </>
  );
  thinkingBaseRef().save();
  thinkingBaseRef().y(300);
  thinkingBaseRef().opacity(0);
  thinkingBaseRef().scale(7);

  yield* thinkingBaseRef().restore(1);
  yield* all(
    ...questionMarksRef.map((q: Txt) => all(q.scale(1, 0.3, easeOutBack)))
  );
  const questionMarkRotationTask = yield loop(Infinity, () =>
    all(
      questionMarksRef[0].rotation(-10, 0.8).to(10, 0.8),
      questionMarksRef[1].rotation(-20, 0.8).to(20, 0.8),
      questionMarksRef[2].rotation(-20, 0.8).to(20, 0.8)
    )
  );

  //------------------------------------------------------------

  yield* waitUntil("idea");
  yield* all(...questionMarksRef.map((q: Txt) => all(q.scale(0, 0.2))));
  thinkingBaseRef().remove();
  cancel(questionMarkRotationTask);
  view.add(<Img ref={thinkingIdeaRef} src={thinkingIdea} scale={8.3} />);

  //------------------------------------------------------------

  yield* waitUntil("flashlight");
  thinkingIdeaRef().remove();

  const flashlight = createRef<Torch>();
  view.add(<Torch ref={flashlight} scale={0} y={150} x={-400} isOn={false} />);

  yield* flashlight().scale(1, 0.8, easeOutElastic);

  yield* waitFor(1);

  const wave = createRef<SoundVisualizer>();
  view.add(<SoundVisualizer x={15} y={-300} lineWidth={5} ref={wave} />);

  yield* wave().run();
  yield* waitFor(0.4);
  yield* flashlight().on();
  yield* waitFor(2.5);
  yield* flashlight().off();
  yield* flashlight().scale(0, 0.8, easeInElastic);

  //------------------------------------------------------------

  const questionMarksImageRef = createRef<Img>();
  view.add(
    <Img
      ref={questionMarksImageRef}
      y={420}
      src={questionMarksImage}
      scale={0.96}
      opacity={0}
      filters={[invert(1)]}
    />
  );

  yield* all(
    questionMarksImageRef().opacity(1, 0.4),
    questionMarksImageRef().y(-420, 4.8, linear)
  );

  yield* questionMarksImageRef().opacity(0, 0.4);
  questionMarksImageRef().remove();

  const textRefs: Txt[] = [];
  const lines: Line[] = [];
  const textBoxes: Rect[] = [];

  const cam = createRef<Camera>();

  view.add(
    <Camera ref={cam}>
      <Rect
        ref={makeRef(textBoxes, 0)}
        lineWidth={7}
        y={-400}
        stroke={"#e4e4e7"}
        radius={20}
        width={700}
        height={140}
      >
        <Txt
          ref={makeRef(textRefs, 0)}
          fill={"#e4e4e7"}
          fontFamily={"Arial"}
          fontWeight={500}
          fontSize={90}
          text={""}
        />
      </Rect>

      <Line
        ref={makeRef(lines, 0)}
        lineWidth={8}
        lineCap={"round"}
        radius={40}
        lineDash={[20, 20]}
        endArrow
        stroke={"#e4e4e7"}
        points={[
          [0, -325],
          [0, -75],
          [-550, -75],
          [-550, 150],
        ]}
        end={0}
      />

      <Line
        ref={makeRef(lines, 1)}
        lineWidth={8}
        lineCap={"round"}
        radius={40}
        lineDash={[20, 20]}
        endArrow
        stroke={"white"}
        points={[
          [0, -325],
          [0, -75],
          [550, -75],
          [550, 150],
        ]}
        end={0}
      />

      <Rect
        ref={makeRef(textBoxes, 1)}
        lineWidth={4}
        y={150}
        opacity={0}
        x={-550}
        stroke={"#e4e4e7"}
        radius={20}
        width={300}
        height={120}
      >
        <Txt
          ref={makeRef(textRefs, 1)}
          fill={"#ddd"}
          fontWeight={600}
          fontFamily={"Arial"}
          fontSize={70}
          text={""}
        />
      </Rect>

      <Rect
        ref={makeRef(textBoxes, 2)}
        lineWidth={4}
        opacity={0}
        y={150}
        x={550}
        stroke={"#ddd"}
        radius={20}
        width={250}
        height={120}
      >
        <Txt
          ref={makeRef(textRefs, 2)}
          fill={"white"}
          fontWeight={600}
          fontFamily={"Arial"}
          fontSize={70}
          text={""}
        />
      </Rect>
    </Camera>
  );

  yield* textRefs[0].text("Types of Uses", 0.8);
  yield* all(...lines.map((l) => l.end(1, 1.5)));
  yield* all(
    textBoxes[1].y(220, 0.8),
    textBoxes[1].opacity(1, 0.8),
    textBoxes[2].y(220, 0.8),
    textBoxes[2].opacity(1, 0.8)
  );
  yield* all(textRefs[1].text("Stroke", 0.8), textRefs[2].text("Blink", 0.8));

  // zooming
  yield* all(
    cam().centerOn([textBoxes[1].x() + 10, textBoxes[1].y() + 5], 1.5),
    cam().zoom(500, 1.5)
  );

  // add inside stroke
  const word = "Abacus";
  const wordRef = createRef<Txt>();
  const wordToLetters = createRef<Layout>();
  const arrowRef = createRef<Icon>();
  const letterRefs: Txt[] = [];
  const gap = createSignal(50);
  view.add(
    <Layout ref={wordToLetters} y={-350} x={-370}>
      <Txt
        ref={wordRef}
        fill={"white"}
        fontSize={100}
        text={word}
        scale={0}
        fontWeight={700}
      />

      <Icon
        ref={arrowRef}
        scale={7}
        opacity={0}
        rotation={90}
        icon={"material-symbols:arrow-warm-up-rounded"}
      />

      {...word
        .split("")
        .map((l, i) => (
          <Txt
            ref={makeRef(letterRefs, i)}
            fill={"white"}
            x={() => 200 + gap() * i}
            fontSize={100}
            fontWeight={700}
            scale={0}
            text={`'${l.toUpperCase()}'`}
          />
        ))}
    </Layout>
  );

  yield* wordRef().scale(1, 0.8, easeOutElastic);
  yield wordRef().x(-300, 0.4);
  yield* all(
    ...letterRefs.map((l) => all(l.scale(1, 0.6))),
    gap(200, 0.6),
    arrowRef().opacity(1, 0.6)
  );

  const A = yield* drawA(view);
  const B = yield* drawB(view);

  const dotsProps: TxtProps = {
    fill: "white",
    fontSize: 400,
    shadowBlur: 30,
    shadowColor: "white",
  };

  const dotsRef: Txt[] = [];
  const dotCollection = createRef<Node>();
  view.add(
    <Node ref={dotCollection}>
      {...range(4).map((i) => (
        <Txt
          ref={makeRef(dotsRef, i)}
          text={"."}
          y={200}
          x={150 + gap() * i}
          {...dotsProps}
          scale={0}
        />
      ))}
    </Node>
  );

  yield* chain(...dotsRef.map((d) => d.scale(1, 0.4)));

  yield* waitUntil("U");
  yield* all(A().x(-3000, 1), B().x(-3000, 1), dotCollection().x(-3000, 1));

  const U = yield* drawCorruptU(view);

  // clean up
  yield* waitUntil("switch");
  yield* all(U().y(1300, 0.8), wordToLetters().y(-1300, 0.8));
  yield* waitFor(0.1);
  U().remove();
  A().remove();
  B().remove();
  dotCollection().remove();
  wordToLetters().remove();

  yield* all(cam().centerOn([0, 0], 0.5), cam().zoom(1, 0.5));
  yield* all(
    cam().centerOn([textBoxes[2].x() + -57, textBoxes[2].y() - 10], 1),
    cam().zoom(500, 1.5)
  );

  yield* flashlight().scale(1, 0.8, easeOutElastic);
  yield* flashlight().blink();
  yield* flashlight().blink();
  yield* flashlight().on();

  yield* waitFor(3);

  const vid = createRef<Video>();
  view.add(
    <Video
      ref={vid}
      width={"100%"}
      scale={0}
      height={"100%"}
      radius={50}
      src={blinkVid}
      stroke={"#fce5ea"}
      shadowBlur={200}
      lineWidth={30}
      loop
      shadowColor={"#fce5ea"}
    />
  );
  yield vid().scale(0.8, 0.5);

  if (isFinal) {
    vid().play();
  }

  yield* waitFor(2);
  vid().pause();
  yield* vid().scale(0, 0.4);

  yield* waitFor(1);

  yield* flashlight().off();
  yield* flashlight().scale(0, 0.8, easeInElastic);

  yield* blinkingTable(view);

  yield* waitUntil("blink");

  const preRef = yield* blinkingCons(view);

  yield* twoTypesBlinking(view, preRef);

  yield* all(cam().centerOn([0, 0], 0.8), cam().zoom(1, 0.8));
  yield* cam().x(1700, 1);
});

function* blinkingCons(view: View2D) {
  const t = createRef<Torch>();
  const howAreYouTextAndItsLinesAndBlinksCount = createRef<Node>();
  const node = createRef<Node>();
  const text = createRef<Txt>();
  const equalsTo = createRef<Txt>();
  const total = createRef<Txt>();
  const word = createRef<Txt>();
  const lastLine = createRef<Line>();
  const lines: Line[] = [];
  const lines2: Line[] = [];
  const texts: Txt[] = [];
  const texts2: Txt[] = [];
  const redCircle = createRef<Rect>();

  function* makeBlink(t: Reference<Torch>, speed: number = 1) {
    yield* t().on(0.2 / speed);
    yield* t().off(0.1 / speed);
  }

  const lettersProps: TxtProps = {
    fill: "#ff0",
    shadowColor: "#ff0",
    shadowBlur: 5,
    lineDash: [8, 20],
    fontFamily: "Arial",
    fontWeight: 700,
    fontSize: 90,
    x: -100,
    y: -150,
    scale: 0,
  };

  const lineProps: LineProps = {
    stroke: "#ccc",
    radius: 60,
    lineWidth: 6,
    lineCap: "round",
    lineDash: [8, 20],
    endArrow: true,
    end: 0,
    opacity: 0,
  };

  view.add(
    <>
      <Torch scale={0} ref={t} isOn={false} x={-500} y={100} />

      {/* HOW ARE YOU? */}
      <Node ref={howAreYouTextAndItsLinesAndBlinksCount}>
        <Txt
          ref={word}
          fill={"#fffd"}
          fontSize={100}
          fontWeight={700}
          fontFamily={"Arial"}
          y={-400}
          letterSpacing={20}
          opacity={0.95}
        />

        <Line
          {...lineProps}
          ref={makeRef(lines2, 0)}
          points={[
            [-470, -350],
            [-470, -220],
          ]}
        />
        <Txt
          ref={makeRef(texts2, 0)}
          {...lettersProps}
          fontSize={65}
          fontWeight={600}
          x={-470}
          text={"8"}
        />

        <Line
          {...lineProps}
          ref={makeRef(lines2, 1)}
          points={[
            [-380, -350],
            [-380, -220],
          ]}
        />
        <Txt
          ref={makeRef(texts2, 1)}
          {...lettersProps}
          fontSize={65}
          fontWeight={600}
          x={-380}
          text={"15"}
        />

        <Line
          {...lineProps}
          ref={makeRef(lines2, 2)}
          points={[
            [-380 + 110, -350],
            [-380 + 110, -220],
          ]}
        />
        <Txt
          ref={makeRef(texts2, 2)}
          {...lettersProps}
          fontSize={65}
          fontWeight={600}
          x={-380 + 110}
          text={"23"}
        />

        <Line
          {...lineProps}
          ref={makeRef(lines2, 3)}
          points={[
            [-120, -350],
            [-120, -220],
          ]}
        />
        <Txt
          ref={makeRef(texts2, 3)}
          {...lettersProps}
          fontSize={65}
          fontWeight={600}
          x={-120}
          text={"1"}
        />

        <Line
          {...lineProps}
          ref={makeRef(lines2, 4)}
          points={[
            [-30, -350],
            [-30, -220],
          ]}
        />
        <Txt
          ref={makeRef(texts2, 4)}
          {...lettersProps}
          fontSize={65}
          fontWeight={600}
          x={-30}
          text={"18"}
        />

        <Line
          {...lineProps}
          ref={makeRef(lines2, 5)}
          points={[
            [65, -350],
            [65, -220],
          ]}
        />
        <Txt
          ref={makeRef(texts2, 5)}
          {...lettersProps}
          fontSize={65}
          fontWeight={600}
          x={65}
          text={"5"}
        />

        <Line
          {...lineProps}
          ref={makeRef(lines2, 6)}
          points={[
            [195, -350],
            [195, -220],
          ]}
        />
        <Txt
          ref={makeRef(texts2, 6)}
          {...lettersProps}
          fontSize={65}
          fontWeight={600}
          x={195}
          text={"25"}
        />

        <Line
          {...lineProps}
          ref={makeRef(lines2, 7)}
          points={[
            [285, -350],
            [285, -220],
          ]}
        />
        <Txt
          ref={makeRef(texts2, 7)}
          {...lettersProps}
          fontSize={65}
          fontWeight={600}
          x={285}
          text={"15"}
        />

        <Line
          {...lineProps}
          ref={makeRef(lines2, 8)}
          points={[
            [385, -350],
            [385, -220],
          ]}
        />
        <Txt
          ref={makeRef(texts2, 8)}
          {...lettersProps}
          fontSize={65}
          fontWeight={600}
          x={385}
          text={"21"}
        />

        <Line
          {...lineProps}
          ref={lastLine}
          points={[
            [470, -350],
            [470, -220],
          ]}
        />
        <Rect
          ref={redCircle}
          opacity={0}
          stroke={"red"}
          lineCap={"round"}
          lineWidth={8}
          shadowBlur={10}
          shadowColor={"red"}
          lineDash={[5, 20]}
          radius={50}
          width={100}
          height={100}
          x={475}
          y={-150}
        />
      </Node>

      <Node ref={node}>
        <Txt
          ref={text}
          fill={"#fffd"}
          fontSize={100}
          fontWeight={700}
          fontFamily={"Arial"}
          opacity={0}
        >
          was it <Txt fill={"yellow"}>AA</Txt> or <Txt fill={"yellow"}>B</Txt>
        </Txt>

        {/* BAD */}
        <Node>
          <Line
            {...lineProps}
            ref={makeRef(lines, 0)}
            points={[
              [-100, -350],
              [-100, -220],
            ]}
          />
          <Txt {...lettersProps} ref={makeRef(texts, 0)}>
            2
          </Txt>

          <Line
            {...lineProps}
            ref={makeRef(lines, 1)}
            points={[
              [-10, -350],
              [-10, -220],
            ]}
          />
          <Txt {...lettersProps} ref={makeRef(texts, 1)} x={-10}>
            1
          </Txt>

          <Line
            {...lineProps}
            ref={makeRef(lines, 2)}
            points={[
              [80, -350],
              [80, -220],
            ]}
          />
          <Txt {...lettersProps} ref={makeRef(texts, 2)} x={80}>
            4
          </Txt>
        </Node>
      </Node>

      <Txt {...lettersProps} ref={equalsTo} fill={"white"} x={600} text={"="} />
      <Txt {...lettersProps} ref={total} x={720} fontSize={70} text={"131"} />
    </>
  );

  yield* t().scale(1, 0.8, easeOutElastic);
  yield* waitFor(1);

  yield* makeBlink(t);
  yield* makeBlink(t);

  yield* waitFor(0.5);

  yield* all(text().opacity(1, 1), text().y(-400, 2, easeOutExpo));

  yield* waitUntil("manyBlink");
  yield* all(text().opacity(0, 0.2), word().text("BAD", 1));
  lines.forEach((line) => line.opacity(1));
  yield* all(...lines.map((line) => line.end(1, 0.8)));
  yield* all(...texts.map((tex) => tex.scale(1, 0.8)));

  equalsTo().save();
  equalsTo().x(200);

  total().save();
  total().x(350);
  total().text("7");

  yield* all(equalsTo().scale(1, 0.4), total().scale(1, 0.4));

  yield* chain(...range(7).map(() => makeBlink(t)));
  lines.forEach((line) => {
    line.opacity(0);
    line.end(0);
  });
  yield* all(
    ...texts.map((tex) => tex.scale(0, 0.1)),
    equalsTo().scale(0, 0.2),
    total().scale(0, 0.2)
  );

  yield* all(word().text("HOW ARE YOU?", 1));

  equalsTo().restore();
  total().restore();

  lines2.forEach((line) => line.opacity(1));
  yield* all(...lines2.map((l) => l.end(1, 0.8)));
  yield* all(...texts2.map((tex) => tex.scale(1, 0.8)));
  yield* all(equalsTo().scale(1, 0.2), total().scale(1, 0.2));

  // start blinking
  yield chain(...range(30).map(() => makeBlink(t, 1.5)));
  // strart rotation
  const rotationTask: ThreadGenerator = yield loop(Infinity, () =>
    redCircle().rotation(360, 4, linear).to(0, 4, linear)
  );
  yield* waitFor(3);
  lastLine().opacity(1);
  yield* all(lastLine().end(1, 0.8), redCircle().opacity(1, 0.8));

  yield* waitFor(3);

  howAreYouTextAndItsLinesAndBlinksCount().save();
  equalsTo().save();
  total().save();
  yield* all(
    howAreYouTextAndItsLinesAndBlinksCount().x(-1900, 0.8),
    equalsTo().x(-1900, 0.8),
    total().x(-1900, 0.8)
  );

  howAreYouTextAndItsLinesAndBlinksCount().restore();
  lines2.forEach((l) => l.opacity(0));
  texts2.forEach((l) => l.opacity(0));
  word().opacity(0);
  redCircle().opacity(0);
  lastLine().opacity(0);

  equalsTo().restore();
  equalsTo().opacity(0);

  total().restore();
  total().opacity(0);

  cancel(rotationTask);
  node().remove();

  return {
    torch: t,
    word,
    lines: lines2,
    counts: texts2,
    redCircle,
    lastLine,
    equalsTo,
    total,
  };
}

function* blinkingTable(view: View2D) {
  const boxRef: Layout[] = [];
  const title = createRef<Txt>();
  const layout = createRef<Layout>();

  function textBox(index: number) {
    const startingPoint = 65;
    const box = (
      <Layout
        ref={makeRef(boxRef, index)}
        layout
        gap={60}
        justifyContent={"center"}
        alignItems={"center"}
        scale={0}
      >
        <Txt
          fill={"white"}
          fontFamily={"Poppins"}
          fontSize={60}
          text={String.fromCharCode(startingPoint + index)}
        />
        <Icon
          scale={4}
          icon={"material-symbols:line-end-arrow-notch-rounded"}
        />

        <Txt
          fontFamily={"Poppins"}
          fill={"white"}
          fontSize={60}
          fontWeight={500}
          text={String(index + 1)}
        />
      </Layout>
    );

    return box;
  }

  view.add(
    <Txt
      y={-400}
      ref={title}
      fontFamily={"Arial"}
      fontSize={150}
      fill={"#ddd"}
      fontWeight={700}
      text={""}
    />
  );

  view.add(
    <Layout
      y={150}
      width={view.width}
      height={view.height() - 300}
      layout
      gap={40}
      direction={"column"}
      ref={layout}
      alignItems={"center"}
      wrap={"wrap"}
      textWrap
    >
      {...range(26).map((i) => textBox(i))}
    </Layout>
  );

  yield* title().text("Letters = Blinks", 0.8);
  yield* chain(...boxRef.map((b) => b.scale(1, 0.2)));

  yield* waitFor(6);

  yield* all(
    chain(...boxRef.map((b) => b.scale(0, 0.05))),
    title().text("", 0.3)
  );

  title().remove();
  layout().remove();
}

function* drawA(view: View2D) {
  const lineProps = {
    stroke: "white",
    radius: 10,
    shadowBlur: 30,
    shadowColor: "white",
    lineWidth: 21,
  };

  const mainLine = createRef<Line>();
  const crossLine = createRef<Ray>();
  const node = createRef<Node>();

  view.add(
    <Node ref={node} x={-600} y={300}>
      <Line
        {...lineProps}
        lineCap={"round"}
        scale={2}
        ref={mainLine}
        end={0}
        points={[
          [0, 0],
          [60, -150],
          [120, 0],
        ]}
      />

      <Ray
        {...lineProps}
        lineCap={"round"}
        scale={2}
        ref={crossLine}
        lineWidth={() => clamp(0, 21, crossLine().arcLength())}
        end={0}
        from={[20, -40]}
        to={[100, -40]}
      />
    </Node>
  );

  yield* mainLine().end(1, 0.8);
  yield* crossLine().end(1, 0.5);
  return node;
}

function* drawB(view: View2D) {
  const lineProps = {
    stroke: "white",
    radius: 10,
    shadowBlur: 30,
    shadowColor: "white",
    lineWidth: 21,
  };

  const mainLine = createRef<Line>();
  const crossLine: Line[] = [];
  const node = createRef<Node>();

  view.add(
    <Node ref={node} x={-170} y={300}>
      <Line
        {...lineProps}
        lineCap={"round"}
        scale={2}
        ref={mainLine}
        end={0}
        points={[
          [0, -134],
          [0, 0],
        ]}
      />

      <Line
        {...lineProps}
        opacity={0}
        radius={30}
        lineCap={"round"}
        scale={2}
        ref={makeRef(crossLine, 0)}
        end={0}
        points={[
          [5, -134],
          [80, -134],
          [80, -134 / 2],
          [5, -134 / 2],
        ]}
      />

      <Line
        {...lineProps}
        opacity={0}
        radius={30}
        y={134}
        lineCap={"round"}
        scale={2}
        ref={makeRef(crossLine, 1)}
        end={0}
        points={[
          [5, -134],
          [80, -134],
          [80, -134 / 2],
          [0, -134 / 2],
        ]}
      />
    </Node>
  );

  yield* mainLine().end(1, 0.8);
  crossLine[0].opacity(1);
  yield* crossLine[0].end(1, 0.5, linear);
  crossLine[1].opacity(1);
  yield* crossLine[1].end(1, 0.5, linear);

  return node;
}

function* drawCorruptU(view: View2D) {
  const lineProps = {
    stroke: "#f51e1eff",

    radius: 60,
    shadowBlur: 30,
    shadowColor: "#f00",
    lineWidth: 21,
  };

  const lineProps2: LineProps = {
    stroke: "#ccc",
    radius: 60,
    lineWidth: 6,
    lineCap: "round",
    lineDash: [8, 20],
    endArrow: true,
    end: 0,
  };

  const lettersProps: TxtProps = {
    fill: "#fff",
    lineDash: [8, 20],
    text: "",
    fontFamily: "Arial",
    fontWeight: 700,
    fontSize: 90,
    x: 1080,
    y: -450,
    scale: 0,
  };

  const node = createRef<Node>();
  const mainLine = createRef<Line>();
  const line = createRef<Line>();
  const quadLines: Line[] = [];
  const letters: Txt[] = [];
  const couldBe = createRef<Txt>();

  view.add(
    <Node ref={node} x={-500} y={350}>
      <Line
        {...lineProps}
        lineCap={"round"}
        scale={2}
        ref={mainLine}
        end={0}
        points={[
          [0, -130],
          [0, 0],
          [74, 0],
          [74, -170],
          [20, -200],
        ]}
      />

      <Line
        {...lineProps2}
        endArrow={false}
        ref={line}
        points={[
          [200, -200],
          [300, -200],
        ]}
      />

      <Txt
        x={450}
        y={-200}
        fontSize={60}
        ref={couldBe}
        fill={"white"}
        scale={0}
        text={"Could be"}
      />

      <Line
        {...lineProps2}
        points={[
          [600, -200],
          [700, -200],
          [700, -450],
          [1000, -450],
        ]}
        ref={makeRef(quadLines, 0)}
      />
      <Line
        {...lineProps2}
        points={[
          [600, -200],
          [700, -200],
          [700, -325],
          [1000, -325],
        ]}
        ref={makeRef(quadLines, 1)}
      />

      <Line
        {...lineProps2}
        points={[
          [600, -200],
          [700, -200],
          [700, -200 + 125],
          [1000, -200 + 125],
        ]}
        ref={makeRef(quadLines, 2)}
      />

      <Line
        {...lineProps2}
        points={[
          [600, -200],
          [700, -200],
          [700, 50],
          [1000, 50],
        ]}
        ref={makeRef(quadLines, 3)}
      />

      <Txt ref={makeRef(letters, 0)} {...lettersProps} text={"U"} />
      <Txt
        ref={makeRef(letters, 1)}
        {...lettersProps}
        text={"O"}
        y={-450 + 125}
      />
      <Txt
        ref={makeRef(letters, 2)}
        {...lettersProps}
        text={"0"}
        y={-450 + 125 * 3}
      />
      <Txt
        ref={makeRef(letters, 3)}
        {...lettersProps}
        text={"d"}
        y={-450 + 125 * 4}
      />
    </Node>
  );

  yield* mainLine().end(1, 1, linear);
  yield* all(line().end(1, 0.8), couldBe().scale(1, 0.8));
  yield* chain(...quadLines.map((q) => q.end(1, 0.6)));
  yield* chain(...letters.map((l) => l.scale(1, 0.5)));
  return node;
}

function* twoTypesBlinking(
  view: View2D,
  o: {
    torch: Reference<Torch>;
    word: Reference<Txt>;
    lines: Line[];
    counts: Txt[];
    redCircle: Reference<Rect>;
    lastLine: Reference<Line>;
    equalsTo: Reference<Txt>;
    total: Reference<Txt>;
  }
) {
  yield* waitFor(1);
  // const textRefs: Txt[] = [];
  // const lines: Line[] = [];
  // const textBoxes: Rect[] = [];

  const node = createRef<Node>();
  const title = createRef<Txt>();
  const longText = createRef<Txt>();
  const shortText = createRef<Txt>();
  const longLine = createRef<Line>();
  const shortLine = createRef<Line>();

  view.add(
    <>
      <Node ref={node}>
        <Txt
          ref={title}
          text={"Blinking Types"}
          fill={"#e4e4e7"}
          fontFamily={"Arial"}
          fontWeight={600}
          fontSize={90}
          y={-400}
          scale={0}
        />

        <Line
          end={0}
          opacity={0}
          ref={longLine}
          lineWidth={8}
          lineCap={"round"}
          lineDash={[20, 20]}
          endArrow
          stroke={"#e4e4e7"}
          points={[
            [-100, -325],
            [-250, -100],
          ]}
        />

        <Txt
          ref={longText}
          text={"long"}
          fill={"#e4e4e7"}
          fontFamily={"Arial"}
          fontWeight={600}
          fontSize={60}
          y={-50}
          x={-250}
          scale={0}
        />

        <Line
          end={0}
          opacity={0}
          ref={shortLine}
          lineWidth={8}
          lineCap={"round"}
          lineDash={[20, 20]}
          endArrow
          stroke={"#e4e4e7"}
          points={[
            [100, -325],
            [250, -100],
          ]}
        />

        <Txt
          ref={shortText}
          text={"short"}
          fill={"#e4e4e7"}
          fontFamily={"Arial"}
          fontWeight={600}
          fontSize={60}
          y={-50}
          x={250}
          scale={0}
        />
      </Node>
    </>
  );

  yield all(o.torch().y(200, 1), o.torch().x(-600, 1));

  yield* title().scale(1, 0.8);

  yield* waitUntil("long");
  longLine().opacity(1);
  yield* longLine().end(1, 0.6);
  yield* longText().scale(1, 0.5);
  yield* o.torch().dash();

  shortLine().opacity(1);
  yield* shortLine().end(1, 0.6);
  yield* shortText().scale(1, 0.4);
  yield* o.torch().dot();

  yield* waitUntil("32");
  yield* node().x(-1500, 0.8);
  o.lines.forEach((l) => {
    l.opacity(1);
    l.end(0);
  });
  yield* all(
    o.word().opacity(1, 0.5),
    delay(0.5, all(...o.lines.map((l) => l.end(1, 0.6))))
  );

  const counting: string[] = ["4", "3", "3", "2", "3", "1", "4", "3", "3"];
  o.counts.forEach((c, i) => c.text(counting[i]));
  yield* all(...o.counts.map((l) => l.opacity(1, 0.6)));

  // start blinking torch
  function playMorse(letter: string, torch: Reference<Torch>) {
    const { code } = getMorseInfo(letter);
    const arr = code.split("");
    const gArr = arr.map((c) =>
      c === "." ? torch().dot(0.2) : torch().dash(0.4)
    );

    gArr.push(waitFor(0.2));
    return gArr;
  }

  yield chain(
    ...playMorse("H", o.torch),
    ...playMorse("O", o.torch),
    ...playMorse("W", o.torch),
    ...playMorse("A", o.torch),
    ...playMorse("R", o.torch),
    ...playMorse("E", o.torch),
    ...playMorse("Y", o.torch),
    ...playMorse("O", o.torch),
    ...playMorse("U", o.torch),
    ...playMorse("?", o.torch)
  );

  o.lastLine().opacity(1);
  o.lastLine().end(0);

  yield* waitFor(1);

  yield* o.lastLine().end(1, 0.6);

  const blinksCountforQuestionMark = o.counts[o.counts.length - 1].clone();
  blinksCountforQuestionMark.x(470);
  blinksCountforQuestionMark.text("6");
  blinksCountforQuestionMark.opacity(0);

  view.add(blinksCountforQuestionMark);
  yield* all(
    o.redCircle().opacity(1, 0.6),
    o.redCircle().stroke("#4ade80", 0.6),
    blinksCountforQuestionMark.opacity(1, 0.6)
  );

  o.total().text("32");

  yield* all(o.equalsTo().opacity(1, 0.6), o.total().opacity(1, 0.6));

  yield* waitUntil("stangerThings");

  yield* all(
    o.word().x(1500, 0.8),
    o.equalsTo().x(1500, 0.8),
    o.total().x(1500, 0.8),
    ...o.lines.map((l) => l.x(1500, 0.8)),
    ...o.counts.map((l) => l.x(1500, 0.8)),
    o.lastLine().x(1500, 0.8),
    blinksCountforQuestionMark.x(1500, 0.8),
    o.redCircle().x(1500, 0.8),
    o.torch().x(1500, 0.8)
  );

  const strangerThingsRef = createRef<Img>();
  const morseCodeTextRef = createRef<Txt>();
  const longBlinkRef = createRef<Txt>();
  const shortBlinkRef = createRef<Txt>();
  const dashRef = createRef<Txt>();
  const dotRef = createRef<Txt>();

  view.add(
    <Img ref={strangerThingsRef} src={strangerThingsImg} scale={0} y={-80} />
  );

  yield* strangerThingsRef().scale(0.8, 0.8);

  yield* waitUntil("morseCode");

  const textprops: TxtProps = {
    fontFamily: "Poppins",
    fill: "white",
    fontSize: 60,
    fontWeight: 600,
    opacity: 0,
  };

  view.add(
    <>
      <Txt
        ref={morseCodeTextRef}
        fill={"white"}
        scale={0}
        fontFamily={"Poppins"}
        fontSize={150}
        fontWeight={700}
        text={"Morse Code"}
        shadowColor={"white"}
        shadowBlur={15}
      />
      <Txt
        ref={longBlinkRef}
        y={-200}
        {...textprops}
        x={-400}
        text={"Long Blink"}
      />

      <Txt
        ref={dashRef}
        y={200}
        fontFamily={"Poppins"}
        fontSize={40}
        fill={"#fffd"}
        x={-400}
        text={"Dash(_)"}
        opacity={0}
      />

      <Txt
        ref={shortBlinkRef}
        y={-200}
        x={400}
        {...textprops}
        text={"Short Blink"}
      />

      <Txt
        ref={dotRef}
        y={200}
        fontFamily={"Poppins"}
        fontSize={40}
        fill={"#fffd"}
        x={400}
        text={"Dot(.)"}
        opacity={0}
      />
    </>
  );

  yield* all(
    strangerThingsRef().scale(0, 0.4),
    delay(0.4, morseCodeTextRef().scale(1, 0.6))
  );

  yield* morseCodeTextRef().y(-450, 1.5);
  yield* waitFor(2);
  yield* all(
    longBlinkRef().opacity(1, 0.6),
    longBlinkRef().y(0, 0.6),
    delay(0.2, all(dashRef().y(110, 0.6), dashRef().opacity(1, 0.6)))
  );

  yield* all(
    shortBlinkRef().opacity(1, 0.6),
    shortBlinkRef().y(0, 0.6),
    delay(0.2, all(dotRef().y(110, 0.6), dotRef().opacity(1, 0.6)))
  );

  yield* waitUntil("morseTable");
  yield* all(
    longBlinkRef().opacity(0, 0.6),
    longBlinkRef().y(-200, 0.6),
    shortBlinkRef().opacity(0, 0.6),
    shortBlinkRef().y(-200, 0.6),
    dashRef().y(200, 0.6),
    dashRef().opacity(0, 0.6),
    dotRef().y(200, 0.6),
    dotRef().opacity(0, 0.6)
  );

  yield* morseCodeTextRef().text("Morse Table", 1);
  const boxRef: Layout[] = [];

  const layout = createRef<Layout>();

  function morseBox(alphabet: string, index: number) {
    const box = (
      <Layout
        ref={makeRef(boxRef, index)}
        layout
        gap={30}
        alignItems={"center"}
        alignSelf={"start"}
        scale={0}
      >
        <Txt
          fill={"white"}
          fontFamily={"Poppins"}
          fontSize={50}
          opacity={0.9}
          fontWeight={700}
          text={alphabet}
        />
        {/* <Icon
          scale={4}
          opacity={0.4}
          icon={"material-symbols:line-end-arrow-notch-rounded"}
        /> */}

        <Txt
          fontFamily={"Poppins"}
          fill={"#ddd"}
          fontSize={45}
          opacity={0.8}
          fontWeight={400}
          text={MORSE_CODE_TABLE[alphabet]}
        />
      </Layout>
    );

    return box;
  }

  view.add(
    <Layout
      y={100}
      x={40}
      width={view.width}
      height={view.height() - 200}
      layout
      gap={38}
      direction={"column"}
      ref={layout}
      alignItems={"center"}
      wrap={"wrap"}
      textWrap
    >
      {...ALPHABETS_COLLECTION.map((a, index) => morseBox(a, index))}

      {...NUMBERS_COLLECTION.map((n, index) =>
        morseBox(n, index + ALPHABETS_COLLECTION.length)
      )}
      {...SYMBOLS_COLLECTION.map((s, index) =>
        morseBox(
          s,
          index + ALPHABETS_COLLECTION.length + NUMBERS_COLLECTION.length
        )
      )}
    </Layout>
  );

  yield* chain(...boxRef.map((r) => r.scale(1, 0.1)));

  yield* waitUntil("end");

  yield* all(
    ...boxRef.map((r) => r.scale(0, 0.3)),
    morseCodeTextRef().text("", 0.3)
  );
}
