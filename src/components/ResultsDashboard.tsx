"use client";

import { useEffect, useRef, useState } from "react";
import type { DeepPartial } from "ai";
import { OutputType } from "@/lib/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Briefcase, Linkedin, FileText, CheckCircle2, XCircle, Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResultsDashboardProps {
    data: DeepPartial<OutputType>;
    isStreaming?: boolean;
}

function getScoreClasses(score: number | undefined): { text: string; badge: string } {
    if (score === 5) return { text: "text-emerald-700", badge: "bg-emerald-50 border-emerald-200" };
    if (score === 4) return { text: "text-green-700", badge: "bg-green-50 border-green-200" };
    if (score === 3) return { text: "text-amber-700", badge: "bg-amber-50 border-amber-200" };
    if (score === 2) return { text: "text-orange-700", badge: "bg-orange-50 border-orange-200" };
    if (score === 1) return { text: "text-red-700", badge: "bg-red-50 border-red-200" };
    return { text: "text-stone-500", badge: "bg-stone-50 border-stone-200" };
}

function buildExportText(data: DeepPartial<OutputType>): string {
    const lines: string[] = [];
    lines.push("ResumeTailor Export");
    lines.push(`Generated: ${new Date().toLocaleString()}`);
    lines.push("");

    const explicitRequirements = (data.jdAnalysis?.explicitRequirements ?? [])
        .map((item) => item?.trim())
        .filter((item): item is string => Boolean(item));
    const implicitRequirements = (data.jdAnalysis?.implicitRequirements ?? [])
        .map((item) => item?.trim())
        .filter((item): item is string => Boolean(item));
    const problemsToSolve = (data.jdAnalysis?.problemsToSolve ?? [])
        .map((item) => item?.trim())
        .filter((item): item is string => Boolean(item));
    const headlines = (data.linkedInOptimization?.headlineVariants ?? []).filter(
        (variant): variant is NonNullable<typeof variant> => Boolean(variant),
    );
    const aboutSection = data.linkedInOptimization?.aboutSection?.trim();
    const bulletAnalysis = (data.resumeOptimization?.bulletAnalysis ?? []).filter(
        (bullet): bullet is NonNullable<typeof bullet> => Boolean(bullet),
    );
    const atsKeywords = (data.resumeOptimization?.atsKeywords ?? []).filter(
        (keyword): keyword is NonNullable<typeof keyword> => Boolean(keyword),
    );
    const gapAnalysis = (data.resumeOptimization?.gapAnalysis ?? []).filter(
        (gap): gap is NonNullable<typeof gap> => Boolean(gap),
    );

    lines.push("JOB DESCRIPTION ANALYSIS");
    if (explicitRequirements.length > 0) {
        lines.push("Explicit Requirements:");
        explicitRequirements.forEach((req, index) => lines.push(`${index + 1}. ${req}`));
        lines.push("");
    }
    if (implicitRequirements.length > 0) {
        lines.push("Implicit Focus:");
        implicitRequirements.forEach((req, index) => lines.push(`${index + 1}. ${req}`));
        lines.push("");
    }
    if (problemsToSolve.length > 0) {
        lines.push("Problems to Solve:");
        problemsToSolve.forEach((problem, index) => lines.push(`${index + 1}. ${problem}`));
        lines.push("");
    }

    lines.push("LINKEDIN CONTENT");
    if (headlines.length > 0) {
        lines.push("Headline Variants:");
        headlines.forEach((variant, index) => {
            lines.push(`${index + 1}. ${variant.type ?? "Variant"}: ${variant.text ?? ""}`);
        });
        lines.push("");
    }
    if (aboutSection) {
        lines.push("About Section:");
        lines.push(aboutSection);
        lines.push("");
    }

    lines.push("RESUME OPTIMIZATION");
    if (bulletAnalysis.length > 0) {
        lines.push("Tailored Resume Bullets:");
        bulletAnalysis.forEach((bullet, index) => {
            lines.push(`${index + 1}. ${bullet.rewriteSuggestion ?? ""}`);
            if (typeof bullet.relevanceScore === "number") {
                lines.push(`   Match Score: ${bullet.relevanceScore}/5`);
            }
            if (bullet.positioningNote) {
                lines.push(`   Positioning Note: ${bullet.positioningNote}`);
            }
            if (bullet.originalBullet) {
                lines.push(`   Original Bullet: ${bullet.originalBullet}`);
            }
            lines.push("");
        });
    }
    if (atsKeywords.length > 0) {
        lines.push("ATS Keywords:");
        atsKeywords.forEach((keyword, index) => {
            const suggestion = keyword.status === "Missing" && keyword.suggestion ? ` - ${keyword.suggestion}` : "";
            lines.push(`${index + 1}. ${keyword.keyword ?? ""} (${keyword.status ?? "Unknown"})${suggestion}`);
        });
        lines.push("");
    }
    if (gapAnalysis.length > 0) {
        lines.push("Gap Analysis:");
        gapAnalysis.forEach((gap, index) => {
            lines.push(`${index + 1}. ${gap.gap ?? ""}`);
            lines.push(`   Recommendation: ${gap.recommendation ?? ""}`);
        });
    }

    return lines
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function downloadTextFile(fileName: string, content: string): void {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
}

export function ResultsDashboard({ data, isStreaming = false }: ResultsDashboardProps) {
    const [copiedAll, setCopiedAll] = useState(false);
    const [showScrollHint, setShowScrollHint] = useState(false);
    const [hiddenBulletCount, setHiddenBulletCount] = useState(0);
    const copyFeedbackTimerRef = useRef<number | null>(null);
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const hasScrolledBulletsRef = useRef(false);
    const bulletCount = data.resumeOptimization?.bulletAnalysis?.length ?? 0;

    useEffect(() => {
        return () => {
            if (copyFeedbackTimerRef.current) {
                window.clearTimeout(copyFeedbackTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        hasScrolledBulletsRef.current = false;

        const updateScrollHint = () => {
            const canScroll = viewport.scrollHeight > viewport.clientHeight + 4;
            const atBottom = viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 4;
            const cards = Array.from(viewport.querySelectorAll<HTMLElement>("[data-bullet-card='true']"));
            const foldPosition = viewport.scrollTop + viewport.clientHeight;
            const remainingCards = cards.filter((card) => card.offsetTop >= foldPosition - 12).length;

            if (viewport.scrollTop > 8) {
                hasScrolledBulletsRef.current = true;
            }

            setHiddenBulletCount(canScroll ? remainingCards : 0);
            setShowScrollHint(canScroll && !atBottom && !hasScrolledBulletsRef.current);
        };

        updateScrollHint();
        viewport.addEventListener("scroll", updateScrollHint, { passive: true });

        const resizeObserver = new ResizeObserver(updateScrollHint);
        resizeObserver.observe(viewport);

        return () => {
            viewport.removeEventListener("scroll", updateScrollHint);
            resizeObserver.disconnect();
        };
    }, [bulletCount]);

    const handleCopy = async (text: string) => {
        if (!text) return;
        await navigator.clipboard.writeText(text);
    };

    const handleCopyAll = async () => {
        await navigator.clipboard.writeText(buildExportText(data));
        setCopiedAll(true);
        if (copyFeedbackTimerRef.current) {
            window.clearTimeout(copyFeedbackTimerRef.current);
        }
        copyFeedbackTimerRef.current = window.setTimeout(() => setCopiedAll(false), 1800);
    };

    const handleDownload = () => {
        const dateStamp = new Date().toISOString().slice(0, 10);
        downloadTextFile(`resume-tailor-export-${dateStamp}.txt`, buildExportText(data));
    };

    return (
        <div className="space-y-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-stone-600">
                        {isStreaming
                            ? "Results are still generating. You can copy sections now and export once finished."
                            : "Results are ready. Copy everything at once or download a text export."}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="bg-stone-100 hover:bg-stone-200 text-stone-700"
                            onClick={handleCopyAll}
                        >
                            <Copy className="h-3.5 w-3.5 mr-1.5" />
                            {copiedAll ? "Copied" : "Copy All"}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-stone-300 text-stone-700 hover:bg-stone-50"
                            onClick={handleDownload}
                        >
                            <Download className="h-3.5 w-3.5 mr-1.5" />
                            Download .txt
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full">
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
                            <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-xs leading-relaxed text-stone-600 space-y-1">
                                <p className="font-medium text-stone-700 flex items-center gap-1.5">
                                    <Info className="h-3.5 w-3.5" />
                                    Match score guide
                                </p>
                                <p><span className="font-semibold">5/5:</span> Highly aligned with the job language and impact.</p>
                                <p><span className="font-semibold">4/5:</span> Strong match, but can be more specific or keyword-rich.</p>
                                <p><span className="font-semibold">3/5 or below:</span> Partial match and should be revised first.</p>
                            </div>
                            <div className="relative">
                                <ScrollArea type="always" className="h-[400px] pr-4" viewportRef={viewportRef}>
                                    <div className="space-y-4">
                                        {data.resumeOptimization?.bulletAnalysis?.map((bullet, i) => {
                                            const score = bullet?.relevanceScore;
                                            const scoreClasses = getScoreClasses(score);

                                            return (
                                                <div key={i} data-bullet-card="true" className="p-4 rounded-lg border border-stone-200 bg-white space-y-3">
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
                                                    <div className="flex items-center justify-between text-xs gap-2">
                                                        <span className="text-stone-500">{bullet?.positioningNote}</span>
                                                        <div className="flex items-center space-x-1">
                                                            <span className="text-stone-400">Match:</span>
                                                            <span className={`px-2 py-1 rounded-full border font-bold ${scoreClasses.badge} ${scoreClasses.text}`}>
                                                                {typeof score === "number" ? `${score}/5` : "N/A"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </ScrollArea>

                                {showScrollHint && (
                                    <div className="pointer-events-none absolute inset-x-0 bottom-0">
                                        <div className="h-14 bg-gradient-to-t from-white via-white/90 to-transparent" />
                                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-stone-300 bg-white/95 px-3 py-1 text-[11px] font-medium text-stone-600 shadow-sm">
                                            {hiddenBulletCount > 0 ? `Scroll for ${hiddenBulletCount} more bullets` : "Scroll for more bullets"}
                                        </div>
                                    </div>
                                )}
                            </div>
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
    </div>
    );
}
