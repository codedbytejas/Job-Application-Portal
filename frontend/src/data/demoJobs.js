// Comprehensive demo data for real-world Job Application Portal experience

export const JOB_CATEGORIES = [
  { id: 'software', name: 'Software & Engineering', iconType: 'code', count: 48, color: '#3b82f6' },
  { id: 'frontend', name: 'Frontend & UI/UX', iconType: 'layers', count: 32, color: '#ec4899' },
  { id: 'backend', name: 'Backend & Cloud', iconType: 'database', count: 29, color: '#8b5cf6' },
  { id: 'data', name: 'Data Science & AI', iconType: 'cpu', count: 24, color: '#10b981' },
  { id: 'devops', name: 'DevOps & Security', iconType: 'lock', count: 18, color: '#f59e0b' },
  { id: 'product', name: 'Product & Project', iconType: 'target', count: 15, color: '#6366f1' }
];

export const TOP_COMPANIES = [
  {
    name: "TCS",
    initial: "T",
    color: "#1e40af",
    rating: 4.2,
    reviews: "45K+",
    employees: "500,000+",
    opportunities: "120+ open jobs",
    location: "Mumbai / Pan India",
    industry: "IT Services & Consulting",
    tagline: "Building on belief to transform business through tech.",
    benefits: ["Health Insurance", "Work from Home", "Upskilling Stipend", "Retirement Plans"]
  },
  {
    name: "Infosys",
    initial: "I",
    color: "#0284c7",
    rating: 4.1,
    reviews: "38K+",
    employees: "300,000+",
    opportunities: "95+ open jobs",
    location: "Pune / Bengaluru",
    industry: "Next-Gen Digital Services",
    tagline: "Navigate your next with global digital transformation leader.",
    benefits: ["Flexible Hours", "Medical Cover", "Annual Bonus", "Learning Subscriptions"]
  },
  {
    name: "Accenture",
    initial: "A",
    color: "#7c3aed",
    rating: 4.4,
    reviews: "52K+",
    employees: "700,000+",
    opportunities: "110+ open jobs",
    location: "Bengaluru / Gurugram",
    industry: "Cloud, AI & Strategy",
    tagline: "Let there be change. Innovate with high-impact global projects.",
    benefits: ["Hybrid Work", "Parental Leave", "Gym Subsidy", "Stock Purchase Plan"]
  },
  {
    name: "Capgemini",
    initial: "C",
    color: "#059669",
    rating: 4.0,
    reviews: "28K+",
    employees: "350,000+",
    opportunities: "80+ open jobs",
    location: "Mumbai / Hyderabad",
    industry: "Technology Transformation",
    tagline: "Get the future you want through sustainable digital engineering.",
    benefits: ["Remote Workdays", "Health Benefits", "Performance Rewards", "Mentorship"]
  },
  {
    name: "Wipro",
    initial: "W",
    color: "#ea580c",
    rating: 3.9,
    reviews: "31K+",
    employees: "250,000+",
    opportunities: "75+ open jobs",
    location: "Hyderabad / Chennai",
    industry: "Consulting & Tech Innovation",
    tagline: "Ambitions realized through deep tech and customer empathy.",
    benefits: ["Wellness Allowance", "Provident Fund", "Global Mobility", "Career Growth"]
  },
  {
    name: "Deloitte",
    initial: "D",
    color: "#16a34a",
    rating: 4.5,
    reviews: "42K+",
    employees: "400,000+",
    opportunities: "60+ open jobs",
    location: "Mumbai / Bengaluru",
    industry: "Audit, Consulting & Tech Strategy",
    tagline: "Making an impact that matters for leaders across industries.",
    benefits: ["Comprehensive Medical", "Tuition Reimbursement", "Hybrid Flexibility", "Bonus"]
  }
];

