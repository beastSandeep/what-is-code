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
} from "@motion-canvas/2d";
import Backround from "../components/GradientBackgroung";
import boySvg from "../assets/img/boy.svg?raw";
import boySvg2 from "../assets/img/boy.svg?raw";
import wifiSvg from "../assets/img/wifi.svg?raw";
import phoneSvg from "../assets/img/phone.svg?raw";
import crossSvg from "../assets/img/cross.svg?raw";

import {
  all,
  cancel,
  createRef,
  createSignal,
  DEFAULT,
  easeInBack,
  easeInExpo,
  easeOutBack,
  linear,
  loop,
  range,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import { SmartSVG } from "../components/SmartSVG";

export default makeScene2D(function* (view) {
  const hueSignal = createSignal(0);

  view.add(<Backround filters={[hue(() => hueSignal())]} />);

  yield* waitUntil("story");

  yield hueSignal(100, 1);

  const year = createRef<Txt>();
  const year_number = createRef<Txt>();
  const year_astrick = createRef<Txt>();
  const boy = createRef<SmartSVG>();
  const boy2 = createRef<SmartSVG>();
  const wifi = createRef<SmartSVG>();
  const phone = createRef<SmartSVG>();
  const cross = createRef<SmartSVG>();
  const cross2 = createRef<SmartSVG>();
  const leftRoadSpline = createRef<Spline>();
  const centerRoadSpline = createRef<Spline>();
  const rightRoadSpline = createRef<Spline>();

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
      <SmartSVG ref={boy2} filters={[hue(-30)]} scale={0.5} svg={boySvg2} />

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
  const task = yield loop(() =>
    year_astrick().rotation(0).rotation(360, 2, linear)
  );
  // wait
  yield* waitFor(0.4);
  yield* all(year().scale(0.3, 0.3), year().position([-800, -450], 0.5));
  yield* boy().reveal(0.3, 0.6);

  yield* waitUntil("nothing");
  yield* boy().x(-650, 0.3, easeOutBack);
  yield* wifi().reveal(0.3, 0.6);
  yield* all(wifi().x(600, 0.3, easeInExpo), wifi().y(-250, 0.3, easeInExpo));
  yield* phone().reveal(0.3, 0.6);
  yield* all(phone().x(600, 0.3, easeInExpo), phone().y(250, 0.3, easeInExpo));
  yield* all(cross().reveal(0.4, 0.8), cross2().reveal(0.4, 0.8));

  yield* waitUntil("boy");
  yield* wifiAndPhone.x(600, 0.5, easeInBack);
  yield* boy2().reveal(0.3, 0.6);
  yield* boy2().x(650, 0.3, easeOutBack);

  yield* waitUntil("road");
  yield* all(
    leftRoadSpline().end(1, 0.8),
    centerRoadSpline().end(1, 0.8),
    rightRoadSpline().end(1, 0.8)
  );

  yield* hueSignal(DEFAULT, 1);
  cancel(task);
});
