import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Too Short!').required('Required'),
});

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // Check if the user was redirected here from a protected route
    const from = location.state?.from?.pathname || '/dashboard';

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=2000&auto=format&fit=crop"
                    alt="Sci-Fi Background"
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
            </div>

            {/* Sci-Fi Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                    clipPath: 'polygon(5% 0, 95% 0, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0 95%, 0 5%)'
                }}
                className="relative z-10 w-full max-w-sm sm:max-w-md p-8 sm:p-10 bg-black/40 backdrop-blur-md border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
            >
                {/* Decorative corner borders simulated with absolute divs */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 opacity-70"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 opacity-70"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400 opacity-70"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 opacity-70"></div>

                {/* Decorative side ticks */}
                <div className="absolute top-1/2 left-0 w-1 h-8 bg-cyan-400/50 -translate-y-1/2"></div>
                <div className="absolute top-1/2 right-0 w-1 h-8 bg-cyan-400/50 -translate-y-1/2"></div>

                <div className="text-center mb-10">
                    <h2 className="text-2xl text-white tracking-[0.3em] font-light">LOG IN</h2>
                </div>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={LoginSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        const success = await login(values.email, values.password);
                        if (success) {
                            navigate(from, { replace: true });
                        }
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-6 flex flex-col items-center w-full">
                            <div className="w-full relative group">
                                <Field
                                    name="email"
                                    type="email"
                                    className="w-full bg-cyan-950/20 border border-cyan-500/50 text-white placeholder-cyan-200/60 text-center tracking-widest uppercase py-3 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all rounded-sm text-sm"
                                    placeholder="USERNAME"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-400 text-xs mt-1 absolute -bottom-5 left-0 w-full text-center" />
                            </div>

                            <div className="w-full relative group mt-8">
                                <Field
                                    name="password"
                                    type="password"
                                    className="w-full bg-cyan-950/20 border border-cyan-500/50 text-white placeholder-cyan-200/60 text-center tracking-widest uppercase py-3 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all rounded-sm text-sm"
                                    placeholder="PASSWORD"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-400 text-xs mt-1 absolute -bottom-5 left-0 w-full text-center" />
                            </div>

                            <div className="w-full text-center mt-2">
                                <a href="#" className="text-cyan-200/80 hover:text-cyan-300 text-xs tracking-wider transition-colors">
                                    Forgot Password?
                                </a>
                            </div>

                            <div className="pt-8 pb-4 w-full flex flex-col items-center justify-center relative">
                                <p className="text-white text-xs tracking-[0.2em] mb-4 font-semibold">ENTER THE GATEWAY</p>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="relative w-24 h-24 rounded-full border border-cyan-500/50 hover:bg-cyan-400/10 flex items-center justify-center group transition-all"
                                >
                                    {/* Glowing concentric rings */}
                                    <div className="absolute inset-1 rounded-full border-2 border-cyan-400/30 group-hover:border-cyan-400/60 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] animate-[spin_4s_linear_infinite]"></div>
                                    <div className="absolute inset-3 rounded-full border border-cyan-400/20 group-hover:border-cyan-400/40 animate-[spin_3s_linear_infinite_reverse]"></div>
                                    <div className="absolute inset-5 rounded-full bg-cyan-400/10 group-hover:bg-cyan-400/20 transition-colors"></div>

                                    {/* Center core */}
                                    <div className="w-12 h-12 rounded-full border-2 border-cyan-400/80 group-hover:border-cyan-300 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all">
                                        {isSubmitting ? (
                                            <div className="w-4 h-4 border-2 border-cyan-200 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <div className="w-2 h-2 bg-cyan-200 rounded-full shadow-[0_0_8px_#fff]"></div>
                                        )}
                                    </div>
                                </button>
                            </div>

                            <div className="w-full text-center mt-4">
                                <p className="text-cyan-200/60 text-[10px] tracking-widest mb-3 uppercase">CONNECT WITH:</p>
                                <div className="flex justify-center gap-4">
                                    <div className="w-8 h-8 rounded-full border border-cyan-500/40 flex items-center justify-center hover:bg-cyan-400/20 hover:border-cyan-400 cursor-pointer transition-all">
                                        <span className="text-cyan-400 text-xs font-serif">G</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-cyan-500/40 flex items-center justify-center hover:bg-cyan-400/20 hover:border-cyan-400 cursor-pointer transition-all">
                                        <span className="text-cyan-400 text-xs font-serif">f</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-cyan-500/40 flex items-center justify-center hover:bg-cyan-400/20 hover:border-cyan-400 cursor-pointer transition-all">
                                        <span className="text-cyan-400 text-xs font-serif">in</span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full text-center mt-6">
                                <Link to="/register" className="text-cyan-200/80 hover:text-cyan-300 text-xs tracking-widest uppercase transition-colors">
                                    Need an account? Sign Up
                                </Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            </motion.div>
        </div>
    );
};

export default Login;
