import { useEffect, useMemo, useState } from "react";
import { HiOutlineMagnifyingGlass, HiOutlineAdjustmentsHorizontal, HiOutlineClock, HiBarsArrowDown, HiOutlineXMark } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import TemplateCard from "../components/TemplateCard";

const sortOptions = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
];

export default function Templates() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [templates, setTemplates] = useState([]);
    const [favoriteIds, setFavoriteIds] = useState(() => new Set());
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [sortBy, setSortBy] = useState("newest");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busyId, setBusyId] = useState(null);
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    useEffect(() => {
        try {
            const saved = JSON.parse(
                localStorage.getItem("recentlyViewedTemplates") || "[]"
            );

            setRecentlyViewed(Array.isArray(saved) ? saved : []);
        } catch (error) {
            console.error("Could not load recently viewed templates:", error);
            setRecentlyViewed([]);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function fetchTemplates() {
            setLoading(true);
            setError("");

            try {
                const response = await api.get("/templates");

                if (!cancelled) {
                    setTemplates(response.data.templates || []);
                }
            } catch (err) {
                if (!cancelled) {
                    setError( err.response?.data?.message || "Unable to load templates. Please try again." );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchTemplates();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function fetchFavorites() {
            if (!isAuthenticated) {
                setFavoriteIds(new Set());
                return;
            }

            try {
                const response = await api.get("/favorites");
                const ids = (response.data.favorites || []).map(
                    (template) => template.id
                );

                if (!cancelled) setFavoriteIds(new Set(ids));
            } catch {
                if (!cancelled) setFavoriteIds(new Set());
            }
        }

        fetchFavorites();

        return () => {
            cancelled = true;
        };
    }, [isAuthenticated]);

    const categories = useMemo(
        () => [
            "All",
            ...new Set(
                templates
                .map((template) => template.category)
                .filter(Boolean)
                .sort((a, b) => a.localeCompare(b))
            ),
        ],
        [templates]
    );

    const filteredTemplates = useMemo(() => {
        const term = search.trim().toLowerCase();

        const results = templates.filter((template) => {
            const matchesCategory = category === "All" || template.category === category;

            const matchesSearch = !term || template.name.toLowerCase().includes(term) ||
            (template.description || "").toLowerCase().includes(term) ||
            (template.category || "").toLowerCase().includes(term);

            return matchesCategory && matchesSearch;
        });

        return results.sort((a, b) => {
            switch (sortBy) {
                case "oldest":
                    return new Date(a.created_at || 0) - new Date(b.created_at || 0);
                case "name-asc":
                    return a.name.localeCompare(b.name);
                case "name-desc":
                    return b.name.localeCompare(a.name);
                case "newest":
                    default:
                        return (
                            new Date(b.created_at || 0) - new Date(a.created_at || 0) || Number(b.id) - Number(a.id)
                        );
            }
        });
    }, [templates, search, category, sortBy]);

    function clearFilters() {
        setSearch("");
        setCategory("All");
        setSortBy("newest");
    }

    async function toggleFavorite(templateId) {
        if (!isAuthenticated) {
            navigate("/login", {
                state: { from: { pathname: "/templates" } },
            });
            return;
        }

        const wasFavorite = favoriteIds.has(templateId);
        setBusyId(templateId);
        setError("");

        try {
            if (wasFavorite) {
                await api.delete(`/favorites/${templateId}`);

                setFavoriteIds((previous) => {
                    const updated = new Set(previous);
                    updated.delete(templateId);
                    return updated;
                });
            } else {
                await api.post(`/favorites/${templateId}`);

                setFavoriteIds((previous) => {
                    const updated = new Set(previous);
                    updated.add(templateId);
                    return updated;
                });
            }
        } catch (err) {
            setError( err.response?.data?.message || "Could not update favorites. Please try again." );
        } finally {
            setBusyId(null);
        }
    }

    const hasActiveFilters = search.trim() !== "" || category !== "All" || sortBy !== "newest";

    return (
    <main className="min-h-screen bg-[#faf9ff]">
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl">Explore templates</h2>
                    <p className="mt-2 text-sm text-zinc-500">Find the right design for your next project.</p>
                </div>

                <p className="text-sm font-medium text-zinc-500">
                    Showing{" "}
                    <span className="font-bold text-zinc-900">
                        {filteredTemplates.length}
                    </span>{" "}
                    of {templates.length} templates
                </p>
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm sm:p-5">
                <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                    <div className="relative">
                        <HiOutlineMagnifyingGlass size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search names, descriptions, categories..." 
                            aria-label="Search templates"
                            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-11 pr-4 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-100" />
                    </div>

                    <div className="flex items-center gap-2">
                        <label htmlFor="template-sort" className="flex shrink-0 items-center gap-2 text-sm font-medium text-zinc-600" >
                            <HiBarsArrowDown size={17} />
                            Sort:
                        </label>
                        <select id="template-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-3.5 text-sm font-medium outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 sm:flex-none">
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="mr-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                        <HiOutlineAdjustmentsHorizontal size={15} />
                        Categories
                    </span>

                    {categories.map((item, index) => {
                        const active = category === item;

                        return (
                            <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={active}
                            className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                            active
                              ? "bg-zinc-950 text-white shadow-md"
                              :  "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                            }`}>
                                {item === "All" ? "All templates" : item}
                            </button>
                        );
                    })}

                    {hasActiveFilters && (
                        <button type="button" onClick={clearFilters} className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50" >
                            <HiOutlineXMark size={15} />Reset
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            {recentlyViewed.length > 0 && (
                <section className="mb-5 mt-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <HiOutlineClock size={18} className="text-zinc-900" />
                                <h2 className="text-xl font-bold text-slate-900">Recently viewed</h2>
                            </div>
                            <p className="text-sm text-slate-500">Pick up where you left off.</p>
                        </div>

                        <button type="button"
                            onClick={() => {
                                localStorage.removeItem("recentlyViewedTemplates");
                                setRecentlyViewed([]);
                            }}
                            className="shrink-0 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                            Clear history
                        </button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-3">
                        {recentlyViewed.map((item) => (
                            <Link key={item.id} to={`/templates/${item.id}`}
                            className="group w-56 shrink-0 overflow-hidden rounded-2xl
                            border border-slate-200 bg-white transition
                            hover:-translate-y-1 hover:border-zinc-300
                            hover:shadow-lg">

                                <div className="aspect-16/10 overflow-hidden bg-slate-100">
                                    {item.thumbnail_url ? (
                                        <img src={item.thumbnail_url} alt={item.name}
                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                            No preview available
                                        </div>
                                    )}
                                </div>

                                <div className="p-3">
                                    <p className="mb-1 truncate text-xs font-semibold uppercase tracking-wide text-blue-600">
                                        {item.category || "Template"}
                                    </p>
                                    <h3 className="truncate font-bold text-slate-900">{item.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {loading ? (
                <div className="grid gap-6 pt-8 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="h-80 animate-pulse rounded-2xl bg-zinc-100"  />
                    ))}
                </div>
            ) : filteredTemplates.length === 0 ? (
                <div className="mt-8 rounded-3xl border border-dashed border-zinc-200 bg-white px-6 py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-600">
                        <HiOutlineMagnifyingGlass size={25} />
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-zinc-900">Nothing matches just yet</h3>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">Try another keyword or category. Your next favorite design might be one filter away.</p>
                    <button type="button" onClick={clearFilters} className="mt-6 rounded-xl bg-zinc-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-zinc-200 transition hover:-translate-y-0.5">
                        Clear all filters
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 pt-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredTemplates.map((template) => (
                        <TemplateCard key={template.id} template={template} isFavorite={favoriteIds.has(template.id)} isAuthenticated={isAuthenticated} busy={busyId === template.id} onToggleFavorite={toggleFavorite}/>
                    ))}
                </div>
            )}
        </section>
    </main>
  );
}