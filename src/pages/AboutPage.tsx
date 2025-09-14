import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Sparkles, Users, Target, Mail, Github, Linkedin, ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { motion } from 'framer-motion';
import { Particles } from '@/components/Particles';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  social: {
    linkedin: string;
    github: string;
    email: string;
  };
}

interface Feature {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Harsh Rathod',
    role: 'Team Lead and Developer',
    image: '/Harsh.jpg',
    bio: 'Leads the Verifai project with expertise in full-stack development, architecting frontend and backend systems.',
    social: {
      linkedin: 'https://www.linkedin.com/in/harsh-rathod-2591b0292/',
      github: 'https://github.com/panduthegang',
      email: 'mailto:panduthegang@gmail.com'
    }
  },
  {
    name: 'Saurabh Patel',
    role: 'Data Analyst',
    image: '/Saurabh.jpg', 
    bio: 'Ensures data quality and generates insightful reports.',
    social: {
      linkedin: 'https://www.linkedin.com/in/saurabh-patel-8b0526249/',
      github: 'https://github.com/18-saurabh',
      email: 'mailto:saurabh4589@gmail.com'
    }
  }
];


const features: Feature[] = [
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

const cardVariants = {
  hidden: (i: number) => ({
    opacity: 0,
    x: i % 2 === 0 ? -50 : 50,
    y: 20
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    y: -10,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

const socialButtonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.1 },
  tap: { scale: 0.95 }
};

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
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16">
          <div className="flex items-center justify-between h-full">
            <Button variant="ghost" asChild>
              <Link to="/home-page" className="flex items-center gap-2">
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
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
  Empowering Truth in the Digital Age
</h1>

              <p className="text-lg sm:text-xl text-muted-foreground mb-8 ">
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
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 h-full shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

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
  Verifai was born out of a shared mission to counter the growing impact of misinformation in the digital age. Our team of developers, designers, and AI enthusiasts came together with a vision to build a reliable, easy-to-use platform that helps people verify the authenticity of online content.
</p>
<p className="text-muted-foreground leading-relaxed">
  By combining the power of machine learning, natural language processing, and carefully selected APIs, we’ve created a system that can detect credibility signals, uncover bias, and highlight factual inconsistencies. We’re committed to making information verification smarter, faster, and more accessible for everyone.
</p>

              </div>
            </motion.div>
          </div>
        </section>

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
            
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 h-full shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="relative mb-6">
                      <div className="aspect-square overflow-hidden rounded-2xl">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                    </div>
                    <h4 className="text-xl font-semibold mb-1">{member.name}</h4>
                    <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{member.bio}</p>
                    <div className="flex justify-center gap-4">
                      <motion.div variants={socialButtonVariants} whileHover="hover" whileTap="tap">
                        <Button variant="ghost" size="icon" className="hover:text-primary" asChild>
                          <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4" />
                          </a>
                        </Button>
                      </motion.div>
                      <motion.div variants={socialButtonVariants} whileHover="hover" whileTap="tap">
                        <Button variant="ghost" size="icon" className="hover:text-primary" asChild>
                          <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        </Button>
                      </motion.div>
                      <motion.div variants={socialButtonVariants} whileHover="hover" whileTap="tap">
                        <Button variant="ghost" size="icon" className="hover:text-primary" asChild>
                          <a href={member.social.email}>
                            <Mail className="w-4 h-4" />
                          </a>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
              </div>
            </div>
          </div>
        </section>

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