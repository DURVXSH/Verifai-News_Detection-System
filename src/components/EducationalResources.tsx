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
      title: i18n.language === 'hi' ? "सामग्री विश्लेषण गाइड" :
             i18n.language === 'gu' ? "સામગ્રી વિશ્લેષણ માર્ગદર્શિકા" :
             i18n.language === 'mr' ? "सामग्री विश्लेषण मार्गदर्शक" :
             "Content Analysis Guide",
      icon: Brain,
      items: [
        {
          heading: i18n.language === 'hi' ? "चरण 1: सामग्री इनपुट" :
                   i18n.language === 'gu' ? "પગલું 1: સામગ્રી ઇનપુટ" :
                   i18n.language === 'mr' ? "चरण 1: सामग्री इनपुट" :
                   "Step 1: Input Content",
          details: i18n.language === 'hi' ? [
            "विश्लेषण करने के लिए टेक्स्ट पेस्ट करें",
            "लेख, सोशल मीडिया पोस्ट और समाचार सामग्री के लिए समर्थन",
            "लंबी सामग्री अधिक सटीक विश्लेषण प्रदान करती है",
            "मूल स्रोत लिंक की सिफारिश की जाती है"
          ] : i18n.language === 'gu' ? [
            "વિશ્લેષણ માટે ટેક્સ્ટ પેસ્ટ કરો",
            "લેખો, સોશિયલ મીડિયા પોસ્ટ્સ અને સમાચાર સામગ્રી માટે સમર્થન",
            "લાંબી સામગ્રી વધુ ચોક્કસ વિશ્લેષણ પ્રદાન કરે છે",
            "મૂળ સ્રોત લિંક્સની ભલામણ કરવામાં આવે છે"
          ] : i18n.language === 'mr' ? [
            "विश्लेषणासाठी मजकूर पेस्ट करा",
            "लेख, सोशल मीडिया पोस्ट आणि बातम्यांच्या सामग्रीसाठी समर्थन",
            "लांब सामग्री अधिक अचूक विश्लेषण प्रदान करते",
            "मूळ स्रोत लिंक्सची शिफारस केली जाते"
          ] : [
            "Paste the text you want to analyze",
            "Support for articles, social media posts, and news content",
            "Longer content provides more accurate analysis",
            "Original source links are recommended"
          ]
        },
        {
          heading: i18n.language === 'hi' ? "चरण 2: परिणाम समीक्षा" :
                   i18n.language === 'gu' ? "પગલું 2: પરિણામોની સમીક્ષા" :
                   i18n.language === 'mr' ? "चरण 2: परिणाम समीक्षा" :
                   "Step 2: Review Results",
          details: i18n.language === 'hi' ? [
            "समग्र विश्वसनीयता स्कोर की जांच करें",
            "विशिष्ट चेतावनियों और सुझावों की समीक्षा करें",
            "स्रोत सत्यापन विवरण की जांच करें",
            "एआई-जनित अंतर्दृष्टि पर विचार करें"
          ] : i18n.language === 'gu' ? [
            "સમગ્ર વિશ્વસનીયતા સ્કોર તપાસો",
            "ચોક્કસ ચેતવણીઓ અને સૂચનોની સમીક્ષા કરો",
            "સ્રોત ચકાસણી વિગતો તપાસો",
            "AI-જનરેટેડ અંતર્દૃષ્ટિ પર વિચાર કરો"
          ] : i18n.language === 'mr' ? [
            "एकूण विश्वासार्हता गुणांकन तपासा",
            "विशिष्ट इशारे आणि सूचनांचे पुनरावलोकन करा",
            "स्रोत सत्यापन तपशील तपासा",
            "AI-जनरेटेड अंतर्दृष्टींचा विचार करा"
          ] : [
            "Check the overall credibility score",
            "Review specific warnings and suggestions",
            "Examine source verification details",
            "Consider AI-generated insights"
          ]
        },
        {
          heading: i18n.language === 'hi' ? "चरण 3: कार्रवाई करें" :
                   i18n.language === 'gu' ? "પગલું 3: પગલાં લો" :
                   i18n.language === 'mr' ? "चरण 3: कृती करा" :
                   "Step 3: Take Action",
          details: i18n.language === 'hi' ? [
            "दूसरों के साथ विश्लेषण परिणाम साझा करें",
            "विभिन्न प्रारूपों में विस्तृत रिपोर्ट निर्यात करें",
            "भविष्य के संदर्भ के लिए विश्लेषण सहेजें",
            "सामग्री के कई संस्करणों की तुलना करें"
          ] : i18n.language === 'gu' ? [
            "અન્ય લોકો સાથે વિશ્લેષણ પરિણામો શેર કરો",
            "વિવિધ ફોર્મેટ્સમાં વિગતવાર રિપોર્ટ્સ નિકાસ કરો",
            "ભવિષ્યના સંદર્ભ માટે વિશ્લેષણો સાચવો",
            "સામગ્રીના બહુવિધ સંસ્કરણોની તુલના કરો"
          ] : i18n.language === 'mr' ? [
            "इतरांसोबत विश्लेषण परिणाम सामायिक करा",
            "विविध स्वरूपांमध्ये तपशीलवार अहवाल निर्यात करा",
            "भविष्यातील संदर्भासाठी विश्लेषणे जतन करा",
            "सामग्रीच्या एकाधिक आवृत्त्यांची तुलना करा"
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
      title: i18n.language === 'hi' ? "सत्यापन तकनीकें" :
             i18n.language === 'gu' ? "ચકાસણી તકનીકો" :
             i18n.language === 'mr' ? "सत्यापन तंत्रे" :
             "Verification Techniques",
      icon: Shield,
      items: [
        {
          heading: i18n.language === 'hi' ? "स्रोत विश्लेषण" :
                   i18n.language === 'gu' ? "સ્રોત વિશ્લેષણ" :
                   i18n.language === 'mr' ? "स्रोत विश्लेषण" :
                   "Source Analysis",
          details: i18n.language === 'hi' ? [
            "लेखक की क्रेडेंशियल और विशेषज्ञता की जांच करें",
            "प्रकाशन तिथि और अपडेट सत्यापित करें",
            "विश्वसनीय स्रोतों के साथ क्रॉस-रेफरेंस करें",
            "स्रोत की प्रतिष्ठा और इतिहास का मूल्यांकन करें"
          ] : i18n.language === 'gu' ? [
            "લેખકની ક્રેડેન્શિયલ્સ અને નિપુણતા તપાસો",
            "પ્રકાશન તારીખ અને અપડેટ્સ ચકાસો",
            "વિશ્વસનીય સ્રોતો સાથે ક્રોસ-રેફરન્સ કરો",
            "સ્રોતની પ્રતિષ્ઠા અને ઇતિહાસનું મૂલ્યાંકન કરો"
          ] : i18n.language === 'mr' ? [
            "लेखकाची क्रेडेन्शियल्स आणि तज्ञता तपासा",
            "प्रकाशन तारीख आणि अपडेट्स सत्यापित करा",
            "विश्वासार्ह स्रोतांसह क्रॉस-रेफरन्स करा",
            "स्रोताची प्रतिष्ठा आणि इतिहासाचे मूल्यमापन करा"
          ] : [
            "Check author credentials and expertise",
            "Verify publication date and updates",
            "Cross-reference with trusted sources",
            "Evaluate source reputation and history"
          ]
        },
        {
          heading: i18n.language === 'hi' ? "सामग्री मूल्यांकन" :
                   i18n.language === 'gu' ? "સામગ્રી મૂલ્યાંકન" :
                   i18n.language === 'mr' ? "सामग्री मूल्यमापन" :
                   "Content Evaluation",
          details: i18n.language === 'hi' ? [
            "भावनात्मक हेरफेर रणनीतियों की तलाश करें",
            "तार्किक गलतियों की जांच करें",
            "सांख्यिकीय दावों और डेटा को सत्यापित करें",
            "हित के संभावित टकराव की पहचान करें"
          ] : i18n.language === 'gu' ? [
            "ભાવનાત્મક હેરફેર વ્યૂહરચનાઓ શોધો",
            "તાર્કિક ભૂલો તપાસો",
            "આંકડાકીય દાવાઓ અને ડેટા ચકાસો",
            "હિતોના સંભવિત સંઘર્ષની ઓળખ કરો"
          ] : i18n.language === 'mr' ? [
            "भावनिक हाताळणी धोरणे शोधा",
            "तार्किक चुका तपासा",
            "सांख्यिकीय दावे आणि डेटा सत्यापित करा",
            "हितसंबंधांच्या संभाव्य संघर्षांची ओळख करा"
          ] : [
            "Look for emotional manipulation tactics",
            "Check for logical fallacies",
            "Verify statistical claims and data",
            "Identify potential conflicts of interest"
          ]
        },
        {
          heading: i18n.language === 'hi' ? "तकनीकी सत्यापन" :
                   i18n.language === 'gu' ? "ટેકનિકલ ચકાસણી" :
                   i18n.language === 'mr' ? "तांत्रिक सत्यापन" :
                   "Technical Verification",
          details: i18n.language === 'hi' ? [
            "दृश्यों के लिए रिवर्स इमेज सर्च का उपयोग करें",
            "URL प्रामाणिकता की जांच करें",
            "उद्धृत स्रोतों और संदर्भों को सत्यापित करें",
            "उपलब्ध होने पर मेटाडेटा की जांच करें"
          ] : i18n.language === 'gu' ? [
            "દ્રશ્યો માટે રિવર્સ ઇમેજ સર્ચનો ઉપયોગ કરો",
            "URL પ્રમાણભૂતતા તપાસો",
            "ટાંકેલા સ્રોતો અને સંદર્ભો ચકાસો",
            "ઉપલબ્ધ હોય ત્યારે મેટાડેટા તપાસો"
          ] : i18n.language === 'mr' ? [
            "दृश्यांसाठी रिव्हर्स इमेज सर्चचा वापर करा",
            "URL प्रामाणिकता तपासा",
            "उद्धृत स्रोत आणि संदर्भ सत्यापित करा",
            "उपलब्ध असल्यास मेटाडेटा तपासा"
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
      title: i18n.language === 'hi' ? "रेड फ्लैग और चेतावनी संकेत" :
             i18n.language === 'gu' ? "રેડ ફ્લેગ અને ચેતવણી સંકેતો" :
             i18n.language === 'mr' ? "रेड फ्लॅग आणि इशारे" :
             "Red Flags & Warning Signs",
      icon: AlertTriangle,
      items: [
        {
          heading: i18n.language === 'hi' ? "भाषा पैटर्न" :
                   i18n.language === 'gu' ? "ભાષા પેટર્ન" :
                   i18n.language === 'mr' ? "भाषा पॅटर्न" :
                   "Language Patterns",
          details: i18n.language === 'hi' ? [
            "भावनात्मक भाषा का अत्यधिक उपयोग",
            "तत्कालीनता या दबाव की रणनीतियां",
            "बिना सबूत के निरपेक्ष दावे",
            "जटिल मुद्दों का अति-सरलीकरण"
          ] : i18n.language === 'gu' ? [
            "ભાવનાત્મક ભાષાનો અતિશય ઉપયોગ",
            "તાત્કાલિકતા અથવા દબાણની વ્યૂહરચનાઓ",
            "પુરાવા વગરના નિરપેક્ષ દાવાઓ",
            "જટિલ મુદ્દાઓનું અતિ-સરળીકરણ"
          ] : i18n.language === 'mr' ? [
            "भावनिक भाषेचा अतिरेकी वापर",
            "तातडीची किंवा दबावाची धोरणे",
            "पुराव्यांशिवाय निरपेक्ष दावे",
            "गुंतागुंतीच्या मुद्द्यांचे अति-सरलीकरण"
          ] : [
            "Excessive use of emotional language",
            "Urgency or pressure tactics",
            "Absolute claims without evidence",
            "Oversimplification of complex issues"
          ]
        },
        {
          heading: i18n.language === 'hi' ? "सामग्री समस्याएं" :
                   i18n.language === 'gu' ? "સામગ્રી સમસ્યાઓ" :
                   i18n.language === 'mr' ? "सामग्री समस्या" :
                   "Content Issues",
          details: i18n.language === 'hi' ? [
            "गुम या अनाम स्रोत",
            "पुरानी या हेरफेर की गई जानकारी",
            "षड्यंत्र सिद्धांत कथानक",
            "असत्यापनीय दावे या भविष्यवाणियां"
          ] : i18n.language === 'gu' ? [
            "ગુમ અથવા અનામી સ્રોતો",
            "જૂની અથવા હેરફેર કરેલી માહિતી",
            "કાવતરાના સિદ્ધાંતોની વાર્તાઓ",
            "અચકાસી ન શકાય તેવા દાવાઓ અથવા આગાહીઓ"
          ] : i18n.language === 'mr' ? [
            "गहाळ किंवा अनामिक स्रोत",
            "जुनी किंवा हाताळलेली माहिती",
            "कटकारस्थान सिद्धांत कथानके",
            "सत्यापित न करता येणारे दावे किंवा भविष्यवाण्या"
          ] : [
            "Missing or anonymous sources",
            "Outdated or manipulated information",
            "Conspiracy theory narratives",
            "Unverifiable claims or predictions"
          ]
        },
        {
          heading: i18n.language === 'hi' ? "प्रस्तुति चिंताएं" :
                   i18n.language === 'gu' ? "રજૂઆત ચિંતાઓ" :
                   i18n.language === 'mr' ? "सादरीकरण चिंता" :
                   "Presentation Concerns",
          details: i18n.language === 'hi' ? [
            "क्लिकबेट शीर्षक",
            "भ्रामक छवियां या कैप्शन",
            "खराब व्याकरण या फॉर्मेटिंग",
            "संदिग्ध वेबसाइट विशेषताएं"
          ] : i18n.language === 'gu' ? [
            "ક્લિકબેટ શીર્ષકો",
            "ગેરમાર્ગે દોરતી છબીઓ અથવા કૅપ્શન",
            "ખરાબ વ્યાકરણ અથવા ફોર્મેટિંગ",
            "શંકાસ્પદ વેબસાઇટ લક્ષણો"
          ] : i18n.language === 'mr' ? [
            "क्लिकबेट शीर्षके",
            "दिशाभूल करणारी चित्रे किंवा कॅप्शन",
            "खराब व्याकरण किंवा फॉरमॅटिंग",
            "संशयास्पद वेबसाइट वैशिष्ट्ये"
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
      title: i18n.language === 'hi' ? "सर्वोत्तम प्रथाएं" :
             i18n.language === 'gu' ? "શ્રેષ્ઠ પદ્ધતિઓ" :
             i18n.language === 'mr' ? "सर्वोत्तम पद्धती" :
             "Best Practices",
      icon: CheckCircle,
      items: [
        {
          heading: i18n.language === 'hi' ? "साझा करने से पहले" :
                   i18n.language === 'gu' ? "શેર કરતા પહેલા" :
                   i18n.language === 'mr' ? "सामायिक करण्यापूर्वी" :
                   "Before Sharing",
          details: i18n.language === 'hi' ? [
            "कई स्रोतों के साथ दावों को सत्यापित करें",
            "प्रकाशन तिथियों और संदर्भ की जांच करें",
            "शीर्षकों से आगे पढ़ें",
            "लेखक की विशेषज्ञता पर विचार करें"
          ] : i18n.language === 'gu' ? [
            "બહુવિધ સ્રોતો સાથે દાવાઓની ચકાસણી કરો",
            "પ્રકાશન તારીખો અને સંદર્ભ તપાસો",
            "શીર્ષકોથી આગળ વાંચો",
            "લેખકની નિપુણતા ધ્યાનમાં લો"
          ] : i18n.language === 'mr' ? [
            "एकाधिक स्रोतांसह दावे सत्यापित करा",
            "प्रकाशन तारखा आणि संदर्भ तपासा",
            "शीर्षकांपलीकडे वाचा",
            "लेखकाच्या तज्ञतेचा विचार करा"
          ] : [
            "Verify claims with multiple sources",
            "Check publication dates and context",
            "Read beyond headlines",
            "Consider author expertise"
          ]
        },
        {
          heading: i18n.language === 'hi' ? "हमारे टूल्स का उपयोग" :
                   i18n.language === 'gu' ? "અમારા ટૂલ્સનો ઉપયોગ" :
                   i18n.language === 'mr' ? "आमच्या साधनांचा वापर" :
                   "Using Our Tools",
          details: i18n.language === 'hi' ? [
            "नियमित सामग्री निगरानी",
            "महत्वपूर्ण विश्लेषण सहेजें",
            "कई संस्करणों की तुलना करें",
            "विस्तृत रिपोर्ट निर्यात करें"
          ] : i18n.language === 'gu' ? [
            "નિયમિત સામગ્રી મોનિટરિંગ",
            "મહત્વપૂર્ણ વિશ્લેષણો સાચવો",
            "બહુવિધ સંસ્કરણોની તુલના કરો",
            "વિગતવાર રિપોર્ટ્સ નિકાસ કરો"
          ] : i18n.language === 'mr' ? [
            "नियमित सामग्री देखरेख",
            "महत्त्वाची विश्लेषणे जतन करा",
            "एकाधिक आवृत्त्यांची तुलना करा",
            "तपशीलवार अहवाल निर्यात करा"
          ] : [
            "Regular content monitoring",
            "Save important analyses",
            "Compare multiple versions",
            "Export detailed reports"
          ]
        },
        {
          heading: i18n.language === 'hi' ? "जिम्मेदार साझाकरण" :
                   i18n.language === 'gu' ? "જવાબદાર શેરિંગ" :
                   i18n.language === 'mr' ? "जबाबदार सामायिकीकरण" :
                   "Responsible Sharing",
          details: i18n.language === 'hi' ? [
            "सत्यापन स्थिति शामिल करें",
            "जब आवश्यक हो संदर्भ जोड़ें",
            "गलत सूचना को तुरंत सुधारें",
            "विश्लेषण परिणाम साझा करें"
          ] : i18n.language === 'gu' ? [
            "ચકાસણી સ્થિતિ સામેલ કરો",
            "જ્યારે જરૂરી હોય ત્યારે સંદર્ભ ઉમેરો",
            "ખોટી માહિતીને તરત જ સુધારો",
            "વિશ્લેષણ પરિણામો શેર કરો"
          ] : i18n.language === 'mr' ? [
            "सत्यापन स्थिती समाविष्ट करा",
            "आवश्यक तेथे संदर्भ जोडा",
            "चुकीची माहिती त्वरित दुरुस्त करा",
            "विश्लेषण परिणाम सामायिक करा"
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

  return (
    <div className="space-y-8">
      {/* Quick Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: BarChart2,
            title: i18n.language === 'hi' ? "विश्वसनीयता स्कोरिंग" :
                   i18n.language === 'gu' ? "વિશ્વસનીયતા સ્કોરિંગ" :
                   i18n.language === 'mr' ? "विश्वासार्हता गुणांकन" :
                   "Credibility Scoring",
            description: i18n.language === 'hi' ? 
              "कई सत्यापन कारकों के आधार पर तत्काल विश्वसनीयता रेटिंग प्राप्त करें" :
              i18n.language === 'gu' ? 
              "બહુવિધ ચકાસણી પરિબળો પર આધારિત તાત્કાલિક વિશ્વસનીયતા રેટિંગ મેળવો" :
              i18n.language === 'mr' ? 
              "अनेक सत्यापन घटकांवर आधारित त्वरित विश्वासार्हता मूल्यांकन मिळवा" :
              "Get instant credibility ratings based on multiple verification factors"
          },
          {
            icon: Brain,
            title: i18n.language === 'hi' ? "एआई विश्लेषण" :
                   i18n.language === 'gu' ? "એઆઈ વિશ્લેષણ" :
                   i18n.language === 'mr' ? "एआय विश्लेषण" :
                   "AI Analysis",
            description: i18n.language === 'hi' ?
              "उन्नत एल्गोरिदम पैटर्न का पता लगाते हैं और सामग्री प्रामाणिकता का विश्लेषण करते हैं" :
              i18n.language === 'gu' ?
              "ઉન્નત એલ્ગોરિધમ્સ પેટર્ન શોધે છે અને સામગ્રી પ્રમાણિકતાનું વિશ્લેષણ કરે છે" :
              i18n.language === 'mr' ?
              "प्रगत अल्गोरिदम पॅटर्न शोधतात आणि सामग्री प्रामाणिकतेचे विश्लेषण करतात" :
              "Advanced algorithms detect patterns and analyze content authenticity"
          },
          {
            icon: Clock,
            title: i18n.language === 'hi' ? "रीयल-टाइम अपडेट" :
                   i18n.language === 'gu' ? "રીયલ-ટાઈમ અપડેટ્સ" :
                   i18n.language === 'mr' ? "रीअल-टाइम अपडेट्स" :
                   "Real-time Updates",
            description: i18n.language === 'hi' ?
              "विकसित होती कहानियों के लिए निरंतर निगरानी और अपडेट" :
              i18n.language === 'gu' ?
              "વિકસતી વાર્તાઓ માટે સતત મોનિટરિંગ અને અપડેટ્સ" :
              i18n.language === 'mr' ?
              "विकसनशील कथांसाठी सतत देखरेख आणि अपडेट्स" :
              "Continuous monitoring and updates for evolving stories"
          },
          {
            icon: FileText,
            title: i18n.language === 'hi' ? "विस्तृत रिपोर्ट" :
                   i18n.language === 'gu' ? "વિગતવાર રિપોર્ટ્સ" :
                   i18n.language === 'mr' ? "तपशीलवार अहवाल" :
                   "Detailed Reports",
            description: i18n.language === 'hi' ?
              "कार्रवाई योग्य अंतर्दृष्टि के साथ व्यापक विश्लेषण रिपोर्ट जनरेट करें" :
              i18n.language === 'gu' ?
              "ક્રિયાત્મક અંતર્દૃષ્ટિ સાથે વ્યાપક વિશ્લેષણ રિપોર્ટ્સ જનરેટ કરો" :
              i18n.language === 'mr' ?
              "कृतीयोग्य अंतर्दृष्टींसह सर्वसमावेशक विश्लेषण अहवाल तयार करा" :
              "Generate comprehensive analysis reports with actionable insights"
          }
        ].map((feature, index) => (
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
            {i18n.language === 'hi' ? "अतिरिक्त संसाधन" :
             i18n.language === 'gu' ? "વધારાના સ્રોતો" :
             i18n.language === 'mr' ? "अतिरिक्त संसाधने" :
             "Additional Resources"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: i18n.language === 'hi' ? "तथ्य-जांच वेबसाइटें" :
                     i18n.language === 'gu' ? "હકીકત-તપાસ વેબસાઇટ્સ" :
                     i18n.language === 'mr' ? "तथ्य-तपासणी वेबसाइट्स" :
                     "Fact-Checking Websites",
              links: [
                { name: "Snopes", url: "https://www.snopes.com" },
                { name: "FactCheck.org", url: "https://www.factcheck.org" },
                { name: "PolitiFact", url: "https://www.politifact.com" }
              ]
            },
            {
              title: i18n.language === 'hi' ? "मीडिया साक्षरता" :
                     i18n.language === 'gu' ? "મીડિયા સાક્ષરતા" :
                     i18n.language === 'mr' ? "मीडिया साक्षरता" :
                     "Media Literacy",
              links: [
                { name: i18n.language === 'hi' ? "मीडिया पक्षपात चार्ट" :
                         i18n.language === 'gu' ? "મીડિયા પૂર્વગ્રહ ચાર્ટ" :
                         i18n.language === 'mr' ? "मीडिया पक्षपात चार्ट" :
                         "Media Bias Chart", 
                  url: "https://adfontesmedia.com" },
                { name: i18n.language === 'hi' ? "न्यूज़ साक्षरता प्रोजेक्ट" :
                         i18n.language === 'gu' ? "ન્યૂઝ લિટરસી પ્રોજેક્ટ" :
                         i18n.language === 'mr' ? "न्यूज लिटरसी प्रोजेक्ट" :
                         "News Literacy Project", 
                  url: "https://newslit.org" },
                { name: i18n.language === 'hi' ? "कॉमन सेंस मीडिया" :
                         i18n.language === 'gu' ? "કોમન સેન્સ મીડિયા" :
                         i18n.language === 'mr' ? "कॉमन सेन्स मीडिया" :
                         "Common Sense Media", 
                  url: "https://www.commonsensemedia.org" }
              ]
            },
            {
              title: i18n.language === 'hi' ? "शोध उपकरण" :
                     i18n.language === 'gu' ? "સંશોધન ટૂલ્સ" :
                     i18n.language === 'mr' ? "संशोधन साधने" :
                     "Research Tools",
              links: [
                { name: "Google Scholar", url: "https://scholar.google.com" },
                { name: i18n.language === 'hi' ? "इंटरनेट आर्काइव" :
                         i18n.language === 'gu' ? "ઇન્ટરનેટ આર્કાઇવ" :
                         i18n.language === 'mr' ? "इंटरनेट आर्काइव्ह" :
                         "Internet Archive", 
                  url: "https://archive.org" },
                { name: i18n.language === 'hi' ? "शैक्षणिक खोज" :
                         i18n.language === 'gu' ? "શૈક્ષણિક શોધ" :
                         i18n.language === 'mr' ? "शैक्षणिक शोध" :
                         "Academic Search", 
                  url: "https://www.base-search.net" }
              ]
            }
          ].map((section, index) => (
            <div key={index}>
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