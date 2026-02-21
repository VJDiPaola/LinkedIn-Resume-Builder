"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { InputType } from "@/lib/schemas";

interface InputFormProps {
    onSubmit: (data: InputType) => void;
    isLoading: boolean;
}

export function InputForm({ onSubmit, isLoading }: InputFormProps) {
    const [formData, setFormData] = useState({
        currentRole: "",
        targetRole: "",
        jobDescription: "",
        resumeText: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Card className="w-full border-zinc-800 bg-zinc-950/50 backdrop-blur-xl shadow-2xl overflow-hidden rounded-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-semibold tracking-tight">Optimization Studio</CardTitle>
                <CardDescription className="text-zinc-400">
                    Paste your target job description and current resume to generate tailored content.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentRole" className="text-zinc-300">Current Role</Label>
                            <Input
                                id="currentRole"
                                placeholder="e.g. Senior Account Manager"
                                value={formData.currentRole}
                                onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                                className="bg-zinc-900 border-zinc-800 focus-visible:ring-indigo-500 text-zinc-100"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="targetRole" className="text-zinc-300">Target Role</Label>
                            <Input
                                id="targetRole"
                                placeholder="e.g. Sales Enablement Manager"
                                value={formData.targetRole}
                                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                                className="bg-zinc-900 border-zinc-800 focus-visible:ring-indigo-500 text-zinc-100"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="jobDescription" className="text-zinc-300">Job Description</Label>
                        <Textarea
                            id="jobDescription"
                            placeholder="Paste the full job description here..."
                            value={formData.jobDescription}
                            onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                            className="bg-zinc-900 border-zinc-800 focus-visible:ring-indigo-500 min-h-[160px] resize-none text-zinc-100"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="resumeText" className="text-zinc-300">Master Resume / Bullets</Label>
                        <Textarea
                            id="resumeText"
                            placeholder="Paste your current resume bullets or full text..."
                            value={formData.resumeText}
                            onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
                            className="bg-zinc-900 border-zinc-800 focus-visible:ring-indigo-500 min-h-[160px] resize-none text-zinc-100"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium h-12 rounded-xl transition-all duration-300 ease-in-out hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Processing Analysis...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-5 w-5" />
                                Optimize Profile
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
