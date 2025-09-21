import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { analyzeImage } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import TruthLensHeader from "@/components/TruthLensHeader";
import TruthLensFooter from "@/components/TruthLensFooter";
import {
  ArrowLeft,
  FileImage,
  Search,
  CheckCircle,
  Loader2,
  GraduationCap,
  Clock,
  Eye,
  Brain,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Interface for navigation state
interface LocationState {
  file?: File;
  content_type?: string;
}

// Interface for analysis results
interface AnalysisResult {
  id: string;
  input: string;
  domain: string;
  verdict: {
    label: string;
    confidence: number;
    summary: string;
  };
  quick_analysis: string;
  evidence: Array<{
    source: string;
    snippet: string;
    reliability: number;
    url?: string;
  }>;
  checklist: Array<{
    point: string;
    explanation: string;
    completed?: boolean;
  }>;
  intelligence: {
    political?: string;
    financial?: string;
    psychological?: string;
    scientific?: string;
    technical?: string;
    geopolitical?: string;
  };
  audit: Record<string, any>;
}

// Convert File to base64
const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const ImageResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  if (!state?.file) {
    return <Navigate to="/" replace />;
  }

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [showIntelligence, setShowIntelligence] = useState(false);

  useEffect(() => {
    if (state.file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(state.file);
      handleAnalyze();
    }
  }, [state.file]);

  const handleAnalyze = async () => {
    if (!state.file) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const imageBase64 = await fileToBase64(state.file);
      const result = await analyzeImage(imageBase64);
      setResults(result);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Image could not be analyzed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getVerdictColor = (label: string) => {
    if (label.includes("False")) return "text-red-600 bg-red-50 border-red-200";
    if (label.includes("True")) return "text-green-600 bg-green-50 border-green-200";
    return "text-yellow-600 bg-yellow-50 border-yellow-200";
  };

  const formatAnalysisPoints = (analysis: string) => {
    return analysis.split('\n\n').filter(point => point.trim()).map((point, index) => (
      <div key={index} className="mb-3 last:mb-0">
        <p className="text-sm leading-relaxed">{point.trim()}</p>
      </div>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TruthLensHeader />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary to-secondary border-b border-border">
          <div className="container mx-auto px-4 lg:px-6 py-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-white/90 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Image Analysis</h1>
                <div className="flex items-center gap-2 mt-1">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-yellow-300" />
                      <span className="text-white/80 text-sm">Analyzing Image...</span>
                    </>
                  ) : results ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span className="text-white/80 text-sm">Analysis Complete</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 text-white/60" />
                      <span className="text-white/80 text-sm">Preparing Analysis...</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 lg:px-6 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Image Preview */}
            <Card className="border-l-4 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="w-5 h-5 text-primary" />
                  Uploaded Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                {imagePreview && (
                  <div className="flex justify-center">
                    <img
                      src={imagePreview}
                      alt="Uploaded"
                      className="max-w-md max-h-80 object-contain rounded-lg border shadow-sm"
                    />
                  </div>
                )}
                <p className="text-sm text-center text-muted-foreground mt-4">
                  <strong>File:</strong> {state.file.name} (
                  {(state.file.size / 1024).toFixed(1)} KB)
                </p>
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="text-red-700 text-sm text-center">
                    <strong>Analysis Error:</strong> {error}
                    <Button onClick={handleAnalyze} className="ml-4" size="sm" variant="outline">
                      Retry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {isAnalyzing && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center gap-3 text-blue-700">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-medium">Extracting text and analyzing with AI...</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Analysis Results */}
            {results && (
              <>
                {/* Verdict */}
                <Card className={`border-2 ${getVerdictColor(results.verdict.label)}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        <h3 className="font-semibold text-lg">Verdict</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">{results.verdict.label}</div>
                        <div className="text-sm opacity-75">{results.verdict.confidence}% confidence</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{results.verdict.summary}</p>
                  </CardContent>
                </Card>

                {/* Extracted Text Display */}
                {results.audit.extracted_text_length > 0 && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">📝 Extracted Text</h3>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="text-sm leading-relaxed font-mono">
                          "{results.input.replace('Image Analysis - Extracted Text: ', '')}"
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Text extracted using Google Vision API ({results.audit.extracted_text_length} characters)
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Analysis */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">🔍 Key Findings</h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {formatAnalysisPoints(results.quick_analysis)}
                    </div>
                  </CardContent>
                </Card>

                {/* Evidence Sources */}
                {results.evidence.length > 0 && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">📚 Evidence Sources</h3>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {results.evidence.map((evidence, index) => (
                          <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">{evidence.source}</span>
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                {Math.round(evidence.reliability * 100)}% reliable
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{evidence.snippet}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Educational Checklist */}
                {results.checklist.length > 0 && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">🎓 How to Verify Similar Claims</h3>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {results.checklist.map((item, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-sm mb-1">{item.point}</p>
                              <p className="text-sm text-gray-600">{item.explanation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Intelligence Report */}
                <Card>
                  <CardHeader>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setShowIntelligence(!showIntelligence)}
                    >
                      <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">🧠 Intelligence Report</h3>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">Multi-lens analysis</span>
                      </div>
                      {showIntelligence ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </CardHeader>
                  {showIntelligence && (
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(results.intelligence).map(([key, value]) => {
                          if (!value) return null;
                          const icons: { [key: string]: string } = {
                            political: "🏛️",
                            financial: "💰",
                            psychological: "🧠",
                            scientific: "🔬",
                            technical: "⚡",
                            geopolitical: "🌍"
                          };
                          return (
                            <div key={key} className="border-l-4 border-gray-200 pl-4 py-2">
                              <h4 className="font-medium text-sm mb-2 capitalize">
                                {icons[key]} {key} Analysis
                              </h4>
                              <p className="text-sm text-gray-700 leading-relaxed">{value}</p>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Analysis Again Button */}
                <Card className="mt-8">
                  <CardContent className="pt-6">
                    <div className="flex justify-center">
                      <Button onClick={() => navigate("/")} variant="default" className="px-8">
                        <Search className="w-4 h-4 mr-2" />
                        Analyze Another
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
      <TruthLensFooter />
    </div>
  );
};

export default ImageResults;
