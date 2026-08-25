// Test Supabase write permissions - run with: node scratch/test-supabase-write.mjs

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gshjsocoqmazijlpiaos.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ufnsjXxQi6p6gvWZEfg30Q_QEyd66V6';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testWriteAndDelete() {
  console.log('🔌 Testing Supabase connection...\n');

  // Test 1: READ
  console.log('📖 Test 1: Reading products table...');
  const { data: readData, error: readError } = await supabase
    .from('products')
    .select('*');
  
  if (readError) {
    console.error('❌ READ FAILED:', readError.message);
    console.error('   Code:', readError.code);
    console.error('   Details:', readError.details);
  } else {
    console.log(`✅ READ OK — found ${readData.length} products`);
  }

  // Test 2: INSERT
  console.log('\n📝 Test 2: Inserting a test product...');
  const testProduct = {
    id: 'test-product-abc123',
    name: 'Test Wall Clock',
    category: 'wall-clocks',
    price: 1000,
    rating: 5.0,
    reviews: 0,
    image: '/images/sunburst_clock.png',  // small path, not base64
    description: 'Test product for debugging',
    specs: { "Material": "Test", "Movement": "Quartz" },
    featured: true,
    tag: 'New'
  };

  const { data: insertData, error: insertError } = await supabase
    .from('products')
    .upsert(testProduct)
    .select();

  if (insertError) {
    console.error('❌ INSERT FAILED:', insertError.message);
    console.error('   Code:', insertError.code);
    console.error('   Details:', insertError.details);
    console.error('   Hint:', insertError.hint);
  } else {
    console.log('✅ INSERT OK:', insertData);
  }

  // Test 3: DELETE
  if (!insertError) {
    console.log('\n🗑️  Test 3: Deleting test product...');
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', 'test-product-abc123');

    if (deleteError) {
      console.error('❌ DELETE FAILED:', deleteError.message);
    } else {
      console.log('✅ DELETE OK — test product removed');
    }
  }

  console.log('\n--- DIAGNOSIS ---');
  if (insertError) {
    console.log('PROBLEM: Write operations are failing.');
    console.log('CAUSE: RLS (Row Level Security) policies are blocking anonymous writes.');
    console.log('FIX: Run the SQL policy fix in Supabase SQL Editor.');
  } else {
    console.log('All operations successful! The Supabase connection is working correctly.');
  }
}

testWriteAndDelete();
