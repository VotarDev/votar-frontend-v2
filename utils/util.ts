import toast from "react-hot-toast";
import { RefObject } from "react";
import { v4 as uuidv4 } from "uuid";

export const logos = [
  {
    id: uuidv4(),
    image: "/assets/logos/man.png",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/oi.png",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/oau.png",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/afigist.png",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/nuasa.png",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/nice.png",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/nacss.png",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/napss.png",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/nesa.png",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/irsa.png",
  },
];

export const logos2 = [
  {
    id: uuidv4(),
    image: "/assets/logos/Logo/Accounting.jpg",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/Logo/AFRIGIST.jpg",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/Logo/BCH.jpg",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/Logo/Civil.jpg",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/Logo/Computer.png",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/Logo/Dentistry.jpg",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/Logo/Economics.jpg",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/Logo/InterRel.jpg",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/Logo/MCB.png",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/Logo/Medical.png",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/Logo/NLC.png",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/Logo/NMA.jpg",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/Logo/OONI.jpg",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/Logo/Political science.jpg",
  },
  {
    id: uuidv4(),
    image: "/assets/logos/Logo/URP.jpg",
  },
];

export const blogImages = [
  {
    id: uuidv4(),
    image: "/assets/images/blog-1.jpeg",
    title: "AT WIT July Hackathon — Data Protection and Privacy",
  },
  {
    id: uuidv4(),
    image: "/assets/images/blog-2.png",
    title: "How To: Send Data and Receive Reports using Africa’s Talking APIs",
  },
  {
    id: uuidv4(),
    image: "/assets/images/blog-3.jpeg",
    title: "A Recap of Our Developers’ Mid-Year Networking Party",
  },
];

export const posts = [
  {
    id: uuidv4(),
    image: "/assets/images/post-1.jpeg",
    title: "Africa’s Talking WIT Hackathon — Empowering Women to Use APIs",
    description:
      "For Africa’s Talking Women in Technology Community, the hackathon on Wednesday, the 26th was the best way to end the month of April. That month we set out to empower ladies to use APIs",
  },

  {
    id: uuidv4(),
    image: "/assets/images/post-2.jpeg",
    title: "Africa’s Talking -Airtime API: Basic Usage Guide",
    description:
      "Multiple providers offer airtime bundles in different packages and offers. We use airtime on a daily basis and for various purposes. Thought of how you can be able to send or receive airtime virtually",
  },

  {
    id: uuidv4(),
    image: "/assets/images/post-3.jpeg",
    title: "Africa’s Talking Women in Tech Anti-FGM Hackathon",
    description:
      "Given the heavy discussion on Female Genital Mutilation held during the February Hackathon for the Africa’s Talking Women in Technology community (as discussed in this article here) it was only fitting to crown this",
  },

  {
    id: uuidv4(),
    image: "/assets/images/post-4.jpeg",
    title: "Ensibuuko: Banking The Last Mile With Mobile Technology",
    description:
      "As economies continue to recover, mobile technology will be even more integral to how people live and how businesses operate. It will enable new digital solutions for small and large enterprises and support the",
  },

  {
    id: uuidv4(),
    image: "/assets/images/post-5.jpeg",
    title:
      "AT Women in Tech | Building Tech Solutions for the African Girl Child.",
    description:
      "As highlighted in our Female Genital Mutilation (FGM) hackathon-turned-discussion, FGM is a violence practice against African girls. It is widely prevalent in many African countries and is considered a violation of the human rights",
  },

  {
    id: uuidv4(),
    image: "/assets/images/post-6.jpeg",
    title: "AT Women in Tech | Anti-FGM Solutions Hackathon-turned-Discussion",
    description:
      "As stated by the World Health Organization, Female Genital Mutilation (FGM) comprises all procedures that involve partial or total removal of the external female genitalia, or other injury to the female genital organs for",
  },
];

