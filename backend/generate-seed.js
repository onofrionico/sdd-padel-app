const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

async function generateSeed() {
  console.log('🔐 Generando hash de password...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  console.log('✅ Hash generado:', hashedPassword);

  console.log('📝 Actualizando archivo seed.sql...');
  const sqlPath = path.join(__dirname, 'seed.sql');
  let sqlContent = fs.readFileSync(sqlPath, 'utf8');
  
  // Reemplazar el placeholder con el hash real
  sqlContent = sqlContent.replace(/\$2b\$10\$YourHashedPasswordHere/g, hashedPassword);
  
  fs.writeFileSync(sqlPath, sqlContent);
  console.log('✅ Archivo seed.sql actualizado');
  
  console.log('\n📋 Para ejecutar el seed, usa uno de estos comandos:');
  console.log('   1. psql -U postgres -d padel_tournament -f seed.sql');
  console.log('   2. npm run seed:sql (si tienes el script configurado)');
}

generateSeed().catch(console.error);
