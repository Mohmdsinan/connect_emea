import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Events from "@/const/data/Events.tsx";
import Tab from "./components/tabs";
import { motion } from "framer-motion";
import { Share2 } from "lucide-react";
import html2canvas from 'html2canvas';

const Spinner = () => {
    return (
        <div className="flex justify-center items-center mt-20">
            <div className="border-t-transparent border-solid animate-spin border-orange-500 border-8 border-t-8 rounded-full h-16 w-16"></div>
        </div>
    );
};

function SingleEvent() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const eventId = Number(id);
    const event = Events.find((event) => event.id === eventId);

    // Helper to save blob as file
    const saveBlobAsFile = (blob, fileName) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Share poster with image and website URL
    const handleShare = async () => {
        const poster = document.getElementById('poster');
        if (!poster) {
            console.error('Poster element not found');
            return;
        }

        try {
            const canvas = await html2canvas(poster, {
                scale: 2,
                useCORS: true,
                allowTaint: false,
                backgroundColor: '#ffffff',
                logging: false
            });

            canvas.toBlob(async (blob) => {
                if (!blob) {
                    console.error('Failed to create blob');
                    return;
                }

                const fileName = `${event?.title || 'event'}-poster.png`;
                const file = new File([blob], fileName, { type: 'image/png' });

                // Check if Web Share API is available and can share files
                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            title: event?.title || 'Exciting Event',
                            text: `Check out this amazing event: ${event?.title}. Visit our website for more events: https://connectemea.in`,
                            url: "https://connectemea.in",
                            files: [file],
                        });
                        console.log('Share successful');
                    } catch (err) {
                        console.log('Web Share failed, falling back to download:', err);
                        // Fallback: download image and show message with URL
                        saveBlobAsFile(blob, fileName);
                        alert(`Poster downloaded! Share it along with our website: https://connectemea.in`);
                    }
                } else {
                    console.log('Web Share not supported, downloading instead');
                    // Fallback for browsers that don't support sharing files
                    saveBlobAsFile(blob, fileName);
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText("https://connectemea.in");
                        alert('Poster downloaded! Website URL (https://connectemea.in) copied to clipboard. Share both with your friends!');
                    } else {
                        alert('Poster downloaded! Share it along with our website: https://connectemea.in');
                    }
                }
            }, 'image/png', 0.9);
        } catch (error) {
            console.error('Error capturing poster:', error);
            // Ultimate fallback - just share the URL
            if (navigator.share) {
                await navigator.share({
                    title: event?.title || 'Exciting Event',
                    text: `Check out this event: ${event?.title}`,
                    url: "https://connectemea.in",
                });
            } else if (navigator.clipboard) {
                navigator.clipboard.writeText(`Check out ${event?.title} at https://connectemea.in`);
                alert('Event details copied to clipboard!');
            }
        }
    };

    if (loading) return <Spinner />;

    if (!event) {
        return (
            <div className="text-center my-10">
                <h1 className="text-2xl font-semibold">Event Not Found</h1>
                <p className="mt-4 text-gray-600">
                    We couldn't find the event you were looking for. Please check the URL
                    or return to the home page.
                </p>
            </div>
        );
    }

    const isMobile = window.innerWidth < 768;
    return (
        <div className="w-limit px-4 py-8">
            {/* Event Header */}
            <motion.div
                className="flex flex-col sm:flex-row items-center gap-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Left: Info */}
                <div className="sm:w-1/2 space-y-4 text-center sm:text-left">
                    <h2 className="font-bold text-3xl">{event.title}</h2>
                    <p className="text-gray-700 leading-relaxed">{event.big_description}</p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        {event.link && (
                            <motion.a
                                href={event.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-6 py-2 bg-orange-600 text-white font-semibold rounded-full shadow-md hover:bg-orange-500 transition text-sm sm:text-[16px]"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Join Event
                            </motion.a>
                        )}

                        <motion.button
                            onClick={handleShare}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2 border-2 border-orange-600 text-orange-600 font-bold rounded-full shadow-sm hover:bg-orange-50 hover:border-orange-500 transition text-sm sm:text-[16px]"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Share2 size={18} />
                            Share Event
                        </motion.button>
                    </div>

                </div>

                <motion.div
                    className="sm:w-1/2 w-full max-w-md mx-auto"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div
                        id="poster"
                        className="rounded-xl overflow-hidden flex items-center justify-center bg-white p-2"
                    >
                        <img
                            draggable={false}
                            onDragStart={(e) => e.preventDefault()}
                            src={event.image}
                            alt={event.title}
                            className="max-h-80 w-auto object-contain rounded-lg"
                        />
                    </div>
                </motion.div>
            </motion.div>

            {/* About Section */}
            <motion.div
                className="mt-10"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: isMobile ? 0.05 : 0.2 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="font-semibold text-2xl mb-4">About</h2>
                <Tab about={event.about} />
            </motion.div>
        </div>
    );
}

export default SingleEvent;