export const faqs = [
  {
    id: uuidv4(),
    title: "How do I upgrade/downgrade my worksplace plan?",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, sequi quam modi quae necessitatibus iusto at hic similique enim earum sit. Quo ea adipisci corporis totam provident et dolor cumque laborum beatae sint quasi culpa itaque illum, fugiat animi quod harum amet est, accusantium ut doloremque! Quis ullam omnis, praesentium natus doloremque ex asperiores id consequuntur magni est unde iure saepe, placeat ",
  },
  {
    id: uuidv4(),
    title: "Can i add other information be added to an invoice?",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, sequi quam modi quae necessitatibus iusto at hic similique enim earum sit. Quo ea adipisci corporis totam provident et dolor cumque laborum beatae sint quasi culpa itaque illum, fugiat animi quod harum amet est, accusantium ut doloremque! Quis ullam omnis, praesentium natus doloremque ex asperiores id consequuntur magni est unde iure saepe, placeat ",
  },
  {
    id: uuidv4(),
    title: "When should I use a new table vs. a view?",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, sequi quam modi quae necessitatibus iusto at hic similique enim earum sit. Quo ea adipisci corporis totam provident et dolor cumque laborum beatae sint quasi culpa itaque illum, fugiat animi quod harum amet est, accusantium ut doloremque! Quis ullam omnis, praesentium natus doloremque ex asperiores id consequuntur magni est unde iure saepe, placeat ",
  },
  {
    id: uuidv4(),
    title: "How can I transfer data from one base to another?",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, sequi quam modi quae necessitatibus iusto at hic similique enim earum sit. Quo ea adipisci corporis totam provident et dolor cumque laborum beatae sint quasi culpa itaque illum, fugiat animi quod harum amet est, accusantium ut doloremque! Quis ullam omnis, praesentium natus doloremque ex asperiores id consequuntur magni est unde iure saepe, placeat ",
  },
  {
    id: uuidv4(),
    title: "How do I change my account email address?",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, sequi quam modi quae necessitatibus iusto at hic similique enim earum sit. Quo ea adipisci corporis totam provident et dolor cumque laborum beatae sint quasi culpa itaque illum, fugiat animi quod harum amet est, accusantium ut doloremque! Quis ullam omnis, praesentium natus doloremque ex asperiores id consequuntur magni est unde iure saepe, placeat ",
  },
  {
    id: uuidv4(),
    title: "How does billing work?",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, sequi quam modi quae necessitatibus iusto at hic similique enim earum sit. Quo ea adipisci corporis totam provident et dolor cumque laborum beatae sint quasi culpa itaque illum, fugiat animi quod harum amet est, accusantium ut doloremque! Quis ullam omnis, praesentium natus doloremque ex asperiores id consequuntur magni est unde iure saepe, placeat ",
  },
  {
    id: uuidv4(),
    title: "Can I share an individual app?",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, sequi quam modi quae necessitatibus iusto at hic similique enim earum sit. Quo ea adipisci corporis totam provident et dolor cumque laborum beatae sint quasi culpa itaque illum, fugiat animi quod harum amet est, accusantium ut doloremque! Quis ullam omnis, praesentium natus doloremque ex asperiores id consequuntur magni est unde iure saepe, placeat ",
  },
  {
    id: uuidv4(),
    title: "Can I epxort a list of all collaborators?",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, sequi quam modi quae necessitatibus iusto at hic similique enim earum sit. Quo ea adipisci corporis totam provident et dolor cumque laborum beatae sint quasi culpa itaque illum, fugiat animi quod harum amet est, accusantium ut doloremque! Quis ullam omnis, praesentium natus doloremque ex asperiores id consequuntur magni est unde iure saepe, placeat ",
  },
  {
    id: uuidv4(),
    title: "Can invoices be sent to other collaborators?",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, sequi quam modi quae necessitatibus iusto at hic similique enim earum sit. Quo ea adipisci corporis totam provident et dolor cumque laborum beatae sint quasi culpa itaque illum, fugiat animi quod harum amet est, accusantium ut doloremque! Quis ullam omnis, praesentium natus doloremque ex asperiores id consequuntur magni est unde iure saepe, placeat ",
  },
  {
    id: uuidv4(),
    title: "How do i contact support?",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, sequi quam modi quae necessitatibus iusto at hic similique enim earum sit. Quo ea adipisci corporis totam provident et dolor cumque laborum beatae sint quasi culpa itaque illum, fugiat animi quod harum amet est, accusantium ut doloremque! Quis ullam omnis, praesentium natus doloremque ex asperiores id consequuntur magni est unde iure saepe, placeat ",
  },
];

