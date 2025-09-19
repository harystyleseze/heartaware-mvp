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
            case 2:
                isValid = !!formData.duration;
                newErrors.duration = !isValid ? "Please select a duration." : "";
                break;
            case 3:
                isValid = PHONE_REGEX.test(formData.phone);
                newErrors.phone = !isValid ? "Please enter a valid Nigerian phone number (e.g., +2348012345678)." : '';
                break;
            case 4:
                // FIX: Explicitly convert location checks to booleans to fix a TypeScript error and correctly handle `0` as a valid coordinate.
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
        // Auto-advance from symptom selection
        if (currentStep === 0 && formData.mainSymptom) {
            const timer = setTimeout(() => nextStep(), 300); // Small delay for UX
            return () => clearTimeout(timer);
        }
    }, [formData.mainSymptom, currentStep, nextStep]);

    useEffect(() => {
        // Auto-advance from duration selection
        if (currentStep === 2 && formData.duration) {
            const timer = setTimeout(() => nextStep(), 300);
            return () => clearTimeout(timer);
        }
    }, [formData.duration, currentStep, nextStep]);
    
    useEffect(() => {
        // Handle location data when it arrives
        if (geoLoc) {
            setFormData(prev => ({ ...prev, location: { ...prev.location, ...geoLoc } }));
            setIsManualLocation(false);
            setErrors(prev => ({...prev, location: ''}));
        }
    }, [geoLoc]);
    
    useEffect(() => {
        // Auto-submit after automatic location capture on the final step
        const hasAutoLocation = formData.location.lat != null && formData.location.lng != null && !isManualLocation;
        if (currentStep === TOTAL_STEPS - 1 && hasAutoLocation && formStatus === 'idle') {
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
        <div className={`max-w-xl mx-auto bg-white p-4 sm:p-6 rounded-2xl shadow-xl transition-opacity duration-300 ${isHighRiskSubmission ? 'opacity-50 pointer-events-none' : ''}`}>
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
                        {errors.mainSymptom && <p className="text-xs text-red-600 text-center mt-2">{errors.mainSymptom}</p>}
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
                        {errors.duration && <p className="text-xs text-red-600 text-center mt-2">{errors.duration}</p>}
                    </StepWrapper>
                )}
                
                {currentStep === 3 && (
                    <StepWrapper title="What is your contact number?">
                        <p className="text-sm text-center text-slate-600 mb-4">We need this to connect you with a health worker.</p>
                        <Input id="phone" label="Phone Number" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} error={errors.phone} placeholder="+2348012345678" />
                    </StepWrapper>
                )}

                {currentStep === 4 && (
                    <StepWrapper title="Where are you located?">
                        {isAutoSubmitting ? (
                             <div className="text-center p-4 min-h-[200px] flex flex-col justify-center items-center">
                                <Spinner color="border-blue-600" />
                                <p className="text-sm text-slate-600 mt-2 font-semibold animate-pulse">Location captured! Submitting your assessment...</p>
                            </div>
                        ) : (
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4 text-center">
                                <Button type="button" onClick={() => getLocation()} isLoading={isGeoLoading} fullWidth disabled={!!geoLoc}>
                                    {geoLoc ? 'Location Shared Successfully!' : 'Share Location Automatically'}
                                </Button>
                                {geoError && <p className="text-xs text-red-600">{geoError}</p>}
                                {geoLoc && <p className="text-xs text-green-600">GPS coordinates captured! You can proceed.</p>}
                                
                                <div className="text-sm text-slate-500">or</div>
                                
                                <button onClick={() => setIsManualLocation(p => !p)} className="text-blue-600 font-semibold text-sm">
                                    {isManualLocation ? 'Hide Manual Entry' : 'Enter Address Manually'}
                                </button>
                                
                            {isManualLocation && (
                                <div className="text-left space-y-4 pt-4 border-t">
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
                                    <Input id="address" label="Street Address" value={formData.location.address || ''} onChange={e => handleLocationChange('address', e.target.value)} />
                                </div>
                            )}
                            {errors.location && <p className="text-xs text-red-600 text-center">{errors.location}</p>}
                            </div>
                        )}
                    </StepWrapper>
                )}
                
                <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                    <Button type="button" variant="secondary" onClick={prevStep} disabled={currentStep === 0}>
                        Back
                    </Button>
                    {currentStep < TOTAL_STEPS - 1 && (
                         <Button type="button" variant="primary" onClick={nextStep} fullWidth>
                            Next
                        </Button>
                    )}
                    {currentStep === TOTAL_STEPS - 1 && (
                        <Button type="submit" variant="primary" onClick={() => handleSubmit()} isLoading={formStatus === 'submitting'} fullWidth disabled={isAutoSubmitting}>
                            Assess My Risk
                        </Button>
                    )}
                </div>

                 <div className="text-center">
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
        <p className="text-sm font-medium text-slate-500 mb-1 text-center">Step {current} of {total}</p>
        <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(current / total) * 100}%` }}></div>
        </div>
    </div>
);

const StepWrapper: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
    <div className="space-y-4 animate-fade-in">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 text-center">{title}</h2>
        <div className="space-y-4">{children}</div>
    </div>
);

const OptionButton: React.FC<{onClick: () => void; isSelected: boolean; children: React.ReactNode}> = ({ onClick, isSelected, children }) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 font-semibold ${isSelected ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200 text-blue-800' : 'bg-white border-slate-300 hover:border-blue-400'}`}
    >
        {children}
    </button>
);

