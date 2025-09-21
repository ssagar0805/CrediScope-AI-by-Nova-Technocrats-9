import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import TruthLensHeader from "@/components/TruthLensHeader"
import TruthLensFooter from "@/components/TruthLensFooter"
import { getResult, Result } from "@/api/client"
import mockResult from "@/data/mockResult.json"
import { ArrowLeft, Lightbulb, Target, BookOpen } from "lucide-react"

const Explain: React.FC = () => {
  const [data, setData] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()

  // Fetch result on mount
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const resultId = searchParams.get("id") || undefined
        const result = await getResult(resultId)
        setData(result)
      } catch (err) {
        console.error("⚠️ Failed to fetch result, using mock:", err)
        setData(mockResult as Result)
      } finally {
        setLoading(false)
      }
    }
    fetchResult()
  }, [searchParams])

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading explanation...</p>
        </div>
      </div>
    )
  }

  const getVerdictEmoji = (label: string) => {
    if (label.includes("✅") || label.toLowerCase().includes("true")) return "✅"
    if (label.includes("❌") || label.toLowerCase().includes("false")) return "❌"
    return "⚠️"
  }

  const getVerdictColor = (label: string) => {
    if (label.includes("✅") || label.toLowerCase().includes("true")) {
      return { bg: "bg-green-50", border: "border-green-200", text: "text-green-800", accent: "text-green-600" }
    }
    if (label.includes("❌") || label.toLowerCase().includes("false")) {
      return { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", accent: "text-red-600" }
    }
    return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", accent: "text-amber-600" }
  }

  const colors = getVerdictColor(data.verdict.label)
  const verdictEmoji = getVerdictEmoji(data.verdict.label)
  const circumference = 2 * Math.PI * 35 // smaller radius for kids version
  const strokeDashoffset = circumference - (data.verdict.confidence / 100) * circumference

  return (
    <div className="min-h-screen flex flex-col">
      <TruthLensHeader />

      <main className="flex-1 container mx-auto px-4 lg:px-6 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Results</span>
            </Button>
          </motion.div>

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              📘 Explain Like I'm 12
            </h1>
            <p className="text-lg text-gray-600">
              Let's break this down in simple terms! 🎓
            </p>
          </motion.div>

          {/* Simple Verdict */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className={`${colors.bg} ${colors.border} border-2 p-6 shadow-lg mb-8`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className={`text-xl font-bold ${colors.text} mb-2 flex items-center`}>
                    <Target className="w-6 h-6 mr-2" />
                    The Answer
                  </h2>
                  <p className={`text-2xl font-extrabold ${colors.accent} flex items-center`}>
                    <span className="text-4xl mr-3">{verdictEmoji}</span>
                    {data.verdict.label.replace(/[✅❌⚠️]/g, '').trim()}
                  </p>
                </div>

                {/* Fun animated confidence circle */}
                <div className="relative flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="6"
                    />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="35"
                      fill="none"
                      stroke={colors.accent.includes("green") ? "#16a34a" : colors.accent.includes("red") ? "#dc2626" : "#d97706"}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                  </svg>
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <span className={`text-lg font-bold ${colors.accent}`}>
                      {data.verdict.confidence}%
                    </span>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Simple Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="p-8 shadow-lg mb-8 bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="flex items-start space-x-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Lightbulb className="w-8 h-8 text-yellow-500 mt-1" />
                </motion.div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Think of it this way... 🤔
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {data.simple_explanation}
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                    <h3 className="font-bold text-blue-800 mb-3 flex items-center">
                      🎬 Real-world example:
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      It's like someone claiming that eating chocolate makes you fly. 
                      Sounds exciting, but our bodies don't work that way! 
                      Scientists have studied this for years and found no evidence it's true.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Fun Facts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card className="p-6 shadow-lg mb-8 bg-gradient-to-br from-green-50 to-emerald-50">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                🎓 What We Learned
              </h2>
              
              <div className="space-y-4">
                {data.quick_analysis.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.2, duration: 0.5 }}
                    className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-green-200"
                  >
                    <motion.div
                      animate={{ bounce: [0, -10, 0] }}
                      transition={{ duration: 1, delay: 1.5 + index * 0.3, repeat: 1 }}
                      className="text-2xl"
                    >
                      {point.icon}
                    </motion.div>
                    <div>
                      <p className="text-gray-700 font-medium leading-relaxed">
                        {point.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* How to Be a Detective */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Card className="p-6 shadow-lg mb-8 bg-gradient-to-br from-purple-50 to-pink-50">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                🕵️ Be a Fact Detective!
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { emoji: "🔍", tip: "Always check who said it first" },
                  { emoji: "📚", tip: "Look for proof from experts" },
                  { emoji: "🤝", tip: "Ask: Does this make sense?" },
                  { emoji: "🌟", tip: "Trust official sources like doctors" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.0 + index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white p-4 rounded-lg border-2 border-purple-200 text-center"
                  >
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <p className="text-gray-700 font-medium">{item.tip}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Back to Results Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-center"
          >
            <Button 
              onClick={() => window.history.back()}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Back to Full Report
            </Button>
          </motion.div>
        </div>
      </main>

      <TruthLensFooter />
    </div>
  )
}

export default Explain