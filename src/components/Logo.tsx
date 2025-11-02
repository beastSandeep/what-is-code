import {
  Circle,
  Gradient,
  Layout,
  Node,
  NodeProps,
  Rect,
  Txt,
} from "@motion-canvas/2d";
import {
  all,
  chain,
  createRef,
  delay,
  easeInCubic,
  easeInElastic,
  easeInExpo,
  easeOutCubic,
  easeOutElastic,
  easeOutExpo,
  waitFor,
} from "@motion-canvas/core";

export interface LogoProps extends NodeProps {
  // isOn: boolean;
}

export class Logo extends Node {
  private jigyasu = createRef<Txt>();
  private dot = createRef<Circle>();
  private ripple = createRef<Circle>();
  private i = createRef<Txt>();

  public constructor(props?: LogoProps) {
    super({
      ...props,
    });

    this.add(
      <>
        <Node>
          {/* intial dot */}
          <Circle
            fill={"#ff0"}
            y={-30}
            x={0}
            opacity={0}
            size={34}
            ref={this.dot}
          />

          <Txt
            text={"I"}
            x={0}
            ref={this.i}
            fontFamily={"Poppins"}
            fontWeight={600}
            fontSize={150}
            fill={"#fff3"}
            lineWidth={5}
            shadowBlur={20}
            shadowColor={"#ffff"}
            stroke={
              new Gradient({
                fromY: -50,
                toY: 50,
                stops: [
                  { offset: 0, color: "#fff5" },
                  { offset: 0.2, color: "#fffa" },
                  { offset: 0.8, color: "#fffa" },
                  { offset: 1.0, color: "#fff5" },
                ],
              })
            }
          />
        </Node>

        <Txt
          text={"Jigyāsu".toUpperCase()}
          ref={this.jigyasu}
          fontFamily={"Poppins"}
          fontWeight={600}
          fontSize={150}
          fill={"#fff3"}
          lineWidth={5}
          shadowBlur={20}
          shadowColor={"#ffff"}
          opacity={0}
          scale={100}
          stroke={
            new Gradient({
              fromY: -50,
              toY: 50,
              stops: [
                { offset: 0, color: "#fff5" },
                { offset: 0.2, color: "#fffa" },
                { offset: 0.8, color: "#fffa" },
                { offset: 1.0, color: "#fff5" },
              ],
            })
          }
        />

        {/* ripple */}
        <Circle
          ref={this.ripple}
          shadowBlur={10}
          shadowColor={"yellow"}
          lineWidth={5}
          fill={"#fff0"}
          x={0}
          y={-90}
          opacity={0}
          scale={2}
          size={20}
          stroke={
            new Gradient({
              fromY: -10,
              toY: 10,
              stops: [
                { offset: 0, color: "#ff02" },
                { offset: 0.5, color: "#ff0" },

                { offset: 1.0, color: "#ff02" },
              ],
            })
          }
        />
      </>
    );
  }

  public *animate() {
    yield* waitFor(0.5);

    yield* all(
      this.i().position.y(100, 1, easeOutCubic).to(0, 0.6, easeOutElastic),
      delay(
        0.8,
        all(
          this.dot().position.y(-90, 0.3, easeInCubic),
          delay(0.1, this.dot().opacity(1, 0.3, easeInCubic))
        )
      )
    );

    yield* waitFor(0.1);

    yield* chain(
      this.dot().size(10, 0.8, easeOutCubic).to(32, 0.2, easeInCubic),
      all(
        this.ripple().scale(120, 0.2, easeOutCubic),
        this.dot().opacity(0, 0.01),
        this.ripple().opacity(1, 0.01),
        this.ripple().lineWidth(0.3, 0.2, easeOutCubic),
        this.i().opacity(0, 0.3, easeOutCubic)
      )
    );

    yield* waitFor(0.2);

    yield* all(
      this.jigyasu().opacity(1, 0.6, easeOutCubic),
      this.jigyasu().scale(1, 0.6, easeOutCubic)
    );
  }

  public *unanimate() {
    yield* this.jigyasu().scale(0, 0.3, easeOutExpo);
  }
}
