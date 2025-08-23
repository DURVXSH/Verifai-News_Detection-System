import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Search, Sparkles, AlertTriangle, Info, ArrowRight, Brain, Zap, CheckCircle, FileText, Globe, Twitter, Linkedin, Github, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Particles } from '@/components/Particles';

const features = [
  {
    icon: Brain,
    title: "Smart Analysis",
    description: "Advanced AI algorithms detect patterns and analyze content credibility in seconds",
    color: "from-blue-500/20 to-blue-600/20"
  },
  {
    icon: Shield,
    title: "Fact Verification",
    description: "Cross-reference content with trusted sources and databases in real-time",
    color: "from-green-500/20 to-green-600/20"
  },
  {
    icon: CheckCircle,
    title: "Credibility Score",
    description: "Get instant credibility ratings based on multiple verification factors",
    color: "from-purple-500/20 to-purple-600/20"
  },
  {
    icon: FileText,
    title: "Detailed Reports",
    description: "Generate comprehensive analysis reports with actionable insights",
    color: "from-orange-500/20 to-orange-600/20"
  }
];

const stats = [
 { value: "99%", label: "Accuracy Rate" },
  { value: "50+", label: "Data Sources" },
  { value: "<2s", label: "Analysis Time" },
  { value: "24/7", label: "Availability" }
];

const exampleArticles = [
  {
    title: "Breaking: Miracle Cure Found!",
    text: "Scientists have discovered a revolutionary cure that treats all diseases overnight with just one pill...",
    type: "Health Misinformation",
    warning: "Unrealistic claims and lack of scientific evidence",
    category: "Medical"
  },
  {
    title: "Shocking Political Scandal Revealed",
    text: "Anonymous sources claim high-ranking officials involved in secret underground meetings to control world events...",
    type: "Political Disinformation",
    warning: "Unverified sources and sensational language",
    category: "Politics"
  },
  {
    title: "5G Towers Cause Unusual Phenomena",
    text: "Residents report strange occurrences near newly installed 5G towers, claiming mysterious health effects...",
    type: "Technology Myths",
    warning: "Correlation without causation, fear-mongering",
    category: "Technology"
  },
  {
    title: "Climate Change Hoax Exposed",
    text: "Secret documents reveal that global warming data has been manipulated by scientists for decades...",
    type: "Environmental Misinformation",
    warning: "Cherry-picked data and conspiracy theories",
    category: "Environment"
  },
  {
    title: "Financial Market Manipulation Alert",
    text: "Inside sources predict massive market crash next week, urging immediate asset liquidation...",
    type: "Financial Scams",
    warning: "Market manipulation and urgency tactics",
    category: "Finance"
  },
  {
    title: "Celebrity Death Conspiracy",
    text: "Famous celebrity reportedly seen alive despite official death announcement, suggesting elaborate cover-up...",
    type: "Celebrity Hoaxes",
    warning: "Unverified claims and sensationalism",
    category: "Entertainment"
  },
  {
    title: "Vaccine Microchip Implementation",
    text: "New evidence suggests vaccines contain tracking devices for population surveillance...",
    type: "Medical Conspiracy",
    warning: "Baseless conspiracy theories and fear tactics",
    category: "Medical"
  },
  {
    title: "Ancient Civilization Discovery",
    text: "Amateur archaeologist finds proof of advanced alien civilization buried beneath popular tourist site...",
    type: "Pseudoscience",
    warning: "Lack of scientific verification and extraordinary claims",
    category: "Science"
  },
  {
    title: "Election Fraud Evidence Emerges",
    text: "Social media users share 'proof' of widespread voting irregularities using manipulated videos...",
    type: "Electoral Misinformation",
    warning: "Doctored evidence and false narratives",
    category: "Politics"
  }
];

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Case Studies", href: "#case-studies" }
  ],
  resources: [
    { label: "Documentation", href: "#docs" },
    { label: "API Reference", href: "#api" },
    { label: "Blog", href: "#blog" },
    { label: "Research", href: "#research" }
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "#careers" },
    { label: "Press Kit", href: "#press" },
    { label: "Contact", href: "#contact" }
  ],
  legal: [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "Cookie Policy", href: "#cookies" },
    { label: "Security", href: "#security" }
  ]
};

interface LandingPageProps {
  onStartAnalyzing?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAnalyzing }) => {
  const navigate = useNavigate();

  const handleStartAnalyzing = () => {
    navigate('/signin');
  };

  const startAnalyzingHandler = onStartAnalyzing || handleStartAnalyzing;

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

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-background to-primary/5">
      <Particles />
      
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-8"
            >
              <Shield className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">
                AI-Powered Truth Detection
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-6xl sm:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60"
            >
              Detect Fake News
              <br />
              in Seconds
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
            >
              Our advanced AI analyzes content in real-time, helping you make informed decisions
              about what to trust online.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4 mb-16"
            >
              <Button
                size="lg"
                className="h-12 px-8 text-lg relative overflow-hidden group"
                onClick={startAnalyzingHandler}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                Start Analyzing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-lg"
                asChild
              >
                <Link to="/about">
                  <Info className="mr-2 h-5 w-5" />
                  Learn More
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold mb-4"
            >
              Powerful Features
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground"
            >
              Everything you need to verify content authenticity
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 h-full">
                  <feature.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">
                Common Types of Misinformation
              </h2>
              <p className="text-lg text-muted-foreground">
                Learn to identify suspicious content patterns across different domains
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {exampleArticles.map((article, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-destructive/5 border border-destructive/20 rounded-xl p-6 hover:bg-destructive/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                    <span className="text-xs font-medium text-muted-foreground bg-background/50 backdrop-blur-sm px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2">{article.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{article.text}</p>
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-full">
                      {article.type}
                    </span>
                    <p className="text-xs text-destructive mt-2">
                      Warning: {article.warning}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-t from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold mb-4"
            >
              Start Verifying Content Today
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground mb-8"
            >
              Join thousands of users who trust our AI to detect fake news
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button
                size="lg"
                className="h-12 px-8 text-lg relative overflow-hidden group"
                onClick={startAnalyzingHandler}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                Try It Now
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border/40 bg-gradient-to-b from-background to-primary/5 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">Verifai</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Empowering truth in the digital age through AI-powered content verification.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="hover:text-primary" asChild>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-primary" asChild>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-primary" asChild>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-primary" asChild>
                  <a href="mailto:contact@verifai.ai">
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-border/40">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Verifai. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  English (US)
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};