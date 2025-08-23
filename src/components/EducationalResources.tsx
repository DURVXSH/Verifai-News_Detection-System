import React from 'react';
import { BookOpen, AlertTriangle, Brain, Share2 } from 'lucide-react';

export const EducationalResources = () => {
  const resources = [
    {
      title: "Common Signs of Fake News",
      icon: AlertTriangle,
      items: [
        "Sensational or clickbait headlines",
        "Poor spelling and grammar",
        "Lack of credible sources",
        "Emotional manipulation",
        "Unverified claims"
      ]
    },
    {
      title: "Fact-Checking Tips",
      icon: Brain,
      items: [
        "Verify the source's credibility",
        "Cross-reference with other sources",
        "Check publication dates",
        "Look for original sources",
        "Consider expert opinions"
      ]
    },
    {
      title: "Reliable Sources",
      icon: BookOpen,
      items: [
        "Academic journals",
        "Established news organizations",
        "Government websites (.gov)",
        "Educational institutions (.edu)",
        "Fact-checking websites"
      ]
    },
    {
      title: "Sharing Responsibly",
      icon: Share2,
      items: [
        "Verify before sharing",
        "Include source citations",
        "Acknowledge uncertainties",
        "Correct misinformation",
        "Encourage fact-checking"
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {resources.map((resource, index) => (
        <div key={index} className="bg-card rounded-lg p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <resource.icon className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">{resource.title}</h3>
          </div>
          <ul className="space-y-2">
            {resource.items.map((item, itemIndex) => (
              <li key={itemIndex} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};