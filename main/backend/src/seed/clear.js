import db from "../lib/db.js";

const res = await fetch(`${db.supabaseUrl}/rest/v1/?apikey=${db.supabaseKey}`, {
  headers: {
    apikey: db.supabaseKey,
    Authorization: `Bearer ${db.supabaseKey}`,
  },
});

const data = await res.json();
const tables = Object.keys(data.definitions);

for (let table of tables) {
  const { data: rows } = await db.from(table).delete();
}
