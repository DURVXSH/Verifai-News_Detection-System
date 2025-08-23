import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Globe,
  HelpCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Define Message interface
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Language options
const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'mr', name: 'मराठी' }
];

// Team information with translations (no Markdown)
const TEAM_INFO = {
  en: `
Verifai Team Details:

1. Harsh Rathod (Team Lead and Developer): Leads the Verifai project with expertise in full-stack development, architecting frontend and backend systems for seamless integration and robust performance.
2. Pooja Purohit (Machine Learning Engineer): Designs and trains AI models for credibility scoring and misinformation detection, ensuring accurate and reliable analysis.
3. Saurabh Patel (Data Analyst): Ensures data quality and generates insightful reports, supporting Verifai's reporting features with clear, actionable insights.
4. Saachi Desai (UI/UX Designer): Crafts intuitive and responsive interfaces, enhancing user experience across devices.
`,
  hi: `
Verifai टीम विवरण:

1. हर्ष राठोड (टीम लीड और डेवलपर): पूर्ण-स्टैक विकास में विशेषज्ञता के साथ Verifai परियोजना का नेतृत्व करते हैं, फ्रंटएंड और बैकएंड सिस्टम को डिज़ाइन करते हैं ताकि निर्बाध एकीकरण और मजबूत प्रदर्शन सुनिश्चित हो।
2. पूजा पुरोहित (मशीन लर्निंग इंजीनियर): विश्वसनीयता स्कोरिंग और गलत सूचना पहचान के लिए AI मॉडल डिज़ाइन और प्रशिक्षित करती हैं, जिससे सटीक और विश्वसनीय विश्लेषण सुनिश्चित होता है।
3. सौरभ पटेल (डेटा विश्लेषक): डेटा गुणवत्ता सुनिश्चित करते हैं और व्यावहारिक रिपोर्ट तैयार करते हैं, Verifai की रिपोर्टिंग सुविधाओं को स्पष्ट और उपयोगी जानकारी के साथ समर्थन करते हैं।
4. साची देसाई (UI/UX डिज़ाइनर): सहज और उत्तरदायी इंटरफेस बनाती हैं, जो सभी डिवाइसों पर उपयोगकर्ता अनुभव को बेहतर बनाता है।
`,
  gu: `
Verifai ટીમ વિગતો:

1. હર્ષ રાઠોડ (ટીમ લીડ અને ડેવલપર): ફુલ-સ્ટેક ડેવલપમેન્ટમાં નિપુણતા સાથે Verifai પ્રોજેક્ટનું નેતૃત્વ કરે છે, ફ્રન્ટએન્ડ અને બેકએન્ડ સિસ્ટમ્સનું નિર્માણ કરે છે જેથી સીમલેસ એકીકરણ અને મજબૂત કામગીરી સુનિશ્ચિત થાય.
2. પૂજા પુરોહિત (મશીન લર્નિંગ એન્જિનિયર): વિશ્વસનીયતા સ્કોરિંગ અને ખોટી માહિતી શોધ માટે AI મોડેલો ડિઝાઇન અને તાલીમ આપે છે, જે સચોટ અને વિશ્વસનીય વિશ્લેષણની ખાતરી આપે છે.
3. સૌરભ પટેલ (ડેટા વિશ્લેષક): ડેટા ગુણવત્તા સુનિશ્ચિત કરે છે અને આંતરદૃષ્ટિપૂર્ણ રિપોર્ટ્સ તૈયાર કરે છે, Verifai ની રિપોર્ટિંગ સુવિધાઓને સ્પષ્ટ અને કાર્યક્ષમ આંતરદૃષ્ટિ સાથે સમર્થન આપે છે.
4. સાચી દેસાઈ (UI/UX ડિઝાઇનર): સાહજિક અને પ્રતિભાવાત્મક ઇન્ટરફેસ બનાવે છે, જે તમામ ઉપકરણો પર વપરાશકર્તા અનુભવને વધારે છે.
`,
  mr: `
Verifai टीम तपशील:

1. हर्ष राठोड (टीम लीड आणि डेव्हलपर): फुल-स्टॅक डेव्हलपमेंटमध्ये तज्ञतेसह Verifai प्रकल्पाचे नेतृत्व करतात, फ्रंटएंड आणि बॅकएंड सिस्टम्स डिझाइन करतात ज्यामुळे अखंड एकीकरण आणि मजबूत कामगिरी सुनिश्चित होते.
2. पूजा पुरोहित (मशीन लर्निंग इंजिनिअर): विश्वासार्हता स्कोअरिंग आणि चुकीच्या माहिती शोधण्यासाठी AI मॉडेल्स डिझाइन आणि प्रशिक्षित करतात, ज्यामुळे अचूक आणि विश्वासार्ह विश्लेषण सुनिश्चित होते.
3. सौरभ पटेल (डेटा विश्लेषक): डेटा गुणवत्ता सुनिश्चित करतात आणि अंतर्दृष्टीपूर्ण अहवाल तयार करतात, Verifai च्या अहवाल वैशिष्ट्यांना स्पष्ट आणि उपयुक्त अंतर्दृष्टींसह समर्थन देतात.
4. साची देसाई (UI/UX डिझायनर): अंतर्ज्ञानी आणि प्रतिसादात्मक इंटरफेस तयार करतात, ज्यामुळे सर्व डिव्हाइसेसवर वापरकर्ता अनुभव सुधारतो.
`
};

