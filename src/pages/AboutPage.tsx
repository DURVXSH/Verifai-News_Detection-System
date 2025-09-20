//AboutPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Sparkles, Users, Target, Mail, Github, Linkedin, ArrowLeft, Zap, Trophy, Award, Heart } from 'lucide-react';
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

interface Achievement {
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
}

interface Certificate {
  image: string;
  title: string;
  recipient: string;
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
    name: 'Durvesh Shelar',
    role: 'UI/UX Designer',
    image: '/Durvesh.jpg', 
    bio: 'Crafts intuitive and responsive interfaces.',
    social: {
      linkedin: 'https://www.linkedin.com/in/saachi-desai-09621a320/',
      github: 'https://github.com/',
      email: 'mailto:durveshshelar@gmail.com'
    }
  },
  {
    name: 'Rudrapratap Singh',
    role: 'Research and AI Specialist',
    image: '/Rudra.jpg', 
    bio: 'Focuses on implementing AI models, training datasets, and improving detection accuracy for misinformation analysis.',
    social: {
      linkedin: 'https://www.linkedin.com/in/rudrapratap-singh-123456789/',
      github: 'https://github.com/rudrapratap-singh',
      email: 'mailto:rudra07032004@gmail.com'
    }
  }
];

const achievements: Achievement[] = [
  {
    icon: Trophy,
    title: 'GDG Hackathon Winner',
    description: 'Our team won the prestigious GDG Hackathon held on June 10-11, 2024, in Mumbai, India – an intense 24-hour event focused on innovative AI solutions against misinformation.'
  },
  {
    icon: Award,
    title: 'Suprathon Hackathon First Runner-Up',
    description: 'Secured first runner-up position at Suprathon Hackathon held on July 18-20, 2025, online – a challenging 36-hour virtual event, recognized for technical excellence and impact.'
  }
];

const certificates: Certificate[] = [
  {
    image: '/Harsh-CCD.jpg',
    title: 'GDG Hackathon Winner Certificate',
    recipient: 'Harsh Rathod',
    description: 'Awarded for leading the development of VerifAI, the top project in AI-driven fact-checking innovation at the GDG Hackathon.'
  },
  {
    image: '/Durvesh-CCD.png',
    title: 'GDG Hackathon Winner Certificate',
    recipient: 'Durvesh Shelar',
    description: 'Recognized for exceptional UI/UX design contributions to VerifAI at the GDG Hackathon.'
  },
  {
    image: '/Rudra-CCD.png',
    title: 'GDG Hackathon Winner Certificate',
    recipient: 'Rudrapratap Singh',
    description: 'Honored for AI research and implementation in VerifAI at the GDG Hackathon.'
  },
  {
    image: '/Harsh-Suprathon.png',
    title: 'Suprathon Hackathon First Runner-Up Certificate',
    recipient: 'Harsh Rathod',
    description: 'Awarded for outstanding full-stack development in VerifAI at Suprathon Hackathon.'
  },
  {
    image: '/Durvesh-Suprathon.png',
    title: 'Suprathon Hackathon First Runner-Up Certificate',
    recipient: 'Durvesh Shelar',
    description: 'Praised for innovative design that enhanced user experience in VerifAI at Suprathon Hackathon.'
  },
  {
    image: '/Rudra-Suprathon.png',
    title: 'Suprathon Hackathon First Runner-Up Certificate',
    recipient: 'Rudrapratap Singh',
    description: 'Recognized for advanced AI modeling in combating misinformation with VerifAI at Suprathon Hackathon.'
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

        <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container px-4 mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Our Achievements</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Celebrating milestones that highlight our commitment to innovation and excellence.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover="hover"
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 h-full shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                      <achievement.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold">{achievement.title}</h3>
                    <p className="text-muted-foreground">{achievement.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container px-4 mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Our Certificates</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Showcasing our team's accomplishments in a creative gallery of achievements.
              </p>
            </motion.div>
            <div className="space-y-12">
              {certificates.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${index % 2 === 0 ? '' : 'lg:grid-flow-row-dense lg:grid-cols-2'}`}
                >
                  <div className={`order-2 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'} space-y-4`}>
                    <h3 className="text-2xl font-bold text-primary">{cert.title}</h3>
                    <p className="text-lg font-semibold text-foreground">Recipient: {cert.recipient}</p>
                    <p className="text-muted-foreground leading-relaxed">{cert.description}</p>
                  </div>
                  <div className={`order-1 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02, rotate: 1 }}
                      className="relative group"
                    >
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full max-w-md mx-auto rounded-2xl shadow-xl border border-border group-hover:shadow-2xl transition-all duration-300 object-contain"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 flex items-end p-4">
                        <span className="text-white font-semibold bg-primary/80 px-3 py-1 rounded-lg">View Certificate</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-secondary/20 to-transparent">
          <div className="container px-4 mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-8">
                <Heart className="h-8 w-8 text-primary animate-pulse" />
              </div>
              <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Acknowledgments
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                With heartfelt gratitude, we honor the mentors who have been the cornerstone of our journey, providing wisdom, inspiration, and unwavering support.
              </p>
              <motion.div 
                className="bg-card border border-border rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                whileHover={{ scale: 1.01 }}
              >
                <p className="text-muted-foreground italic leading-relaxed text-lg">
                  We extend our deepest gratitude to <strong>Ms. Niki Modi</strong> and <strong>Mrs. Swati Mude</strong> for their exceptional mentorship. Their insightful guidance, technical expertise, and relentless encouragement have been pivotal in shaping VerifAI into a powerful tool against misinformation. Their belief in our vision has inspired us to push boundaries and achieve excellence.
                </p>
              </motion.div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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