import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function CopyWrapper({
  children,
  text,
  toastTitle,
  className,
  validateBeforeCopy,
  errorToastTitle,
  ...props
}: {
  children: React.ReactNode;
  text: string;
  toastTitle?: string;
  className?: string;
  validateBeforeCopy?: () => Promise<boolean>;
  errorToastTitle?: string;
}) {
  const { toast } = useToast();

  const handleCopy = async () => {
    // Perform some action before trying to copy (e.g., validation)
    if (validateBeforeCopy) {
      const shouldProceed = await validateBeforeCopy();
      if (!shouldProceed) {
        // If the validation fails, don't proceed with copying
        toast({
          title: errorToastTitle || "Copy failed",
        });
        return;
      }
    }

    navigator.clipboard.writeText(text);
    toast({
      title: toastTitle || "Copied",
    });
  };

  return (
    <div
      className={cn("hover:cursor-pointer", className)}
      onClick={handleCopy}
      {...props}
    >
      {children}
    </div>
  );
}
