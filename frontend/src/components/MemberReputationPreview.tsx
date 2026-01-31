import { memo } from 'react';
import { Star, TrendingUp, TrendingDown, CheckCircle, Clock, Shield } from 'lucide-react';
import clsx from 'clsx';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import './MemberReputationPreview.css';

interface ReputationData {
  score: number;
  trend: 'up' | 'down' | 'stable';
  trendValue?: number;
  onTimePayments: number;
  totalPayments: number;
  circlesCompleted: number;
  memberSince: string;
  verificationLevel: 'none' | 'basic' | 'verified' | 'trusted';
}

interface MemberReputationPreviewProps {
  /** Member's display name */
  name: string;
  /** Member's wallet address */
  address: string;
  /** Avatar URL */
  avatarUrl?: string;
  /** Reputation data */
  reputation: ReputationData;
  /** Additional class name */
  className?: string;
}

const VERIFICATION_LABELS: Record<string, { label: string; variant: 'secondary' | 'success' | 'warning' | 'primary' }> = {
  none: { label: 'Unverified', variant: 'secondary' },
  basic: { label: 'Basic', variant: 'warning' },
  verified: { label: 'Verified', variant: 'primary' },
  trusted: { label: 'Trusted', variant: 'success' },
};

/**
 * MemberReputationPreview Component
 * 
 * Displays a compact reputation card for circle members.
 * Shows key trust indicators at a glance.
 */
const MemberReputationPreview = memo(function MemberReputationPreview({
  name,
  address,
  avatarUrl,
  reputation,
  className
}: MemberReputationPreviewProps) {
  const paymentRate = reputation.totalPayments > 0
    ? Math.round((reputation.onTimePayments / reputation.totalPayments) * 100)
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  };

  const TrendIcon = reputation.trend === 'up' ? TrendingUp : reputation.trend === 'down' ? TrendingDown : null;
  const verification = VERIFICATION_LABELS[reputation.verificationLevel] || VERIFICATION_LABELS.none;
  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className={clsx('member-reputation', className)}>
      <div className="member-reputation__header">
        <Avatar 
          src={avatarUrl} 
          alt={name} 
          size="md"
          fallback={name.charAt(0).toUpperCase()}
        />
        <div className="member-reputation__info">
          <h4 className="member-reputation__name">{name}</h4>
          <span className="member-reputation__address">{truncatedAddress}</span>
        </div>
        <Badge variant={verification.variant} size="sm">
          <Shield size={12} />
          {verification.label}
        </Badge>
      </div>

      <div className="member-reputation__score-section">
        <div className="member-reputation__score-container">
          <div className={clsx(
            'member-reputation__score-ring',
            `member-reputation__score-ring--${getScoreColor(reputation.score)}`
          )}>
            <span className="member-reputation__score-value">{reputation.score}</span>
          </div>
          <div className="member-reputation__score-label">
            <Star size={14} />
            Reputation Score
            {TrendIcon && (
              <span className={clsx(
                'member-reputation__trend',
                `member-reputation__trend--${reputation.trend}`
              )}>
                <TrendIcon size={14} />
                {reputation.trendValue && `${reputation.trend === 'up' ? '+' : '-'}${reputation.trendValue}`}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="member-reputation__stats">
        <div className="member-reputation__stat">
          <CheckCircle size={16} className="member-reputation__stat-icon member-reputation__stat-icon--success" />
          <div className="member-reputation__stat-content">
            <span className="member-reputation__stat-value">{paymentRate}%</span>
            <span className="member-reputation__stat-label">On-time Payments</span>
          </div>
        </div>
        
        <div className="member-reputation__stat">
          <Star size={16} className="member-reputation__stat-icon member-reputation__stat-icon--primary" />
          <div className="member-reputation__stat-content">
            <span className="member-reputation__stat-value">{reputation.circlesCompleted}</span>
            <span className="member-reputation__stat-label">Circles Completed</span>
          </div>
        </div>
        
        <div className="member-reputation__stat">
          <Clock size={16} className="member-reputation__stat-icon member-reputation__stat-icon--secondary" />
          <div className="member-reputation__stat-content">
            <span className="member-reputation__stat-value">{reputation.memberSince}</span>
            <span className="member-reputation__stat-label">Member Since</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export { MemberReputationPreview };
export type { ReputationData, MemberReputationPreviewProps };
export default MemberReputationPreview;
