import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  AlertTriangle, 
  Brain, 
  Share2, 
  BookOpen, 
  Search, 
  FileText, 
  Link2, 
  Shield, 
  Eye, 
  MessageSquare, 
  BarChart2, 
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const EducationalResources = () => {
  const { i18n } = useTranslation();

  const resources = [
    {
      title: i18n.language === 'hi' ? "सामग्री विश्लेषण गाइड" : "Content Analysis Guide",
      icon: Brain,
      items: [
        {
          heading: i18n.language === 'hi' ? "चरण 1: सामग्री इनपुट" : "Step 1: Input Content",
          details: i18n.language === 'hi' ? [
            "विश्लेषण करने के लिए टेक्स्ट पेस्ट करें",
            "लेख, सोशल मीडिया पोस्ट और समाचार सामग्री के लिए समर्थन",
            "लंबी सामग्री अधिक सटीक विश्लेषण प्रदान करती है",
            "मूल स्रोत लिंक की सिफारिश की जाती है"
          ] : [
            "Paste the text you want to analyze",
            "Support for articles, social media posts, and news content",
            "Longer content provides more accurate analysis",
            "Original source links are recommended"
          ]
        },
        {
          heading: i18n.language === 'hi' ? "चरण 2: परिणाम समीक्षा" : "Step 2: Review Results",
          details: i18n.language === 'hi' ? [
            "समग्र विश्वसनीयता स्कोर की जांच करें",
            "विशिष्ट चेतावनियों और सुझावों की समीक्षा करें",
            "स्रोत सत्यापन विवरण की जांच करें",
            "एआई-जनित अंतर्दृष्टि पर विचार करें"
          ] : [
            "Check the overall credibility score",
            "Review specific warnings and suggestions",
            "Examine source verification details",
            "Consider AI-generated insights"
          ]
        },
        {
          heading: i18n.language === 'hi' ? "चरण 3: कार्रवाई करें" : "Step 3: Take Action",
          details: i18n.language === 'hi' ? [
            "दूसरों के साथ विश्लेषण परिणाम साझा करें",
            "विभिन्न प्रारूपों में विस्तृत रिपोर्ट निर्यात करें",
            "भविष्य के संदर्भ के लिए विश्लेषण सहेजें",
            "सामग्री के कई संस्करणों की तुलना करें"
          ] : [
            "Share analysis results with others",
            "Export detailed reports in various formats",
            "Save analyses for future reference",
            "Compare multiple versions of content"
          ]
        }
      ]
    },
    {
      title: i18n.language === 'hi' ? "सत्यापन तकनीकें" : "Verification Techniques",
      icon: Shield,
      items: [
        {
          heading: i18n.language === 'hi' ? "स्रोत विश्लेषण" : "Source Analysis",
          details: i18n.language === 'hi' ? [
            "लेखक की क्रेडेंशियल और विशेषज्ञता की जांच करें",
            "प्रकाशन तिथि और अपडेट सत्यापित करें",
            "विश्वसनीय स्रोतों के साथ क्रॉस-रेफरेंस करें",
            "स्रोत की प्रतिष्ठा और इतिहास का मूल्यांकन करें"
          ] : [
            "Check author credentials and expertise",
            "Verify publication date and updates",
            "Cross-reference with trusted sources",
            "Evaluate source reputation and history"
          ]
        },
        {
          heading: i18n.language === 'hi' ? "सामग्री मूल्यांकन" : "Content Evaluation",
          details: i18n.language === 'hi' ? [
            "भावनात्मक हेरफेर रणनीतियों की तलाश करें",
            "तार्किक गलतियों की जांच करें",
            "सांख्यिकीय दावों और डेटा को सत्यापित करें",
            "हित के संभावित टकराव की पहचान करें"
          ] : [
            "Look for emotional manipulation tactics",
            "Check for logical fallacies",
            "Verify statistical claims and data",
            "Identify potential conflicts of interest"
          ]
        },
        {
          heading: i18n.language === 'hi' ? "तकनीकी सत्यापन" : "Technical Verification",
          details: i18n.language === 'hi' ? [
            "दृश्यों के लिए रिवर्स इमेज सर्च का उपयोग करें",
            "URL प्रामाणिकता की जांच करें",
            "उद्धृत स्रोतों और संदर्भों को सत्यापित करें",
            "उपलब्ध होने पर मेटाडेटा की जांच करें"
          ] : [
            "Use reverse image search for visuals",
            "Check URL authenticity",
            "Verify quoted sources and citations",
            "Examine metadata when available"
          ]
        }
      ]
    },
    {
      title: i18n.language === 'hi' ? "रेड फ्लैग और चेतावनी संकेत" : "Red Flags & Warning Signs",
      icon: AlertTriangle,
      items: [
        {
          heading: i18n.language === 'hi' ? "भाषा पैटर्न" : "Language Patterns",
          details: i18n.language === 'hi' ? [
            "भावनात्मक भाषा का अत्यधिक उपयोग",
            "तत्कालीनता या दबाव की रणनीतियां",
            "बिना सबूत के निरपेक्ष दावे",
            "जटिल मुद्दों का अति-सरलीकरण"
          ] : [
            "Excessive use of emotional language",
            "Urgency or pressure tactics",
            "Absolute claims without evidence",
            "Oversimplification of complex issues"
          ]
        },
        {
          heading: i18n.language === 'hi' ? "सामग्री समस्याएं" : "Content Issues",
          details: i18n.language === 'hi' ? [
            "गुम या अनाम स्रोत",
            "पुरानी या हेरफेर की गई जानकारी",
            "षड्यंत्र सिद्धांत कथानक",
            "असत्यापनीय दावे या भविष्यवाणियां"
          ] : [
            "Missing or anonymous sources",
            "Outdated or manipulated information",
            "Conspiracy theory narratives",
            "Unverifiable claims or predictions"
          ]
        },
        {
          heading: i18n.language === 'hi' ? "प्रस्तुति चिंताएं" : "Presentation Concerns",
          details: i18n.language === 'hi' ? [
            "क्लिकबेट शीर्षक",
            "भ्रामक छवियां या कैप्शन",
            "खराब व्याकरण या फॉर्मेटिंग",
            "संदिग्ध वेबसाइट विशेषताएं"
          ] : [
            "Clickbait headlines",
            "Misleading images or captions",
            "Poor grammar or formatting",
            "Suspicious website characteristics"
          ]
        }
      ]
    },
    {
      title: i18n.language === 'hi' ? "सर्वोत्तम प्रथाएं" : "Best Practices",
      icon: CheckCircle,
      items: [
        {
          heading: i18n.language === 'hi' ? "साझा करने से पहले" : "Before Sharing",
          details: i18n.language === 'hi' ? [
            "कई स्रोतों के साथ दावों को सत्यापित करें",
            "प्रकाशन तिथियों और संदर्भ की जांच करें",
            "शीर्षकों से आगे पढ़ें",
            "लेखक की विशेषज्ञता पर विचार करें"
          ] : [
            "Verify claims with multiple sources",
            "Check publication dates and context",
            "Read beyond headlines",
            "Consider author expertise"
          ]
        },
        {
          heading: i18n.language === 'hi' ? "हमारे टूल्स का उपयोग" : "Using Our Tools",
          details: i18n.language === 'hi' ? [
            "नियमित सामग्री निगरानी",
            "महत्वपूर्ण विश्लेषण सहेजें",
            "कई संस्करणों की तुलना करें",
            "विस्तृत रिपोर्ट निर्यात करें"
          ] : [
            "Regular content monitoring",
            "Save important analyses",
            "Compare multiple versions",
            "Export detailed reports"
          ]
        },
        {
          heading: i18n.language === 'hi' ? "जिम्मेदार साझाकरण" : "Responsible Sharing",
          details: i18n.language === 'hi' ? [
            "सत्यापन स्थिति शामिल करें",
            "जब आवश्यक हो संदर्भ जोड़ें",
            "गलत सूचना को तुरंत सुधारें",
            "विश्लेषण परिणाम साझा करें"
          ] : [
            "Include verification status",
            "Add context when needed",
            "Correct misinformation promptly",
            "Share analysis results"
          ]
        }
      ]
    }
  ];

  const features = [
    {
      icon: BarChart2,
      title: i18n.language === 'hi' ? "विश्वसनीयता स्कोरिंग" : "Credibility Scoring",
      description: i18n.language === 'hi' ? 
        "कई सत्यापन कारकों के आधार पर तत्काल विश्वसनीयता रेटिंग प्राप्त करें" :
        "Get instant credibility ratings based on multiple verification factors"
    },
    {
      icon: Brain,
      title: i18n.language === 'hi' ? "एआई विश्लेषण" : "AI Analysis",
      description: i18n.language === 'hi' ?
        "उन्नत एल्गोरिदम पैटर्न का पता लगाते हैं और सामग्री प्रामाणिकता का विश्लेषण करते हैं" :
        "Advanced algorithms detect patterns and analyze content authenticity"
    },
    {
      icon: Clock,
      title: i18n.language === 'hi' ? "रीयल-टाइम अपडेट" : "Real-time Updates",
      description: i18n.language === 'hi' ?
        "विकसित होती कहानियों के लिए निरंतर निगरानी और अपडेट" :
        "Continuous monitoring and updates for evolving stories"
    },
    {
      icon: FileText,
      title: i18n.language === 'hi' ? "विस्तृत रिपोर्ट" : "Detailed Reports",
      description: i18n.language === 'hi' ?
        "कार्रवाई योग्य अंतर्दृष्टि के साथ व्यापक विश्लेषण रिपोर्ट जनरेट करें" :
        "Generate comprehensive analysis reports with actionable insights"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Quick Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-primary/5 rounded-lg p-4 flex flex-col items-center text-center">
            <feature.icon className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium mb-1">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Detailed Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {resources.map((resource, index) => (
          <div key={index} className="bg-card rounded-lg p-6 shadow-lg border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <resource.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{resource.title}</h3>
            </div>
            
            <div className="space-y-6">
              {resource.items.map((item, itemIndex) => (
                <div key={itemIndex} className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {item.heading}
                  </h4>
                  <ul className="space-y-2">
                    {item.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Resources */}
      <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Link2 className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">
            {i18n.language === 'hi' ? "अतिरिक्त संसाधन" : "Additional Resources"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: i18n.language === 'hi' ? "तथ्य-जांच वेबसाइटें" : "Fact-Checking Websites",
              links: [
                { name: "Snopes", url: "https://www.snopes.com" },
                { name: "FactCheck.org", url: "https://www.factcheck.org" },
                { name: "PolitiFact", url: "https://www.politifact.com" }
              ]
            },
            {
              title: i18n.language === 'hi' ? "मीडिया साक्षरता" : "Media Literacy",
              links: [
                { name: i18n.language === 'hi' ? "मीडिया पक्षपात चार्ट" : "Media Bias Chart", url: "https://adfontesmedia.com" },
                { name: i18n.language === 'hi' ? "न्यूज़ साक्षरता प्रोजेक्ट" : "News Literacy Project", url: "https://newslit.org" },
                { name: i18n.language === 'hi' ? "कॉमन सेंस मीडिया" : "Common Sense Media", url: "https://www.commonsensemedia.org" }
              ]
            },
            {
              title: i18n.language === 'hi' ? "शोध उपकरण" : "Research Tools",
              links: [
                { name: "Google Scholar", url: "https://scholar.google.com" },
                { name: i18n.language === 'hi' ? "इंटरनेट आर्काइव" : "Internet Archive", url: "https://archive.org" },
                { name: i18n.language === 'hi' ? "शैक्षणिक खोज" : "Academic Search", url: "https://www.base-search.net" }
              ]
            }
          ].map((section, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-medium text-sm">{section.title}</h4>
              <ul className="space-y-1">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      {link.name}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};