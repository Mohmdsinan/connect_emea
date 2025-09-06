import { Riyad, Rasheed } from '@/assets/images/faculties';
import { Rashid, Saleel } from '@/assets/images/interns';

interface Card {
    id: number,
    name: string,
    role: string,
    office: string,
    image: string,
    content: string
}

const Cards: Card[] = [
    {
        id: 1,
        name: 'Riyad',
        role: 'Professor & Principal',
        office: 'Department of Computer Science',
        image: Riyad,
        content: `“Connect” is a game-changer. It's the perfect blend of practical, hands-on learning and genuine inspiration. The focus is not just on writing code, but on understanding how to innovate, team-up, build and even get it to market. The mentorship and support for students are invaluable. For anyone looking to go beyond the classroom and into the world of innovation, “Connect” is the place to be.`
    },
    {
        id: 2,
        name: 'Captain Abdul Rasheed P',
        role: 'Assistant Professor',
        office: 'Department of English',
        image: Rasheed,
        content: 'CONNECT is a vibrant student-led community at EMEA College that nurtures peer learning through training, boot camps on emerging technologies, and professional skill development. It is a futuristic space where collaboration and student initiative create truly magical results. I wholeheartedly wish them great success.'
    },
    {
        id: 3,
        name: 'Rashid ',
        role: 'Alumni & Senior Intern',
        office: 'Department of Computer Science',
        image: Rashid,
        content: 'Connect has been an incredible platform for me to grow both personally and professionally. The hands-on experience and collaborative environment have helped me develop skills that are essential in the tech industry. I am grateful for the opportunities and support provided by Connect, and I look forward to seeing how it continues to empower students in the future.'
    },
    {
        id: 4,
        name: 'Haulath k',
        role: 'Assistant Professor ',
        office: 'Department of Computer Science',
        image: Saleel,
        content: 'I am truly inspired by the enthusiasm and dedication of this student community. May your passion for learning and collaboration continue to guide you toward success and new achievements'
    }
]

export default Cards;
