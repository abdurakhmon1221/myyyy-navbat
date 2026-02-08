
import React from 'react';
import { Camera } from 'lucide-react';

interface OrgSettingsProps {
    editName: string;
    setEditName: (v: string) => void;
    editAddress: string;
    setEditAddress: (v: string) => void;
    editImage: string;
    handleSaveProfile: () => void;
}

const OrgSettings: React.FC<OrgSettingsProps> = ({
    editName, setEditName, editAddress, setEditAddress, editImage, handleSaveProfile
}) => {
    return (
        <div className="space-y-10 animate-in fade-in pb-32">
            <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border-2 border-gray-100 dark:border-slate-700 shadow-md">
                        <img src={editImage || 'https://i.pravatar.cc/100'} className="w-full h-full object-cover" alt="Organization logo" />
                    </div>
                    <button className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                        <Camera size={20} />
                    </button>
                </div>
                <div className="space-y-4">
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nomi" className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-4 font-bold text-gray-900 dark:text-white outline-none" />
                    <input type="text" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} placeholder="Manzil" className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-4 font-bold text-gray-900 dark:text-white outline-none" />
                </div>
            </section>
            <button onClick={handleSaveProfile} className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-lg">SAQLASH</button>
        </div>
    );
};

export default OrgSettings;
