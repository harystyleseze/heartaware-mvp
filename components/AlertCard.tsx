import React from 'react';
import { Alert, AlertStatus, RiskLevel } from '../types';
import { Button } from './Button';

interface AlertCardProps {
    alert: Alert;
    onUpdateStatus: (alertId: number, status: AlertStatus) => void;
    onResolve: (alertId: number) => void;
}

const riskStyles = {
    [RiskLevel.HIGH]: { 
        bg: 'bg-red-50 dark:bg-red-900/20', 
        border: 'border-red-500 dark:border-red-500/60', 
        text: 'text-red-800 dark:text-red-300', 
        tagBg: 'bg-red-500',
        iconColor: 'text-red-500 dark:text-red-400'
    },
    [RiskLevel.MEDIUM]: { 
        bg: 'bg-yellow-50 dark:bg-yellow-900/20', 
        border: 'border-yellow-500 dark:border-yellow-500/60', 
        text: 'text-yellow-800 dark:text-yellow-300', 
        tagBg: 'bg-yellow-500',
        iconColor: 'text-yellow-500 dark:text-yellow-400'
    },
    [RiskLevel.LOW]: { 
        bg: 'bg-green-50 dark:bg-green-900/20', 
        border: 'border-green-500 dark:border-green-500/60', 
        text: 'text-green-800 dark:text-green-300', 
        tagBg: 'bg-green-500',
        iconColor: 'text-green-500 dark:text-green-400'
    },
};

const statusStyles = {
    [AlertStatus.NEW]: 'bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300',
    [AlertStatus.CONTACTING]: 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300',
    [AlertStatus.RESOLVED]: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
}

const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


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
        <div className={`rounded-xl border-l-4 ${styles.border} ${styles.bg} p-4 sm:p-5 shadow-lg shadow-slate-500/5 dark:shadow-black/10 flex flex-col sm:flex-row gap-4`}>
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
                    <p className={`text-sm font-semibold flex items-center gap-1.5 ${styles.text}`}>
                        <span className={`w-5 h-5 ${styles.iconColor}`}><MapPinIcon /></span>
                        Location:
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 pl-7">{locationString}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400/80">Received: {formattedDate}</p>
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
                        variant="primary"
                    >
                        Call Patient
                    </Button>
                </a>
                <Button 
                    variant="secondary" 
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