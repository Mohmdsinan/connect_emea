import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Events from "@/const/data/Events.tsx";
import Tab from "./components/tabs";
import { motion } from "framer-motion";

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

    if (loading) return <Spinner />;

    if (!event) {
        return (
            <div className="text-center my-10">
                <h1 className="text-2xl font-semibold">Event Not Found</h1>
                <p className="mt-4 text-gray-600">
                    We couldn’t find the event you were looking for. Please check the URL
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
                    {event.link && (
                        <motion.a
                            href={event.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-4 px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Join Event
                        </motion.a>
                    )}
                </div>

                {/* Right: Image */}
                <motion.div
                    className="sm:w-1/2 w-full max-w-md mx-auto"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="rounded-xl overflow-hidden shadow-lg">
                        <img
                         draggable={false} // prevent dragging
                         onDragStart={(e) => e.preventDefault()}
                            src={event.image}
                            alt={event.title}
                            className="w-full h-80 object-cover"
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
