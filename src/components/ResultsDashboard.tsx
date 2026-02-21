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
            <div className="xl:col-span-3 space-y-6">
                <Card className="bg-zinc-950/40 border-zinc-800 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <Briefcase className="w-5 h-5 mr-2 text-blue-400" />
                            JD Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-zinc-400 mb-2">Explicit Requirements</h4>
                            <div className="flex flex-wrap gap-2">
                                {data.jdAnalysis?.explicitRequirements?.map((req, i) => (
                                    <Badge key={i} variant="secondary" className="bg-blue-500/10 text-blue-300 hover:bg-blue-500/20">{req}</Badge>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-zinc-400 mb-2 mt-4">Implicit Focus</h4>
                            <div className="flex flex-wrap gap-2">
                                {data.jdAnalysis?.implicitRequirements?.map((req, i) => (
                                    <Badge key={i} variant="outline" className="text-zinc-300 border-zinc-700">{req}</Badge>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-zinc-400 mb-2 mt-4">Problems to Solve</h4>
                            <ul className="list-disc pl-4 space-y-1 text-sm text-zinc-300">
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
                <Card className="bg-zinc-950/40 border-zinc-800 backdrop-blur-md h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <Linkedin className="w-5 h-5 mr-2 text-indigo-400" />
                            LinkedIn Content
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-zinc-400">Headline Variants</h4>
                            {data.linkedInOptimization?.headlineVariants?.map((variant, i) => (
                                <div key={i} className="group relative p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{variant?.type}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopy(variant?.text || "")}>
                                            <Copy className="h-3 w-3 text-zinc-400" />
                                        </Button>
                                    </div>
                                    <p className="text-sm text-zinc-200 pr-6">{variant?.text}</p>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <h4 className="text-sm font-medium text-zinc-400">About Section</h4>
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => handleCopy(data.linkedInOptimization?.aboutSection || "")}>
                                    <Copy className="h-3 w-3 mr-1" /> Copy
                                </Button>
                            </div>
                            <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50 text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                {data.linkedInOptimization?.aboutSection}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* RIGHT COLUMN: Resume Bullets & Gap Analysis */}
            <div className="xl:col-span-5 space-y-6">
                <Card className="bg-zinc-950/40 border-zinc-800 backdrop-blur-md h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                            <FileText className="w-5 h-5 mr-2 text-purple-400" />
                            Resume Optimization
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-6">

                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-zinc-400">Tailored Resume Bullets</h4>
                            <ScrollArea className="h-[400px] pr-4">
                                <div className="space-y-4">
                                    {data.resumeOptimization?.bulletAnalysis?.map((bullet, i) => (
                                        <div key={i} className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30 space-y-3">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-zinc-100">{bullet?.rewriteSuggestion}</p>
                                                </div>
                                                <Button variant="secondary" size="icon" className="h-7 w-7 shrink-0 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300" onClick={() => handleCopy(bullet?.rewriteSuggestion || "")}>
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <div className="pl-3 border-l-2 border-zinc-800">
                                                <p className="text-xs text-zinc-500 italic line-clamp-2">Original: {bullet?.originalBullet}</p>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-zinc-400">{bullet?.positioningNote}</span>
                                                <div className="flex items-center space-x-1">
                                                    <span className="text-zinc-500">Match:</span>
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
                                <h4 className="text-sm font-medium text-zinc-400">ATS Keywords</h4>
                                <div className="space-y-2">
                                    {data.resumeOptimization?.atsKeywords?.slice(0, 5).map((kw, i) => (
                                        <div key={i} className="flex flex-col text-xs p-2 rounded bg-zinc-900/50 border border-zinc-800/80">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-medium text-zinc-200">{kw?.keyword}</span>
                                                {kw?.status === "Found" ? <CheckCircle2 className="h-3 w-3 text-green-400" /> : <XCircle className="h-3 w-3 text-red-500" />}
                                            </div>
                                            {kw?.status === "Missing" && <span className="text-zinc-500">{kw?.suggestion}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-zinc-400">Gap Analysis</h4>
                                <div className="space-y-2">
                                    {data.resumeOptimization?.gapAnalysis?.slice(0, 2).map((gap, i) => (
                                        <div key={i} className="text-xs p-2 rounded bg-red-500/5 border border-red-500/20 space-y-1 text-zinc-300">
                                            <span className="font-semibold text-red-400 block">{gap?.gap}</span>
                                            <span className="text-zinc-500 block leading-tight">{gap?.recommendation}</span>
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
