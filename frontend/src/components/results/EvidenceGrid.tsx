import React from "react"
import { motion } from "framer-motion"

interface EvidenceItem {
  title: string
  url: string
  note?: string
}

interface EvidenceGridProps {
  evidence: EvidenceItem[]
}

export const EvidenceGrid: React.FC<EvidenceGridProps> = ({ evidence }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Evidence Sources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {evidence.map((item, idx) => (
          <motion.a
            key={idx}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1, duration: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-blue-600 mb-1">{item.title}</h3>
            <p className="text-gray-700 text-sm">{item.note}</p>
          </motion.a>
        ))}
      </div>
    </motion.div>
)
}
