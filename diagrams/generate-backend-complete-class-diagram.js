const fs = require('fs');
const path = require('path');
const OUT_DIR = path.join(process.cwd(), 'diagrams', 'class');
fs.mkdirSync(OUT_DIR, { recursive: true });

const width = 5600;
const height = 3600;

const boxes = [
  {id:'legend', kind:'legend', x:80, y:80, w:300, h:240},

  {id:'AuthController', stereo:'controller', x:520, y:120, w:420, title:'AuthController', methods:['+ register(req,res)','+ login(req,res)','+ getMe(req,res)','+ updateProfile(req,res)','+ changePassword(req,res)']},
  {id:'CategoryController', stereo:'controller', x:1160, y:120, w:440, title:'CategoryController', methods:['+ getAll(req,res)','+ getById(req,res)','+ getBySlug(req,res)','+ create(req,res)','+ update(req,res)','+ delete(req,res)','+ getServices(req,res)']},
  {id:'ServiceController', stereo:'controller', x:1840, y:120, w:430, title:'ServiceController', methods:['+ getAll(req,res)','+ getById(req,res)','+ create(req,res)','+ update(req,res)','+ delete(req,res)','+ getByProvider(req,res)']},
  {id:'ProviderController', stereo:'controller', x:2500, y:120, w:520, title:'ProviderController', methods:['+ getAll(req,res)','+ getById(req,res)','+ getServices(req,res)','+ getReviews(req,res)','+ getCategories(req,res)','+ getMyProfile(req,res)','+ updateProfile(req,res)','+ updateAvailability(req,res)','+ toggleAvailability(req,res)','+ getDashboard(req,res)','+ getStats(req,res)','+ requestVerification(req,res)']},
  {id:'BookingController', stereo:'controller', x:3280, y:120, w:470, title:'BookingController', methods:['+ getMyBookings(req,res)','+ getAll(req,res)','+ getById(req,res)','+ create(req,res)','+ updateStatus(req,res)','+ cancel(req,res)']},
  {id:'ReviewController', stereo:'controller', x:4010, y:120, w:460, title:'ReviewController', methods:['+ getAll(req,res)','+ getByService(req,res)','+ getByProvider(req,res)','+ getByBooking(req,res)','+ create(req,res)','+ update(req,res)','+ delete(req,res)']},

  {id:'UserService', stereo:'service-module', x:420, y:1100, w:430, title:'UserService', methods:['+ listUsers(filters)','+ createUser(data, adminId?)','+ updateUser(id,data,adminId?)','+ verifyProvider(providerId, adminId)','+ deleteUser(userId, adminId?)','+ getUserById(userId)']},
  {id:'CategoryService', stereo:'service-module', x:1040, y:1100, w:420, title:'CategoryService', methods:['+ listCategories()','+ getCategoryById(id)','+ createCategory(data, adminId?)','+ updateCategory(id,data,adminId?)','+ deleteCategory(id, adminId?)']},
  {id:'ServiceService', stereo:'service-module', x:1640, y:1100, w:430, title:'ServiceService', methods:['+ listServices(filters)','+ getServiceById(id)','+ updateService(id,data,adminId?)','+ deleteService(id,adminId?)']},
  {id:'BookingService', stereo:'service-module', x:2260, y:1100, w:430, title:'BookingService', methods:['+ listBookings(filters)','+ getBookingById(id)','+ updateBooking(id,data,adminId?)','+ deleteBooking(id)','+ getBookingStats()']},
  {id:'PaymentService', stereo:'service-module', x:2870, y:1100, w:360, title:'PaymentService', methods:['+ processSubscriptionPayment(userId, amount, method, plan)']},
  {id:'NotificationService', stereo:'service-module', x:3410, y:1100, w:470, title:'NotificationService', methods:['+ createNotification(userId,title,message,...)','+ createFormattedNotification(recipient,...)','+ createStandardNotification(recipient,...)','- getNotificationTitle(action)']},
  {id:'EmailService', stereo:'service-class', x:4050, y:1100, w:430, title:'EmailService', methods:['+ sendWelcomeEmail(email, firstName)','+ sendBookingConfirmation(email, firstName, details)','+ sendBookingStatusUpdate(email, firstName, status, details)','+ sendPasswordReset(email, resetToken)']},
  {id:'NotificationFormatter', stereo:'utility', x:4660, y:1100, w:520, title:'NotificationFormatter', methods:['+ formatNotificationMessage(baseMessage, recipient, context?)','+ createStandardNotificationMessage(action, entity, recipient, context?)']},

  {id:'Role', stereo:'enumeration', x:120, y:2280, w:260, title:'Role', methods:['CLIENT','PRESTATAIRE','ADMIN']},
  {id:'PriceType', stereo:'enumeration', x:120, y:2580, w:260, title:'PriceType', methods:['FIXED','HOURLY','QUOTE']},
  {id:'BookingStatus', stereo:'enumeration', x:120, y:2900, w:300, title:'BookingStatus', methods:['PENDING','CONFIRMED','IN_PROGRESS','COMPLETED','CANCELLED','REJECTED']},
  {id:'PaymentStatus', stereo:'enumeration', x:120, y:3260, w:300, title:'PaymentStatus', methods:['PENDING','PAID','REFUNDED']},

  {id:'User', stereo:'entity', x:620, y:2140, w:430, title:'User', methods:['+ id: String','+ email: String','+ password: String','+ firstName: String','+ lastName: String','+ phone: String','+ role: Role','+ avatar: String?','+ bio: String?','+ specialization: String?','+ address: String?','+ zone: String?','+ latitude: Float?','+ longitude: Float?','+ isVerified: Boolean','+ isActive: Boolean']},
  {id:'ProviderProfile', stereo:'entity', x:1310, y:2140, w:500, title:'ProviderProfile', methods:['+ id: String','+ userId: String','+ businessName: String?','+ specialty: String?','+ hourlyRate: Decimal?','+ location: String?','+ serviceRadius: Int?','+ isAvailable: Boolean','+ rating: Decimal','+ totalReviews: Int','+ totalBookings: Int']},
  {id:'Category', stereo:'entity', x:2050, y:2140, w:390, title:'Category', methods:['+ id: String','+ name: String','+ slug: String','+ description: String?','+ icon: String?','+ image: String?','+ parentId: String?','+ displayOrder: Int']},
  {id:'Service', stereo:'entity', x:2670, y:2140, w:420, title:'Service', methods:['+ id: String','+ providerId: String','+ categoryId: String?','+ name: String','+ description: String?','+ price: Decimal','+ priceType: PriceType','+ duration: Int?','+ isActive: Boolean']},
  {id:'Booking', stereo:'entity', x:3320, y:2140, w:440, title:'Booking', methods:['+ id: String','+ clientId: String','+ serviceId: String','+ bookingDate: DateTime','+ bookingTime: String','+ duration: Int','+ status: BookingStatus','+ address: String','+ city: String','+ phone: String?','+ notes: String?','+ totalAmount: Decimal?','+ paymentStatus: PaymentStatus']},
  {id:'Review', stereo:'entity', x:3990, y:2140, w:390, title:'Review', methods:['+ id: String','+ bookingId: String','+ clientId: String','+ providerId: String','+ serviceId: String?','+ rating: Int','+ comment: String?','+ isVerified: Boolean']},
  {id:'Payment', stereo:'entity', x:4610, y:2140, w:360, title:'Payment', methods:['+ id: String','+ bookingId: String?','+ userId: String','+ amount: Decimal','+ paymentMethod: String?','+ status: PaymentStatus','+ transactionId: String?']},

  {id:'VerificationRequest', stereo:'entity', x:900, y:3020, w:430, title:'VerificationRequest', methods:['+ id: String','+ userId: String','+ documents: Json?','+ status: String','+ reviewedBy: String?','+ reviewedAt: DateTime?']},
  {id:'Subscription', stereo:'entity', x:1720, y:3020, w:380, title:'Subscription', methods:['+ id: String','+ userId: String','+ plan: String','+ status: String','+ startDate: DateTime','+ endDate: DateTime','+ subscriptionPlanId: String?']},
  {id:'SubscriptionPlan', stereo:'entity', x:2440, y:3020, w:430, title:'SubscriptionPlan', methods:['+ id: String','+ name: String','+ slug: String','+ price: Decimal','+ duration: Int','+ features: Json','+ isActive: Boolean','+ displayOrder: Int']},
  {id:'Notification', stereo:'entity', x:3210, y:3020, w:410, title:'Notification', methods:['+ id: String','+ userId: String','+ title: String','+ message: String','+ type: String','+ read: Boolean','+ link: String?']}
];

