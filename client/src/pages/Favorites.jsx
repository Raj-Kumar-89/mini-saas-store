import { useCallback, useEffect, useState } from "react";
import { HiOutlineHeart } from "react-icons/hi2";
import api from "../services/api";
import TemplateCard from "../components/TemplateCard";

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busyId, setBusyId] = useState(null);

    const fetchFavorites = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/favorites");
            setFavorites(response.data.favorites || []);
        } catch (err) {
            setError( err.response?.data?.message || "Unable to load your favorites. Please try again." );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    async function removeFavorite(templateId) {
        setBusyId(templateId);
        setError("");

        try {
            await api.delete(`/favorites/${templateId}`);

            setFavorites((previous) => previous.filter((template) => template.id !== templateId));
        } catch (err) {
            setError( err.response?.data?.message || "Could not remove this favorite. Please try again." );
        } finally {
            setBusyId(null);
        }
    }

    return (
    <main className="min-h-screen bg-zinc-50">
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                    <HiOutlineHeart size={23} />
                </div>

                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-950"> Your favorites </h1>
                    <p className="mt-1 text-sm text-zinc-600"> The templates you saved for later. </p>
                </div>
            </div>

            {error && (
                <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                    <button type="button" onClick={fetchFavorites} className="ml-2 font-semibold underline">Retry</button>
                </div>
            )}

            {loading ? (
                <div className="grid gap-6 pt-8 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="h-80 animate-pulse rounded-2xl bg-zinc-200" />
                    ))}
                </div>
            ) : favorites.length === 0 ? (
                <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
                    <HiOutlineHeart className="mx-auto text-zinc-400" size={32} />

                    <h2 className="mt-4 text-lg font-semibold text-zinc-900">No favorites yet</h2>

                    <p className="mt-2 text-sm text-zinc-500">Browse the marketplace and save templates you like.</p>

                </div>
            ) : (
            <>
                <p className="mt-6 text-sm text-zinc-500">
                    {favorites.length} saved{" "}
                    {favorites.length === 1 ? "template" : "templates"}
                </p>

                <div className="grid gap-6 pt-5 sm:grid-cols-2 lg:grid-cols-3">
                    {favorites.map((template) => (
                        <TemplateCard key={template.id} template={template} isFavorite={true} isAuthenticated={true} busy={busyId === template.id}
                            onToggleFavorite={removeFavorite} />
                    ))}
                </div>
            </>
            )}
        </section>
    </main>
  );
}