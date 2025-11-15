/*
socho ki aap 1960 main ek 10 sal ke bachhe ho, na koi wi-fi aur na koi phone. 

Aapka ek dost hai jo road ki uss taraf rehta hai. Yeh dono sath padhte aur khelte bhi hai, sirf dikkat ek hai ki sham hone ke bad aapke parents bahr jane nhi dete, aur aapko apne dost se late nigh gappe marne hai, 

aur baten kre bhi kyu na akhirkar ham uss dour mai rehte hai jha pr almost 70% computer ka use communication ke liye hi hota hai; to aap bataiye iss problem ke liye aap kya krte.

shayad aap apni window khol kr uski tarf jor-jor se chillate, jo ki bilkul bhi shi nhi lagta kyuki apke secret ab dusre bhi sunege ya fir worst case mai aapke parent aap se pareshan hokar aapka room hi badal de.

*/

import {
  hue,
  Txt,
  makeScene2D,
  invert,
  Layout,
  Node,
  Spline,
  Line,
  Circle,
  Video,
  Rect,
  Gradient,
  SVG,
  Img,
  TxtProps,
  colorSignal,
} from "@motion-canvas/2d";
import Backround from "../components/GradientBackgroung";
import boySvg from "../assets/img/boy.svg?raw";
import boySvg2 from "../assets/img/boy.svg?raw";
import wifiSvg from "../assets/img/wifi.svg?raw";
import phoneSvg from "../assets/img/phone.svg?raw";
import crossSvg from "../assets/img/cross.svg?raw";
import calling from "../assets/vid/callers.mp4";
import action1 from "../assets/img/twoChild/2151495149.jpg";
import action2 from "../assets/img/twoChild/2151495154.jpg";
import action3 from "../assets/img/twoChild/2151495158.jpg";
import action4 from "../assets/img/twoChild/2151495178.jpg";
import megaphone from "../assets/img/megaphone.svg";
import spy from "../assets/vid/spy.mp4";
import slap from "../assets/vid/slap.mp4";

