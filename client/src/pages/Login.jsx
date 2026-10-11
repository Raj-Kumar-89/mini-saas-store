import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { HiArrowPath } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (isAuthenticated) {
        return <Navigate to="/templates" replace />;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email.trim(), password);

            const destination = location.state?.from;
            const safeDestination = destination?.pathname?.startsWith("/") && !destination.pathname.startsWith("//") ? destination.pathname : "/templates";

            navigate(safeDestination, { replace: true });
        } catch (err) {
            setError( err.response?.data?.message || "Unable to log in. Please check your connection." );
        } finally {
            setLoading(false);
        }
    };

    return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-12">
        <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">

            <h1 className="text-2xl font-bold tracking-tight text-zinc-900"> Welcome back </h1>

            <p className="mt-2 text-sm text-zinc-500">Log in to access your saved templates.</p>

            {error && (
                <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email address</label>
                    <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={255} autoComplete="email" placeholder="you@example.com" className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                </div>

                <div>
                    <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Password</label>
                    <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required maxLength={72} autoComplete="current-password" placeholder="Enter your password" className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"/>
                </div>

                <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60" >
                    {loading && <HiArrowPath size={18} className="animate-spin" />}
                    {loading ? "Logging in..." : "Log in"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-600">
                Don't have an account?{" "}
                <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700"> Sign up </Link>
            </p>
        </section>
    </main>
  );
}