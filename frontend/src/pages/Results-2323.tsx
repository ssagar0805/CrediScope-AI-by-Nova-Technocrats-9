import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import TruthLensHeader from "@/components/TruthLensHeader";
import TruthLensFooter from "@/components/TruthLensFooter";

interface LocationState {
  content?: string;
  text?: string;
  url?: string;
  verdict?: string;
  confidence_score?: number;
  confidence_percent?: number;
  summary?: string;
  analysis_id?: string;
  detailed_analysis?: {
    evidence?: string[];
    sources?: string[];
    factcheck_results?: Array<{
      verdict: string;
      original_rating?: string;
      source: string;
      url?: string;
      date?: string;
      summary?: string;
    }>;
  };
}

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  // Redirect back if no state
  if (!state || Object.keys(state).length === 0) {
    return <Navigate to="/" replace />;
  }

  // Compute percent confidence from decimal if needed
  const percent =
    state.confidence_percent ??
    Math.round((state.confidence_score ?? 0) * 100);

  const verdict = state.verdict ?? "inconclusive";

  const analysisResult = {
    content:
      state.content ??
      state.text ??
      state.url ??
      "Content analyzed for misinformation",
    riskLevel:
      verdict === "false"
        ? "High"
        : verdict === "true"
        ? "Low"
        : "Medium",
    riskColor:
      verdict === "false"
        ? "bg-red-500/10 text-red-600"
        : verdict === "true"
        ? "bg-green-500/10 text-green-600"
        : "bg-amber-500/10 text-amber-600",
    credibilityScore: percent,
    analysisConfidence: percent,
    evidence:
      state.detailed_analysis?.evidence && state.detailed_analysis.evidence.length > 0
        ? state.detailed_analysis.evidence
        : ["Automated analysis completed"],
    sources:
      state.detailed_analysis?.sources?.map((name) => ({
        name,
        verified: true,
        credibility:
          name.includes("Fact Check") ||
          name.includes("Snopes") ||
          name.includes("FactCheck")
            ? "High"
            : "Medium",
      })) || [
        {
          name: "TruthLens Analysis Engine",
          verified: true,
          credibility: "High",
        },
      ],
    recommendations: [
      "Cross-check with reliable sources",
      "Verify the original publication",
      "Look for official statements",
    ],
    verdict,
    summary: state.summary ?? "",
    analysisId: state.analysis_id ?? "",
    factcheckResults: state.detailed_analysis?.factcheck_results || [],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TruthLensHeader />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-card border-b border-border">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex items-center gap-4 py-6">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                ← Back
              </Button>
              <h1 className="text-2xl font-bold text-foreground">
                Analysis Results
              </h1>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 lg:px-6 py-8">
          <div className="max-w-4xl mx-auto space-y-8">

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Risk Assessment</span>
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${analysisResult.riskColor}`}
                  >
                    {analysisResult.riskLevel} Risk
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">
                      Credibility Score
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-secondary/20 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            analysisResult.credibilityScore >= 80
                              ? "bg-green-500"
                              : analysisResult.credibilityScore >= 60
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${analysisResult.credibilityScore}%`,
                          }}
                        />
                      </div>
                      <span className="font-bold text-lg">
                        {analysisResult.credibilityScore}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">
                      Analysis Confidence
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-secondary/20 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-truthlens-primary"
                          style={{
                            width: `${analysisResult.analysisConfidence}%`,
                          }}
                        />
                      </div>
                      <span className="font-bold text-lg">
                        {analysisResult.analysisConfidence}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Content Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary/10 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-card-foreground mb-2">
                    Analyzed Content:
                  </h4>
                  <p className="text-muted-foreground italic">
                    "{analysisResult.content}"
                  </p>
                </div>

                {analysisResult.summary && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-card-foreground mb-2">
                      Analysis Summary:
                    </h4>
                    <p className="text-muted-foreground">
                      {analysisResult.summary}
                    </p>
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="font-semibold text-card-foreground mb-2">
                    Verdict:
                  </h4>
                  <div
                    className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${analysisResult.riskColor}`}
                  >
                    {analysisResult.verdict.toUpperCase()}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-card-foreground">
                    Detected Issues:
                  </h4>
                  {analysisResult.evidence.map((line, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full mt-2 bg-red-500" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {line}
                        </div>
                      </div>
                      <div className="ml-auto px-2 py-1 rounded text-xs font-medium bg-red-500/10 text-red-600">
                        {verdict === "false" ? "High" : "Low"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Fact-Check Results */}
            {analysisResult.factcheckResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Fact-Check Results (
                    {analysisResult.factcheckResults.length} found)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResult.factcheckResults
                      .slice(0, 5)
                      .map((fc, idx) => (
                        <div
                          key={idx}
                          className="border-l-4 border-red-500 pl-4 bg-red-50 dark:bg-red-950/20 p-3 rounded"
                        >
                          <div className="font-semibold text-red-700">
                            {fc.source} → {fc.verdict}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {fc.summary || fc.original_rating}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Source Verification */}
            <Card>
              <CardHeader>
                <CardTitle>Source Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResult.sources.map((source, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            source.verified ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <span className="font-medium text-card-foreground">
                          {source.name}
                        </span>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          source.credibility === "High"
                            ? "bg-green-500/10 text-green-600"
                            : source.credibility === "Medium"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {source.credibility} Credibility
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResult.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-truthlens-primary/10 text-truthlens-primary rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-muted-foreground">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analysis ID */}
            {analysisResult.analysisId && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-sm text-muted-foreground">
                    Analysis ID:{" "}
                    <code className="bg-secondary px-2 py-1 rounded">
                      {analysisResult.analysisId}
                    </code>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/")}>
                Analyze Another
              </Button>
              <Button size="lg" variant="outline">
                Report Issue
              </Button>
              <Button size="lg" variant="outline">
                Share Results
              </Button>
            </div>
          </div>
        </div>
      </main>
      <TruthLensFooter />
    </div>
  );
};

export default Results;
