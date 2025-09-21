import React from "react"
import { motion } from "framer-motion"

interface EducationChecklistProps {
  items: string[]
}

export const EducationChecklist: React.FC<EducationChecklistProps> = ({ items }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Media Literacy Checklist</h2>
      <ul className="list-disc list-inside space-y-2">
        {items.map((item, idx) => (
          <motion.li
            key={idx}
            className="text-gray-700"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + idx * 0.1, duration: 0.4 }}
          >
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.div>
)
}
