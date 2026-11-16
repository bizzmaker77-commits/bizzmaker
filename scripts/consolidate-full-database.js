const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

console.log('====================================================');
console.log('AI DIGITAL & WORKFORCE UNIFIED DATABASE CONSOLIDATOR');
console.log('====================================================');

const masterData = {
  metadata: {
    exportedAt: new Date().toISOString(),
    description: "Unified master database export for AI Digital Web & WorkForce OS",
    version: "2.0.0",
    sources: []
  },
  users: [],
  clients: [],
  tasks: [],
  client_tasks: [],
  client_deliveries: [],
  attendance: [],
  leave_requests: [],
  plans: [],
  call_records: [],
  renewal_requests: [],
  client_feedback: [],
  audit_logs: [],
  pricing_plans: [],
  portfolio_items: [],
  blogs: [],
  site_visibility: [],
  job_applications: [],
  onboarding_details: [],
  promo_codes: [],
  website_visitors: [],
  whatsapp_logs: [],
  checkout_exit_feedback: []
};

// ----------------------------------------------------
// Source 1: SQLite dev.db in Management-System
// ----------------------------------------------------
const devDbPath = 'D:/AiDigitals_Projects/CustomizedAi/Management-System/dev.db';
if (fs.existsSync(devDbPath)) {
  try {
    console.log('\n[1/4] Reading Management-System/dev.db (SQLite)...');
    const db = new DatabaseSync(devDbPath);
    masterData.metadata.sources.push('Management-System/dev.db');

    const readTable = (tableName) => {
      try {
        return db.prepare(`SELECT * FROM "${tableName}"`).all();
      } catch (err) {
        return [];
      }
    };

    const users = readTable('User');
    const clients = readTable('Client');
    const clientTasks = readTable('ClientTask');
    const tasks = readTable('Task');
    const attendance = readTable('Attendance');
    const leaves = readTable('LeaveRequest');
    const plans = readTable('Plan');
    const auditLogs = readTable('AuditLog');

    console.log(`  -> Users: ${users.length}`);
    console.log(`  -> Clients: ${clients.length}`);
    console.log(`  -> ClientTasks: ${clientTasks.length}`);
    console.log(`  -> Tasks: ${tasks.length}`);
    console.log(`  -> Attendance: ${attendance.length}`);
    console.log(`  -> LeaveRequests: ${leaves.length}`);
    console.log(`  -> Plans: ${plans.length}`);
    console.log(`  -> AuditLogs: ${auditLogs.length}`);

    users.forEach(u => {
      masterData.users.push({
        id: u.id,
        email: u.email,
        name: u.name,
        password: u.password,
        role: u.role,
        department: u.department,
        salary: u.salary || 0,
        status: u.status || 'ACTIVE',
        avatar: u.avatar || null,
        address: u.address || null,
        dob: u.dob || null,
        exp: u.exp || null,
        designation: u.designation || null,
        mobile: u.mobile || null,
        lastSalary: u.lastSalary || 0,
        dateOfJoining: u.dateOfJoining || null,
        passportPhoto: u.passportPhoto || null,
        aadharCard: u.aadharCard || null,
        panCard: u.panCard || null,
        marksheet10: u.marksheet10 || null,
        marksheet12: u.marksheet12 || null,
        graduation: u.graduation || null,
        otherDoc: u.otherDoc || null,
        works: u.works || null,
        createdAt: u.createdAt || new Date().toISOString()
      });
    });

    clients.forEach(c => {
      masterData.clients.push({
        id: c.id,
        clientId: c.clientId,
        businessName: c.businessName,
        clientName: c.clientName || null,
        joiningDate: c.joiningDate || new Date().toISOString().split('T')[0],
        services: c.services || '',
        packageName: c.packageName || '',
        packageAmount: Number(c.packageAmount) || 0,
        contact: c.contact || null,
        email: c.email || null,
        password: c.password || null,
        website: c.website || null,
        sector: c.sector || null,
        requirement: c.requirement || null,
        accountReady: Boolean(c.accountReady),
        active: Boolean(c.active !== undefined ? c.active : true),
        extensionDays: Number(c.extensionDays) || 0,
        extensionExpiryDate: c.extensionExpiryDate || null,
        notes: c.notes || null,
        createdAt: c.createdAt || new Date().toISOString()
      });
    });

    clientTasks.forEach(ct => {
      masterData.client_tasks.push({
        id: ct.id,
        taskId: ct.taskId,
        clientId: ct.clientId,
        businessName: ct.businessName,
        taskTitle: ct.taskTitle,
        date: ct.date,
        assignTo: ct.assignTo || null,
        workingOn: ct.workingOn || null,
        status: ct.status || 'Not Started',
        service: ct.service || null,
        packageName: ct.packageName || null,
        postType: ct.postType || null,
        notes: ct.notes || null,
        priority: ct.priority || 'Normal',
        reason: ct.reason || null,
        workSampleUrl: ct.workSampleUrl || null,
        statusChangedAt: ct.statusChangedAt || null,
        createdAt: ct.createdAt || new Date().toISOString()
      });
    });

    tasks.forEach(t => {
      masterData.tasks.push({
        id: t.id,
        title: t.title,
        description: t.description || null,
        status: t.status || 'TODO',
        assignedToId: t.assignedToId,
        createdById: t.createdById,
        dueDate: t.dueDate || null,
        priority: t.priority || 'Normal',
        reason: t.reason || null,
        workSampleUrl: t.workSampleUrl || null,
        department: t.department || null,
        subtasks: t.subtasks || null,
        module: t.module || null,
        dependency: t.dependency || null,
        expectedOutput: t.expectedOutput || null,
        taskDate: t.taskDate || null,
        createdAt: t.createdAt || new Date().toISOString()
      });
    });

    attendance.forEach(a => {
      masterData.attendance.push({
        id: a.id,
        userId: a.userId,
        clockIn: a.clockIn,
        clockOut: a.clockOut || null,
        status: a.status,
        date: a.date,
        location: a.location || null,
        createdAt: a.createdAt || new Date().toISOString()
      });
    });

    leaves.forEach(l => {
      masterData.leave_requests.push({
        id: l.id,
        userId: l.userId,
        startDate: l.startDate,
        endDate: l.endDate,
        reason: l.reason,
        status: l.status || 'PENDING',
        createdAt: l.createdAt || new Date().toISOString()
      });
    });

    plans.forEach(p => {
      let parsedFeatures = p.features;
      try {
        if (typeof p.features === 'string') parsedFeatures = JSON.parse(p.features);
      } catch (e) {}
      masterData.plans.push({
        id: p.id,
        category: p.category,
        name: p.name,
        price: Number(p.price) || 0,
        billingCycle: p.billingCycle || null,
        features: parsedFeatures,
        createdAt: p.createdAt || new Date().toISOString()
      });
    });

    auditLogs.forEach(al => {
      masterData.audit_logs.push({
        id: al.id,
        action: al.action,
        performedByName: al.performedByName,
        performedByRole: al.performedByRole,
        createdAt: al.createdAt || new Date().toISOString()
      });
    });

  } catch (err) {
    console.error('Error reading dev.db:', err.message);
  }
}

