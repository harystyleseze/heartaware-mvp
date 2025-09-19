
import { Symptom, Duration, Resolution } from './types';

export const NIGERIAN_STATES: { [key: string]: string[] } = {
    "Lagos": ["Ikeja", "Alimosho", "Kosofe", "Mushin", "Oshodi-Isolo", "Surulere", "Lagos Island"],
    "Kano": ["Kano Municipal", "Fagge", "Dala", "Gwale", "Tarauni"],
    "Enugu": ["Enugu North", "Enugu South", "Enugu East", "Udi", "Nsukka"],
    "Rivers": ["Port Harcourt", "Obio-Akpor"],
    "Abuja (FCT)": ["Abuja Municipal Area Council (AMAC)"]
};

export const SYMPTOM_OPTIONS = Object.values(Symptom);
export const DURATION_OPTIONS = Object.values(Duration);
export const RESOLUTION_OPTIONS = Object.values(Resolution);

export const PHONE_REGEX = /^\+234[789][01]\d{8}$/;
