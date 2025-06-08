
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, UserCircle2, X } from "lucide-react";

interface PhotoUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onComplete: (photoUrl: string | null) => void;
  username: string;
}

const PhotoUploadDialog = ({ open, onClose, onComplete, username }: PhotoUploadDialogProps) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPhoto(result);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkip = () => {
    onComplete(null);
    onClose();
  };

  const handleConfirm = () => {
    onComplete(photo);
    onClose();
  };

  const handleReset = () => {
    setPhoto(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add profile photo</DialogTitle>
          <DialogDescription>
            Add a profile photo to personalize your account
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative">
            <Avatar className="h-32 w-32 mb-4">
              {photo ? (
                <AvatarImage src={photo} alt="Profile picture" />
              ) : (
                <AvatarFallback className="bg-primary text-white text-4xl">
                  {username.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            
            {photo && (
              <Button 
                size="icon" 
                variant="outline" 
                className="absolute top-0 right-0 rounded-full h-8 w-8"
                onClick={handleReset}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {!photo ? (
            <div className="mt-4">
              <input
                type="file"
                id="photo-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <label htmlFor="photo-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Choose photo
                  </span>
                </Button>
              </label>
            </div>
          ) : (
            <p className="text-sm text-center mt-2 text-muted-foreground">
              Looking good! Click Confirm to save this photo.
            </p>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button 
            variant="ghost" 
            onClick={handleSkip}
            className="order-2 sm:order-1"
          >
            Skip for now
          </Button>
          
          <Button 
            onClick={handleConfirm} 
            disabled={uploading}
            className="order-1 sm:order-2"
          >
            {uploading ? "Uploading..." : photo ? "Confirm" : "Continue without photo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoUploadDialog;
