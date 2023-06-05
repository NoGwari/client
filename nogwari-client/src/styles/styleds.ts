import { css } from "styled-components";

/**
 * 상속시킬 스타일(css) 정의 파일
 */

// 일반 text font 사이즈
export const TextSize = css<{
    size?: string;
}>`
  font-size: ${props => {
    switch (props.size) {
        case "sm":
            return props.theme.fontSize.text.sm;
        case "md":
            return props.theme.fontSize.text.md;
        case "lg":
            return props.theme.fontSize.text.lg;
        default:
            return props.theme.fontSize.default;
    }
}};
`;

// 타이틀 font  사이즈
export const TitleSize = css<{
    size?: string;
}>`
  font-size: ${props => {
    switch (props.size) {
        case "xsm":
            return props.theme.fontSize.title.xsm;
        case "sm":
            return props.theme.fontSize.title.sm;
        case "md":
            return props.theme.fontSize.title.md;
        case "lg":
            return props.theme.fontSize.title.lg;
        case "xl":
            return props.theme.fontSize.title.xl;
        default:
            return props.theme.fontSize.default;
    }
}};
`;

// 폰트 두께
export const FontWeight = css<{ weight?: string }>`
  font-weight: ${props => {
    switch (props.weight) {
        case "thin":
            return props.theme.fontWeight.thin;
        case "light":
            return props.theme.fontWeight.light;
        case "medium":
            return props.theme.fontWeight.medium;
        case "regular":
            return props.theme.fontWeight.regular;
        case "exBold":
            return props.theme.fontWeight.exBold;
        default:
            return props.theme.fontWeight.bold;
    }
}};
`;

// 폰트 정렬
export const TextAlign = css<{ align?: string }>`
  text-align: ${props => {
    switch (props.align) {
        case "center":
            return "center";
        case "right":
            return "right";
        default:
            return "left";
    }
}};
`;

// flex 교차축에서 items의 정렬 방법 설정
export const FlexAlighItem = css<{ flexAlign?: string }>`
  align-items: ${props => {
    switch (props.flexAlign) {
        case "start":
            return "flex-start";
        case "center":
            return "center";
        case "end":
            return "flex-end";
        case "strech":
            return "strech";
        default:
            return "center";
    }
}};
`;

// flex items의 줄바꿈 설정
export const FlexWrap = css<{ flexWrap?: boolean }>`
  flex-wrap: ${props => (props.flexWrap === true ? "wrap" : "nowrap")};
`;

// flex 메인축 방향 정렬
export const FlexJustifyContent = css<{
    flexContent?: "start" | "center" | "end" | "between" | "around";
}>`
  justify-content: ${props => {
    switch (props.flexContent) {
        case "start":
            return "flex-start";
        case "center":
            return "center";
        case "end":
            return "flex-end";
        case "between":
            return "space-between";
        case "around":
            return "space-around";
        default:
            return "flex-start";
    }
}};
`;

export enum Size {
    XS = "xs",
    XSM = "xsm",
    SM = "sm",
    XMD = "xmd",
    MD = "md",
    XXMD = "xxmd",
    LMD = "lmd",
    LG = "lg",
    XL = "xl",
    XXL = "xxl",
    MMD = "mmd",
}

// form 관련 넓이
export const WFrom = css<{ size: Size }>`
  width: ${props => {
    switch (props.size) {
        case "xs":
            return "56";
        case "xsm":
            return "75";
        case "sm":
            return "100";
        case "xmd":
            return "150";
        case "xxmd":
            return "200";
        case "md":
            return "240";
        case "mmd":
            return "262";
        case "lmd":
            return "300";
        case "lg":
            return "500";
        case "xl":
            return "600";
        case "xxl":
            return "700";
    }
}}px !important;
`;
