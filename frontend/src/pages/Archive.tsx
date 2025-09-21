import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import TruthLensHeader from "@/components/TruthLensHeader"
import TruthLensFooter from "@/components/TruthLensFooter"

import { getResult, Result } from "@/api/client"
import mockResult from "@/data/mockResult.json"

const Archive: React.FC = () => {
  const navigate = useNavigate()
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedState, setSelectedState] = useState("All")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const verdictFilters = ["All", "Verified", "False", "Caution"]
  const categories = [
    "All", "Political", "Health", "Finance", "Education", "National Security", 
    "Constitution", "Communal/Religious", "Technology", "Disaster/Weather", "Entertainment/Hoaxes"
  ]
  
  const indianStates = [
    "All", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttarakhand", "Uttar Pradesh", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli", 
    "Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ]

  // Load mock list with more comprehensive data
  useEffect(() => {
    const load = async () => {
      try {
        // Create mock data with more variety
        const sampleClaims = [
          "COVID vaccine contains microchips to track people",
          "Government using 5G towers for mind control",
          "Cryptocurrency will replace all banks by 2025",
          "New education policy removes history from curriculum",
          "Article 370 restoration bill passed secretly",
          "Religious conversion mandatory in new law",
          "AI robots taking over government jobs",
          "Cyclone predicted to hit major cities tomorrow",
          "Celebrity death hoax spreads on social media",
          "Stock market manipulation by foreign powers",
          "Vaccine passport mandatory for all travel",
          "Government surveillance through WhatsApp messages"
        ]
        
        const sampleStates = ["Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", "Delhi", "Punjab", "West Bengal", "Rajasthan"]
        const verdictLabels = ["Verified", "False", "Caution"]
        
        const fakeList: Result[] = Array.from({ length: 42 }, (_, i) => ({
          ...mockResult,
          id: `case-${String(i + 1).padStart(3, '0')}`,
          input: sampleClaims[i % sampleClaims.length],
          domain: categories[Math.floor(Math.random() * (categories.length - 1)) + 1], // Skip "All"
          verdict: {
            ...mockResult.verdict,
            label: verdictLabels[i % 3],
            confidence: Math.floor(65 + Math.random() * 35),
          },
          audit: {
            ...mockResult.audit,
            analysis_time: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
          },
          // Add mock state and reporter info
          state: sampleStates[Math.floor(Math.random() * sampleStates.length)],
          reporter: `User${String(i + 1).padStart(3, '0')}`,
          escalationStatus: i % 4 === 0 ? "Escalated" : i % 4 === 1 ? "Under Review" : "Resolved"
        }))
        setResults(fakeList)
      } catch (err) {
        console.error("⚠️ Failed to load archive:", err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredResults = results.filter((r) => {
    const matchVerdict = selectedFilter === "All" || r.verdict.label === selectedFilter
    const matchCategory = selectedCategory === "All" || r.domain === selectedCategory
    const matchState = selectedState === "All" || (r as any).state === selectedState
    const matchDateRange = (!dateRange.start || !dateRange.end) || (
      r.audit?.analysis_time && 
      new Date(r.audit.analysis_time) >= new Date(dateRange.start) &&
      new Date(r.audit.analysis_time) <= new Date(dateRange.end)
    )
    const matchSearch = !search || 
      r.input.toLowerCase().includes(search.toLowerCase()) ||
      r.deep_report.summary?.toLowerCase().includes(search.toLowerCase()) ||
      r.domain.toLowerCase().includes(search.toLowerCase())
    return matchVerdict && matchCategory && matchState && matchDateRange && matchSearch
  })
  
  // Pagination
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage)
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const stats = [
    { number: filteredResults.length.toString(), label: "Total Cases", icon: "📊" },
    {
      number: filteredResults.filter((r) => r.verdict.label === "Verified").length.toString(),
      label: "✅ Verified",
      icon: "✅"
    },
    {
      number: filteredResults.filter((r) => r.verdict.label === "False").length.toString(),
      label: "❌ False",
      icon: "❌"
    },
    {
      number: filteredResults.filter((r) => r.verdict.label === "Caution").length.toString(),
      label: "⚠️ Caution",
      icon: "⚠️"
    },
  ]
  
  const getVerdictBadgeClass = (verdict: string) => {
    switch (verdict) {
      case "Verified":
        return "bg-green-100 text-green-800 border-green-200"
      case "False":
        return "bg-red-100 text-red-800 border-red-200"
      case "Caution":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TruthLensHeader />
      <main className="flex-1">
        {/* Header Section */}
        <section className="relative py-8 border-b border-border">
          <div
            className="absolute inset-0 opacity-10"
            style={{ background: "var(--truthlens-gradient)" }}
          />
          <div className="container relative mx-auto px-4 lg:px-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Misinformation Archive
              </h1>
              <p className="text-lg text-muted-foreground">
                Database of verified misinformation cases
              </p>
            </div>

            {/* Stats Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg border border-border p-4 text-center"
                >
                  <div className="text-2xl font-bold text-truthlens-primary mb-1">
                    {stat.number}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filters Bar */}
        <section className="py-4 bg-card border-b border-border">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="space-y-4">
              {/* Top Filter Row */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Date Range */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">📅 Date Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({...prev, start: e.target.value}))}
                      className="text-xs"
                    />
                    <Input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({...prev, end: e.target.value}))}
                      className="text-xs"
                    />
                  </div>
                </div>

                {/* Verdict Filter */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">✅ Verdict</label>
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {verdictFilters.map((filter) => (
                        <SelectItem key={filter} value={filter} className="text-xs">
                          {filter}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">🗂️ Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category} className="text-xs">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* State Filter */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">🌐 State</label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state} className="text-xs">
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">🔎 Search</label>
                  <Input
                    placeholder="Search claims, summary..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-6">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="space-y-4">
              {/* Results Table */}
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading archive...</p>
                </div>
              ) : (
                <>
                  <Card>
                    <CardContent className="p-0">
                      {/* Table Header */}
                      <div className="grid grid-cols-12 gap-4 p-4 bg-secondary/20 border-b text-xs font-medium text-muted-foreground">
                        <div className="col-span-2">Date</div>
                        <div className="col-span-2">Category</div>
                        <div className="col-span-4">Claim Title</div>
                        <div className="col-span-1">Verdict</div>
                        <div className="col-span-2">State</div>
                        <div className="col-span-1">Action</div>
                      </div>
                      
                      {/* Table Body */}
                      <div className="divide-y divide-border">
                        {paginatedResults.map((case_, index) => (
                          <div
                            key={case_.id}
                            className={`grid grid-cols-12 gap-4 p-4 text-sm hover:bg-secondary/10 transition-colors ${
                              index % 2 === 0 ? "bg-background" : "bg-secondary/5"
                            }`}
                          >
                            <div className="col-span-2 text-muted-foreground">
                              {case_.audit?.analysis_time ? 
                                new Date(case_.audit.analysis_time).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: '2-digit', 
                                  year: '2-digit'
                                }) 
                                : '01/01/24'
                              }
                            </div>
                            <div className="col-span-2">
                              <span className="text-xs bg-secondary/20 px-2 py-1 rounded-md">
                                {case_.domain}
                              </span>
                            </div>
                            <div className="col-span-4 font-medium text-card-foreground">
                              <div className="truncate" title={case_.input}>
                                {case_.input}
                              </div>
                            </div>
                            <div className="col-span-1">
                              <span className={`text-xs px-2 py-1 rounded-full border ${
                                getVerdictBadgeClass(case_.verdict.label)
                              }`}>
                                {case_.verdict.label}
                              </span>
                            </div>
                            <div className="col-span-2 text-muted-foreground">
                              {(case_ as any).state || 'N/A'}
                            </div>
                            <div className="col-span-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-primary hover:text-primary-hover p-2 h-auto"
                                onClick={() => navigate(`/results?id=${case_.id}`)}
                              >
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pagination */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                      {Math.min(currentPage * itemsPerPage, filteredResults.length)} of{' '}
                      {filteredResults.length} results
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </Button>
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                        {totalPages > 5 && (
                          <>
                            <span className="px-2 py-1 text-sm text-muted-foreground">...</span>
                            <Button
                              variant={currentPage === totalPages ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(totalPages)}
                              className="w-8 h-8 p-0"
                            >
                              {totalPages}
                            </Button>
                          </>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <TruthLensFooter />
    </div>
  )
}

export default Archive