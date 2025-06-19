"use client"

import { motion } from "framer-motion"
import { Heart, Users, Clock, Shield, MapPin, Phone, Droplets, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Component() {
  const features = [
    {
      icon: Heart,
      title: "Save Lives",
      description: "Every donation can save up to 3 lives. Be a hero in someone's story by donating blood regularly.",
      gradient: "from-red-600 to-red-800",
    },
    {
      icon: Users,
      title: "Community Network",
      description: "Connect with a network of donors and recipients. Build a community that cares for each other.",
      gradient: "from-blue-600 to-blue-800",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Emergency blood requests and donor matching available round the clock for critical situations.",
      gradient: "from-purple-600 to-purple-800",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "All donations follow strict medical protocols ensuring safety for both donors and recipients.",
      gradient: "from-green-600 to-green-800",
    },
    {
      icon: MapPin,
      title: "Location Tracking",
      description: "Find nearby blood banks, donation centers, and track blood availability in real-time.",
      gradient: "from-orange-600 to-orange-800",
    },
    {
      icon: Phone,
      title: "Emergency Response",
      description: "Instant notifications for urgent blood requirements with quick donor mobilization system.",
      gradient: "from-pink-600 to-pink-800",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.8,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 50,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-red-500/10 to-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 40,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-red-500/10 rounded-full blur-3xl"
        />

        {/* Floating Droplets */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            className="absolute"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
            }}
          >
            <Droplets className="w-4 h-4 text-red-400/30" />
          </motion.div>
        ))}
      </div>

      <section className="relative w-full py-16 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={headerVariants}
            className="flex flex-col items-center justify-center space-y-6 text-center mb-16"
          >
            <motion.div variants={floatingVariants} animate="animate">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600/20 to-blue-600/20 border border-red-500/30 px-4 py-2 text-sm backdrop-blur-sm">
                <Activity className="w-4 h-4 text-red-400" />
                <span className="text-red-100">About Our Mission</span>
              </div>
            </motion.div>

            <div className="space-y-4">
              <motion.h2
                variants={pulseVariants}
                animate="animate"
                className="text-4xl font-bold tracking-tighter sm:text-6xl bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
              >
                Connecting Hearts, Saving Lives
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="max-w-[900px] text-slate-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
              >
                Our blood donation system bridges the gap between generous donors and those in critical need. Through
                technology and compassion, we make blood donation accessible, efficient, and life-saving.
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 grid-cols-1"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    transition: { duration: 0.3 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="h-full bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20 group relative overflow-hidden">
                    {/* Animated gradient overlay */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                    />

                    <CardHeader className="text-center pb-4 relative z-10">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${feature.gradient} shadow-lg`}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <CardTitle className="text-xl text-slate-100 group-hover:text-white transition-colors duration-300">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center relative z-10">
                      <CardDescription className="text-base leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 1, delay: 0.6 },
              },
            }}
            className="mt-20 text-center"
          >
            <Card className="max-w-5xl mx-auto bg-gradient-to-br from-red-900/30 via-purple-900/30 to-blue-900/30 border border-red-500/30 backdrop-blur-sm relative overflow-hidden">
              {/* Animated background pattern */}

              <CardContent className="p-10 relative z-10">
                <motion.div className="flex items-center justify-center mb-6">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <Heart className="h-10 w-10 text-red-400 mr-4" fill="currentColor" />
                  </motion.div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent">
                    Join Our Life-Saving Mission
                  </h3>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-slate-300 mb-8 leading-relaxed"
                >
                  Every 2 seconds, someone needs blood. Your donation can be the difference between life and death. Join
                  thousands of heroes who have already made a commitment to save lives.
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  {[
                    { number: "10,000+", label: "Lives Saved", color: "from-red-400 to-red-600" },
                    { number: "5,000+", label: "Active Donors", color: "from-purple-400 to-purple-600" },
                    { number: "24/7", label: "Emergency Support", color: "from-blue-400 to-blue-600" },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 * index, duration: 0.6 }}
                      className="group"
                    >
                      <motion.div
                        animate={{
                          textShadow: [
                            "0 0 10px rgba(239, 68, 68, 0.5)",
                            "0 0 20px rgba(59, 130, 246, 0.5)",
                            "0 0 10px rgba(239, 68, 68, 0.5)",
                          ],
                        }}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                        className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}
                      >
                        {stat.number}
                      </motion.div>
                      <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300 mt-2">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