// Fake news spread information with translations
const FAKE_NEWS_SPREAD_INFO = {
  en: `
How Fake News Spreads:
Fake news often spreads through social media platforms, messaging apps, and unverified websites. It thrives due to sensational headlines, emotional manipulation, and rapid sharing by users. Verifai helps detect this by analyzing content credibility, cross-referencing with trusted sources, and providing credibility scores to identify misinformation.
`,
  hi: `
गलत समाचार कैसे फैलता है:
गलत समाचार अक्सर सोशल मीडिया प्लेटफॉर्म, मैसेजिंग ऐप्स और अनवेरिफाइड वेबसाइटों के माध्यम से फैलता है। यह सनसनीखेज शीर्षकों, भावनात्मक हेरफेर और उपयोगकर्ताओं द्वारा तेजी से साझा करने के कारण पनपता है। Verifai इसकी पहचान करने में मदद करता है, जो सामग्री की विश्वसनीयता का विश्लेषण करता है, विश्वसनीय स्रोतों के साथ क्रॉस-रेफरेंस करता है, और विश्वसनीयता स्कोर प्रदान करता है।
`,
  gu: `
ખોટી ખબર કેવી રીતે ફેલાય છે:
ખોટી ખબરો ઘણીવાર સોશિયલ મીડિયા પ્લેટફોર્મ, મેસેજિંગ એપ્સ અને અનવેરિફાઇડ વેબસાઈટ્સ દ્વારા ફેલાય છે. તે સનસનીખેજ હેડલાઈન્સ, ભાવનાત્મક હેરફેર અને યુઝર્સ દ્વારા ઝડપી શેરિંગને કારણે પ્રફુલ્લિત થાય છે. Verifai આનું શોધણ કરવામાં મદદ કરે છે, જે સામગ્રીની વિશ્વસનીયતાનું વિશ્લેષણ કરે છે, વિશ્વસનીય સ્રોતો સાથે ક્રોસ-રેફરન્સ કરે છે, અને વિશ્વસનીયતા સ્કોર પૂરો પાડે છે.
`,
  mr: `
खोट्या बातम्या कशा पसरतात:
खोट्या बातम्या अनेकदा सोशल मीडिया प्लॅटफॉर्म्स, मेसेजिंग अॅप्स आणि अनव्हेरिफाइड वेबसाइट्सद्वारे पसरतात. त्या सनसनीखेज मथळे, भावनिक हेरफेर आणि वापरकर्त्यांकडून जलद शेअरिंगमुळे वाढतात. Verifai हे ओळखण्यास मदत करते, जे सामग्रीच्या विश्वासार्हतेचे विश्लेषण करते, विश्वसनीय स्रोतांसह क्रॉस-रेफरन्स करते आणि विश्वासार्हता स्कोअर देते.
`
};

