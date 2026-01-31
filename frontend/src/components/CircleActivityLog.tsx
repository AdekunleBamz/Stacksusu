import { memo, useMemo } from 'react';
import { 
  Coins, 
  Gift, 
  UserPlus, 
  UserMinus, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import clsx from 'clsx';
import { Avatar } from './Avatar';
import './CircleActivityLog.css';

export type CircleActivityType = 
  | 'contribution'
  | 'payout'
  | 'member_joined'
  | 'member_left'
  | 'emergency_request'
  | 'round_completed'
  | 'circle_started'
  | 'circle_completed';

export interface CircleActivity {
  id: string;
  type: CircleActivityType;
  timestamp: string;
  actor?: string;
  amount?: number;
  round?: number;
  details?: string;
}

interface CircleActivityLogProps {
  /** Array of activity items */
  activities: CircleActivity[];
  /** Maximum items to show */
  limit?: number;
  /** Show timestamps */
  showTimestamps?: boolean;
  /** Additional class name */
  className?: string;
}

const ACTIVITY_CONFIG: Record<CircleActivityType, { icon: typeof Coins; label: string; color: string }> = {
  contribution: { icon: Coins, label: 'Contribution', color: 'blue' },
  payout: { icon: Gift, label: 'Payout', color: 'green' },
  member_joined: { icon: UserPlus, label: 'Member Joined', color: 'purple' },
  member_left: { icon: UserMinus, label: 'Member Left', color: 'orange' },
  emergency_request: { icon: AlertTriangle, label: 'Emergency Request', color: 'red' },
  round_completed: { icon: CheckCircle, label: 'Round Completed', color: 'teal' },
  circle_started: { icon: ArrowRight, label: 'Circle Started', color: 'indigo' },
  circle_completed: { icon: CheckCircle, label: 'Circle Completed', color: 'green' },
};

function formatActivityMessage(activity: CircleActivity): string {
  switch (activity.type) {
    case 'contribution':
      return `contributed ${activity.amount} STX`;
    case 'payout':
      return `received payout of ${activity.amount} STX`;
    case 'member_joined':
      return 'joined the circle';
    case 'member_left':
      return 'left the circle';
    case 'emergency_request':
      return 'requested emergency payout';
    case 'round_completed':
      return `Round ${activity.round} completed`;
    case 'circle_started':
      return 'Circle started';
    case 'circle_completed':
      return 'Circle completed successfully!';
    default:
      return activity.details || 'Activity recorded';
  }
}

/**
 * CircleActivityLog Component
 * 
 * Displays a timeline of activities within a savings circle.
 */
const CircleActivityLog = memo(function CircleActivityLog({
  activities,
  limit,
  showTimestamps = true,
  className
}: CircleActivityLogProps) {
  const displayActivities = useMemo(() => 
    limit ? activities.slice(0, limit) : activities,
    [activities, limit]
  );

  if (activities.length === 0) {
    return (
      <div className={clsx('circle-activity-log circle-activity-log--empty', className)}>
        <Clock size={32} />
        <p>No activity yet</p>
      </div>
    );
  }

  return (
    <div className={clsx('circle-activity-log', className)}>
      <ul className="circle-activity-log__list">
        {displayActivities.map((activity, index) => {
          const config = ACTIVITY_CONFIG[activity.type];
          const Icon = config.icon;
          const isLast = index === displayActivities.length - 1;

          return (
            <li 
              key={activity.id} 
              className={clsx(
                'circle-activity-log__item',
                `circle-activity-log__item--${config.color}`
              )}
            >
              <div className="circle-activity-log__timeline">
                <div className="circle-activity-log__icon">
                  <Icon size={16} />
                </div>
                {!isLast && <div className="circle-activity-log__line" />}
              </div>
              
              <div className="circle-activity-log__content">
                <div className="circle-activity-log__header">
                  {activity.actor && (
                    <Avatar address={activity.actor} size="xs" />
                  )}
                  <span className="circle-activity-log__message">
                    {activity.actor && (
                      <span className="circle-activity-log__actor">
                        {activity.actor.slice(0, 6)}...{activity.actor.slice(-4)}
                      </span>
                    )}
                    {' '}
                    {formatActivityMessage(activity)}
                  </span>
                </div>
                {showTimestamps && (
                  <time className="circle-activity-log__time">
                    {activity.timestamp}
                  </time>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      
      {limit && activities.length > limit && (
        <div className="circle-activity-log__more">
          +{activities.length - limit} more activities
        </div>
      )}
    </div>
  );
});

export { CircleActivityLog };
export default CircleActivityLog;
