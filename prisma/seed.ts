import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import cities from "../cities";
import normalize from "../src/utils/normalize";

const states: string[] = cities.reduce((acc, city) => {
  if (!acc.includes(normalize(city.admin_name))) {
    acc.push(normalize(city.admin_name));
  }
  return acc;
}, [] as string[]);

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
      {
        label: "Meeting like-minded people",
        key: "meeting",
      },
      {
        label: "Assignments/Jobs",
        key: "assignments",
      },
      {
        label: "Second shooter opportunities",
        key: "second-shooter",
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
      {
        label: "Creating a portfolio",
        key: "portfolio",
      },
      {
        label: "Business Coaching",
        key: "business",
      },
    ],
  },
  workshops: {
    type: "checkbox",
    label: "Which workshops would you like to attend?",
    key: "workshops",
    options: [
      {
        label: "Image post-processing",
        key: "image-post-processing",
      },
      {
        label: "Video post-processing",
        key: "video-post-processing",
      },
      {
        label: "Lighting",
        key: "lighting",
      },
      {
        label: "Album Making",
        key: "album-making",
      },
    ],
  },
  mentorship: {
    type: "textarea",
    label:
      "Here's your chance to give back! Are you open to share your knowledge and expertise with this community? If yes, please specify how you can help.",
    hint: "For e.g. you can mentor an upcoming photographer / Videographer / teach technical or business skills / conduct workshops.",
    key: "mentorship",
  },
  message: {
    type: "textarea",
    label: "Leave us a message!",
    key: "message",
  },
  contact: {
    type: "checkbox",
    label: "How would you like to stay in touch?",
    key: "contact",
    options: [
      {
        label: "Facebook group",
        key: "facebook",
      },
      {
        label: "WhatsApp group",
        key: "whatsapp",
      },
      {
        label: "Discord",
        key: "discord",
      },
      {
        label: "Slack",
        key: "slack",
      },
      {
        label: "Google group",
        key: "google",
      },
      {
        label: "Newsletter",
        key: "newsletter",
      },
      {
        label: "Website/Forum",
        key: "website",
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

  states.forEach(async (state) => {
    await prisma.locationState.upsert({
      where: {
        name: state,
      },
      update: {},
      create: {
        name: state,
        cities: {
          createMany: {
            data: [
              ...cities
                .filter((city) => normalize(city.admin_name) === state)
                .map((city) => ({ name: normalize(city.city) })),
              { name: "other" },
            ],
          },
        },
      },
    });
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
