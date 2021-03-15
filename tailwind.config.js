module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  purge: {
    enabled: true,
    content: ["./src/**/*.js", "./src/**/**/*.js"],
  },
  theme: {
    fill: (theme) => ({
      red: theme("colors.red.primary"),
    }),
    colors: {
      white: "#ffffff",
      blue: {
        medium: "#005c98",
        insta: "#57A5DB",
      },
      black: {
        light: "#262626",
        faded: "#00000059",
      },
      gray: {
        base: "#616161",
        background: "#fafafa",
        primary: "#dbdbdb",
      },
      red: {
        primary: "#ed4956",
      },
    },

    extend: {
      fontFamily: {
        raleway: ["Raleway", "sans-serif"],
      },
      width: {
        '60vw': '60vw'
      },
      flex: {
        '2': '2 1 auto'
      }
    },
  },
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
};
