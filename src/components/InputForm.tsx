"use client";

import { useState } from "react";
import Link from "next/link";
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
        website: "",
        formStartedAt: Date.now(),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            formStartedAt: formData.formStartedAt || Date.now(),
        });
    };

    return (
        <Card className="w-full border-stone-200 bg-white shadow-sm overflow-hidden rounded-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-stone-400 via-stone-500 to-stone-600" />
            <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-semibold tracking-tight">Optimization Studio</CardTitle>
                <CardDescription className="text-stone-500">
                    Paste your target job description and current resume to generate tailored content.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="hidden" aria-hidden="true">
                        <Label htmlFor="website">Website</Label>
                        <Input
                            id="website"
                            name="website"
                            tabIndex={-1}
                            autoComplete="off"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentRole" className="text-stone-600">Current Role</Label>
                            <Input
                                id="currentRole"
                                placeholder="e.g. Senior Account Manager"
                                value={formData.currentRole}
                                onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                                className="bg-stone-50 border-stone-200 focus-visible:ring-stone-400 text-stone-900"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="targetRole" className="text-stone-600">Target Role</Label>
                            <Input
                                id="targetRole"
                                placeholder="e.g. Sales Enablement Manager"
                                value={formData.targetRole}
                                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                                className="bg-stone-50 border-stone-200 focus-visible:ring-stone-400 text-stone-900"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="jobDescription" className="text-stone-600">Job Description</Label>
                        <Textarea
                            id="jobDescription"
                            placeholder="Paste the full job description here..."
                            value={formData.jobDescription}
                            onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                            className="bg-stone-50 border-stone-200 focus-visible:ring-stone-400 min-h-[160px] resize-none text-stone-900"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="resumeText" className="text-stone-600">Master Resume / Bullets</Label>
                        <Textarea
                            id="resumeText"
                            placeholder="Paste your current resume bullets or full text..."
                            value={formData.resumeText}
                            onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
                            className="bg-stone-50 border-stone-200 focus-visible:ring-stone-400 min-h-[160px] resize-none text-stone-900"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-stone-900 hover:bg-stone-800 text-white font-medium h-12 rounded-xl transition-all duration-300 ease-in-out"
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

                    <p className="text-xs leading-relaxed text-stone-500">
                        By submitting, you agree to our{" "}
                        <Link href="/terms" className="font-medium text-stone-700 hover:text-stone-900 underline underline-offset-2">
                            Terms
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="font-medium text-stone-700 hover:text-stone-900 underline underline-offset-2">
                            Privacy Policy
                        </Link>
                        . Do not submit highly sensitive personal data.
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
