import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { HiArrowPath } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (isAuthenticated) {
        return <Navigate to="/templates" replace />;
    }

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (form.name.trim().length === 0) {
            setError("Please enter your name.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (form.password.length < 8 || form.password.length > 72) {
            setError("Password must be between 8 and 72 characters.");
            return;
        }

        setLoading(true);

        try {
            await register(
                form.name.trim(),
                form.email.trim(),
                form.password
            );

            navigate("/templates", { replace: true });
        } catch (err) {
            setError( err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-12">
        <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Create your account</h1>

            <p className="mt-2 text-sm text-zinc-500">Save your favorite templates in one place.</p>

            {error && (
                <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" >
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Full name</label>
                    <input id="name" name="name" value={form.name} onChange={handleChange} required maxLength={100} autoComplete="name" placeholder="Your name" className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                </div>

                <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email address</label>
                    <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required maxLength={255} autoComplete="email" placeholder="you@example.com" className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"/>
                </div>

                <div>
                    <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Password</label>
                    <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required minLength={8} maxLength={72} autoComplete="new-password" placeholder="At least 8 characters" className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"/>
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium">Confirm password</label>
                    <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required minLength={8} maxLength={72} autoComplete="new-password" placeholder="Re-enter your password" className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                </div>

                <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60">
                    {loading && <HiArrowPath size={18} className="animate-spin" />}
                    {loading ? "Creating account..." : "Create account"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-600">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700"> Log in </Link>
            </p>
        </section>
    </main>
  );
}