// Message Skeleton Component
const MessageSkeleton = () => (
  <div className="relative">
    <div className="absolute inset-0 bg-gradient-to-r from-background/10 via-background/50 to-background/10 animate-shimmer" />
    <div className="flex items-start gap-3 relative">
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded w-1/2 animate-pulse" />
        <div className="h-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded w-2/3 animate-pulse" />
      </div>
    </div>
  </div>
);

// Page-specific help content with translations
const PAGE_HELP = {
  '/dashboard': {
    en: {
      title: 'Content Analyzer',
      description: 'Analyze text content for credibility and misinformation.',
      tips: [
        'Paste your content in the text area',
        'Click "Analyze Content" to start analysis',
        'Review the detailed credibility report',
        'Use voice input for hands-free operation',
        'Compare multiple versions of content'
      ]
    },
    hi: {
      title: 'सामग्री विश्लेषक',
      description: 'विश्वसनीयता और गलत सूचना के लिए पाठ सामग्री का विश्लेषण करें।',
      tips: [
        'टेक्स्ट क्षेत्र में अपनी सामग्री चिपकाएं',
        'विश्लेषण शुरू करने के लिए "सामग्री विश्लेषण करें" पर क्लिक करें',
        'विस्तृत विश्वसनीयता रिपोर्ट की समीक्षा करें',
        'हैंड्स-फ्री ऑपरेशन के लिए वॉयस इनपुट का उपयोग करें',
        'सामग्री के कई संस्करणों की तुलना करें'
      ]
    },
    gu: {
      title: 'સામગ્રી વિશ્લેષક',
      description: 'વિશ્વસનીયતા અને ખોટી માહિતી માટે ટેક્સ્ટ સામગ્રીનું વિશ્લેષણ કરો.',
      tips: [
        'ટેક્સ્ટ વિસ્તારમાં તમારી સામગ્રી પેસ્ટ કરો',
        'વિશ્લેષણ શરૂ કરવા માટે "સામગ્રીનું વિશ્લેષણ કરો" પર ક્લિક કરો',
        'વિગતવાર વિશ્વસનીયતા અહેવાલની સમીક્ષા કરો',
        'હેન્ડ્સ-ફ્રી ઓપરેશન માટે વૉઇસ ઇનપુટનો ઉપયોગ કરો',
        'સામગ્રીના બહુવિધ સંસ્કરણોની તુલના કરો'
      ]
    },
    mr: {
      title: 'सामग्री विश्लेषक',
      description: 'विश्वासार्हता आणि चुकीच्या माहितीसाठी मजकूर सामग्रीचे विश्लेषण करा.',
      tips: [
        'मजकूर क्षेत्रात आपली सामग्री पेस्ट करा',
        'विश्लेषण सुरू करण्यासाठी "सामग्री विश्लेषण करा" वर क्लिक करा',
        'तपशीलवार विश्वासार्हता अहवालाचे पुनरावलोकन करा',
        'हँड्स-फ्री ऑपरेशनसाठी व्हॉइस इनपुट वापरा',
        'सामग्रीच्या एकाधिक आवृत्त्यांची तुलना करा'
      ]
    }
  },
  '/article-analysis': {
    en: {
      title: 'Article Image Analysis',
      description: 'Analyze news article images for verification.',
      tips: [
        'Upload an article image',
        'Wait for text extraction and analysis',
        'Review the credibility assessment',
        'Check source verification details',
        'Export or share the analysis report'
      ]
    },
    hi: {
      title: 'लेख छवि विश्लेषण',
      description: 'सत्यापन के लिए समाचार लेख छवियों का विश्लेषण करें।',
      tips: [
        'एक लेख छवि अपलोड करें',
        'टेक्स्ट निष्कर्षण और विश्लेषण की प्रतीक्षा करें',
        'विश्वसनीयता मूल्यांकन की समीक्षा करें',
        'स्रोत सत्यापन विवरण जांचें',
        'विश्लेषण रिपोर्ट निर्यात करें या साझा करें'
      ]
    },
    gu: {
      title: 'લેખ ચિત્ર વિશ્લેષણ',
      description: 'ચકાસણી માટે સમાચાર લેખની છબીઓનું વિશ્લેષણ કરો.',
      tips: [
        'લેખની છબી અપલોડ કરો',
        'ટેક્સ્ટ નિષ્કર્ષણ અને વિશ્લેષણની રાહ જુઓ',
        'વિશ્વસનીયતા આકારણીની સમીક્ષા કરો',
        'સ્રોત ચકાસણી વિગતો તપાસો',
        'વિશ્લેષણ અહેવાલ નિકાસ કરો અથવા શેર કરો'
      ]
    },
    mr: {
      title: 'लेख प्रतिमा विश्लेषण',
      description: 'सत्यापनासाठी बातम्या लेखाच्या प्रतिमांचे विश्लेषण करा.',
      tips: [
        'लेखाची प्रतिमा अपलोड करा',
        'मजकूर काढणे आणि विश्लेषणाची प्रतीक्षा करा',
        'विश्वासार्हता मूल्यांकनाचे पुनरावलोकन करा',
        'स्रोत सत्यापन तपशील तपासा',
        'विश्लेषण अहवाल निर्यात करा किंवा सामायिक करा'
      ]
    }
  },
  '/news': {
    en: {
      title: 'News Analysis',
      description: 'Monitor and verify news articles in real-time.',
      tips: [
        'Browse latest news from trusted sources',
        'Filter by category or source',
        'Click articles for detailed analysis',
        'Use the search feature to find specific news',
        'Listen to article content with text-to-speech'
      ]
    },
    hi: {
      title: 'समाचार विश्लेषण',
      description: 'वास्तविक समय में समाचार लेखों की निगरानी और सत्यापन करें।',
      tips: [
        'विश्वसनीय स्रोतों से नवीनतम समाचार ब्राउज़ करें',
        'श्रेणी या स्रोत के आधार पर फ़िल्टर करें',
        'विस्तृत विश्लेषण के लिए लेखों पर क्लिक करें',
        'विशिष्ट समाचार खोजने के लिए खोज सुविधा का उपयोग करें',
        'टेक्स्ट-टू-स्पीच के साथ लेख सामग्री सुनें'
      ]
    },
    gu: {
      title: 'સમાચાર વિશ્લેષણ',
      description: 'વાસ્તવિક સમયમાં સમાચાર લેખોનું નિરીક્ષણ અને ચકાસણી કરો.',
      tips: [
        'વિશ્વસનીય સ્રોતોમાંથી નવીનતમ સમાચાર બ્રાઉઝ કરો',
        'શ્રેણી અથવા સ્રોત દ્વારા ફિલ્ટર કરો',
        'વિગતવાર વિશ્લેષણ માટે લેખો પર ક્લિક કરો',
        'વિશિષ્ટ સમાચાર શોધવા માટે શોધ સુવિધાનો ઉપયોગ કરો',
        'ટેક્સ્ટ-ટુ-સ્પીચ સાથે લેખની સામગ્રી સાંભળો'
      ]
    },
    mr: {
      title: 'बातम्या विश्लेषण',
      description: 'वास्तविक वेळेत बातम्या लेखांचे निरीक्षण आणि सत्यापन करा.',
      tips: [
        'विश्वासार्ह स्रोतांकडून नवीनतम बातम्या ब्राउझ करा',
        'श्रेणी किंवा स्रोतानुसार फिल्टर करा',
        'तपशीलवार विश्लेषणासाठी लेखांवर क्लिक करा',
        'विशिष्ट बातम्या शोधण्यासाठी शोध वैशिष्ट्य वापरा',
        'टेक्स्ट-टू-स्पीचसह लेख सामग्री ऐका'
      ]
    }
  },
  '/about': {
    en: {
      title: 'About Verifai',
      description: 'Learn about our mission and features.',
      tips: [
        'Explore our key features',
        'Meet the team behind Verifai',
        'Understand our verification process',
        'Check out case studies',
        'Get in touch with us'
      ]
    },
    hi: {
      title: 'Verifai के बारे में',
      description: 'हमारे मिशन और विशेषताओं के बारे में जानें।',
      tips: [
        'हमारी प्रमुख विशेषताओं का अन्वेषण करें',
        'Verifai के पीछे की टीम से मिलें',
        'हमारी सत्यापन प्रक्रिया को समझें',
        'केस स्टडीज देखें',
        'हमसे संपर्क करें'
      ]
    },
    gu: {
      title: 'Verifai વિશે',
      description: 'અમારા મિશન અને સુવિધાઓ વિશે જાણો.',
      tips: [
        'અમારી મુખ્ય સુવિધાઓનું અન્વેષણ કરો',
        'Verifai પાછળની ટીમને મળો',
        'અમારી ચકાસણી પ્રક્રિયાને સમજો',
        'કેસ સ્ટડીઝ તપાસો',
        'અમારો સંપર્ક કરો'
      ]
    },
    mr: {
      title: 'Verifai बद्दल',
      description: 'आमच्या ध्येय आणि वैशिष्ट्यांबद्दल जाणून घ्या.',
      tips: [
        'आमची प्रमुख वैशिष्ट्ये एक्सप्लोर करा',
        'Verifai मागील टीमला भेटा',
        'आमची सत्यापन प्रक्रिया समजून घ्या',
        'केस स्टडीज तपासा',
        'आमच्याशी संपर्क साधा'
      ]
    }
  }
};

