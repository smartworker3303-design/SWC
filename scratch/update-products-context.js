const fs = require('fs');

let content = fs.readFileSync('src/context/ProductsContext.tsx', 'utf8');

// 1. Add import
content = content.replace(
  'import { Product } from "../data";',
  'import { Product } from "../data";\nimport { setIndexedDBCache, getIndexedDBCache } from "../utils/indexedDB";'
);

// 2. Remove sync localStorage read
content = content.replace(/let initialCachedProducts: Product\[\] = \[\];[\s\S]*?hasInitialCache = true;\s*\}\s*\}\s*\} catch \{\}\s*\}/, `let initialCachedProducts: Product[] = [];
let hasInitialCache = false;`);

// 3. Update useEffect
const oldUseEffect = `  // Load products on mount with instant localStorage caching + background Supabase fetch
  useEffect(() => {
    let isMounted = true;

    // 1. Instant Cache Hydration — makes website load in 0ms on repeat visits
    try {
      const cached = localStorage.getItem("swc_products_catalog_cache_v2");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          setIsLoading(false);
        }
      }
    } catch {}

    // 2. Fetch fresh data from Supabase in background
    async function load() {
      if (isSupabaseConnected) {
        try {
          const dbProducts = await fetchSupabaseProducts();
          if (dbProducts !== null && isMounted) {
            setProducts(dbProducts);
            try {
              localStorage.setItem("swc_products_catalog_cache_v2", JSON.stringify(dbProducts));
            } catch {}
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn("Could not fetch products from Supabase:", err);
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [isSupabaseConnected]);`;

const newUseEffect = `  // Load products on mount with async IndexedDB caching + background Supabase fetch
  useEffect(() => {
    let isMounted = true;

    async function load() {
      // 1. Fast Cache Hydration
      let hasCache = false;
      try {
        const cached = await getIndexedDBCache("swc_products_catalog_cache_v3");
        if (cached && Array.isArray(cached) && cached.length > 0) {
          if (isMounted) {
            setProducts(cached);
            setIsLoading(false);
            hasCache = true;
          }
        }
      } catch (err) {
        console.warn("Failed to read cache", err);
      }

      // 2. Fetch fresh data from Supabase in background
      if (isSupabaseConnected) {
        try {
          const dbProducts = await fetchSupabaseProducts();
          if (dbProducts !== null && isMounted) {
            setProducts(dbProducts);
            setIsLoading(false);
            await setIndexedDBCache("swc_products_catalog_cache_v3", dbProducts);
            return;
          }
        } catch (err) {
          console.warn("Could not fetch products from Supabase:", err);
        }
      }

      if (isMounted && !hasCache) {
        setIsLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [isSupabaseConnected]);`;

content = content.replace(oldUseEffect, newUseEffect);

// 4. Update refreshProducts
content = content.replace(
  /localStorage\.setItem\("swc_products_catalog_cache_v2", JSON\.stringify\(dbProducts\)\);/g,
  `await setIndexedDBCache("swc_products_catalog_cache_v3", dbProducts);`
);

// 5. Update optimistic updates
content = content.replace(
  /localStorage\.setItem\("swc_products_catalog_cache_v2", JSON\.stringify\(nextAllProducts\)\);/g,
  `setIndexedDBCache("swc_products_catalog_cache_v3", nextAllProducts);`
);

// 6. Fix any stray localStorage (in case I missed any)
content = content.replace(/try\s*\{\s*localStorage\.setItem\("swc_products_catalog_cache_v2"[\s\S]*?catch\s*\{\}/g, '');

// Also default isLoading to true
content = content.replace(`useState(!hasInitialCache)`, `useState(true)`);

fs.writeFileSync('src/context/ProductsContext.tsx', content, 'utf8');
console.log('Replaced cache logic in ProductsContext.tsx');
