import React from 'react';
import { Brain, Sparkles, Users, Target, Mail, Github, Linkedin } from 'lucide-react';
import { Button } from './ui/button';

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
  },
];

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">About Verifai</h2>
          <p className="text-lg text-muted-foreground">
            Empowering truth in the digital age through advanced AI-powered fact-checking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
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
          ].map((item, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mb-20">
          <h3 className="text-2xl font-bold text-center mb-8">Our Story</h3>
          <div className="bg-card border border-border rounded-xl p-8">
            <p className="text-muted-foreground leading-relaxed mb-6">
              Verifai was born from a shared concern about the rapid spread of misinformation in today's digital landscape. Our team of AI specialists, developers, and designers came together with a common goal: to create a powerful yet accessible tool that helps people verify information quickly and accurately.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Using Google's advanced Gemini AI technology, we've developed a sophisticated system that analyzes content across multiple dimensions - from factual accuracy to bias detection. Our commitment to transparency and accuracy drives us to continuously improve and adapt our technology to meet the evolving challenges of digital misinformation.
            </p>
          </div>
        </div>

        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center mb-12">Meet Our Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h4 className="text-lg font-semibold mb-1">{member.name}</h4>
                <p className="text-sm text-muted-foreground mb-4">{member.role}</p>
                <div className="flex justify-center gap-4">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={member.social.email}>
                      <Mail className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
          <p className="text-muted-foreground mb-8">
            Have questions or suggestions? We'd love to hear from you!
          </p>
          <Button asChild size="lg">
            <a href="mailto:contact@verifai.ai">
              <Mail className="w-4 h-4 mr-2" />
              Contact Us
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};