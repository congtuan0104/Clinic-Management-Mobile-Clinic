import { extendTheme } from "native-base";

// Custom export
export const appColor = {
  background: "#F0F2FD",
  title: "#343C6A",
  primary: "#6964FF",
  backgroundPrimary: "#605BFF",
};
export const theme = extendTheme({
  fontConfig: {
    Roboto: {
      100: {
        normal: "Roboto",
        italic: "Roboto",
      },
      200: {
        normal: "Roboto",
        italic: "Roboto",
      },
      300: {
        normal: "Roboto",
        italic: "Roboto",
      },
      400: {
        normal: "Roboto",
        italic: "Roboto",
      },
      500: {
        normal: "Roboto",
      },
      600: {
        normal: "Roboto",
        italic: "Roboto",
      },
    },
  },

  // Make sure values below matches any of the keys in `fontConfig`
  fonts: {
    heading: "Roboto",
    body: "Roboto",
    mono: "Roboto",
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
      },
      defaultProps: {
        _focus: {
          backgroundColor: "primary.50",
          borderColor: "primary.300",
        },
      },
    },
    Button: {
      baseStyle: {},
      defaultProps: {
        backgroundColor: "primary.300",
        _pressed: {
          backgroundColor: "primary.400",
        },
      },
    },
  },
});