const YesNoToggle: React.FC<{label: string; value: boolean | null; onChange: (value: boolean) => void}> = ({label, value, onChange}) => (
    <div className="p-3 bg-slate-50 rounded-lg">
        <p className="text-sm font-medium text-slate-700 mb-2">{label}</p>
        <div className="grid grid-cols-2 gap-2">
            <button
                type="button"
                onClick={() => onChange(true)}
                className={`p-2 rounded-md font-semibold text-sm transition-colors ${value === true ? 'bg-blue-600 text-white' : 'bg-white hover:bg-slate-200'}`}
            >
                Yes
            </button>
             <button
                type="button"
                onClick={() => onChange(false)}
                className={`p-2 rounded-md font-semibold text-sm transition-colors ${value === false ? 'bg-blue-600 text-white' : 'bg-white hover:bg-slate-200'}`}
            >
                No
            </button>
        </div>
    </div>
);


const FeedbackScreen: React.FC<{riskLevel: RiskLevel, onReset: () => void}> = ({riskLevel, onReset}) => {
    const feedbackContent = {
        [RiskLevel.LOW]: {
            bgColor: "bg-green-50", title: "Low Risk Detected", icon: "✅", message: "Your symptoms currently suggest a low risk. However, please continue to monitor your health and consult a doctor if symptoms worsen.",
        },
        [RiskLevel.MEDIUM]: {
            bgColor: "bg-yellow-50", title: "Medium Risk Detected", icon: "⚠️", message: "Your symptoms indicate a medium risk. We recommend visiting a nearby clinic or consulting a doctor soon for a professional evaluation.",
        },
        [RiskLevel.HIGH]: {
            bgColor: "bg-red-50", title: "High Risk Detected", icon: "🚨", message: "Hang tight, help is on the way. We have alerted a nearby Community Health Worker who will contact you shortly. Please try to remain calm.",
        }
    };
    
    const content = feedbackContent[riskLevel];
    
    if (riskLevel === RiskLevel.HIGH) {
         return (
             <div className="max-w-2xl mx-auto text-center p-8">
                 <div className="animate-pulse text-6xl mb-4">{content.icon}</div>
                 <h2 className="text-3xl font-bold text-red-800 mb-2">{content.title}</h2>
                 <p className="text-slate-700 mb-6">{content.message}</p>
                 <Spinner size="lg" color="border-red-600" />
                 <p className="text-sm text-slate-500 mt-4">Do not close this page.</p>
             </div>
         );
    }
    
    return (
        <div className={`max-w-2xl mx-auto text-center p-8 rounded-lg shadow-md ${content.bgColor}`}>
            <div className="text-6xl mb-4">{content.icon}</div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">{content.title}</h2>
            <p className="text-slate-700 mb-6">{content.message}</p>
            <Button onClick={onReset}>Submit Another Response</Button>
        </div>
    );
};


export default PatientForm;
