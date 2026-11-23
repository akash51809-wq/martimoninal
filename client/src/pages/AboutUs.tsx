import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Globe, MessageCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-xl text-gray-600">எங்களை பற்றி</p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Tamil Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-blue-600 flex items-center">
                <span className="mr-2">🇮🇳</span>
                தமிழில்
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-gray-700">
              <div className="space-y-4">
                <p className="leading-relaxed">
                  எங்கள் திருமண தகவல் சேவை மையத்தில், அனைத்து இனத்தவருக்கும், முதல்மணம், மறுமணம் மற்றும் மாற்று திறனாளிகள் அனைவரும் கட்டணம் இன்றி இலவசமாக பதிவு செய்யலாம்.
                </p>
                
                <p className="leading-relaxed">
                  எங்கள் அலுவலகத்தில் நேரிலும் தபால் மூலமும், வாட்ஸ் அப் எண்ணின் மூலமும், mail மூலமாகவும் மற்றும் எங்கள் இணையதளத்தின் மூலமும் பதிவு செய்யலாம். எங்கள் இணையதளம் பயன்படுத்த எளியது மற்றும் பாதுகாப்பானது.
                </p>
                
                <p className="leading-relaxed">
                  அனைத்து இனத்தவருக்கும் அதிகமான ஜாதகங்கள் உள்ளதால், வரன்களை தேர்வு செய்வது எளிது. பதிவு செய்ய வரனின் பயோடேட்டா, ஜாதகம், மற்றும் போட்டோ போதுமானது.
                </p>
                
                <p className="leading-relaxed">
                  எங்கள் திருமண சேவை மையத்தின் மூலம் பல திருமணங்கள் நடந்துள்ளது. எங்கள் சேவையானது வரன்கள் பற்றிய தகவல் தருவது மட்டுமே. வரன்கள் பற்றி நன்கு விசாரித்து முடிவு செய்ய வேண்டியது மணமக்கள் வீட்டாரின் பொறுப்பாகும். திருமண நிச்சயம் முடிந்தவுடன் எங்களுக்கு தெரியப்படுத்தவும்.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="font-semibold text-blue-800">
                    விரைவு பதிவு. விரைவில் திருமணம்.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* English Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-indigo-600 flex items-center">
                <span className="mr-2">🌐</span>
                In English
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-gray-700">
              <div className="space-y-4">
                                 <p className="leading-relaxed">
                   Welcome to <strong>Envaran Matrimony</strong>! This is an exclusive website for facilitating marriages for Hindus of all castes. Marriage is an important turning point and meaningful life event!
                 </p>
                
                <p className="leading-relaxed">
                  We are committed to the noble cause of enabling brides and grooms to find suitable matches for them! We seek your support and suggestions for the success of our aim! All the best. We pray the Almighty to bless us all!
                </p>
                
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-indigo-800 mb-3">Highlights of Our Matrimony Service:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Badge variant="secondary" className="mr-2">✓</Badge>
                      More Trusted
                    </li>
                    <li className="flex items-center">
                      <Badge variant="secondary" className="mr-2">✓</Badge>
                      Benefited Thousands
                    </li>
                    <li className="flex items-center">
                      <Badge variant="secondary" className="mr-2">✓</Badge>
                      Non-commercial & Service Oriented Approach
                    </li>
                    <li className="flex items-center">
                      <Badge variant="secondary" className="mr-2">✓</Badge>
                      Free access to website in India and Abroad
                    </li>
                    <li className="flex items-center">
                      <Badge variant="secondary" className="mr-2">✓</Badge>
                      Registration in Person / by Post for Authenticity
                    </li>
                    <li className="flex items-center">
                      <Badge variant="secondary" className="mr-2">✓</Badge>
                      Daily Data Updates & Validations
                    </li>
                    <li className="flex items-center">
                      <Badge variant="secondary" className="mr-2">✓</Badge>
                      Horoscope Castings (Fully Computerized)
                    </li>
                    <li className="flex items-center">
                      <Badge variant="secondary" className="mr-2">✓</Badge>
                      Free Guidance & Counselling Services
                    </li>
                    <li className="flex items-center">
                      <Badge variant="secondary" className="mr-2">✓</Badge>
                      Low Tariff With More Benefits
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-200" />
                    <span>+91 93358 19686</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-200" />
                    <span>vivahkarlo@gmail.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-blue-200" />
                    <span>www.vivahkarlo.in</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-5 w-5 text-blue-200" />
                    <span>WhatsApp: +91 93358 19686</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Registration Methods</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-white text-blue-600">1</Badge>
                    In Person at our Office
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-white text-blue-600">2</Badge>
                    By Post
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-white text-blue-600">3</Badge>
                    WhatsApp
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-white text-blue-600">4</Badge>
                    Email
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-white text-blue-600">5</Badge>
                    Online Website Registration
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signature */}
        <div className="text-center mt-8">
          <div className="inline-block bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 mb-2">With Love & Regards,</p>
            <p className="text-xl font-bold text-gray-800">B.S. Manivannan</p>
            <p className="text-sm text-gray-500">Founder & Director</p>
          </div>
                 </div>
       </div>
     </div>
     <Footer />
   </div>
 );
};

export default AboutUs;
