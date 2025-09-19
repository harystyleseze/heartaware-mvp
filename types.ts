
export enum Symptom {
    ChestPain = 'Chest pain',
    ShortnessOfBreath = 'Shortness of breath',
    Dizziness = 'Dizziness',
}

export enum Duration {
    LessThan15 = '<15min',
    Between15And60 = '15-60min',
    MoreThan60 = '>1hr',
}

export enum RiskLevel {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export enum AlertStatus {
    NEW = 'NEW',
    CONTACTING = 'CONTACTING',
    RESOLVED = 'RESOLVED',
}

export enum Resolution {
    ReferredToClinic = 'Referred to Clinic',
    AdvisedToMonitor = 'Advised to Monitor',
    EmergencyServicesAlerted = 'Emergency Services Alerted',
    CouldNotReach = 'Could Not Reach',
}

export interface LocationData {
    lat?: number;
    lng?: number;
    state?: string;
    lga?: string;
    city?: string;
    address?: string;
}

export interface SymptomData {
    mainSymptom: Symptom | '';
    isCrushing: boolean | null;
    doesRadiate: boolean | null;
    isSweating: boolean | null;
    duration: Duration | '';
    phone: string;
    location: LocationData;
}

export interface CommunityHealthWorker {
    id: number;
    fullName: string;
    phone: string;
}

export interface Alert {
    id: number;
    userPhone: string;
    symptoms: Partial<SymptomData>;
    riskLevel: RiskLevel;
    status: AlertStatus;
    resolution?: Resolution;
    chwNotes?: string;
    createdAt: string;
    resolvedAt?: string;
    assignedTo: CommunityHealthWorker;
    userLocation: LocationData;
}
