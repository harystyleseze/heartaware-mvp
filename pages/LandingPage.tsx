import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

// --- SVG Icons ---
const AiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const ConnectIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.273-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.273.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;


// --- Page Sections ---

const HeroSection: React.FC = () => (
    <section className="relative bg-white dark:bg-slate-800/50 pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight fade-in-up">
                Fast, AI-Powered Cardiac Triage <br/> For Your Community
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300 fade-in-up" style={{ animationDelay: '0.2s' }}>
                HeartAware NG instantly assesses cardiac symptoms using AI and connects high-risk individuals with the nearest Community Health Worker.
            </p>
            <div className="mt-8 flex justify-center gap-4 fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Link to="/symptom-checker">
                    <Button variant="primary" className="!text-base !py-3 !px-6">Start Symptom Assessment</Button>
                </Link>
                <Link to="/chw/login">
                    <Button variant="secondary" className="!text-base !py-3 !px-6">I'm a Health Worker</Button>
                </Link>
            </div>
        </div>
    </section>
);

const FeaturesSection: React.FC = () => (
    <section id="features" className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">A Smarter Way to Get Cardiac Care</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">Our platform is built to be fast, accurate, and accessible.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <FeatureCard icon={<AiIcon />} title="AI-Powered Risk Assessment" description="Our intelligent system analyzes your symptoms in real-time to accurately determine your potential cardiac risk level." />
                <FeatureCard icon={<ConnectIcon />} title="Instant CHW Connection" description="High-risk alerts are immediately sent to the nearest available Community Health Worker (CHW) for rapid follow-up." />
                <FeatureCard icon={<LocationIcon />} title="Real-Time Location Matching" description="We use geolocation to find the closest CHW, minimizing response times when every second counts." />
            </div>
        </div>
    </section>
);

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <div className="p-8 bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg shadow-slate-500/5 dark:shadow-black/10">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-teal-600 mx-auto">
            {icon}
        </div>
        <h3 className="mt-6 text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-300">{description}</p>
    </div>
);

const HowItWorksSection: React.FC = () => (
    <section id="how-it-works" className="py-16 sm:py-20 bg-white dark:bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Get Help in 3 Simple Steps</h2>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                <Step number="1" title="Describe Symptoms" description="Answer a few simple questions about your symptoms using our intuitive form." />
                <Step number="2" title="Get AI Assessment" description="Our AI analyzes your answers and determines your risk level in seconds." />
                <Step number="3" title="Connect With Help" description="If you're high-risk, a local health worker is alerted and will contact you shortly." />
            </div>
        </div>
    </section>
);

const Step: React.FC<{ number: string, title: string, description: string }> = ({ number, title, description }) => (
    <div className="text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900/40 font-bold text-xl text-teal-600 dark:text-teal-300">
                {number}
            </div>
        </div>
        <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-300">{description}</p>
    </div>
);

const TestimonialsSection: React.FC = () => (
    <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Trusted by Communities</h2>
            </div>
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <blockquote className="p-8 bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg shadow-slate-500/5 dark:shadow-black/10">
                    <p className="text-lg text-slate-800 dark:text-slate-200">"When I had chest pains, I was terrified. Using HeartAware was so easy. A health worker called me within minutes and helped me get to a clinic. I am so grateful for this service."</p>
                    <footer className="mt-6 font-semibold text-slate-600 dark:text-slate-300">- Aisha, Lagos Resident</footer>
                </blockquote>
                <blockquote className="p-8 bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg shadow-slate-500/5 dark:shadow-black/10">
                    <p className="text-lg text-slate-800 dark:text-slate-200">"As a CHW, this app is revolutionary. It helps me prioritize the most critical cases and reach people faster. It's a true game-changer for community health in Nigeria."</p>
                    <footer className="mt-6 font-semibold text-slate-600 dark:text-slate-300">- Mr. Chidi, Community Health Worker</footer>
                </blockquote>
            </div>
        </div>
    </section>
);


const TrustSection: React.FC = () => (
    <section className="py-16 sm:py-20 bg-white dark:bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Our Mission: Saving Lives with Technology</h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                        HeartAware NG was founded with a simple but powerful mission: to bridge the gap between cardiac emergencies and immediate care in Nigerian communities. We believe that technology can empower local health workers and save lives by ensuring help arrives faster.
                    </p>
                    <ul className="mt-6 space-y-3">
                        <li className="flex items-start"><CheckIcon /><span className="ml-3 text-slate-600 dark:text-slate-300">Built for low-bandwidth environments.</span></li>
                        <li className="flex items-start"><CheckIcon /><span className="ml-3 text-slate-600 dark:text-slate-300">Partnering with local health organizations.</span></li>
                        <li className="flex items-start"><CheckIcon /><span className="ml-3 text-slate-600 dark:text-slate-300">Committed to patient data privacy and security.</span></li>
                    </ul>
                </div>
                 <div className="text-center">
                    <div className="inline-block p-8 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                        <svg className="h-48 w-48 text-teal-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 3.5a1.5 1.5 0 011.5 1.5v2.879a1.5 1.5 0 01-.44 1.06l-1.62 1.62a.5.5 0 000 .707l1.62 1.62a1.5 1.5 0 01.44 1.06V15a1.5 1.5 0 01-3 0v-1.121a1.5 1.5 0 01.44-1.06l1.62-1.62a.5.5 0 000-.707L8.56 8.94A1.5 1.5 0 018.12 7.88V5A1.5 1.5 0 0110 3.5z" />
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </section>
);


const FaqSection: React.FC = () => (
    <section id="faq" className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Frequently Asked Questions</h2>
            </div>
            <div className="mt-10 space-y-6">
                <FaqItem question="Is this service free?">
                    Yes, using HeartAware NG for symptom assessment and connection with a Community Health Worker is completely free of charge. Our goal is to make emergency triage accessible to everyone.
                </FaqItem>
                 <FaqItem question="What happens after I submit my symptoms?">
                    Our AI system provides an instant risk assessment. If you are classified as high-risk, we automatically alert the nearest registered CHW, who will then contact you by phone to provide further guidance.
                </FaqItem>
                 <FaqItem question="Is this a replacement for a doctor?">
                    No. HeartAware NG is a triage tool designed for emergencies. It is not a diagnostic tool and does not replace professional medical advice from a doctor. For high-risk cases, we facilitate a connection to a health worker who can provide immediate guidance.
                </FaqItem>
            </div>
        </div>
    </section>
);

const FaqItem: React.FC<{ question: string, children: React.ReactNode }> = ({ question, children }) => (
    <details className="p-5 bg-white dark:bg-slate-800/50 rounded-lg shadow-sm group">
        <summary className="flex justify-between items-center font-semibold cursor-pointer text-slate-900 dark:text-white">
            {question}
            <svg className="h-6 w-6 transform group-open:rotate-180 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        </summary>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
            {children}
        </p>
    </details>
);

const CtaSection: React.FC = () => (
     <section className="bg-white dark:bg-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
             <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Don't Wait. Check Your Symptoms Now.</h2>
             <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
                Early detection is key. Get a free, instant risk assessment and connect with the care you need.
            </p>
            <div className="mt-8">
                 <Link to="/symptom-checker">
                    <Button variant="primary" className="!text-lg !py-4 !px-8">Start Symptom Assessment</Button>
                </Link>
            </div>
        </div>
     </section>
);


const LandingPage: React.FC = () => {
    return (
        <div className="overflow-x-hidden">
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <TrustSection />
            <FaqSection />
            <CtaSection />
        </div>
    );
};

export default LandingPage;
