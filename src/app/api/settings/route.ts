import { NextResponse } from 'next/server';
import { getSettings, updateSetting } from '@/lib/data';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const data = await getSettings();
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (body.settings && typeof body.settings === 'object') {
      const results = [];
      for (const [key, value] of Object.entries(body.settings)) {
        results.push(await updateSetting(key, String(value)));
      }
      return NextResponse.json({ success: true, settings: results });
    }

    const { key, value } = body;
    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }
    const updated = await updateSetting(key, value);
    return NextResponse.json({ success: true, setting: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
