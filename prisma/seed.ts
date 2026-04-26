import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding LocalLoop database...");

  // ── Service Categories ─────────────────────────────────
  const categories = await Promise.all([
    prisma.serviceCategory.upsert({
      where: { slug: "printouts" },
      update: {},
      create: { name: "Printouts", slug: "printouts", icon: "🖨️", description: "Black & white and colour printouts", sortOrder: 1 },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: "photocopy" },
      update: {},
      create: { name: "Photocopy / Xerox", slug: "photocopy", icon: "📋", description: "Document photocopying services", sortOrder: 2 },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: "scanning" },
      update: {},
      create: { name: "Scanning", slug: "scanning", icon: "🔍", description: "Document scanning to PDF or image", sortOrder: 3 },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: "lamination" },
      update: {},
      create: { name: "Lamination", slug: "lamination", icon: "🗂️", description: "Document lamination services", sortOrder: 4 },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: "passport-photo" },
      update: {},
      create: { name: "Passport Photo", slug: "passport-photo", icon: "🪪", description: "Passport and ID sized photo prints", sortOrder: 5 },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: "typing" },
      update: {},
      create: { name: "Document Typing", slug: "typing", icon: "⌨️", description: "Typing / data entry services", sortOrder: 6 },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: "resume" },
      update: {},
      create: { name: "Resume Making", slug: "resume", icon: "📄", description: "Professional resume creation", sortOrder: 7 },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: "form-filling" },
      update: {},
      create: { name: "Form Filling", slug: "form-filling", icon: "📝", description: "Online form filling assistance", sortOrder: 8 },
    }),
  ]);

  console.log(`✅ ${categories.length} service categories seeded`);

  // ── Hash password helper ────────────────────────────────
  const hash = (p: string) => bcrypt.hash(p, 10);

  // ── Admin User ─────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@localloop.in" },
    update: {},
    create: {
      name: "LocalLoop Admin",
      email: "admin@localloop.in",
      passwordHash: await hash("Admin@123"),
      role: "ADMIN",
      isVerified: true,
    },
  });
  console.log("✅ Admin seeded:", admin.email);

  // ── Partner 1 ──────────────────────────────────────────
  const partner1User = await prisma.user.upsert({
    where: { email: "raju.prints@localloop.in" },
    update: {},
    create: {
      name: "Raju Kumar",
      email: "raju.prints@localloop.in",
      phone: "9876543210",
      passwordHash: await hash("Partner@123"),
      role: "PARTNER",
      isVerified: true,
      partnerProfile: {
        create: {
          shopName: "Raju Digital & Print Center",
          description: "Your one-stop shop for all printing, scanning, and digital needs in Lajpat Nagar",
          isApproved: true,
          rating: 4.7,
          totalOrders: 243,
          commissionRate: 15,
          city: "Delhi",
          pincode: "110024",
          lat: 28.5664,
          lng: 77.2431,
          operatingHours: {
            monday: { open: "09:00", close: "21:00", closed: false },
            tuesday: { open: "09:00", close: "21:00", closed: false },
            wednesday: { open: "09:00", close: "21:00", closed: false },
            thursday: { open: "09:00", close: "21:00", closed: false },
            friday: { open: "09:00", close: "21:00", closed: false },
            saturday: { open: "09:00", close: "19:00", closed: false },
            sunday: { open: "10:00", close: "15:00", closed: false },
          },
        },
      },
    },
    include: { partnerProfile: true },
  });
  const partner1 = partner1User.partnerProfile!;

  // ── Partner 2 ──────────────────────────────────────────
  const partner2User = await prisma.user.upsert({
    where: { email: "sunrise.cyber@localloop.in" },
    update: {},
    create: {
      name: "Priya Sharma",
      email: "sunrise.cyber@localloop.in",
      phone: "9811223344",
      passwordHash: await hash("Partner@123"),
      role: "PARTNER",
      isVerified: true,
      partnerProfile: {
        create: {
          shopName: "Sunrise Cyber Cafe & Services",
          description: "Leading cyber cafe offering complete digital services, form filling, and government portal assistance",
          isApproved: true,
          rating: 4.5,
          totalOrders: 189,
          commissionRate: 12,
          city: "Delhi",
          pincode: "110092",
          lat: 28.6417,
          lng: 77.3074,
          operatingHours: {
            monday: { open: "08:00", close: "22:00", closed: false },
            tuesday: { open: "08:00", close: "22:00", closed: false },
            wednesday: { open: "08:00", close: "22:00", closed: false },
            thursday: { open: "08:00", close: "22:00", closed: false },
            friday: { open: "08:00", close: "22:00", closed: false },
            saturday: { open: "09:00", close: "20:00", closed: false },
            sunday: { open: "10:00", close: "18:00", closed: false },
          },
        },
      },
    },
    include: { partnerProfile: true },
  });
  const partner2 = partner2User.partnerProfile!;

  // ── Partner 3 (pending approval) ───────────────────────
  await prisma.user.upsert({
    where: { email: "newshop@localloop.in" },
    update: {},
    create: {
      name: "Vijay Singh",
      email: "newshop@localloop.in",
      phone: "9900112233",
      passwordHash: await hash("Partner@123"),
      role: "PARTNER",
      isVerified: true,
      partnerProfile: {
        create: {
          shopName: "Vijay Copy Center",
          description: "New shop offering printing and binding services in Dwarka",
          isApproved: false,
          city: "Delhi",
          pincode: "110078",
          lat: 28.5925,
          lng: 77.0338,
        },
      },
    },
  });

  console.log("✅ Partners seeded");

  // ── Service Listings ───────────────────────────────────
  await prisma.serviceListing.createMany({
    skipDuplicates: true,
    data: [
      { partnerId: partner1.id, categoryId: categories[0].id, name: "B&W Printout (A4)", description: "Black and white single-sided printout", price: 2, estimatedTime: "10 mins" },
      { partnerId: partner1.id, categoryId: categories[0].id, name: "Colour Printout (A4)", description: "Full colour single-sided printout", price: 10, estimatedTime: "10 mins" },
      { partnerId: partner1.id, categoryId: categories[1].id, name: "Xerox / Photocopy", description: "Single-sided A4 photocopy", price: 1.5, estimatedTime: "5 mins" },
      { partnerId: partner1.id, categoryId: categories[2].id, name: "Document Scan (A4)", description: "Scan to PDF, delivered digitally", price: 5, estimatedTime: "5 mins" },
      { partnerId: partner1.id, categoryId: categories[3].id, name: "Hot Lamination (A4)", description: "Glossy hot lamination", price: 20, estimatedTime: "15 mins" },
      { partnerId: partner1.id, categoryId: categories[4].id, name: "Passport Photo (6 pcs)", description: "35x45 mm passport photos printed on glossy paper", price: 50, estimatedTime: "20 mins" },
      { partnerId: partner2.id, categoryId: categories[5].id, name: "Document Typing (per page)", description: "Professional typing in English/Hindi", price: 30, estimatedTime: "30 mins" },
      { partnerId: partner2.id, categoryId: categories[6].id, name: "Resume / CV Making", description: "Professional ATS-friendly resume creation", price: 199, estimatedTime: "2 hrs" },
      { partnerId: partner2.id, categoryId: categories[7].id, name: "Online Form Filling", description: "Assistance with government and exam forms", price: 50, estimatedTime: "30 mins" },
      { partnerId: partner2.id, categoryId: categories[0].id, name: "B&W Printout (A4)", price: 2, estimatedTime: "10 mins" },
    ],
  });

  console.log("✅ Service listings seeded");

  // ── Customers ──────────────────────────────────────────
  const customer1 = await prisma.user.upsert({
    where: { email: "amit.kumar@gmail.com" },
    update: {},
    create: {
      name: "Amit Kumar",
      email: "amit.kumar@gmail.com",
      phone: "9012345678",
      passwordHash: await hash("Customer@123"),
      role: "CUSTOMER",
      isVerified: true,
      customerProfile: { create: {} },
    },
  });

  await prisma.user.upsert({
    where: { email: "sneha.t@gmail.com" },
    update: {},
    create: {
      name: "Sneha Tiwari",
      email: "sneha.t@gmail.com",
      phone: "9123456789",
      passwordHash: await hash("Customer@123"),
      role: "CUSTOMER",
      isVerified: true,
      customerProfile: { create: {} },
    },
  });

  // ── Address for customer ────────────────────────────────
  const addr = await prisma.address.create({
    data: {
      userId: customer1.id,
      label: "Home",
      line1: "B-42, Lajpat Nagar Part III",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110024",
      lat: 28.5672,
      lng: 77.2398,
      isDefault: true,
    },
  });

  console.log("✅ Customers + address seeded");

  // ── Delivery Agent ─────────────────────────────────────
  await prisma.user.upsert({
    where: { email: "rajesh.delivery@localloop.in" },
    update: {},
    create: {
      name: "Rajesh Yadav",
      email: "rajesh.delivery@localloop.in",
      phone: "9988776655",
      passwordHash: await hash("Agent@123"),
      role: "DELIVERY_AGENT",
      isVerified: true,
      deliveryAgentProfile: {
        create: {
          vehicleType: "Motorcycle",
          isAvailable: true,
          rating: 4.8,
          totalDeliveries: 312,
          currentLat: 28.5680,
          currentLng: 77.2450,
          kycStatus: "VERIFIED",
        },
      },
    },
  });

  console.log("✅ Delivery agent seeded");

  // ── Sample Orders ──────────────────────────────────────
  const listings = await prisma.serviceListing.findMany({ take: 3 });

  await prisma.order.create({
    data: {
      customerId: customer1.id,
      partnerId: partner1.id,
      status: "DELIVERED",
      totalAmount: 62,
      platformFee: 9.3,
      partnerEarning: 52.7,
      deliveryFee: 30,
      deliveryType: "DELIVERY",
      paymentStatus: "PAID",
      notes: "Please print 10 copies",
      dropAddressId: addr.id,
      orderItems: {
        create: [
          {
            serviceListingId: listings[0].id,
            quantity: 10,
            unitPrice: listings[0].price,
            instructions: "Double-sided if possible",
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      customerId: customer1.id,
      partnerId: partner2.id,
      status: "IN_PROGRESS",
      totalAmount: 199,
      platformFee: 29.85,
      partnerEarning: 169.15,
      deliveryFee: 0,
      deliveryType: "SELF_COLLECT",
      paymentStatus: "PAID",
      notes: "Make it ATS-friendly",
      orderItems: {
        create: [
          {
            serviceListingId: listings[7] ? listings[7].id : listings[0].id,
            quantity: 1,
            unitPrice: 199,
            instructions: "3 years experience, software developer",
          },
        ],
      },
    },
  });

  // ── Coupon ─────────────────────────────────────────────
  await prisma.coupon.upsert({
    where: { code: "WELCOME50" },
    update: {},
    create: {
      code: "WELCOME50",
      discountType: "FLAT",
      discountValue: 50,
      minOrderAmount: 100,
      maxUsage: 500,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "LOOP10" },
    update: {},
    create: {
      code: "LOOP10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderAmount: 50,
      maxUsage: 1000,
      isActive: true,
    },
  });

  console.log("✅ Coupons seeded");
  console.log("\n🎉 LocalLoop database seeded successfully!");
  console.log("\n📧 Demo Credentials:");
  console.log("   Admin:     admin@localloop.in / Admin@123");
  console.log("   Partner 1: raju.prints@localloop.in / Partner@123");
  console.log("   Partner 2: sunrise.cyber@localloop.in / Partner@123");
  console.log("   Customer:  amit.kumar@gmail.com / Customer@123");
  console.log("   Agent:     rajesh.delivery@localloop.in / Agent@123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
