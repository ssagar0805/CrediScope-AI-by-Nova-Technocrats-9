import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Upload, Link, MessageSquare, Zap, Search } from "lucide-react";

export const HeroSection = () => {
  const [claim, setClaim] = useState("");
  const [url, setUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"text" | "url" | "image">("text");
  const navigate = useNavigate();

  const handleSubmit = (claim: string) => {
    if (!claim.trim()) return;
    // Changed to use URL params instead of React state
    navigate(`/results?id=text:${encodeURIComponent(claim)}`);
  };

  const handleUrlSubmit = (url: string) => {
    if (!url.trim()) return;
    // Changed to use URL params instead of React state
    navigate(`/results?id=url:${encodeURIComponent(url)}`);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      navigate("/image-results", { state: { image: base64 } });
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-20">
      <div className="max-w-6xl mx-auto text-center">
        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
            <span className="text-blue-600">Credi</span>
            <span className="text-indigo-600">Scope</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
            AI-powered fact-checking platform combating misinformation in India
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Verify claims, analyze sources, and make informed decisions with our
            comprehensive truth detection system
          </p>
        </motion.div>

        {/* Analysis Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="max-w-2xl mx-auto p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-6">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("text")}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === "text"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Text
                </button>
                <button
                  onClick={() => setActiveTab("url")}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === "url"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Link className="w-4 h-4 mr-2" />
                  URL
                </button>
                <button
                  onClick={() => setActiveTab("image")}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === "image"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Image
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "text" && (
              <div className="space-y-4">
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter a claim to fact-check
                  </label>
                  <Input
                    placeholder="e.g., Vaccines cause infertility in women..."
                    value={claim}
                    onChange={(e) => setClaim(e.target.value)}
                    className="text-base py-3"
                  />
                </div>
                <Button
                  onClick={() => handleSubmit(claim)}
                  disabled={!claim.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-base font-medium"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Analyze Claim
                </Button>
              </div>
            )}

            {activeTab === "url" && (
              <div className="space-y-4">
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter URL to fact-check
                  </label>
                  <Input
                    placeholder="https://example.com/news-article"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="text-base py-3"
                  />
                </div>
                <Button
                  onClick={() => handleUrlSubmit(url)}
                  disabled={!url.trim()}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 text-base font-medium"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Analyze URL
                </Button>
              </div>
            )}

            {activeTab === "image" && (
              <div className="space-y-4">
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload an image to analyze
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">
                      Drop an image here or click to browse
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      onClick={() => document.getElementById("image-upload")?.click()}
                      variant="outline"
                      className="mt-2"
                    >
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Lightning Fast
            </h3>
            <p className="text-gray-600">
              Get comprehensive analysis results in seconds using advanced AI
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Multi-Source
            </h3>
            <p className="text-gray-600">
              Cross-reference with multiple fact-checking databases and sources
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Educational
            </h3>
            <p className="text-gray-600">
              Learn media literacy with detailed explanations and checklists
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
