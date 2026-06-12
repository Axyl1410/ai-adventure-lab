import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { GameCardConfig } from "./homeData";

export function GameCard({
  card,
  index,
}: {
  card: GameCardConfig;
  index: number;
}) {
  const { t } = useTranslation("common");
  const Icon = card.icon;

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className="group overflow-hidden rounded-[2rem] border border-white bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-purpleLab/35 hover:shadow-xl"
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <div className={`relative h-48 overflow-hidden ${card.imageTone}`}>
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${card.color}`}
        />
        <img
          alt={card.alt}
          className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          src={card.image}
        />
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-2xl bg-white/90 px-3 py-2 font-black text-ink text-xs shadow-sm">
          <Icon className="h-4 w-4" /> {card.badge}
        </span>
      </div>

      <div className="space-y-4 p-5">
        <div className="min-h-[106px]">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-black text-2xl text-ink leading-tight">
              {card.title}
            </h3>
            <span className="shrink-0 rounded-2xl bg-cream px-3 py-1 font-black text-muted text-xs">
              {card.time}
            </span>
          </div>
          <p className="mt-3 font-bold text-muted text-sm leading-relaxed">
            {card.desc}
          </p>
        </div>

        <Link
          className={`big-button flex w-full items-center justify-center gap-2 bg-gradient-to-r ${card.color} font-black text-ink shadow-md transition-all duration-300 hover:shadow-lg`}
          to={card.to}
        >
          {t("actions.start")}{" "}
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  );
}
