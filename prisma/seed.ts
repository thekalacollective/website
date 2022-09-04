import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const tags = [
  "Photojournalism",
  "Documentary",
  "Editorial",
  "Fine Art",
  "Weddings & Events",
  "Concerts",
  "Fashion",
  "Headshots",
  "Family & Baby",
  "Travel & Nature",
  "Wildlife",
  "Product",
  "Food",
  "Advertising",
  "Interior & Architecture",
  "Modelling Portfolios",
  "Social Media Content",
];

const services = [
  "Photography",
  "Videography",
  "Image editing",
  "Video editing",
  "Photo Restoration",
  "Album Making",
  "Printing",
  "Social Media Management",
];

const Survey = {
  reason: {
    type: "checkbox",
    label: "Why do you wish to be a part of this community?",
    key: "reason",
    options: [
      {
        label: "Networking",
        key: "networking",
      },
      {
        label: "Training",
        key: "training",
      },
    ],
  },
  assistance: {
    type: "checkbox",
    label: "Do you need assistance with any of the following?",
    key: "assistance",
    options: [
      {
        label: "Creating website",
        key: "website",
      },
      {
        label: "Preparing Rate Cards",
        key: "rateCards",
      },
    ],
  },
};

async function main() {
  await prisma.user.upsert({
    where: { email: "thekalacollective.in@gmail.com" },
    update: {},
    create: {
      email: "thekalacollective.in@gmail.com",
      name: "TheKalaCollective",
      role: "ADMIN",
    },
  });

  tags.forEach(async (tag) => {
    await prisma.tag.upsert({
      where: {
        name: tag,
      },
      update: {},
      create: {
        name: tag,
      },
    });
  });

  services.forEach(async (service) => {
    await prisma.service.upsert({
      where: {
        name: service,
      },
      update: {},
      create: {
        name: service,
      },
    });
  });

  await prisma.survey.upsert({
    where: {
      slug: "membershipApplication",
    },
    update: {
      schema: Survey,
    },
    create: {
      slug: "membershipApplication",
      title: "Membership Application",
      schema: Survey,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
