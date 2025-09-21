import React from "react"
import { motion } from "framer-motion"

interface QuickAnalysisPoint {
  icon: string
  text: string
}

interface QuickAnalysisProps {
  points: QuickAnalysisPoint[]
}

export const QuickAnalysis: React.FC<QuickAnalysisProps> = ({ points }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Findings</h2>
      <div className="space-y-4">
        {points.map((point, idx) => (
          <motion.div
            key={idx}
            className="flex items-start"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + idx * 0.1, duration: 0.4 }}
          >
            <span className="text-2xl mr-3">{point.icon}</span>
            <p className="text-gray-700">{point.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
)
}
