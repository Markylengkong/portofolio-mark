"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import { Mail, Send, ArrowRight, X, ExternalLink, CheckCircle2, Users, Loader2, Clock } from "lucide-react";

// --- CUSTOM SVG BRAND ICONS (SAFE FROM LUCIDE REMOVALS) ---
function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/>
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

// --- TYPE DEFINITION ---
interface Project {
  id: number;
  title: string;
  desc: string;
  longDesc: string;
  image: string;
  tech: string[];
  category: string;
  status?: "Completed" | "In Progress";
  features: string[];
  collaborators?: string[];
  demoUrl?: string;
  githubUrl?: string;
}

// --- 1. INTRO OVERLAY COMPONENT ---
function IntroOverlay() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white pointer-events-none perspective-[1000px]"
    >
      <motion.div
        initial={{ rotateY: 0, y: 120, scale: 0.4, opacity: 0 }}
        animate={{
          rotateY: 2160,
          y: [0, -90, 0],
          scale: [0.4, 1.15, 1],
          opacity: 1,
        }}
        transition={{
          duration: 2.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="mb-8 h-36 w-36 rounded-full border-2 border-neutral-400/40 p-1 shadow-[0_0_40px_rgba(255,255,255,0.15)] bg-neutral-900"
      >
        <img
          src="/images/intro-avatar.jpg"
          alt="Intro Avatar"
          className="h-full w-full rounded-full object-cover object-center shadow-2xl"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="text-center space-y-1.5"
      >
        <p className="text-[10px] font-mono tracking-[0.4em] text-neutral-500 uppercase">
          PORTFOLIO EDITION
        </p>
        <h1 className="text-2xl md:text-3xl font-serif italic tracking-wide text-neutral-100 font-normal">
          welcome to my web portfolio
        </h1>
      </motion.div>
    </motion.div>
  );
}

// --- 2. DYNAMIC TYPEWRITER COMPONENT ---
function TypewriterText({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 1800);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (reverse ? -1 : 1));
      },
      reverse ? 40 : 80
    );

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return (
    <span className="inline-block">
      {words[index].substring(0, subIndex)}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
        className="inline-block w-[2px] h-6 bg-white ml-1 align-middle"
      />
    </span>
  );
}

