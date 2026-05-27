import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hlvisrpopicrnhdgnhpr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsdmlzcnBvcGljcm5oZGduaHByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MTk1OTAsImV4cCI6MjA5NDQ5NTU5MH0.fgnekLpF7KTobeG8DMpO48CQx-WQQ9zLYWlyqgH6H4M'
);

async function removeDuplicates(table, urlField) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('created_at', { ascending: true }); // oldest first

  if (error) { console.error(`Error fetching ${table}:`, error.message); return; }

  console.log(`\n${table}: ${data.length} total rows`);

  // Group by URL — keep the LAST (newest) id, delete the rest
  const seen = new Map();
  const toDelete = [];

  for (const row of data) {
    const url = row[urlField];
    if (seen.has(url)) {
      toDelete.push(seen.get(url)); // delete the older one
    }
    seen.set(url, row.id); // always keep the newest
  }

  if (toDelete.length === 0) {
    console.log(`  No duplicates found.`);
    return;
  }

  console.log(`  Found ${toDelete.length} duplicate(s) to delete:`, toDelete);

  const { error: delError } = await supabase
    .from(table)
    .delete()
    .in('id', toDelete);

  if (delError) {
    console.error(`  Delete error:`, delError.message);
  } else {
    console.log(`  ✓ Deleted ${toDelete.length} duplicate(s) from ${table}`);
  }
}

await removeDuplicates('sticky_notes', 'image_url');
await removeDuplicates('google_reviews', 'image_url');
await removeDuplicates('gallery_images', 'url');

console.log('\nDone.');
