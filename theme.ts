import { extendTheme } from "native-base";

// Custom export
export const appColor = {
  background: "#F0F2FD",
  title: "#343C6A",
  primary: "#6964FF",
  backgroundPrimary: "#605BFF",
  white: "#fff",
  textSecondary: "#70708C",
  textTitle: "#393968",
  inputLabel: "#3d3d66",
};
export const theme = extendTheme({
  fontConfig: {
    Montserrat: {
      100: {
        normal: "Montserrat-Light",
        italic: "Montserrat-LightItalic",
      },
      200: {
        normal: "Montserrat-Medium",
        italic: "Montserrat-MediumItalic",
      },
      300: {
        normal: "Montserrat-SemiBold",
        italic: "Montserrat-SemiBoldItalic",
      },
      400: {
        normal: "Montserrat-Bold",
        italic: "Montserrat-BoldItalic",
      },
      500: {
        normal: "Montserrat-ExtraBold",
        italic: "Montserrat-ExtraBoldItalic",
      },
    },
  },
  fonts: {
    heading: "Montserrat-Bold",
    body: "Montserrat-SemiBold",
    mono: "Montserrat-SemiBold",
  },
  colors: {
    primary: {
      50: "#F5F5FC",
      100: "#D0D0FF",
      200: "#9F9CFF",
      300: "#6964FF", //main
      400: "#3D36FE",
      500: "#2119FE",
      600: "#1109FF",
      700: "#0200E4",
      800: "#0000CC",
      900: "#0000B4",
    },
    secondary: {
      50: "#ffede4",
      100: "#ffdacd",
      200: "#ffb49b",
      300: "#ff8a64",
      400: "#fe6837",
      500: "#fe5119",
      600: "#ff4509",
      700: "#e43600",
      800: "#cb2e00",
      900: "#b12300",
    },
    error: {
      50: "#ffe9e9",
      100: "#ffd1d1",
      200: "#fba0a1",
      300: "#f76d6d",
      400: "#f34141",
      500: "#f22625",
      600: "#f21616",
      700: "#d8070b",
      800: "#c10008",
      900: "#a90003",
    },
  },
  config: {
    initialColorMode: "light",
  },
  components: {
    Checkbox: {
      baseStyle: {
        borderColor: "primary.300",
      },
      defaultProps: {
        colorScheme: "primary",
        _hover: {
          borderColor: "primary.300",
        },
        _pressed: {
          borderColor: "primary.300",
        },
        _focus: {
          borderColor: "primary.300",
        },
        _checked: {
          borderColor: "primary.300",
          backgroundColor: "primary.300",
        },
      },
    },
    Input: {
      baseStyle: {
        backgroundColor: "primary.50",
        borderRadius: "20",
      },
      defaultProps: {
        _focus: {
          backgroundColor: "primary.50",
          borderColor: "primary.300",
        },

        fontSize: "14px",
      },
    },
    Button: {
      baseStyle: {},
      defaultProps: {
        backgroundColor: "secondary.300",
        borderRadius: 20,
        _pressed: {
          backgroundColor: "secondary.400",
        },
      },
    },
  },
});