import {
  all,
  cancel,
  chain,
  Color,
  createRef,
  createSignal,
  DEFAULT,
  delay,
  easeInBack,
  easeInCubic,
  easeInOutCubic,
  easeInOutSine,
  easeOutBack,
  easeOutCubic,
  linear,
  loop,
  makeRef,
  range,
  spawn,
  useRandom,
  useScene,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import { SmartSVG } from "../components/SmartSVG";

export default makeScene2D(function* (view) {
  const hueSignal = createSignal(0);
  const isFinal = useScene().variables.get("isFinal", true)();

  view.add(<Backround filters={[hue(() => hueSignal())]} />);

  const baseWords = [
    "!",
    ";",
    "true",
    "false",
    "[]",
    "{}",
    "()",
    "+",
    "-",
    "*",
    "/",
    "~",
    ">>",
    "<<",
    "&",
    "|",
    ":",
    ".",
    "^",
    "%",
    "&&",
    "||",
    "<",
    ">",
    "?",
    "'",
    '"',
  ];

  const words = Array(3).fill(baseWords).flat();

  const wordsRef: Txt[] = [];
  const randomGen = useRandom();
  const safeWidth = view.width() / 2;
  const safeHeigh = view.height() / 2;

  view.add(
    <>
      {words.map((word, i) => (
        <Txt
          ref={makeRef(wordsRef, i)}
          fontSize={40}
          fontWeight={700}
          shadowColor={"#ffffff80"}
          shadowBlur={10}
          fontFamily={"Poppins"}
          x={randomGen.nextInt(-safeWidth, safeWidth)}
          y={randomGen.nextInt(-safeHeigh, safeHeigh)}
          opacity={0}
          fill={"gray"}
          text={word}
        />
      ))}
    </>
  );

  const floatingCode = yield loop(() =>
    spawn(
      all(
        ...wordsRef.map((wordRef) => {
          const [cx, cy] = wordRef.position();
          const nx = cx + randomGen.nextInt(-50, 50); // small offset
          const ny = cy + randomGen.nextInt(-50, 50);

          return all(
            wordRef.position([nx, ny], 4, easeInOutSine),
            wordRef.opacity(0.2, 0.3, easeInCubic)
          ); // longer duration
        })
      )
    )
  );

  yield* waitUntil("story");
  // remove code
  yield hueSignal(100, 1);
  if (!isFinal) {
    cancel(floatingCode);
  }

  const year = createRef<Txt>();
  const year_number = createRef<Txt>();
  const year_astrick = createRef<Txt>();
  const boy = createRef<SmartSVG>();
  const raju = createRef<Txt>();
  const boy2 = createRef<SmartSVG>();
  const shyam = createRef<Txt>();
  const wifi = createRef<SmartSVG>();
  const phone = createRef<SmartSVG>();
  const cross = createRef<SmartSVG>();
  const cross2 = createRef<SmartSVG>();
  const leftRoadSpline = createRef<Spline>();
  const centerRoadSpline = createRef<Spline>();
  const rightRoadSpline = createRef<Spline>();

  const nameprops: TxtProps = {
    fill: "white",
    fontFamily: "Poppins",
    fontWeight: 700,
    fontSize: 100,
    y: 600,
  };

  view.add(
    <>
      <Node ref={year}>
        <Txt
          ref={year_number}
          fill={"white"}
          text={"1960"}
          fontFamily={"Poppins"}
          fontSize={180}
          fontWeight={700}
        />

        <Txt
          ref={year_astrick}
          offsetY={-0.3}
          fill={"#f24"}
          text={"*"}
          fontFamily={"Poppins"}
          fontSize={180}
          x={250}
          y={-100}
          fontWeight={700}
        />
      </Node>

      <SmartSVG ref={boy} scale={0.5} svg={boySvg} />
      <Txt ref={raju} {...nameprops} text={"Raju"} alignSelf={"end"} x={-650} />

      <SmartSVG ref={boy2} filters={[hue(-30)]} scale={0.5} svg={boySvg2} />
      <Txt ref={shyam} {...nameprops} text={"Shyam"} x={650} />

      <Spline
        ref={leftRoadSpline}
        x={-150}
        end={0}
        lineWidth={10}
        stroke={"#ccc"}
        rotation={-30}
        lineCap={"round"}
        points={[
          [-400, 500],
          [-200, 200],
          [200, -100],
          [400, -500],
        ]}
      />

      <Spline
        ref={centerRoadSpline}
        end={0}
        lineWidth={25}
        stroke={"white"}
        shadowColor={"white"}
        shadowBlur={40}
        rotation={-30}
        lineDash={[60, 60]}
        lineCap={"round"}
        x={0}
        points={[
          [-400, 500],
          [-200, 200],
          [200, -100],
          [400, -500],
        ]}
      />

      <Spline
        ref={rightRoadSpline}
        end={0}
        lineWidth={10}
        stroke={"#ccc"}
        rotation={-30}
        lineCap={"round"}
        x={150}
        points={[
          [-400, 500],
          [-200, 200],
          [200, -100],
          [400, -500],
        ]}
      />
    </>
  );

  const wifiAndPhone = (
    <Layout>
      <SmartSVG
        ref={wifi}
        lineWidth={1}
        filters={[invert(1)]}
        scale={0.5}
        svg={wifiSvg}
      />

      <SmartSVG
        ref={phone}
        lineWidth={1}
        filters={[invert(1)]}
        scale={0.5}
        // offset={[-1, -1]}

        svg={phoneSvg}
      />

      <SmartSVG
        ref={cross}
        lineWidth={1}
        scale={0.35}
        position={() => wifi().position()}
        svg={crossSvg}
      />

      <SmartSVG
        ref={cross2}
        lineWidth={1}
        scale={0.35}
        position={() => phone().position()}
        svg={crossSvg}
      />
    </Layout>
  );

  view.add(wifiAndPhone);

  year().save();

  year().scale(0.6);
  year().opacity(0);
  year().y(100);

  yield* year().restore(0.5);
  const startRotation = yield loop(() =>
    year_astrick().rotation(0).rotation(360, 2, linear)
  );
  // wait
  yield* waitFor(2);
  yield* all(year().scale(0.3, 0.3), year().position([-800, -450], 0.5));
  yield* boy().reveal(0.3, 0.6);

  // yield* waitUntil("nothing");
  yield* boy().x(-650, 0.3, easeOutBack);
  yield* wifi().reveal(0.2, 0.3);
  yield* wifi().position(
    new Vector2(600, -250),
    0.6,
    easeOutCubic,
    Vector2.arcLerp
  );
  yield* phone().reveal(0.2, 0.3);
  yield* phone().position(
    new Vector2(600, 250),
    0.2,
    easeOutCubic,
    Vector2.arcLerp
  );
  yield* all(cross().reveal(0.4, 0.8), cross2().reveal(0.4, 0.8));

  yield* wifiAndPhone.x(600, 0.5, easeInBack);
  yield* boy2().reveal(0.3, 0.6);
  yield* boy2().x(650, 0.3, easeOutBack);

  yield* shyam().y(300, 0.5);
  yield* waitFor(1);
  yield* raju().y(300, 0.5);
  yield* waitFor(1);
  // yield* waitUntil("road");
  yield* all(
    leftRoadSpline().end(1, 1.5),
    centerRoadSpline().end(1, 1.5),
    rightRoadSpline().end(1, 1.5)
  );

  yield* waitFor(1);
  // here play
  function myMap(
    fromMin: number,
    fromMax: number,
    toMin: number,
    toMax: number,
    value: number
  ): number {
    return toMin + ((value - fromMin) / (fromMax - fromMin)) * (toMax - toMin);
  }

  const actions = [action4, action2, action3, action1];
  const xOffset = 270;
  const yOffset = 270;
  const cols = 12 * 2;
  const rows = 6 * 2;

  const dotsRect = createRef<Rect>();
  const cross3 = createRef<SVG>();
  const childrenimgs: Img[] = [];

  view.add(
    <>
      <Rect
        ref={dotsRect}
        scale={0}
        opacity={0}
        cache
        height={() => view.height()}
        fill={"#ddd"}
        width={() => view.width()}
      >
        {range(rows).flatMap((row) =>
          range(cols).map((col) => (
            <Circle
              cache
              size={10}
              opacity={0.9}
              fill={"#ddd"}
              // X spans full width
              x={() =>
                myMap(0, cols - 1, -view.width() / 2, view.width() / 2, col)
              }
              // Y spans full height
              y={() =>
                myMap(0, rows - 1, -view.height() / 2, view.height() / 2, row)
              }
            />
          ))
        )}
      </Rect>

      {...actions.map((child, i) => (
        <Img
          ref={makeRef(childrenimgs, i)}
          scale={0}
          radius={200}
          x={() => (i <= 1 ? xOffset : -xOffset)}
          y={() => (i % 2 === 0 ? yOffset : -yOffset)}
          src={child}
        />
      ))}

      <SVG scale={0} ref={cross3} svg={crossSvg} />
    </>
  );
  yield* all(dotsRect().scale(1, 0.8), dotsRect().opacity(1, 0.5));

  const childrenRoationTask = yield loop(() =>
    all(
      ...childrenimgs.map((child, i) =>
        child.rotation(-2 - i * 0.6, 0.8).to(2 + i * 0.6, 0.8)
      )
    )
  );

  yield* childrenimgs[3].scale(0.25, 1);
  yield* childrenimgs[1].scale(0.25, 1);
  yield* childrenimgs[0].scale(0.25, 1);
  yield* childrenimgs[2].scale(0.25, 1);

  yield* waitFor(5);

  yield* dotsRect().fill("black", 1);

  //
  yield* waitFor(1.5);

  cancel(childrenRoationTask);
  yield* cross3().scale(1.3, 1, easeOutBack);

  const vid = createRef<Video>();
  view.add(
    <Video
      ref={vid}
      width={"100%"}
      scale={0}
      height={"100%"}
      radius={50}
      src={calling}
      stroke={"#b4dbf1"}
      shadowBlur={200}
      lineWidth={30}
      shadowColor={"#b4dbf1"}
    />
  );

  yield* waitUntil("70%");

  yield* all(
    cross3().scale(0, 0.4),
    ...childrenimgs.map((child) => child.scale(0, 0.4))
  );

  yield vid().scale(0.8, 0.5);

  if (isFinal) {
    vid().play();
  }

  yield all(vid().lineDashOffset(-1500, 4, linear));

  yield* waitUntil("speaker");
  yield all(
    vid().scale(0, 0.4),
    vid().opacity(0, 0.4),
    dotsRect().opacity(0, 0.2),
    dotsRect().scale(0, 0.4)
  );
  vid().pause();

  const speaker = createRef<Img>();

  view.add(
    <Img
      ref={speaker}
      src={megaphone}
      scale={0.25}
      filters={[invert(1)]}
      x={-380}
      y={30}
    />
  );

  speaker().save();

  speaker().opacity(0);
  speaker().position.y(100);
  speaker().scale(0);

  yield* speaker().restore(0.6);

  const speakerRotationTask = yield loop(Infinity, () =>
    speaker().rotation(-5, 0.3, easeInOutCubic).to(5, 0.3, easeInOutCubic)
  );

  yield* waitUntil("spy");
  cancel(speakerRotationTask);
  yield speaker().rotation(0, 0.3);

  const spyVid = createRef<Video>();

  view.add(<Video ref={spyVid} radius={10} loop scale={3} src={spy} />);
  if (isFinal) {
    spyVid().play();
  }

  yield* waitUntil("slap");
  spyVid().pause();
  yield spyVid().scale(0, 0.4);

  const slapVid = createRef<Video>();
  view.add(<Video ref={slapVid} radius={10} loop scale={2} src={slap} />);
  if (isFinal) {
    slapVid().play();
  }

  yield* waitUntil("end");
  spyVid().pause();

  slapVid().play();
  yield slapVid().scale(0, 0.4);
  yield spyVid().scale(0, 0.4);

  yield all(
    all(
      leftRoadSpline().start(1, 0.4),
      rightRoadSpline().start(1, 0.4),
      centerRoadSpline().start(1, 0.4),
      speaker().scale(0, 0.4),
      year().scale(0, 0.4)
    ),
    all(raju().x(-1500, 0.4), boy().x(-1500, 0.4)),
    all(shyam().x(1500, 0.4), boy2().x(1500, 0.4)),
    all(
      ...wordsRef.map((wordRef) =>
        all(
          wordRef.x(randomGen.nextInt(-5000, 5000), 0.4),
          wordRef.y(randomGen.nextInt(-5000, 5000), 0.4)
        )
      )
    )
  );
  yield* hueSignal(DEFAULT, 0.4);
  cancel(startRotation);
});
