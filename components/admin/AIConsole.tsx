import React from 'react';
import { MessageSquare } from 'lucide-react';

const AIConsole: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center p-10 bg-white rounded-[3rem] shadow-xl border border-gray-200">
                <MessageSquare size={48} className="mx-auto text-indigo-500 mb-4 animate-bounce" />
                <h3 className="text-2xl font-black text-gray-900">AI God Mode</h3>
                <p className="text-gray-400 mt-2">Tez kunda ishga tushadi...</p>
            </div>
        </div>
    );
};

export default AIConsole;
