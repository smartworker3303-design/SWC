// Script to delete ALL products from Supabase
// Run with: node scratch/clear-supabase.mjs

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gshjsocoqmazijlpiaos.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ufnsjXxQi6p6gvWZEfg30Q_QEyd66V6';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function clearAllProducts() {
  console.log('🗑️  Fetching all products from Supabase...');

  const { data: allProducts, error: fetchErr } = await supabase
    .from('products')
    .select('id, name, category');

  if (fetchErr) {
    console.error('❌ Error fetching products:', fetchErr.message);
    process.exit(1);
  }

  if (!allProducts || allProducts.length === 0) {
    console.log('✅ Supabase products table is already empty!');
    return;
  }

  console.log(`Found ${allProducts.length} products. Deleting all...`);

  // Delete all using a filter that matches everything (id is never null)
  const { error: deleteErr } = await supabase
    .from('products')
    .delete()
    .neq('id', '__nonexistent__'); // matches all rows

  if (deleteErr) {
    console.error('❌ Error deleting products:', deleteErr.message);
    // Fallback: delete one by one
    console.log('Trying one-by-one deletion...');
    let failCount = 0;
    for (const p of allProducts) {
      const { error } = await supabase.from('products').delete().eq('id', p.id);
      if (error) {
        console.error(`  ❌ Failed to delete ${p.id}: ${error.message}`);
        failCount++;
      } else {
        console.log(`  ✅ Deleted: ${p.id} - ${p.name}`);
      }
    }
    if (failCount === 0) {
      console.log(`\n✅ All ${allProducts.length} products deleted successfully!`);
    } else {
      console.log(`\n⚠️  Deleted ${allProducts.length - failCount}, failed ${failCount}`);
    }
    return;
  }

  console.log(`\n✅ All ${allProducts.length} products deleted from Supabase successfully!`);
  console.log('The product catalog is now empty and ready for fresh data entry.');
}

clearAllProducts();
