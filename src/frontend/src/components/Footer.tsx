import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "silver-gold-refinery";

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-300 font-medium">
            <span>
              © {currentYear} Silver Gold Refinery. All rights reserved.
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-neutral-300 font-medium">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-400 fill-red-400" />
            <span>using</span>
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-yellow-400 hover:text-yellow-300 transition-colors underline"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
