import React from "react";
import { Link } from "react-router-dom";

const Tile: React.FC<{ to: string; title: string; subtitle?: string; icon?: React.ReactNode }> = ({ to, title, subtitle, icon }) => (
  <Link to={to} className="card p-5 hover:brightness-110 transition">
    <div className="text-3xl mb-3">{icon ?? "🧩"}</div>
    <div className="font-semibold">{title}</div>
    {subtitle && <div className="text-sm text-[var(--muted)] mt-1">{subtitle}</div>}
  </Link>
);

export default Tile;
