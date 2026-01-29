'use client';

import { memo, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import {
    ConfirmationResult,
    RecaptchaVerifier,
    linkWithPhoneNumber,
    signInWithPhoneNumber,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
    X,
    Upload,
    FileCheck,
    Loader2,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';

// ==================== File Upload Modal ====================

export interface FileUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => void;
    title: string;
    description?: string;
    acceptedTypes?: string;
    maxSizeMB?: number;
}

const FileUploadModal = memo(function FileUploadModal({
    isOpen,
    onClose,
    onUpload,
    title,
    description,
    acceptedTypes = 'image/*,video/*,.pdf',
    maxSizeMB = 10,
}: FileUploadModalProps) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const validateFile = (file: File): boolean => {
        const maxSize = maxSizeMB * 1024 * 1024;
        if (file.size > maxSize) {
            setError(`File size must be less than ${maxSizeMB}MB`);
            return false;
        }
        setError(null);
        return true;
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (validateFile(file)) {
                setSelectedFile(file);
            }
        }
    }, [maxSizeMB]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (validateFile(file)) {
                setSelectedFile(file);
            }
        }
    };

    const handleUploadClick = async () => {
        if (!selectedFile) return;

        setUploading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        onUpload(selectedFile);
        setUploading(false);
        setSelectedFile(null);
        onClose();
    };

    const handleClose = () => {
        setSelectedFile(null);
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#0f1419] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">{title}</h2>
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5 text-white/60" />
                        </button>
                    </div>

                    {description && (
                        <p className="text-white/60 text-sm mb-6">{description}</p>
                    )}

                    {/* Drop Zone */}
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                        className={cn(
                            'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300',
                            dragActive
                                ? 'border-accent bg-accent/10'
                                : 'border-white/20 hover:border-white/40 hover:bg-white/5',
                            selectedFile && 'border-accent bg-accent/5'
                        )}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept={acceptedTypes}
                            onChange={handleChange}
                            className="hidden"
                        />

                        {selectedFile ? (
                            <div className="flex flex-col items-center gap-3">
                                <FileCheck className="w-12 h-12 text-accent" />
                                <div>
                                    <p className="text-white font-medium">{selectedFile.name}</p>
                                    <p className="text-white/50 text-sm">
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <Upload className="w-12 h-12 text-white/40" />
                                <div>
                                    <p className="text-white font-medium">
                                        Drop your file here or click to browse
                                    </p>
                                    <p className="text-white/50 text-sm mt-1">
                                        Max file size: {maxSizeMB}MB
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mt-4 flex items-center gap-2 text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUploadClick}
                            disabled={!selectedFile || uploading}
                            className={cn(
                                'flex-1 px-4 py-3 rounded-full font-medium transition-all flex items-center justify-center gap-2',
                                selectedFile && !uploading
                                    ? 'bg-accent hover:bg-accent-light text-white'
                                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                            )}
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                'Upload'
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
});

// ==================== OTP Verification Modal ====================

export interface OTPVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (otp: string, phoneNumber: string) => void;
}

type OTPStep = 'phone' | 'otp';

