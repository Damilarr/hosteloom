import type { ReportType } from '@/types';

export const generateAndDownloadCSV = (
  reportData: any[],
  activeType: ReportType
) => {
  if (!reportData || reportData.length === 0) return;

  let headers: string[] = [];
  let rows: string[][] = [];

  switch (activeType) {
    case 'allocations':
      headers = ['Student Name', 'Student Email', 'Room Number', 'Matric No', 'Date', 'Status'];
      rows = reportData.map((a: any) => [
        `${a.student?.profile?.firstName || ''} ${a.student?.profile?.lastName || ''}`,
        a.student?.email || '',
        a.room?.roomNumber || '',
        a.student?.profile?.matricNo || '',
        new Date(a.createdAt).toLocaleDateString(),
        a.status || ''
      ]);
      break;
    case 'payments':
      headers = ['Student Name', 'Student Email', 'Room Number', 'Description', 'Amount', 'Date', 'Status'];
      rows = reportData.map((inv: any) => [
        `${inv.student?.profile?.firstName || ''} ${inv.student?.profile?.lastName || ''}`,
        inv.student?.email || '',
        inv.allocation?.room?.roomNumber || '',
        inv.description || '',
        inv.amount ? String(inv.amount) : '0',
        new Date(inv.createdAt).toLocaleDateString(),
        inv.status || ''
      ]);
      break;
    case 'maintenance':
      headers = ['Issue Title', 'Description', 'Category', 'Student Name', 'Student Email', 'Date', 'Status'];
      rows = reportData.map((c: any) => [
        c.title || '',
        c.description || '',
        c.category || '',
        `${c.student?.profile?.firstName || ''} ${c.student?.profile?.lastName || ''}`,
        c.student?.email || '',
        new Date(c.createdAt).toLocaleDateString(),
        c.status || ''
      ]);
      break;
    case 'occupancy':
    default:
      headers = ['Room Number', 'Hostel', 'Block', 'Floor', 'Capacity', 'Allocations', 'Price'];
      rows = reportData.map((r: any) => [
        r.roomNumber || '',
        r.floor?.block?.hostel?.name || '',
        r.floor?.block?.name || '',
        r.floor?.name || '',
        String(r.capacity || 0),
        String(r.allocations?.length || 0),
        r.price ? String(r.price) : '0'
      ]);
      break;
  }

  const escapeCSV = (value: string) => {
    if (typeof value !== 'string') return value;
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${activeType}_report_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
