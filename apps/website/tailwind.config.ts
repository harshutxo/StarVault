import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#020617",
        "deep-space": "#08111F",
        "electric-blue": "#3B82F6",
        cyan: "#22D3EE",
        ink: "#17202a",
        vault: "#3B82F6",
        gold: "#22D3EE",
        paper: "#08111F"
      },
      borderRadius: {
        card: "8px"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(21, 32, 43, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