// ----------------------------------------------------
// Source 2: Historic July Data Dump
// ----------------------------------------------------
const julyDumpPath = 'D:/AiDigitals_Projects/CustomizedAi/Management-System/july_data_dump.json';
if (fs.existsSync(julyDumpPath)) {
  try {
    console.log('\n[2/4] Reading Management-System/july_data_dump.json...');
    masterData.metadata.sources.push('Management-System/july_data_dump.json');
    const dump = JSON.parse(fs.readFileSync(julyDumpPath, 'utf8'));

    const existingClientIds = new Set(masterData.clients.map(c => c.clientId));
    let addedClients = 0;
    if (Array.isArray(dump.clients)) {
      dump.clients.forEach((c, idx) => {
        if (c.clientId && !existingClientIds.has(c.clientId)) {
          existingClientIds.add(c.clientId);
          masterData.clients.push({
            id: masterData.clients.length + 1,
            clientId: c.clientId,
            businessName: c.businessName || c.clientName || `Client ${c.clientId}`,
            clientName: c.clientName || null,
            joiningDate: c.joiningDate || '2024-07-01',
            services: c.services || '',
            packageName: c.packageName || 'Standard Growth',
            packageAmount: Number(c.packageAmount) || 0,
            contact: c.contact || null,
            email: c.email || null,
            password: null,
            website: c.website || null,
            sector: c.sector || null,
            requirement: c.requirement || null,
            accountReady: true,
            active: true,
            extensionDays: 0,
            extensionExpiryDate: null,
            notes: c.notes || null,
            createdAt: '2024-07-01T00:00:00.000Z'
          });
          addedClients++;
        }
      });
    }

    const existingTaskIds = new Set(masterData.client_tasks.map(ct => ct.taskId));
    let addedClientTasks = 0;
    if (Array.isArray(dump.clientTasks)) {
      dump.clientTasks.forEach((ct, idx) => {
        const taskId = ct.taskId || `TASK-JULY-${idx + 1}`;
        if (!existingTaskIds.has(taskId)) {
          existingTaskIds.add(taskId);
          masterData.client_tasks.push({
            id: masterData.client_tasks.length + 1,
            taskId: taskId,
            clientId: ct.clientId,
            businessName: ct.businessName || '',
            taskTitle: ct.taskTitle || 'Marketing Deliverable',
            date: ct.date || '2024-07-15',
            assignTo: ct.assignTo || null,
            workingOn: ct.workingOn || null,
            status: ct.status || 'Completed',
            service: ct.service || null,
            packageName: ct.packageName || null,
            postType: ct.postType || null,
            notes: ct.notes || null,
            priority: ct.priority || 'Normal',
            reason: null,
            workSampleUrl: ct.workSampleUrl || null,
            statusChangedAt: null,
            createdAt: '2024-07-15T00:00:00.000Z'
          });
          addedClientTasks++;
        }
      });
    }

    console.log(`  -> Merged additional clients: ${addedClients}`);
    console.log(`  -> Merged additional client tasks: ${addedClientTasks}`);
  } catch (err) {
    console.error('Error reading july_data_dump.json:', err.message);
  }
}

