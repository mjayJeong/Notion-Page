import { NextResponse } from 'next/server';
import db from '../../../src/db';


export async function GET() {
  try {
    await db.content.deleteMany();
    await db.note.deleteMany();

    const note1 = await db.note.create({
      data: {
        title: 'First Note',
        contents: {
          create: [{ type: 'p', value: 'This is the first note content.' }],
        },
      },
    });

    const note2 = await db.note.create({
      data: {
        title: 'Second Note',
        contents: {
          create: [{ type: 'p', value: 'This is the second note content.' }],
        },
      },
    });

    return NextResponse.json({ message: 'Seeding completed!', notes: [note1, note2] });
  } catch (error) {
    console.error('Seeding Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
