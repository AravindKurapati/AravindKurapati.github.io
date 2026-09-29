export const links = {
  email: 'mailto:arvind.kurapati@gmail.com',
  github: 'https://github.com/AravindKurapati',
  linkedin: 'https://www.linkedin.com/in/aravind-kurapati-1b0a841aa',
  medium: 'https://medium.com/@aravind.kurapati',
};

export const experience = [
  {
    org: 'Virtusa',
    role: 'Forward Deployed Engineer',
    when: 'Jun 2026 to now',
    lines: [
      'Agentic systems and harnesses for major enterprises. I could tell you what they do, but then Legal would build an agent to deal with me.',
    ],
  },
  {
    org: 'NYU Langone Health',
    role: 'Machine Learning Research Intern',
    when: 'Feb to May 2025',
    lines: [
      'Whole-slide image pipeline for follicular lymphoma: self-supervised encoders and attention-based multiple instance learning.',
    ],
  },
  {
    org: 'NYU Langone Health',
    role: 'Research Assistant',
    when: 'Jun to Dec 2024',
    lines: [
      'Reproduced Barlow Twins self-supervised learning on NYU HPC: InceptionV3 on 850K+ histopathology tiles, custom SLURM scheduling, HDF5 tile storage.',
    ],
  },
  {
    org: 'Verizon',
    role: 'Software Developer',
    when: 'Jul 2022 to Aug 2023',
    lines: [
      'Rebuilt data ingestion on Delta Lake and AWS, 3x faster. Cut the SQL analytics layer from 2.5s to 1.2s across 10K+ daily queries.',
    ],
  },
  {
    org: 'Verizon',
    role: 'Software Engineering Intern',
    when: 'Feb to Jun 2022',
    lines: ['Software delivery prediction models, 86 to 94% accuracy.'],
  },
];

export const education = [
  { org: 'New York University', what: 'MS, Computer Science', when: '2023 to 2025' },
  { org: 'Amrita Vishwa Vidyapeetham', what: 'B.Tech, Computer Science and Engineering', when: '2018 to 2022' },
];

export const publications = [
  {
    title: 'Detection of Pneumonia and COVID-19 from Chest X-Ray Images Using Neural Networks and Deep Learning',
    year: 2022,
    note: 'Compared CNN architectures, 94.25% accuracy.',
    url: 'https://www.researchgate.net/publication/364821917_Detection_of_Pneumonia_and_COVID-19_from_Chest_X-Ray_Images_Using_Neural_Networks_and_Deep_Learning',
    venue: 'ResearchGate',
  },
  {
    title: 'Classification and Prediction of Lung Cancer',
    year: 2022,
    note: 'Benchmarked CNN architectures on LC25000, 90 to 99% accuracy.',
    url: 'https://ieeexplore.ieee.org/document/9847945',
    venue: 'IEEE',
  },
];

export const moreWork = [
  {
    name: 'Reading lymphoma subtypes from slides',
    what: 'NYU Langone: self-supervised encoders and attention MIL on gigapixel pathology slides.',
    url: 'https://github.com/AravindKurapati/Follicular-Lymphoma-Subtypes',
  },
  {
    name: 'Open source',
    what: 'A docs PR to verifiers (Prime Intellect) and answers on long-unanswered AlphaFold issues.',
    url: 'https://github.com/PrimeIntellect-ai/verifiers/pull/2635',
  },
  {
    name: 'locus',
    what: 'A personal knowledge graph of places, built from my own Google Maps history.',
    url: null,
  },
  {
    name: 'Eleven trackers, one monthly hub',
    what: 'Books, films, gym, walks, YouTube. It is what powers the Now page.',
    url: '/now',
  },
];

