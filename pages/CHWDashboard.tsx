
import React, { useState, useEffect, useCallback } from 'react';
import { Alert, AlertStatus, Resolution } from '../types';
import { getCHWAlerts, updateAlertStatus, resolveAlert } from '../services/apiService';
import { AlertCard } from '../components/AlertCard';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import { RESOLUTION_OPTIONS } from '../constants';
import { Spinner } from '../components/Spinner';
import { useAuth } from '../hooks/useAuth';

const FILTERS: Array<AlertStatus | 'ALL'> = ['ALL', AlertStatus.NEW, AlertStatus.CONTACTING, AlertStatus.RESOLVED];

const CHWDashboard: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<AlertStatus | 'ALL'>(AlertStatus.NEW);
    const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [resolution, setResolution] = useState<Resolution | ''>('');
    const [isResolving, setIsResolving] = useState(false);
    const { logout } = useAuth();
    
    const fetchAlerts = useCallback(async () => {
        if (!isLoading) setIsLoading(true);
        setError(null);
        try {
            const fetchedAlerts = await getCHWAlerts(1); // Assuming CHW ID is 1
            setAlerts(fetchedAlerts);
        } catch (err) {
            setError("Failed to fetch alerts.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    useEffect(() => {
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 30000); // Poll for new alerts every 30 seconds
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUpdateStatus = async (alertId: number, status: AlertStatus) => {
        try {
            await updateAlertStatus(alertId, status);
            fetchAlerts(); // Re-fetch to update UI
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const handleOpenResolveModal = (alertId: number) => {
        const alertToResolve = alerts.find(a => a.id === alertId);
        if (alertToResolve) {
            setSelectedAlert(alertToResolve);
            setResolution('');
            setIsResolveModalOpen(true);
        }
    };
    
    const handleResolve = async () => {
        if (!selectedAlert || !resolution) return;
        setIsResolving(true);
        try {
            await resolveAlert(selectedAlert.id, resolution);
            setIsResolveModalOpen(false);
            setSelectedAlert(null);
            fetchAlerts();
        } catch (err) {
            console.error("Failed to resolve alert", err);
        } finally {
            setIsResolving(false);
        }
    };

    const filteredAlerts = alerts.filter(alert => filter === 'ALL' || alert.status === filter);
    const alertCounts = FILTERS.reduce((acc, f) => {
        acc[f] = f === 'ALL' ? alerts.length : alerts.filter(a => a.status === f).length;
        return acc;
    }, {} as Record<AlertStatus | 'ALL', number>);


    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">CHW Alert Dashboard</h1>
                <Button variant="secondary" onClick={logout}>Log Out</Button>
            </div>
            
            <div className="mb-6 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-md shadow-slate-500/5 flex flex-wrap items-center gap-2">
                 {FILTERS.map(f => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${filter === f ? 'bg-teal-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                    >
                        {f}
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filter === f ? 'bg-white text-teal-700' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                            {alertCounts[f]}
                        </span>
                    </button>
                ))}
            </div>


            {isLoading && alerts.length === 0 ? (
                <div className="flex justify-center items-center p-10"><Spinner size="lg" color="border-teal-600 dark:border-teal-500"/></div>
            ) : error ? (
                <p className="text-center text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">{error}</p>
            ) : filteredAlerts.length === 0 ? (
                <div className="text-center bg-white dark:bg-slate-800 p-10 rounded-lg shadow">
                    <h3 className="text-xl font-medium text-slate-700 dark:text-slate-300">No alerts found</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">There are no "{filter}" alerts at the moment.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAlerts.map(alert => (
                        <AlertCard 
                            key={alert.id} 
                            alert={alert}
                            onUpdateStatus={handleUpdateStatus}
                            onResolve={handleOpenResolveModal}
                        />
                    ))}
                </div>
            )}
            
            <Modal
                isOpen={isResolveModalOpen}
                onClose={() => setIsResolveModalOpen(false)}
                title={`Resolve Alert for ${selectedAlert?.userPhone}`}
            >
                <div className="space-y-4">
                    <Select label="Resolution Reason" value={resolution} onChange={(e) => setResolution(e.target.value as Resolution)}>
                         <option value="">Select a reason</option>
                         {RESOLUTION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </Select>
                    <textarea 
                        className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-lg p-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                        rows={3}
                        placeholder="Add optional notes..."
                    />
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="secondary" onClick={() => setIsResolveModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleResolve} isLoading={isResolving} disabled={!resolution}>
                            Confirm Resolution
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CHWDashboard;