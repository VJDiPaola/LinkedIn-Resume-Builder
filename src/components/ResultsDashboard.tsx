"use client";

import { OutputType } from "@/lib/schemas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Briefcase, Linkedin, FileText, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type DeepPartial<T> = T extends (infer U)[] ? DeepPartial<U>[] : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

interface ResultsDashboardProps {
    data: DeepPartial<OutputType>;
}

export function ResultsDashboard({ data }: ResultsDashboardProps) {
    if (!data) return null;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* LEFT COLUMN: Job Description Analysis */}
            <div className="xl:col-span-4 space-y-6">
                <Card className="bg-white border-stone-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <Briefcase className="w-5 h-5 mr-2 text-stone-500" />
                            JD Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-stone-500 mb-2">Explicit Requirements</h4>
                            <div className="space-y-2">
                                {data.jdAnalysis?.explicitRequirements?.map((req, i) => (
                                    <div key={i} className="px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-700 leading-relaxed">{req}</div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-stone-500 mb-2 mt-4">Implicit Focus</h4>
                            <div className="space-y-2">
                                {data.jdAnalysis?.implicitRequirements?.map((req, i) => (
                                    <div key={i} className="px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-600 leading-relaxed">{req}</div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-stone-500 mb-2 mt-4">Problems to Solve</h4>
                            <ul className="list-disc pl-4 space-y-1 text-sm text-stone-600">
                                {data.jdAnalysis?.problemsToSolve?.map((prob, i) => (
                                    <li key={i}>{prob}</li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* MIDDLE COLUMN: LinkedIn Headlines & About */}
            <div className="xl:col-span-4 space-y-6">
                <Card className="bg-white border-stone-200 shadow-sm h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <Linkedin className="w-5 h-5 mr-2 text-stone-500" />
                            LinkedIn Content
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-stone-500">Headline Variants</h4>
                            {data.linkedInOptimization?.headlineVariants?.map((variant, i) => (
                                <div key={i} className="group relative p-3 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{variant?.type}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopy(variant?.text || "")}>
                                            <Copy className="h-3 w-3 text-stone-500" />
                                        </Button>
                                    </div>
                                    <p className="text-sm text-stone-800 pr-6">{variant?.text}</p>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <h4 className="text-sm font-medium text-stone-500">About Section</h4>
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => handleCopy(data.linkedInOptimization?.aboutSection || "")}>
                                    <Copy className="h-3 w-3 mr-1" /> Copy
                                </Button>
                            </div>
                            <div className="p-4 rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-700 whitespace-pre-wrap leading-relaxed">
                                {data.linkedInOptimization?.aboutSection}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* RIGHT COLUMN: Resume Bullets & Gap Analysis */}
            <div className="xl:col-span-4 space-y-6">
                <Card className="bg-white border-stone-200 shadow-sm h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <FileText className="w-5 h-5 mr-2 text-stone-500" />
                            Resume Optimization
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-6">

                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-stone-500">Tailored Resume Bullets</h4>
                            <ScrollArea className="h-[400px] pr-4">
                                <div className="space-y-4">
                                    {data.resumeOptimization?.bulletAnalysis?.map((bullet, i) => (
                                        <div key={i} className="p-4 rounded-lg border border-stone-200 bg-white space-y-3">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-stone-800">{bullet?.rewriteSuggestion}</p>
                                                </div>
                                                <Button variant="secondary" size="icon" className="h-7 w-7 shrink-0 bg-stone-100 hover:bg-stone-200 text-stone-500" onClick={() => handleCopy(bullet?.rewriteSuggestion || "")}>
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <div className="pl-3 border-l-2 border-stone-200">
                                                <p className="text-xs text-stone-400 italic line-clamp-2">Original: {bullet?.originalBullet}</p>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-stone-500">{bullet?.positioningNote}</span>
                                                <div className="flex items-center space-x-1">
                                                    <span className="text-stone-400">Match:</span>
                                                    <span className={bullet?.relevanceScore && bullet.relevanceScore >= 4 ? "text-green-400 font-bold" : "text-amber-400 font-bold"}>
                                                        {bullet?.relevanceScore}/5
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-stone-500">ATS Keywords</h4>
                                <div className="space-y-2">
                                    {data.resumeOptimization?.atsKeywords?.slice(0, 5).map((kw, i) => (
                                        <div key={i} className="flex flex-col text-xs p-2 rounded bg-stone-50 border border-stone-200">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-medium text-stone-700">{kw?.keyword}</span>
                                                {kw?.status === "Found" ? <CheckCircle2 className="h-3 w-3 text-green-400" /> : <XCircle className="h-3 w-3 text-red-500" />}
                                            </div>
                                            {kw?.status === "Missing" && <span className="text-stone-400">{kw?.suggestion}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-stone-500">Gap Analysis</h4>
                                <div className="space-y-2">
                                    {data.resumeOptimization?.gapAnalysis?.slice(0, 2).map((gap, i) => (
                                        <div key={i} className="text-xs p-2 rounded bg-red-50 border border-red-200 space-y-1 text-stone-600">
                                            <span className="font-semibold text-red-600 block">{gap?.gap}</span>
                                            <span className="text-stone-500 block leading-tight">{gap?.recommendation}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
