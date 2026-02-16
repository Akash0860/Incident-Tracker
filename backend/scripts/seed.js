const { pool, createTable } = require('../config/database');

const services = ['Auth', 'Payments', 'Backend', 'Frontend', 'Database', 'API Gateway', 'Cache', 'Search'];
const severities = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];
const statuses = ['OPEN', 'MITIGATED', 'RESOLVED'];
const owners = [
  'jason@team.com',
  'amy@team.com',
  'dev@team.com',
  'ops@team.com',
  'sarah@team.com',
  'mike@team.com',
  'lisa@team.com',
  'john@team.com'
];

const titles = [
  'Login Failure',
  'Payment Delay',
  'API Timeout',
  'UI Bug on Dashboard',
  'Database Issue',
  'Server Overload',
  'Cache Miss',
  'Network Latency',
  'Memory Leak',
  'Disk Space Low',
  '500 Error',
  'Slow Query',
  'Connection Timeout',
  'Authentication Error',
  'Data Sync Failed',
  'Deployment Failed',
  'Service Unavailable',
  'Rate Limit Exceeded',
  'Configuration Error',
  'SSL Certificate Expired'
];

const summaries = [
  'Users experiencing login failures due to session timeout.',
  'Payment processing is delayed causing customer complaints.',
  'API requests to the backend service were timing out, causing disruptions for users.',
  'Dashboard rendering issue affecting multiple users.',
  'Database connection pool exhausted.',
  'Server CPU usage at 95% causing slow response times.',
  'Cache invalidation not working properly.',
  'High network latency detected between services.',
  'Memory leak in application causing crashes.',
  'Disk space running low on production servers.',
  'Internal server error affecting API endpoints.',
  'Database queries taking longer than expected.',
  'Timeout errors when connecting to external services.',
  'Authentication service returning errors.',
  'Data synchronization between services failed.',
  'Deployment pipeline failed due to test failures.',
  'Service health check failing intermittently.',
  'API rate limits being exceeded by automated scripts.',
  'Incorrect configuration deployed to production.',
  'SSL certificate expired causing HTTPS errors.'
];

const seedDatabase = async () => {
  try {
    // First create the table
    await createTable();
    
    console.log('Seeding database with 200 incidents...');
    
    // Clear existing data
    await pool.query('DELETE FROM incidents');
    
    // Generate 200 incidents
    for (let i = 0; i < 200; i++) {
      const title = titles[Math.floor(Math.random() * titles.length)];
      const service = services[Math.floor(Math.random() * services.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const owner = Math.random() > 0.2 ? owners[Math.floor(Math.random() * owners.length)] : null;
      const summary = summaries[Math.floor(Math.random() * summaries.length)];
      
      // Generate random date within the last 90 days
      const daysAgo = Math.floor(Math.random() * 90);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);
      
      const query = `
        INSERT INTO incidents (title, service, severity, status, owner, summary, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
      `;
      
      await pool.query(query, [title, service, severity, status, owner, summary, createdAt]);
      
      if ((i + 1) % 50 === 0) {
        console.log(`Seeded ${i + 1} incidents...`);
      }
    }
    
    console.log('Successfully seeded 200 incidents!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
