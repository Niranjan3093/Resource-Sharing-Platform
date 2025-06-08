
import { Link } from "react-router-dom";
import { MapPin, Clock, ThumbsUp, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Item } from "@/types";
import { useState } from "react";

interface ItemCardProps {
  item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Link to={`/items/${item.id}`} className="group block">
      <div className="glass-card rounded-xl overflow-hidden hover-scale">
        <div className="relative aspect-[4/3] overflow-hidden">
          {!imageError ? (
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-accent/30">
              <ImageOff className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          {item.category && (
            <Badge className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90">
              {item.category}
            </Badge>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg line-clamp-1">{item.title}</h3>
            <Badge variant={item.available ? "outline" : "secondary"} className="ml-2 shrink-0">
              {item.available ? "Available" : "Unavailable"}
            </Badge>
          </div>
          
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{item.description}</p>
          
          <div className="mt-4 flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{item.location}</span>
            <span className="mx-2">•</span>
            <Clock className="h-4 w-4 mr-1" />
            <span>{item.timeAgo}</span>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={item.owner.avatar} />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {item.owner.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{item.owner.name}</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>{item.likesCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
