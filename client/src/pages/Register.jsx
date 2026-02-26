import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    phone: Yup.string().required('Required'),
    password: Yup.string().min(6, 'Too Short!').required('Required'),
});

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

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
                className="relative z-10 w-full max-w-sm sm:max-w-md p-8 sm:p-10 bg-black/40 backdrop-blur-md border border-green-500/40 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
            >
                {/* Decorative corner borders simulated with absolute divs */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-400 opacity-70"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-green-400 opacity-70"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-green-400 opacity-70"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-400 opacity-70"></div>

                {/* Decorative side ticks */}
                <div className="absolute top-1/2 left-0 w-1 h-8 bg-green-400/50 -translate-y-1/2"></div>
                <div className="absolute top-1/2 right-0 w-1 h-8 bg-green-400/50 -translate-y-1/2"></div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl text-white tracking-[0.3em] font-light">SIGN UP</h2>
                </div>

                <Formik
                    initialValues={{ name: '', email: '', phone: '', password: '' }}
                    validationSchema={RegisterSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        const success = await register(values);
                        if (success) {
                            navigate('/login');
                        }
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-5 flex flex-col items-center w-full">
                            <div className="w-full relative group">
                                <Field
                                    name="email"
                                    type="email"
                                    className="w-full bg-green-950/20 border border-green-500/50 text-white placeholder-green-200/60 text-center tracking-widest uppercase py-3 focus:outline-none focus:border-green-400 focus:shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all rounded-sm text-sm"
                                    placeholder="EMAIL"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-400 text-xs mt-1 absolute -bottom-4 left-0 w-full text-center" />
                            </div>

                            <div className="w-full relative group">
                                <Field
                                    name="name"
                                    type="text"
                                    className="w-full bg-green-950/20 border border-green-500/50 text-white placeholder-green-200/60 text-center tracking-widest uppercase py-3 focus:outline-none focus:border-green-400 focus:shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all rounded-sm text-sm"
                                    placeholder="CHOOSE USERNAME"
                                />
                                <ErrorMessage name="name" component="div" className="text-red-400 text-xs mt-1 absolute -bottom-4 left-0 w-full text-center" />
                            </div>

                            <div className="w-full relative group hidden">
                                {/* Hidden phone field as schema requires it. Can add it visible if needed, but styling matching image has 3 inputs. */}
                                {/* Wait, to not break validation, I need to either alter schema or keep it visible. Let's keep it visible. */}
                            </div>

                            <div className="w-full relative group">
                                <Field
                                    name="phone"
                                    type="text"
                                    className="w-full bg-green-950/20 border border-green-500/50 text-white placeholder-green-200/60 text-center tracking-widest uppercase py-3 focus:outline-none focus:border-green-400 focus:shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all rounded-sm text-sm"
                                    placeholder="COMMUNICATOR ID (PHONE)"
                                />
                                <ErrorMessage name="phone" component="div" className="text-red-400 text-xs mt-1 absolute -bottom-4 left-0 w-full text-center" />
                            </div>

                            <div className="w-full relative group">
                                <Field
                                    name="password"
                                    type="password"
                                    className="w-full bg-green-950/20 border border-green-500/50 text-white placeholder-green-200/60 text-center tracking-widest uppercase py-3 focus:outline-none focus:border-green-400 focus:shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all rounded-sm text-sm"
                                    placeholder="CREATE PASSWORD"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-400 text-xs mt-1 absolute -bottom-4 left-0 w-full text-center" />
                            </div>

                            <div className="pt-6 pb-2 w-full flex flex-col items-center justify-center relative">
                                <p className="text-white text-xs tracking-[0.2em] mb-4 font-semibold">BEGIN YOUR JOURNEY</p>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="relative w-24 h-24 rounded-full border border-green-500/50 hover:bg-green-400/10 flex items-center justify-center group transition-all"
                                >
                                    <div className="absolute inset-1 rounded-full border-2 border-green-400/30 group-hover:border-green-400/60 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-[spin_4s_linear_infinite]"></div>
                                    <div className="absolute inset-3 rounded-full border border-green-400/20 group-hover:border-green-400/40 animate-[spin_3s_linear_infinite_reverse]"></div>
                                    <div className="absolute inset-5 rounded-full bg-green-400/10 group-hover:bg-green-400/20 transition-colors"></div>
                                    <div className="w-12 h-12 rounded-full border-2 border-green-400/80 group-hover:border-green-300 flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all">
                                        {isSubmitting ? (
                                            <div className="w-4 h-4 border-2 border-green-200 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <div className="w-2 h-2 bg-green-200 rounded-full shadow-[0_0_8px_#fff]"></div>
                                        )}
                                    </div>
                                </button>
                            </div>

                            <div className="w-full text-center mt-2 flex items-center justify-center gap-3">
                                <div className="relative flex items-center">
                                    <input type="checkbox" id="galactic" className="peer appearance-none w-4 h-4 border border-green-500/80 rounded-sm checked:bg-green-500/40 cursor-pointer transition-all focus:outline-none focus:ring-1 focus:ring-green-400" required />
                                    <span className="absolute left-0 top-0 w-4 h-4 pointer-events-none flex items-center justify-center text-green-300 opacity-0 peer-checked:opacity-100 transition-opacity">
                                        ✓
                                    </span>
                                </div>
                                <label htmlFor="galactic" className="text-green-200/80 text-[10px] tracking-widest uppercase cursor-pointer">Agree to Galactic Terms</label>
                            </div>

                            <div className="w-full text-center mt-4 border-t border-green-500/20 pt-4">
                                <Link to="/login" className="text-green-200/80 hover:text-green-300 text-xs tracking-widest uppercase transition-colors">
                                    Return to Gateway (Log In)
                                </Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            </motion.div>
        </div>
    );
};

export default Register;
