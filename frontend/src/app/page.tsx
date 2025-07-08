'use client';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart } from 'lucide-react';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCurrentAccount } from '@/hooks/use-current-account';
const steps = [
    {
        title: 'Registration',
        description:
            'Complete a quick registration form with your personal details and medical history.',
    },
    {
        title: 'Screening',
        description:
            'A healthcare professional will check your temperature, blood pressure, pulse and hemoglobin levels.',
    },
    {
        title: 'Donation',
        description:
            "The actual blood donation takes only 8-10 minutes. You'll be seated comfortably while donating.",
    },
    {
        title: 'Recovery',
        description:
            "After donating, you'll rest and enjoy refreshments. Most people feel fine after a short rest.",
    },
];

export default function LandingPage() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: false, amount: 0.2 });
    const router = useRouter();
    const { data: account } = useCurrentAccount();
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
                            community life. Join our community of heroes and
                            help us save lives, one donation at a time.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-4"
                                onClick={() => {
                                    if (account) {
                                        router.push('/request');
                                    } else {
                                        router.push('/login');
                                    }
                                }}
                            >
                                Become a Donor
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
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
                                process. Here is what to expect when you donate.
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
                                                <h3 className="text-xl font-bold mb-2 text-gray-900 ">
                                                    {step.title}
                                                </h3>
                                                <p className="text-gray-600">
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
                                        ></motion.div>

                                        <div className="md:w-1/2"></div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
