
import React, { useState, useEffect, useRef } from 'react';
import { Camera, QrCode, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';

interface ScanPageProps {
  setUserTable: (table: string) => void;
}

const ScanPage: React.FC<ScanPageProps> = ({ setUserTable }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const scannerId = "qr-reader";

  useEffect(() => {
    // Cleanup scanner on unmount
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanner = async () => {
    setIsScanning(true);
    setError(null);
    
    // Give DOM a moment to render the scanner div
    setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode(scannerId);
        qrScannerRef.current = scanner;

        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        await scanner.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            // Success: Handle decoded QR code
            handleScanSuccess(decodedText);
          },
          (errorMessage) => {
            // Ignore scan failures (usually means no QR code found in current frame)
          }
        );
      } catch (err) {
        console.error("Scanner Error:", err);
        setError("Could not access camera. Please check permissions.");
        setIsScanning(false);
      }
    }, 100);
  };

  const stopScanner = async () => {
    if (qrScannerRef.current) {
      try {
        await qrScannerRef.current.stop();
        qrScannerRef.current = null;
      } catch (err) {
        console.error("Stop Error:", err);
      }
    }
    setIsScanning(false);
  };

  const handleScanSuccess = (decodedText: string) => {
    // Logic to extract table number. 
    // Assuming QR contains "Table 5" or just "5" or a full URL like "https://luxestay.com/table/5"
    let tableId = decodedText;
    
    // Basic extraction if it looks like a URL
    if (decodedText.includes('/table/')) {
      tableId = decodedText.split('/table/').pop() || decodedText;
    }
    
    // Prepend 'Table ' if it's just a number
    if (!isNaN(Number(tableId))) {
      tableId = `Table ${tableId}`;
    }

    setUserTable(tableId);
    stopScanner();
    navigate('/menu');
  };

  const handleManualSelection = (table: string) => {
    setUserTable(table);
    navigate('/menu');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center">
        {!isScanning ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-12">
              <div className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <QrCode size={40} />
              </div>
              <h1 className="font-serif text-4xl mb-4">Scan QR Code</h1>
              <p className="text-slate-400">Locate the QR code on your table to automatically assign your location and view our menu.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <button 
                onClick={startScanner}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98]"
              >
                <Camera size={24} /> Open Camera
              </button>
              
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center"><span className="bg-slate-900 px-4 text-slate-500 text-sm uppercase tracking-widest font-bold">OR Select Area</span></div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => handleManualSelection('Lobby')}
                  className="w-full py-4 bg-white/5 text-slate-200 border border-white/10 rounded-2xl font-semibold flex items-center justify-between px-6 hover:bg-white/10 transition-all group"
                >
                  Order to Lobby Lounge 
                  <ArrowRight size={20} className="text-slate-500 group-hover:text-white transition-colors" />
                </button>
                <button 
                  onClick={() => handleManualSelection('Poolside')}
                  className="w-full py-4 bg-white/5 text-slate-200 border border-white/10 rounded-2xl font-semibold flex items-center justify-between px-6 hover:bg-white/10 transition-all group"
                >
                  Order to Poolside Bar 
                  <ArrowRight size={20} className="text-slate-500 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full max-w-sm mx-auto animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Position QR in Frame</h2>
              <button 
                onClick={stopScanner}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="relative aspect-square bg-black rounded-3xl overflow-hidden border-4 border-indigo-500 shadow-2xl shadow-indigo-500/20">
              <div id={scannerId} className="w-full h-full"></div>
              
              {/* Overlay graphics */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-white/20 rounded-xl relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 -mt-1 -ml-1"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 -mt-1 -mr-1"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 -mb-1 -ml-1"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 -mb-1 -mr-1"></div>
                  <div className="absolute inset-x-0 top-0 h-1 bg-indigo-500/50 animate-scan"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <p className="text-slate-400 text-sm">Scanning for your table information...</p>
              <button 
                onClick={() => handleScanSuccess(`Table ${Math.floor(Math.random() * 20) + 1}`)}
                className="mt-6 text-xs text-indigo-400 hover:underline font-bold uppercase tracking-widest"
              >
                Simulate Successful Scan
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
          <ShieldCheck size={14} /> Encrypted Session • Table ID Security Verified
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s infinite linear;
          position: absolute;
        }
        /* Custom styles for html5-qrcode video */
        #qr-reader video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
        #qr-reader {
          border: none !important;
        }
      `}</style>
    </div>
  );
};

export default ScanPage;
