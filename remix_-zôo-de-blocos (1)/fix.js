const fs = require('fs');
let content = fs.readFileSync('src/components/Admin/AdminDashboard.tsx', 'utf8');
content = content.replace(/<label className="text-\[10px\] font-black uppercase text-text-secondary\s+<div className="flex items-center justify-between ml-4">/, '                                <div className="flex items-center justify-between ml-4">');
fs.writeFileSync('src/components/Admin/AdminDashboard.tsx', content);
