import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineSquares2X2, HiOutlineBookmark, HiOutlineClock, HiArrowPath, HiOutlineSparkles, HiOutlineArrowRight } from "react-icons/hi2";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const RECENT_KEY = "recentlyViewedTemplates";

export default function Dashboard() {
    const { user } = useAuth();

    const [templateCount, setTemplateCount] = useState(0);
    const [favorites, setFavorites] = useState([]);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadDashboard() {
            setLoading(true);
            setError("");

            try {
                const [templatesResponse, favoritesResponse] = await Promise.all([
                    api.get("/templates"),
                    api.get("/favorites"),
                ]);

                if (cancelled) return;

                const templatesData = templatesResponse.data;
                const favoritesData = favoritesResponse.data;

                setTemplateCount( templatesData.count ?? templatesData.templates?.length ?? 0 );

                setFavorites(favoritesData.favorites ?? []);

                try {
                    const saved = JSON.parse(
                        localStorage.getItem(RECENT_KEY) || "[]"
                    );

                    setRecentlyViewed(Array.isArray(saved) ? saved : []);
                } catch {
                    setRecentlyViewed([]);
                }
            } catch (err) {
                if (!cancelled) {
                    setError( err.response?.data?.message || "We couldn't load your dashboard. Please try again." );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadDashboard();

        return () => {
            cancelled = true;
        };
    }, []);

    const displayName = user?.name || user?.username || user?.email?.split("@")[0] || "Creator";

        const stats = [
            {
                label: "Marketplace templates",
                value: templateCount,
                description: "Ready to explore",
                icon: HiOutlineSquares2X2,
                color: "bg-blue-100 text-blue-700",
            },
            {
                label: "Your favorites",
                value: favorites.length,
                description: "Templates you've saved",
                icon: HiOutlineBookmark,
                color: "bg-red-100 text-red-700",
            },
            {
                label: "Recently viewed",
                value: recentlyViewed.length,
                description: "Stored in this browser",
                icon: HiOutlineClock,
                color: "bg-amber-100 text-amber-700",
            },
        ];

    return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
            <section className="relative mb-8 overflow-hidden rounded-3xl bg-linear-to-br from-black to-red-600 p-7 text-white sm:p-10">
                <div className="relative z-10 max-w-2xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium">
                        <HiOutlineSparkles size={16} />  Your creative space
                    </div>

                    <h1 className="text-3xl font-black tracking-tight sm:text-5xl"> Welcome back, {displayName}!</h1>

                    <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-bold text-white transition">
                        Explore templates<HiOutlineArrowRight size={18} />
                    </Link>
                </div>

                <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full border-36 border-white/10" />
                <div className="pointer-events-none absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-pink-400/20 blur-2xl" />
            </section>

            {error && (
                <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <p>{error}</p>
                    <button type="button" onClick={() => window.location.reload()} className="inline-flex items-center gap-2 font-bold">
                        <HiArrowPath size={15} /> Retry
                    </button>
                </div>
            )}

            <section className="mb-10">
                <div className="mb-5">
                    <h2 className="text-2xl font-black text-slate-900">Your overview</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                        <p className="mt-3 text-4xl font-black text-slate-900">{loading ? "—" : stat.value}</p>
                                    </div>

                                    <div className={`rounded-xl p-3 ${stat.color}`}>
                                        <Icon size={22} />
                                    </div>
                                </div>

                                <p className="mt-4 text-sm text-slate-500">{stat.description}</p>
                            </article>
                        );
                    })}
                </div>
            </section>

            <div className="grid items-start gap-8 lg:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-black text-slate-900">Your favorites</h2>
                        </div>

                        <Link to="/favorites" className="shrink-0 text-sm font-bold text-zinc-700 hover:text-zinc-900">View all</Link>
                    </div>

                    {loading ? (
                        <p className="py-8 text-center text-sm text-slate-500">Loading favorites...</p>
                    ) : favorites.length === 0 ? (
                        <div className="rounded-xl bg-slate-50 px-4 py-8 text-center">
                            <HiOutlineBookmark className="mx-auto mb-3 text-slate-400" size={28} />
                            <p className="font-semibold text-slate-800">No favorites yet</p>
                            <p className="mt-1 text-sm text-slate-500">Save a template you like and it will appear here.</p>
                            <Link to="/" className="mt-4 inline-block text-sm font-bold text-zinc-700">Browse templates</Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {favorites.slice(0, 4).map((item) => {
                                const template = item.template ?? item;

                                return (
                                    <Link key={template.id} to={`/templates/${template.id}`} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-zinc-200 hover:bg-zinc-50/50">
                                        {template.thumbnail_url ? (
                                            <img src={template.thumbnail_url} alt="" className="h-16 w-20 rounded-lg bg-slate-100 object-cover" />
                                        ) : (
                                            <div className="flex h-16 w-20 items-center justify-center rounded-lg bg-zinc-50">
                                                <HiOutlineSquares2X2 className="text-zinc-500" size={22} />
                                            </div>
                                        )}

                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate font-bold text-slate-900">{template.name}</h3>
                                            <p className="mt-1 text-sm text-slate-500">{template.category || "Template"}</p>
                                        </div>

                                        <HiOutlineArrowRight size={18} className="shrink-0 text-slate-400" />
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                    <div className="mb-5">
                        <h2 className="text-xl font-black text-slate-900"> Recently viewed </h2>
                    </div>

                    {loading ? (
                        <p className="py-8 text-center text-sm text-slate-500">Loading your history...</p>
                    ) : recentlyViewed.length === 0 ? (
                        <div className="rounded-xl bg-slate-50 px-4 py-8 text-center">
                            <HiOutlineClock className="mx-auto mb-3 text-slate-400" size={28} />
                            <p className="font-semibold text-slate-800"> Nothing here yet </p>
                            <p className="mt-1 text-sm text-slate-500"> Open a template to start building your history. </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentlyViewed.slice(0, 4).map((item) => (
                                <Link key={item.id} to={`/templates/${item.id}`} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-zinc-200 hover:bg-zinc-50/50" >
                                    {item.thumbnail_url ? (
                                        <img src={item.thumbnail_url} alt="" className="h-16 w-20 rounded-lg bg-slate-100 object-cover" />
                                    ) : (
                                        <div className="flex h-16 w-20 items-center justify-center rounded-lg bg-amber-50">
                                            <HiOutlineClock className="text-amber-600" size={22} />
                                        </div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate font-bold text-slate-900">{item.name}</h3>
                                        <p className="mt-1 text-sm text-slate-500">{item.category || "Template"}</p>
                                    </div>

                                    <HiOutlineArrowRight size={18} className="shrink-0 text-slate-400" />
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    </main>
  );
}