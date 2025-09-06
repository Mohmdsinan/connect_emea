import Events from "@/const/data/Events";
import { Normal, Special } from "./components/EventCard";
import EmblaCarousel from "./components/Carousal/EmblaCarousel";
import EmblaCarousel2 from "./components/Carousal/EmblaCarousel2";
import NormalCard from "./components/EventCard/Normal";
import SlickCarousel from "./components/Carousal/SlickCarousel";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const OPTIONS = { loop: false, align: 'start' }

const Event = () => {
  const [selected, setSelected] = useState(null);
  const currentDate = new Date();

  // Sort events by date in descending order (most recent events first)
  const sortedEvents = Events.sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("/").map(Number); // Note the order
    const [dayB, monthB, yearB] = b.date.split("/").map(Number); // Note the order

    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);

    return dateB.getTime() - dateA.getTime();
  });

  // Separate events into categories
  const UpcomingEvents = sortedEvents.filter(event => {
    const [day, month, year] = event.date.split("/").map(Number);
    const eventDate = new Date(year, month - 1, day);
    return eventDate >= currentDate;
  });

  const PastEvents = sortedEvents.filter(event => {
    const [day, month, year] = event.date.split("/").map(Number);
    const eventDate = new Date(year, month - 1, day);
    return eventDate < currentDate;
  });

  // Select the latest 5 past events
  const RecentEvents = PastEvents.slice(0, 5);

  const neededEventsCount = 4 - UpcomingEvents.length;
  // Check if there is only one upcoming event
  if (neededEventsCount > 0 && RecentEvents.length > 0) {
    // Add the most recent past events to UpcomingEvents until we have 4
    for (let i = 0; i < neededEventsCount && i < RecentEvents.length; i++) {
      UpcomingEvents.push(RecentEvents[i]);
    }
  }

  // Debugging logs
  console.log('Upcoming Events:', UpcomingEvents);
  console.log('Recent Events:', RecentEvents);
  console.log('Past Events:', PastEvents);

  return (
    <div>
      {UpcomingEvents.length !== 0 && (
        <section className="bg-black text-white w-full overflow-hidden">
          <div className="w-limit w-full flex gap-4 p-4">
            <div className="flex flex-col items-start font-bold py-6 pt-8">
              <h2 className="text-[12px] md:text-[20px]">Upcoming</h2>
              <h1 className="text-[18px] md:text-[36px]">Events</h1>
            </div>
            <div className="max-w-full overflow-hidden py-4">
              <SlickCarousel slides={UpcomingEvents} color={'white'} />
            </div>
          </div>
        </section>
      )}

      {RecentEvents.length !== 0 && (
        <section className="flex p-4 gap-4 w-limit overflow-hidden bg-white">
          <div className="flex flex-col items-start font-bold py-6">
            <h2 className="text-[12px] md:text-[20px]">Recent</h2>
            <h1 className="text-[18px] md:text-[36px]">Events</h1>
          </div>
          <div className="max-w-full overflow-hidden pb-4">
            <SlickCarousel slides={RecentEvents} color={'black'} />
          </div>
        </section>
      )}

      {Events.length !== 0 && (
        <section className="flex flex-col md:flex-row md:p-4 gap-4 w-limit overflow-hidden">
          <div className="flex md:flex-col flex-row gap-2 items-center justify-center md:justify-start md:items-start font-bold py-6 ">
            <h2 className="text-[36px] md:text-[20px]">All</h2>
            <h1 className="text-[36px]">Events</h1>
          </div>
          <div className="flex-grow w-full mx-0 md:mx-auto pastEventsGrid grid grid-cols-2 ">
            {Events.map((event, index) => (
              <div className="mx-auto w-full" key={index}>
                <NormalCard data={event} key={index} layoutId={`card-${event.id}`} onClick={() => setSelected(event)} />
              </div>
            ))}
          </div>
        </section>
      )}

      {Events.length === 0 && (
        <div className="flex justify-center items-center my-10">
          <h1 className="text-2xl font-bold">No events to show</h1>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <>
            {/* Overlay with flex centering */}
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            >
              {/* Centered Expanded Card */}
              <motion.div
                layoutId={`card-${selected.id}`}
                className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
              >
                <motion.img
                  layoutId={`image-${selected.id}`}
                  src={selected.image}
                  alt={selected.title}
                  className="w-full h-60 object-cover"
                />
                <div className="p-5">
                  <p className="text-xs uppercase text-gray-500">
                    {selected.category}
                  </p>
                  <h2 className="text-xl font-bold mb-2">{selected.title}</h2>
                  <p className="text-gray-600">{selected.description}</p>
                  <button
                    className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
                    onClick={() => setSelected(null)}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Event;
