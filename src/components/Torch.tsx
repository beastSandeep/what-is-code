import { Node, NodeProps, Path, Rect, signal } from "@motion-canvas/2d";
import {
  all,
  chain,
  createRef,
  createSignal,
  linear,
  useRandom,
  waitFor,
  easeInOutExpo,
} from "@motion-canvas/core";

export interface TorchProps extends NodeProps {
  isOn: boolean;
}

export class Torch extends Node {
  private torch = createRef<Node>();
  private button = createRef<Rect>();
  private light = createRef<Path>();

  private perBlinkTime = 0.03;
  private randoms: number[] = useRandom().intArray(6, 0, 2);

  @signal()
  private beamSignal = createSignal(900);

  public isOn;

  public constructor(props?: TorchProps) {
    super({
      ...props,
    });

    this.isOn = props.isOn;

    this.add(
      <Node cache ref={this.torch} scale={0.6}>
        {/* Button */}
        <Rect
          ref={this.button}
          radius={8}
          x={18}
          y={-35}
          fill={"red"}
          size={[30, 35]}
        ></Rect>

        {/* Handel */}
        <Rect radius={8} fill={"white"} size={[180, 70]}></Rect>

        {/* Head */}
        <Node x={105}>
          <Rect radius={6} fill={"white"} size={[20, 70]}></Rect>

          <Path
            fill={"white"}
            x={16}
            scaleX={5}
            scaleY={8}
            data="M 0 0 L 0 -4 Q 1 -7 6 -10 L 18 -16 Q 25 -19 26 -14 L 26 14 Q 25 19 18 16 L 6 10 Q 1 7 0 4 Z"
          />

          {/* Light */}
          <Path
            ref={this.light}
            opacity={this.isOn ? 1 : 0}
            fill={"yellow"}
            data={() =>
              `M150 120 L10000 ${this.beamSignal()} L10000 -${this.beamSignal()} L150 -120  Z`
            }
          />
        </Node>
      </Node>
    );
  }

  /**
   * Animates a sequence of blinking effects on lights and buttons
   * based on a randomized pattern (`this.randoms`).
   *
   * This is a generator function that yields an animation chain,
   * allowing the blinking sequence to be controlled externally (e.g. via an animation runner).
   *
   * Each blink sets the opacity of a light and the vertical position
   * of a button according to the random value (0 or 1).
   *
   * @yields Animation steps from chaining multiple opacity and position transitions.
   * @returns {Generator} A generator that yields animation chains.
   * @example
   * for (const step of instance.blink()) {
   *   await step;
   * }
   */
  public *blink() {
    yield* chain(
      ...this.randoms.map((n) =>
        all(
          this.light().opacity(n === 0 ? 0 : 1, this.perBlinkTime, linear),
          this.button().position.y(
            n === 0 ? -35 : -28,
            this.perBlinkTime,
            linear
          )
        )
      )
    );
    this.isOn = Boolean(this.randoms[this.randoms.length - 1]);
  }

  public *on(duration: number = this.perBlinkTime) {
    yield* all(
      this.light().opacity(1, duration),
      this.button().position.y(-28, duration)
    );
    this.isOn = !this.isOn;
  }

  public *off(duration: number = this.perBlinkTime) {
    yield* all(
      this.light().opacity(0, duration),
      this.button().position.y(-35, duration)
    );
    this.isOn = !this.isOn;
  }

  public *toggle() {
    if (this.isOn) {
      yield* this.off();
    } else {
      yield* this.on();
    }
  }

  public *dot(slowness: number = 1, isLast: boolean = false) {
    yield* this.on();
    yield* waitFor(slowness * this.perBlinkTime * 5);
    yield* this.off();

    if (!isLast) yield* waitFor(slowness * this.perBlinkTime * 15);
  }

  public *dash(slowness: number = 1, isLast: boolean = false) {
    yield* this.on();
    yield* waitFor(slowness * this.perBlinkTime * 15);
    yield* this.off();

    if (!isLast) yield* waitFor(slowness * this.perBlinkTime * 15);
  }

  public *beam(duration: number, size?: number) {
    yield* this.beamSignal(size || 900, duration, easeInOutExpo);
  }
}
