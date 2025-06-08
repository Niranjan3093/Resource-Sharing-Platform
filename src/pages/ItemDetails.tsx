import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Share2, 
  ThumbsUp, 
  Calendar, 
  Edit, 
  Trash,
  MessageCircle, 
  Flag,
  Info 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { Item } from "@/types";
import { fetchItemById, deleteItem } from "@/services/mockData";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ItemsMap from "@/components/ItemsMap";
import { AuthContext } from "@/App";

const ItemDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const currentUserId = user?.id || "user1";

  useEffect(() => {
    const loadItem = async () => {
      try {
        setIsLoading(true);
        if (!id) return;
        
        const storedItems = localStorage.getItem('items');
        let fetchedItem: Item | null = null;
        
        if (storedItems) {
          try {
            const parsedItems: Item[] = JSON.parse(storedItems);
            fetchedItem = parsedItems.find(item => item.id === id) || null;
          } catch (e) {
            console.error("Error parsing stored items:", e);
          }
        }
        
        if (!fetchedItem) {
          fetchedItem = await fetchItemById(id);
        }
        
        if (fetchedItem) {
          setItem(fetchedItem);
          
          if (fetchedItem.owner && fetchedItem.owner.id) {
            setIsOwner(fetchedItem.owner.id === currentUserId);
          } else {
            setIsOwner(false);
          }
        }
      } catch (error) {
        console.error("Error loading item:", error);
        toast("Error loading item details");
      } finally {
        setIsLoading(false);
      }
    };

    loadItem();
  }, [id, currentUserId]);

  const handleDelete = async () => {
    try {
      if (!id) return;
      
      const storedItems = localStorage.getItem('items');
      if (storedItems) {
        try {
          const parsedItems: Item[] = JSON.parse(storedItems);
          const updatedItems = parsedItems.filter(item => item.id !== id);
          localStorage.setItem('items', JSON.stringify(updatedItems));
        } catch (e) {
          console.error("Error updating localStorage:", e);
        }
      }
      
      await deleteItem(id);
      
      toast("Item has been deleted successfully");
      navigate("/my-items");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast("Failed to delete item");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item?.title,
        text: `Check out this item on ShareHaven: ${item?.title}`,
        url: window.location.href,
      }).catch(err => {
        console.error("Error sharing:", err);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard");
    }
  };

  const handleContact = () => {
    setIsContactOpen(false);
    toast("Your message has been sent to the owner");
  };

  const handleBorrow = () => {
    toast("Your borrowing request has been sent to the owner");
  };

  const handleLike = () => {
    if (item) {
      setItem({
        ...item,
        likesCount: item.likesCount + 1,
      });
      toast("You've liked this item");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl pt-24 pb-12 px-4 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="animate-spin-slow h-12 w-12 rounded-full border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto max-w-7xl pt-24 pb-12 px-4 flex flex-col items-center justify-center min-h-[400px]">
        <Info className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Item Not Found</h2>
        <p className="text-muted-foreground mb-6">This item may have been removed or is no longer available.</p>
        <Button asChild>
          <Link to="/browse">Browse Other Items</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl pt-24 pb-12 px-4">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4 -ml-3">
          <Link to="/browse" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Link>
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="relative rounded-xl overflow-hidden h-[300px] sm:h-[400px] md:h-[500px] bg-accent">
              <img 
                src={item?.imageUrl} 
                alt={item?.title} 
                className="w-full h-full object-cover"
              />
              
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <Badge className="bg-background/80 text-foreground backdrop-blur-sm">
                  {item?.category}
                </Badge>
                <Badge 
                  variant={item?.available ? "outline" : "secondary"}
                  className={item?.available 
                    ? "bg-background/80 backdrop-blur-sm" 
                    : "bg-secondary/80 backdrop-blur-sm"
                  }
                >
                  {item?.available ? "Available" : "Unavailable"}
                </Badge>
              </div>
              
              <div className="absolute top-4 right-4">
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="glass-card rounded-xl p-6 h-full">
              <div className="flex flex-col h-full">
                <div>
                  <h1 className="text-3xl font-semibold mb-2">{item?.title}</h1>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{item?.location}</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{item?.timeAgo}</span>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={item?.owner?.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {item?.owner?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{item?.owner?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {isOwner ? "You (Owner)" : "Item Owner"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-medium">Description</h3>
                    <p className="text-muted-foreground">{item?.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Posted on {item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Unknown date'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                      <span>{item?.likesCount || 0} likes</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsMapOpen(true)}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      View on Map
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleLike}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Like
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
                
                <div className="mt-auto">
                  {isOwner ? (
                    <div className="flex gap-3">
                      <Button asChild className="flex-1">
                        <Link to={`/items/${item?.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Item
                        </Link>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="flex-1">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this item from the platform.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Button 
                        className="flex-1" 
                        disabled={!item?.available}
                        onClick={handleBorrow}
                      >
                        Request to Borrow
                      </Button>
                      
                      <Sheet open={isContactOpen} onOpenChange={setIsContactOpen}>
                        <SheetTrigger asChild>
                          <Button variant="outline" className="flex-1">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Contact Owner
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Contact {item?.owner?.name}</SheetTitle>
                            <SheetDescription>
                              Send a message to the owner about this item
                            </SheetDescription>
                          </SheetHeader>
                          
                          <div className="py-6">
                            <div className="flex items-center mb-6">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={item?.owner?.avatar} />
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  {item?.owner?.name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{item?.owner?.name}</div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  <span>{item?.owner?.location}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  About Item: {item?.title}
                                </label>
                                <textarea 
                                  className="w-full p-3 border rounded-md h-32"
                                  placeholder="Write your message here..."
                                  defaultValue={`Hi ${item?.owner?.name}, I'm interested in borrowing your ${item?.title}. Is it still available?`}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <SheetFooter>
                            <Button onClick={handleContact}>Send Message</Button>
                          </SheetFooter>
                        </SheetContent>
                      </Sheet>
                    </div>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4 text-muted-foreground" 
                    size="sm"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Report Item
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Sheet open={isMapOpen} onOpenChange={setIsMapOpen}>
        <SheetContent side="bottom" className="h-[80vh] sm:max-w-none">
          <SheetHeader className="mb-4">
            <SheetTitle>Item Location</SheetTitle>
            <SheetDescription>
              {item?.title} - {item?.location}
            </SheetDescription>
          </SheetHeader>
          
          <div className="h-[calc(80vh-100px)]">
            {item && <ItemsMap items={[item]} selectedItemId={item.id} className="h-full" />}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ItemDetails;