const boxMap = Object.fromEntries(boxes.map(b => [b.id,b]));

const entityRelations = [
  {a:'User', b:'ProviderProfile', type:'association', m1:'1', m2:'0..1'},
  {a:'User', b:'Booking', type:'association', m1:'1', m2:'0..*'},
  {a:'User', b:'Review', type:'association', m1:'1', m2:'0..*'},
  {a:'User', b:'Payment', type:'association', m1:'1', m2:'0..*'},
  {a:'User', b:'VerificationRequest', type:'association', m1:'1', m2:'0..*', sides:['bottom','top']},
  {a:'User', b:'Subscription', type:'association', m1:'1', m2:'0..*', sides:['bottom','top']},
  {a:'User', b:'Notification', type:'association', m1:'1', m2:'0..*', sides:['bottom','top']},
  {a:'ProviderProfile', b:'Service', type:'association', m1:'1', m2:'0..*'},
  {a:'ProviderProfile', b:'Review', type:'association', m1:'1', m2:'0..*'},
  {a:'Category', b:'Category', type:'self-association', m1:'parent 0..1', m2:'children 0..*'},
  {a:'Category', b:'Service', type:'association', m1:'1', m2:'0..*'},
  {a:'Service', b:'Booking', type:'association', m1:'1', m2:'0..*'},
  {a:'Service', b:'Review', type:'association', m1:'0..1', m2:'0..*'},
  {a:'Booking', b:'Review', type:'composition', m1:'1', m2:'0..1'},
  {a:'Booking', b:'Payment', type:'association', m1:'1', m2:'0..*'},
  {a:'SubscriptionPlan', b:'Subscription', type:'association', m1:'1', m2:'0..*'}
];

