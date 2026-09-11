const fs = require('fs');
const filepath = 'c:\\\\Users\\\\hp\\\\Desktop\\\\SWC\\\\src\\\\app\\\\product\\\\[id]\\\\page.tsx';
let content = fs.readFileSync(filepath, 'utf8');

const startMarker = '      {/* Customer Reviews Section */}';
const endMarker = '      {/* Related Products Grid */}';

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const oldReviews = content.substring(startIdx, endIdx);
    content = content.substring(0, startIdx) + content.substring(endIdx);

    const insertMarker = '        </div>\r\n\r\n        {/* Right Details Column */}';
    let insertIdx = content.indexOf(insertMarker);
    if (insertIdx === -1) {
        insertIdx = content.indexOf('        </div>\n\n        {/* Right Details Column */}');
    }

    if (insertIdx !== -1) {
        const newReviews = `
          {/* Customer Reviews Section */}
          {product.customerReviews && product.customerReviews.length > 0 && (
            <div className="pt-8 space-y-6">
              <div className="text-left space-y-1 border-b border-gray-900 pb-2">
                 <p className="text-gold-500 text-[10px] tracking-widest uppercase font-semibold">Client Endorsements</p>
                 <h2 className="font-serif text-xl font-bold">Customer Reviews (Admin Override)</h2>
              </div>
              <div className="flex flex-col gap-4">
                {product.customerReviews.map((review) => (
                  <div key={review.id} className="glass-panel p-5 text-left flex flex-col space-y-3 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                          {review.name}
                          {review.verified && <span className="bg-gold-500/20 text-gold-400 text-[8px] px-1.5 py-0.5 rounded border border-gold-500/30">Verified</span>}
                        </h4>
                        <p className="text-[9px] text-gray-500">{review.date}</p>
                      </div>
                      <div className="flex text-gold-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={\`w-3 h-3 \${i < review.rating ? 'fill-gold-500' : 'text-gray-700'}\`} />
                        ))}
                      </div>
                    </div>
                    {review.title && <h5 className="font-serif font-bold text-gold-400 text-xs">{review.title}</h5>}
                    <p className="text-gray-300 text-xs italic leading-relaxed">&quot;{review.text}&quot;</p>
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 pt-2 mt-auto">
                        {review.images.map((img, idx) => (
                          <div key={idx} className="relative w-10 h-10 border border-gold-500/20 rounded overflow-hidden">
                            <Image src={img} alt="Review image" fill className="object-cover" sizes="40px" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
`;
        content = content.substring(0, insertIdx) + newReviews + content.substring(insertIdx);
        fs.writeFileSync(filepath, content, 'utf8');
        console.log('Successfully moved reviews section');
    } else {
        console.log('Failed to find insert marker');
    }
} else {
    console.log('Failed to find old reviews section markers');
}