export const DEMO_JOBS = [
  {
    _id: "demo-1",
    title: "Software Engineer",
    company: "TCS",
    companyInitial: "T",
    companyColor: "#1e40af",
    location: "Mumbai, Maharashtra",
    workplaceType: "Hybrid",
    salary: "₹6 - ₹10 LPA",
    jobType: "Full Time",
    experience: "1-2 Years",
    category: "Software & Engineering",
    featured: true,
    urgent: false,
    easyApply: true,
    applicantCount: 24,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    description:
      "Tata Consultancy Services (TCS) is looking for enthusiastic Software Engineers to join our Enterprise Cloud Solutions team. You will work on building scalable web services, API integrations, and enterprise web applications for global financial and retail clients.",
    responsibilities: [
      "Develop and maintain secure, scalable RESTful web APIs and frontend microservices.",
      "Collaborate with product managers and QA teams to deliver robust software features.",
      "Participate in code reviews, bug fixes, and agile sprint planning sessions.",
      "Optimize database queries and system performance for high-traffic environments."
    ],
    requirements: [
      "Bachelor's degree in Computer Science, Information Technology, or equivalent.",
      "1-2 years of software development experience with JavaScript, Node.js, or Java.",
      "Working knowledge of relational/non-relational databases (MongoDB, SQL).",
      "Good understanding of Git, REST APIs, and modern web application development."
    ],
    skills: ["JavaScript", "Node.js", "Express", "MongoDB", "REST APIs", "Git"],
    perks: ["Health & Life Insurance", "Hybrid Work Schedule", "Annual Learning Budget", "Performance Incentive"],
    isDemo: true
  },
  {
    _id: "demo-2",
    title: "Frontend Developer (React.js)",
    company: "Infosys",
    companyInitial: "I",
    companyColor: "#0284c7",
    location: "Pune, Maharashtra",
    workplaceType: "Remote",
    salary: "₹5 - ₹9 LPA",
    jobType: "Full Time",
    experience: "Fresher",
    category: "Frontend & UI/UX",
    featured: true,
    urgent: true,
    easyApply: true,
    applicantCount: 42,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description:
      "Infosys is hiring passionate Frontend Developers to craft responsive, intuitive user interfaces for next-generation digital banking and e-commerce platforms. Ideal for developers with a strong eye for clean UI and responsive layouts.",
    responsibilities: [
      "Build modular and reusable React.js components following modern best practices.",
      "Translate wireframes and UI designs into high-quality, responsive web pages.",
      "Ensure cross-browser compatibility and smooth client-side performance.",
      "Integrate backend RESTful APIs with state management and form validation."
    ],
    requirements: [
      "B.E / B.Tech / BCA / MCA in Computer Science or related fields.",
      "Strong proficiency in HTML5, CSS3, JavaScript (ES6+), and React.js.",
      "Familiarity with responsive web design, Flexbox, CSS Grid, and Axios.",
      "Strong communication and problem-solving skills."
    ],
    skills: ["React.js", "JavaScript", "HTML5", "CSS3", "Axios", "Responsive Design"],
    perks: ["100% Remote Option", "Work From Home Setup Allowance", "Wellness Support", "Skill Certifications"],
    isDemo: true
  },
  {
    _id: "demo-3",
    title: "Backend Engineer (Node & Mongo)",
    company: "Accenture",
    companyInitial: "A",
    companyColor: "#7c3aed",
    location: "Bengaluru, Karnataka",
    workplaceType: "Hybrid",
    salary: "₹7 - ₹12 LPA",
    jobType: "Full Time",
    experience: "1-2 Years",
    category: "Backend & Cloud",
    featured: true,
    urgent: false,
    easyApply: true,
    applicantCount: 31,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    description:
      "Accenture is seeking a Backend Developer to design, implement, and maintain high-performance server architectures and microservices. You will collaborate closely with frontend engineers and DevOps to deliver reliable digital products.",
    responsibilities: [
      "Design and build performant backend APIs using Node.js, Express, and MongoDB.",
      "Implement secure JWT authentication, data validation, and role-based authorization.",
      "Handle file uploads, data streams, and third-party webhook integrations.",
      "Write unit tests and optimize database indexes for low query latency."
    ],
    requirements: [
      "1-3 years of practical experience with Node.js, Express.js, and MongoDB/Mongoose.",
      "Hands-on understanding of asynchronous programming, event loop, and middleware.",
      "Knowledge of authentication patterns (JWT, bcrypt) and API security best practices.",
      "Experience with Postman, version control (Git), and containerization is a plus."
    ],
    skills: ["Node.js", "Express.js", "MongoDB", "Mongoose", "JWT", "RESTful Architecture"],
    perks: ["Competitive Bonus", "Comprehensive Medical", "Stock Purchase Discount", "Gym & Fitness Pass"],
    isDemo: true
  },
  {
    _id: "demo-4",
    title: "UI/UX & React Developer",
    company: "Capgemini",
    companyInitial: "C",
    companyColor: "#059669",
    location: "Mumbai, Maharashtra",
    workplaceType: "On-site",
    salary: "₹6 - ₹11 LPA",
    jobType: "Full Time",
    experience: "1-2 Years",
    category: "Frontend & UI/UX",
    featured: false,
    urgent: true,
    easyApply: true,
    applicantCount: 19,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    description:
      "Capgemini is looking for a skilled React Developer to build interactive web dashboards and portals. You will work within agile teams delivering client-facing digital transformation projects.",
    responsibilities: [
      "Develop single-page applications using React.js and modern JavaScript tooling.",
      "Create accessible, mobile-first user interfaces with clean styling and smooth interactions.",
      "Collaborate with backend engineers to integrate APIs and handle multipart data.",
      "Troubleshoot UI bugs and optimize bundle size for fast initial load times."
    ],
    requirements: [
      "Degree in Computer Science or equivalent hands-on experience.",
      "Solid knowledge of React hooks, component lifecycle, and React Router.",
      "Experience interacting with REST APIs and handling error states gracefully.",
      "Passion for clean code, UI aesthetics, and user experience."
    ],
    skills: ["React.js", "Vite", "JavaScript", "CSS", "Single Page Apps", "REST APIs"],
    perks: ["Free Catered Lunch", "Transport Facilities", "Quarterly Team Outings", "Health Checkups"],
    isDemo: true
  },
  {
    _id: "demo-5",
    title: "Java Full Stack Developer",
    company: "Wipro",
    companyInitial: "W",
    companyColor: "#ea580c",
    location: "Hyderabad, Telangana",
    workplaceType: "Hybrid",
    salary: "₹5 - ₹9 LPA",
    jobType: "Full Time",
    experience: "1-2 Years",
    category: "Software & Engineering",
    featured: false,
    urgent: false,
    easyApply: true,
    applicantCount: 15,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description:
      "Wipro is hiring Java Developers for enterprise modernization projects. In this role, you will develop core backend services, maintain business logic workflows, and integrate database layers.",
    responsibilities: [
      "Build robust backend services using Java, Spring Boot, and relational databases.",
      "Develop and consume RESTful web services with JSON/XML payloads.",
      "Ensure application security, data integrity, and compliance with standards.",
      "Participate in sprint demos and continuous integration pipelines."
    ],
    requirements: [
      "Bachelor's degree in engineering or related discipline.",
      "1-2 years of experience with Core Java, OOP principles, and Spring Boot.",
      "Familiarity with SQL databases, JPA/Hibernate, and version control.",
      "Strong analytical mindset and debugging skills."
    ],
    skills: ["Java", "Spring Boot", "SQL", "REST APIs", "OOP", "Git"],
    perks: ["Relocation Allowance", "Medical Insurance", "Provident Fund", "Fast-track Promotion"],
    isDemo: true
  },
  {
    _id: "demo-6",
    title: "Data Analyst & BI Specialist",
    company: "Deloitte",
    companyInitial: "D",
    companyColor: "#16a34a",
    location: "Mumbai, Maharashtra",
    workplaceType: "Hybrid",
    salary: "₹6 - ₹10 LPA",
    jobType: "Full Time",
    experience: "Fresher",
    category: "Data Science & AI",
    featured: true,
    urgent: false,
    easyApply: true,
    applicantCount: 38,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    description:
      "Deloitte is looking for entry-level Data Analysts to transform raw organizational data into actionable business intelligence. You will analyze market trends, build dashboards, and assist consulting teams.",
    responsibilities: [
      "Collect, clean, and analyze datasets from multiple enterprise sources.",
      "Create visual reports and dashboards for key stakeholder decision making.",
      "Write SQL queries and Python scripts to automate routine reporting tasks.",
      "Collaborate with strategy teams to identify business opportunities."
    ],
    requirements: [
      "Degree in Statistics, Mathematics, Computer Science, or Business Analytics.",
      "Proficiency in SQL, Excel, and introductory Python for data analysis.",
      "Familiarity with data visualization concepts (Power BI or Tableau is a plus).",
      "Strong logical reasoning and presentation skills."
    ],
    skills: ["SQL", "Excel", "Python", "Data Analysis", "Reporting", "Visualization"],
    perks: ["Top-tier Health Coverage", "Tuition Reimbursement", "Annual Performance Bonus", "Global Mentorship"],
    isDemo: true
  },
  {
    _id: "demo-7",
    title: "Cloud & DevOps Associate",
    company: "TCS",
    companyInitial: "T",
    companyColor: "#1e40af",
    location: "Bengaluru, Karnataka",
    workplaceType: "Hybrid",
    salary: "₹7 - ₹12 LPA",
    jobType: "Full Time",
    experience: "1-2 Years",
    category: "DevOps & Security",
    featured: false,
    urgent: true,
    easyApply: true,
    applicantCount: 16,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    description:
      "Join the Cloud Infrastructure team at TCS to build, maintain, and monitor automated CI/CD pipelines, Docker containers, and AWS cloud environments.",
    responsibilities: [
      "Manage cloud deployments and maintain Docker/Kubernetes clusters.",
      "Build and optimize GitHub Actions and Jenkins automated pipelines.",
      "Monitor application latency, logs, and server health metrics."
    ],
    requirements: [
      "Experience with Linux, Shell scripting, Docker, and CI/CD tools.",
      "Basic understanding of AWS or Azure cloud fundamentals.",
      "Strong debugging and problem solving mindset."
    ],
    skills: ["Docker", "AWS", "CI/CD", "Linux", "Git", "Kubernetes"],
    perks: ["Cloud Certifications Reimbursement", "Hybrid Flexibility", "Medical Plan", "Annual Bonus"],
    isDemo: true
  },
  {
    _id: "demo-8",
    title: "Associate Product Manager",
    company: "Accenture",
    companyInitial: "A",
    companyColor: "#7c3aed",
    location: "Pune, Maharashtra",
    workplaceType: "Hybrid",
    salary: "₹8 - ₹14 LPA",
    jobType: "Full Time",
    experience: "1-2 Years",
    category: "Product & Project",
    featured: true,
    urgent: false,
    easyApply: true,
    applicantCount: 29,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    description:
      "Collaborate with engineering, design, and executive teams to shape the digital product roadmap and define high-impact product features for enterprise clients.",
    responsibilities: [
      "Draft detailed user stories, PRDs, and acceptance criteria.",
      "Analyze product usage analytics to drive feature prioritization.",
      "Lead sprint grooming sessions with cross-functional development squads."
    ],
    requirements: [
      "B.Tech / MBA or equivalent practical experience in tech or consulting.",
      "Strong communication, analytical thinking, and stakeholder management.",
      "Familiarity with Jira, Agile methodologies, and wireframing tools."
    ],
    skills: ["Product Management", "Agile/Scrum", "Jira", "User Research", "Roadmapping"],
    perks: ["Executive Mentorship", "Flexible Schedule", "Annual Bonus", "Health Coverage"],
    isDemo: true
  }
];

export const TESTIMONIALS = [
  {
    quote: "I landed my Junior Frontend role within 2 weeks of applying on JobPortal. The simplified application process and status tracking are top-notch!",
    name: "Aakash Mehta",
    role: "Frontend Developer at Infosys",
    initials: "AM",
    color: "#2563eb",
    badge: "Hired in 14 days"
  },
  {
    quote: "As a tech recruiter, this platform cut our time-to-hire by 50%. The applicant dashboard and resume viewing workflow is incredibly intuitive.",
    name: "Sneha Rao",
    role: "Talent Acquisition Lead at TCS",
    initials: "SR",
    color: "#7c3aed",
    badge: "Verified Recruiter"
  },
  {
    quote: "The salary insights and verified job tags gave me confidence during interviews. Got placed as a Node.js Backend Engineer with a 35% hike!",
    name: "Priya Sharma",
    role: "Backend Engineer at Accenture",
    initials: "PS",
    color: "#059669",
    badge: "Placed Successfully"
  }
];
