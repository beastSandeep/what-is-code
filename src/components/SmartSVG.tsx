import { Path, SVG, Node, NodeProps } from "@motion-canvas/2d";
import {
  all,
  createRef,
  easeInOutCubic,
  PossibleVector2,
  SignalValue,
} from "@motion-canvas/core";

export interface SmartSVGProps extends NodeProps {
  svg: SignalValue<string>;
  lineWidth?: SignalValue<number>;
  offset?: SignalValue<PossibleVector2>;
}

export class SmartSVG extends Node {
  private paths: Path[];
  private svgRef = createRef<SVG>();

  public constructor(props?: SmartSVGProps) {
    super({ ...props });
    this.add(
      <SVG offset={props.offset} cache ref={this.svgRef} svg={props.svg} />
    );
    this.paths = this.svgRef().wrapper.children() as Path[];

    for (const path of this.paths) {
      path
        .stroke(path.fill())
        .lineWidth(props.lineWidth || 8)
        .end(0)
        .cache(true);
      path.fill(null);
    }
  }

  public *reveal(strokeDuration: number = 1, fillDuratoin: number = 0.5) {
    yield* all(
      ...this.paths.map((path) => path.end(1, strokeDuration, easeInOutCubic))
    );
    yield* all(
      ...this.paths.flatMap((path) => [
        path.fill(path.stroke(), fillDuratoin, easeInOutCubic),
        path.lineWidth(0, fillDuratoin, easeInOutCubic),
      ])
    );
  }

  public *hide(
    lineWidth: number = 8,
    strokeDuration: number = 0.8,
    fillDuratoin: number = 0.3
  ) {
    yield* all(
      ...this.paths.flatMap((path) => [
        path.fill(null, fillDuratoin, easeInOutCubic),
        path.lineWidth(lineWidth, fillDuratoin, easeInOutCubic),
      ])
    );

    yield* all(
      ...this.paths.map((path) => path.start(1, strokeDuration, easeInOutCubic))
    );
  }
}
