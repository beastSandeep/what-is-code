/*
Kabhi socha hai ki, ek simple torch se bhi aap kisi se baten kr skte ho.

Ya fir, ek basic communication ki jarurat, iss duniya ko computer de skti hai.

Ji han! App dekh rhe ho Jigyasu and mai hu Sandeep, Apka swagat krta hu iss series ki sabse pahli video "what is code" main. Jha ham communication ki need se start krke poora computer banane ka safar tay krenge.
*/

import { Icon, Img, makeScene2D, Txt } from "@motion-canvas/2d";
import {
  all,
  createRef,
  easeInCubic,
  easeInOutExpo,
  easeOutCubic,
  easeOutElastic,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";

import Backround from "../components/GradientBackgroung";
import { Torch } from "../components/Torch";
import communicatingPeople from "../assets/img/communicatingPeople.svg";
import computer from "../assets/img/computer.jpg";
import { Logo } from "../components/Logo";

export default makeScene2D(function* (view) {
  view.add(<Backround />);

  const flashlight = createRef<Torch>();

  yield* waitUntil("start");
  view.add(<Torch ref={flashlight} scale={0} x={-600} isOn={false} />);

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

  yield* all(
    img2().size("40%", 0.4, easeInOutExpo),
    img2().opacity(1, 0.4, easeInOutExpo),
    arrow().scale(10, 0.4, easeInOutExpo)
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

  yield* waitFor(1);

  yield* title().scale(0, 0.4, easeInCubic);
});