// ----------------------------------------------------
// Source 3: AI Digital MySQL database.sql
// ----------------------------------------------------
const sqlDumpPath = 'D:/AiDigitals_Projects/CustomizedAi/AiDigitalWeb/database.sql';
if (fs.existsSync(sqlDumpPath)) {
  try {
    console.log('\n[3/4] Parsing AiDigitalWeb/database.sql...');
    masterData.metadata.sources.push('AiDigitalWeb/database.sql');
    const sqlContent = fs.readFileSync(sqlDumpPath, 'utf8');

    // Parse pricing_plans
    const pricingMatch = sqlContent.match(/INSERT INTO `pricing_plans` VALUES\s*([\s\S]*?);/);
    if (pricingMatch) {
      const rows = pricingMatch[1].trim().split(/\),\s*\(/);
      rows.forEach((r, idx) => {
        const clean = r.replace(/^\(/, '').replace(/\)$/, '');
        // Regex parse values
        const parts = clean.match(/('(\\'|[^'])*'|[0-9.]+|NULL)/g);
        if (parts && parts.length >= 10) {
          const val = (idx) => {
            const p = parts[idx];
            if (!p || p === 'NULL') return null;
            if (p.startsWith("'") && p.endsWith("'")) return p.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"');
            return p;
          };
          masterData.pricing_plans.push({
            id: val(0) || `plan_${idx}`,
            category: val(1),
            platform: val(2),
            badge_class: val(3),
            level: val(4),
            pill_class: val(5),
            price: val(6),
            period: val(7),
            features: val(8),
            button_text: val(9) || 'Select Plan',
            is_popular: Number(val(10)) === 1,
            service_name: val(11),
            plan_parameter: val(12),
            tag_class: val(13),
            is_highlight: Number(val(14)) === 1,
            highlight_styles: val(15)
          });
        }
      });
    }

    // Parse portfolio_items
    const portfolioMatch = sqlContent.match(/INSERT INTO `portfolio_items`[^V]*VALUES\s*([\s\S]*?);/);
    if (portfolioMatch) {
      const rows = portfolioMatch[1].trim().split(/\),\s*\(/);
      rows.forEach((r, idx) => {
        const clean = r.replace(/^\(/, '').replace(/\)$/, '');
        const parts = clean.match(/('(\\'|[^'])*'|[0-9.]+|NULL)/g);
        if (parts && parts.length >= 8) {
          const val = (idx) => {
            const p = parts[idx];
            if (!p || p === 'NULL') return null;
            if (p.startsWith("'") && p.endsWith("'")) return p.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"');
            return p;
          };
          masterData.portfolio_items.push({
            id: val(0) || `port_${idx}`,
            section: val(1),
            title: val(2),
            category: val(3),
            industry: val(4),
            metric: val(5),
            metric_label: val(6),
            description: val(7),
            tags: val(8),
            accent: val(9),
            icon: val(10),
            src: val(11),
            type: val(12),
            global_index: val(13) ? Number(val(13)) : null
          });
        }
      });
    }

    console.log(`  -> Pricing Plans parsed: ${masterData.pricing_plans.length}`);
    console.log(`  -> Portfolio Items parsed: ${masterData.portfolio_items.length}`);
  } catch (err) {
    console.error('Error parsing database.sql:', err.message);
  }
}

// ----------------------------------------------------
// Source 4: Local JSON State (dummy-db.json)
// ----------------------------------------------------
const dummyDbPath = 'D:/AiDigitals_Projects/CustomizedAi/bizzmaker/data/dummy-db.json';
if (fs.existsSync(dummyDbPath)) {
  try {
    console.log('\n[4/4] Merging bizzmaker/data/dummy-db.json...');
    masterData.metadata.sources.push('bizzmaker/data/dummy-db.json');
    const dummy = JSON.parse(fs.readFileSync(dummyDbPath, 'utf8'));

    // Merge users (super admin, praveen, dev, danish, etc.)
    const existingEmails = new Set(masterData.users.map(u => u.email.toLowerCase()));
    if (Array.isArray(dummy.users)) {
      dummy.users.forEach(u => {
        if (!existingEmails.has(u.email.toLowerCase())) {
          existingEmails.add(u.email.toLowerCase());
          masterData.users.push({
            id: masterData.users.length + 1,
            email: u.email,
            name: u.name,
            password: u.password,
            role: u.role,
            department: u.department || 'Management',
            salary: u.salary || 0,
            status: u.status || 'ACTIVE',
            avatar: u.avatar || null,
            address: u.address || null,
            dob: u.dob || null,
            exp: u.exp || null,
            designation: u.designation || null,
            mobile: u.mobile || null,
            lastSalary: u.lastSalary || 0,
            dateOfJoining: u.dateOfJoining || null,
            passportPhoto: null,
            aadharCard: null,
            panCard: null,
            marksheet10: null,
            marksheet12: null,
            graduation: null,
            otherDoc: null,
            works: null,
            createdAt: u.createdAt || new Date().toISOString()
          });
        }
      });
    }

    // Merge clientDeliveries
    if (Array.isArray(dummy.clientDeliveries)) {
      masterData.client_deliveries = dummy.clientDeliveries;
    }

    // Merge renewalRequests
    if (Array.isArray(dummy.renewalRequests)) {
      masterData.renewal_requests = dummy.renewalRequests;
    }

    // Merge callRecords
    if (Array.isArray(dummy.callRecords)) {
      masterData.call_records = dummy.callRecords;
    }

    // Merge blogs
    if (Array.isArray(dummy.blogs)) {
      masterData.blogs = dummy.blogs;
    }

    // Merge website visitors
    if (Array.isArray(dummy.website_visitors)) {
      masterData.website_visitors = dummy.website_visitors;
    }

    // Merge visibility items
    if (dummy.visibility_items) {
      masterData.site_visibility = Array.isArray(dummy.visibility_items) 
        ? dummy.visibility_items 
        : (dummy.visibility_items.items || []);
    }

    // Merge job applications
    if (Array.isArray(dummy.job_applications)) {
      masterData.job_applications = dummy.job_applications;
    }

    // Merge onboarding details
    if (Array.isArray(dummy.onboarding_details)) {
      masterData.onboarding_details = dummy.onboarding_details;
    }

    // Merge promo codes
    if (Array.isArray(dummy.promos) || Array.isArray(dummy.promo_codes)) {
      masterData.promo_codes = dummy.promos || dummy.promo_codes;
    }

    // Merge client feedback
    if (Array.isArray(dummy.clientFeedback)) {
      masterData.client_feedback = dummy.clientFeedback;
    }

    console.log(`  -> Final Users Count: ${masterData.users.length}`);
    console.log(`  -> Final Clients Count: ${masterData.clients.length}`);
    console.log(`  -> Client Deliveries: ${masterData.client_deliveries.length}`);
    console.log(`  -> Client Tasks: ${masterData.client_tasks.length}`);
    console.log(`  -> Pricing Plans: ${masterData.pricing_plans.length}`);
    console.log(`  -> Portfolio Items: ${masterData.portfolio_items.length}`);
    console.log(`  -> Website Visitors: ${masterData.website_visitors.length}`);
    console.log(`  -> Blogs: ${masterData.blogs.length}`);
    console.log(`  -> Site Visibility Controls: ${masterData.site_visibility.length}`);
  } catch (err) {
    console.error('Error merging dummy-db.json:', err.message);
  }
}

// ----------------------------------------------------
// Save Master Backup File
// ----------------------------------------------------
const outputPath1 = path.join(__dirname, '../data/database_master_backup.json');
const outputPath2 = 'D:/AiDigitals_Projects/CustomizedAi/database_master_backup.json';

fs.mkdirSync(path.dirname(outputPath1), { recursive: true });
fs.writeFileSync(outputPath1, JSON.stringify(masterData, null, 2), 'utf8');
fs.writeFileSync(outputPath2, JSON.stringify(masterData, null, 2), 'utf8');

console.log('\n====================================================');
console.log('✅ MASTER DATABASE CONSOLIDATION COMPLETE!');
console.log('Master Backup Saved to:');
console.log('  1) ' + outputPath1);
console.log('  2) ' + outputPath2);
console.log('====================================================\n');
