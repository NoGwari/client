import { createGlobalStyle } from "styled-components";
import { ResetStyle } from "./reset";
import { Theme } from "./theme";

export const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
${ResetStyle};
:root {
}

html {
  height: 100%;
}
body {
  position: relative;
  height: 100%;
  line-height: 1.5;
}

.wrapper {
  height: 100%;
}
`;
