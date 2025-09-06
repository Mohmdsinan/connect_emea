import React from "react";
import { Timeline } from "@/components/ui/timeline.jsx";

export function TimelineDemo() {
    const data = [
        {
            title: "Welcome",
            content: (
                <div>
                    <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
                        New members join our student community, get onboarded, and start
                        connecting with peers across different departments.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg"
                            alt="orientation"
                            className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b"
                            alt="welcome event"
                            className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Explore",
            content: (
                <div>
                    <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
                        Students explore clubs, events, hackathons, and workshops that match
                        their interests — from tech to arts to entrepreneurship.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
                            alt="club fair"
                            className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                            alt="student activities"
                            className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Build",
            content: (
                <div>
                    <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
                        Members collaborate on projects, research, and competitions — building
                        both technical and leadership skills.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg"
                            alt="teamwork"
                            className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
                            alt="innovation"
                            className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Learn",
            content: (
                <div>
                    <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
                        Through workshops, peer-to-peer sessions, and mentorship, students
                        enhance their academic and professional knowledge.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="https://images.unsplash.com/photo-1529070538774-1843cb3265df"
                            alt="workshop"
                            className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1503676382389-4809596d5290"
                            alt="study group"
                            className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Refine",
            content: (
                <div>
                    <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
                        Students polish their skills and portfolios by:
                    </p>
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">✅ Contributing to open-source</div>
                        <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">✅ Presenting research papers</div>
                        <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">✅ Attending mock interviews</div>
                        <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">✅ Hosting community events</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg"
                            alt="student showcase"
                            className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1596495577886-d920f1fb7238"
                            alt="skills growth"
                            className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Lead",
            content: (
                <div>
                    <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
                        Senior members mentor juniors, organize campus-wide events, and take
                        leadership roles in clubs and student bodies.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf"
                            alt="student leaders"
                            className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
                        />
                        <img
                            src="https://images.pexels.com/photos/256659/pexels-photo-256659.jpeg"
                            alt="mentorship"
                            className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Graduate",
            content: (
                <div>
                    <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
                        Students graduate with not only degrees but also lifelong networks,
                        practical experience, and community-driven memories.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b"
                            alt="graduation ceremony"
                            className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1596495577886-d920f1fb7238"
                            alt="student success"
                            className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
                        />
                    </div>
                </div>
            ),
        },
    ];
    return (
        <div className="relative w-full overflow-clip">
            <Timeline data={data} />
        </div>
    );
}
