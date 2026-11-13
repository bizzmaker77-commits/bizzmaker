const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function buildDummyDb() {
  const salt = await bcrypt.genSalt(10);

  // Read existing json files from AiDigitalWeb/data if available
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  let pricingPlans = [];
  try {
    const raw = fs.readFileSync(path.join(dataDir, 'pricingData.json'), 'utf8');
    const parsed = JSON.parse(raw);
    for (const [catKey, planList] of Object.entries(parsed)) {
      if (Array.isArray(planList)) {
        for (const p of planList) {
          pricingPlans.push({
            id: p.id || `plan_${Math.random().toString(36).substring(2, 9)}`,
            category: catKey,
            platform: p.platform || null,
            badge_class: p.badgeClass || null,
            level: p.level || p.name || 'Standard',
            pill_class: p.pillClass || null,
            price: String(p.price || '4999'),
            period: p.period || '/month',
            features: typeof p.features === 'string' ? p.features : JSON.stringify(p.features || []),
            button_text: p.buttonText || 'Select Plan',
            is_popular: p.isPopular ? 1 : 0,
            service_name: p.serviceName || null,
            plan_parameter: p.planParameter || null,
            tag_class: p.tagClass || null,
            is_highlight: p.isHighlight ? 1 : 0,
            highlight_styles: p.highlightStyles ? JSON.stringify(p.highlightStyles) : null
          });
        }
      }
    }
  } catch (e) {
    console.warn('Could not parse pricingData.json, using default plans:', e.message);
  }

  let portfolioItems = [];
  try {
    const raw = fs.readFileSync(path.join(dataDir, 'portfolioData.json'), 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed.showcaseItems) {
      for (const item of parsed.showcaseItems) {
        portfolioItems.push({
          id: item.id || `s_${Math.random().toString(36).substring(2, 9)}`,
          section: 'showcase',
          title: item.title,
          category: item.category,
          industry: item.industry,
          metric: item.metric,
          metric_label: item.metricLabel,
          description: item.description,
          tags: JSON.stringify(item.tags || []),
          accent: item.accent,
          icon: item.icon,
          src: item.src || null,
          type: item.type || null,
          global_index: item.globalIndex || null,
          thumbnail: item.thumbnail || null
        });
      }
    }
    if (parsed.featuredProjects) {
      for (const item of parsed.featuredProjects) {
        portfolioItems.push({
          id: item.id || `f_${Math.random().toString(36).substring(2, 9)}`,
          section: 'featured',
          title: item.title,
          category: item.category,
          industry: item.industry,
          metric: item.metric || null,
          metric_label: item.metricLabel || null,
          description: item.description || null,
          tags: JSON.stringify(item.tags || []),
          accent: item.accent || null,
          icon: item.icon || null,
          src: item.src || null,
          type: item.type || null,
          global_index: item.globalIndex || null,
          thumbnail: item.thumbnail || null
        });
      }
    }
  } catch (e) {
    console.warn('Could not parse portfolioData.json:', e.message);
  }

  let visibilitySettings = [];
  try {
    const raw = fs.readFileSync(path.join(dataDir, 'visibilitySettings.json'), 'utf8');
    visibilitySettings = JSON.parse(raw);
  } catch (e) {
    console.warn('Could not parse visibilitySettings.json:', e.message);
  }

  // Pre-seed users with properly hashed passwords
  const users = [
    {
      id: 1,
      email: 'admin@aidigital.com',
      name: 'Super Admin',
      password: await bcrypt.hash('Ai_Digital@0701', salt),
      role: 'ADMIN',
      department: 'Executive',
      salary: 150000,
      status: 'ACTIVE',
      avatar: '🛡️',
      designation: 'Managing Director & Super Admin',
      mobile: '+919096090701',
      dateOfJoining: '2024-01-01',
      createdAt: new Date('2024-01-01').toISOString()
    },
    {
      id: 2,
      email: 'praveen@aidigital.com',
      name: 'Praveen (Business Head)',
      password: await bcrypt.hash('Admin@#123', salt),
      role: 'ADMIN',
      department: 'HR & Operations',
      salary: 95000,
      status: 'ACTIVE',
      avatar: '👨‍💼',
      designation: 'Business Head & Operations Lead',
      mobile: '+919876543210',
      dateOfJoining: '2024-02-15',
      createdAt: new Date('2024-02-15').toISOString()
    },
    {
      id: 3,
      email: 'nikhil@aidigital.com',
      name: 'Nikhil (CEO)',
      password: await bcrypt.hash('AiDigitals@246', salt),
      role: 'CEO',
      department: 'Executive',
      salary: 250000,
      status: 'ACTIVE',
      avatar: '👑',
      designation: 'Chief Executive Officer',
      mobile: '+919988776655',
      dateOfJoining: '2023-11-01',
      createdAt: new Date('2023-11-01').toISOString()
    },
    {
      id: 4,
      email: 'tl@workforce.com',
      name: 'Vikram Singh (Team Lead)',
      password: await bcrypt.hash('tl123', salt),
      role: 'TL',
      department: 'Content & Creatives',
      salary: 80000,
      status: 'ACTIVE',
      avatar: '🎯',
      designation: 'Creative Operations Team Lead',
      mobile: '+919812345678',
      dateOfJoining: '2024-03-01',
      createdAt: new Date('2024-03-01').toISOString()
    },
    {
      id: 5,
      email: 'jennifer@aidigital.com',
      name: 'Jennifer',
      password: await bcrypt.hash('Jennifer@Ai123', salt),
      role: 'SALES',
      department: 'Sales & Growth',
      salary: 50000,
      status: 'ACTIVE',
      avatar: '💼',
      designation: 'Senior Sales & Account Executive',
      mobile: '+919823456789',
      dateOfJoining: '2024-04-01',
      createdAt: new Date('2024-04-01').toISOString()
    },
    {
      id: 6,
      email: 'danish@aidigital.com',
      name: 'Danish Khan',
      password: await bcrypt.hash('Danish@Ai123', salt),
      role: 'EMPLOYEE',
      department: 'Graphic Design',
      salary: 40000,
      status: 'ACTIVE',
      avatar: '🎨',
      designation: 'Senior Graphic & Brand Designer',
      mobile: '+919834567890',
      dateOfJoining: '2024-05-10',
      createdAt: new Date('2024-05-10').toISOString()
    },
    {
      id: 7,
      email: 'harshit@aidigital.com',
      name: 'Harshit Gajbhiye',
      password: await bcrypt.hash('Harshit@Ai456', salt),
      role: 'EMPLOYEE',
      department: 'Social Media Marketing',
      salary: 42000,
      status: 'ACTIVE',
      avatar: '📱',
      designation: 'Social Media & Community Executive',
      mobile: '+919845678901',
      dateOfJoining: '2024-05-15',
      createdAt: new Date('2024-05-15').toISOString()
    },
    {
      id: 8,
      email: 'divyansh@aidigital.com',
      name: 'Divyansh',
      password: await bcrypt.hash('Divyansh@Ai546', salt),
      role: 'EMPLOYEE',
      department: 'AI Video Production',
      salary: 45000,
      status: 'ACTIVE',
      avatar: '🎬',
      designation: 'Lead AI Video Producer',
      mobile: '+919856789012',
      dateOfJoining: '2024-06-01',
      createdAt: new Date('2024-06-01').toISOString()
    },
    {
      id: 9,
      email: 'nouman@aidigital.com',
      name: 'Nouman',
      password: await bcrypt.hash('Nouman@Ai645', salt),
      role: 'EMPLOYEE',
      department: 'AI Video Production',
      salary: 38000,
      status: 'ACTIVE',
      avatar: '🎞️',
      designation: 'AI Video Editor & Motion Designer',
      mobile: '+919867890123',
      dateOfJoining: '2024-06-15',
      createdAt: new Date('2024-06-15').toISOString()
    },
    {
      id: 10,
      email: 'masoom@aidigital.com',
      name: 'Masoom',
      password: await bcrypt.hash('Masoom@Ai564', salt),
      role: 'EMPLOYEE',
      department: 'AI Video Production',
      salary: 38000,
      status: 'ACTIVE',
      avatar: '📹',
      designation: 'Short Form Reels Specialist',
      mobile: '+919878901234',
      dateOfJoining: '2024-07-01',
      createdAt: new Date('2024-07-01').toISOString()
    },
    {
      id: 11,
      email: 'rama@aidigital.com',
      name: 'Rama',
      password: await bcrypt.hash('Rama@Ai789', salt),
      role: 'EMPLOYEE',
      department: 'Paid Ads & PPC',
      salary: 45000,
      status: 'ACTIVE',
      avatar: '📈',
      designation: 'Performance Marketing Specialist',
      mobile: '+919889012345',
      dateOfJoining: '2024-07-15',
      createdAt: new Date('2024-07-15').toISOString()
    },
    {
      id: 12,
      email: 'pujan@aidigital.com',
      name: 'Pujan',
      password: await bcrypt.hash('Pujan@Ai879', salt),
      role: 'EMPLOYEE',
      department: 'Digital Marketing',
      salary: 40000,
      status: 'ACTIVE',
      avatar: '📊',
      designation: 'Digital Marketing Executive',
      mobile: '+919890123456',
      dateOfJoining: '2024-08-01',
      createdAt: new Date('2024-08-01').toISOString()
    },
    {
      id: 13,
      email: 'preet@aidigital.com',
      name: 'Preet',
      password: await bcrypt.hash('Preet@Ai978', salt),
      role: 'EMPLOYEE',
      department: 'Digital Marketing',
      salary: 40000,
      status: 'ACTIVE',
      avatar: '✨',
      designation: 'SEO & Copy Content Specialist',
      mobile: '+919901234567',
      dateOfJoining: '2024-08-15',
      createdAt: new Date('2024-08-15').toISOString()
    },
    {
      id: 14,
      email: 'sanmeet@aidigital.com',
      name: 'Sanmeet',
      password: await bcrypt.hash('Sanmeet@Ai901', salt),
      role: 'EMPLOYEE',
      department: 'Video Production',
      salary: 38000,
      status: 'ACTIVE',
      avatar: '🎥',
      designation: 'Video Production Editor',
      mobile: '+919912345678',
      dateOfJoining: '2024-09-01',
      createdAt: new Date('2024-09-01').toISOString()
    },
    {
      id: 15,
      email: 'employee@workforce.com',
      name: 'Bob Johnson',
      password: await bcrypt.hash('emp123', salt),
      role: 'EMPLOYEE',
      department: 'Web Engineering',
      salary: 75000,
      status: 'ACTIVE',
      avatar: '💻',
      designation: 'Full Stack Web Developer',
      mobile: '+919923456789',
      dateOfJoining: '2024-01-15',
      createdAt: new Date('2024-01-15').toISOString()
    },
    {
      id: 16,
      email: 'client@aidigital.com',
      name: 'Rajesh Sharma (Apex Retail)',
      password: await bcrypt.hash('client123', salt),
      role: 'CLIENT',
      department: 'CL-101',
      salary: 0,
      status: 'ACTIVE',
      avatar: '🏢',
      designation: 'Managing Director, Apex Retail',
      mobile: '+919934567890',
      dateOfJoining: '2024-03-10',
      createdAt: new Date('2024-03-10').toISOString()
    }
  ];

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const attendance = [
    { id: 1, userId: 6, date: todayStr, clockIn: new Date(todayStr + 'T09:32:00Z').toISOString(), clockOut: null, status: 'PRESENT', location: 'Office Pune', createdAt: new Date().toISOString() },
    { id: 2, userId: 7, date: todayStr, clockIn: new Date(todayStr + 'T09:45:00Z').toISOString(), clockOut: null, status: 'PRESENT', location: 'Office Pune', createdAt: new Date().toISOString() },
    { id: 3, userId: 8, date: todayStr, clockIn: new Date(todayStr + 'T09:20:00Z').toISOString(), clockOut: null, status: 'PRESENT', location: 'Remote', createdAt: new Date().toISOString() },
    { id: 4, userId: 11, date: todayStr, clockIn: new Date(todayStr + 'T10:05:00Z').toISOString(), clockOut: null, status: 'LATE', location: 'Office Pune', createdAt: new Date().toISOString() },
    { id: 5, userId: 6, date: yesterdayStr, clockIn: new Date(yesterdayStr + 'T09:28:00Z').toISOString(), clockOut: new Date(yesterdayStr + 'T18:35:00Z').toISOString(), status: 'PRESENT', location: 'Office Pune', createdAt: new Date().toISOString() },
    { id: 6, userId: 7, date: yesterdayStr, clockIn: new Date(yesterdayStr + 'T09:30:00Z').toISOString(), clockOut: new Date(yesterdayStr + 'T18:30:00Z').toISOString(), status: 'PRESENT', location: 'Office Pune', createdAt: new Date().toISOString() },
    { id: 7, userId: 15, date: todayStr, clockIn: new Date(todayStr + 'T09:00:00Z').toISOString(), clockOut: null, status: 'PRESENT', location: 'Remote', createdAt: new Date().toISOString() }
  ];

  const tasks = [
    {
      id: 1,
      title: 'Design Diwali Campaign Creatives (10 Sets)',
      description: 'Create 10 high-conversion banner ad creatives for Apex Retailers festival flash sale.',
      status: 'IN_PROGRESS',
      priority: 'Urgent',
      assignedToId: 6,
      createdById: 4,
      dueDate: todayStr,
      taskDate: todayStr,
      department: 'Graphic Design',
      module: 'Creative Design',
      expectedOutput: '10 JPG/PNG Ad Creatives in 1080x1080 and 1080x1920 sizes',
      workSampleUrl: 'https://drive.google.com/sample-creatives',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Produce 3 AI Video Ads for Real Estate Clients',
      description: 'Generate high-resolution 9:16 AI commercial reels with voiceovers and captions for luxury villa projects.',
      status: 'TODO',
      priority: 'High',
      assignedToId: 8,
      createdById: 4,
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      taskDate: todayStr,
      department: 'AI Video Production',
      module: 'AI Reel Generation',
      expectedOutput: '3 finished MP4 videos ready for Meta and YouTube distribution',
      workSampleUrl: '',
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Weekly Meta Ads Performance Optimization',
      description: 'Review ROAS, CTR and CPL across all 5 active client ad sets; reallocate budget to top performers.',
      status: 'DONE',
      priority: 'Normal',
      assignedToId: 11,
      createdById: 2,
      dueDate: yesterdayStr,
      taskDate: yesterdayStr,
      department: 'Paid Ads & PPC',
      module: 'PPC Optimization',
      expectedOutput: 'Google Sheets report detailing 3.4x average ROAS',
      workSampleUrl: 'https://docs.google.com/sample-sheet',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: 4,
      title: 'Publish Monthly Tech & AI Marketing Blog',
      description: 'Write, format and publish blog article on AI agents transforming eCommerce lead generation.',
      status: 'IN_PROGRESS',
      priority: 'Normal',
      assignedToId: 13,
      createdById: 4,
      dueDate: todayStr,
      taskDate: todayStr,
      department: 'Digital Marketing',
      module: 'SEO Content',
      expectedOutput: 'Published post on /blog with cover image and meta tags',
      workSampleUrl: '',
      createdAt: new Date().toISOString()
    },
    {
      id: 5,
      title: 'Lead Follow-up Calls & Demo Presentations',
      description: 'Conduct follow-up calls with 8 qualified leads from website contact inquiries and Meta ads.',
      status: 'IN_PROGRESS',
      priority: 'Urgent',
      assignedToId: 5,
      createdById: 2,
      dueDate: todayStr,
      taskDate: todayStr,
      department: 'Sales & Growth',
      module: 'Direct Sales',
      expectedOutput: 'Minimum 2 converted proposals signed',
      workSampleUrl: '',
      createdAt: new Date().toISOString()
    }
  ];

  const leaveRequests = [
    {
      id: 1,
      userId: 7,
      startDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      reason: 'Attending family function out of station',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      userId: 9,
      startDate: yesterdayStr,
      endDate: yesterdayStr,
      reason: 'Medical checkup and dental appointment',
      status: 'APPROVED',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ];

  const clients = [
    {
      id: 1,
      clientId: 'CL-101',
      businessName: 'Apex Retail Stores',
      clientName: 'Rajesh Sharma',
      joiningDate: '2024-03-01',
      services: 'Meta Ads, Google Ads, Creatives',
      packageName: 'Combine Growth Pro',
      packageAmount: 35999,
      contact: '+919934567890',
      email: 'client@aidigital.com',
      sector: 'E-commerce & Retail',
      requirement: 'Monthly 30 creatives, 6 AI videos, full ad campaign management',
      accountReady: true,
      active: true,
      extensionDays: 0,
      extensionExpiryDate: null,
      notes: 'High-value priority client. Weekly review on Mondays.',
      createdAt: new Date('2024-03-01').toISOString()
    },
    {
      id: 2,
      clientId: 'CL-102',
      businessName: 'Urban Living Real Estate',
      clientName: 'Anita Deshmukh',
      joiningDate: '2024-04-15',
      services: 'AI Videos, Website, Meta Ads',
      packageName: 'Real Estate Master Growth',
      packageAmount: 49999,
      contact: '+919876501234',
      email: 'anita@urbanliving.com',
      sector: 'Real Estate',
      requirement: 'Luxury villa walkthrough videos and Facebook buyer lead generation',
      accountReady: true,
      active: true,
      extensionDays: 3,
      extensionExpiryDate: '2026-11-20',
      notes: 'Extension granted for holiday campaign.',
      createdAt: new Date('2024-04-15').toISOString()
    },
    {
      id: 3,
      clientId: 'CL-103',
      businessName: 'FitLife Wellness Clinic',
      clientName: 'Dr. Vivek Joshi',
      joiningDate: '2024-06-01',
      services: 'Google Ads, SEO Portal, Social Media',
      packageName: 'Healthcare Growth Standard',
      packageAmount: 23999,
      contact: '+919811223344',
      email: 'drvivek@fitlifewellness.in',
      sector: 'Healthcare',
      requirement: 'Local patient appointments and doctor branding reels',
      accountReady: true,
      active: true,
      extensionDays: 0,
      extensionExpiryDate: null,
      notes: 'Consistently high patient booking volume.',
      createdAt: new Date('2024-06-01').toISOString()
    },
    {
      id: 4,
      clientId: 'CL-104',
      businessName: 'SolarTech Eco Solutions',
      clientName: 'Priya Verma',
      joiningDate: '2024-07-10',
      services: 'Meta Ads, Dynamic Landing Page',
      packageName: 'Green Energy Launchpack',
      packageAmount: 28999,
      contact: '+919855667788',
      email: 'priya@solartecheco.com',
      sector: 'Renewable Energy',
      requirement: 'Rooftop solar inquiry leads across Maharashtra',
      accountReady: true,
      active: true,
      extensionDays: 0,
      extensionExpiryDate: null,
      notes: 'Requires 200+ rooftop inquiries per month.',
      createdAt: new Date('2024-07-10').toISOString()
    }
  ];

  const clientDeliveries = [
    { id: 1, deliveryId: 'DEL-101-1', clientId: 'CL-101', clientName: 'Apex Retail Stores', postType: 'Instagram Carousel', postDate: todayStr, status: 'Pending', workingOn: 'Danish Khan', notes: 'Diwali sale product features', createdAt: new Date().toISOString() },
    { id: 2, deliveryId: 'DEL-101-2', clientId: 'CL-101', clientName: 'Apex Retail Stores', postType: 'AI Reel Promo', postDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], status: 'Pending', workingOn: 'Divyansh', notes: '30s flash discount commercial', createdAt: new Date().toISOString() },
    { id: 3, deliveryId: 'DEL-102-1', clientId: 'CL-102', clientName: 'Urban Living Real Estate', postType: 'Luxury Villa Tour Reel', postDate: yesterdayStr, status: 'Delivered', workingOn: 'Masoom', notes: 'Approved by client on WhatsApp', createdAt: new Date().toISOString() },
    { id: 4, deliveryId: 'DEL-103-1', clientId: 'CL-103', clientName: 'FitLife Wellness Clinic', postType: 'Health Tip Creative Banner', postDate: todayStr, status: 'Pending', workingOn: 'Danish Khan', notes: 'Back pain relief series', createdAt: new Date().toISOString() }
  ];

  const clientTasks = [
    {
      id: 1,
      taskId: 'CTSK-101',
      clientId: 'CL-101',
      businessName: 'Apex Retail Stores',
      taskTitle: 'Diwali Mega Sale Creative Ad Set (5 Posts)',
      date: todayStr,
      assignTo: 'Danish Khan',
      workingOn: 'Danish Khan',
      status: 'In Progress',
      service: 'Creative Packs',
      packageName: 'Combine Growth Pro',
      postType: 'Static Creatives',
      priority: 'Urgent',
      notes: 'Keep brand gold and emerald green color theme.',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      taskId: 'CTSK-102',
      clientId: 'CL-102',
      businessName: 'Urban Living Real Estate',
      taskTitle: 'Palm Heights Project 4K AI Showcase Reel',
      date: todayStr,
      assignTo: 'Divyansh',
      workingOn: 'Divyansh',
      status: 'Not Started',
      service: 'AI Videos',
      packageName: 'Real Estate Master Growth',
      postType: 'Instagram Reel',
      priority: 'High',
      notes: 'Include amenities callouts and pricing starting 1.8 Cr.',
      createdAt: new Date().toISOString()
    }
  ];

  const callRecords = [
    {
      id: 1,
      clientName: 'Sunil Mehta (Kothari Jewels)',
      phoneNumber: '+919822334455',
      status: 'INTERESTED',
      notes: 'Looking for Meta Ads and festival video reel package. Quotation shared for ₹35,000.',
      callDate: new Date().toISOString(),
      followUpDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      expectedValue: 35000,
      leadSource: 'Meta Ad Form',
      salesPersonId: 5,
      packageName: 'Combine Package'
    },
    {
      id: 2,
      clientName: 'Dr. Sameer Patil (Care Dental)',
      phoneNumber: '+919833445566',
      status: 'CONVERTED',
      notes: 'Signed 3-month Healthcare Standard plan! Advance payment ₹15,000 received via Razorpay.',
      callDate: yesterdayStr,
      followUpDate: null,
      expectedValue: 23999,
      leadSource: 'Website Contact Audit Form',
      salesPersonId: 5,
      packageName: 'Google Ads'
    },
    {
      id: 3,
      clientName: 'Ramesh Kulkarni (AgroTech Seedlings)',
      phoneNumber: '+919844556677',
      status: 'CALLBACK',
      notes: 'Requested callback after 4 PM regarding seasonal farmer outreach campaigns.',
      callDate: todayStr,
      followUpDate: new Date(Date.now() + 86400000).toISOString(),
      expectedValue: 18999,
      leadSource: 'Inbound WhatsApp',
      salesPersonId: 5,
      packageName: 'Meta Ads'
    }
  ];

  const renewalRequests = [
    {
      id: 1,
      clientId: 'CL-102',
      clientDbId: 2,
      businessName: 'Urban Living Real Estate',
      requestType: 'EXTENSION',
      status: 'APPROVED',
      requestedDays: 3,
      approvedDays: 3,
      reason: 'Client requested 3 extra days due to property launch event rescheduling.',
      adminNote: 'Approved on good payment history.',
      requestedById: 4,
      requestedByName: 'Vikram Singh',
      requestedByRole: 'TL',
      approvedById: 1,
      approvedByName: 'Super Admin',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const auditLogs = [
    {
      id: 1,
      action: 'Super Admin accessed Unified Admin Panel',
      performedByName: 'Super Admin',
      performedByRole: 'ADMIN',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      action: 'Danish Khan clocked in at Office Pune',
      performedByName: 'Danish Khan',
      performedByRole: 'EMPLOYEE',
      createdAt: new Date(todayStr + 'T09:32:00Z').toISOString()
    },
    {
      id: 3,
      action: 'Sales closed lead Dr. Sameer Patil for ₹23,999',
      performedByName: 'Jennifer',
      performedByRole: 'SALES',
      createdAt: new Date(yesterdayStr + 'T16:20:00Z').toISOString()
    }
  ];

  const blogs = [
    {
      id: 'b1',
      title: 'How AI-Powered Creative Production Cuts CAC by 42%',
      slug: 'ai-creative-production-cac-reduction',
      excerpt: 'Explore how combining algorithmic ad generation with data-driven audience segmentation unlocks exponential return on ad spend.',
      content: '## The Shift in Performance Marketing\n\nTraditional advertising relied on slow manual design iterations. With AI-assisted generative workflows, brands can now test 50+ variations of ad messaging, visuals, and hooks within 48 hours.\n\n### Key Takeaways:\n1. Dynamic Creative Optimization allows real-time audience resonance.\n2. AI reels yield 3x higher retention compared to generic stock footage.\n3. Continuous conversion rate improvements compounds overall ROI.',
      cover_image: '/creative_content/Creative1.jpeg',
      category: 'Marketing',
      published: 1,
      created_at: new Date('2024-09-01').toISOString(),
      updated_at: new Date('2024-09-01').toISOString()
    },
    {
      id: 'b2',
      title: 'Building Modern Next.js SEO Portals for High Inbound Conversions',
      slug: 'modern-nextjs-seo-portals',
      excerpt: 'Why high-speed SSR web applications with zero layout shift consistently outrank legacy CMS sites on Google.',
      content: '## The Technical Edge in Web Development\n\nGoogle core web vitals now heavily penalize slow JavaScript hydration and unoptimized layout shifts. Next.js App Router provides instant server-rendered pages with optimized static assets.\n\n### Why High-Growth Brands Migrate:\n- Near-zero latency page transitions.\n- Native image optimization and WebP compression.\n- Structured schema markup for instant rich search results.',
      cover_image: '/creative_content/Creative2.jpeg',
      category: 'Web Development',
      published: 1,
      created_at: new Date('2024-09-15').toISOString(),
      updated_at: new Date('2024-09-15').toISOString()
    }
  ];

  const websiteVisitors = [
    {
      id: 1,
      visitor_id: 'v_89a7f1',
      session_id: 's_32b0c1',
      ip_address: '103.21.124.5',
      country: 'India',
      country_code: 'IN',
      city: 'Pune',
      region: 'Maharashtra',
      device_type: 'Desktop',
      browser: 'Chrome 122',
      os: 'Windows 11',
      page_url: 'https://aidigital.biz/',
      page_path: '/',
      page_title: 'AI Digital | Neural Growth Marketing',
      referrer: 'https://google.com',
      utm_source: 'google',
      utm_medium: 'organic',
      utm_campaign: null,
      screen_resolution: '1920x1080',
      language: 'en-US',
      duration_seconds: 145,
      is_new_visitor: 1,
      last_active_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      visitor_id: 'v_43d2e9',
      session_id: 's_19e7a4',
      ip_address: '157.34.88.12',
      country: 'India',
      country_code: 'IN',
      city: 'Mumbai',
      region: 'Maharashtra',
      device_type: 'Mobile',
      browser: 'Safari',
      os: 'iOS 17',
      page_url: 'https://aidigital.biz/pricing',
      page_path: '/pricing',
      page_title: 'Transparent Growth Plans | AI Digital',
      referrer: 'https://instagram.com',
      utm_source: 'instagram',
      utm_medium: 'cpc',
      utm_campaign: 'diwali_growth',
      screen_resolution: '390x844',
      language: 'en-IN',
      duration_seconds: 220,
      is_new_visitor: 1,
      last_active_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      visitor_id: 'v_55c1b8',
      session_id: 's_91a4f3',
      ip_address: '49.36.192.11',
      country: 'India',
      country_code: 'IN',
      city: 'Bangalore',
      region: 'Karnataka',
      device_type: 'Desktop',
      browser: 'Edge',
      os: 'Windows 11',
      page_url: 'https://aidigital.biz/portfolio',
      page_path: '/portfolio',
      page_title: 'Client Portfolios & Case Studies | AI Digital',
      referrer: 'https://linkedin.com',
      utm_source: 'linkedin',
      utm_medium: 'post',
      utm_campaign: null,
      screen_resolution: '2560x1440',
      language: 'en-US',
      duration_seconds: 310,
      is_new_visitor: 0,
      last_active_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    }
  ];

  const jobApplications = [
    {
      id: 1,
      name: 'Rohan Deshpande',
      email: 'rohan.deshpande@gmail.com',
      phone: '+919876543219',
      address: 'Baner Road, Pune',
      city: 'Pune',
      district: 'Pune',
      job_title: 'Full Stack Next.js Developer',
      message: 'Experienced with Next.js 15, PostgreSQL, and building AI tools.',
      resume_url: 'https://drive.google.com/sample-resume-rohan.pdf',
      status: 'Reviewed',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 2,
      name: 'Sneha Patel',
      email: 'sneha.patel99@gmail.com',
      phone: '+919812309876',
      address: 'Kalyani Nagar, Pune',
      city: 'Pune',
      district: 'Pune',
      job_title: 'Senior Motion & AI Video Designer',
      message: 'Specialized in After Effects, Premiere, and Midjourney video generation.',
      resume_url: 'https://drive.google.com/sample-resume-sneha.pdf',
      status: 'Pending',
      created_at: new Date().toISOString()
    }
  ];

  const onboardingDetails = [
    {
      id: 1,
      full_name: 'Rajesh Sharma',
      business_name: 'Apex Retail Stores',
      email: 'client@aidigital.com',
      phone: '+919934567890',
      industry: 'Retail & E-commerce',
      plan_name: 'Combine Growth Pro',
      website: 'https://apexretails.com',
      status: 'Active',
      created_at: new Date('2024-03-01').toISOString()
    }
  ];

  const dummyDb = {
    users,
    attendance,
    tasks,
    leaveRequests,
    clients,
    clientDeliveries,
    clientTasks,
    callRecords,
    renewalRequests,
    auditLogs,
    blogs,
    pricing_plans: pricingPlans,
    portfolio_items: portfolioItems,
    visibility_items: visibilitySettings,
    website_visitors: websiteVisitors,
    job_applications: jobApplications,
    onboarding_details: onboardingDetails,
    checkout_exit_feedback: [],
    whatsapp_logs: []
  };

  const targetPath = path.join(dataDir, 'dummy-db.json');
  fs.writeFileSync(targetPath, JSON.stringify(dummyDb, null, 2), 'utf8');
  console.log(`Successfully generated dummy database with ${users.length} users, ${tasks.length} tasks, ${clients.length} clients, and ${pricingPlans.length} pricing plans at: ${targetPath}`);
}

buildDummyDb().catch(err => {
  console.error('Failed to generate dummy database:', err);
  process.exit(1);
});
