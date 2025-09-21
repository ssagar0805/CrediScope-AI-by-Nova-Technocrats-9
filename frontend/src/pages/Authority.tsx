import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import TruthLensHeader from "@/components/TruthLensHeader";
import TruthLensFooter from "@/components/TruthLensFooter";
import { Result } from "@/api/client";
import mockResult from "@/data/mockResult.json";

const Authority = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const verdictFilters = ["All", "Verified", "False", "Caution"];
  const categories = [
    "All", "Political", "Health", "Finance", "Education", "National Security", 
    "Constitution", "Communal/Religious", "Technology", "Disaster/Weather", "Entertainment/Hoaxes"
  ];
  
  const indianStates = [
    "All", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttarakhand", "Uttar Pradesh", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli", 
    "Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  // Load mock data for dashboard
  useEffect(() => {
    if (isLoggedIn) {
      const load = async () => {
        try {
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
            "Stock market manipulation by foreign powers"
          ];
          
          const sampleStates = ["Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", "Delhi", "Punjab", "West Bengal", "Rajasthan"];
          const verdictLabels = ["Verified", "False", "Caution"];
          const escalationStatuses = ["Pending", "Under Review", "Escalated", "Resolved"];
          const reporters = ["Anonymous User", "Verified Reporter", "Authority Alert", "Media Monitoring"];
          
          const mockReports = Array.from({ length: 35 }, (_, i) => ({
            ...mockResult,
            id: `auth-${String(i + 1).padStart(3, '0')}`,
            input: sampleClaims[i % sampleClaims.length],
            domain: categories[Math.floor(Math.random() * (categories.length - 1)) + 1],
            verdict: {
              ...mockResult.verdict,
              label: verdictLabels[i % 3],
              confidence: Math.floor(65 + Math.random() * 35),
            },
            audit: {
              ...mockResult.audit,
              model_version: `trustlens-v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}`,
              analysis_time: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
              trace_id: `trace-${Math.random().toString(36).substring(7)}`
            },
            state: sampleStates[Math.floor(Math.random() * sampleStates.length)],
            reporter: reporters[Math.floor(Math.random() * reporters.length)],
            escalationStatus: escalationStatuses[Math.floor(Math.random() * escalationStatuses.length)],
            priority: i % 5 === 0 ? "High" : i % 3 === 0 ? "Medium" : "Low",
            submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
          }));
          
          setReports(mockReports);
        } catch (err) {
          console.error("Failed to load reports:", err);
          setReports([]);
        } finally {
          setLoading(false);
        }
      };
      load();
    }
  }, [isLoggedIn]);

  const filteredReports = reports.filter((r) => {
    const matchVerdict = selectedFilter === "All" || r.verdict.label === selectedFilter;
    const matchCategory = selectedCategory === "All" || r.domain === selectedCategory;
    const matchState = selectedState === "All" || r.state === selectedState;
    const matchDateRange = (!dateRange.start || !dateRange.end) || (
      r.submittedAt && 
      new Date(r.submittedAt) >= new Date(dateRange.start) &&
      new Date(r.submittedAt) <= new Date(dateRange.end)
    );
    const matchSearch = !search || 
      r.input.toLowerCase().includes(search.toLowerCase()) ||
      r.reporter.toLowerCase().includes(search.toLowerCase()) ||
      r.escalationStatus.toLowerCase().includes(search.toLowerCase());
    return matchVerdict && matchCategory && matchState && matchDateRange && matchSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Analytics calculations
  const totalReports = reports.length;
  const escalated = reports.filter(r => r.escalationStatus === "Escalated").length;
  const resolved = reports.filter(r => r.escalationStatus === "Resolved").length;
  const pending = reports.filter(r => r.escalationStatus === "Pending" || r.escalationStatus === "Under Review").length;

  const getVerdictBadgeClass = (verdict: string) => {
    switch (verdict) {
      case "Verified":
        return "bg-green-100 text-green-800 border-green-200";
      case "False":
        return "bg-red-100 text-red-800 border-red-200";
      case "Caution":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEscalationBadgeClass = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700 border-green-200";
      case "Escalated":
        return "bg-red-100 text-red-700 border-red-200";
      case "Under Review":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Pending":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200";
      case "Medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Low":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedReports.map(r => r.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action ${action} for items:`, selectedItems);
    // Implementation for bulk actions would go here
    setSelectedItems([]);
  };

  const handleExportCSV = () => {
    const csvContent = [
      "ID,Date,Category,Claim,Verdict,State,Reporter,Status,Priority",
      ...filteredReports.map(r => [
        r.id,
        new Date(r.submittedAt).toLocaleDateString(),
        r.domain,
        `"${r.input.replace(/"/g, '""')}"`,
        r.verdict.label,
        r.state,
        r.reporter,
        r.escalationStatus,
        r.priority
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `authority_reports_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <TruthLensHeader />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-16 lg:py-20 overflow-hidden">
            <div 
              className="absolute inset-0 opacity-10"
              style={{ background: "var(--truthlens-gradient)" }}
            />
            <div className="container relative mx-auto px-4 lg:px-6">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                  <div className="text-6xl mb-6">🛡️</div>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                    Authority Access
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Real-time monitoring and reporting tools for verified authorities
                  </p>
                </div>

                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="authority-id">Authority ID</Label>
                        <Input 
                          id="authority-id"
                          placeholder="Enter your authority identification"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="access-key">Access Key</Label>
                        <Input 
                          id="access-key"
                          type="password"
                          placeholder="Enter your secure access key"
                          className="mt-2"
                        />
                      </div>
                      <Button 
                        className="w-full"
                        size="lg"
                        onClick={() => setIsLoggedIn(true)}
                      >
                        Access Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6 bg-secondary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Demo Credentials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Authority ID:</strong> DEMO_AUTH_2024
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Access Key:</strong> demo_secure_key_123
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
        <TruthLensFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TruthLensHeader />
      <main className="flex-1">
        {/* Dashboard Header */}
        <section className="bg-card border-b border-border">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between py-6">
              <h1 className="text-2xl font-bold text-foreground">Authority Dashboard</h1>
              <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
                Logout
              </Button>
            </div>
          </div>
        </section>

        {/* Analytics Strip */}
        <section className="py-4 bg-secondary/10 border-b border-border">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card rounded-lg border border-border p-4 text-center">
                <div className="text-2xl font-bold text-truthlens-primary mb-1">
                  {totalReports}
                </div>
                <div className="text-xs font-medium text-muted-foreground">
                  Total Reports
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4 text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {escalated}
                </div>
                <div className="text-xs font-medium text-muted-foreground">
                  Escalations
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {resolved}
                </div>
                <div className="text-xs font-medium text-muted-foreground">
                  Resolved
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4 text-center">
                <div className="text-2xl font-bold text-amber-600 mb-1">
                  {pending}
                </div>
                <div className="text-xs font-medium text-muted-foreground">
                  Pending
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Bar */}
        <section className="py-4 bg-card border-b border-border">
          <div className="container mx-auto px-4 lg:px-6">
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
                  placeholder="Search reports..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <section className="py-3 bg-blue-50 border-b border-border">
            <div className="container mx-auto px-4 lg:px-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedItems.length} item(s) selected
                </span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleBulkAction('approve')}
                  >
                    Batch Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleBulkAction('escalate')}
                  >
                    Batch Escalate
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleExportCSV}
                  >
                    Export CSV
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Main Table */}
        <section className="py-6">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading reports...</p>
                </div>
              ) : (
                <>
                  <Card>
                    <CardContent className="p-0">
                      {/* Table Header */}
                      <div className="grid grid-cols-12 gap-4 p-4 bg-secondary/20 border-b text-xs font-medium text-muted-foreground">
                        <div className="col-span-1 flex items-center">
                          <Checkbox
                            checked={selectedItems.length === paginatedReports.length && paginatedReports.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </div>
                        <div className="col-span-1">Date</div>
                        <div className="col-span-1">Category</div>
                        <div className="col-span-3">Claim Title</div>
                        <div className="col-span-1">Verdict</div>
                        <div className="col-span-1">State</div>
                        <div className="col-span-1">Reporter</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-2">Actions</div>
                      </div>
                      
                      {/* Table Body */}
                      <div className="divide-y divide-border">
                        {paginatedReports.map((report, index) => (
                          <div
                            key={report.id}
                            className={`grid grid-cols-12 gap-4 p-4 text-sm hover:bg-secondary/10 transition-colors ${
                              index % 2 === 0 ? "bg-background" : "bg-secondary/5"
                            }`}
                          >
                            <div className="col-span-1 flex items-center">
                              <Checkbox
                                checked={selectedItems.includes(report.id)}
                                onCheckedChange={(checked) => handleSelectItem(report.id, checked as boolean)}
                              />
                            </div>
                            <div className="col-span-1 text-muted-foreground">
                              {new Date(report.submittedAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: '2-digit', 
                                year: '2-digit'
                              })}
                            </div>
                            <div className="col-span-1">
                              <span className="text-xs bg-secondary/20 px-2 py-1 rounded-md">
                                {report.domain}
                              </span>
                            </div>
                            <div className="col-span-3 font-medium text-card-foreground">
                              <div className="truncate" title={report.input}>
                                {report.input}
                              </div>
                              {/* Expandable audit info */}
                              <details className="mt-1">
                                <summary className="text-xs text-muted-foreground cursor-pointer">
                                  Audit Info
                                </summary>
                                <div className="text-xs text-muted-foreground mt-1 space-y-1">
                                  <div>Model: {report.audit.model_version}</div>
                                  <div>Analysis Time: {new Date(report.audit.analysis_time).toLocaleString()}</div>
                                  <div>Trace ID: {report.audit.trace_id}</div>
                                </div>
                              </details>
                            </div>
                            <div className="col-span-1">
                              <span className={`text-xs px-2 py-1 rounded-full border ${
                                getVerdictBadgeClass(report.verdict.label)
                              }`}>
                                {report.verdict.label}
                              </span>
                            </div>
                            <div className="col-span-1 text-muted-foreground">
                              {report.state}
                            </div>
                            <div className="col-span-1 text-muted-foreground">
                              {report.reporter}
                            </div>
                            <div className="col-span-1">
                              <span className={`text-xs px-2 py-1 rounded-full border ${
                                getEscalationBadgeClass(report.escalationStatus)
                              }`}>
                                {report.escalationStatus}
                              </span>
                            </div>
                            <div className="col-span-2 flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-primary hover:text-primary-hover p-1 h-auto"
                                onClick={() => console.log('Review', report.id)}
                              >
                                Review
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-red-600 hover:text-red-800 p-1 h-auto"
                                onClick={() => console.log('Escalate', report.id)}
                              >
                                Escalate
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-gray-600 hover:text-gray-800 p-1 h-auto"
                                onClick={() => console.log('Export', report.id)}
                              >
                                Export
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
                      {Math.min(currentPage * itemsPerPage, filteredReports.length)} of{' '}
                      {filteredReports.length} results
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
  );
};

export default Authority;