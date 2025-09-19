import React, { useState, useCallback, useEffect } from 'react';
import { SymptomData, RiskLevel, LocationData, Symptom, Duration } from '../types';
import { SYMPTOM_OPTIONS, DURATION_OPTIONS, PHONE_REGEX, NIGERIAN_STATES } from '../constants';
import { submitSymptoms } from '../services/apiService';
import { useGeolocation } from '../hooks/useGeolocation';
import { useInactivityTimer } from '../hooks/useInactivityTimer';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Spinner } from '../components/Spinner';

type FormStatus = 'idle' | 'submitting' | 'submitted';

const TOTAL_STEPS = 5;

const PatientForm: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<SymptomData>({
        mainSymptom: '', isCrushing: null, doesRadiate: null, isSweating: null, duration: '', phone: '+234', location: {},
    });
    const [errors, setErrors] = useState<Partial<Record<keyof SymptomData, string>>>({});
    const [formStatus, setFormStatus] = useState<FormStatus>('idle');
    const [riskLevel, setRiskLevel] = useState<RiskLevel | null>(null);
    const [isManualLocation, setIsManualLocation] = useState(false);
    const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);
    
    const { location: geoLoc, isLoading: isGeoLoading, error: geoError, getLocation } = useGeolocation();

    const handleFormSubmitForInactivity = useCallback(() => {
        if(formData.phone.length > 4 || geoLoc){
             console.log("Inactivity timer triggered. Submitting partial data.");
             submitSymptoms({ ...formData, location: geoLoc || formData.location }, true)
             .then(response => {
                setRiskLevel(response.riskLevel);
                setFormStatus('submitted');
                stopTimer();
            });
        }
    }, [formData, geoLoc]);

    const { stopTimer, resetTimer } = useInactivityTimer(handleFormSubmitForInactivity, 60000);

    const validateStep = useCallback((step: number): boolean => {
        const newErrors: Partial<Record<keyof SymptomData, string>> = {...errors};
        let isValid = true;
        
        switch(step) {
            case 0:
                isValid = !!formData.mainSymptom;
                newErrors.mainSymptom = !isValid ? "Please select a symptom." : "";
                break;
            case 1:
                isValid = formData.isCrushing !== null && formData.doesRadiate !== null && formData.isSweating !== null;
                break;
            case 2:
                isValid = !!formData.duration;
                newErrors.duration = !isValid ? "Please select a duration." : "";
                break;
            case 3:
                isValid = PHONE_REGEX.test(formData.phone);
                newErrors.phone = !isValid ? "Please enter a valid Nigerian phone number (e.g., +2348012345678)." : '';
                break;
            case 4:
                const hasGeoLocation = formData.location.lat != null && formData.location.lng != null;
                const hasManualLocation = !!(formData.location.state && formData.location.lga && formData.location.city);
                isValid = hasGeoLocation || hasManualLocation;
                newErrors.location = !isValid ? "Please provide your location, either automatically or manually." : '';
                break;
        }
        
        setErrors(newErrors);
        return isValid;
    }, [formData, errors]);
    
    const nextStep = useCallback(() => {
      if(validateStep(currentStep)){
        setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS - 1));
      }
    }, [currentStep, validateStep]);

    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const handleSubmit = useCallback(async (isEmergency = false) => {
        if (formStatus !== 'idle') return;
        if (!isEmergency && !validateStep(4)) return;
        
        setFormStatus('submitting');
        setRiskLevel(null);
        stopTimer();

        try {
            const response = await submitSymptoms(formData, isEmergency);
            setRiskLevel(response.riskLevel);
        } catch (error) {
            console.error("Submission failed:", error);
        } finally {
            setFormStatus('submitted');
        }
    }, [formData, stopTimer, formStatus, validateStep]);

    // --- Auto-navigation Effects ---

    useEffect(() => {
        if (currentStep === 0 && formData.mainSymptom) {
            const timer = setTimeout(() => nextStep(), 300);
            return () => clearTimeout(timer);
        }
    }, [formData.mainSymptom, currentStep, nextStep]);

    useEffect(() => {
        if (currentStep === 1 && formData.isCrushing !== null && formData.doesRadiate !== null && formData.isSweating !== null) {
            const timer = setTimeout(() => nextStep(), 500);
            return () => clearTimeout(timer);
        }
    }, [formData.isCrushing, formData.doesRadiate, formData.isSweating, currentStep, nextStep]);

    useEffect(() => {
        if (currentStep === 2 && formData.duration) {
            const timer = setTimeout(() => nextStep(), 300);
            return () => clearTimeout(timer);
        }
    }, [formData.duration, currentStep, nextStep]);

    useEffect(() => {
        if (currentStep === 3 && PHONE_REGEX.test(formData.phone)) {
            const timer = setTimeout(() => nextStep(), 500);
            return () => clearTimeout(timer);
        }
    }, [formData.phone, currentStep, nextStep]);
    
    useEffect(() => {
        if (geoLoc) {
            setFormData(prev => ({ ...prev, location: { ...prev.location, ...geoLoc } }));
            setIsManualLocation(false);
            setErrors(prev => ({...prev, location: ''}));
        }
    }, [geoLoc]);
    
    useEffect(() => {
        const hasAutoLocation = formData.location.lat != null && formData.location.lng != null && !isManualLocation;
        const hasCompletedManualLocation = isManualLocation && !!(formData.location.state && formData.location.lga && formData.location.city);

        if (currentStep === TOTAL_STEPS - 1 && (hasAutoLocation || hasCompletedManualLocation) && formStatus === 'idle') {
            setIsAutoSubmitting(true);
            const timer = setTimeout(() => handleSubmit(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [formData.location, currentStep, isManualLocation, formStatus, handleSubmit]);


    const handleLocationChange = <K extends keyof LocationData>(field: K, value: LocationData[K]) => {
         setFormData(prev => ({...prev, location: {...prev.location, [field]: value}}));
         if(field === 'state') {
            setFormData(prev => ({...prev, location: {...prev.location, lga: ''}}));
         }
         validateStep(4);
    };

    const resetForm = () => {
        setFormData({ mainSymptom: '', isCrushing: null, doesRadiate: null, isSweating: null, duration: '', phone: '+234', location: {} });
        setErrors({});
        setFormStatus('idle');
        setRiskLevel(null);
        setCurrentStep(0);
        setIsManualLocation(false);
        setIsAutoSubmitting(false);
        resetTimer();
    };

    if (formStatus === 'submitted' && riskLevel) {
        return <FeedbackScreen riskLevel={riskLevel} onReset={resetForm} />;
    }
    
    const isHighRiskSubmission = formStatus === 'submitting' && riskLevel === RiskLevel.HIGH;

    return (
        <div className={`max-w-xl mx-auto bg-white dark:bg-slate-800/50 p-4 sm:p-6 rounded-2xl shadow-2xl shadow-slate-500/10 dark:shadow-black/20 transition-opacity duration-300 ${isHighRiskSubmission ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="space-y-6">
                <ProgressBar current={currentStep + 1} total={TOTAL_STEPS} />

                {currentStep === 0 && (
                    <StepWrapper title="What is your main symptom?">
                        <div className="grid grid-cols-1 gap-3">
                           {SYMPTOM_OPTIONS.map(symptom => (
                                <OptionButton key={symptom} isSelected={formData.mainSymptom === symptom} onClick={() => setFormData({...formData, mainSymptom: symptom})}>
                                    {symptom}
                                </OptionButton>
                           ))}
                        </div>
                        {errors.mainSymptom && <p className="text-xs text-red-600 dark:text-red-400 text-center mt-2">{errors.mainSymptom}</p>}
                    </StepWrapper>
                )}
                
                {currentStep === 1 && (
                     <StepWrapper title="Please provide a few more details.">
                        <YesNoToggle label="Is the pain crushing or squeezing?" value={formData.isCrushing} onChange={val => setFormData({...formData, isCrushing: val})} />
                        <YesNoToggle label="Does pain radiate to other parts (arm, jaw)?" value={formData.doesRadiate} onChange={val => setFormData({...formData, doesRadiate: val})} />
                        <YesNoToggle label="Are you sweating?" value={formData.isSweating} onChange={val => setFormData({...formData, isSweating: val})} />
                    </StepWrapper>
                )}

                {currentStep === 2 && (
                    <StepWrapper title="How long have the symptoms lasted?">
                         <div className="grid grid-cols-1 gap-3">
                            {DURATION_OPTIONS.map(duration => (
                                <OptionButton key={duration} isSelected={formData.duration === duration} onClick={() => setFormData({...formData, duration})}>
                                    {duration}
                                </OptionButton>
                            ))}
                        </div>
                        {errors.duration && <p className="text-xs text-red-600 dark:text-red-400 text-center mt-2">{errors.duration}</p>}
                    </StepWrapper>
                )}
                
                {currentStep === 3 && (
                    <StepWrapper title="What is your contact number?">
                        <p className="text-sm text-center text-slate-600 dark:text-slate-400 mb-4">We need this to connect you with a health worker.</p>
                        <Input id="phone" label="Phone Number" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} error={errors.phone} placeholder="+2348012345678" />
                    </StepWrapper>
                )}

                {currentStep === 4 && (
                    <StepWrapper title="Where are you located?">
                        {isAutoSubmitting ? (
                             <div className="text-center p-4 min-h-[200px] flex flex-col justify-center items-center">
                                <Spinner color="border-teal-600 dark:border-teal-500" />
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-semibold animate-pulse">Location captured! Submitting your assessment...</p>
                            </div>
                        ) : (
                            <div className="space-y-4 text-center">
                                <LocationPermissionCard
                                    onAllow={getLocation}
                                    isLoading={isGeoLoading}
                                    isAllowed={!!geoLoc}
                                    error={geoError}
                                />
                                
                                <div className="text-sm text-slate-500 dark:text-slate-400">or</div>
                                
                                <button onClick={() => setIsManualLocation(p => !p)} className="text-teal-600 dark:text-teal-400 font-semibold text-sm hover:underline">
                                    {isManualLocation ? 'Hide Manual Entry' : 'Enter Address Manually'}
                                </button>
                                
                            {isManualLocation && (
                                <div className="text-left space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700/50 animate-fade-in">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Select id="state" label="State" value={formData.location.state || ''} onChange={e => handleLocationChange('state', e.target.value)}>
                                            <option value="">Select State</option>
                                            {Object.keys(NIGERIAN_STATES).map(s => <option key={s} value={s}>{s}</option>)}
                                        </Select>
                                        <Select id="lga" label="LGA" value={formData.location.lga || ''} onChange={e => handleLocationChange('lga', e.target.value)} disabled={!formData.location.state}>
                                            <option value="">Select LGA</option>
                                            {formData.location.state && NIGERIAN_STATES[formData.location.state].map(lga => <option key={lga} value={lga}>{lga}</option>)}
                                        </Select>
                                    </div>
                                    <Input id="city" label="City/Town" value={formData.location.city || ''} onChange={e => handleLocationChange('city', e.target.value)} />
                                    <Input id="address" label="Street Address (Optional)" value={formData.location.address || ''} onChange={e => handleLocationChange('address', e.target.value)} />
                                </div>
                            )}
                            {errors.location && <p className="text-xs text-red-600 dark:text-red-400 text-center">{errors.location}</p>}
                            </div>
                        )}
                    </StepWrapper>
                )}
                
                <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                    >
                        Back
                    </Button>
                </div>

                 <div className="text-center pt-2">
                    <Button type="button" variant="danger" onClick={() => handleSubmit(true)} isLoading={formStatus === 'submitting'}>
                        Emergency - Get Help Now
                    </Button>
                </div>
            </div>
        </div>
    );
};

// --- Wizard Sub-components ---

const ProgressBar: React.FC<{current: number; total: number}> = ({ current, total }) => (
    <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 text-center">Step {current} of {total}</p>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div className="bg-teal-600 dark:bg-teal-500 h-2 rounded-full transition-all duration-300" style={{ width: `${(current / total) * 100}%` }}></div>
        </div>
    </div>
);

const StepWrapper: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
    <div className="space-y-4 animate-fade-in">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 text-center">{title}</h2>
        <div className="space-y-4">{children}</div>
    </div>
);

const OptionButton: React.FC<{onClick: () => void; isSelected: boolean; children: React.ReactNode}> = ({ onClick, isSelected, children }) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-semibold 
        ${isSelected 
            ? 'bg-teal-50 border-teal-500 ring-4 ring-teal-500/20 text-teal-800 dark:bg-teal-500/10 dark:border-teal-500 dark:text-teal-200' 
            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500'}`}
    >
        {children}
    </button>
);

const YesNoToggle: React.FC<{label: string; value: boolean | null; onChange: (value: boolean) => void}> = ({label, value, onChange}) => (
    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</p>
        <div className="grid grid-cols-2 gap-2">
            <button
                type="button"
                onClick={() => onChange(true)}
                className={`p-2 rounded-md font-semibold text-sm transition-colors ${value === true ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500'}`}
            >
                Yes
            </button>
             <button
                type="button"
                onClick={() => onChange(false)}
                className={`p-2 rounded-md font-semibold text-sm transition-colors ${value === false ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500'}`}
            >
                No
            </button>
        </div>
    </div>
);

const LocationPermissionCard: React.FC<{
    onAllow: () => void,
    isLoading: boolean,
    isAllowed: boolean,
    error: string | null
}> = ({ onAllow, isLoading, isAllowed, error }) => (
    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
        <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </div>
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Share your location for a faster response.</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">This allows us to connect you with the nearest health worker instantly.</p>
        <Button type="button" onClick={onAllow} isLoading={isLoading} fullWidth disabled={isAllowed}>
            {isAllowed ? 'Location Shared Successfully!' : 'Allow Location Access'}
        </Button>
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
        {isAllowed && <p className="text-xs text-green-600 dark:text-green-400">GPS coordinates captured! Submitting automatically...</p>}
    </div>
);


const FeedbackScreen: React.FC<{riskLevel: RiskLevel, onReset: () => void}> = ({riskLevel, onReset}) => {
    const feedbackContent = {
        [RiskLevel.LOW]: {
            bgColor: "bg-green-50 dark:bg-green-900/20", 
            title: "Low Risk Detected", 
            icon: "✅", 
            message: "Your symptoms currently suggest a low risk. However, please continue to monitor your health and consult a doctor if symptoms worsen.",
        },
        [RiskLevel.MEDIUM]: {
            bgColor: "bg-yellow-50 dark:bg-yellow-900/20", 
            title: "Medium Risk Detected", 
            icon: "⚠️", 
            message: "Your symptoms indicate a medium risk. We recommend visiting a nearby clinic or consulting a doctor soon for a professional evaluation.",
        },
        [RiskLevel.HIGH]: {
            bgColor: "bg-red-50 dark:bg-red-900/20", 
            title: "High Risk Detected", 
            icon: "🚨", 
            message: "Hang tight, help is on the way. We have alerted a nearby Community Health Worker who will contact you shortly. Please try to remain calm.",
        }
    };
    
    const content = feedbackContent[riskLevel];
    
    if (riskLevel === RiskLevel.HIGH) {
         return (
             <div className="max-w-2xl mx-auto text-center p-8">
                 <div className="animate-pulse text-6xl mb-4">{content.icon}</div>
                 <h2 className="text-3xl font-bold text-red-800 dark:text-red-300 mb-2">{content.title}</h2>
                 <p className="text-slate-700 dark:text-slate-300 mb-6">{content.message}</p>
                 <Spinner size="lg" color="border-red-600" />
                 <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">Do not close this page.</p>
             </div>
         );
    }
    
    return (
        <div className={`max-w-2xl mx-auto text-center p-8 rounded-2xl shadow-lg ${content.bgColor}`}>
            <div className="text-6xl mb-4">{content.icon}</div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{content.title}</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-6">{content.message}</p>
            <Button onClick={onReset}>Submit Another Response</Button>
        </div>
    );
};


export default PatientForm;