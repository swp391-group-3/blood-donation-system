import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Droplets, Clock, MapPin, Heart, Phone, Icon, Badge, Users, Calendar, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { cn } from '@/lib/utils';
import { config } from 'zod/v4/core';
import { request } from 'http';
import { Progress } from '@radix-ui/react-progress';
import { Button } from './button';

const urgentRequests = [
  {
    patientName: "Sarah Chen",
    age: 34,
    bloodType: "O-",
    hospital: "City General Hospital",
    location: "Downtown Medical Center",
    urgency: "Critical",
    unitsNeeded: 4,
    timeLeft: "6 hours",
    condition: "Emergency surgery complications",
    contactNumber: "+1 (555) 123-4567",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
  },
  {
    patientName: "Marcus Johnson",
    age: 28,
    bloodType: "A+",
    hospital: "St. Mary's Medical Center",
    location: "Westside Campus",
    urgency: "High",
    unitsNeeded: 2,
    timeLeft: "12 hours",
    condition: "Accident trauma recovery",
    contactNumber: "+1 (555) 234-5678",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
  },
  {
    patientName: "Elena Rodriguez",
    age: 45,
    bloodType: "B-",
    hospital: "Regional Medical Center",
    location: "North District",
    urgency: "Urgent",
    unitsNeeded: 3,
    timeLeft: "8 hours",
    condition: "Cancer treatment support",
    contactNumber: "+1 (555) 345-6789",
    image: "https://images.unsplash.com/photo-1594824388853-d0c2d4e5b1b7?w=150&h=150&fit=crop&crop=face",
  },
  {
    patientName: "David Kim",
    age: 52,
    bloodType: "AB+",
    hospital: "University Hospital",
    location: "Medical District",
    urgency: "High",
    unitsNeeded: 2,
    timeLeft: "10 hours",
    condition: "Cardiac surgery preparation",
    contactNumber: "+1 (555) 456-7890",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
  },
  {
    patientName: "Lisa Thompson",
    age: 29,
    bloodType: "O+",
    hospital: "Children's Hospital",
    location: "Pediatric Wing",
    urgency: "Critical",
    unitsNeeded: 1,
    timeLeft: "4 hours",
    condition: "Pediatric emergency",
    contactNumber: "+1 (555) 567-8901",
    image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face",
  },
]

