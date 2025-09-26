/// <reference types="vite/client" />

declare module "*.svg?react" {
  import * as React from "react";

  const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}
interface Window {
  addEcoPoints: (amount: number) => void;
  onPuzzleComplete: () => void;
}