export const elections = [
  {
    id: uuidv4(),
    title: "NATIONALL ASSOCIATION OF POLITICAL SCIENCE ANALYST",
    start: "Election Starts at Monday, 4th July, 2022 8:00 AM",
    end: "Election End by Monday, 4th July, 2022 5:00 PM",
    style: "#014DC2",
    border: "#001F4E",
  },
  {
    id: uuidv4(),
    title: "NATIONALL ASSOCIATION OF POLITICAL SCIENCE ANALYST",
    start: "Election Starts at Monday, 4th July, 2022 8:00 AM",
    end: "Election End by Monday, 4th July, 2022 5:00 PM",
    style: "#93241F",
    border: "#49120F",
  },
  {
    id: uuidv4(),
    title: "NATIONALL ASSOCIATION OF POLITICAL SCIENCE ANALYST",
    start: "Election Starts at Monday, 4th July, 2022 8:00 AM",
    end: "Election End by Monday, 4th July, 2022 5:00 PM",
    style: "#E46F24",
    border: "#723812",
  },
];

export const electionPlans = [
  {
    id: uuidv4(),
    plan: "Free Votar",
    desc: "Create an Election for free Raise funds for your event, make her Election participants pay to get more voting power to vote their preffered Candidates and increase their chances of emerging as the winner OR Let your voters cast their votes for free without having to pay",
    btnText: "Lets go vote",
  },
  {
    id: uuidv4(),
    plan: "Votar Pro",
    desc: "Create an Election that has all the Privacy and security features you would need to make your election free, fair and credible Here, a Voter can vote for the preffered candidate Once and once only.",
    btnText: "Lets go vote",
  },
  {
    id: uuidv4(),
    plan: "Votar Meeting",
    desc: "Create an Election for free Raise funds for your event, make her Election participants pay to get more voting power to vote their preffered Candidates and increase their chances of emerging as the winner OR Let your voters cast their votes for free without having to pay",
    btnText: "Lets go vote",
  },
];

export const tabelContents = [
  {
    id: uuidv4(),
    electionName: "National Association of Political science analyst",
    startDate: "4th July, 2022 8:00 AM",
    endDate: "4th July, 2022 5:00 PM",
    createdBy: "Damola Alausa",
  },
  {
    id: uuidv4(),
    electionName: "National Association of Political science analyst",
    startDate: "4th July, 2022 8:00 AM",
    endDate: "4th July, 2022 5:00 PM",
    createdBy: "Damola Alausa",
  },
];

export const activitiesContent = [
  {
    id: uuidv4(),
    name: "National Association of Political Analysts",
    type: "Votar Pro",
    date: "21st October, 2023",
    time: "08:00 HRS -  17:00 HRS",
    quantity: 2000,
    amount: 200000,
    status: "pending",
  },
  {
    id: uuidv4(),
    name: "National Institution of Mechanical Engineers",
    type: "Votar Pro",
    date: "7th August, 2023",
    time: "09:00 HRS -  18:00 HRS",
    quantity: 1500,
    amount: 150000,
    status: "paid",
  },
  {
    id: uuidv4(),
    name: "Most Beautiful Girl in Nigeria",
    type: "Free Votar",
    date: "11th August, 2023",
    time: "06:00 HRS -  21:00 HRS",
    quantity: 3000,
    amount: 30000,
    status: "paid",
  },
  {
    id: uuidv4(),
    name: "Accounting Dinner Awards",
    type: "Free Votar",
    date: "3rd August, 2023",
    time: "22:00 HRS -  17:30 HRS",
    quantity: 6000,
    amount: 600000,
    status: "paid",
  },
  {
    id: uuidv4(),
    name: "Tomiade@gmail.com",
    type: "Votar Credit",
    date: "15th September, 2023",
    time: "08:00 HRS -  19:10 HRS",
    quantity: 50000,
    amount: 500000,
    status: "paid",
  },
  {
    id: uuidv4(),
    name: "Samueloj34@gmail.com",
    type: "Votar Credit",
    date: "18th July, 2023",
    time: "08:00 HRS -  17:00 HRS",
    quantity: 70000,
    amount: 7000000,
    status: "paid",
  },
  {
    id: uuidv4(),
    name: "Solomon2@gmail.com",
    type: "Votar Credit",
    date: "28th June, 2023",
    time: "08:00 HRS -  14:00 HRS",
    quantity: 150000,
    amount: 1500000,
    status: "paid",
  },
  {
    id: uuidv4(),
    name: "Nigerian Bar Association",
    type: "Votar Pro",
    date: "13th May, 2023",
    time: "08:00 HRS -  23:00 HRS",
    quantity: 4500,
    amount: 450000,
    status: "paid",
  },
  {
    id: uuidv4(),
    name: "Nigerian Society of Engineers",
    type: "Votar Pro",
    date: "15th April, 2023",
    time: "08:00 HRS -  00:00 HRS",
    quantity: 3823,
    amount: 382300,
    status: "paid",
  },
];

