import { Holiday } from '../_types/Holiday';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/holidays';

export async function getHolidays(startDate?: string, endDate?: string): Promise<Holiday[]> {
  let url = API_URL;
  const params = new URLSearchParams();

  if (startDate) params.append('start', startDate);
  if (endDate) params.append('end', endDate);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const resp = await fetch(url, { cache: 'no-store' });
  if (!resp.ok) throw new Error('Failed to fetch holidays');
  return resp.json();
}

export async function createHoliday(data: Omit<Holiday, 'id'>): Promise<Holiday> {
  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!resp.ok) throw new Error('Failed to create holiday');
  return resp.json();
}

export async function updateHoliday(id: number, data: Omit<Holiday, 'id'>): Promise<Holiday> {
  const resp = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!resp.ok) throw new Error('Failed to update holiday');
  return resp.json();
}

export async function deleteHoliday(id: number): Promise<void> {
  const resp = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!resp.ok) {
    let errorText = '';
    try {
      errorText = await resp.text();
    } catch {
      // ignore parsing errors
    }
    throw new Error(`Failed to delete holiday: ${resp.status} ${errorText || resp.statusText}`);
  }
  // 204 No Content - don't try to parse response body
}
