// @ts-nocheck
import React, { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export default class GlobalErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-white p-8 rounded-3xl shadow-xl max-w-2xl w-full border-2 border-red-100">
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={32} />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 mb-2">Tizimda xatolik yuz berdi</h1>
                        <p className="text-gray-500 mb-6">Xatolik tafsilotlari quyida:</p>

                        <div className="bg-gray-900 rounded-xl p-4 overflow-auto text-left max-h-60 mb-6 text-white text-xs">
                            <p className="text-red-400 font-mono mb-2 font-bold">{this.state.error && this.state.error.toString()}</p>
                            <pre className="text-gray-400 font-mono whitespace-pre-wrap">
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors"
                            >
                                Qayta yuklash
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                            >
                                Bosh sahifa
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