// Project information to give context to the AI
const PROJECT_INFO = `
This is an AI-powered fake news detection application called Verifai that helps users verify content credibility.

About the Team:
Mission: To combat misinformation and promote truth through innovative AI technology
Vision: A world where everyone can easily verify information and make informed decisions

Team Members:
- Harsh Rathod (Team Lead and Developer): Leads the Verifai project with expertise in full-stack development, architecting frontend and backend systems.
  Contact: harsh@verifai.ai
- Pooja Purohit (Machine Learning Engineer): Designs and trains AI models for credibility scoring and misinformation detection.
  Contact: pooja@verifai.ai
- Saurabh Patel (Data Analyst): Ensures data quality and generates insightful reports.
  Contact: saurabh@verifai.ai
- Saachi Desai (UI/UX Designer): Crafts intuitive and responsive interfaces.
  Contact: saachi@verifai.ai

Key Features:
- Smart Analysis: Advanced AI algorithms detect patterns and analyze content credibility in seconds
- Fact Verification: Cross-reference content with trusted sources and databases in real-time
- Credibility Score: Get instant credibility ratings based on multiple verification factors
- Detailed Reports: Generate comprehensive analysis reports with actionable insights

Application Features:
- Text content analysis for credibility and misinformation
- Image analysis for article verification
- News monitoring and verification
- Multi-language support (English, Hindi, Gujarati, Marathi)
- Detailed analysis reports with credibility scores
- Source verification and fact-checking
- History tracking and comparison tools

Understanding Fake News Spread:
Fake news spreads through social media, messaging apps, and unverified websites due to sensational headlines, emotional manipulation, and rapid sharing. Verifai detects this by analyzing content, cross-referencing sources, and providing credibility scores.

The application uses Google's Gemini AI for analysis and provides comprehensive reports including:
- Credibility scores
- Fact-checking results
- Content statistics
- Sentiment analysis
- Readability metrics
- Bias detection
- Source verification
`;

