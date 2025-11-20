import { Line, Node, NodeProps, signal, initial } from "@motion-canvas/2d";

import {
  createSignal,
  SimpleSignal,
  SignalValue,
  waitFor,
  useScene,
  waitUntil,
  createRef,
} from "@motion-canvas/core";

export interface SoundVisualizerProps extends NodeProps {
  stroke?: SignalValue<string>;
  lineWidth?: SignalValue<number>;
  points?: number;
  w?: number;
  h?: number;
}

export class SoundVisualizer extends Node {
  // ----- SIGNALS -----
  @initial("white")
  @signal()
  public declare stroke: SimpleSignal<string, this>;

  @initial(4)
  @signal()
  public declare lineWidth: SimpleSignal<number, this>;

  @initial(60)
  @signal()
  public declare points: SimpleSignal<number, this>;

  @signal()
  public declare w: SimpleSignal<number, this>;

  @signal()
  public declare h: SimpleSignal<number, this>;

  public noise = createSignal(0);
  private line = createRef<Line>();

  public constructor(props: SoundVisualizerProps) {
    super(props);

    // Get scene to determine default width & height
    const scene = useScene();
    const sceneSize = scene.getSize();

    // Default to full width & half height *unless props override*
    this.w = createSignal(props.w ?? sceneSize.x);
    this.h = createSignal(props.h ?? sceneSize.y / 2);

    const count = props.points ?? 60;

    // Points generator
    const pts = new Array(count).fill(0).map((_, i) => {
      return () => {
        const width = this.w();
        const height = this.h() / 10;
        const x = -width / 2 + i * (width / count);

        const y =
          Math.sin(i + Math.random() * 10 * this.noise()) *
          this.noise() *
          (height / 2);

        return { x, y };
      };
    });

    this.add(
      <Line
        radius={20}
        points={pts}
        ref={this.line}
        stroke={() => this.stroke()}
        lineWidth={() => this.lineWidth()}
      />
    );
  }

  // ------------------------------------
  // Fake "sound wave" animation sequence
  // ------------------------------------
  public *run(duration: number = 2) {
    this.noise(1);
    yield* this.noise(6, duration);
    yield* this.noise(0, 0.5);
    yield* waitFor(0.4);
    yield* this.line().opacity(0, 0.4);
  }
}
