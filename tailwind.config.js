/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta "PROFANE" — tons frios de noite, inspirados livremente em
        // esquemas de cor de investigação/noir (sem reaproveitar arte ou
        // layout de nenhum jogo específico).
        ink: "#12161C", // fundo quase preto, azulado
        charcoal: "#1A2029", // painéis
        charcoal2: "#232A34", // cards
        steel: "#3A4552", // bordas/neutros médios
        teal: "#5A8482", // acento frio — sucesso, foco secundário
        amber: "#C9A227", // acento quente — destaque, atenção
        blood: "#B5502F", // acento principal (ferrugem/laranja queimado) — CTAs, alerta
        blood2: "#8F3D22", // acento principal, hover/estado ativo
        parchment: "#D8CBAE", // texto principal sobre fundo escuro
        parchment2: "#B7AA8A", // texto secundário
        bone: "#ECE4D3", // branco quebrado
      },
      fontFamily: {
        display: ["Poppins", "'Segoe UI'", "sans-serif"],
        serif: ["Poppins", "'Segoe UI'", "sans-serif"],
        stamp: ["Poppins", "'Segoe UI'", "sans-serif"],
      },
      boxShadow: {
        file: "0 1px 0 rgba(216,203,174,0.06), 0 8px 24px rgba(0,0,0,0.45)",
      },
      backgroundImage: {
        noise: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        "dice-roll": {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "30%": { transform: "rotate(140deg) scale(1.15)" },
          "60%": { transform: "rotate(250deg) scale(0.92)" },
          "100%": { transform: "rotate(360deg) scale(1)" },
        },
        "stamp-in": {
          "0%": { transform: "rotate(var(--stamp-rotate)) scale(1.8)", opacity: "0" },
          "55%": { transform: "rotate(var(--stamp-rotate)) scale(0.92)", opacity: "1" },
          "100%": { transform: "rotate(var(--stamp-rotate)) scale(1)", opacity: "1" },
        },
        "fade-up": {
          "0%": { transform: "translateY(6px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "dice-roll": "dice-roll 0.5s ease-out",
        "stamp-in": "stamp-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
        "fade-up": "fade-up 0.25s ease-out both",
      },
    },
  },
  plugins: [],
};
