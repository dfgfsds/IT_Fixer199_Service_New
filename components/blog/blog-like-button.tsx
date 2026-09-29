'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { toast } from 'sonner'

interface BlogLikeButtonProps {
  initialLikes?: number
  blogId: string
}

export function BlogLikeButton({ initialLikes = 0, blogId }: BlogLikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [liked, setLiked] = useState(false)

  const handleLike = () => {
    if (liked) {
      setLikes((prev) => Math.max(0, prev - 1))
      setLiked(false)
    } else {
      setLikes((prev) => prev + 1)
      setLiked(true)
      toast.success('Thank you for liking this article!')
    }
  }

  return (
    <button
      onClick={handleLike}
      className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border font-bold text-sm transition-all duration-300 shadow-sm ${
        liked
          ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-rose-100'
          : 'bg-white border-slate-200 text-slate-600 hover:border-rose-200 hover:text-rose-600 hover:bg-rose-50/50'
      }`}
    >
      <Heart
        className={`w-4 h-4 transition-transform duration-300 ${
          liked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-400'
        }`}
      />
      <span>{likes}</span>
      <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
        {likes === 1 ? 'Like' : 'Likes'}
      </span>
    </button>
  )
}
