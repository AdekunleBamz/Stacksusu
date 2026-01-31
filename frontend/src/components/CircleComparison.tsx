import { memo, useMemo } from 'react';
import { Scale, Check, X, Users, Coins, Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { Badge } from './Badge';
import './CircleComparison.css';

interface CircleData {
  id: number;
  name: string;
  contribution: number;
  frequency: string;
  maxMembers: number;
  memberCount: number;
  currentRound: number;
  totalRounds: number;
  status: 'active' | 'forming' | 'completed';
  minReputation?: number;
  totalPool?: number;
}

interface CircleComparisonProps {
  /** First circle to compare */
  circleA: CircleData;
  /** Second circle to compare */
  circleB: CircleData;
  /** Callback when user selects a circle */
  onSelect?: (circleId: number) => void;
  /** Additional class name */
  className?: string;
}

interface ComparisonRow {
  label: string;
  icon: React.ReactNode;
  valueA: string | number;
  valueB: string | number;
  highlight?: 'a' | 'b' | 'equal';
  format?: 'currency' | 'percentage' | 'default';
}

/**
 * CircleComparison Component
 * 
 * Side-by-side comparison of two savings circles to help
 * users make informed decisions about which circle to join.
 */
const CircleComparison = memo(function CircleComparison({
  circleA,
  circleB,
  onSelect,
  className
}: CircleComparisonProps) {
  const rows: ComparisonRow[] = useMemo(() => [
    {
      label: 'Contribution',
      icon: <Coins size={16} />,
      valueA: circleA.contribution,
      valueB: circleB.contribution,
      highlight: circleA.contribution < circleB.contribution ? 'a' : 
                 circleA.contribution > circleB.contribution ? 'b' : 'equal',
      format: 'currency',
    },
    {
      label: 'Frequency',
      icon: <Calendar size={16} />,
      valueA: circleA.frequency,
      valueB: circleB.frequency,
      highlight: 'equal',
    },
    {
      label: 'Members',
      icon: <Users size={16} />,
      valueA: `${circleA.memberCount}/${circleA.maxMembers}`,
      valueB: `${circleB.memberCount}/${circleB.maxMembers}`,
      highlight: circleA.memberCount < circleA.maxMembers ? 'a' : 
                 circleB.memberCount < circleB.maxMembers ? 'b' : 'equal',
    },
    {
      label: 'Progress',
      icon: <TrendingUp size={16} />,
      valueA: `${Math.round((circleA.currentRound / circleA.totalRounds) * 100)}%`,
      valueB: `${Math.round((circleB.currentRound / circleB.totalRounds) * 100)}%`,
      highlight: 'equal',
      format: 'percentage',
    },
    {
      label: 'Total Payout',
      icon: <Coins size={16} />,
      valueA: circleA.contribution * circleA.maxMembers,
      valueB: circleB.contribution * circleB.maxMembers,
      highlight: circleA.contribution * circleA.maxMembers > circleB.contribution * circleB.maxMembers ? 'a' : 
                 circleA.contribution * circleA.maxMembers < circleB.contribution * circleB.maxMembers ? 'b' : 'equal',
      format: 'currency',
    },
    {
      label: 'Min Reputation',
      icon: <Check size={16} />,
      valueA: circleA.minReputation ?? 'None',
      valueB: circleB.minReputation ?? 'None',
      highlight: 'equal',
    },
  ], [circleA, circleB]);

  const formatValue = (value: string | number, format?: string): string => {
    if (typeof value === 'string') return value;
    if (format === 'currency') return `${value} STX`;
    return String(value);
  };

  const canJoinA = circleA.memberCount < circleA.maxMembers && circleA.status !== 'completed';
  const canJoinB = circleB.memberCount < circleB.maxMembers && circleB.status !== 'completed';

  return (
    <div className={clsx('circle-comparison', className)}>
      <div className="circle-comparison__header">
        <Scale size={24} />
        <h3 className="circle-comparison__title">Compare Circles</h3>
      </div>

      <div className="circle-comparison__table">
        {/* Circle Headers */}
        <div className="circle-comparison__circle-headers">
          <div className="circle-comparison__circle-header">
            <h4 className="circle-comparison__circle-name">{circleA.name}</h4>
            <Badge 
              variant={circleA.status === 'active' ? 'success' : circleA.status === 'forming' ? 'warning' : 'secondary'}
              size="sm"
            >
              {circleA.status}
            </Badge>
          </div>
          <div className="circle-comparison__vs">VS</div>
          <div className="circle-comparison__circle-header">
            <h4 className="circle-comparison__circle-name">{circleB.name}</h4>
            <Badge 
              variant={circleB.status === 'active' ? 'success' : circleB.status === 'forming' ? 'warning' : 'secondary'}
              size="sm"
            >
              {circleB.status}
            </Badge>
          </div>
        </div>

        {/* Comparison Rows */}
        {rows.map((row) => (
          <div key={row.label} className="circle-comparison__row">
            <div 
              className={clsx(
                'circle-comparison__cell circle-comparison__cell--value',
                row.highlight === 'a' && 'circle-comparison__cell--highlight'
              )}
            >
              {formatValue(row.valueA, row.format)}
              {row.highlight === 'a' && <Check size={14} className="circle-comparison__check" />}
            </div>
            <div className="circle-comparison__cell circle-comparison__cell--label">
              {row.icon}
              <span>{row.label}</span>
            </div>
            <div 
              className={clsx(
                'circle-comparison__cell circle-comparison__cell--value',
                row.highlight === 'b' && 'circle-comparison__cell--highlight'
              )}
            >
              {formatValue(row.valueB, row.format)}
              {row.highlight === 'b' && <Check size={14} className="circle-comparison__check" />}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      {onSelect && (
        <div className="circle-comparison__actions">
          <button
            className={clsx(
              'circle-comparison__action',
              !canJoinA && 'circle-comparison__action--disabled'
            )}
            onClick={() => canJoinA && onSelect(circleA.id)}
            disabled={!canJoinA}
          >
            {canJoinA ? (
              <>Join {circleA.name} <ArrowRight size={16} /></>
            ) : (
              <><X size={16} /> Circle Full</>
            )}
          </button>
          <button
            className={clsx(
              'circle-comparison__action',
              !canJoinB && 'circle-comparison__action--disabled'
            )}
            onClick={() => canJoinB && onSelect(circleB.id)}
            disabled={!canJoinB}
          >
            {canJoinB ? (
              <>Join {circleB.name} <ArrowRight size={16} /></>
            ) : (
              <><X size={16} /> Circle Full</>
            )}
          </button>
        </div>
      )}
    </div>
  );
});

export { CircleComparison };
export default CircleComparison;
