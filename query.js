import { getCliClient } from 'sanity/cli';

const client = getCliClient();

async function run() {
  const query = '*[_type == "service"]{_id, name}';
  const data = await client.fetch(query);
  console.log(JSON.stringify(data, null, 2));
}

run();