// --- 3. LANYARD CARD COMPONENT ---
function LanyardCard({ isReady }: { isReady: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
  const rotate = useSpring(rotateRaw, { stiffness: 180, damping: 12 });
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[520px] w-full pt-12 overflow-hidden">
      <div className="absolute top-2 w-3.5 h-3.5 bg-neutral-700 rounded-full border-2 border-neutral-500 z-20 shadow-md" />

      <motion.div
        initial={{ y: -600, opacity: 0 }}
        animate={isReady ? { y: 0, opacity: 1 } : { y: -600, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 65,
          damping: 11,
          mass: 1.2,
        }}
        className="w-full flex flex-col items-center"
      >
        <motion.div
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.6}
          style={{
            x: springX,
            y: springY,
            rotate: rotate,
            transformOrigin: "top center",
          }}
          onDrag={(_, info) => {
            x.set(info.offset.x);
            y.set(info.offset.y);
          }}
          onDragEnd={() => {
            x.set(0);
            y.set(0);
          }}
          className="relative flex flex-col items-center cursor-grab active:cursor-grabbing z-10"
        >
          <div className="flex justify-between w-28 h-32 -mt-1 pointer-events-none">
            <div className="w-3.5 h-full bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-800 -rotate-12 origin-top-right border-x border-neutral-700/50 shadow-md" />
            <div className="w-3.5 h-full bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-800 rotate-12 origin-top-left border-x border-neutral-700/50 shadow-md" />
          </div>

          <div className="flex flex-col items-center -mt-1 -mb-2 pointer-events-none">
            <div className="w-7 h-3.5 bg-gradient-to-r from-neutral-400 via-neutral-200 to-neutral-400 rounded-sm shadow-md border border-neutral-300" />
            <div className="w-4 h-4 border-2 border-neutral-300 rounded-full -mt-1 shadow-inner" />
          </div>

          <div className="relative w-72 h-[410px] rounded-2xl bg-neutral-900/95 border border-neutral-800 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-3 bg-neutral-800 rounded-full border border-neutral-700 flex items-center justify-center">
              <div className="w-4 h-1 bg-black rounded-full" />
            </div>

            <div className="flex justify-between items-start pt-2">
              <span className="text-[10px] font-mono text-neutral-500">BINUS UNIVERSITY</span>
              <span className="text-[10px] font-mono text-neutral-500">ID: 2026</span>
            </div>

            <div className="my-auto flex flex-col items-center text-center">
              <div className="w-36 h-36 rounded-2xl overflow-hidden border border-neutral-700 mb-3 shadow-md">
                <img
                  src="/images/profile.jpg"
                  alt="Mark Philip Lengkong"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-white">Mark Philip Lengkong</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Computer Science Student</p>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 border-t border-neutral-800 pt-3">
              <span>PORTFOLIO CARD</span>
              <span>2026 EDITION</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// --- 4. PROJECT DETAIL MODAL COMPONENT ---
function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  if (!project) return null;

  const isOngoing = project.status === "In Progress";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] bg-neutral-900 border border-neutral-800 rounded-2xl overflow-y-auto shadow-2xl flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-neutral-400 hover:text-white border border-neutral-700/50 backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-64 md:h-80 w-full overflow-hidden bg-neutral-950 border-b border-neutral-800">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-neutral-500 uppercase tracking-wider mb-2">
              <span>{project.category === "solo" ? "Solo Project" : "Collaboration Project"}</span>
              <span>•</span>
              <span className={isOngoing ? "text-amber-400 font-semibold" : "text-emerald-400 font-semibold"}>
                {isOngoing ? "In Development (Ongoing)" : "Completed"}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {project.title}
            </h2>
          </div>

          <p className="text-neutral-300 leading-relaxed text-sm md:text-base">
            {project.longDesc}
          </p>

          {/* Collaborators List (If Any) */}
          {project.collaborators && project.collaborators.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-neutral-400 uppercase tracking-wider">
                <Users className="w-4 h-4 text-neutral-400" />
                <span>Project Team & Collaborators</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.collaborators.map((person, idx) => (
                  <span
                    key={idx}
                    className="bg-neutral-800/80 border border-neutral-700/60 text-neutral-200 text-xs px-3 py-1 rounded-full font-medium"
                  >
                    {person}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Features */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                Key Features & Capabilities
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {project.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="bg-neutral-800 border border-neutral-700/60 text-neutral-200 text-xs px-3 py-1 rounded-md font-mono"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-4 border-t border-neutral-800">
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 bg-white text-black px-5 py-2.5 rounded-lg text-xs font-medium hover:bg-neutral-200 transition-colors"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : isOngoing ? (
              <span className="inline-flex items-center space-x-2 bg-neutral-800/80 border border-amber-500/40 text-amber-300 px-4 py-2.5 rounded-lg text-xs font-mono">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Development In Progress</span>
              </span>
            ) : null}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 bg-neutral-800 border border-neutral-700 text-white px-5 py-2.5 rounded-lg text-xs font-medium hover:bg-neutral-700 transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Source Code</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- 5. MAIN PORTFOLIO PAGE ---
export default function PortfolioPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // CONTACT FORM STATE
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    msg: string;
  }>({ type: null, msg: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  const projects: Project[] = [
    {
      id: 1,
      title: "Golf Swing AI Analyzer",
      desc: "An AI-powered motion analysis platform that evaluates golf swing biomechanics, body keypoint posture, and tempo metrics in real time.",
      longDesc: "Golf Swing AI Analyzer is a computer vision web platform designed to analyze golf swing mechanics. By utilizing YOLOv8-Pose models to track 33 body keypoints across 5 swing phases, the system calculates swing scores, backswing-to-downswing tempo ratios, and potential injury risk metrics to provide instant personalized swing breakdown.",
      image: "/images/projects/golf-analysis.jpg",
      tech: ["Next.js", "TypeScript", "YOLOv8-Pose", "OpenCV", "Tailwind CSS"],
      category: "colab",
      status: "Completed",
      collaborators: [
        "Ezra Mayurga",
        "Mark Philip Lengkong",
        "Andrew Wijaya",
        "Muhammad Luthfi Hidayat",
        "Rizal Dermawan Wally",
      ],
      features: [
        "33-point body keypoint tracking & pose estimation analysis",
        "Automatic 5-phase swing segmentation and tempo calculation",
        "Dynamic swing score and injury risk probability assessment",
        "Instant biomechanical feedback and phase-by-phase recommendations",
      ],
      demoUrl: "https://golf-helper-identifier.vercel.app/",
      githubUrl: "https://github.com/EzraMayurga/Golf-Helper-Identifier",
    },
    {
      id: 2,
      title: "Tokopedia Best Seller Classifier",
      desc: "An ML web application that ingests e-commerce metrics to predict product Best Seller classification and evaluate model confidence.",
      longDesc: "Tokopedia Best Seller Classifier is an interactive Machine Learning web system engineered using Streamlit and Scikit-Learn. The platform performs Exploratory Data Analysis (EDA), automated data preprocessing, feature encoding, and multi-model classification performance benchmarking (Classification Report & Confusion Matrix) to predict whether an e-commerce product will reach Best Seller status in real time.",
      image: "/images/projects/tokopedia-best-seller.jpg",
      tech: ["Python", "Streamlit", "Scikit-Learn", "Pandas", "Machine Learning"],
      category: "colab",
      status: "Completed",
      collaborators: [
        "Mark Philip Lengkong",
        "Academic ML Team Project",
      ],
      features: [
        "Interactive Exploratory Data Analysis (EDA) & metric distribution charts",
        "Automated data preprocessing, feature encoding & normalization pipeline",
        "Multi-model classification performance benchmarking & Confusion Matrix display",
        "Real-time prediction engine calculating Best Seller probability & confidence scores",
      ],
      demoUrl: "https://ml-tokopedia-best-seller-7euga6sgakgovdyt9nuh2p.streamlit.app/",
      githubUrl: "https://github.com/lewron135/ML-Tokopedia-Best-Seller",
    },
    {
      id: 3,
      title: "RunPace AI - Running Pace Predictor",
      desc: "A hybrid machine learning decision support system that predicts running pace and finish time based on route elevation, distance, and runner experience.",
      longDesc: "RunPace AI is a hybrid classical machine learning decision support system engineered to predict personalized running pace (min/km) and total finish time. By combining K-Means Clustering for runner experience segmentation (Beginner, Intermediate, Advanced) with Random Forest and XGBoost ensemble regressors trained on 42,116 activity records across 116 athletes, the system provides accurate, route-tailored performance predictions.",
      image: "/images/projects/runpace-ai.jpg",
      tech: ["Next.js", "Python", "K-Means", "Random Forest", "XGBoost", "Tailwind CSS"],
      category: "colab",
      status: "Completed",
      collaborators: [
        "Josep Natanael Pasaribu",
        "Marcellino Varian Saputra",
        "Mark Philip Lengkong",
      ],
      features: [
        "Hybrid ML architecture combining K-Means clustering & ensemble regression models",
        "Dataset trained on 42,116 running activity records from 116 unique athletes",
        "Real-time pace (min/km) & total elapsed finish time prediction",
        "Interactive Exploratory Data Analysis (EDA) & feature correlation matrix display",
      ],
      demoUrl: "https://ml-run-pace-project.vercel.app/",
      githubUrl: "https://github.com/lewron135/ML-RunPace-Project",
    },
    {
      id: 4,
      title: "Smartminton - AI Badminton Motion & Coach Platform",
      desc: "An integrated AI-powered badminton technique analysis platform utilizing pose estimation for biomechanical smash evaluation and interactive BWF-standard AI coaching.",
      longDesc: "Smartminton converts raw badminton training footage into precise biomechanical technique evaluations. Powered by YOLO/MediaPipe pose detection to track joint keypoints (elbows, shoulders, knees), the system automatically calculates swing angles, jump smash preparation flexion, and technique score metrics (e.g., 85/100). It features a full-stack architecture with a Next.js frontend, FastAPI backend, and Google Gemini API integration delivering BWF-standard AI coaching for footwork, shot variations, and custom conditioning programs.",
      image: "/images/projects/smartminton.jpg",
      tech: ["Next.js", "FastAPI", "Google Gemini API", "MediaPipe", "YOLO", "Python", "Tailwind CSS"],
      category: "solo",
      status: "In Progress",
      features: [
        "Real-time video pose estimation & keypoint tracking for smash biomechanics",
        "Automated joint angle calculation (elbow flex, knee bent) & dynamic posture scoring",
        "Interactive BWF-aligned AI Coach for footwork guidance, shot variations & stamina plans",
        "Full-stack architecture integrating Next.js, FastAPI, and Google Gemini API engine",
      ],
      githubUrl: "https://github.com",
    },
    {
      id: 5,
      title: "Semantic CV-JD Matcher - COURSE FINAL PROJECT",
      desc: "A final project for the NLP course at BINUS University 2025/2026, using deep semantic understanding to match resumes with job descriptions, far exceeding standard lexical matching.",
      longDesc: "Matches job applicant resumes with job descriptions using deep semantic understanding rather than simple keyword matching. If a CV mentions 'Deep Learning' but the JD requires 'Neural Networks', the system still recognizes both terms as the same underlying competency — because it operates in a semantic vector space, not a character string space. Core features include a Hybrid NER Extraction, a Semantic Relevance Filter to automate noise reduction, SBERT Similarity Scoring, Side-by-Side Lexical vs Semantic Score Visualization, and NER Visualization to highlight entities directly in the resume view. Final system evaluation against ground-truth sentences yielded a robust operational balance of Precision: 0.9500, Recall: 0.7308, F1-Score: 0.8261. Getting Started: Clone the repository, cd AOL_NaturalLanguageProcessing, install dependencies (pip install -r requirements.txt, python -m spacy download en_core_web_md), and run (streamlit run app.py). Ensure the file models/tfidf_model.pkl exists.",
      image: "/images/projects/nlp-final-courses-matcher.jpg",
      tech: ["Python", "Streamlit", "spaCy", "Sentence-Transformers", "Scikit-Learn", "PyTorch", "ftfy", "Unicode", "PyPDF2"],
      category: "colab",
      status: "Completed",
      collaborators: [
        "Lewron135",
        "Josep Natanael Pasaribu",
        "Marcellino Varian Saputra",
        "Mark Philip Lengkong",
      ],
      features: [
        "Deep semantic competency matching vs char-string space lexical matching",
        "Hybrid NER skill capturing ('object-oriented design') exceeding standard models",
        "Side-by-side Lexical vs Semantic score dashboard to demonstrate the gap",
        "ftfy preprocessing and Unicode NFC normalization for encoding & mojibake repair",
      ],
      demoUrl: "https://semanticcvanalyzer-hu3dg5hwmpxgdzcayj4vcn.streamlit.app/", // Ganti link ini jika ada link live demo Streamlit kamu
      githubUrl: "https://github.com/lewron135/AOL_NaturalLanguageProcessing.git",
    },
  ];

  const filteredProjects =
    activeTab === "all"
      ? projects
      : projects.filter((p) => p.category === activeTab);

  // HANDLER PENGIRIMAN EMAIL LEWAT WEB3FORMS
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, msg: "" });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "5da84e83-9a38-4e80-b74d-94beadcee56c",
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `Portfolio Contact from ${formData.name}`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: "success",
          msg: "Pesan berhasil terkirim! Terima kasih, Mark akan membalas segera.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus({
          type: "error",
          msg: result.message || "Gagal mengirim pesan. Silakan coba lagi.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        msg: "Terjadi kesalahan sistem. Silakan coba beberapa saat lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-sans selection:bg-white selection:text-black scroll-smooth">
      <AnimatePresence>
        {showIntro && <IntroOverlay />}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      <header className="fixed top-0 left-0 right-0 z-40 bg-black/60 backdrop-blur-md border-b border-neutral-800/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#home" className="text-sm font-semibold tracking-wider bg-neutral-900 border border-neutral-700 px-3 py-1 rounded-md text-white">
            mark.ai
          </a>
          <nav className="flex items-center space-x-6 text-sm text-neutral-400">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      <section id="home" className="min-h-screen flex items-center justify-center pt-24 pb-12 px-6">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full text-xs text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AVAILABLE FOR COLLABORATION</span>
            </div>

            <div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
                Mark Philip <br />
                <span className="text-neutral-400">Lengkong</span>
              </h1>
              <p className="mt-4 text-xl md:text-2xl text-neutral-300 font-medium h-8">
                <TypewriterText
                  words={[
                    "Computer Science Student",
                    "ML / AI Enthusiast",
                    "Data Science Explorer",
                  ]}
                />
              </p>
            </div>

            <p className="text-neutral-400 leading-relaxed max-w-xl text-sm md:text-base">
              Computer Science student at BINUS University dedicated to building Machine Learning architectures, Computer Vision systems, and GenAI-powered intelligent applications.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {["Python", "PyTorch", "OpenCV", "Scikit-Learn", "YOLO", "GenAI API"].map((tech) => (
                <span key={tech} className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs px-3 py-1.5 rounded-md font-mono">
                  {tech}
                </span>
              ))}
            </div>

            <div className="pt-4 flex items-center space-x-4">
              <a
                href="#portfolio"
                className="inline-flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors"
              >
                <span>Explore Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center items-center">
            <LanyardCard isReady={!showIntro} />
          </div>
        </div>
      </section>

      {/* ABOUT ME SECTION - SIMPLIFIED & NEED-DRIVEN FOCUS */}
      <section id="about" className="relative py-28 border-t border-neutral-900 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute right-0 top-0 w-full md:w-1/2 h-full opacity-95">
            <img
              src="/images/about-bg.jpg"
              alt="Background Highlight"
              className="w-full h-full object-cover object-top filter brightness-105 contrast-110"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black/80" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div>
            <span className="text-xs font-mono text-neutral-500 tracking-widest uppercase">BACKGROUND & PHILOSOPHY</span>
            <h2 className="text-3xl font-bold text-white mt-1">About Me</h2>
          </div>
          
          <p className="text-neutral-200 leading-relaxed max-w-xl text-base drop-shadow">
            I am a Computer Science student at BINUS University specializing in Artificial Intelligence and Computer Vision. Driven by a problem-solving mindset, I create practical AI applications inspired by real-world needs and my personal hobbies in sports like badminton and golf for example.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
            <div className="p-5 bg-neutral-900/90 border border-neutral-800 rounded-xl backdrop-blur-md shadow-lg">
              <h3 className="text-sm font-semibold text-white mb-1">Education & Focus</h3>
              <p className="text-xs text-neutral-400">CS Major at BINUS | AI & Machine Learning</p>
            </div>
            <div className="p-5 bg-neutral-900/90 border border-neutral-800 rounded-xl backdrop-blur-md shadow-lg">
              <h3 className="text-sm font-semibold text-white mb-1">Development Philosophy</h3>
              <p className="text-xs text-neutral-400">Need-Driven AI & Real-World Impact Solutions</p>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-24 border-t border-neutral-900 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-neutral-500 tracking-widest uppercase">FEATURED WORKS</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Portfolio & Projects</h2>
          </div>

          <div className="flex justify-center space-x-2">
            {[
              { id: "all", label: "All Projects" },
              { id: "solo", label: "Solo Projects" },
              { id: "colab", label: "Collaborations" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs transition-colors capitalize ${
                  activeTab === tab.id
                    ? "bg-white text-black font-medium"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="group cursor-pointer bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-neutral-950 border-b border-neutral-800/80">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    
                    <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                      <span className="bg-black/70 backdrop-blur-md border border-neutral-700 text-[10px] font-mono text-neutral-300 px-2.5 py-1 rounded-md">
                        {project.category === "solo" ? "SOLO" : "COLAB"}
                      </span>
                      {project.status === "In Progress" && (
                        <span className="bg-amber-500/20 backdrop-blur-md border border-amber-500/50 text-[10px] font-mono text-amber-300 px-2.5 py-1 rounded-md">
                          ONGOING
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-white group-hover:text-neutral-200 transition-colors mb-2">
                      {project.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                      {project.desc}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-neutral-800/60 mb-4">
                    {project.tech.map((t) => (
                      <span key={t} className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="inline-flex items-center space-x-1.5 text-xs text-neutral-300 group-hover:text-white font-medium">
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 border-t border-neutral-900 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5 space-y-6">
            <span className="text-xs font-mono text-neutral-500 tracking-widest uppercase">GET IN TOUCH</span>
            <h2 className="text-3xl font-bold text-white">Let's Connect</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Interested in collaborating on AI/ML projects or exploring professional opportunities? Feel free to reach out via the form or connect through social channels.
            </p>

            <div className="space-y-3 pt-2">
              <a
                href="mailto:mark.lengkong@binus.ac.id"
                className="flex items-center space-x-3 text-sm text-neutral-300 hover:text-white transition-colors"
              >
                <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                  <Mail className="w-4 h-4 text-neutral-400" />
                </div>
                <span>mark.lengkong@binus.ac.id</span>
              </a>

              {/* SOCIAL MEDIA LINKS */}
              <div className="pt-2 flex flex-col space-y-2">
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">Social Networks</span>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="https://github.com/Markylengkong"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white px-3.5 py-2 rounded-lg text-xs transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/markphiliplengkong/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white px-3.5 py-2 rounded-lg text-xs transition-colors"
                  >
                    <LinkedinIcon className="w-4 h-4 text-sky-400" />
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href="https://www.instagram.com/markphl_/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white px-3.5 py-2 rounded-lg text-xs transition-colors"
                  >
                    <InstagramIcon className="w-4 h-4 text-pink-400" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 bg-neutral-900/30 border border-neutral-800 p-6 rounded-2xl">
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@email.com"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase mb-2">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message or proposal..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600"
                />
              </div>

              {submitStatus.type && (
                <div
                  className={`p-3 rounded-lg text-xs font-mono ${
                    submitStatus.type === "success"
                      ? "bg-emerald-950/80 border border-emerald-800 text-emerald-300"
                      : "bg-rose-950/80 border border-rose-800 text-rose-300"
                  }`}
                >
                  {submitStatus.msg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black font-medium py-2.5 rounded-lg text-sm flex items-center justify-center space-x-2 hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-neutral-900 text-center space-y-3">
        <div className="flex justify-center items-center space-x-4">
          <a href="https://github.com/Markylengkong" target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white transition-colors p-1">
            <GithubIcon className="w-4 h-4" />
          </a>
          <a href="https://www.linkedin.com/in/markphiliplengkong/" target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white transition-colors p-1">
            <LinkedinIcon className="w-4 h-4" />
          </a>
          <a href="https://www.instagram.com/markphl_/" target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white transition-colors p-1">
            <InstagramIcon className="w-4 h-4" />
          </a>
        </div>
        <p className="text-xs text-neutral-600 font-mono">
          © 2026 Mark Philip Lengkong. All rights reserved.
        </p>
      </footer>
    </div>
  );
}