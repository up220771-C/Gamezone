// backend/seed/seed-all.js
const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const SEED_DIR = __dirname; // carpeta con los .json
const URI = process.env.MONGO_URI || 'mongodb://mongo:27017/gamezone';

function parseDbAndCol(basename) {
  // Espera archivos tipo: gamezone.coleccion.json
  const [db, col] = basename.replace(/\.json$/,'').split('.');
  return { db: db || 'gamezone', col };
}

function fixDoc(d) {
  if (d && d._id && d._id.$oid) d._id = new ObjectId(d._id.$oid);
  return d;
}

(async () => {
  const client = new MongoClient(URI);
  try {
    await client.connect();

    const files = fs.readdirSync(SEED_DIR).filter(f => f.endsWith('.json'));
    if (!files.length) {
      console.log('No se encontraron archivos .json en la carpeta seed.');
      process.exit(0);
    }

    for (const file of files) {
      const { db, col } = parseDbAndCol(path.basename(file));
      if (!col) { 
        console.log(`Omitiendo ${file} (formato esperado: <db>.<coleccion>.json)`); 
        continue; 
      }

      const raw = fs.readFileSync(path.join(SEED_DIR, file), 'utf8');
      let docs = JSON.parse(raw);
      if (!Array.isArray(docs)) {
        console.log(`Omitiendo ${file}: no es un array JSON.`);
        continue;
      }
      docs = docs.map(fixDoc);

      const dbo = client.db(db);
      const co = dbo.collection(col);
      await co.deleteMany({});
      const res = await co.insertMany(docs);
      console.log(`OK ${db}.${col}: ${res.insertedCount} documentos`);
    }
  } catch (e) {
    console.error('Error al sembrar:', e);
    process.exit(1);
  } finally {
    await client.close();
  }
})();
