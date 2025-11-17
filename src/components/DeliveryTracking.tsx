import { useState } from 'react';
import { MapPin, Package, Truck, CheckCircle2, Clock, Navigation } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { motion } from 'motion/react';

interface DeliveryTrackingProps {
  orderId: string;
  status: 'processing' | 'packed' | 'in-transit' | 'delivered';
  estimatedTime: string;
  driverName?: string;
}

export function DeliveryTracking({ orderId, status, estimatedTime, driverName }: DeliveryTrackingProps) {
  const [showAR, setShowAR] = useState(false);

  const steps = [
    { id: 'processing', label: 'Order Processing', icon: Package, completed: true },
    { id: 'packed', label: 'Packed', icon: CheckCircle2, completed: status !== 'processing' },
    { id: 'in-transit', label: 'In Transit', icon: Truck, completed: status === 'in-transit' || status === 'delivered' },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle2, completed: status === 'delivered' },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === status);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3>Track Your Delivery</h3>
          <p className="text-sm text-muted-foreground mt-1">Order #{orderId}</p>
        </div>
        <Badge className="bg-emerald-500">
          <Clock className="h-3 w-3 mr-1" />
          {estimatedTime}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={progress} className="mb-4" />
        <div className="flex justify-between">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                    step.completed
                      ? 'bg-emerald-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs text-center max-w-[60px]">{step.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* AR Map Visualization */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 mb-4 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-blue-500" />
              Real-time GPS Tracking
            </h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAR(!showAR)}
            >
              {showAR ? 'Exit AR' : 'AR View'}
            </Button>
          </div>

          {/* Animated Map */}
          <div className="relative h-48 bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
            {/* Animated Route */}
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {/* Route Path */}
              <motion.path
                d="M 50 150 Q 150 50, 250 100 T 350 50"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-blue-300"
                strokeDasharray="10 5"
              />
              
              {/* Start Point */}
              <circle cx="50" cy="150" r="8" fill="currentColor" className="text-emerald-500" />
              
              {/* End Point (Your Location) */}
              <circle cx="350" cy="50" r="8" fill="currentColor" className="text-red-500" />
              
              {/* Animated Delivery Vehicle */}
              <motion.g
                animate={{
                  offsetDistance: ['0%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <motion.circle
                  cx="50"
                  cy="150"
                  r="12"
                  fill="currentColor"
                  className="text-blue-500"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                >
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path="M 50 150 Q 150 50, 250 100 T 350 50"
                  />
                </motion.circle>
              </motion.g>
            </svg>

            {/* Overlay Labels */}
            <div className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded text-xs">
              📦 Store
            </div>
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
              🏠 You
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
        </div>
      </div>

      {/* Driver Info */}
      {driverName && status === 'in-transit' && (
        <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                {driverName.charAt(0)}
              </div>
              <div>
                <p>Your driver: {driverName}</p>
                <p className="text-sm text-muted-foreground">⭐ 4.9 Rating</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">Call</Button>
              <Button size="sm" variant="outline">Chat</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Delivery Options */}
      <div className="mt-4 space-y-2">
        <Button variant="outline" className="w-full justify-start">
          <MapPin className="h-4 w-4 mr-2" />
          Change Delivery Address
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Clock className="h-4 w-4 mr-2" />
          Reschedule Delivery
        </Button>
      </div>

      {/* Future Tech Badge */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline" className="text-xs">🚁 Drone Ready</Badge>
        <Badge variant="outline" className="text-xs">🤖 Robot Compatible</Badge>
      </div>
    </Card>
  );
}
