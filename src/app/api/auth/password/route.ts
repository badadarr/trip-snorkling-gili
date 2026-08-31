import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getDb } from '@/db';
import { admins } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const session = await getAdminSession(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword, email, name } = await req.json();

    if (!currentPassword) {
      return NextResponse.json({ error: 'Password saat ini harus diisi' }, { status: 400 });
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json({ error: 'Database tidak terhubung' }, { status: 500 });
    }

    // Find current admin in database
    const userRecords = await db
      .select()
      .from(admins)
      .where(eq(admins.email, session.email.toLowerCase()))
      .limit(1);

    if (userRecords.length === 0) {
      return NextResponse.json({ error: 'Akun admin tidak ditemukan di database' }, { status: 404 });
    }

    const currentAdmin = userRecords[0];

    // Verify current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, currentAdmin.passwordHash);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Password saat ini tidak sesuai' }, { status: 400 });
    }

    // Build update object
    const updateData: any = {};

    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'Password baru minimal 6 karakter' }, { status: 400 });
      }
      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    if (email && email.trim().toLowerCase() !== currentAdmin.email) {
      const cleanEmail = email.trim().toLowerCase();
      // Check if email is taken by another admin
      const existing = await db.select().from(admins).where(eq(admins.email, cleanEmail)).limit(1);
      if (existing.length > 0 && existing[0].id !== currentAdmin.id) {
        return NextResponse.json({ error: 'Email tersebut sudah digunakan oleh akun lain' }, { status: 400 });
      }
      updateData.email = cleanEmail;
    }

    if (name && name.trim()) {
      updateData.name = name.trim();
    }

    if (Object.keys(updateData).length > 0) {
      await db.update(admins).set(updateData).where(eq(admins.id, currentAdmin.id));
    }

    return NextResponse.json({
      success: true,
      message: 'Kredensial akun admin berhasil diperbarui!',
      user: {
        email: updateData.email || currentAdmin.email,
        name: updateData.name || currentAdmin.name,
      },
    });
  } catch (error: any) {
    console.error('Error updating admin password/profile:', error);
    return NextResponse.json({ error: error.message || 'Gagal memperbarui kredensial' }, { status: 500 });
  }
}
