import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Instagram } from "lucide-react";
import { useCallback } from "react";

const IMAGE_PATH = "/assets/generated/instagram-sponsor.dim_1080x1080.png";

export default function SocialMediaAssets() {
  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = IMAGE_PATH;
    link.download = "gururaj-silver-refinery-instagram-sponsor.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Social Media Assets
            </h2>
            <p className="text-lg text-muted-foreground font-medium">
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
              <CardTitle className="text-2xl md:text-3xl text-foreground">
                Instagram Sponsorship Post
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground font-medium">
                Promote live gold &amp; silver rates on your Instagram feed
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4 flex justify-center">
                <div className="max-w-md w-full">
                  <img
                    src={IMAGE_PATH}
                    alt="Instagram sponsorship post for live gold and silver rates"
                    className="w-full h-auto rounded-lg shadow-md border-2 border-border"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="bg-muted/40 rounded-lg p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-muted-foreground">
                    Format:
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    Instagram Feed (Square)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-muted-foreground">
                    Dimensions:
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    1080 × 1080 px
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-muted-foreground">
                    Theme:
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    Gold &amp; Silver Metallic
                  </span>
                </div>
              </div>

              <Button
                onClick={handleDownload}
                size="lg"
                className="w-full text-lg h-14 bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-lg"
              >
                <Download className="w-6 h-6 mr-2" />
                Download for Instagram
              </Button>

              <p className="text-center text-sm text-muted-foreground font-medium">
                Perfect for Instagram posts, stories, and promotional campaigns
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
