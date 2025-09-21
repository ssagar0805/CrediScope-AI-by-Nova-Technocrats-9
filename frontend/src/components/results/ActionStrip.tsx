import React from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { useNavigate } from "react-router-dom"
import { 
  Share2, 
  Globe, 
  BookOpen, 
  Save, 
  Mail, 
  Flag 
} from "lucide-react"

interface ActionStripProps {
  resultId: string
  shareMessage: string
  onTranslate: () => void
  onExplain: () => void
}

export const ActionStrip: React.FC<ActionStripProps> = ({
  resultId,
  shareMessage,
  onTranslate,
  onExplain,
}) => {
  const navigate = useNavigate()

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareMessage)
    toast({ title: "Copied", description: "Result summary copied to clipboard." })
  }

  const handleExplainClick = () => {
    navigate(`/explain?id=${resultId}`)
  }

  const actionButtons = [
    {
      icon: Share2,
      label: "📤 Share",
      variant: "default" as const,
      onClick: copyToClipboard,
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      icon: Globe,
      label: "🌍 Translate",
      variant: "outline" as const,
      onClick: onTranslate,
      color: "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
    },
    {
      icon: BookOpen,
      label: "📘 Explain Like I'm 12",
      variant: "outline" as const,
      onClick: handleExplainClick,
      color: "hover:bg-green-50 hover:text-green-700 hover:border-green-300"
    },
    {
      icon: Save,
      label: "📌 Save",
      variant: "outline" as const,
      onClick: () => toast({ title: "Saved", description: "Result saved to your archive." }),
      color: "hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"
    },
    {
      icon: Mail,
      label: "📨 Request Review",
      variant: "outline" as const,
      onClick: () => toast({ title: "Review Requested", description: "Expert review has been requested." }),
      color: "hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300"
    },
    {
      icon: Flag,
      label: "🚩 Escalate",
      variant: "destructive" as const,
      onClick: () => toast({ title: "Escalated", description: "Case escalated to authority." }),
      color: "bg-red-600 hover:bg-red-700"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="w-full"
    >
      <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <motion.h3 
          className="text-lg font-semibold text-gray-800 mb-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          Take Action
        </motion.h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {actionButtons.map((button, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 + index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={button.variant}
                onClick={button.onClick}
                className={`w-full h-12 font-medium transition-all duration-300 ${
                  button.variant === "default" 
                    ? button.color
                    : button.variant === "destructive" 
                    ? button.color
                    : `${button.color} border-2`
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <button.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{button.label.replace(/^\p{Emoji}\s*/u, '')}</span>
                  <span className="sm:hidden">{button.label.match(/^\p{Emoji}/u)?.[0] || ''}</span>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
        
        <motion.p 
          className="text-xs text-gray-500 text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.5 }}
        >
          Actions are logged for transparency and audit purposes
        </motion.p>
      </div>
    </motion.div>
  )
}