export const electionsAdmin = [
  {
    id: uuidv4(),
    election: "NIPS Election",
    time: "07:00 HRS - 17:30 HRS",
    date: "11th January 2023",
    voterNo: 5000,
    email: "Kamara24@gmail.com",
    status: "success",
    amount: 150000,
    publish: false,
  },
  {
    id: uuidv4(),
    election: "NIMECHE Election",
    time: "14:00 HRS - 16:00 HRS",
    date: "2nd June 2023",
    voterNo: 2000,
    status: "pending",
    email: "Amanam35@gmail.com",
    amount: 200000,
    publish: false,
  },
];
export const freeVotarAccessRequest = [
  {
    id: uuidv4(),
    name: "Most Beautiful Girl in Nigeria",

    date: "11th August, 2023",
    time: "08:00 HRS -  18:20 HRS",
    status: "success",
    votarNumber: 2000,
    amount: 150000,
  },
  {
    id: uuidv4(),
    name: "Fanlink Artistry",

    date: "21st October, 2023",
    time: "06:00 HRS -  19:20 HRS",
    status: "pending",
    votarNumber: 2000,
    amount: 150000,
  },
];

export const votarProAcessRequest = [
  {
    id: uuidv4(),
    name: "National Association of Political Analysts Association",
    date: "11th August, 2023",
    time: "08:00 HRS -  18:20 HRS",
    status: "pending",
    votarNumber: 2000,
    amount: 150000,
  },
  {
    id: uuidv4(),
    name: "NNPC Board Election",
    date: "21st October, 2023",
    time: "06:00 HRS -  19:20 HRS",
    status: "success",
    votarNumber: 2000,
    amount: 150000,
  },
];

export const freeVotarPower = [
  {
    id: uuidv4(),
    email: "Kamara24@gmail.com",
    user: "S. Ade",
    electionNo: 3,
  },
  {
    id: uuidv4(),
    email: "Amanam35@gmail.com",
    user: "KLU",
    electionNo: 5,
  },
];

export const votarProPower = [
  {
    id: uuidv4(),
    email: "Ayoade@gmail.com",
    user: "S. Ade",
    electionNo: 3,
  },
  {
    id: uuidv4(),
    email: "Amanam35@gmail.com",
    user: "KLU",
    electionNo: 5,
  },
];
export const adminVotarCreditTable = [
  {
    id: uuidv4(),
    email: "Kamara24@gmail.com",
    totalCredits: 10,
    defaultCredit: 20,
  },
  {
    id: uuidv4(),
    email: "Amanam35@gmail.com",
    totalCredits: 100,
    defaultCredit: 50,
  },
];

export const voteCandidate = [
  {
    positionName: "Most Beautiful Girl",
    allowAbstain: true,
    candiates: [
      {
        candidatesName: "Adeleke Olusegun",
        nickname: "Leke 1",
        details: "Details",
        image: "/assets/images/candidates/candidate-1.png",
        voteCount: 0,
      },
      {
        candidatesName: "Oluwaseun Mayowa",
        nickname: "Mr Mayor",
        details: "Details",
        image: "/assets/images/candidates/candidate-2.png",
        voteCount: 0,
      },
    ],
  },
];

