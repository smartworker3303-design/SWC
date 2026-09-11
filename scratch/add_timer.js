const fs = require('fs');
const filepath = 'src/app/product/[id]/page.tsx';
let content = fs.readFileSync(filepath, 'utf8');

const targetStr = '            </div>\r\n            \r\n            {/* Wishlist Button */}';
const targetStr2 = '            </div>\n            \n            {/* Wishlist Button */}';

const replacementStr = `            </div>
            
            {getActiveDiscount(product).isTimerActive && getActiveDiscount(product).expiresAt && (
              <div className="pt-2 sm:pt-0 sm:ml-auto">
                <CountdownTimer 
                  expiresAt={getActiveDiscount(product).expiresAt} 
                  onExpire={() => window.location.reload()} 
                />
              </div>
            )}
            
            {/* Wishlist Button */}`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacementStr);
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Replaced using CRLF');
} else if (content.includes(targetStr2)) {
    content = content.replace(targetStr2, replacementStr);
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Replaced using LF');
} else {
    console.log('Target string not found!');
}
