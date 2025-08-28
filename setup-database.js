#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');

const execAsync = promisify(exec);

async function checkDockerInstalled() {
  try {
    await execAsync('docker --version');
    await execAsync('docker-compose --version');
    return true;
  } catch (error) {
    console.error('❌ Docker or Docker Compose not found. Please install Docker Desktop.');
    return false;
  }
}

async function createEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  const envExamplePath = path.join(__dirname, 'env.example');
  
  try {
    await fs.access(envPath);
    console.log('✅ .env.local already exists');
    return;
  } catch (error) {
    // File doesn't exist, create it
  }

  const envContent = `# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/onion_prices?schema=public"

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
`;

  await fs.writeFile(envPath, envContent);
  console.log('✅ Created .env.local file');
}

async function startDatabase() {
  console.log('🔄 Starting PostgreSQL database...');
  
  try {
    // Stop any existing containers
    await execAsync('docker-compose down', { stdio: 'ignore' });
    
    // Start the database
    await execAsync('docker-compose up -d db');
    console.log('✅ Database container started');
    
    // Wait for database to be ready
    console.log('⏳ Waiting for database to be ready...');
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      try {
        await execAsync('docker-compose exec -T db pg_isready -U postgres -d onion_prices');
        console.log('✅ Database is ready');
        break;
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error('Database failed to start after 30 attempts');
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
  } catch (error) {
    console.error('❌ Failed to start database:', error.message);
    throw error;
  }
}

async function runMigrations() {
  console.log('🔄 Running database migrations...');
  
  try {
    await execAsync('npx prisma migrate deploy');
    console.log('✅ Database migrations completed');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
}

async function seedDatabase() {
  console.log('🌱 Seeding database with initial data...');
  
  try {
    await execAsync('npx prisma db seed');
    console.log('✅ Database seeding completed');
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    // Don't throw here, seeding might fail if data already exists
  }
}

async function testConnection() {
  console.log('🔍 Testing database connection...');
  
  try {
    await execAsync('npx prisma db push --accept-data-loss');
    console.log('✅ Database connection test passed');
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    throw error;
  }
}

async function startAdminer() {
  console.log('🔄 Starting Adminer (Database Admin Interface)...');
  
  try {
    await execAsync('docker-compose up -d adminer');
    console.log('✅ Adminer started at http://localhost:8080');
    console.log('   Server: db');
    console.log('   Username: postgres');
    console.log('   Password: postgres');
    console.log('   Database: onion_prices');
  } catch (error) {
    console.error('❌ Failed to start Adminer:', error.message);
  }
}

async function main() {
  console.log('🚀 Setting up Onion Prices Database System\n');
  
  try {
    // Check prerequisites
    if (!(await checkDockerInstalled())) {
      process.exit(1);
    }
    
    // Setup steps
    await createEnvFile();
    await startDatabase();
    await runMigrations();
    await seedDatabase();
    await testConnection();
    await startAdminer();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Visit: http://localhost:3000');
    console.log('   3. Admin: http://localhost:3000/admin');
    console.log('   4. Database: http://localhost:8080');
    console.log('\n💡 If you encounter issues:');
    console.log('   - Check Docker is running');
    console.log('   - Verify .env.local file exists');
    console.log('   - Run: docker-compose logs db');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Ensure Docker Desktop is running');
    console.log('   2. Check port 5432 is not in use');
    console.log('   3. Run: docker-compose down -v');
    console.log('   4. Try setup again');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
