import React from 'react';
import { Particles } from '@/components/Particles';
import { Link } from 'react-router-dom';
import { Brain, Sparkles, Users, Target, Mail, Github, Linkedin, ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { motion } from 'framer-motion';

const teamMembers = [
  {
    name: 'Alex Chen',
    role: 'AI Engineer & Team Lead',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=200&h=200',
    social: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      email: 'mailto:alex@verifai.ai'
    }
  },
  {
    name: 'Sarah Miller',
    role: 'UI/UX Designer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
    social: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      email: 'mailto:sarah@verifai.ai'
    }
  },
  {
    name: 'David Park',
    role: 'Full Stack Developer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
    social: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      email: 'mailto:david@verifai.ai'
    }
  }
];

const features = [
  {
    icon: Brain,
    title: 'Our Mission',
    description: 'To combat misinformation and promote truth through innovative AI technology'
  },
  {
    icon: Target,
    title: 'Our Vision',
    description: 'A world where everyone can easily verify information and make informed decisions'
  },
  {
    icon: Sparkles,
    title: 'Innovation',
    description: 'Leveraging cutting-edge AI and machine learning for accurate content analysis'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Building a global community committed to fighting misinformation'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Animation variants for the jumping text
const jumpingText = {
  initial: { y: 0 },
  animate: {
    y: [-2, 2, -2],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const letterContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.2
    }
  }
};

const letter = {
  initial: { y: 20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

export const AboutPage: React.FC = () => {
  const text = "AI-Powered Truth Detection";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 dark:from-background dark:to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16">
          <div className="flex items-center justify-between h-full">
            <Button variant="ghost" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Analysis
              </Link>
            </Button>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <a href="mailto:contact@verifai.ai" className="hidden sm:flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Us
                </a>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32 bg-gradient-to-b from-primary/5 to-transparent">
          <Particles />
          <div className="container px-4 mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.div 
                className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-8"
                variants={jumpingText}
                initial="initial"
                animate="animate"
              >
                <Zap className="h-5 w-5 text-primary mr-2" />
                <motion.div
                  variants={letterContainer}
                  initial="initial"
                  animate="animate"
                  className="text-sm font-medium text-primary"
                >
                  {text.split('').map((char, index) => (
                    <motion.span
                      key={index}
                      variants={letter}
                      className="inline-block"
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Empowering Truth in the Digital Age 
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8">
                Using advanced AI technology to combat misinformation and help people make informed decisions.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link to="/">Try it Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="https://github.com/yourusername/verifai" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-background to-secondary/20 p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-gradient-to-b from-secondary/20 to-transparent">
          <div className="container px-4 mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
              <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Verifai was born from a shared concern about the rapid spread of misinformation in today's digital landscape. Our team of AI specialists, developers, and designers came together with a common goal: to create a powerful yet accessible tool that helps people verify information quickly and accurately.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Using Google's advanced Gemini AI technology, we've developed a sophisticated system that analyzes content across multiple dimensions - from factual accuracy to bias detection. Our commitment to transparency and accuracy drives us to continuously improve and adapt our technology to meet the evolving challenges of digital misinformation.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground">
                The passionate minds behind Verifai
              </p>
            </motion.div>
            
            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="group relative overflow-hidden rounded-2xl bg-card p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50"
                >
                  <div className="relative mb-6">
                    <div className="aspect-square overflow-hidden rounded-2xl">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold mb-1">{member.name}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{member.role}</p>
                  <div className="flex justify-center gap-4">
                    <Button variant="ghost" size="icon" className="hover:text-primary" asChild>
                      <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-primary" asChild>
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-primary" asChild>
                      <a href={member.social.email}>
                        <Mail className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-t from-primary/5 to-transparent">
          <div className="container px-4 mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join us in the fight against misinformation and start verifying content today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link to="/">Try Verifai Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="mailto:contact@verifai.ai">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Us
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-semibold">Verifai</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Verifai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};