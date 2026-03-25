"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Loader2, MapPin } from "lucide-react"

export interface SearchResult {
  display_name: string
  lat: number
  lng: number
}

interface Props {
  onSelect: (result: SearchResult) => void
  autoFocus?: boolean
}

async function searchPlaces(query: string): Promise<SearchResult[]> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query + ", Chennai"
      )}&countrycodes=in&limit=6&viewbox=79.7,13.3,80.4,12.7&bounded=1`,
      { headers: { "Accept-Language": "en" } }
    )
    return await res.json()
  } catch {
    return []
  }
}

export function SearchSuggestions({ onSelect, autoFocus }: Props) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setSearching(true)
    timeoutRef.current = setTimeout(async () => {
      const res = await searchPlaces(query)
      setResults(res)
      setSearching(false)
    }, 500)
  }, [query])

  return (
    <>
      <div className="px-5 pt-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for area, street or landmark..."
            className="w-full rounded-2xl border border-transparent bg-muted pl-11 pr-10 py-3.5 text-sm font-medium outline-none transition-all focus:bg-background focus:border-border focus:ring-2 focus:ring-primary/10"
            autoFocus={autoFocus}
          />
          {searching && (
             <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>

      {results.length > 0 && (
        <div className="px-5 pt-2 pb-2">
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => {
                onSelect({
                  display_name: r.display_name,
                  lat: parseFloat(String(r.lat)),
                  lng: parseFloat(String(r.lng)),
                })
              }}
              className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-card border border-border">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {r.display_name?.split(",")[0]}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {r.display_name}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  )
}