const OTPVerificationModal = memo(function OTPVerificationModal({
    isOpen,
    onClose,
    onVerify,
}: OTPVerificationModalProps) {
    const [step, setStep] = useState<OTPStep>('phone');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
    const confirmationRef = useRef<ConfirmationResult | null>(null);

    const getRecaptchaVerifier = () => {
        if (recaptchaRef.current) return recaptchaRef.current;
        recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
        });
        return recaptchaRef.current;
    };

    // Format phone display (mask middle digits)
    const getMaskedPhone = () => {
        if (phoneNumber.length >= 10) {
            const last4 = phoneNumber.slice(-4);
            const first2 = phoneNumber.slice(0, 2);
            return `+91 ${first2}XXXXXX${last4}`;
        }
        return phoneNumber;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        setPhoneNumber(value);
        setError(null);
    };

    const handleSendOTP = async () => {
        if (phoneNumber.length !== 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        setSending(true);
        setError(null);
        try {
            const appVerifier = getRecaptchaVerifier();
            const fullNumber = `+91${phoneNumber}`;
            if (auth.currentUser) {
                confirmationRef.current = await linkWithPhoneNumber(
                    auth.currentUser,
                    fullNumber,
                    appVerifier
                );
            } else {
                confirmationRef.current = await signInWithPhoneNumber(
                    auth,
                    fullNumber,
                    appVerifier
                );
            }
            setStep('otp');
            setResendTimer(30);

            const interval = setInterval(() => {
                setResendTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'Failed to send OTP. Please try again.';
            setError(message);
        } finally {
            setSending(false);
        }
    };

    const handleOTPChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(-1);
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError(null);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split('').forEach((char, i) => {
            if (i < 6) newOtp[i] = char;
        });
        setOtp(newOtp);
    };

    const handleVerify = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setVerifying(true);
        setError(null);
        try {
            if (!confirmationRef.current) {
                setError('Please request a new OTP.');
                return;
            }
            await confirmationRef.current.confirm(otpString);
            onVerify(otpString, `+91${phoneNumber}`);
            handleClose();
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'Invalid OTP. Please try again.';
            setError(message);
        } finally {
            setVerifying(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError(null);
        try {
            const appVerifier = getRecaptchaVerifier();
            const fullNumber = `+91${phoneNumber}`;
            if (auth.currentUser) {
                confirmationRef.current = await linkWithPhoneNumber(
                    auth.currentUser,
                    fullNumber,
                    appVerifier
                );
            } else {
                confirmationRef.current = await signInWithPhoneNumber(
                    auth,
                    fullNumber,
                    appVerifier
                );
            }
            setResendTimer(30);

            const interval = setInterval(() => {
                setResendTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'Failed to resend OTP. Please try again.';
            setError(message);
        } finally {
            setResending(false);
        }
    };

    const handleBack = () => {
        setStep('phone');
        setOtp(['', '', '', '', '', '']);
        setError(null);
    };

    const handleClose = () => {
        setStep('phone');
        setPhoneNumber('');
        setOtp(['', '', '', '', '', '']);
        setError(null);
        confirmationRef.current = null;
        recaptchaRef.current?.clear();
        recaptchaRef.current = null;
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#0f1419] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div id="recaptcha-container" />
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            {step === 'otp' && (
                                <button
                                    onClick={handleBack}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            )}
                            <h2 className="text-xl font-semibold text-white">
                                {step === 'phone' ? 'Enter Mobile Number' : 'Verify OTP'}
                            </h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5 text-white/60" />
                        </button>
                    </div>

                    {step === 'phone' ? (
                        <>
                            <p className="text-white/60 text-sm mb-6">
                                Enter your mobile number to receive a verification code
                            </p>

                            {/* Phone Input */}
                            <div className="mb-6">
                                <div className="flex items-center gap-3 p-4 rounded-xl border border-white/20 bg-white/5 focus-within:border-accent transition-colors">
                                    <span className="text-white/60 font-medium">+91</span>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        value={phoneNumber}
                                        onChange={handlePhoneChange}
                                        placeholder="Enter 10-digit number"
                                        className="flex-1 bg-transparent text-white text-lg outline-none placeholder:text-white/30"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 flex items-center gap-2 text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleSendOTP}
                                disabled={phoneNumber.length !== 10 || sending}
                                className={cn(
                                    'w-full px-4 py-3 rounded-full font-medium transition-all flex items-center justify-center gap-2',
                                    phoneNumber.length === 10 && !sending
                                        ? 'bg-accent hover:bg-accent-light text-white'
                                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                                )}
                            >
                                {sending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sending OTP...
                                    </>
                                ) : (
                                    'Send OTP'
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-white/60 text-sm mb-6">
                                We've sent a 6-digit code to <span className="text-white">{getMaskedPhone()}</span>
                            </p>

                            {/* OTP Input */}
                            <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOTPChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className={cn(
                                            'w-12 h-14 text-center text-xl font-semibold rounded-lg border bg-white/5 text-white outline-none transition-all',
                                            digit ? 'border-accent' : 'border-white/20 focus:border-accent'
                                        )}
                                    />
                                ))}
                            </div>

                            {error && (
                                <div className="mb-4 flex items-center justify-center gap-2 text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <div className="text-center mb-6">
                                {resendTimer > 0 ? (
                                    <p className="text-white/50 text-sm">
                                        Resend code in <span className="text-accent">{resendTimer}s</span>
                                    </p>
                                ) : (
                                    <button
                                        onClick={handleResend}
                                        disabled={resending}
                                        className="text-accent hover:text-accent-light text-sm font-medium transition-colors"
                                    >
                                        {resending ? 'Sending...' : "Didn't receive code? Resend"}
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={handleVerify}
                                disabled={otp.join('').length !== 6 || verifying}
                                className={cn(
                                    'w-full px-4 py-3 rounded-full font-medium transition-all flex items-center justify-center gap-2',
                                    otp.join('').length === 6 && !verifying
                                        ? 'bg-accent hover:bg-accent-light text-white'
                                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                                )}
                            >
                                {verifying ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        Verify OTP
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
});

// ==================== Exports ====================

export {
    FileUploadModal,
    OTPVerificationModal,
};
