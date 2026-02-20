import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Phone } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

export default function ContactSection() {
  const phoneNumber = '9518553890';
  const whatsappUrl = `https://wa.me/91${phoneNumber}`;

  return (
    <section className="py-20 bg-muted/50 relative">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: 'url(/assets/generated/refinery-interior.dim_1200x800.png)' }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 shadow-lg bg-card/98 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-500/10 rounded-full">
                  <MessageCircle className="w-12 h-12 text-green-600 dark:text-green-500" />
                </div>
              </div>
              <CardTitle className="text-3xl md:text-4xl mb-2 text-foreground">Get In Touch</CardTitle>
              <CardDescription className="text-lg text-muted-foreground font-medium">
                Contact us via WhatsApp for inquiries and orders
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 p-8 rounded-lg text-center border-2 border-green-300 dark:border-green-700">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Phone className="w-6 h-6 text-green-700 dark:text-green-400" />
                  <span className="text-sm font-bold text-green-800 dark:text-green-300 uppercase tracking-wide">
                    WhatsApp Number
                  </span>
                </div>
                <a 
                  href={whatsappUrl}
                  className="text-4xl md:text-5xl font-bold text-green-800 dark:text-green-300 hover:text-green-900 dark:hover:text-green-200 transition-colors"
                >
                  {phoneNumber}
                </a>
              </div>
              
              <Button 
                asChild
                size="lg"
                className="w-full text-lg h-14 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <SiWhatsapp className="w-6 h-6 mr-2" />
                  Chat on WhatsApp
                </a>
              </Button>
              
              <p className="text-center text-sm text-muted-foreground font-medium">
                Available for bulk orders and custom requirements
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
