import { Img, makeScene2D, Node, Rect, Txt } from "@motion-canvas/2d";
import {
  all,
  cancel,
  chain,
  createRef,
  DEFAULT,
  delay,
  easeInBack,
  easeInCubic,
  easeInExpo,
  easeInOutExpo,
  easeInOutSine,
  easeOutBack,
  easeOutCubic,
  easeOutElastic,
  easeOutExpo,
  loop,
  makeRef,
  sequence,
  spawn,
  useRandom,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import Backround from "../components/GradientBackgroung";
import { Torch } from "../components/Torch";
import talk1 from "../assets/img/talk/talk1.svg";
import talk2 from "../assets/img/talk/talk2.svg";
import talk3 from "../assets/img/talk/talk3.svg";
import talk4 from "../assets/img/talk/talk4.svg";
import computer from "../assets/img/computer.jpg";
import { Logo } from "../components/Logo";
import oldAge from "../assets/img/oldAge.svg";
import barePC from "../assets/img/barePC.jpg";

export default makeScene2D(function* (view) {
  view.add(<Backround />);

  const text1 = createRef<Txt>();
  const text2 = createRef<Txt>();
  const text3 = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={text1}
        fill={"white"}
        fontFamily={"Poppins"}
        fontSize={250}
        fontWeight={800}
        y={-300}
        x={-1500}
        opacity={0.1}
        skewX={30}
      >
        Kabhi
      </Txt>
      <Txt
        ref={text2}
        fill={"white"}
        fontFamily={"Poppins"}
        fontSize={250}
        fontWeight={800}
        x={1500}
        opacity={0.1}
        skewX={-30}
      >
        Socha
      </Txt>

      <Txt
        ref={text3}
        fill={"white"}
        fontFamily={"Poppins"}
        fontSize={250}
        fontWeight={800}
        y={300}
        x={-1500}
        opacity={0.1}
        skewX={20}
      >
        <Txt>Hai</Txt>
        <Txt fill={"#e5ab0cff"}>!</Txt>
      </Txt>
    </>
  );

  yield* all(
    text1().opacity(1, 0.5),
    text1().skew.x(0, 0.7, easeOutBack),
    text1().x(0, 0.6, easeOutBack),

    text2().opacity(1, 0.5),
    text2().skew.x(0, 0.7, easeOutBack),
    text2().x(0, 0.6, easeOutBack),

    text3().opacity(1, 0.5),
    text3().skew.x(0, 0.7, easeOutBack),
    text3().x(0, 0.6, easeOutBack)
  );

  yield* waitUntil("torch");

  yield* all(
    text1().x(1000, 0.3),
    text1().opacity(0, 0.3),
    text2().x(-1000, 0.3),
    text2().opacity(0, 0.3),
    text3().x(1000, 0.3),
    text3().opacity(0, 0.3)
  );

  const baseWords = [
    "Hi",
    "Hey",
    "Hello",
    "What's up?",
    "Yo!",
    "Howdy",
    "Sup?",
    "Hiya",
    "Greetings",
    "Hey there",
    "Yo yo",
    "Good day",
    "Hola",
    "Ahoy",
    "Salutations",
    "Wassup?",
    "Heyo",
    "Bonjour",
    "Ciao",
    "How's it going?",
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
          fontSize={40}
          fontWeight={700}
          shadowColor={"#ffffff80"}
          shadowBlur={10}
          fontFamily={"Poppins"}
          ref={makeRef(wordsRef, i)}
          x={randomGen.nextInt(-safeWidth, safeWidth)}
          y={randomGen.nextInt(-safeHeigh, safeHeigh)}
          opacity={0}
          fill={"gray"}
          text={word}
        />
      ))}
    </>
  );

  const floatingWords = yield loop(() =>
    spawn(
      all(
        ...wordsRef.map((wordRef) => {
          const [cx, cy] = wordRef.position();
          const nx = cx + randomGen.nextInt(-50, 50); // small offset
          const ny = cy + randomGen.nextInt(-50, 50);

          return all(
            wordRef.position([nx, ny], 2, easeInOutSine),
            wordRef.opacity(0.1, 0.3, easeInCubic)
          ); // longer duration
        })
      )
    )
  );

  const flashlight = createRef<Torch>();

  view.add(<Torch ref={flashlight} scale={0} x={-100} isOn={false} />);

  yield* flashlight().scale(1, 0.3, easeOutElastic);

  yield* waitFor(0.3);
  yield* flashlight().blink();
  yield* flashlight().on();

  yield* waitUntil("next");

  yield all(
    flashlight().beam(1, 20000),
    flashlight().position([-1500, 0], 1, easeInOutExpo)
  );

  yield* all(
    delay(0.5, flashlight().opacity(0, 0.8))
    // ...wordsRef.map((w) => {
    //   cancel(task);
    //   return w.position(
    //     [randomGen.nextInt(-10000, 10000), randomGen.nextInt(-10000, 10000)],
    //     1
    //   );
    // })
  );

  yield flashlight().remove();
  // for (const wordRef of wordsRef) {
  //   yield wordRef.remove();
  // }

  //

  const talking = createRef<Node>();
  const img1 = createRef<Img>();
  const img2 = createRef<Img>();
  const img3 = createRef<Img>();
  const img4 = createRef<Img>();

  view.add(
    <Node ref={talking}>
      <Img
        ref={img1}
        x={-1000}
        y={-520}
        scale={7}
        offset={[0, 0]}
        opacity={0}
        src={talk1}
      />
      <Img
        ref={img2}
        position={[800, -1000]}
        scale={7}
        opacity={0}
        src={talk4}
      />
      <Img
        ref={img3}
        position={[1000, 710]}
        scale={7}
        opacity={0}
        src={talk2}
      />
      <Img
        ref={img4}
        position={[-750, 1000]}
        scale={7}
        opacity={0}
        src={talk3}
      />
    </Node>
  );

  yield* all(
    img1().position([-230, -210], 0.6, easeOutCubic, Vector2.arcLerp),
    img1().opacity(1, 0.6),

    img2().position([300, -230], 0.6, easeOutCubic, Vector2.arcLerp),
    img2().opacity(1, 0.6),

    img3().position([240, 210], 0.6, easeOutCubic, Vector2.arcLerp),
    img3().opacity(1, 0.6),

    img4().position([-250, 250], 0.6, easeOutCubic, Vector2.arcLerp),
    img4().opacity(1, 0.6)
  );
  const rotationTask = yield loop(() =>
    all(
      img1().rotation(3, 0.2, easeInOutSine).to(-3, 0.2, easeInOutSine),
      img2().rotation(3, 0.2, easeInOutSine).to(-3, 0.2, easeInOutSine),
      img3().rotation(3, 0.2, easeInOutSine).to(-3, 0.2, easeInOutSine),
      img4().rotation(3, 0.2, easeInOutSine).to(-3, 0.2, easeInOutSine)
    )
  );
  yield* waitUntil("computer");
  //
  cancel(rotationTask);
  yield all(
    img1().position(
      [-290 - 1000, -220 - 1000],
      0.6,
      easeOutCubic,
      Vector2.arcLerp
    ),
    img1().opacity(0, 0.5),

    img2().position(
      [300 + 1000, -230 - 1000],
      0.6,
      easeOutCubic,
      Vector2.arcLerp
    ),
    img2().opacity(0, 0.5),

    img3().position(
      [240 + 1000, 210 + +1000],
      0.6,
      easeOutCubic,
      Vector2.arcLerp
    ),
    img3().opacity(0, 0.5),

    img4().position(
      [-250 - 1000, 250 + 1000],
      0.6,
      easeOutCubic,
      Vector2.arcLerp
    ),
    img4().opacity(0, 0.5)
  );

  //
  const comp = createRef<Img>();
  view.add(<Img ref={comp} src={computer} scale={0.02} />);
  comp().save();
  yield* comp().scale(0.36, 0.3, easeInExpo);
  cancel(floatingWords);
  for (const wordRef of wordsRef) {
    yield wordRef.remove();
  }

  yield* waitUntil("logo");
  yield* all(comp().restore(0.8), comp().opacity(0, 0.8));
  const logo = createRef<Logo>();
  view.add(<Logo ref={logo} />);
  yield* logo().animate();

  yield* waitUntil("title");
  yield* logo().unanimate();

  const title = createRef<Rect>();
  const letters = "What is Code.".split("");
  const lettersRef: Txt[] = [];

  view.add(
    <Txt
      ref={title}
      fontFamily={"Poppins"}
      fontSize={150}
      fontWeight={700}
      letterSpacing={-100}
      fill={"white"}
      lineHeight={200}
    >
      {...letters.map((letter, i) => (
        <Txt
          opacity={() => (i < letters.length * 0.01 ? 1 : 0)}
          ref={makeRef(lettersRef, i)}
          text={letter}
        />
      ))}
    </Txt>
  );

  yield* all(
    title().letterSpacing(DEFAULT, 0.3, easeOutBack),
    ...lettersRef.map((letterRef) => letterRef.opacity(1, 0.3))
  );

  yield* waitFor(1);
  yield* title().scale(0, 0.4, easeInCubic);

  const imgs: Img[] = [];

  view.add(
    <>
      <Img
        ref={makeRef(imgs, 0)}
        x={2000}
        size={"80%"}
        radius={50}
        src={oldAge}
      />
      <Img
        ref={makeRef(imgs, 1)}
        x={2000}
        size={"80%"}
        radius={50}
        src={barePC}
      />
    </>
  );

  yield* imgs[0].x(0, 1, easeOutBack);
  yield* waitFor(0.8);
  yield imgs[0].x(-2000, 0.4);

  yield* imgs[1].x(0, 1, easeOutBack);
  yield* waitFor(0.8);
  yield* imgs[1].x(-2000, 0.6);
});
