'use client';

import { Button } from '@/components/ui/button';
import {
    ArrowRight,
    CheckCircle,
    Heart,
    Link,
    Play,
    Shield,
    Star,
} from 'lucide-react';
import { useRef, useContext } from 'react';
import { motion, useInView } from 'framer-motion';

const steps = [
    {
        title: 'Registration',
        description:
            'Complete a quick registration form with your personal details and medical history.',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
        ),
    },
    {
        title: 'Screening',
        description:
            'A healthcare professional will check your temperature, blood pressure, pulse and hemoglobin levels.',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
            </svg>
        ),
    },
    {
        title: 'Donation',
        description:
            "The actual blood donation takes only 8-10 minutes. You'll be seated comfortably while donating.",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
            </svg>
        ),
    },
    {
        title: 'Recovery',
        description:
            "After donating, you'll rest and enjoy refreshments. Most people feel fine after a short rest.",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
        ),
    },
];

export default function LandingPage() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: false, amount: 0.2 });
    return (
        <div className="min-h-screen bg-white">
            <main className="container mx-auto px-4">
                <section className="py-20 text-center relative overflow-hidden bg-white-50">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Heart className="h-4 w-4" />
                            Join 10,000+ Life Savers
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                            Donate Blood,
                            <br />
                            <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                Save Lives
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                            Your donation can make a significant difference in
                            someone's life. Join our community of heroes and
                            help us save lives, one donation at a time.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-4"
                            >
                                Become a Donor
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>FDA Approved</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-blue-500" />
                                <span>100% Secure</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span>4.9/5 Rating</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="process"
                    className="py-20 bg-white-50 transition-colors duration-300"
                    ref={ref}
                >
                    <div className="container mx-auto px-4 md:px-6">
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            animate={
                                isInView
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 20 }
                            }
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                The Donation Process
                            </h2>
                            <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
                            <p className="max-w-2xl mx-auto text-lg text-gray-600">
                                Donating blood is a simple and straightforward
                                process. Here's what to expect when you donate.
                            </p>
                        </motion.div>

                        <div className="relative">
                            <motion.div
                                className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-red-200 hidden md:block"
                                initial={{ height: 0 }}
                                animate={
                                    isInView
                                        ? { height: '100%' }
                                        : { height: 0 }
                                }
                                transition={{ duration: 1.5 }}
                            />

                            <div className="space-y-12 relative">
                                {steps.map((step, index) => (
                                    <motion.div
                                        key={index}
                                        className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={
                                            isInView
                                                ? { opacity: 1, y: 0 }
                                                : { opacity: 0, y: 50 }
                                        }
                                        transition={{
                                            duration: 0.6,
                                            delay: index * 0.2,
                                        }}
                                    >
                                        <div
                                            className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}
                                        >
                                            <motion.div
                                                className="bg-white rounded-lg p-8 shadow-lg border border-gray-100 relative z-10"
                                                whileHover={{
                                                    y: -5,
                                                    transition: {
                                                        duration: 0.3,
                                                    },
                                                }}
                                            >
                                                <h3
                                                    className="text-xl font-bold mb-2 text-gray-900 "
                                                >
                                                    {step.title}
                                                </h3>
                                                <p
                                                    className="text-gray-600"
                                                >
                                                    {step.description}
                                                </p>
                                            </motion.div>
                                        </div>

                                        <motion.div
                                            className="flex items-center justify-center w-16 h-16 bg-red-600 rounded-full text-white relative z-20 my-4 md:my-0"
                                            animate={{
                                                scale: [1, 1.1, 1],
                                                rotate: [0, 5, -5, 0],
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Number.POSITIVE_INFINITY,
                                                repeatType: 'reverse',
                                                delay: index * 0.5,
                                            }}
                                        >
                                            {step.icon}
                                        </motion.div>

                                        <div className="md:w-1/2"></div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <motion.div
                            className="mt-16 text-center"
                            initial={{ opacity: 0, y: 30 }}
                            animate={
                                isInView
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 30 }
                            }
                            transition={{ duration: 0.6, delay: 0.8 }}
                        >
                            <motion.button
                                className="bg-red-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-red-700 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Schedule Your Donation
                            </motion.button>
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    );
}