export const adminCards = [
  {
    id: uuidv4(),
    plan: "free votar",
    votarCredits: "#",
    electionNumber: "#",
  },
  {
    id: uuidv4(),
    plan: "votar pro",
    votarCredits: "967,000",
    electionNumber: 500,
  },
  {
    id: uuidv4(),
    plan: "votar meeting",
    votarCredits: "#",
    electionNumber: "#",
  },
];

export const votingPositions = [
  {
    id: uuidv4(),
    title: "Chairman",
    numberOfVotes: 600,
  },
  {
    id: uuidv4(),
    title: "Vice Chairman",
    numberOfVotes: 600,
  },
  {
    id: uuidv4(),
    title: "Secretary",
    numberOfVotes: 600,
  },
];

export const votingCandidateBarGraph = [
  {
    position: "Chairman",
    candidates: [
      {
        name: "Adeleke Olusegun",
        datasets: [{ x: "Adeleke Olusegun", y: 150 }],
      },
      {
        name: "Oluwaseun Mayowa",
        datasets: [{ x: "Oluwaseun Mayowa", y: 100 }],
      },
      {
        name: "Olabunmi Sunkanmi",
        datasets: [{ x: "Olabunmi Sunkanmi", y: 350 }],
      },
      {
        name: "Abstained",
        datasets: [{ x: "Abstained", y: 20 }],
      },
    ],
  },
  {
    position: "Vice Chairman",
    candidates: [
      {
        name: "Goodman Sunday",
        datasets: [{ x: "Goodman Sunday", y: 600 }],
      },
      {
        name: "Abstained",
        datasets: [{ x: "Abstained", y: 20 }],
      },
    ],
  },
  {
    position: "Secretary",
    candidates: [
      {
        name: "Folasade Odeleye",
        datasets: [{ x: "Folasade Odeleye", y: 300 }],
      },
      {
        name: "Victor Samuel",
        datasets: [{ x: "Victor Samuel", y: 400 }],
      },
      {
        name: "Abstained",
        datasets: [{ x: "Abstained", y: 20 }],
      },
    ],
  },
];

export const votingCandidateLineGraph = [
  {
    position: "Chairman",
    candidates: [
      {
        name: "Adeleke Olusegun",
        datasets: [
          { x: "2022-10-03T0830", y: 0 },
          { x: "2022-10-03T10", y: 100 },
          { x: "2022-10-03T11", y: 100 },
          { x: "2022-10-03T13", y: 150 },
          // { x: "2022-10-03T1114", y: 150 },
          // { x: "2022-10-03T16", y: 150 },
        ],
      },
      {
        name: "Oluwaseun Mayowa",
        datasets: [
          { x: "2022-10-03T08", y: 0 },
          { x: "2022-10-03T09", y: 50 },
          { x: "2022-10-03T10", y: 50 },
          { x: "2022-10-03T11", y: 50 },
          { x: "2022-10-03T12", y: 50 },
          { x: "2022-10-03T13", y: 100 },
          // { x: "2022-10-03T14", y: 50 },
          // { x: "2022-10-03T15", y: 50 },
          // { x: "2022-10-03T16", y: 100 },
        ],
      },
      {
        name: "Olabunmi Sunkanmi",
        datasets: [
          { x: "2022-10-03T09", y: 0 },
          { x: "2022-10-03T10", y: 70 },
          { x: "2022-10-03T11", y: 70 },
          { x: "2022-10-03T13", y: 350 },
          // { x: "2022-10-03T13", y: 70 },
          // { x: "2022-10-03T14", y: 180 },
          // { x: "2022-10-03T14", y: 250 },
          // { x: "2022-10-03T16", y: 350 },
        ],
      },
      {
        name: "Abstained",
        datasets: [
          { x: "2022-10-03T08", y: 0 },
          { x: "2022-10-03T13", y: 20 },
        ],
      },
    ],
  },
  {
    position: "Vice Chairman",
    candidates: [
      {
        name: "Goodman Sunday",
        datasets: [
          { x: "2022-10-03T08", y: 0 },
          { x: "2022-10-03T10", y: 150 },
          { x: "2022-10-03T12", y: 150 },
          { x: "2022-10-03T14", y: 300 },
          { x: "2022-10-03T14", y: 400 },
          { x: "2022-10-03T18", y: 650 },
        ],
      },
      {
        name: "Abstained",
        datasets: [
          { x: "2022-10-03T08", y: 0 },
          { x: "2022-10-03T13", y: 20 },
        ],
      },
    ],
  },
  {
    position: "Secretary",
    candidates: [
      {
        name: "Folashade Odeleye",
        datasets: [
          { x: "2022-10-03T09", y: 0 },
          { x: "2022-10-03T0958", y: 80 },
          { x: "2022-10-03T0958", y: 100 },
          { x: "2022-10-03T12", y: 250 },
          { x: "2022-10-03T1730", y: 250 },
        ],
      },
      {
        name: "Victor Samuel",
        datasets: [
          { x: "2022-10-03T08", y: 0 },
          { x: "2022-10-03T0958", y: 150 },
          { x: "2022-10-03T1315", y: 150 },
          { x: "2022-10-03T1730", y: 448 },
        ],
      },
      {
        name: "Abstained",
        datasets: [
          { x: "2022-10-03T08", y: 0 },
          { x: "2022-10-03T13", y: 20 },
        ],
      },
    ],
  },
];

