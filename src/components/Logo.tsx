import { Circle, Gradient, Node, NodeProps, Txt } from "@motion-canvas/2d";
import {
  all,
  chain,
  createRef,
  delay,
  easeInBack,
  easeInCubic,
  easeOutBack,
  easeOutCubic,
  easeOutElastic,
  easeOutExpo,
  linear,
  loop,
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
            // offset={[-0.8, 0]}
            size={34}
            ref={this.dot}
          />

          <Txt
            text={"I"}
            x={0}
            ref={this.i}
            fontFamily={"Poppins"}
            fontWeight={600}
            fontSize={170}
            fill={"rgba(206, 253, 255, 0.3)"}
            lineWidth={7}
            shadowBlur={50}
            shadowColor={"#ffffffff"}
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
          fontSize={170}
          fill={"rgba(206, 253, 255, 0.3)"}
          lineWidth={7}
          shadowBlur={50}
          shadowColor={"#ffffffff"}
          opacity={0}
          scale={100}
          stroke={
            new Gradient({
              fromY: -50,
              toY: 50,
              stops: [
                { offset: 0, color: "#fff5" },
                { offset: 0.2, color: "#ffff" },
                { offset: 0.8, color: "#ffff" },
                { offset: 1.0, color: "#fff5" },
              ],
            })
          }
        />

        {/* ripple */}
        <Circle
          ref={this.ripple}
          fill={
            new Gradient({
              type: "radial",
              fromRadius: 0,
              toRadius: 10,
              stops: [
                { offset: 0.0, color: "#ffffcc" }, // bright white-yellow core
                { offset: 0.25, color: "#ffff00" }, // pure yellow
                { offset: 0.5, color: "#ffb400" }, // golden orange
                { offset: 0.75, color: "#ff6a00" }, // strong orange-red
                { offset: 0.9, color: "#e62e00" }, // deep red glow
                { offset: 1.0, color: "#0000" }, // transparent edge
              ],
            })
          }
          x={0}
          y={-90}
          opacity={0}
          scale={2}
          size={20}
        />
      </>
    );
  }

  public *animate() {
    const vibration = 5;
    // this.dot().opacity(1);
    yield* all(
      this.i().position.y(100, 0.4, easeOutCubic).to(0, 0.2, easeOutElastic),
      delay(
        0.3,
        all(
          this.dot().position.y(-90, 0.3, easeOutBack),
          this.dot().opacity(1, 0.2, easeInCubic)
        )
      )
    );

    yield* chain(
      all(
        this.dot().size(10, 0.6, easeOutCubic),
        loop(vibration, (i) =>
          i < vibration - 1
            ? this.dot().x(4, 0.02, easeOutCubic).to(-4, 0.02, easeOutCubic)
            : this.dot().x(0, 0.01, easeOutCubic)
        )
      ),
      this.dot().size(32, 0.2, easeInCubic),
      all(
        this.ripple().scale(250, 0.2, linear).to(999, 0.2, linear),
        this.dot().opacity(0, 0.01),
        this.ripple().opacity(1, 0.01),
        this.i().opacity(0, 0.3, easeOutCubic)
      )
    );

    yield* all(this.ripple().opacity(0, 0.5, linear));

    yield* waitFor(0.1);

    yield* all(
      this.jigyasu().opacity(1, 0.3, easeOutCubic),
      this.jigyasu().scale(1.3, 0.3, easeOutCubic)
    );
  }

  public *unanimate() {
    yield* this.jigyasu().scale(0, 0.3, easeOutExpo);
  }
}
