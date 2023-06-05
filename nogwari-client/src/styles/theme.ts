import baseStyled, { ThemedStyledInterface } from "styled-components";

/**
 * 테마 설정을위한 생성
 */
const fonts = {
    family: {
        normal: `'NotoSans', Arial, sans-serif`,
        title: `'NanumSquare', Arial, sans-serif`,
    },
    size: {
        convert: "14px", //기준 픽셀값을 바꾸면 전체 폰트 사이즈가 변경됨
        default: "1rem",
        text: {
            xsm: "0.71rem", //14px 기준 10px
            sm: "0.93rem", //13px
            md: "1.071rem", // 15px
            lg: "1.143rem", // 16px
        },
        title: {
            xsm: "0.93rem", //13
            sm: "1.072rem", //15
            md: "1.429rem", //20
            lg: "1.76rem", //25
            xl: "1.857rem", //26
        },
    },
    weight: {
        thin: "200",
        light: "300",
        regular: "400",
        medium: "500",
        bold: "700",
        exBold: "800", //title폰트 적용시만 사용
    },
};

const colors = {
    bodyBackground: "#ffffff",
    primary: "#559ea8",

    success: "#2ac769",
    successLight: "#eaf7ef",
    positive: "#559ea8",
    positiveLight: "#e2e8fe",
    negative: "#ff6263",
    negativeLight: "#ffe0e0",
    wait: "#f6a609",
    waitLight: "#fff0d9",
    dealsHightLight: "#ff0000",
    fontContrast: "#f6a609",
    fontDisabled: "#a8a9aa",

    borderTransparent: "transparent",
    borderFocus: "#3e3f40",
    borderDark: "#a8a9aa",
    borderDisabled: "#f4f4f4",

    bgTableHead: "#f7f7f7",
    bgForm: "#f7f7f7",
    bgSubForm: "#fafafa",

    btnWarning: "#f6a609",
    btnWhite: "#d1d2d2",

    dark: "#323232",
    darkGrey: "#4c4c4c",
    grey: "#898989",
    lightGrey: "#8e8e8e",
    red: "#eb4e28",
    yellow: "#f3b108",
    orange: "#fa9704",
    blue: "#0d7cff",
    lightBlue: "#ebf0ff",
    green: "#2cb864",
    labelGreen: "#51b5a4",
    labelBlue: "#4c7cfa",
    labelLightRed: "#ffdddd",
    labelRed: "#ff6868",

    borderInput: "#e9e9e9",
    borderGrey: "#e0e0e0",

    disabled: "#c4c4c4",

    // 기획서보고 정리한 색상들
    // font
    fontPrimary: "#363636",
    fontGrey: "#8d8d8d",
    fontRed: "#ff0000",
    fontBlue: "#262CB4",
    fontOrange: "#E26D00",

    // bg
    bgDark: "#515355",
    bgDarkGrey: "#B0B0B0",
    bgGrey: "#BCBCBC",
    bgSemiGrey: "#ececec",
    bgLightGrey: "#f7f7f7",

    // border
    borderPrimary: "#8f8f8f",
    borderLightGrey: "#c9c9c9",

    // button
    btnPrimary: "#559ea8",
    btnDark: "#515355",
    btnDarkGrey: "#767676",
    btnGrey: "#b3b3b3",
    btnLightGrey: "#d1d1d1",
    btnNegative: "#B90000",
    btnPositive: "#0400B9",

    // form
    placeholder: "#e5e5e5",
};

const hoverColors = {
    borderHover: `${colors.borderPrimary}85`,
    btnPrimaryHover: `${colors.btnPrimary}99`,
    btnDarkHover: `${colors.btnDark}99`,
    btnNegativeHover: `${colors.btnNegative}99`,
    btnWarningHover: `${colors.btnWarning}99`,
    btnPositiveHover: `${colors.btnPositive}99`,
    btnWhiteHover: `${colors.btnWhite}99`,
};

const disabledColors = {
    btnPrimaryDisabled: `${colors.btnPrimary}40`,
    btnDarkDisabled: `${colors.btnDark}40`,
    btnNegativeDisabled: `${colors.btnNegative}40`,
    btnWarningDisabled: `${colors.btnWarning}40`,
    btnPositiveDisabled: `${colors.btnPositive}40`,
    btnWhiteDisabled: `${colors.btnWhite}40`,
};

const lightColors = {
    ...colors,
    ...hoverColors,
    ...disabledColors,
};

const darkColors = {
    ...colors,
    bodyBackground: "#121212",
    fontPrimary: "#fff",
    ...hoverColors,
    ...disabledColors,
};

/**
 * 테마 반환
 */

const defaultTheme = {
    fontFamily: fonts.family,
    fontSize: fonts.size,
    fontWeight: fonts.weight,
};

export const lightTheme = {
    ...defaultTheme,
    colors: lightColors,
};

export const darkTheme: Theme = {
    ...defaultTheme,
    colors: darkColors,
};

/**
 * 테마 타입 설정
 */
export type Theme = typeof lightTheme;
export const styled = baseStyled as ThemedStyledInterface<Theme>;
