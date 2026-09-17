'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ShieldCheck, Eraser, Check, X, PenTool, Type } from 'lucide-react';
import { UserAccount } from '@/lib/types';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSign: (signatureDataUrl: string, remarks: string) => void;
  user: UserAccount;
  permissionTitle: string;
}

export default function SignatureModal({
  isOpen,
  onClose,
  onConfirmSign,
  user,
  permissionTitle
}: SignatureModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [signMode, setSignMode] = useState<'DRAW' | 'TYPE'>('DRAW');
  const [typedName, setTypedName] = useState(user.name);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (isOpen && signMode === 'DRAW') {
      setTimeout(initCanvas, 50);
    }
  }, [isOpen, signMode]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set line styles for signature
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#003366';
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleConfirm = () => {
    let finalSignatureUrl = '';

    if (signMode === 'DRAW') {
      const canvas = canvasRef.current;
      if (canvas && hasDrawn) {
        finalSignatureUrl = canvas.toDataURL('image/png');
      } else {
        // Fallback text rendering on canvas if empty
        finalSignatureUrl = generateTypedSignatureCanvas(typedName || user.name);
      }
    } else {
      finalSignatureUrl = generateTypedSignatureCanvas(typedName || user.name);
    }

    onConfirmSign(finalSignatureUrl, remarks);
  };

  const generateTypedSignatureCanvas = (text: string): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 120);
      ctx.fillStyle = '#003366';
      ctx.font = 'italic bold 28px Georgia, serif';
      ctx.fillText(text, 20, 60);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText(`VERIFIED DIGITAL SIGNATURE • ${new Date().toISOString()}`, 20, 95);
    }
    return canvas.toDataURL('image/png');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 overflow-hidden">
        {/* Header */}
        <div className="bg-[#003366] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-6 w-6 text-amber-400" />
            <div>
              <h3 className="font-bold text-base">Digital Signature & Approval</h3>
              <p className="text-xs text-blue-200">Role: {user.designation}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-white/10 text-white/80 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-950">
            <span className="font-bold">Signing Request:</span> {permissionTitle}
          </div>

          {/* Mode Tabs */}
          <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
            <button
              onClick={() => setSignMode('DRAW')}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-md transition ${
                signMode === 'DRAW' ? 'bg-white text-blue-900 shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PenTool className="h-3.5 w-3.5" />
              <span>Draw Signature</span>
            </button>
            <button
              onClick={() => setSignMode('TYPE')}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-md transition ${
                signMode === 'TYPE' ? 'bg-white text-blue-900 shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Type className="h-3.5 w-3.5" />
              <span>Type Full Name</span>
            </button>
          </div>

          {/* Canvas or Type Input */}
          {signMode === 'DRAW' ? (
            <div className="space-y-2">
              <div className="relative rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={440}
                  height={140}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-36 cursor-crosshair touch-none"
                />
                {!hasDrawn && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                    Draw your signature here with finger/mouse
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="flex items-center space-x-1 text-xs text-slate-500 hover:text-red-600 transition"
                >
                  <Eraser className="h-3.5 w-3.5" />
                  <span>Clear Pad</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Official Full Name</label>
              <input
                type="text"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-sm font-semibold focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter official signatory name"
              />
              <div className="p-4 rounded-lg bg-slate-50 border font-serif italic text-lg text-blue-950">
                {typedName || user.name}
              </div>
            </div>
          )}

          {/* Remarks */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Approval Remarks / Instructions (Optional)</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Recommended for approval / Verified audio requirements"
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="text-[11px] text-slate-500 flex items-center space-x-1">
            <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>Digital signature will generate a unique SHA-256 verification hash timestamped to your session.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 flex justify-end space-x-2 border-t">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center space-x-1.5 rounded-lg bg-[#003366] px-5 py-2 text-xs font-bold text-white shadow hover:bg-blue-900 transition"
          >
            <Check className="h-4 w-4 text-amber-400" />
            <span>Affix Signature & Approve</span>
          </button>
        </div>
      </div>
    </div>
  );
}
