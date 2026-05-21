/* SupClaw Tailwind theme extension — load AFTER cdn.tailwindcss.com */
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        ui:     ['"PingFang SC"', '"HarmonyOS Sans SC"', '"Noto Sans SC"', "system-ui", "sans-serif"],
        num:    ['"Open Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        slogan: ['"PingFang SC"', '"HarmonyOS Sans SC"', '"Noto Sans SC"', "system-ui", "sans-serif"],
      },
      colors: {
        tokenText:         "var(--color-text-primary)",
        tokenSub:          "var(--color-text-secondary)",
        tokenHint:         "var(--color-text-hint)",
        tokenPrimary:      "var(--color-primary)",
        tokenPrimaryDark:  "var(--color-primary-dark)",
        tokenPage:         "var(--color-bg-page)",
        tokenCard:         "var(--color-bg-card)",
        tokenBorder:       "var(--color-border)",
        tokenBorderSubtle: "var(--color-border-subtle)",
        tokenSuccess:      "var(--color-success)",
        tokenDanger:       "var(--color-danger)",
      },
    },
  },
};
