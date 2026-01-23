import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/utils.js";

/* ---------------- Root primitives ---------------- */

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

/* ---------------- Overlay ---------------- */

const DialogOverlay = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-50",
        "bg-black/20",                // ✅ light background dim
        "transition-opacity",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        className
      )}
      {...props}
    />
  )
);
DialogOverlay.displayName = "DialogOverlay";

/* ---------------- Content ---------------- */

const DialogContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-1/2 top-1/2 z-50",
          "-translate-x-1/2 -translate-y-1/2",
          "w-[92%] max-w-lg",
          "rounded-xl border border-gray-200",
          "bg-white",                 // ✅ clean white background
          "p-6",
          "shadow-[0_10px_30px_rgba(0,0,0,0.08)]",
          "transition-all duration-200",
          "data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0",
          "data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0",
          className
        )}
        {...props}
      >
        {children}

        <DialogPrimitive.Close
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = "DialogContent";

/* ---------------- Header / Footer ---------------- */

const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

/* ---------------- Title / Description ---------------- */

const DialogTitle = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Title
      ref={ref}
      className={cn(
        "text-lg font-semibold text-gray-900",
        className
      )}
      {...props}
    />
  )
);
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Description
      ref={ref}
      className={cn(
        "text-sm text-gray-500 leading-relaxed",
        className
      )}
      {...props}
    />
  )
);
DialogDescription.displayName = "DialogDescription";

/* ---------------- Exports ---------------- */

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};