export const votingCandidatePositions = [
  {
    position: "Chairman",
    abstained: 20,
    candidate: [
      {
        name: "Adeleke Olusegun",
        nickname: "Leke 1",
        totalVote: 350,
        image: "/assets/images/candidates/candi-1.png",
      },
      {
        name: "Oluwaseun Mayowa",
        nickname: "Mr Mayor",
        totalVote: 100,
        image: "/assets/images/candidates/candi-2.png",
      },
      {
        name: "Olabunmi Sunkanmi",
        nickname: "Mrs B",
        totalVote: 150,
        image: "/assets/images/candidates/candi-3.png",
      },
    ],
  },
  {
    position: "Vice Chairman",
    abstained: 10,
    candidate: [
      {
        name: "Goodman Sunday",
        nickname: "G.S",
        totalVote: 600,
        image: "/assets/images/candidates/candi-4.png",
      },
    ],
  },
  {
    position: "Secretary",
    abstained: 2,
    candidate: [
      {
        name: "Folashade Odeleye",
        nickname: "F.O",
        totalVote: 216,
        image: "/assets/images/candidates/candi-5.png",
      },
      {
        name: "Victor Samuel",
        nickname: "V.k.O",
        totalVote: 384,
        image: "/assets/images/candidates/candi-6.png",
      },
    ],
  },
];

export const candidateVotes = [
  {
    position: "Chairman",
    abstained: 20,
    candidate: [
      {
        name: "Adeleke Olusegun",
        nickname: "Leke 1",
        vote: 0,
        image: "/assets/images/candidates/candi-1.png",
      },
      {
        name: "Oluwaseun Mayowa",
        nickname: "Mr Mayor",
        vote: 0,
        image: "/assets/images/candidates/candi-2.png",
      },
      {
        name: "Olabunmi Sunkanmi",
        nickname: "Mrs B",
        vote: 0,
        image: "/assets/images/candidates/candi-3.png",
      },
    ],
  },
  {
    position: "Vice Chairman",
    abstained: 10,
    candidate: [
      {
        name: "Goodman Sunday",
        nickname: "G.S",
        vote: 0,
        image: "/assets/images/candidates/candi-4.png",
      },
    ],
  },
  {
    position: "Secretary",
    abstained: 2,
    candidate: [
      {
        name: "Folashade Odeleye",
        nickname: "F.O",
        vote: 0,
        image: "/assets/images/candidates/candi-5.png",
      },
      {
        name: "Victor Samuel",
        nickname: "V.k.O",
        vote: 0,
        image: "/assets/images/candidates/candi-6.png",
      },
    ],
  },
];

export const users = [
  {
    id: uuidv4(),
    name: "Sam Johnson",
    email: "johnson@gmail.com",
    category: "election creator",
  },
  {
    id: uuidv4(),
    name: "Esther Akindele",
    email: "esther20@gmail.com",
    category: "voter",
  },
  {
    id: uuidv4(),
    name: "Silvia Bekky",
    email: "bekky@gmail.com",
    category: "voter",
  },
  {
    id: uuidv4(),
    name: "James Okon",
    email: "james100@gmail.com",
    category: "election creator, voter",
  },
  {
    id: uuidv4(),
    name: "Edidiong Sunday",
    email: "eddy@gmail.com",
    category: "election creator",
  },
];