const dependencies = [
  {from:'AuthController', to:'User'}, {from:'AuthController', to:'ProviderProfile'}, {from:'AuthController', to:'Role'},
  {from:'CategoryController', to:'Category'}, {from:'CategoryController', to:'Service'},
  {from:'ServiceController', to:'Service'}, {from:'ServiceController', to:'Category'}, {from:'ServiceController', to:'ProviderProfile'}, {from:'ServiceController', to:'Review'}, {from:'ServiceController', to:'PriceType'},
  {from:'ProviderController', to:'ProviderProfile'}, {from:'ProviderController', to:'Service'}, {from:'ProviderController', to:'Review'}, {from:'ProviderController', to:'Booking'}, {from:'ProviderController', to:'VerificationRequest'},
  {from:'BookingController', to:'Booking'}, {from:'BookingController', to:'Service'}, {from:'BookingController', to:'User'}, {from:'BookingController', to:'NotificationService'},
  {from:'ReviewController', to:'Review'}, {from:'ReviewController', to:'Booking'}, {from:'ReviewController', to:'ProviderProfile'}, {from:'ReviewController', to:'Service'},

  {from:'UserService', to:'User'}, {from:'UserService', to:'ProviderProfile'}, {from:'UserService', to:'Booking'}, {from:'UserService', to:'NotificationService'}, {from:'UserService', to:'NotificationFormatter'},
  {from:'CategoryService', to:'Category'}, {from:'CategoryService', to:'NotificationService'},
  {from:'ServiceService', to:'Service'}, {from:'ServiceService', to:'Category'}, {from:'ServiceService', to:'NotificationService'},
  {from:'BookingService', to:'Booking'}, {from:'BookingService', to:'Review'}, {from:'BookingService', to:'Service'}, {from:'BookingService', to:'NotificationService'},
  {from:'PaymentService', to:'Payment'}, {from:'PaymentService', to:'User'}, {from:'PaymentService', to:'NotificationService'},
  {from:'NotificationService', to:'Notification'}, {from:'NotificationService', to:'NotificationFormatter'},
  {from:'EmailService', to:'Booking'}, {from:'EmailService', to:'User'}
];

