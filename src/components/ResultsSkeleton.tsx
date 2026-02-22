import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Linkedin, FileText } from "lucide-react";

function SkeletonLine({ className = "" }: { className?: string }) {
    return <div className={`h-3 bg-stone-200 rounded animate-pulse ${className}`} />;
}

function SkeletonBlock({ className = "" }: { className?: string }) {
    return <div className={`bg-stone-200 rounded-lg animate-pulse ${className}`} />;
}

export function ResultsSkeleton() {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full">

            {/* LEFT COLUMN: JD Analysis */}
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
                                {[1, 2, 3].map((i) => (
                                    <SkeletonBlock key={i} className="h-10 border border-stone-200" />
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-stone-500 mb-2 mt-4">Implicit Focus</h4>
                            <div className="space-y-2">
                                {[1, 2].map((i) => (
                                    <SkeletonBlock key={i} className="h-10 border border-stone-200" />
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-stone-500 mb-2 mt-4">Problems to Solve</h4>
                            <div className="pl-4 space-y-2">
                                <SkeletonLine className="w-4/5" />
                                <SkeletonLine className="w-3/5" />
                                <SkeletonLine className="w-4/6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* MIDDLE COLUMN: LinkedIn Content */}
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
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-3 rounded-lg border border-stone-200 bg-stone-50 space-y-2">
                                    <SkeletonLine className="w-20 h-2" />
                                    <SkeletonLine className="w-full" />
                                </div>
                            ))}
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-stone-500">About Section</h4>
                            <div className="p-4 rounded-lg border border-stone-200 bg-stone-50 space-y-2">
                                <SkeletonLine className="w-full" />
                                <SkeletonLine className="w-full" />
                                <SkeletonLine className="w-5/6" />
                                <SkeletonLine className="w-full" />
                                <SkeletonLine className="w-3/4" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* RIGHT COLUMN: Resume Optimization */}
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
                            <div className="h-[400px] overflow-hidden space-y-4 pr-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="p-4 rounded-lg border border-stone-200 bg-white space-y-3">
                                        <SkeletonLine className="w-full" />
                                        <SkeletonLine className="w-4/5" />
                                        <div className="pl-3 border-l-2 border-stone-200">
                                            <SkeletonLine className="w-3/4 h-2" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <SkeletonLine className="w-1/3 h-2" />
                                            <SkeletonLine className="w-12 h-2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-stone-500">ATS Keywords</h4>
                                <div className="space-y-2">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="p-2 rounded bg-stone-50 border border-stone-200">
                                            <SkeletonLine className="w-2/3 h-2" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-stone-500">Gap Analysis</h4>
                                <div className="space-y-2">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="p-2 rounded bg-stone-50 border border-stone-200 space-y-1">
                                            <SkeletonLine className="w-1/2 h-2" />
                                            <SkeletonLine className="w-full h-2" />
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
