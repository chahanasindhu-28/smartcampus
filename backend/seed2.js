import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding clubs and events...');

  // 1. Seed Faculty User
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

  // 2. Seed Clubs
  const clubsData = [
    {
      name: 'Google Developer Student Clubs',
      description: 'A university-based community group for students interested in Google developer technologies. Students from all undergraduate or graduate programs with an interest in growing as a developer are welcome. By joining a GDSC, students grow their knowledge in a peer-to-peer learning environment and build solutions for local businesses and their community.',
      logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2000',
      facultyCoordinatorId: faculty.id
    },
    {
      name: 'Robotics Society',
      description: 'We build cool robots and compete in international competitions. Join us if you love hardware, IoT, and making things move!',
      logo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=500',
      banner: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000',
      facultyCoordinatorId: faculty.id
    }
  ];

  for (const c of clubsData) {
    await prisma.club.upsert({
      where: { name: c.name },
      update: {},
      create: c
    });
  }

  const gdsc = await prisma.club.findUnique({ where: { name: 'Google Developer Student Clubs' } });
  const robotics = await prisma.club.findUnique({ where: { name: 'Robotics Society' } });

  // 3. Seed Events
  const eventsData = [
    {
      title: 'DevFest 2026: The Future of AI',
      description: 'Join us for the biggest developer festival of the year! Learn about cutting-edge AI technologies, cloud computing, and participate in a 24-hour hackathon with amazing prizes.',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      posters: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=1000',
      clubId: gdsc.id
    },
    {
      title: 'RoboWars Workshop',
      description: 'A hands-on workshop on building 15kg combat robots. We will cover chassis design, motor selection, and weapon mechanisms.',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      posters: 'https://images.unsplash.com/photo-1580835232814-1180b5c1d636?q=80&w=1000',
      clubId: robotics.id
    }
  ];

  for (const e of eventsData) {
    const exists = await prisma.event.findFirst({ where: { title: e.title } });
    if (!exists) {
      await prisma.event.create({ data: e });
    }
  }

  // 4. Seed Open Positions
  const openingsData = [
    {
      title: 'Machine Learning Lead',
      description: 'Looking for an experienced student to lead our AI/ML initiatives.',
      requirements: 'Python, TensorFlow, Deep Learning',
      clubId: gdsc.id
    },
    {
      title: 'Hardware Engineer',
      description: 'Need someone passionate about PCBs and Arduino.',
      requirements: 'C++, PCB Design, Arduino',
      clubId: robotics.id
    }
  ];

  for (const o of openingsData) {
    const exists = await prisma.openPosition.findFirst({ where: { title: o.title } });
    if (!exists) {
      await prisma.openPosition.create({ data: o });
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
