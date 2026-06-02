import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        skyLab: "#38BDF8",
        blueLab: "#60A5FA",
        purpleLab: "#A78BFA",
        pinkLab: "#F472B6",
        yellowLab: "#FACC15",
        orangeLab: "#FB923C",
        greenLab: "#4ADE80",
        mintLab: "#5EEAD4",
        redSoft: "#FCA5A5",
        cream: "#FFF7ED",
        ink: "#1F2937",
        muted: "#6B7280",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(31, 41, 55, 0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config;