export const SideChatbot = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [showTutorial, setShowTutorial] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string) => {
    try {
      // Check if the user is asking about the team
      const lowerCaseMessage = userMessage.toLowerCase();
      if (lowerCaseMessage.includes('team') || lowerCaseMessage.includes('team members') || lowerCaseMessage.includes('who is in the team')) {
        return TEAM_INFO[i18n.language as keyof typeof TEAM_INFO] || TEAM_INFO.en;
      }

      // Check if the user is asking about how fake news spreads
      if (lowerCaseMessage.includes('how fake news is spread') || lowerCaseMessage.includes('how fake news spreads')) {
        return FAKE_NEWS_SPREAD_INFO[i18n.language as keyof typeof FAKE_NEWS_SPREAD_INFO] || FAKE_NEWS_SPREAD_INFO.en;
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      
      const prompt = `You are a helpful AI assistant for the Verifai application. Here's the context about the application:

${PROJECT_INFO}

Current page: ${location.pathname}
Page info: ${JSON.stringify(PAGE_HELP[location.pathname as keyof typeof PAGE_HELP][i18n.language as keyof typeof PAGE_HELP['/']] || PAGE_HELP[location.pathname as keyof typeof PAGE_HELP].en)}

User message: ${userMessage}

Important: You must not answer any questions outside the boundaries of this project, such as general knowledge unrelated to fake news detection or Verifai's features. Valid topics include how fake news spreads, team details, and Verifai's features. If the user asks something unrelated, respond with: "I'm here to assist you with the Fake News Detection System and its features. Please ask a question related to this project!"

Provide your response in ${i18n.language === 'hi' ? 'Hindi' : 
                         i18n.language === 'gu' ? 'Gujarati' : 
                         i18n.language === 'mr' ? 'Marathi' : 
                         'English'}.

Keep responses helpful, concise, and professional.`;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      return i18n.language === 'hi' ? 
        'क्षमा करें, मुझे एक त्रुटि मिली। कृपया पुनः प्रयास करें या अपना प्रश्न दूसरे तरीके से पूछें।' :
        i18n.language === 'gu' ? 
        'માફ કરશો, મને એક ભૂલ મળી. કૃપા કરીને ફરીથી પ્રયાસ કરો અથવા તમારો પ્રશ્ન અલગ રીતે પૂછો.' :
        i18n.language === 'mr' ? 
        'क्षमस्व, मला एक त्रुटी आढळली. कृपया पुन्हा प्रयत्न करा किंवा तुमचा प्रश्न वेगळ्या पद्धतीने विचारा.' :
        'I apologize, but I encountered an error. Please try again or rephrase your question.';
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsGenerating(true);

    try {
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      const response = await generateResponse(userMessage);
      setMessages(prev => prev.slice(0, -1).concat({ role: 'assistant', content: response }));
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => prev.slice(0, -1).concat({ 
        role: 'assistant', 
        content: i18n.language === 'hi' ? 
          'क्षमा करें, एक त्रुटि हुई। कृपया पुनः प्रयास करें।' :
          i18n.language === 'gu' ? 
          'માફ કરશો, એક ભૂલ થઈ. કૃપા કરીને ફરીથી પ્રયાસ કરો.' :
          i18n.language === 'mr' ? 
          'क्षमस्व, एक त्रुटी झाली. कृपया पुन्हा प्रयत्न करा.' :
          'I apologize, but I encountered an error. Please try again.'
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showPageTutorial = async () => {
    setShowTutorial(true);
    setIsLoading(true);
    const pageInfo = PAGE_HELP[location.pathname as keyof typeof PAGE_HELP]?.[i18n.language as keyof typeof PAGE_HELP['/']] || 
                    PAGE_HELP[location.pathname as keyof typeof PAGE_HELP]?.en;
    
    try {
      if (pageInfo) {
        const welcomeMessage = `${pageInfo.title}! 🎉\n\n${pageInfo.description}\n\n${
          i18n.language === 'hi' ? 'शुरू करने के लिए कुछ टिप्स:' :
          i18n.language === 'gu' ? 'શરૂ કરવા માટે કેટલીક ટિપ્સ:' :
          i18n.language === 'mr' ? 'सुरू करण्यासाठी काही टिप्स:' :
          'Here are some tips to get started:'
        }\n${pageInfo.tips.map(tip => `• ${tip}`).join('\n')}\n\n${
          i18n.language === 'hi' ? 'कृपया कोई भी प्रश्न पूछने में संकोच न करें!' :
          i18n.language === 'gu' ? 'કૃપા કરીને કોઈપણ પ્રશ્ન પૂછવામાં સંકોચ ન કરો!' :
          i18n.language === 'mr' ? 'कृपया कोणताही प्रश्न विचारण्यास संकोच करू नका!' :
          'Feel free to ask me any questions!'
        }`;

        setMessages([{
          role: 'assistant',
          content: welcomeMessage
        }]);
      } else {
        const defaultMessage = i18n.language === 'hi' ? 
          "स्वागत है! मैं Verifai के बारे में आपके किसी भी प्रश्न में मदद करने के लिए यहां हूं। आप क्या जानना चाहेंगे?" :
          i18n.language === 'gu' ? 
          "સ્વાગત છે! હું Verifai વિશે તમારા કોઈપણ પ્રશ્નોમાં મદદ કરવા માટે અહીં છું. તમે શું જાણવા માંગો છો?" :
          i18n.language === 'mr' ? 
          "स्वागत आहे! मी Verifai बद्दल तुमच्या कोणत्याही प्रश्नांमध्ये मदत करण्यासाठी येथे आहे. तुम्हाला काय जाणून घ्यायचे आहे?" :
          "Welcome! I'm here to help you with any questions about Verifai. What would you like to know?";

        setMessages([{
          role: 'assistant',
          content: defaultMessage
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 pointer-events-none">
      <div className="p-4 flex flex-col items-end pointer-events-auto">
        {/* Chat Toggle Button */}
        <Button
          onClick={() => {
            setIsOpen(true);
            if (messages.length === 0) {
              showPageTutorial();
            }
          }}
          className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
          size="icon"
        >
          <MessageSquare className="h-6 w-6 text-primary-foreground" />
        </Button>

        {/* Chat Window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mt-4 w-[95vw] sm:w-[400px] h-[80vh] sm:h-[600px] bg-background/40 backdrop-blur-xl border border-border/50 rounded-lg shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-border/50 flex items-center justify-between bg-card/40 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Verifai Assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Globe className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {languages.map((lang) => (
                        <DropdownMenuItem
                          key={lang.code}
                          onClick={() => {
                            i18n.changeLanguage(lang.code);
                            showPageTutorial();
                          }}
                        >
                          {lang.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => showPageTutorial()}
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                  <div className="space-y-6">
                    <MessageSkeleton />
                    <MessageSkeleton />
                    <MessageSkeleton />
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                      className={`flex items-start gap-3 ${
                        message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        message.role === 'assistant' ? 'bg-primary/10' : 'bg-secondary'
                      }`}>
                        {message.role === 'assistant' ? (
                          <Bot className="h-5 w-5 text-primary" />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>
                      <div className={`rounded-lg p-3 max-w-[80%] ${
                        message.role === 'assistant' 
                          ? 'bg-card/40 backdrop-blur-sm border border-border/50' 
                          : 'bg-primary text-primary-foreground'
                      }`}>
                        {message.content === '' ? (
                          <MessageSkeleton />
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border/50 bg-card/40 backdrop-blur-sm">
                <div className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      i18n.language === 'hi' ? "अपना संदेश टाइप करें..." :
                      i18n.language === 'gu' ? "તમારો સંદેશ ટાઈપ કરો..." :
                      i18n.language === 'mr' ? "तुमचा संदेश टाइप करा..." :
                      "Type your message..."
                    }
                    className="w-full pr-12 pl-4 py-2 bg-background/40 backdrop-blur-sm border border-input/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={2}
                    style={{ minHeight: '60px' }}
                    disabled={isGenerating}
                  />
                  <Button
                    onClick={handleSend}
                    className="absolute right-2 bottom-2"
                    size="icon"
                    disabled={!input.trim() || isGenerating}
                  >
                    {isGenerating ? (
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};