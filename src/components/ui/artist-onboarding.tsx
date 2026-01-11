'use client';

import { memo, ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import {
    CheckCircle2,
    Lock,
    ChevronRight,
} from 'lucide-react';

// ==================== Types ====================

export type StepStatus = 'completed' | 'pending' | 'locked' | 'action';

export interface VerificationStep {
    id: string;
    icon: ReactNode;
    badgeIcon?: ReactNode;
    title: string;
    description: string;
    status: StepStatus;
    statusText?: string;
    actionText?: string;
    onAction?: () => void;
}

export interface VerificationBadge {
    icon: ReactNode;
    title: string;
    description: string;
    actionText: string;
    onAction?: () => void;
}

// ==================== Subcomponents ====================

interface StepCardProps {
    step: VerificationStep;
    index: number;
}

const StepCard = memo(function StepCard({ step, index }: StepCardProps) {
    const getStatusStyles = () => {
        switch (step.status) {
            case 'completed':
                return {
                    border: 'border-accent/30',
                    bg: 'bg-accent/5',
                    statusColor: 'text-accent',
                };
            case 'pending':
                return {
                    border: 'border-white/10',
                    bg: 'bg-white/5',
                    statusColor: 'text-white/50',
                };
            case 'locked':
                return {
                    border: 'border-white/10',
                    bg: 'bg-white/5',
                    statusColor: 'text-white/40',
                };
            case 'action':
            default:
                return {
                    border: 'border-white/10',
                    bg: 'bg-white/5',
                    statusColor: 'text-white',
                };
        }
    };

    const styles = getStatusStyles();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={cn(
                'relative p-5 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:border-white/20',
                styles.border,
                styles.bg
            )}
        >
            <div className="flex items-center justify-between gap-4">
                {/* Left: Icon + Content */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Icon Container */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                            {step.icon}
                        </div>
                        {step.badgeIcon && (
                            <div className="w-6 h-6 rounded flex items-center justify-center bg-white/10">
                                {step.badgeIcon}
                            </div>
                        )}
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium text-base truncate">
                            {step.title}
                        </h3>
                        <p className={cn('text-sm truncate', styles.statusColor)}>
                            {step.description}
                        </p>
                    </div>
                </div>

                {/* Right: Status or Action */}
                <div className="flex-shrink-0">
                    {step.status === 'completed' && (
                        <div className="flex items-center gap-2 text-accent">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                    )}
                    {step.status === 'locked' && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/50 text-sm">
                            <Lock className="w-4 h-4" />
                            <span>{step.statusText || 'Pending'}</span>
                        </div>
                    )}
                    {step.status === 'action' && step.actionText && (
                        <button
                            onClick={step.onAction}
                            className="px-6 py-2 rounded-full bg-accent/80 hover:bg-accent text-white text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
                        >
                            {step.actionText}
                        </button>
                    )}
                    {step.status === 'pending' && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/50 text-sm">
                            <Lock className="w-4 h-4" />
                            <span>{step.statusText || 'Pending'}</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
});

// ==================== Progress Bar ====================

interface ProgressBarProps {
    completed: number;
    total: number;
}

const ProgressBar = memo(function ProgressBar({ completed, total }: ProgressBarProps) {
    const percentage = (completed / total) * 100;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">
                    {completed} Steps Completed • {total - completed} Steps Remaining
                </span>
                <span className="text-accent font-medium">{Math.round(percentage)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full"
                />
            </div>
        </div>
    );
});

// ==================== Badge Card ====================

interface BadgeCardProps {
    badge: VerificationBadge;
}

const BadgeCard = memo(function BadgeCard({ badge }: BadgeCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="p-6 rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 to-accent/5 backdrop-blur-sm"
        >
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center">
                    {badge.icon}
                </div>
                <div>
                    <h3 className="text-white font-semibold text-lg">
                        {badge.title}
                    </h3>
                    <p className="text-white/60 text-sm mt-1">
                        {badge.description}
                    </p>
                </div>
                <button
                    onClick={badge.onAction}
                    className="mt-2 px-8 py-3 rounded-full bg-accent hover:bg-accent-light text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-accent/30 flex items-center gap-2"
                >
                    {badge.actionText}
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
});

// ==================== Main Component ====================

export interface ArtistOnboardingProps {
    title?: string;
    subtitle?: string;
    steps: VerificationStep[];
    badge?: VerificationBadge;
    onBack?: () => void;
}

const ArtistOnboarding = memo(function ArtistOnboarding({
    title = 'Artist Verification',
    subtitle = 'Verify your profile to gain trust and more bookings.',
    steps,
    badge,
    onBack,
}: ArtistOnboardingProps) {
    const completedSteps = steps.filter((s) => s.status === 'completed').length;
    const totalSteps = steps.length;

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    {title}
                </h1>
                <p className="text-white/60 text-lg">
                    {subtitle}
                </p>
            </motion.div>

            {/* Progress */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
            >
                <ProgressBar completed={completedSteps} total={totalSteps} />
            </motion.div>

            {/* Verification Steps */}
            <div className="space-y-4 mb-8">
                {steps.map((step, index) => (
                    <StepCard key={step.id} step={step} index={index} />
                ))}
            </div>

            {/* Badge Card */}
            {badge && (
                <BadgeCard badge={badge} />
            )}
        </div>
    );
});

// ==================== Exports ====================

export {
    ArtistOnboarding,
    StepCard,
    ProgressBar,
    BadgeCard,
};
