import { CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface OrderStatusAnimationProps {
  status: "success" | "failed";
  onAnimationComplete?: () => void;
}

export function OrderStatusAnimation({ status, onAnimationComplete }: OrderStatusAnimationProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="mb-6"
      >
        {status === "success" ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            onAnimationComplete={onAnimationComplete}
          >
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="rounded-full bg-red-100 p-4">
              <XCircle className="h-16 w-16 text-red-600" />
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h2 className="text-2xl font-semibold mb-2">
          {status === "success" ? "Order Placed Successfully!" : "Order Failed"}
        </h2>
        <p className="text-gray-600">
          {status === "success"
            ? "Thank you for your purchase. Redirecting to order confirmation..."
            : "There was an error processing your order. Please try again."}
        </p>
      </motion.div>

      {status === "failed" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      )}
    </div>
  );
} 