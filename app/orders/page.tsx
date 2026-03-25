'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import {
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  MessageSquare,
  Star,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

const ORDERS = [
  {
    id: 1,
    service: 'Home Deep Cleaning',
    status: 'completed',
    date: '2024-03-20',
    time: '10:00 AM',
    price: 399,
    expert: 'Rajesh Kumar',
    expertImage: '👨‍💼',
    address: '123 Main Street, Apt 4B',
    rating: null,
  },
  {
    id: 2,
    service: 'Plumbing Repair',
    status: 'in-progress',
    date: '2024-03-22',
    time: '2:00 PM',
    price: 254,
    expert: 'Vikram Singh',
    expertImage: '👨‍🔧',
    address: '123 Main Street, Apt 4B',
    progress: 50,
    rating: null,
  },
  {
    id: 3,
    service: 'AC Service',
    status: 'scheduled',
    date: '2024-03-25',
    time: '10:00 AM',
    price: 286,
    expert: 'Rakesh Gupta',
    expertImage: '👨‍💼',
    address: '123 Main Street, Apt 4B',
    rating: null,
  },
  {
    id: 4,
    service: 'Interior Painting',
    status: 'cancelled',
    date: '2024-03-15',
    time: '09:00 AM',
    price: 450,
    expert: 'Suresh Kumar',
    expertImage: '🎨',
    address: '123 Main Street, Apt 4B',
    rating: null,
  },
]

const STATUS_CONFIG = {
  completed: {
    label: 'Completed',
    color: 'bg-green-50 text-green-700 border-green-200',
    icon: CheckCircle,
  },
  'in-progress': {
    label: 'In Progress',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Clock,
  },
  scheduled: {
    label: 'Scheduled',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    icon: Clock,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: AlertCircle,
  },
}

export default function OrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)
  const [ratingOrder, setRatingOrder] = useState<number | null>(null)
  const [orderRatings, setOrderRatings] = useState<Record<number, number>>({})

  const handleRating = (orderId: number, rating: number) => {
    setOrderRatings({ ...orderRatings, [orderId]: rating })
    setRatingOrder(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Your Orders</h1>

        <div className="space-y-4">
          {ORDERS.map((order) => {
            const StatusIcon = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
              ?.icon
            const isExpanded = expandedOrder === order.id

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-border overflow-hidden transition-all duration-300"
              >
                {/* Order Header */}
                <button
                  onClick={() =>
                    setExpandedOrder(isExpanded ? null : order.id)
                  }
                  className="w-full p-6 flex items-center justify-between hover:bg-muted/30 transition-colors text-left"
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          {order.service}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Order #{order.id.toString().padStart(6, '0')}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                          STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
                            ?.color
                        }`}
                      >
                        {
                          STATUS_CONFIG[
                            order.status as keyof typeof STATUS_CONFIG
                          ]?.label
                        }
                      </span>
                    </div>

                    {order.status === 'in-progress' && (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-accent h-full transition-all"
                            style={{ width: `${order.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {order.progress}%
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                        at {order.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {order.address}
                      </div>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-border p-6 space-y-6">
                    {/* Expert Card */}
                    <div className="bg-muted/50 rounded-xl p-4 space-y-4 border border-border">
                      <h4 className="font-semibold text-foreground">
                        Service Expert
                      </h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">
                            {order.expertImage}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {order.expert}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ⭐ 4.8 (2456 reviews)
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                            <Phone className="w-4 h-4" />
                          </button>
                          <button className="p-3 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-2 text-sm bg-muted/50 rounded-lg p-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service Charge</span>
                        <span className="font-semibold">₹{order.price}</span>
                      </div>
                      <div className="border-t border-border pt-2 flex justify-between font-bold">
                        <span>Total Amount Paid</span>
                        <span className="text-primary">₹{order.price}</span>
                      </div>
                    </div>

                    {/* Rating Section */}
                    {order.status === 'completed' &&
                      !orderRatings[order.id] && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground">
                            How was your experience?
                          </h4>
                          <button
                            onClick={() => setRatingOrder(order.id)}
                            className="w-full px-4 py-3 rounded-lg border border-border hover:bg-muted transition-colors font-semibold text-accent"
                          >
                            Rate Service
                          </button>
                        </div>
                      )}

                    {ratingOrder === order.id && (
                      <div className="space-y-4 bg-accent/10 rounded-lg p-4">
                        <h4 className="font-semibold text-foreground">
                          Rate Your Experience
                        </h4>
                        <div className="flex justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() =>
                                handleRating(order.id, star)
                              }
                              className="text-3xl hover:scale-125 transition-transform"
                            >
                              {star <=
                              (orderRatings[order.id] || 0)
                                ? '⭐'
                                : '☆'}
                            </button>
                          ))}
                        </div>
                        <textarea
                          placeholder="Share your feedback (optional)"
                          className="w-full p-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                          rows={2}
                        />
                        <button className="w-full bg-accent text-white py-2 rounded-lg font-semibold hover:bg-accent/90 transition-colors">
                          Submit Rating
                        </button>
                      </div>
                    )}

                    {orderRatings[order.id] && (
                      <div className="flex items-center gap-2 bg-green-50 rounded-lg p-4 border border-green-200 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">
                          Thanks for rating! Your feedback helps us improve.
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {order.status === 'scheduled' && (
                        <>
                          <button className="flex-1 px-4 py-3 rounded-lg border border-border hover:bg-muted transition-colors font-semibold">
                            Reschedule
                          </button>
                          <button className="flex-1 px-4 py-3 rounded-lg border border-destructive text-destructive hover:bg-red-50 transition-colors font-semibold">
                            Cancel
                          </button>
                        </>
                      )}

                      {order.status === 'in-progress' && (
                        <button className="flex-1 px-4 py-3 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-colors">
                          Track Service
                        </button>
                      )}

                      {order.status === 'completed' && (
                        <button className="flex-1 px-4 py-3 rounded-lg border border-border hover:bg-muted transition-colors font-semibold">
                          Book Again
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>

      <Footer />
    </div>
  )
}

// Helper component for calendar icon
function Calendar({ className }: { className: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
    </svg>
  )
}
