/*
Kabhi socha hai ki, ek simple torch se bhi aap kisi se baten kr skte ho.

Ya fir, ek basic communication ki jarurat, iss duniya ko computer de skti hai.

Ji han! App dekh rhe ho Jigyasu and mai hu Sandeep, Apka swagat krta hu iss series ki sabse pahli video "what is code" main. Jha ham communication ki need se start krke poora computer banane ka safar tay krenge.
*/

import { Gradient, Icon, Img, makeScene2D, Node, Txt } from "@motion-canvas/2d";
import {
  all,
  createRef,
  createSignal,
  easeInCubic,
  easeInOutExpo,
  easeOutCubic,
  easeOutElastic,
  linear,
  makeRef,
  map,
  sequence,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import Backround from "../components/GradientBackgroung";
import { Torch } from "../components/Torch";
import communicatingPeople from "../src/assets/img/communicatingPeople.svg";
import computer from "../src/assets/img/computer.jpg";
import { Logo } from "../components/Logo";

export default makeScene2D(function* (view) {
  view.add(<Backround />);

  const curentWord = createSignal(-1);

  const dialog = createRef<Node>();

  view.add(
    <Node ref={dialog}>
      {["Kabhi", "Socha", "Hai!"].map((d, i) => (
        <Txt
          text={d}
          y={() => curentWord() * -200 + i * 200}
          fontFamily={"Roboto"}
          // fill={() => {
          //   const w = curentWord();
          //   const dist = Math.abs(w - i);

          //   // Highlight intensity (closer = brighter)
          //   const t = Math.max(0, 1 - dist);

          //   return new Gradient({
          //     type: "linear",
          //     fromX: -200,
          //     toX: 200,
          //     stops: [
          //       { offset: 0, color: "#ffde22ff" }, // bright golden yellow
          //       { offset: 1, color: "#f02d14ff" }, // pinkish highlight
          //     ],
          //   });
          // }}
          fill={"white"}
          // shadowBlur={5}
          // shadowOffset={[5, 8]}
          // shadowColor={"blue"}
          fontWeight={900}
          fontSize={400}
          // 🔥 Smooth scale
          scale={() => {
            const w = curentWord();
            const dist = Math.abs(w - i); // distance from current word
            // when dist=0 → scale=1, dist=1 → 0.2, fades smoothly
            return Math.max(0.1, 1 - dist * 0.9);
          }}
          // 🔥 Smooth opacity
          opacity={() => {
            const w = curentWord();
            const dist = Math.abs(w - i);
            // dist=0 → 1, dist=1 → 0.2, fade smoothly
            return Math.max(0.07, 1 - dist * 0.9);
          }}
        />
      ))}
    </Node>
  );

  yield* curentWord(3, 1, linear);

  yield dialog().opacity(0, 0.6);

  yield* waitUntil("start");

  const flashlight = createRef<Torch>();

  view.add(<Torch ref={flashlight} scale={0} x={-100} isOn={false} />);

  yield* flashlight().scale(1, 0.5, easeOutElastic);

  yield* waitFor(0.3);
  yield* flashlight().blink();
  yield* flashlight().on();

  yield* waitUntil("pics");

  yield all(
    flashlight().beam(1, 20000),
    flashlight().position([-1500, 0], 1, easeInOutExpo)
  );

  yield* flashlight().opacity(0, 0.9);
  flashlight().remove();

  const img1 = createRef<Img>();
  const img2 = createRef<Img>();
  const arrow = createRef<Icon>();

  view.add(
    <>
      <Img
        ref={img1}
        src={communicatingPeople}
        size={0}
        x={-500}
        radius={50}
        opacity={0.4}
      />
      <Img
        ref={img2}
        x={500}
        radius={50}
        src={computer}
        size={0}
        opacity={0.4}
      />
      <Icon
        icon={"material-symbols:line-end-arrow-rounded"}
        scale={0}
        ref={arrow}
      />
    </>
  );

  yield* all(
    img1().size("40%", 0.4, easeInOutExpo),
    img1().opacity(1, 0.4, easeInOutExpo)
  );

  yield* waitFor(2);

  yield* all(
    img2().size("40%", 0.4, easeInOutExpo),
    img2().opacity(1, 0.6, easeInOutExpo),
    arrow().scale(10, 0.6, easeInOutExpo)
  );

  yield* waitUntil("logo");

  yield* all(
    img2().size(0, 0.6, easeInOutExpo),
    img2().opacity(0, 0.6, easeInOutExpo),
    img1().size(0, 0.6, easeInOutExpo),
    img1().opacity(0, 0.6, easeInOutExpo),
    arrow().scale(0, 0.4, easeInOutExpo)
  );

  // const hand = createRef<Icon>();
  const logo = createRef<Logo>();

  view.add(<Logo ref={logo} />);

  yield* logo().animate();

  yield* waitUntil("title");

  yield* logo().unanimate();

  const title = createRef<Txt>();

  view.add(
    <Txt
      ref={title}
      fill={"white"}
      scale={0}
      fontFamily={"Poppins"}
      fontSize={150}
      fontWeight={700}
    >
      What is Code
    </Txt>
  );

  yield* title().scale(1, 0.5, easeOutCubic);

  yield* waitUntil("dialog");

  yield* title().scale(0, 0.4, easeInCubic);
});
