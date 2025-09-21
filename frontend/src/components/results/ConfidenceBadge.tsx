import React from "react"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

interface ConfidenceBreakdown {
  factChecks: number
  sourceCredibility: number
  modelConsensus: number
  technicalFeasibility: number
  crossMedia: number
}

interface ConfidenceBadgeProps {
  label: string
  confidence: number
  breakdown?: ConfidenceBreakdown
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

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  label,
  confidence,
  breakdown,
}) => {
  const colors = getVerdictColor(label)
  const circumference = 2 * Math.PI * 45 // radius of 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (confidence / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className={`${colors.bg} ${colors.border} border-2 p-6 shadow-lg`}>
        <div className="flex items-center justify-between">
          {/* Verdict Label */}
          <div className="flex-1">
            <h1 className={`text-2xl font-bold ${colors.text} mb-2`}>Verdict</h1>
            <p className={`text-3xl font-extrabold ${colors.accent}`}>{label}</p>
          </div>

          {/* Animated Confidence Circle */}
          <div className="relative flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              {/* Animated progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={colors.accent.replace("text-", "")}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </svg>
            {/* Confidence percentage in center */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <span className={`text-2xl font-bold ${colors.accent}`}>{confidence}%</span>
            </motion.div>
          </div>
        </div>

        {/* Confidence Breakdown */}
        {breakdown && (
          <motion.div
            className="mt-6 pt-4 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Confidence Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(breakdown).map(([key, value], index) => (
                <motion.div
                  key={key}
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.3 }}
                >
                  <div className="text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </div>
                  <div className={`text-lg font-bold ${colors.accent}`}>
                    {Math.round(value)}%
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}
