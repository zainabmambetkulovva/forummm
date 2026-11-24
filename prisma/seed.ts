import { PrismaClient, UserRole, ForumStatus, Locale } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Super Admin user
  const adminUser = await prisma.user.upsert({
    where: { phone: '+996700000000' },
    update: {},
    create: {
      firstName: 'Администратор',
      lastName: 'Системы',
      phone: '+996700000000',
      phoneVerifiedAt: new Date(),
      email: 'admin@forum.kg',
      role: UserRole.SUPER_ADMIN,
      preferredLocale: Locale.RU,
    },
  });

  console.log('✅ Created admin user:', adminUser.phone);

  // Create test user
  const testUser = await prisma.user.upsert({
    where: { phone: '+996700000001' },
    update: {},
    create: {
      firstName: 'Тестовый',
      lastName: 'Пользователь',
      phone: '+996700000001',
      phoneVerifiedAt: new Date(),
      email: 'user@test.kg',
      role: UserRole.USER,
      preferredLocale: Locale.RU,
    },
  });

  console.log('✅ Created test user:', testUser.phone);

  // Create site settings
  const siteSettings = await prisma.siteSettings.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      displayName: 'FORUM.KG',
      primaryColorHex: '#2563EB',
      accentColorHex: '#10B981',
      contactPhone: '+996 700 000 000',
      contactEmail: 'info@forum.kg',
      translations: {
        create: [
          {
            locale: Locale.RU,
            heroTitle: 'Участвуйте в лучших форумах Кыргызстана',
            heroSubtitle: 'Покупайте билеты онлайн и получайте их в Telegram',
            aboutText:
              'FORUM.KG - это современная платформа для организации и посещения форумов и мероприятий в Кыргызстане.',
          },
          {
            locale: Locale.KY,
            heroTitle: 'Кыргызстандын мыкты форумдарына катышыңыз',
            heroSubtitle: 'Билеттерди онлайн сатып алыңыз жана Telegramга алыңыз',
            aboutText:
              'FORUM.KG - Кыргызстандагы форумдарды жана иш-чараларды уюштуруу жана катышуу үчүн заманбап платформа.',
          },
          {
            locale: Locale.EN,
            heroTitle: 'Join the best forums in Kyrgyzstan',
            heroSubtitle: 'Buy tickets online and receive them on Telegram',
            aboutText:
              'FORUM.KG is a modern platform for organizing and attending forums and events in Kyrgyzstan.',
          },
        ],
      },
      socialLinks: {
        create: [
          {
            platform: 'Instagram',
            url: 'https://instagram.com/forum.kg',
            sortOrder: 1,
          },
          {
            platform: 'Facebook',
            url: 'https://facebook.com/forum.kg',
            sortOrder: 2,
          },
          {
            platform: 'Telegram',
            url: 'https://t.me/forumkg',
            sortOrder: 3,
          },
        ],
      },
    },
  });

  console.log('✅ Created site settings');

  // Create sample forum
  const forum = await prisma.forum.create({
    data: {
      slug: 'tech-summit-2026',
      status: ForumStatus.PUBLISHED,
      venueName: 'Гостиница Хаятт',
      venueAddress: 'г. Бишкек, пр. Эркиндик 191',
      startsAt: new Date('2026-12-15T09:00:00Z'),
      endsAt: new Date('2026-12-15T18:00:00Z'),
      qrExpiresAt: new Date('2026-12-15T20:00:00Z'),
      capacity: 500,
      maxTicketsPerAccount: 2,
      publishedAt: new Date(),
      createdBy: {
        connect: { id: adminUser.id },
      },
      translations: {
        create: [
          {
            locale: Locale.RU,
            title: 'Tech Summit 2026',
            shortDescription: 'Крупнейший технологический форум Кыргызстана',
            description:
              'Присоединяйтесь к нам на крупнейшем технологическом форуме года! Встречи с экспертами, нетворкинг и обсуждение последних трендов в IT-индустрии.',
            program: `09:00 - Регистрация и Welcome Coffee
10:00 - Открытие форума
11:00 - Keynote: Будущее технологий
12:30 - Обед
14:00 - Панельная дискуссия
16:00 - Networking session
18:00 - Закрытие`,
          },
          {
            locale: Locale.KY,
            title: 'Tech Summit 2026',
            shortDescription: 'Кыргызстандын эң чоң технологиялык форуму',
            description:
              'Жылдын эң чоң технологиялык форумуна кошулуңуз! Эксперттер менен жолугушуулар, нетворкинг жана IT тармагындагы акыркы тенденцияларды талкуулоо.',
          },
          {
            locale: Locale.EN,
            title: 'Tech Summit 2026',
            shortDescription: "Kyrgyzstan's largest technology forum",
            description:
              'Join us at the largest technology forum of the year! Expert meetings, networking and discussion of the latest trends in the IT industry.',
          },
        ],
      },
      categories: {
        create: [
          {
            code: 'STANDARD',
            priceMinor: 150000, // 1500 KGS
            currency: 'KGS',
            capacity: 400,
            sortOrder: 1,
            translations: {
              create: [
                {
                  locale: Locale.RU,
                  name: 'Стандартный',
                  description: 'Доступ ко всем основным мероприятиям форума',
                },
                {
                  locale: Locale.KY,
                  name: 'Стандарт',
                  description: 'Форумдун бардык негизги иш-чараларына кирүү',
                },
                {
                  locale: Locale.EN,
                  name: 'Standard',
                  description: 'Access to all main forum events',
                },
              ],
            },
          },
          {
            code: 'VIP',
            priceMinor: 350000, // 3500 KGS
            currency: 'KGS',
            capacity: 100,
            sortOrder: 2,
            translations: {
              create: [
                {
                  locale: Locale.RU,
                  name: 'VIP',
                  description:
                    'Расширенный доступ, VIP-зона, встреча со спикерами, специальный ужин',
                },
                {
                  locale: Locale.KY,
                  name: 'VIP',
                  description:
                    'Кеңейтилген кирүү, VIP зона, спикерлер менен жолугушуу, атайын кечки тамак',
                },
                {
                  locale: Locale.EN,
                  name: 'VIP',
                  description: 'Extended access, VIP zone, meet speakers, special dinner',
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✅ Created sample forum:', forum.slug);

  // Create integration health records
  const integrations = ['GOOGLE', 'SMS', 'FINIK', 'TELEGRAM', 'WEB_PUSH', 'AI'];

  for (const provider of integrations) {
    await prisma.integrationHealth.upsert({
      where: { provider: provider as any },
      update: {},
      create: {
        provider: provider as any,
        state: 'NOT_CONFIGURED',
        troubleshooting:
          'Пожалуйста, настройте интеграцию в файле .env и перезапустите сервер',
      },
    });
  }

  console.log('✅ Created integration health records');

  console.log('\n🎉 Database seeding completed successfully!');
}

main()
  .catch(e => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