export const fadeInAnimation = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * index,
    },
  }),
};

export const fadeZoomIn = {
  initial: {
    scale: 0.5,
    opacity: 0,
  },
  animate: (index: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: index * 0.2,
    },
  }),
};
export const slideLeft = {
  initial: {
    opacity: 0,
    x: -100,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
};
export const slideRight = {
  initial: {
    opacity: 0,
    x: 100,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
};

export const elementList = {
  initial: {
    opacity: 1,
    transition: {
      when: "afterChildren",
    },
  },
  animate: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};
export const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.3,
      type: "spring",
      damping: 55,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
    transition: {
      duration: 0.7,
    },
  },
};

export const drop = {
  hidden: {
    y: "-10px",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.2,
      type: "spring",
      damping: 55,
      stiffness: 700,
    },
  },
  exit: {
    y: "10px",
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export const generateTimeLabels = (
  startTime: any,
  endTime: any,
  interval: number
) => {
  const labels = [];
  let currentTime = startTime;

  while (currentTime <= endTime) {
    labels.push(currentTime);
    currentTime = addHours(currentTime, interval);
  }

  return labels;
};

const addHours = (time: any, hours: any) => {
  const [hourStr, minuteStr] = time.split(":");
  const currentHour = parseInt(hourStr, 10);
  const currentMinute = parseInt(minuteStr, 10);

  const newHour = (currentHour + hours) % 24;
  const newMinute = currentMinute;

  return `${padZero(newHour)}:${padZero(newMinute)}`;
};

// Function to pad a single-digit number with a leading zero
const padZero = (num: any) => (num < 10 ? `0${num}` : `${num}`);

export function ToText(node: any) {
  let tag = document.createElement("div");
  tag.innerHTML = node;
  node = tag.querySelector("p")?.textContent;
  return node;
}

export function getMimeTypeFromBase64(base64Data: any) {
  // Extract the data part of the Data URL
  const dataPart = base64Data.split(",")[0];

  // Extract the MIME type from the data part
  const mimeType = dataPart.match(/:(.*?);/)[1];

  return mimeType;
}

export const generateUniqueColors = (
  count: number,
  predefinedColors: string[]
) => {
  const usedColors = new Set<string>();
  const colors = [];

  for (let i = 0; i < count; i++) {
    const color = predefinedColors[i % predefinedColors.length];
    if (!usedColors.has(color)) {
      usedColors.add(color);
      colors.push(color);
    }
  }

  return colors;
};

export const handleCopyClick = async (
  targetRef: RefObject<HTMLSpanElement>
) => {
  if (targetRef.current) {
    const selectedText = targetRef.current.innerText;
    try {
      await navigator.clipboard.writeText(selectedText);

      toast.success("Copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy text:", error);
      toast.error("Copy operation failed. Please try again.");
    }
  }
};

export function shortenText(inputText: string) {
  // Define common words to be excluded
  const commonWords = ["of", "and", "is", "to", "in"];

  // Split the input text into words
  const words = inputText.split(" ");

  // Extract the first letter of each non-common word and convert to uppercase
  const acronym = words
    .filter((word) => !commonWords.includes(word.toLowerCase()))
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return acronym;
}

// const generateRandomColor = () => {
//   return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
//     Math.random() * 256
//   )}, ${Math.floor(Math.random() * 256)}, 1)`;
// };

export function formatDate(year: string, month: string, day: string) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = months[parseInt(month) - 1];
  return `${monthName} ${day}, ${year}`;
}

export const formatDateToISO = (dateString: string | undefined) => {
  if (dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
};

export const formatTimeToHHMM = (timestamp: number | undefined) => {
  if (timestamp) {
    const date = new Date(timestamp);
    const wastDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60 * 1000
    );
    const hours = String(wastDate.getHours()).padStart(2, "0");
    const minutes = String(wastDate.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }
};
