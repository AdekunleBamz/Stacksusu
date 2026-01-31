/**
 * Circle Statistics Export Utilities
 * 
 * Functions for exporting circle statistics and transaction history
 * in CSV format for record keeping and analysis.
 */

export interface CircleStats {
  name: string;
  status: string;
  contribution: number;
  frequency: string;
  memberCount: number;
  maxMembers: number;
  currentRound: number;
  totalRounds: number;
  totalContributed: number;
  nextPayoutDate?: string;
  createdAt: string;
}

export interface CircleMember {
  name: string;
  address: string;
  joinedAt: string;
  contributionsMade: number;
  totalContributed: number;
  payoutsReceived: number;
  reputation: number;
}

export interface CircleTransaction {
  id: string;
  type: 'contribution' | 'payout' | 'refund';
  amount: number;
  from: string;
  to: string;
  round: number;
  timestamp: string;
  txHash?: string;
}

/**
 * Escape a value for CSV format
 */
function escapeCSV(value: string | number | undefined | null): string {
  if (value === undefined || value === null) {
    return '';
  }
  const stringValue = String(value);
  // Escape quotes by doubling them and wrap in quotes if contains comma, quote, or newline
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Convert array of objects to CSV string
 */
function objectsToCSV<T extends Record<string, unknown>>(data: T[], columns: { key: keyof T; header: string }[]): string {
  const headers = columns.map(col => escapeCSV(col.header)).join(',');
  const rows = data.map(item =>
    columns.map(col => escapeCSV(item[col.key] as string | number)).join(',')
  );
  return [headers, ...rows].join('\n');
}

/**
 * Trigger download of a string as a file
 */
function downloadString(content: string, filename: string, mimeType: string = 'text/csv'): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export circle overview statistics as CSV
 */
export function exportCircleStats(circle: CircleStats): void {
  const data = [
    { field: 'Circle Name', value: circle.name },
    { field: 'Status', value: circle.status },
    { field: 'Contribution Amount (STX)', value: circle.contribution },
    { field: 'Frequency', value: circle.frequency },
    { field: 'Current Members', value: circle.memberCount },
    { field: 'Max Members', value: circle.maxMembers },
    { field: 'Current Round', value: circle.currentRound },
    { field: 'Total Rounds', value: circle.totalRounds },
    { field: 'Total Contributed (STX)', value: circle.totalContributed },
    { field: 'Next Payout Date', value: circle.nextPayoutDate || 'N/A' },
    { field: 'Created At', value: circle.createdAt },
    { field: 'Completion', value: `${Math.round((circle.currentRound / circle.totalRounds) * 100)}%` },
  ];

  const csv = objectsToCSV(data, [
    { key: 'field', header: 'Statistic' },
    { key: 'value', header: 'Value' },
  ]);

  const filename = `${circle.name.replace(/\s+/g, '-').toLowerCase()}-stats-${new Date().toISOString().split('T')[0]}.csv`;
  downloadString(csv, filename);
}

/**
 * Export circle members list as CSV
 */
export function exportCircleMembers(circleName: string, members: CircleMember[]): void {
  const csv = objectsToCSV(members, [
    { key: 'name', header: 'Name' },
    { key: 'address', header: 'Wallet Address' },
    { key: 'joinedAt', header: 'Joined Date' },
    { key: 'contributionsMade', header: 'Contributions Made' },
    { key: 'totalContributed', header: 'Total Contributed (STX)' },
    { key: 'payoutsReceived', header: 'Payouts Received' },
    { key: 'reputation', header: 'Reputation Score' },
  ]);

  const filename = `${circleName.replace(/\s+/g, '-').toLowerCase()}-members-${new Date().toISOString().split('T')[0]}.csv`;
  downloadString(csv, filename);
}

/**
 * Export circle transaction history as CSV
 */
export function exportCircleTransactions(circleName: string, transactions: CircleTransaction[]): void {
  const csv = objectsToCSV(transactions, [
    { key: 'id', header: 'Transaction ID' },
    { key: 'type', header: 'Type' },
    { key: 'amount', header: 'Amount (STX)' },
    { key: 'from', header: 'From' },
    { key: 'to', header: 'To' },
    { key: 'round', header: 'Round' },
    { key: 'timestamp', header: 'Timestamp' },
    { key: 'txHash', header: 'Transaction Hash' },
  ]);

  const filename = `${circleName.replace(/\s+/g, '-').toLowerCase()}-transactions-${new Date().toISOString().split('T')[0]}.csv`;
  downloadString(csv, filename);
}

/**
 * Export comprehensive circle report with all data
 */
export function exportFullCircleReport(
  circle: CircleStats,
  members: CircleMember[],
  transactions: CircleTransaction[]
): void {
  const sections: string[] = [];

  // Circle Overview Section
  sections.push('=== CIRCLE OVERVIEW ===');
  sections.push(`Circle Name,${escapeCSV(circle.name)}`);
  sections.push(`Status,${escapeCSV(circle.status)}`);
  sections.push(`Contribution Amount,${circle.contribution} STX`);
  sections.push(`Frequency,${escapeCSV(circle.frequency)}`);
  sections.push(`Members,${circle.memberCount}/${circle.maxMembers}`);
  sections.push(`Progress,Round ${circle.currentRound} of ${circle.totalRounds}`);
  sections.push(`Total Contributed,${circle.totalContributed} STX`);
  sections.push(`Created,${escapeCSV(circle.createdAt)}`);
  sections.push('');

  // Members Section
  sections.push('=== MEMBERS ===');
  sections.push(objectsToCSV(members, [
    { key: 'name', header: 'Name' },
    { key: 'address', header: 'Address' },
    { key: 'contributionsMade', header: 'Contributions' },
    { key: 'totalContributed', header: 'Total (STX)' },
    { key: 'reputation', header: 'Reputation' },
  ]));
  sections.push('');

  // Transactions Section
  sections.push('=== TRANSACTIONS ===');
  sections.push(objectsToCSV(transactions, [
    { key: 'timestamp', header: 'Date' },
    { key: 'type', header: 'Type' },
    { key: 'amount', header: 'Amount (STX)' },
    { key: 'from', header: 'From' },
    { key: 'to', header: 'To' },
    { key: 'round', header: 'Round' },
  ]));

  const content = sections.join('\n');
  const filename = `${circle.name.replace(/\s+/g, '-').toLowerCase()}-full-report-${new Date().toISOString().split('T')[0]}.csv`;
  downloadString(content, filename);
}
