import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"

import TruthLensHeader from "@/components/TruthLensHeader"
import TruthLensFooter from "@/components/TruthLensFooter"

import { ConfidenceBadge } from "@/components/results/ConfidenceBadge"
import { QuickAnalysis } from "@/components/results/QuickAnalysis"
import { EducationChecklist } from "@/components/results/EducationChecklist"
import { EvidenceGrid } from "@/components/results/EvidenceGrid"
import { ActionStrip } from "@/components/results/ActionStrip"
import { DeepIntelligenceReport } from "@/components/results/DeepIntelligenceReport"

import { getResult, translateText, Result } from "@/api/client"

const Results: React.FC = () => {
  const [data, setData] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [translated, setTranslated] = useState(false)
  const [searchParams] = useSearchParams()

  // Fetch result on mount - REMOVED MOCK FALLBACK
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const resultId = searchParams.get("id")
        console.log("🔍 Fetching live result for:", resultId)
        
        if (!resultId) {
          throw new Error("No result ID provided")
        }
        
        const result = await getResult(resultId)
        console.log("✅ Live result received:", result)
        setData(result)
        setError(null)
      } catch (err: any) {
        console.error("❌ Failed to fetch result:", err)
        setError(err.message || "Failed to analyze content")
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchResult()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"
          />
          <p className="text-xl font-semibold text-gray-700 mb-2">Analyzing content...</p>
          <p className="text-gray-500">Please wait while we verify the information</p>
        </motion.div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Analysis Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    )
  }

  // Create comprehensive share message
  const shareMessage = `
CrediScope Analysis Report:

🎯 Verdict: ${data.verdict.label} (${data.verdict.confidence}% confidence)

📊 Key Findings:
${data.quick_analysis.map((p) => `• ${p.text}`).join("\n")}

🔍 Evidence Sources:
${data.evidence.map((e) => `• ${e.title}: ${e.url}`).join("\n")}

📋 Fact-Check Steps Completed:
${data.education_checklist.map((item) => `✓ ${item}`).join("\n")}

🌐 Full Analysis: ${window.location.href}

#CrediScope #FactCheck #TruthVerification
  `.trim()

  // Handle translation (only verdict + quick analysis)
  const handleTranslate = async () => {
    try {
      if (!translated) {
        const verdictTranslated = await translateText(
          `Verdict: ${data.verdict.label} (${data.verdict.confidence}%)`,
          "hi"
        )
        const qaTranslated = await translateText(
          data.quick_analysis.map((p) => `- ${p.text}`).join("\n"),
          "hi"
        )
        alert(
          `🔄 Translation (Hindi):\n\n${verdictTranslated.translated}\n\n${qaTranslated.translated}`
        )
      }
      setTranslated(!translated)
    } catch (err) {
      console.error("Translation failed:", err)
      alert("Translation not available right now.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <TruthLensHeader />

      <main className="flex-1 container mx-auto px-4 lg:px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              📊 Analysis Results
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Complete fact-checking analysis powered by AI and expert verification systems
            </p>
          </motion.div>

          {/* 1. Verdict Strip (Top) */}
          <ConfidenceBadge
            label={data.verdict.label}
            confidence={data.verdict.confidence}
            breakdown={data.verdict.breakdown}
          />

          {/* 2. Quick Analysis (Detailed) */}
          <QuickAnalysis points={data.quick_analysis} />

          {/* 3. Evidence Grid */}
          <EvidenceGrid evidence={data.evidence} />

          {/* 4. Educational Checklist */}
          <EducationChecklist items={data.education_checklist} />

          {/* 5. Expandable Intelligence Report */}
          <DeepIntelligenceReport
            summary={data.deep_report.summary}
            sections={data.deep_report.sections}
            audit={data.audit}
          />

          {/* 6. Action Strip (Always Last) */}
          <ActionStrip
            resultId={data.id}
            shareMessage={shareMessage}
            onTranslate={handleTranslate}
            onExplain={() =>
              alert(
                "Explain like I'm 12:\n\n" +
                  (data.simple_explanation ||
                    "No simplified explanation available.")
              )
            }
          />
        </div>
      </main>

      <TruthLensFooter />
    </div>
  )
}

export default Results
