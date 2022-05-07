import { AnimatedBg, StaticBg } from '.'

export interface GameInfo {
  name: string;
  static: StaticBg[];
  animated: AnimatedBg[];
}