const enumDeps = [
  {from:'User', to:'Role'},
  {from:'Service', to:'PriceType'},
  {from:'Booking', to:'BookingStatus'},
  {from:'Booking', to:'PaymentStatus'},
  {from:'Payment', to:'PaymentStatus'}
];

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function boxHeight(b){ return b.kind==='legend' ? b.h : 72 + b.methods.length*26 + 24; }
function center(b){ return {x:b.x + b.w/2, y:b.y + boxHeight(b)/2}; }
function anchor(b, side, shift=0){ const h=boxHeight(b); if(side==='left') return {x:b.x, y:b.y + h/2 + shift}; if(side==='right') return {x:b.x+b.w, y:b.y+h/2+shift}; if(side==='top') return {x:b.x+b.w/2+shift, y:b.y}; return {x:b.x+b.w/2+shift, y:b.y+h}; }
function chooseSides(a,b){ if(a.id===b.id) return ['right','right']; const ca=center(a), cb=center(b); const dx=cb.x-ca.x, dy=cb.y-ca.y; if(Math.abs(dx)>Math.abs(dy)) return dx>0?['right','left']:['left','right']; return dy>0?['bottom','top']:['top','bottom']; }
function classBox(b){
  if(b.kind==='legend'){
    return `
    <g>
      <rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" class="legend"/>
      <text x="${b.x+20}" y="${b.y+35}" class="legendTitle">Legend</text>
      <line x1="${b.x+18}" y1="${b.y+70}" x2="${b.x+108}" y2="${b.y+70}" class="assoc"/><text x="${b.x+125}" y="${b.y+76}" class="legendText">Association</text>
      <line x1="${b.x+18}" y1="${b.y+108}" x2="${b.x+108}" y2="${b.y+108}" class="dep"/><text x="${b.x+125}" y="${b.y+114}" class="legendText">Dependency</text>
      <line x1="${b.x+18}" y1="${b.y+146}" x2="${b.x+108}" y2="${b.y+146}" class="assoc"/><polygon points="${b.x+18},${b.y+146} ${b.x+6},${b.y+134} ${b.x-6},${b.y+146} ${b.x+6},${b.y+158}" class="filledDiamond"/><text x="${b.x+125}" y="${b.y+152}" class="legendText">Composition</text>
      <text x="${b.x+20}" y="${b.y+198}" class="legendText">Stereotypes: &lt;&lt;controller&gt;&gt;, &lt;&lt;service&gt;&gt;, &lt;&lt;entity&gt;&gt;</text>
    </g>`;
  }
  const h = boxHeight(b);
  const stereo = `<<${b.stereo}>>`;
  const attrs = b.methods.map((m,i)=>`<text x="${b.x+16}" y="${b.y+102+i*26}" class="attr">${esc(m)}</text>`).join('\n');
  return `
  <g>
    <rect x="${b.x}" y="${b.y}" width="${b.w}" height="${h}" class="box ${b.stereo.includes('entity')||b.stereo==='enumeration' ? 'domain' : ''}"/>
    <line x1="${b.x}" y1="${b.y+58}" x2="${b.x+b.w}" y2="${b.y+58}" class="sep"/>
    <line x1="${b.x}" y1="${b.y+h-36}" x2="${b.x+b.w}" y2="${b.y+h-36}" class="sep"/>
    <text x="${b.x+b.w/2}" y="${b.y+24}" class="stereo">${esc(stereo)}</text>
    <text x="${b.x+b.w/2}" y="${b.y+50}" class="title">${esc(b.title)}</text>
    ${attrs}
  </g>`;
}
function arrowHead(x1,y1,x2,y2){ const a=Math.atan2(y2-y1,x2-x1), s=11; const p1=[x2-s*Math.cos(a-Math.PI/6), y2-s*Math.sin(a-Math.PI/6)]; const p2=[x2-s*Math.cos(a+Math.PI/6), y2-s*Math.sin(a+Math.PI/6)]; return `<path d="M ${p1[0]} ${p1[1]} L ${x2} ${y2} L ${p2[0]} ${p2[1]}" class="dep"/>`; }
function filledDiamond(x,y,side){ const s=12; let pts; if(side==='right') pts=[[x,y],[x-s,y-s],[x-2*s,y],[x-s,y+s]]; else if(side==='left') pts=[[x,y],[x+s,y-s],[x+2*s,y],[x+s,y+s]]; else if(side==='top') pts=[[x,y],[x-s,y+s],[x,y+2*s],[x+s,y+s]]; else pts=[[x,y],[x-s,y-s],[x,y-2*s],[x+s,y-s]]; return `<polygon points="${pts.map(p=>p.join(',')).join(' ')}" class="filledDiamond"/>`; }
function selfAssoc(r){ const c=boxMap[r.a]; const x=c.x+c.w, y=c.y+120; return `<path d="M ${x} ${y} C ${x+130} ${y}, ${x+130} ${y+170}, ${x} ${y+170}" class="assoc"/><text x="${x+16}" y="${y-10}" class="mult">${esc(r.m1)}</text><text x="${x+16}" y="${y+192}" class="mult">${esc(r.m2)}</text><text x="${x+36}" y="${y+82}" class="rtype">${esc(r.type)}</text>`; }
function relationLine(r, idx){ if(r.type==='self-association') return selfAssoc(r); const a=boxMap[r.a], b=boxMap[r.b]; const sides=r.sides||chooseSides(a,b); const shift=(idx%3-1)*18; const p1=anchor(a,sides[0], (sides[0]==='top'||sides[0]==='bottom')?shift:0); const p2=anchor(b,sides[1], (sides[1]==='top'||sides[1]==='bottom')?-shift:0); const line=`<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" class="assoc"/>`; const extra=r.type==='composition'?filledDiamond(p1.x,p1.y,sides[0]):''; const mx=(p1.x+p2.x)/2, my=(p1.y+p2.y)/2; const typeLabel=`<text x="${mx+10}" y="${my-8}" class="rtype">${esc(r.type)}</text>`; const m1=`<text x="${p1.x + (sides[0]==='left'?-58:12)}" y="${p1.y - 10}" class="mult">${esc(r.m1)}</text>`; const m2=`<text x="${p2.x + (sides[1]==='left'?-58:12)}" y="${p2.y - 10}" class="mult">${esc(r.m2)}</text>`; return `${line}\n${extra}\n${typeLabel}\n${m1}\n${m2}`; }
function depLine(d, idx){ const a=boxMap[d.from], b=boxMap[d.to]; const sides=chooseSides(a,b); const shift=(idx%2===0?0:22); const p1=anchor(a,sides[0], (sides[0]==='top'||sides[0]==='bottom')?shift:0); const p2=anchor(b,sides[1], (sides[1]==='top'||sides[1]==='bottom')?-shift:0); const labelX=(p1.x+p2.x)/2+8, labelY=(p1.y+p2.y)/2-6; return `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" class="dep"/>\n${arrowHead(p1.x,p1.y,p2.x,p2.y)}\n<text x="${labelX}" y="${labelY}" class="rtype">&lt;&lt;dependency&gt;&gt;</text>`; }

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#ececec" stroke-width="1"/>
    </pattern>
  </defs>
  <style>
    text { font-family: Arial, Helvetica, sans-serif; fill: #111; }
    .box { fill:#fff; stroke:#666; stroke-width:2; }
    .box.domain { fill:#fcfcfc; }
    .legend { fill:#fff; stroke:#666; stroke-width:2; }
    .sep { stroke:#666; stroke-width:1.6; }
    .stereo { font-size:18px; font-style:italic; text-anchor:middle; fill:#444; }
    .title { font-size:24px; font-weight:700; text-anchor:middle; }
    .attr { font-size:20px; }
    .assoc { stroke:#111; stroke-width:1.8; fill:none; }
    .dep { stroke:#555; stroke-width:1.5; stroke-dasharray:8 7; fill:none; }
    .filledDiamond { fill:#111; stroke:#111; stroke-width:1.5; }
    .mult { font-size:19px; font-weight:600; }
    .rtype { font-size:16px; fill:#444; font-style:italic; }
    .legendTitle { font-size:22px; font-weight:700; }
    .legendText { font-size:18px; }
    .section { font-size:30px; font-weight:700; fill:#555; }
  </style>
  <rect width="100%" height="100%" fill="#fafafa"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <text x="650" y="70" class="section">Controllers Layer</text>
  <text x="520" y="1050" class="section">Services And Utilities</text>
  <text x="560" y="2080" class="section">Domain Model</text>
  ${entityRelations.map(relationLine).join('\n')}
  ${dependencies.map(depLine).join('\n')}
  ${enumDeps.map(depLine).join('\n')}
  ${boxes.map(classBox).join('\n')}
</svg>`;

fs.writeFileSync(path.join(OUT_DIR, 'kaayjob-backend-complete-class-diagram.svg'), svg, 'utf8');
console.log(path.join(OUT_DIR, 'kaayjob-backend-complete-class-diagram.svg'));
