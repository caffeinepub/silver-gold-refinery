import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { memo } from 'react';

interface ProductCardProps {
  title: string;
  image: string;
  purityLevels: string[];
  formats?: string[];
  color: 'gold' | 'silver';
}

const ProductCard = memo(function ProductCard({ title, image, purityLevels, formats, color }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2">
      <div className="relative h-64 overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-4 right-4">
          <Badge 
            className={`text-sm font-bold shadow-lg ${
              color === 'gold' 
                ? 'bg-gold text-gold-foreground border-2 border-gold/50' 
                : 'bg-silver text-silver-foreground border-2 border-silver/50'
            }`}
          >
            {title}
          </Badge>
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-bold text-sm text-muted-foreground mb-3 uppercase tracking-wide">Purity Levels</h4>
          <div className="space-y-2">
            {purityLevels.map((purity, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle2 className={`w-5 h-5 ${color === 'gold' ? 'text-gold' : 'text-silver'}`} />
                <span className="text-lg font-semibold text-foreground">{purity}</span>
              </div>
            ))}
          </div>
        </div>
        
        {formats && formats.length > 0 && (
          <div>
            <h4 className="font-bold text-sm text-muted-foreground mb-3 uppercase tracking-wide">Available Formats</h4>
            <div className="space-y-2">
              {formats.map((format, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className={`w-5 h-5 ${color === 'gold' ? 'text-gold' : 'text-silver'}`} />
                  <span className="text-base font-medium text-foreground">{format}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default ProductCard;