export function PremiumTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % urgentRequests.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45
    })
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.23, 0.86, 0.39, 0.96] 
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % urgentRequests.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + urgentRequests.length) % urgentRequests.length);
  };

  return (
    <section id="testimonials" className="relative py-32 bg-gradient-to-br from-black via-indigo-950/20 to-black text-white overflow-hidden">
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.08] via-purple-500/[0.05] to-rose-500/[0.08]"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundSize: '400% 400%'
          }}
        />
        
        {/* Moving light orbs */}
        <motion.div
          className="absolute top-1/3 left-1/5 w-72 h-72 bg-indigo-400/15 rounded-full blur-3xl"
          animate={{
            x: [0, 150, 0],
            y: [0, 80, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-rose-400/15 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${15 + (i * 7)}%`,
              top: `${25 + (i * 5)}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.2, 1, 0.2],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <motion.div 
        ref={containerRef}
        className="relative z-10 max-w-7xl mx-auto px-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-20"
          variants={fadeInUp}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.08] border border-white/[0.15] backdrop-blur-sm mb-6"
            whileHover={{ scale: 1.05, borderColor: "rgba(255, 255, 255, 0.3)" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-4 w-4 text-indigo-300" />
            </motion.div>
            <span className="text-sm font-medium text-white/80">
              Welcome to Blood Donation System
            </span>
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
          </motion.div>

          <motion.h2 
            className="text-4xl sm:text-6xl md:text-7xl font-bold mb-8 tracking-tight"
            variants={fadeInUp}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Every Drop
            </span>
            <br />
            <motion.span 
              className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-rose-300"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                backgroundSize: '200% 200%'
              }}
            >
              Saves Lives
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-xl sm:text-2xl text-white/60 max-w-4xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            Critical blood shortages require immediate action. Your donation can be the difference between life and death.
          </motion.p>
        </motion.div>

        {/* Main Display */}
        <div className="relative max-w-6xl mx-auto mb-16">
          <div className="relative h-[600px] md:h-[500px] perspective-1000">
            <Card
                        key={1}
                        className={cn(
                            'group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border-slate-200 rounded-2xl overflow-hidden h-fit',
                        )}
                    >
                        <CardHeader className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div
                                    className={`p-3 rounded-xl shadow-lg ring-4`}
                                >
                                    <Icon className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="flex items-center gap-5 text-lg font-bold text-slate-900 leading-tight mb-3">
                                        Title
                                        <Badge
                                            className="bg-rose-600 border text-xs font-semibold px-2 py-1"
                                        >
                                            High Priority
                                        </Badge>
                                    </CardTitle>
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-medium text-slate-500 mb-2">
                                    Blood Types Needed
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    O-, AB+, AB-
                                </div>
                            </div>
                        </CardHeader>
            
                        <CardContent className="px-6 pb-6">
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                                    <Clock className="h-4 w-4 text-blue-600" />
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">
                                            6 days
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            Time Left
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                                    <Users className="h-4 w-4 text-emerald-600" />
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">
                                            6/10
                                        </div>
                                        <div className="text-xs text-slate-500">Donors</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                                    <Calendar className="h-4 w-4 text-purple-600" />
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">
                                            6/10/2025
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            Start Date
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                                    <Calendar className="h-4 w-4 text-amber-600" />
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">
                                            10/10/2025
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            End Date
                                        </div>
                                    </div>
                                </div>
                            </div>
            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-slate-700">
                                        Progress
                                    </span>
                                    <span className="text-sm font-bold text-slate-900">
                                        {17}%
                                    </span>
                                </div>
                                <Progress
                                    value={17}
                                    className="h-2 bg-slate-200 rounded-full [&>div]:bg-rose-500"
                                />
                                <div className="text-xs text-slate-500 font-medium">
                                    5 more
                                    donors needed
                                </div>
                            </div>
            
                            <div className="space-y-2">
                                <Button className="w-full h-10 font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/25 transition-all duration-200">
                                    Apply Now
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full h-9 border-slate-200 hover:bg-slate-50 rounded-xl"
                                >
                                    View Details
                                    <ChevronRight className="h-3 w-3 ml-1" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    </div>
                </div>
              </motion.div>
            </section>
          );
        }
            {/* <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                  rotateY: { duration: 0.6 },
                }}
                className="absolute inset-0"
              >

                  <div className="relative h-full bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/[0.15] p-8 md:p-12 overflow-hidden group">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-red-500/[0.12] via-red-400/[0.08] to-red-600/[0.12] rounded-3xl"
                      animate={{
                        backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                      }}
                      transition={{
                        duration: 15,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      style={{
                        backgroundSize: "300% 300%",
                      }}
                    />

                    <motion.div
                      className="absolute top-8 right-8 opacity-20"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Droplets className="w-16 h-16 text-red-400" />
                    </motion.div>

                    <div className="relative z-10 h-full flex flex-col md:flex-row items-center gap-8">
                      <div className="flex-shrink-0 text-center md:text-left">
                        <motion.div className="relative mb-6" whileHover={{ scale: 1.05 }}>
                          <div className="w-32 h-32 mx-auto md:mx-0 rounded-full overflow-hidden border-4 border-red-400/30 relative">
                            <img
                              src={"/placeholder.svg"}
                              alt="patientName"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </motion.div>

                        <div
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold mb-4 text-red-400 bg-red-500/20 border-red-500/30"
                        >
                          <Clock className="w-4 h-4" />
                          High Urgency
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="mb-6">
                          <h3 className="text-3xl font-bold text-white mb-2">
                            AB, 46
                          </h3>
                          <div className="flex flex-wrap gap-4 text-white/80">
                            <div className="flex items-center gap-2">
                              <Droplets className="w-5 h-5 text-red-400" />
                              <span className="font-bold text-xl text-red-300">O-</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <div className="bg-white/[0.05] rounded-lg p-4 border border-white/[0.1]">
                            <p className="text-white/60 text-sm">Units Needed</p>
                            <p className="text-2xl font-bold text-white">450ml</p>
                          </div>
                        </div>

                        <p className="text-lg text-white/90 mb-6 italic">"Car accident"</p>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <motion.button
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Heart className="w-5 h-5" />
                            Donate Now
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
              </motion.div>
            </AnimatePresence>
          </div>

            <div className="flex justify-center items-center gap-6 mt-8">
              <motion.button
                onClick={prevTestimonial}
                className="p-3 rounded-full bg-white/[0.08] border border-white/[0.15] backdrop-blur-sm text-white hover:bg-white/[0.15] transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>

              <div className="flex gap-3">
                {urgentRequests.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1)
                      setCurrentIndex(index)
                    }}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentIndex ? "bg-red-400 scale-125" : "bg-white/30 hover:bg-white/50"
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>

              <motion.button
                onClick={nextTestimonial}
                className="p-3 rounded-full bg-white/[0.08] border border-white/[0.15] backdrop-blur-sm text-white hover:bg-white/[0.15] transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.button */
