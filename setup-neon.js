#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');

const execAsync = promisify(exec);

async function createEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  
  try {
    await fs.access(envPath);
    console.log('✅ .env.local already exists');
    
    // Check if it has Neon URL
    const content = await fs.readFile(envPath, 'utf8');
    if (content.includes('neon.tech') || content.includes('pooler.supabase.com')) {
      console.log('✅ Cloud database URL detected');
      return;
    }
  } catch (error) {
    // File doesn't exist, create it
  }

  const envContent = `# Neon Database Configuration
# Replace with your actual Neon database URL
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here-change-this
NEXTAUTH_URL=http://localhost:3000
`;

  await fs.writeFile(envPath, envContent);
  console.log('✅ Created .env.local file with Neon template');
  console.log('⚠️  Please update DATABASE_URL with your actual Neon connection string');
}

async function checkNeonConnection() {
  console.log('🔍 Testing Neon database connection...');
  
  try {
    // Test connection using Prisma
    await execAsync('npx prisma db push --accept-data-loss');
    console.log('✅ Neon database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Neon database connection failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('💡 Check your database credentials in .env.local');
    } else if (error.message.includes('does not exist')) {
      console.log('💡 Check your database name in the connection string');
    } else if (error.message.includes('timeout')) {
      console.log('💡 Check your internet connection and database URL');
    }
    
    return false;
  }
}

async function runMigrations() {
  console.log('🔄 Running database migrations...');
  
  try {
    await execAsync('npx prisma migrate deploy');
    console.log('✅ Database migrations completed');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    
    // Try alternative approach for cloud databases
    console.log('🔄 Trying alternative migration approach...');
    try {
      await execAsync('npx prisma db push');
      console.log('✅ Database schema pushed successfully');
    } catch (pushError) {
      throw new Error(`Both migrate and push failed: ${error.message}`);
    }
  }
}

async function seedDatabase() {
  console.log('🌱 Seeding database with initial data...');
  
  try {
    await execAsync('npx prisma db seed');
    console.log('✅ Database seeding completed');
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    console.log('💡 You can add data manually through the admin panel');
  }
}

async function generatePrismaClient() {
  console.log('🔄 Generating Prisma client...');
  
  try {
    await execAsync('npx prisma generate');
    console.log('✅ Prisma client generated');
  } catch (error) {
    console.error('❌ Prisma client generation failed:', error.message);
    throw error;
  }
}

function printNeonInstructions() {
  console.log('\n📋 Neon Database Setup Instructions:');
  console.log('   1. Go to https://neon.tech');
  console.log('   2. Sign up for a free account');
  console.log('   3. Create a new project');
  console.log('   4. Copy the connection string from the dashboard');
  console.log('   5. Update DATABASE_URL in .env.local');
  console.log('   6. Run this script again');
  console.log('\n🔗 Connection string format:');
  console.log('   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require');
}

async function main() {
  console.log('🚀 Setting up Onion Prices with Neon Database\n');
  
  try {
    await createEnvFile();
    
    // Check if DATABASE_URL is configured
    const envContent = await fs.readFile('.env.local', 'utf8');
    if (envContent.includes('username:password@ep-xxx')) {
      console.log('\n⚠️  DATABASE_URL needs to be configured with your actual Neon credentials');
      printNeonInstructions();
      return;
    }
    
    await generatePrismaClient();
    
    const connected = await checkNeonConnection();
    if (!connected) {
      printNeonInstructions();
      return;
    }
    
    await runMigrations();
    await seedDatabase();
    
    console.log('\n🎉 Neon database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Visit: http://localhost:3000');
    console.log('   3. Admin: http://localhost:3000/admin');
    console.log('   4. Health: http://localhost:3000/api/health');
    
    console.log('\n💡 Benefits of Neon:');
    console.log('   ✅ No Docker required');
    console.log('   ✅ Automatic backups');
    console.log('   ✅ Serverless scaling');
    console.log('   ✅ Free tier available');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Verify your Neon connection string');
    console.log('   2. Check internet connectivity');
    console.log('   3. Ensure database exists in Neon dashboard');
    console.log('   4. Try: npx prisma studio (to test connection)');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
