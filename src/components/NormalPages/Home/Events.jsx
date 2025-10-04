import EventCard from '../../Resuable/cards/EventCard'

import event1 from '../../../assets/event1.png'
import speaker1 from '../../../assets/speaker1.png'
import speaker2 from '../../../assets/speaker2.png'
import speaker3 from '../../../assets/speaker3.png'

import Button from "../../Resuable/Button"

const eventsList = [
  {
    id: 1,
    image: event1,
    title: "Transforming Futures: AI-Driven Seminars & Workshops",
    date: "25-06-2025",
    time: "10:00 AM - 11:30 AM",
    location: "Virtual",
    speakers: [
      {
        name: "Dr. Ananya Mehta",
        designation: "AI Researcher, Google",
        photo: speaker1, // make sure this exists in /public or import it
      },
      {
        name: "Rajiv Khanna",
        designation: "Placement Head, Infosys",
        photo: speaker2,
      },
      {
        name: "Dr. Ananya Mehta",
        designation: "AI Researcher, Google",
        photo: speaker3, // make sure this exists in /public or import it
      },
      {
        name: "Rajiv Khanna",
        designation: "Placement Head, Infosys",
        photo: speaker1,
      },
    ],
  },
  {
    id: 2,
    image: event1,
    title: "Transforming Futures: AI-Driven Seminars & Workshops",
    date: "28-06-2025",
    time: "2:00 PM - 3:30 PM",
    location: "Online",
    speakers: [
      {
        name: "Nidhi Patel",
        designation: "Career Coach, UpGrad",
        photo: speaker1,
      },
      {
        name: "Dr. Ananya Mehta",
        designation: "AI Researcher, Google",
        photo: speaker2, // make sure this exists in /public or import it
      },
      {
        name: "Rajiv Khanna",
        designation: "Placement Head, Infosys",
        photo: speaker3,
      },
      {
        name: "Dr. Ananya Mehta",
        designation: "AI Researcher, Google",
        photo: speaker1, // make sure this exists in /public or import it
      },
    ],
  },
];

const Events = () => {

  return (
    <section className="bg-white p-[50px] md:px-[150px] md:py-[75px]">
      <div className="flex items-center gap-2">
        <div className="w-[15px] h-[2px] bg-secondary"></div>
        <h6 className="text-[16px] font-semibold text-black">EVENTS</h6>
      </div>

      <div className="md:flex justify-between">
        <h1 className="w-full text-black text-[24px] font-bold max-w-[350px] lg:max-w-[500px]">
          Transforming Futures: AI-Driven{" "}
          <span className="text-primary font-bold">Seminars</span> &{" "}
          <span className="text-primary font-bold">Workshops</span>
        </h1>

        <Button text="Explore Our Events" className="hidden md:flex text-center" to="/events" />

      </div>

      <p className="w-full text-black text-[16px] font-medium text-left mt-[15px] mb-6">
        Our events are designed to provide unparalleled career development opportunities through AI-driven insights and industry expertise. From interactive workshops and insightful webinars to networking sessions and global education meetups, we bring together top professionals, educators, and aspiring individuals to exchange knowledge and unlock new possibilities.
        <br /><br />
        Stay connected and join us in shaping the future of career success!
      </p>

      <div className="grid grid-cols-1 gap-y-8">
        {eventsList.map((event) => (
          <EventCard
            key={event.id}
            image={event.image}
            title={event.title}
            date={event.date}
            time={event.time}
            location={event.location}
            speakers={event.speakers}
          />
        ))}
      </div>

      <div className="flex md:hidden justify-center mt-6">
        <Button text="Explore Our Events" to="/events" />
      </div>

    </section>
  )

}

export default Events
