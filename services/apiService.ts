
import { Symptom, SymptomData, RiskLevel, Alert, AlertStatus, Resolution, CommunityHealthWorker } from '../types';
import { NIGERIAN_STATES } from '../constants';

// --- MOCK DATABASE ---
const mockCHWs: CommunityHealthWorker[] = [
    { id: 1, fullName: 'Adebayo Akinwunmi', phone: '+2348012345678' },
    { id: 2, fullName: 'Fatima Bello', phone: '+2348023456789' },
    { id: 3, fullName: 'Chinedu Okoro', phone: '+2348034567890' },
];

let mockAlerts: Alert[] = [
    {
        id: 1,
        userPhone: '+2349098765432',
        // FIX: Used Symptom enum member instead of string literal for type safety.
        symptoms: { mainSymptom: Symptom.ChestPain, isCrushing: true },
        riskLevel: RiskLevel.HIGH,
        status: AlertStatus.NEW,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        assignedTo: mockCHWs[0],
        userLocation: { state: 'Lagos', lga: 'Ikeja', city: 'Ikeja', address: '123 Allen Avenue' },
    },
    {
        id: 2,
        userPhone: '+2348011223344',
        // FIX: Used Symptom enum member instead of string literal for type safety.
        symptoms: { mainSymptom: Symptom.Dizziness },
        riskLevel: RiskLevel.MEDIUM,
        status: AlertStatus.CONTACTING,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        assignedTo: mockCHWs[1],
        userLocation: { lat: 9.0765, lng: 7.3986, state: 'Abuja (FCT)', lga: 'AMAC' },
    },
];
let nextAlertId = 3;

// --- MOCK API FUNCTIONS ---

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Simulates /api/predict and /api/create-alert
export const submitSymptoms = async (data: SymptomData, isEmergency = false): Promise<{ riskLevel: RiskLevel }> => {
    console.log('Submitting symptoms:', data);
    await delay(1500);

    let riskLevel: RiskLevel;
    if (isEmergency) {
        riskLevel = RiskLevel.HIGH;
    } else {
        const rand = Math.random();
        if (rand < 0.33) riskLevel = RiskLevel.LOW;
        else if (rand < 0.66) riskLevel = RiskLevel.MEDIUM;
        else riskLevel = RiskLevel.HIGH;
    }

    if (riskLevel === RiskLevel.HIGH) {
        const newAlert: Alert = {
            id: nextAlertId++,
            userPhone: data.phone,
            symptoms: data,
            riskLevel: RiskLevel.HIGH,
            status: AlertStatus.NEW,
            createdAt: new Date().toISOString(),
            assignedTo: mockCHWs[Math.floor(Math.random() * mockCHWs.length)], // Random assignment
            userLocation: data.location,
        };
        mockAlerts.unshift(newAlert);
        console.log('High risk alert created:', newAlert);
    }

    return { riskLevel };
};


// Simulates /api/chw/alerts
export const getCHWAlerts = async (chwId: number = 1): Promise<Alert[]> => {
    console.log('Fetching alerts for CHW:', chwId);
    await delay(500);
    // In a real app, this would filter by chwId
    return [...mockAlerts].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};


// Simulates /api/chw/update-alert (for status)
export const updateAlertStatus = async (alertId: number, status: AlertStatus): Promise<Alert> => {
    console.log(`Updating alert ${alertId} status to ${status}`);
    await delay(500);
    const alertIndex = mockAlerts.findIndex(a => a.id === alertId);
    if (alertIndex > -1) {
        mockAlerts[alertIndex].status = status;
        return { ...mockAlerts[alertIndex] };
    }
    throw new Error('Alert not found');
};

// Simulates /api/chw/update-alert (for resolution)
export const resolveAlert = async (alertId: number, resolution: Resolution, notes?: string): Promise<Alert> => {
    console.log(`Resolving alert ${alertId} with: ${resolution}`);
    await delay(1000);
    const alertIndex = mockAlerts.findIndex(a => a.id === alertId);
    if (alertIndex > -1) {
        mockAlerts[alertIndex].status = AlertStatus.RESOLVED;
        mockAlerts[alertIndex].resolution = resolution;
        mockAlerts[alertIndex].chwNotes = notes;
        mockAlerts[alertIndex].resolvedAt = new Date().toISOString();
        return { ...mockAlerts[alertIndex] };
    }
    throw new Error('Alert not found');
};

// --- MOCK AUTH FUNCTIONS ---

export const chwLogin = async (email: string, password: string): Promise<{ token: string }> => {
    console.log(`Attempting login for: ${email}`);
    await delay(1000);
    // Dummy validation
    if (email && password && password.length >= 6) {
        return { token: `mock_token_${Date.now()}` };
    }
    throw new Error('Invalid credentials. Please try again.');
};

interface SignUpData {
    fullName: string;
    email: string;
    phone: string;
    password: string;
}

export const chwSignUp = async (data: SignUpData): Promise<{ token: string }> => {
    console.log('Signing up new CHW:', data.fullName);
    await delay(1500);
    if (data.email && data.fullName && data.password.length >= 6) {
        // In a real app, this would create a new user in the database
        const newCHW: CommunityHealthWorker = {
            id: mockCHWs.length + 1,
            fullName: data.fullName,
            phone: data.phone,
        };
        mockCHWs.push(newCHW);
        console.log('New CHW created:', newCHW);
        return { token: `mock_token_for_new_user_${Date.now()}` };
    }
    throw new Error('Invalid sign-up data provided.');
};
