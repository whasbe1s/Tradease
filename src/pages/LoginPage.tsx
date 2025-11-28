import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                await signUp(email, password);
                // Usually signup requires email confirmation, but for now we'll assume it might auto-login or ask for confirm
                setError('Check your email for confirmation link.');
            } else {
                await signIn(email, password);
                navigate('/');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to authenticate');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-nothing-base p-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-nothing-accent/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-md w-full backdrop-blur-xl bg-nothing-surface/80 rounded-3xl p-8 shadow-2xl border border-nothing-dark/5 relative z-10">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-nothing-dark text-nothing-base rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                    </div>
                    <h2 className="text-2xl font-bold text-nothing-dark tracking-tight font-mono uppercase">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-xs text-nothing-dark/40 font-mono mt-2 uppercase tracking-widest">
                        {isSignUp ? 'Join the trading journal' : 'Sign in to continue'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/5 border border-red-500/10 text-red-600 p-4 rounded-xl mb-6 text-xs font-mono flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold font-mono uppercase tracking-widest text-nothing-dark/50 ml-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-nothing-dark/5 border border-transparent focus:bg-white focus:text-nothing-base focus:border-nothing-dark/10 focus:ring-4 focus:ring-nothing-dark/5 outline-none transition-all font-mono text-sm text-nothing-dark placeholder:text-nothing-dark/20"
                            placeholder="trader@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[10px] font-bold font-mono uppercase tracking-widest text-nothing-dark/50 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-nothing-dark/5 border border-transparent focus:bg-white focus:text-nothing-base focus:border-nothing-dark/10 focus:ring-4 focus:ring-nothing-dark/5 outline-none transition-all font-mono text-sm text-nothing-dark placeholder:text-nothing-dark/20"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-nothing-dark text-nothing-base py-4 rounded-full font-bold font-mono uppercase tracking-widest hover:bg-nothing-dark/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100 mt-2"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-nothing-base"></div>
                        ) : (
                            <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-nothing-dark/5">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-xs font-mono text-nothing-dark/40 hover:text-nothing-dark transition-colors uppercase tracking-wider"
                    >
                        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
};
