import { NextResponse, NextRequest } from 'next/server';

const MOCK_NOTIFICATIONS = [
  {"ID": "1", "Type": "Result", "Message": "mid-sem", "Timestamp": "2026-04-22 17:51:30"},
  {"ID": "2", "Type": "Placement", "Message": "CSX Corporation hiring", "Timestamp": "2026-04-22 17:51:18"},
  {"ID": "3", "Type": "Event", "Message": "farewell", "Timestamp": "2026-04-22 17:51:06"},
  {"ID": "4", "Type": "Result", "Message": "mid-sem", "Timestamp": "2026-04-22 17:50:54"},
  {"ID": "5", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:50:42"},
  {"ID": "6", "Type": "Result", "Message": "external", "Timestamp": "2026-04-22 17:50:30"},
  {"ID": "7", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:50:18"},
  {"ID": "8", "Type": "Event", "Message": "tech-fest", "Timestamp": "2026-04-22 17:50:06"},
  {"ID": "9", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:49:54"},
  {"ID": "10", "Type": "Placement", "Message": "AMD hiring", "Timestamp": "2026-04-22 17:49:42"},
  {"ID": "11", "Type": "Placement", "Message": "Google hiring", "Timestamp": "2026-04-22 17:52:18"},
  {"ID": "12", "Type": "Placement", "Message": "Amazon hiring", "Timestamp": "2026-04-22 17:53:10"},
  {"ID": "13", "Type": "Result", "Message": "Final result", "Timestamp": "2026-04-22 17:54:00"},
  {"ID": "14", "Type": "Event", "Message": "Workshop", "Timestamp": "2026-04-22 17:48:00"}
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const typeFilter = searchParams.get('notification_type');

  let results = [...MOCK_NOTIFICATIONS];

  // Apply filter if provided
  if (typeFilter) {
    results = results.filter(n => n.Type === typeFilter);
  }

  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = results.slice(startIndex, endIndex);

  return NextResponse.json({
    notifications: paginatedResults,
    total: results.length,
    page,
    limit,
    totalPages: Math.ceil(results.length / limit)
  });
}
