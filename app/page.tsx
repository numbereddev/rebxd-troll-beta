"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./page.css";

type Step = "form" | "verifying" | "approved" | "video";

const PROGRESS_MESSAGES = [
    "Verifying you're in the Discord server",
    "Feeding the chickens",
    "Making sure the data is byte-safe",
    "Fixing your broken marriage",
    "Preparing for launch",
];

export default function Home() {
    const [step, setStep] = useState<Step>("form");

    const [usageField, setUsageField] = useState("");
    const [ownerEmail, setOwnerEmail] = useState("");
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");

    const [progress, setProgress] = useState(6);
    const [messageIndex, setMessageIndex] = useState(0);
    const [redirectCountdown, setRedirectCountdown] = useState(4);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const redirectProgress = useMemo(() => {
        return ((4 - redirectCountdown) / 4) * 100;
    }, [redirectCountdown]);

    const isFormValid = useMemo(() => {
        return (
            usageField.trim().length >= 3 &&
            ownerEmail.includes("@") &&
            projectName.trim().length >= 2 &&
            projectDescription.trim().length >= 3
        );
    }, [usageField, ownerEmail, projectName, projectDescription]);

    useEffect(() => {
        if (step !== "verifying") return;

        const progressStops = [14, 33, 58, 79, 95, 100];
        let stopIndex = 0;

        const interval = setInterval(() => {
            setProgress(progressStops[stopIndex]);
            setMessageIndex(Math.min(stopIndex, PROGRESS_MESSAGES.length - 1));
            stopIndex += 1;

            if (stopIndex >= progressStops.length) {
                clearInterval(interval);
                setStep("approved");
            }
        }, 850);

        return () => clearInterval(interval);
    }, [step]);

    useEffect(() => {
        if (step !== "approved") return;

        const interval = setInterval(() => {
            setRedirectCountdown((current) => {
                if (current <= 1) {
                    clearInterval(interval);
                    setStep("video");
                    return 0;
                }

                return current - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [step]);

    useEffect(() => {
        if (step !== "video") return;

        const video = videoRef.current;
        if (!video) return;

        video.muted = false;
        video.currentTime = 0;

        const playVideo = async () => {
            try {
                await video.play();
            } catch {
                video.muted = true;
                try {
                    await video.play();
                } catch {
                    // ignore autoplay failures
                }
            }
        };

        void playVideo();
    }, [step]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!isFormValid) return;

        setProgress(6);
        setMessageIndex(0);
        setRedirectCountdown(4);
        setStep("verifying");
    }

    if (step === "verifying") {
        return (
            <main className="min-h-screen bg-[#0d0d0d] text-[#f2f2f2]">
                <div className="mx-auto max-w-4xl flex flex-col gap-6 pt-8">
                    <section className="border border-white/10 bg-[#141414] p-6 flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="text-sm uppercase tracking-[0.2em] text-white/45">
                                Submission in progress
                            </div>
                            <h1 className="text-3xl font-semibold">Submitting...</h1>
                            <p className="text-sm text-white/60">
                                We&apos;re preparing some last steps...
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between text-sm text-white/60">
                                <span>{PROGRESS_MESSAGES[messageIndex]}</span>
                                <span>{progress}%</span>
                            </div>

                            <div className="h-3 overflow-hidden rounded-full bg-white/10">
                                <div
                                    className="h-full rounded-full bg-white transition-all duration-700 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        <div className="grid gap-3">
                            {PROGRESS_MESSAGES.map((message, index) => {
                                const isComplete = index < messageIndex;
                                const isActive = index === messageIndex;

                                return (
                                    <div
                                        key={message}
                                        className={`flex items-center justify-between border px-4 py-3 text-sm transition-colors ${
                                            isComplete
                                                ? "border-white/20 bg-white/8 text-white"
                                                : isActive
                                                  ? "border-white/25 bg-white/5 text-white/90"
                                                  : "border-white/10 bg-[#101010] text-white/40"
                                        }`}
                                    >
                                        <span>{message}</span>
                                        <span>
                                            {isComplete
                                                ? "Done"
                                                : isActive
                                                  ? "In progress"
                                                  : "Queued"}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </main>
        );
    }

    if (step === "approved") {
        return (
            <main className="min-h-screen bg-[#0d0d0d] text-[#f2f2f2]">
                <div className="mx-auto max-w-4xl flex flex-col gap-6 pt-8">
                    <section className="border border-white/10 bg-[#141414] p-6 flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="text-sm uppercase tracking-[0.2em] text-[#624EAC]/70">
                                Submission received
                            </div>
                            <h1 className="text-3xl font-semibold">All set.</h1>
                            <p className="text-sm text-white/60">
                                We&apos;re opening your submission status now.
                            </p>
                        </div>

                        <div className="border border-white/10 bg-[#101010] p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                                        Next step
                                    </div>
                                    <div className="mt-1 text-sm text-white/85">
                                        Loading your submission status
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                                        Opening in
                                    </div>
                                    <div className="mt-1 text-2xl font-semibold">
                                        {redirectCountdown}s
                                    </div>
                                </div>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                <div
                                    className="h-full rounded-full bg-[#624EAC] transition-all duration-1000 ease-linear"
                                    style={{ width: `${redirectProgress}%` }}
                                />
                            </div>
                        </div>

                        <p className="text-sm text-white/45">
                            If nothing happens, your submission status will open automatically.
                        </p>
                    </section>
                </div>
            </main>
        );
    }

    if (step === "video") {
        return (
            <main className="min-h-screen bg-black text-white">
                <video
                    ref={videoRef}
                    className="h-screen w-screen object-cover"
                    src="/rickroll.mp4"
                    controls={false}
                    playsInline
                    autoPlay
                />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0d0d0d] text-[#f2f2f2]">
            <div className="mx-auto max-w-4xl flex flex-col gap-6 pt-8">
                <section>
                    <h1 className="text-4xl font-semibold mb-6">Join the waitlist</h1>
                    <form
                        onSubmit={handleSubmit}
                        className="border border-white/10 bg-[#141414] p-6 flex flex-col gap-6"
                    >
                        <div className="flex items-start justify-between gap-1">
                            <div>
                                <div className="text-sm text-white/45">Waitlist process</div>
                                <h1 className="mt-2 text-2xl font-semibold">
                                    Claim your first beta seat
                                </h1>
                            </div>
                        </div>

                        <div className="border border-white/10 bg-[#101010]">
                            <div className="border-b border-white/10 px-4 py-3 text-sm font-medium">
                                Kicking things off
                            </div>
                            <div className="grid gap-5 p-4 md:grid-cols-2">
                                <label className="block">
                                    <span className="mb-2 block text-sm text-white/70">
                                        What&apos; your Discord username?
                                    </span>
                                    <input
                                        value={ownerEmail}
                                        type="username"
                                        onChange={(e) => setOwnerEmail(e.target.value)}
                                        className="w-full border border-white/10 bg-[#0d0d0d] px-4 py-3 outline-none placeholder:text-white/25 focus:border-white/30"
                                        placeholder="@yourlocalsip"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-sm text-white/70">
                                        ...and for what do you plan on using Rebxd?
                                    </span>
                                    <input
                                        value={usageField}
                                        onChange={(e) => setUsageField(e.target.value)}
                                        className="w-full border border-white/10 bg-[#0d0d0d] px-4 py-3 outline-none placeholder:text-white/25 focus:border-white/30"
                                        placeholder="I plan on using rebxd to..."
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="border border-white/10 bg-[#101010]">
                            <div className="border-b border-white/10 px-4 py-3 text-sm font-medium">
                                What features are you most excited about using Rebxd?
                            </div>
                            <div className="p-4">
                                <div className="multi-picker w-full grid lg:grid-cols-3 md:grid-cols-2 gap-4">
                                    <label className="picker-item">
                                        <input type="checkbox" name="selection" value="item1" />
                                        <div className="picker-card">
                                            <h3>Rebxd Bedrock</h3>
                                        </div>
                                    </label>

                                    <label className="picker-item">
                                        <input type="checkbox" name="selection" value="item2" />
                                        <div className="picker-card">
                                            <h3>Rebxd Auth</h3>
                                        </div>
                                    </label>

                                    <label className="picker-item">
                                        <input type="checkbox" name="selection" value="item3" />
                                        <div className="picker-card">
                                            <h3>Rebxd Global Compute</h3>
                                        </div>
                                    </label>

                                    <label className="picker-item">
                                        <input type="checkbox" name="selection" value="item3" />
                                        <div className="picker-card">
                                            <h3>Rebxd Workers</h3>
                                        </div>
                                    </label>

                                    <label className="picker-item">
                                        <input type="checkbox" name="selection" value="item3" />
                                        <div className="picker-card">
                                            <h3>Rebxd Hunter</h3>
                                        </div>
                                    </label>
                                </div>

                                {/*<input
                                    value={excitedFeatures}
                                    onChange={(e) => setExcitedFeatures(e.target.value)}
                                    className="w-full border border-white/10 bg-[#0d0d0d] px-4 py-3 outline-none placeholder:text-white/25 focus:border-white/30"
                                    placeholder="I plan on using rebxd to..."
                                />*/}
                            </div>
                        </div>

                        <div className="border border-white/10 bg-[#101010]">
                            <div className="border-b border-white/10 px-4 py-3 text-sm font-medium">
                                What would be your first project?
                            </div>
                            <div className="grid gap-5 p-4 md:grid-cols-2">
                                <label className="block">
                                    <span className="mb-2 block text-sm text-white/70">
                                        Project name
                                    </span>
                                    <input
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        className="w-full border border-white/10 bg-[#0d0d0d] px-4 py-3 outline-none placeholder:text-white/25 focus:border-white/30"
                                        placeholder="My First Project"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-sm text-white/70">
                                        Description
                                    </span>
                                    <input
                                        value={projectDescription}
                                        onChange={(e) => setProjectDescription(e.target.value)}
                                        className="w-full border border-white/10 bg-[#0d0d0d] px-4 py-3 outline-none placeholder:text-white/25 focus:border-white/30"
                                        placeholder="A brief description of your project"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-white/55">
                                    Status: {isFormValid ? "Ready" : "Incomplete"}
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={!isFormValid}
                                className={`px-6 py-3 text-sm font-medium ${
                                    isFormValid
                                        ? "bg-white text-black"
                                        : "cursor-not-allowed bg-white/10 text-white/35"
                                }`}
                            >
                                Claim your spot in the waitlist
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
}
