'use client'

import { useState } from 'react'
import { Facebook, Twitter, Linkedin, Link as LinkIcon, Check, Send } from 'lucide-react'
import { toast } from 'sonner'

interface BlogShareButtonsProps {
  title: string
  url: string
}

export function BlogShareButtons({ title, url }: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Article link copied to clipboard!')
      setTimeout(() => setCopied(false), 2500)
    } catch (e) {
      toast.error('Failed to copy link')
    }
  }

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: Send,
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:bg-emerald-500 hover:text-white',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:bg-slate-900 hover:text-white',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-600 hover:text-white',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:bg-blue-700 hover:text-white',
    },
  ]

  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Share:</span>
      
      {shareLinks.map((item) => {
        const Icon = item.icon
        return (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`Share on ${item.name}`}
            className={`w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 text-slate-500 flex items-center justify-center transition-all shadow-sm ${item.color}`}
          >
            <Icon className="w-4 h-4" />
          </a>
        )
      })}

      <button
        onClick={handleCopyLink}
        title="Copy Link"
        className={`w-10 h-10 rounded-2xl border transition-all flex items-center justify-center shadow-sm ${
          copied 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
            : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-[#101242] hover:text-white'
        }`}
      >
        {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
      </button>
    </div>
  )
}
