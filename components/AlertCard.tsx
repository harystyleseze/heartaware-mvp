import React from 'react';
import { Alert, AlertStatus, RiskLevel } from '../types';
import { Button } from './Button';

interface AlertCardProps {
    alert: Alert;
    onUpdateStatus: (alertId: number, status: AlertStatus) => void;
    onResolve: (alertId: number) => void;
}

const riskStyles = {
    [RiskLevel.HIGH]: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-800', tagBg: 'bg-red-500' },
    [RiskLevel.MEDIUM]: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-800', tagBg: 'bg-yellow-500' },
    [RiskLevel.LOW]: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-800', tagBg: 'bg-green-500' },
};

const statusStyles = {
    [AlertStatus.NEW]: 'bg-blue-100 text-blue-800',
    [AlertStatus.CONTACTING]: 'bg-purple-100 text-purple-800',
    [AlertStatus.RESOLVED]: 'bg-slate-200 text-slate-800',
}

const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


export const AlertCard: React.FC<AlertCardProps> = ({ alert, onUpdateStatus, onResolve }) => {
    const { riskLevel, status, userLocation, userPhone, id, createdAt } = alert;
    const styles = riskStyles[riskLevel];
    
    const formattedDate = new Date(createdAt).toLocaleString();
    const locationString = userLocation.address 
        ? `${userLocation.address}, ${userLocation.city}` 
        : userLocation.city
        ? `${userLocation.city}, ${userLocation.lga}, ${userLocation.state}`
        : 'GPS Location Available';

    return (
        <div className={`rounded-lg border-l-4 ${styles.border} ${styles.bg} p-4 shadow-sm flex flex-col sm:flex-row gap-4`}>
            <div className="flex-grow space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <span className={`inline-block px-3 py-1 text-xs font-semibold text-white ${styles.tagBg} rounded-full`}>
                            {riskLevel} RISK
                        </span>
                        <p className={`mt-2 text-lg font-bold ${styles.text}`}>{userPhone}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>{status}</span>
                </div>

                <div>
                    <p className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                        <span className="w-4 h-4"><MapPinIcon /></span>
                        Location:
                    </p>
                    <p className="text-sm text-slate-600 pl-5">{locationString}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-500">Received: {formattedDate}</p>
                </div>
            </div>
            
            <div className="flex flex-col justify-center gap-2 sm:w-40 flex-shrink-0">
                {userLocation.lat && userLocation.lng && (
                    <Button 
                        variant="secondary"
                        leftIcon={<MapPinIcon />}
                        onClick={() => window.open(`https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`, '_blank')}
                    >
                        View Map
                    </Button>
                )}
                <a href={`tel:${userPhone}`} className="w-full">
                    <Button 
                        fullWidth 
                        leftIcon={<PhoneIcon />}
                        onClick={() => onUpdateStatus(id, AlertStatus.CONTACTING)}
                        disabled={status !== AlertStatus.NEW}
                    >
                        Call Patient
                    </Button>
                </a>
                <Button 
                    variant="primary" 
                    leftIcon={<CheckCircleIcon/>}
                    onClick={() => onResolve(id)}
                    disabled={status === AlertStatus.RESOLVED}
                >
                    Resolve
                </Button>
            </div>
        </div>
    );
};