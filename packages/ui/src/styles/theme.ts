export const jaciConditions = {
  extend: {
    dark: '[data-jaci-theme="dark"] &',
  },
};

export const jaciTheme = {
  extend: {
    tokens: {
      colors: {
        neutral: {
          50: { value: "#fafafa" },
          100: { value: "#f4f4f5" },
          200: { value: "#e4e4e7" },
          300: { value: "#d4d4d8" },
          400: { value: "#a1a1aa" },
          500: { value: "#71717a" },
          600: { value: "#52525b" },
          700: { value: "#3f3f46" },
          800: { value: "#27272a" },
          900: { value: "#18181b" },
          950: { value: "#09090b" },
        },
        blue: {
          500: { value: "#3b82f6" },
          600: { value: "#2563eb" },
          700: { value: "#1d4ed8" },
        },
        green: {
          500: { value: "#22c55e" },
          600: { value: "#16a34a" },
          700: { value: "#15803d" },
        },
        amber: {
          500: { value: "#f59e0b" },
          600: { value: "#d97706" },
          700: { value: "#b45309" },
        },
        red: {
          500: { value: "#ef4444" },
          600: { value: "#dc2626" },
        },
      },
      radii: {
        sm: { value: "0.375rem" },
        md: { value: "0.75rem" },
        lg: { value: "1rem" },
        xl: { value: "1.5rem" },
        "2xl": { value: "2rem" },
        full: { value: "9999px" },
      },
      shadows: {
        sm: { value: "0 1px 2px rgb(0 0 0 / 0.08)" },
        md: { value: "0 10px 24px rgb(0 0 0 / 0.12)" },
        lg: { value: "0 18px 42px rgb(0 0 0 / 0.16)" },
        xl: { value: "0 24px 52px rgb(0 0 0 / 0.2)" },
      },
      durations: {
        fast: { value: "150ms" },
        normal: { value: "250ms" },
        slow: { value: "500ms" },
      },
      easings: {
        standard: { value: "cubic-bezier(0.2, 0, 0, 1)" },
      },
      transitions: {
        colors: { value: "background-color, border-color, box-shadow, color" },
        transform: { value: "transform" },
        standard: { value: "background-color, border-color, box-shadow, color, transform" },
      },
      animations: {
        spin: { value: "spin 900ms linear infinite" },
      },
    },
    semanticTokens: {
      colors: {
        surface: {
          canvas: {
            value: { base: "{colors.neutral.50}", _dark: "{colors.neutral.950}" },
          },
          default: {
            value: { base: "{colors.neutral.100}", _dark: "{colors.neutral.900}" },
          },
          raised: {
            value: { base: "{colors.neutral.50}", _dark: "{colors.neutral.800}" },
          },
          subtle: {
            value: { base: "{colors.neutral.200}", _dark: "{colors.neutral.800}" },
          },
          overlay: {
            value: {
              base: "rgb(250 250 250 / 0.32)",
              _dark: "rgb(9 9 11 / 0.4)",
            },
          },
        },
        fg: {
          default: {
            value: { base: "{colors.neutral.900}", _dark: "{colors.neutral.100}" },
          },
          muted: {
            value: { base: "{colors.neutral.600}", _dark: "{colors.neutral.400}" },
          },
          onAccent: { value: "{colors.neutral.50}" },
        },
        border: {
          default: {
            value: { base: "{colors.neutral.300}", _dark: "{colors.neutral.700}" },
          },
          strong: {
            value: { base: "{colors.neutral.500}", _dark: "{colors.neutral.500}" },
          },
          interactive: {
            value: { base: "{colors.neutral.900}", _dark: "{colors.neutral.200}" },
          },
        },
        accent: {
          default: { value: "{colors.blue.600}" },
          hover: { value: "{colors.blue.700}" },
        },
        success: { value: "{colors.green.700}" },
        warning: { value: "{colors.amber.700}" },
        danger: { value: "{colors.red.600}" },
        info: { value: "{colors.blue.600}" },
        focus: { value: "{colors.blue.600}" },
        disabled: {
          value: { base: "{colors.neutral.400}", _dark: "{colors.neutral.600}" },
        },
        selected: {
          value: { base: "{colors.blue.50}", _dark: "{colors.blue.950}" },
        },
        link: {
          default: {
            value: { base: "{colors.neutral.600}", _dark: "{colors.neutral.400}" },
          },
          hover: {
            value: { base: "{colors.neutral.900}", _dark: "{colors.neutral.200}" },
          },
        },
      },
      shadows: {
        sm: {
          value: {
            base: "0 1px 2px rgb(0 0 0 / 0.08)",
            _dark: "0 1px 2px rgb(255 255 255 / 0.08)",
          },
        },
        md: {
          value: {
            base: "0 10px 24px rgb(0 0 0 / 0.12)",
            _dark: "0 10px 24px rgb(255 255 255 / 0.1)",
          },
        },
        lg: {
          value: {
            base: "0 18px 42px rgb(0 0 0 / 0.16)",
            _dark: "0 18px 42px rgb(255 255 255 / 0.12)",
          },
        },
        xl: {
          value: {
            base: "0 24px 52px rgb(0 0 0 / 0.2)",
            _dark: "0 24px 52px rgb(255 255 255 / 0.14)",
          },
        },
      },
    },
    textStyles: {
      body: {
        value: {
          fontFamily: "system-ui, sans-serif",
          lineHeight: "1.5",
        },
      },
    },
    keyframes: {
      spin: {
        to: {
          transform: "rotate(360deg)",
        },
      },
    },
  },
};
