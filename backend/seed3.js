import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding extra clubs and events...');

  let faculty = await prisma.user.findUnique({ where: { email: 'faculty@college.edu' } });
  if (!faculty) {
    faculty = await prisma.user.create({
      data: {
        name: 'Dr. Alan Turing',
        email: 'faculty@college.edu',
        password: 'hashedpassword',
        role: 'FACULTY',
        department: 'Computer Science'
      }
    });
  }

  const clubsData = [
    {
      name: 'Onyx',
      description: 'The official Marketing and Management Club. We organize pitch events, marketing hackathons, and connect students with industry leaders.',
      logo: 'https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80&w=2000',
      facultyCoordinatorId: faculty.id
    },
    {
      name: 'IEEE Student Branch',
      description: 'The world\'s largest technical professional organization dedicated to advancing technology for the benefit of humanity.',
      logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000',
      facultyCoordinatorId: faculty.id
    },
    {
      name: 'Anviya',
      description: 'The premier Technical Club. We focus on cutting-edge research, competitive programming, and technical symposiums.',
      logo: 'https://images.unsplash.com/photo-1531297172868-9f1d1b53e0b5?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000',
      facultyCoordinatorId: faculty.id
    },
    {
      name: 'Byte Club',
      description: 'A community of hackers and open-source contributors. We host weekly coding sessions and build tools for the campus.',
      logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000',
      facultyCoordinatorId: faculty.id
    },
    {
      name: 'Khelo NIE',
      description: 'The official Sports and Athletics Club. We manage all inter-college sports tournaments, marathons, and intramural games.',
      logo: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?q=80&w=2000',
      facultyCoordinatorId: faculty.id
    },
    {
      name: '4th Wall',
      description: 'The official Filming and Drama Club. We write, direct, and produce short films and theatrical performances.',
      logo: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000',
      facultyCoordinatorId: faculty.id
    },
    {
      name: 'Yoga Club',
      description: 'Promoting physical and mental well-being through daily yoga sessions, meditation retreats, and wellness workshops.',
      logo: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2000',
      facultyCoordinatorId: faculty.id
    }
  ];

  for (const c of clubsData) {
    await prisma.club.upsert({
      where: { name: c.name },
      update: c,
      create: c
    });
  }

  const anviya = await prisma.club.findUnique({ where: { name: 'Anviya' } });
  const khelo = await prisma.club.findUnique({ where: { name: 'Khelo NIE' } });
  const wall = await prisma.club.findUnique({ where: { name: '4th Wall' } });

  const eventsData = [
    {
      title: 'National Tech Symposium 2026',
      description: 'A 3-day technical extravaganza featuring paper presentations, robotics challenges, and coding competitions.',
      date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      posters: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000',
      clubId: anviya.id
    },
    {
      title: 'Inter-College Football Tournament',
      description: 'Cheer for our team as they battle against the top colleges in the state!',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      posters: 'https://images.unsplash.com/photo-1518605368461-1ee7c645b630?q=80&w=1000',
      clubId: khelo.id
    },
    {
      title: 'Short Film Premiere: "Echoes"',
      description: 'The exclusive premiere of the latest short film produced, directed, and acted entirely by students.',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      posters: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000',
      clubId: wall.id
    }
  ];

  for (const e of eventsData) {
    const exists = await prisma.event.findFirst({ where: { title: e.title } });
    if (!exists) {
      await prisma.event.create({ data: e });
    }
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
