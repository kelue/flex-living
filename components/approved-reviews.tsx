"use client"

import { useState, useEffect } from "react"

interface Review {
  id: number
  property: string
  guest: string
  rating: number
  date: string
  comment: string
  isPublic: boolean
  category: string
}

export function ApprovedReviews({ propertyName }: { propertyName?: string }) {
  const [approvedReviews, setApprovedReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadApprovedReviews()
  }, [])

  const loadApprovedReviews = async () => {
    try {
      const response = await fetch("/api/reviews")
      if (response.ok) {
        const allReviews = await response.json()
        // Filter to only show reviews marked as public/approved in admin dashboard
        let publicReviews = allReviews.filter((review: Review) => review.isPublic)
        if (propertyName) {
          const target = String(propertyName).toLowerCase().trim()
          publicReviews = publicReviews.filter((r: Review) => String(r.property).toLowerCase().trim() === target)
        }
        publicReviews.sort((a: Review, b: Review) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setApprovedReviews(publicReviews)
      }
    } catch (error) {
      console.error("Failed to load approved reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? "text-amber-600" : "text-gray-500"}`}>
        ★
      </span>
    ))
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Guest Reviews</h3>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Verified</span>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Loading reviews...</p>
        </div>
      </div>
    )
  }

  if (approvedReviews.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Guest Reviews</h3>
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">No reviews</span>
        </div>
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">There are no reviews for this property yet.</p>
          <p className="text-xs text-gray-400 mt-1">Once guests leave feedback and it's approved, reviews will appear here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Guest Reviews</h3>
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Verified</span>
      </div>

      <div className="space-y-4">
        {approvedReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 text-sm">{review.guest}</span>
                <div className="flex">{renderStars(review.rating)}</div>
              </div>
              <span className="text-xs text-gray-500">{review.date}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">Reviews are verified and approved by our team</p>
      </div>
    </div>
  )
}
