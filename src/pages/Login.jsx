import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            setError('Failed to log in: ' + err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-charcoal-900">
            <div className="bg-charcoal-800 p-8 rounded-lg border border-forest-900 shadow-xl w-96">
                <h2 className="text-2xl font-bold text-forest-700 mb-6 text-center">Enter The Foundry</h2>
                {error && <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-rust-500 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-charcoal-900 border border-forest-800 rounded p-2 text-parchment focus:border-rust-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-rust-500 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-charcoal-900 border border-forest-800 rounded p-2 text-parchment focus:border-rust-500 focus:outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-forest-800 hover:bg-forest-700 text-parchment font-bold py-2 px-4 rounded transition-colors"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
