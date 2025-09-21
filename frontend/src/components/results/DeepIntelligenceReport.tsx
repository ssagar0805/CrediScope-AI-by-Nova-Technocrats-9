import React, { useState } from "react"
import { motion } from "framer-motion"

interface Section {
  heading: string
  content: string
}

interface DeepIntelligenceReportProps {
  summary?: string
  sections: Section[]
  audit?: Record<string, any>
}

export const DeepIntelligenceReport: React.FC<DeepIntelligenceReportProps> = ({
  summary,
  sections,
  audit,
}) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Intelligence Report</h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:underline"
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>

      {summary && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-gray-700"
        >
          {summary}
        </motion.p>
      )}

      {expanded && (
        <div className="space-y-4">
          {sections.map((sec, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.1, duration: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-1">{sec.heading}</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{sec.content}</p>
            </motion.div>
          ))}
          
          {audit && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + sections.length * 0.1, duration: 0.4 }}
              className="mt-6 pt-4 border-t border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Audit Trail</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm text-gray-700">
                {JSON.stringify(audit, null, 2)}
              </pre>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
)
}
