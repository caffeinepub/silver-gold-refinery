import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Instagram } from 'lucide-react';

export default function SocialMediaAssets() {
  const imagePath = '/assets/generated/instagram-sponsor.dim_1080x1080.png';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imagePath;
    link.download = 'gururaj-silver-refinery-instagram-sponsor.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Social Media Assets
            </h2>
            <p className="text-lg text-muted-foreground">
              Download our promotional materials for Instagram
            </p>
          </div>

          <Card className="border-2 shadow-lg overflow-hidden">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                  <Instagram className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl md:text-3xl">Instagram Sponsorship Post</CardTitle>
              <CardDescription className="text-base">
                Promote live gold & silver rates on your Instagram feed
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Image Preview */}
              <div className="bg-muted/50 rounded-lg p-4 flex justify-center">
                <div className="max-w-md w-full">
                  <img 
                    src={imagePath}
                    alt="Instagram sponsorship post for live gold and silver rates"
                    className="w-full h-auto rounded-lg shadow-md border-2 border-border"
                  />
                </div>
              </div>

              {/* Image Details */}
              <div className="bg-muted/30 rounded-lg p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-muted-foreground">Format:</span>
                  <span className="text-sm font-medium">Instagram Feed (Square)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-muted-foreground">Dimensions:</span>
                  <span className="text-sm font-medium">1080 × 1080 px</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-muted-foreground">Theme:</span>
                  <span className="text-sm font-medium">Gold & Silver Metallic</span>
                </div>
              </div>

              {/* Download Button */}
              <Button 
                onClick={handleDownload}
                size="lg"
                className="w-full text-lg h-14 bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-white font-semibold"
              >
                <Download className="w-6 h-6 mr-2" />
                Download for Instagram
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Perfect for Instagram posts, stories, and promotional campaigns
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
