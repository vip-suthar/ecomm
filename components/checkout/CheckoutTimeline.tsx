import { CheckCircle, Circle } from "lucide-react";

interface TimelineStep {
  title: string;
  status: "completed" | "current" | "upcoming";
}

interface CheckoutTimelineProps {
  currentStep: number;
}

export function CheckoutTimeline({ currentStep }: CheckoutTimelineProps) {
  const steps: TimelineStep[] = [
    { title: "Address", status: currentStep === 1 ? "current" : currentStep > 1 ? "completed" : "upcoming" },
    { title: "Payment", status: currentStep === 2 ? "current" : currentStep > 2 ? "completed" : "upcoming" },
    { title: "Order Placed", status: currentStep === 3 ? "current" : currentStep > 3 ? "completed" : "upcoming" },
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.title} className="flex flex-col items-center">
            <div className="flex items-center">
              {index > 0 && (
                <div
                  className={`h-0.5 w-16 ${
                    step.status === "completed" ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step.status === "completed"
                    ? "bg-primary text-primary-foreground"
                    : step.status === "current"
                    ? "border-2 border-primary"
                    : "border-2 border-gray-200"
                }`}
              >
                {step.status === "completed" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 w-16 ${
                    step.status === "completed" ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
            <span
              className={`mt-2 text-sm ${
                step.status === "current"
                  ? "text-primary font-medium"
                  : step.status === "completed"
                  ? "text-primary"
                  : "text-gray-500"
              }`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 