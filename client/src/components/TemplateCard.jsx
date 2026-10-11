import { HiOutlineHeart, HiOutlineArrowUpRight } from "react-icons/hi2";
import { Link } from "react-router-dom";

export default function TemplateCard({
    template,
    isFavorite = false,
    onToggleFavorite,
    isAuthenticated = false,
    busy = false,
}) {
    return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-16/10 overflow-hidden bg-zinc-100">
            <Link to={`/templates/${template.id}`} aria-label={`View ${template.name} details`} className="block h-full w-full">
                <img
                    src={template.thumbnail_url}
                    alt={template.name}
                    loading="lazy"
                    onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "https://placehold.co/800x500?text=Template+Preview";
                    }}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"/>
            </Link>

            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm"> {template.category} </span>

            <button type="button" disabled={busy} onClick={() => onToggleFavorite(template.id)}
                aria-label={ isFavorite ? "Remove from favorites" : "Add to favorites" }
                aria-pressed={isFavorite}
                title={
                isAuthenticated
                    ? isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    : "Log in to save this template"
                }
                className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    isFavorite ? "bg-rose-50 text-rose-600" : "bg-white text-zinc-700 hover:bg-rose-50 hover:text-rose-600"
                }`}>
                <HiOutlineHeart size={19} fill={isFavorite ? "currentColor" : "none"} />
            </button>
        </div>

        <div className="p-5">
            <div className="flex items-start justify-between gap-3">
                <Link to={`/templates/${template.id}`} className="text-lg font-semibold text-zinc-900 transition hover:text-violet-700">
                    {template.name}
                </Link>
                <HiOutlineArrowUpRight size={18} className="mt-1 shrink-0 text-zinc-400 transition group-hover:text-zinc-900" />
            </div>

            <p className="mt-2 line-clamp-3 min-h-18 text-sm leading-6 text-zinc-600"> {template.description || "Explore this website template."} </p>

            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-500"> {template.category} </span>

                <button type="button" disabled={busy} onClick={() => onToggleFavorite(template.id)} className="text-sm font-semibold text-zinc-800 hover:text-rose-600 disabled:opacity-50" >
                    {busy
                      ? "Saving..."
                      : isFavorite
                        ? "Saved"
                        : "Save template"}
                </button>
            </div>
        </div>
    </article>
  );
}