import "styled-components";
import type { AppTheme } from "./theme/theme";

declare module "styled-components" {
  export interface DefaultTheme extends AppTheme {}
}

declare module "*.json" {
  const value: any;
  export default value;
}
