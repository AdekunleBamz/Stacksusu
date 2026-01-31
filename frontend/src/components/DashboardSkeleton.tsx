import { memo } from 'react';
import { Card } from './Card';
import { Skeleton } from './Skeleton';
import './DashboardSkeleton.css';

/**
 * DashboardSkeleton Component
 * 
 * Loading placeholder for the Dashboard page.
 * Shows skeleton representations of stats, circles, and activity.
 */
const DashboardSkeleton = memo(function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton">
      {/* Header Skeleton */}
      <div className="dashboard-skeleton__header">
        <div className="dashboard-skeleton__header-text">
          <Skeleton width="180px" height="32px" />
          <Skeleton width="300px" height="18px" />
        </div>
        <Skeleton width="140px" height="40px" borderRadius="8px" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="dashboard-skeleton__stats">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="dashboard-skeleton__stat-card">
            <div className="dashboard-skeleton__stat-content">
              <Skeleton width="40px" height="40px" borderRadius="12px" />
              <div className="dashboard-skeleton__stat-text">
                <Skeleton width="80px" height="24px" />
                <Skeleton width="60px" height="14px" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-skeleton__content">
        {/* My Circles Section */}
        <Card className="dashboard-skeleton__section">
          <div className="dashboard-skeleton__section-header">
            <Skeleton width="120px" height="22px" />
            <Skeleton width="80px" height="32px" borderRadius="6px" />
          </div>
          <div className="dashboard-skeleton__circles">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="dashboard-skeleton__circle-item">
                <div className="dashboard-skeleton__circle-info">
                  <Skeleton width="140px" height="18px" />
                  <Skeleton width="200px" height="14px" />
                </div>
                <div className="dashboard-skeleton__circle-progress">
                  <Skeleton width="100%" height="6px" borderRadius="3px" />
                  <Skeleton width="60px" height="12px" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity Section */}
        <Card className="dashboard-skeleton__section">
          <div className="dashboard-skeleton__section-header">
            <Skeleton width="140px" height="22px" />
          </div>
          <div className="dashboard-skeleton__activity">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="dashboard-skeleton__activity-item">
                <Skeleton width="36px" height="36px" borderRadius="50%" />
                <div className="dashboard-skeleton__activity-content">
                  <Skeleton width="180px" height="16px" />
                  <Skeleton width="100px" height="12px" />
                </div>
                <Skeleton width="60px" height="14px" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
});

export { DashboardSkeleton };
export default DashboardSkeleton;
