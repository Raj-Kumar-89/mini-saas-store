import { useEffect, useState } from "react";
import { HiOutlineArrowLeft, HiOutlineArrowUpRight, HiOutlineHeart, HiOutlineSquares2X2, HiArrowPath, HiOutlineSparkles } from "react-icons/hi2";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const categoryStyles = {
    "Dashboard": "bg-violet-100 text-violet-700",
    "E-commerce": "bg-emerald-100 text-emerald-700",
    "Portfolio": "bg-pink-100 text-pink-700",
    "Landing Page": "bg-orange-100 text-orange-700",
    "Education": "bg-sky-100 text-sky-700",
};

export default function TemplateDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [template, setTemplate] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadTemplate() {
            setLoading(true);
            setError("");
            setTemplate(null);

            try {
                const response = await api.get(`/templates/${id}`);

                if (!cancelled) {
                    setTemplate(response.data.template);
                }
            } catch (err) {
                if (!cancelled) {
                    setError( err.response?.status === 404 ? "This template doesn't exist or has been removed." : err.response?.data?.message || "Unable to load this template." );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadTemplate();

        return () => {
            cancelled = true;
        };
    }, [id]);

    useEffect(() => {
        let cancelled = false;

        async function checkFavorite() {
            if (!isAuthenticated) {
                setIsFavorite(false);
                return;
            }

            try {
                const response = await api.get("/favorites");
                const favorites = response.data.favorites || [];

                if (!cancelled) {
                    setIsFavorite(
                        favorites.some((item) => String(item.id) === String(id))
                    );
                }
            } catch {
                if (!cancelled) setIsFavorite(false);
            }
        }

        checkFavorite();

        return () => {
            cancelled = true;
        };
    }, [id, isAuthenticated]);

    useEffect(() => {
    if (!template) return;

    try {
        const saved = JSON.parse(
            localStorage.getItem("recentlyViewedTemplates") || "[]"
        );

        const history = Array.isArray(saved) ? saved : [];

        const currentTemplate = {
            id: template.id,
            name: template.name,
            category: template.category,
            description: template.description,
            thumbnail_url: template.thumbnail_url,
            viewedAt: new Date().toISOString(),
        };

        const updatedHistory = [
            currentTemplate,
            ...history.filter(
                (item) => String(item.id) !== String(template.id)
            ),
        ].slice(0, 6);

        localStorage.setItem(
            "recentlyViewedTemplates",
            JSON.stringify(updatedHistory)
        );
    } catch (error) {
        console.error("Could not save recently viewed templates:", error);
    }
}, [template]);

    async function toggleFavorite() {
        if (!isAuthenticated) {
            navigate("/login", {
                state: { from: { pathname: `/templates/${id}` } },
            });
            return;
        }

        setBusy(true);
        setError("");

        try {
            if (isFavorite) {
                await api.delete(`/favorites/${id}`);
                setIsFavorite(false);
            } else {
                await api.post(`/favorites/${id}`);
                setIsFavorite(true);
            }
        } catch (err) {
            setError( err.response?.data?.message || "Could not update your favorites. Please try again." );
        } finally {
            setBusy(false);
        }
    }

    if (loading) {
        return (
            <main className="grid min-h-[70vh] place-items-center bg-zinc-50 px-4">
                <div className="text-center">
                    <HiArrowPath className="mx-auto animate-spin text-violet-600" size={36} />
                    <p className="mt-4 text-sm text-zinc-500"> Loading template preview... </p>
                </div>
            </main>
        );
    }

    if (error && !template) {
        return (
            <main className="grid min-h-[70vh] place-items-center bg-zinc-50 px-4">
                <div className="max-w-md text-center">
                    <h1 className="text-2xl font-bold text-zinc-900"> Template unavailable </h1>
                    <p className="mt-3 text-zinc-600">{error}</p>
                    <Link to="/templates" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 font-semibold text-white" >
                        <HiOutlineArrowLeft size={17} />
                        Back to marketplace
                    </Link>
                </div>
            </main>
        );
    }
    

    if (!template) return null;

    const badgeStyle = categoryStyles[template.category] || "bg-violet-100 text-violet-700";

     return (
        <main className="min-h-screen bg-[#faf9ff]">
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Link to="/templates" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 transition hover:text-violet-700">
                    <HiOutlineArrowLeft size={17} />
                    Back to marketplace
                </Link>

                <div className="mt-7 grid items-start gap-8 lg:grid-cols-[1.4fr_0.8fr]">
                    <div>
                        <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-xl shadow-violet-100/50">
                            <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-3">
                                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                <span className="ml-3 truncate rounded-md bg-zinc-100 px-3 py-1 text-xs text-zinc-500">
                                    Template preview
                                </span>
                            </div>

                            <div className="aspect-4/3 bg-linear-to-br from-violet-100 via-pink-50 to-orange-100">
                                <img src={template.thumbnail_url} alt={`Preview of ${template.name}`} className="h-full w-full object-cover"
                                    onError={(event) => {
                                        event.currentTarget.onerror = null;
                                        event.currentTarget.src =
                                          "https://placehold.co/1200x900?text=Preview+Unavailable";
                                    }}
                                />
                            </div>
                        </div>

                        <div className="mt-5 flex items-center gap-2 text-sm text-zinc-500">
                            <HiOutlineSquares2X2 size={16} />
                            <span>SaaSTemplate collection</span>
                            <span>·</span>
                            <span>{template.category}</span>
                        </div>
                    </div>

                    <aside className="rounded-3xl border border-violet-100 bg-white p-6 shadow-xl shadow-violet-100/40 sm:p-8">
                        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-800">
                            <HiOutlineSparkles size={14} />
                            TEMPLATE SPOTLIGHT
                        </div>

                        <span className={`mt-5 ml-2 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${badgeStyle}`} > {template.category} </span>

                        <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-zinc-950 sm:text-4xl"> {template.name} </h1>

                        <p className="mt-4 whitespace-pre-line text-base leading-7 text-zinc-600"> {template.description || "Explore this website template and save it to your favorites."} </p>

                        <div className="mt-7 space-y-3">
                            <button type="button" onClick={toggleFavorite} disabled={busy}
                                className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-bold transition disabled:opacity-60 ${
                                    isFavorite
                                    ? "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                                    : "bg-black text-white shadow-lg shadow-zinc-200 hover:bg-zinc-700"
                                }`} >
                                <HiOutlineHeart size={19} fill={isFavorite ? "currentColor" : "none"} />
                                {busy
                                  ? "Updating..."
                                  : isFavorite
                                    ? "Remove from favorites"
                                    : "Save to favorites"}
                            </button>

                            <Link to="/templates" className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 font-semibold text-zinc-700 transition hover:bg-zinc-50" >
                                Explore more templates
                                <HiOutlineArrowUpRight size={17} />
                            </Link>
                        </div>

                        {error && (
                            <p role="alert" className="mt-4 text-sm text-rose-600"> {error} </p>
                        )}

                        <div className="mt-7 border-t border-zinc-100 pt-5">
                            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Template details</p>

                            <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                                <span className="text-zinc-500">Template ID</span>
                                <span className="font-semibold text-zinc-800">#{template.id}</span>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                                <span className="text-zinc-500">Category</span>
                                <span className="font-semibold text-zinc-800">{template.category}</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}