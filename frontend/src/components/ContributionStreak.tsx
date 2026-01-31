import { memo, useMemo } from 'react';
import { Flame, TrendingUp, Award } from 'lucide-react';
import clsx from 'clsx';
import './ContributionStreak.css';

interface ContributionStreakProps {
  /** Current streak count */
  currentStreak: number;
  /** Longest streak ever achieved */
  longestStreak: number;
  /** Date of last contribution */
  lastContribution?: string;
  /** Whether the streak is at risk (deadline approaching) */
  atRisk?: boolean;
  /** Compact display mode */
  compact?: boolean;
  /** Additional class name */
  className?: string;
}

interface MilestoneConfig {
  threshold: number;
  emoji: string;
  label: string;
  color: string;
}

const MILESTONES: MilestoneConfig[] = [
  { threshold: 3, emoji: '🔥', label: 'On Fire', color: 'orange' },
  { threshold: 7, emoji: '💪', label: 'Dedicated', color: 'blue' },
  { threshold: 14, emoji: '⭐', label: 'Superstar', color: 'purple' },
  { threshold: 30, emoji: '🏆', label: 'Champion', color: 'gold' },
  { threshold: 50, emoji: '💎', label: 'Diamond', color: 'cyan' },
  { threshold: 100, emoji: '👑', label: 'Legend', color: 'rainbow' },
];

/**
 * Get the current milestone based on streak count
 */
function getCurrentMilestone(streak: number): MilestoneConfig | null {
  for (let i = MILESTONES.length - 1; i >= 0; i--) {
    if (streak >= MILESTONES[i].threshold) {
      return MILESTONES[i];
    }
  }
  return null;
}

/**
 * Get the next milestone to achieve
 */
function getNextMilestone(streak: number): MilestoneConfig | null {
  for (const milestone of MILESTONES) {
    if (streak < milestone.threshold) {
      return milestone;
    }
  }
  return null;
}

/**
 * ContributionStreak Component
 * 
 * Displays the user's contribution streak with milestones
 * and visual feedback to encourage consistent participation.
 */
const ContributionStreak = memo(function ContributionStreak({
  currentStreak,
  longestStreak,
  lastContribution,
  atRisk = false,
  compact = false,
  className
}: ContributionStreakProps) {
  const currentMilestone = useMemo(() => getCurrentMilestone(currentStreak), [currentStreak]);
  const nextMilestone = useMemo(() => getNextMilestone(currentStreak), [currentStreak]);
  const progressToNext = useMemo(() => {
    if (!nextMilestone) return 100;
    const prevThreshold = currentMilestone?.threshold || 0;
    const range = nextMilestone.threshold - prevThreshold;
    const progress = currentStreak - prevThreshold;
    return Math.round((progress / range) * 100);
  }, [currentStreak, currentMilestone, nextMilestone]);

  if (compact) {
    return (
      <div className={clsx('contribution-streak contribution-streak--compact', className)}>
        <Flame 
          size={16} 
          className={clsx(
            'contribution-streak__flame',
            currentStreak > 0 && 'contribution-streak__flame--active',
            atRisk && 'contribution-streak__flame--at-risk'
          )} 
        />
        <span className="contribution-streak__count">{currentStreak}</span>
        {currentMilestone && (
          <span className="contribution-streak__emoji">{currentMilestone.emoji}</span>
        )}
      </div>
    );
  }

  return (
    <div className={clsx('contribution-streak', className)}>
      <div className="contribution-streak__header">
        <div className="contribution-streak__main">
          <Flame 
            size={24} 
            className={clsx(
              'contribution-streak__flame',
              currentStreak > 0 && 'contribution-streak__flame--active',
              atRisk && 'contribution-streak__flame--at-risk'
            )} 
          />
          <div className="contribution-streak__info">
            <span className="contribution-streak__count">{currentStreak}</span>
            <span className="contribution-streak__label">
              {currentStreak === 1 ? 'contribution streak' : 'contribution streak'}
            </span>
          </div>
        </div>
        
        {currentMilestone && (
          <div className={clsx(
            'contribution-streak__badge',
            `contribution-streak__badge--${currentMilestone.color}`
          )}>
            <span>{currentMilestone.emoji}</span>
            <span>{currentMilestone.label}</span>
          </div>
        )}
      </div>

      {atRisk && (
        <div className="contribution-streak__warning">
          ⚠️ Contribute today to keep your streak!
        </div>
      )}

      {nextMilestone && (
        <div className="contribution-streak__progress">
          <div className="contribution-streak__progress-header">
            <span>Next: {nextMilestone.emoji} {nextMilestone.label}</span>
            <span>{nextMilestone.threshold - currentStreak} to go</span>
          </div>
          <div className="contribution-streak__progress-bar">
            <div 
              className="contribution-streak__progress-fill"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>
      )}

      <div className="contribution-streak__stats">
        <div className="contribution-streak__stat">
          <TrendingUp size={14} />
          <span>Longest: {longestStreak}</span>
        </div>
        {lastContribution && (
          <div className="contribution-streak__stat">
            <Award size={14} />
            <span>Last: {lastContribution}</span>
          </div>
        )}
      </div>
    </div>
  );
});

export { ContributionStreak };
export default ContributionStreak;
