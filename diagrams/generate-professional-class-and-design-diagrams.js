const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(process.cwd(), 'diagrams', 'class');
fs.mkdirSync(OUT_DIR, { recursive: true });

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function boxHeight(box) {
  const lineHeight = box.type === 'enum' ? 28 : 24;
  const header = box.stereotype ? 68 : 56;
  const divider = 16;
  return header + divider + box.lines.length * lineHeight + 24;
}

function drawBox(box, opts = {}) {
  const h = boxHeight(box);
  const lineHeight = box.type === 'enum' ? 28 : 24;
  const titleY = box.stereotype ? box.y + 26 : box.y + 34;
  const nameY = box.stereotype ? box.y + 52 : box.y + 34;
  const dividerY = box.stereotype ? box.y + 70 : box.y + 58;
  const linesY = dividerY + 28;
  const domainClass = opts.domainClass || '';

  const stereo = box.stereotype
    ? `<text x="${box.x + box.w / 2}" y="${titleY}" class="stereotype">&lt;&lt;${esc(box.stereotype)}&gt;&gt;</text>`
    : '';

  return `
  <g>
    <rect x="${box.x}" y="${box.y}" width="${box.w}" height="${h}" class="uml-box ${box.type || 'class'} ${domainClass}"/>
    <line x1="${box.x}" y1="${dividerY}" x2="${box.x + box.w}" y2="${dividerY}" class="uml-sep"/>
    ${stereo}
    <text x="${box.x + box.w / 2}" y="${nameY}" class="uml-title">${esc(box.name)}</text>
    ${box.lines.map((line, i) => `<text x="${box.x + 16}" y="${linesY + i * lineHeight}" class="uml-line">${esc(line)}</text>`).join('\n')}
  </g>`;
}

function center(box) {
  return { x: box.x + box.w / 2, y: box.y + boxHeight(box) / 2 };
}

function anchor(box, side, shift = 0) {
  const h = boxHeight(box);
  switch (side) {
    case 'left':
      return { x: box.x, y: box.y + h / 2 + shift };
    case 'right':
      return { x: box.x + box.w, y: box.y + h / 2 + shift };
    case 'top':
      return { x: box.x + box.w / 2 + shift, y: box.y };
    default:
      return { x: box.x + box.w / 2 + shift, y: box.y + h };
  }
}

function chooseSides(a, b) {
  const ca = center(a);
  const cb = center(b);
  const dx = cb.x - ca.x;
  const dy = cb.y - ca.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx >= 0 ? ['right', 'left'] : ['left', 'right'];
  }
  return dy >= 0 ? ['bottom', 'top'] : ['top', 'bottom'];
}

function lineLabelPosition(p1, p2, dx = 12, dy = -10) {
  return { x: (p1.x + p2.x) / 2 + dx, y: (p1.y + p2.y) / 2 + dy };
}

function arrowHead(x1, y1, x2, y2, className = 'dep-arrow', size = 11) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const p1x = x2 - size * Math.cos(angle - Math.PI / 6);
  const p1y = y2 - size * Math.sin(angle - Math.PI / 6);
  const p2x = x2 - size * Math.cos(angle + Math.PI / 6);
  const p2y = y2 - size * Math.sin(angle + Math.PI / 6);
  return `<path d="M ${p1x} ${p1y} L ${x2} ${y2} L ${p2x} ${p2y}" class="${className}"/>`;
}

function diamond(x, y, side, filled = false, size = 12) {
  let pts;
  if (side === 'right') pts = [[x, y], [x - size, y - size], [x - 2 * size, y], [x - size, y + size]];
  else if (side === 'left') pts = [[x, y], [x + size, y - size], [x + 2 * size, y], [x + size, y + size]];
  else if (side === 'top') pts = [[x, y], [x - size, y + size], [x, y + 2 * size], [x + size, y + size]];
  else pts = [[x, y], [x - size, y - size], [x, y - 2 * size], [x + size, y - size]];
  return `<polygon points="${pts.map((p) => p.join(',')).join(' ')}" class="${filled ? 'diamond-filled' : 'diamond-open'}"/>`;
}

function multText(x, y, text, side) {
  const dx = side === 'left' ? -60 : 12;
  const dy = side === 'bottom' ? 20 : -10;
  return `<text x="${x + dx}" y="${y + dy}" class="mult">${esc(text)}</text>`;
}

function relationSvg(rel, map, index) {
  if (rel.type === 'self') {
    const box = map[rel.from];
    const x = box.x + box.w;
    const y = box.y + 92;
    return `
    <path d="M ${x} ${y} C ${x + 150} ${y}, ${x + 150} ${y + 180}, ${x} ${y + 180}" class="assoc-line"/>
    <text x="${x + 20}" y="${y - 10}" class="mult">${esc(rel.m1)}</text>
    <text x="${x + 20}" y="${y + 205}" class="mult">${esc(rel.m2)}</text>
    <text x="${x + 32}" y="${y + 92}" class="rel-type">${esc(rel.label || 'association')}</text>`;
  }

  const a = map[rel.from];
  const b = map[rel.to];
  const sides = rel.sides || chooseSides(a, b);
  const shift = rel.shift != null ? rel.shift : ((index % 3) - 1) * 18;
  const s1 = sides[0];
  const s2 = sides[1];
  const p1 = anchor(a, s1, s1 === 'top' || s1 === 'bottom' ? shift : 0);
  const p2 = anchor(b, s2, s2 === 'top' || s2 === 'bottom' ? -shift : 0);

  if (rel.type === 'dependency' || rel.type === 'navigable') {
    const klass = rel.type === 'dependency' ? 'dep-line' : 'nav-line';
    const label = rel.label ? `<text x="${lineLabelPosition(p1, p2, 10, -8).x}" y="${lineLabelPosition(p1, p2, 10, -8).y}" class="rel-type">${esc(rel.label)}</text>` : '';
    return `
    <line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" class="${klass}"/>
    ${arrowHead(p1.x, p1.y, p2.x, p2.y, rel.type === 'dependency' ? 'dep-arrow' : 'nav-arrow')}
    ${label}`;
  }

  const line = `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" class="assoc-line"/>`;
  const diamondSvg = rel.type === 'composition'
    ? diamond(p1.x, p1.y, s1, true)
    : rel.type === 'aggregation'
      ? diamond(p1.x, p1.y, s1, false)
      : '';
  const labelPos = lineLabelPosition(p1, p2, 12, -8);
  const label = rel.label ? `<text x="${labelPos.x}" y="${labelPos.y}" class="rel-type">${esc(rel.label)}</text>` : '';
  return `
  ${line}
  ${diamondSvg}
  ${rel.m1 ? multText(p1.x, p1.y, rel.m1, s1) : ''}
  ${rel.m2 ? multText(p2.x, p2.y, rel.m2, s2) : ''}
  ${label}`;
}

function packageFrame(pkg) {
  return `
  <g>
    <rect x="${pkg.x}" y="${pkg.y}" width="${pkg.w}" height="${pkg.h}" class="package-frame"/>
    <text x="${pkg.x + 18}" y="${pkg.y + 32}" class="package-title">${esc(pkg.title)}</text>
  </g>`;
}

function renderDiagram({ width, height, title, subtitle, frames = [], boxes, relations, domainClass = '' }) {
  const map = Object.fromEntries(boxes.map((b) => [b.name, b]));
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#ececec" stroke-width="1"/>
    </pattern>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="8" dy="8" stdDeviation="4" flood-color="#c9c9c9" flood-opacity="0.35"/>
    </filter>
  </defs>
  <style>
    text { font-family: Arial, Helvetica, sans-serif; fill: #111; }
    .main-title { font-size: 42px; font-weight: 700; }
    .sub-title { font-size: 20px; fill: #555; }
    .uml-box { fill: #fff; stroke: #202020; stroke-width: 2; filter: url(#shadow); }
    .uml-box.enum { fill: #fbfbfb; }
    .uml-box.domain { fill: #fcfcfc; }
    .uml-sep { stroke: #202020; stroke-width: 1.7; }
    .uml-title { font-size: 24px; font-weight: 700; text-anchor: middle; }
    .stereotype { font-size: 18px; font-style: italic; text-anchor: middle; fill: #4a4a4a; }
    .uml-line { font-size: 19px; }
    .assoc-line { stroke: #121212; stroke-width: 2.1; fill: none; }
    .dep-line { stroke: #555; stroke-width: 1.9; stroke-dasharray: 9 7; fill: none; }
    .nav-line { stroke: #254d7a; stroke-width: 2; stroke-dasharray: 7 5; fill: none; }
    .dep-arrow { stroke: #555; stroke-width: 1.9; fill: none; }
    .nav-arrow { stroke: #254d7a; stroke-width: 2; fill: none; }
    .diamond-open { fill: #fff; stroke: #121212; stroke-width: 1.8; }
    .diamond-filled { fill: #121212; stroke: #121212; stroke-width: 1.8; }
    .mult { font-size: 18px; font-weight: 600; }
    .rel-type { font-size: 16px; font-style: italic; fill: #444; }
    .package-frame { fill: rgba(255,255,255,0.78); stroke: #7b7b7b; stroke-width: 2; }
    .package-title { font-size: 24px; font-weight: 700; fill: #3c3c3c; }
  </style>
  <rect width="100%" height="100%" fill="#fafafa"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <text x="90" y="70" class="main-title">${esc(title)}</text>
  <text x="90" y="102" class="sub-title">${esc(subtitle)}</text>
  ${frames.map(packageFrame).join('\n')}
  ${relations.map((rel, idx) => relationSvg(rel, map, idx)).join('\n')}
  ${boxes.map((box) => drawBox(box, { domainClass })).join('\n')}
</svg>`;
}

const domainBoxes = [
  { name: 'Role', type: 'enum', x: 90, y: 220, w: 250, lines: ['CLIENT', 'PRESTATAIRE', 'ADMIN'] },
  { name: 'PriceType', type: 'enum', x: 90, y: 460, w: 250, lines: ['FIXED', 'HOURLY', 'QUOTE'] },
  { name: 'BookingStatus', type: 'enum', x: 90, y: 720, w: 320, lines: ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED'] },
  { name: 'PaymentStatus', type: 'enum', x: 90, y: 1080, w: 300, lines: ['PENDING', 'PAID', 'REFUNDED'] },

  { name: 'User', x: 560, y: 220, w: 560, lines: ['+ id: String', '+ email: String', '+ password: String', '+ firstName: String', '+ lastName: String', '+ phone: String', '+ role: Role', '+ avatar: String?', '+ bio: String?', '+ specialization: String?', '+ address: String?', '+ zone: String?', '+ latitude: Float?', '+ longitude: Float?', '+ isVerified: Boolean', '+ isActive: Boolean', '+ createdAt: DateTime', '+ updatedAt: DateTime'] },
  { name: 'ProviderProfile', x: 1420, y: 220, w: 610, lines: ['+ id: String', '+ userId: String', '+ businessName: String?', '+ specialty: String?', '+ bio: String?', '+ hourlyRate: Decimal?', '+ yearsExperience: Int?', '+ location: String?', '+ address: String?', '+ city: String?', '+ region: String?', '+ postalCode: String?', '+ serviceRadius: Int?', '+ isAvailable: Boolean', '+ rating: Decimal', '+ totalReviews: Int', '+ totalBookings: Int', '+ isVerified: Boolean', '+ profileImage: String?', '+ specialties: Json?', '+ availability: Json?', '+ createdAt: DateTime', '+ updatedAt: DateTime'] },
  { name: 'Category', x: 2320, y: 220, w: 500, lines: ['+ id: String', '+ name: String', '+ slug: String', '+ description: String?', '+ icon: String?', '+ image: String?', '+ isActive: Boolean', '+ displayOrder: Int', '+ parentId: String?', '+ createdAt: DateTime'] },
  { name: 'Service', x: 3120, y: 220, w: 530, lines: ['+ id: String', '+ providerId: String', '+ categoryId: String?', '+ name: String', '+ description: String?', '+ price: Decimal', '+ priceType: PriceType', '+ duration: Int?', '+ isActive: Boolean', '+ createdAt: DateTime', '+ updatedAt: DateTime'] },

  { name: 'Booking', x: 820, y: 1450, w: 580, lines: ['+ id: String', '+ clientId: String', '+ serviceId: String', '+ bookingDate: DateTime', '+ bookingTime: String', '+ duration: Int', '+ status: BookingStatus', '+ address: String', '+ city: String', '+ phone: String?', '+ notes: String?', '+ totalAmount: Decimal?', '+ paymentStatus: PaymentStatus', '+ createdAt: DateTime', '+ updatedAt: DateTime'] },
  { name: 'Review', x: 1740, y: 1450, w: 500, lines: ['+ id: String', '+ bookingId: String', '+ clientId: String', '+ providerId: String', '+ serviceId: String?', '+ rating: Int', '+ comment: String?', '+ isVerified: Boolean', '+ createdAt: DateTime', '+ updatedAt: DateTime'] },
  { name: 'Payment', x: 2570, y: 1450, w: 470, lines: ['+ id: String', '+ bookingId: String?', '+ userId: String', '+ amount: Decimal', '+ paymentMethod: String?', '+ status: PaymentStatus', '+ transactionId: String?', '+ createdAt: DateTime'] },

  { name: 'VerificationRequest', x: 420, y: 2630, w: 520, lines: ['+ id: String', '+ userId: String', '+ documents: Json?', '+ status: String', '+ reviewedBy: String?', '+ reviewedAt: DateTime?', '+ createdAt: DateTime'] },
  { name: 'Subscription', x: 1380, y: 2630, w: 470, lines: ['+ id: String', '+ userId: String', '+ plan: String', '+ status: String', '+ startDate: DateTime', '+ endDate: DateTime', '+ subscriptionPlanId: String?', '+ createdAt: DateTime'] },
  { name: 'SubscriptionPlan', x: 2240, y: 2630, w: 540, lines: ['+ id: String', '+ name: String', '+ slug: String', '+ description: String?', '+ price: Decimal', '+ duration: Int', '+ features: Json', '+ isActive: Boolean', '+ displayOrder: Int', '+ createdAt: DateTime', '+ updatedAt: DateTime'] },
  { name: 'Notification', x: 3150, y: 2630, w: 470, lines: ['+ id: String', '+ userId: String', '+ title: String', '+ message: String', '+ type: String', '+ read: Boolean', '+ link: String?', '+ createdAt: DateTime'] },
];

const domainRelations = [
  { from: 'User', to: 'ProviderProfile', type: 'composition', m1: '1', m2: '0..1', label: 'compose' },
  { from: 'User', to: 'Booking', type: 'association', m1: '1', m2: '0..*', label: 'clientBookings' },
  { from: 'User', to: 'Review', type: 'association', m1: '1', m2: '0..*', label: 'reviews', sides: ['bottom', 'top'], shift: -120 },
  { from: 'User', to: 'Payment', type: 'association', m1: '1', m2: '0..*', label: 'payments', sides: ['bottom', 'top'], shift: 80 },
  { from: 'User', to: 'VerificationRequest', type: 'association', m1: '1', m2: '0..*', label: 'requests', sides: ['bottom', 'top'], shift: -180 },
  { from: 'User', to: 'VerificationRequest', type: 'association', m1: '0..1', m2: '0..*', label: 'reviews', sides: ['left', 'top'], shift: 24 },
  { from: 'User', to: 'Subscription', type: 'association', m1: '1', m2: '0..*', label: 'subscriptions', sides: ['bottom', 'top'], shift: 10 },
  { from: 'User', to: 'Notification', type: 'association', m1: '1', m2: '0..*', label: 'notifications', sides: ['bottom', 'top'], shift: 190 },

  { from: 'ProviderProfile', to: 'Service', type: 'composition', m1: '1', m2: '0..*', label: 'services' },
  { from: 'ProviderProfile', to: 'Review', type: 'association', m1: '1', m2: '0..*', label: 'providerReviews' },

  { from: 'Category', to: 'Category', type: 'self', m1: 'parent 0..1', m2: 'children 0..*', label: 'hiérarchie' },
  { from: 'Category', to: 'Service', type: 'association', m1: '1', m2: '0..*', label: 'services' },

  { from: 'Service', to: 'Booking', type: 'association', m1: '1', m2: '0..*', label: 'bookings' },
  { from: 'Service', to: 'Review', type: 'association', m1: '0..1', m2: '0..*', label: 'reviews', sides: ['bottom', 'top'], shift: 120 },

  { from: 'Booking', to: 'Review', type: 'composition', m1: '1', m2: '0..1', label: 'review' },
  { from: 'Booking', to: 'Payment', type: 'association', m1: '1', m2: '0..*', label: 'payments' },

  { from: 'SubscriptionPlan', to: 'Subscription', type: 'aggregation', m1: '1', m2: '0..*', label: 'subscriptions' },

  { from: 'User', to: 'Role', type: 'dependency', label: 'typed by' },
  { from: 'Service', to: 'PriceType', type: 'dependency', label: 'typed by' },
  { from: 'Booking', to: 'BookingStatus', type: 'dependency', label: 'typed by' },
  { from: 'Booking', to: 'PaymentStatus', type: 'dependency', label: 'typed by', sides: ['left', 'right'], shift: 20 },
  { from: 'Payment', to: 'PaymentStatus', type: 'dependency', label: 'typed by' },
];

const designFrames = [
  { x: 280, y: 130, w: 6100, h: 720, title: 'Couche Controleurs' },
  { x: 280, y: 980, w: 6100, h: 880, title: 'Couche Services / Utilitaires' },
  { x: 280, y: 1980, w: 2000, h: 520, title: 'Acces Aux Donnees' },
  { x: 2430, y: 1980, w: 3950, h: 2080, title: 'Modele Domaine' },
];

const designBoxes = [
  { name: 'AuthController', stereotype: 'controller', x: 420, y: 220, w: 430, lines: ['+ register(req, res)', '+ login(req, res)', '+ getMe(req, res)', '+ updateProfile(req, res)', '+ changePassword(req, res)'] },
  { name: 'CategoryController', stereotype: 'controller', x: 980, y: 220, w: 430, lines: ['+ getAll(req, res)', '+ getById(req, res)', '+ getBySlug(req, res)', '+ create(req, res)', '+ update(req, res)', '+ delete(req, res)', '+ getServices(req, res)'] },
  { name: 'ServiceController', stereotype: 'controller', x: 1540, y: 220, w: 430, lines: ['+ getAll(req, res)', '+ getById(req, res)', '+ create(req, res)', '+ update(req, res)', '+ delete(req, res)', '+ getByProvider(req, res)'] },
  { name: 'ProviderController', stereotype: 'controller', x: 2100, y: 220, w: 520, lines: ['+ getAll(req, res)', '+ getById(req, res)', '+ getServices(req, res)', '+ getReviews(req, res)', '+ getCategories(req, res)', '+ getMyProfile(req, res)', '+ updateProfile(req, res)', '+ updateAvailability(req, res)', '+ toggleAvailability(req, res)', '+ getDashboard(req, res)', '+ getStats(req, res)', '+ requestVerification(req, res)'] },
  { name: 'BookingController', stereotype: 'controller', x: 2800, y: 220, w: 470, lines: ['+ getMyBookings(req, res)', '+ getAll(req, res)', '+ getById(req, res)', '+ create(req, res)', '+ updateStatus(req, res)', '+ cancel(req, res)'] },
  { name: 'ReviewController', stereotype: 'controller', x: 3440, y: 220, w: 470, lines: ['+ getAll(req, res)', '+ getByService(req, res)', '+ getByProvider(req, res)', '+ getByBooking(req, res)', '+ create(req, res)', '+ update(req, res)', '+ delete(req, res)'] },

  { name: 'UserService', stereotype: 'service', x: 420, y: 1080, w: 470, lines: ['+ listUsers(filters)', '+ createUser(data, adminId?)', '+ updateUser(id, data, adminId?)', '+ verifyProvider(providerId, adminId)', '+ deleteUser(userId, adminId?)', '+ getUserById(userId)'] },
  { name: 'CategoryService', stereotype: 'service', x: 1030, y: 1080, w: 440, lines: ['+ listCategories()', '+ getCategoryById(id)', '+ createCategory(data, adminId?)', '+ updateCategory(id, data, adminId?)', '+ deleteCategory(id, adminId?)'] },
  { name: 'ServiceService', stereotype: 'service', x: 1600, y: 1080, w: 450, lines: ['+ listServices(filters)', '+ getServiceById(id)', '+ updateService(id, data, adminId?)', '+ deleteService(id, adminId?)'] },
  { name: 'BookingService', stereotype: 'service', x: 2180, y: 1080, w: 450, lines: ['+ listBookings(filters)', '+ getBookingById(id)', '+ updateBooking(id, data, adminId?)', '+ deleteBooking(id)', '+ getBookingStats()'] },
  { name: 'PaymentService', stereotype: 'service', x: 2760, y: 1080, w: 390, lines: ['+ processSubscriptionPayment(userId, amount, method, planName)'] },
  { name: 'NotificationService', stereotype: 'service', x: 3290, y: 1080, w: 500, lines: ['+ createNotification(userId, title, message, ...)', '+ createFormattedNotification(recipient, ...)', '+ createStandardNotification(recipient, ...)', '- getNotificationTitle(action)'] },
  { name: 'EmailService', stereotype: 'service', x: 3940, y: 1080, w: 470, lines: ['+ sendWelcomeEmail(email, firstName)', '+ sendBookingConfirmation(email, firstName, details)', '+ sendBookingStatusUpdate(email, firstName, status, details)', '+ sendPasswordReset(email, resetToken)'] },
  { name: 'NotificationFormatter', stereotype: 'utility', x: 4560, y: 1080, w: 560, lines: ['+ formatNotificationMessage(baseMessage, recipient, context?)', '+ createStandardNotificationMessage(action, entity, recipient, context?)'] },

  { name: 'PrismaClient', stereotype: 'gateway', x: 420, y: 2090, w: 650, lines: ['+ user.findMany(...)', '+ providerProfile.findMany(...)', '+ service.findMany(...)', '+ booking.findMany(...)', '+ review.create(...)', '+ subscriptionPlan.create(...)', '+ $transaction(...)'] },
  { name: 'DatabaseGateway', stereotype: 'gateway', x: 1250, y: 2090, w: 650, lines: ['+ query(sql, params?)', '+ testConnection()', '+ pool: Pool'] },

  { name: 'User', stereotype: 'entity', x: 2610, y: 2100, w: 430, lines: ['+ id: String', '+ email: String', '+ role: Role', '+ firstName: String', '+ lastName: String', '+ phone: String'] },
  { name: 'ProviderProfile', stereotype: 'entity', x: 3190, y: 2100, w: 470, lines: ['+ id: String', '+ userId: String', '+ specialty: String?', '+ hourlyRate: Decimal?', '+ isAvailable: Boolean', '+ rating: Decimal'] },
  { name: 'Category', stereotype: 'entity', x: 3820, y: 2100, w: 390, lines: ['+ id: String', '+ name: String', '+ slug: String', '+ parentId: String?'] },
  { name: 'Service', stereotype: 'entity', x: 4370, y: 2100, w: 400, lines: ['+ id: String', '+ providerId: String', '+ categoryId: String?', '+ name: String', '+ price: Decimal'] },
  { name: 'Booking', stereotype: 'entity', x: 4910, y: 2100, w: 430, lines: ['+ id: String', '+ clientId: String', '+ serviceId: String', '+ bookingDate: DateTime', '+ status: BookingStatus'] },
  { name: 'Review', stereotype: 'entity', x: 5480, y: 2100, w: 380, lines: ['+ id: String', '+ bookingId: String', '+ rating: Int', '+ comment: String?'] },

  { name: 'Payment', stereotype: 'entity', x: 2610, y: 3050, w: 390, lines: ['+ id: String', '+ bookingId: String?', '+ userId: String', '+ amount: Decimal', '+ status: PaymentStatus'] },
  { name: 'VerificationRequest', stereotype: 'entity', x: 3170, y: 3050, w: 470, lines: ['+ id: String', '+ userId: String', '+ status: String', '+ reviewedBy: String?'] },
  { name: 'Subscription', stereotype: 'entity', x: 3800, y: 3050, w: 390, lines: ['+ id: String', '+ userId: String', '+ plan: String', '+ status: String'] },
  { name: 'SubscriptionPlan', stereotype: 'entity', x: 4370, y: 3050, w: 470, lines: ['+ id: String', '+ slug: String', '+ price: Decimal', '+ duration: Int', '+ isActive: Boolean'] },
  { name: 'Notification', stereotype: 'entity', x: 5000, y: 3050, w: 400, lines: ['+ id: String', '+ userId: String', '+ title: String', '+ type: String', '+ read: Boolean'] },
];

const designRelations = [
  { from: 'AuthController', to: 'PrismaClient', type: 'navigable', label: 'uses' },
  { from: 'CategoryController', to: 'PrismaClient', type: 'navigable', label: 'uses' },
  { from: 'ServiceController', to: 'PrismaClient', type: 'navigable', label: 'uses' },
  { from: 'ProviderController', to: 'PrismaClient', type: 'navigable', label: 'uses' },
  { from: 'BookingController', to: 'PrismaClient', type: 'navigable', label: 'uses' },
  { from: 'BookingController', to: 'DatabaseGateway', type: 'navigable', label: 'queries' },
  { from: 'BookingController', to: 'NotificationService', type: 'navigable', label: 'notifies' },
  { from: 'ReviewController', to: 'PrismaClient', type: 'navigable', label: 'uses' },

  { from: 'UserService', to: 'PrismaClient', type: 'navigable', label: 'uses' },
  { from: 'UserService', to: 'DatabaseGateway', type: 'navigable', label: 'queries' },
  { from: 'UserService', to: 'NotificationService', type: 'navigable', label: 'notifies' },
  { from: 'UserService', to: 'NotificationFormatter', type: 'navigable', label: 'formats' },
  { from: 'CategoryService', to: 'PrismaClient', type: 'navigable', label: 'uses' },
  { from: 'CategoryService', to: 'NotificationService', type: 'navigable', label: 'notifies' },
  { from: 'ServiceService', to: 'PrismaClient', type: 'navigable', label: 'uses' },
  { from: 'ServiceService', to: 'DatabaseGateway', type: 'navigable', label: 'queries' },
  { from: 'ServiceService', to: 'NotificationService', type: 'navigable', label: 'notifies' },
  { from: 'BookingService', to: 'PrismaClient', type: 'navigable', label: 'uses' },
  { from: 'BookingService', to: 'DatabaseGateway', type: 'navigable', label: 'queries' },
  { from: 'BookingService', to: 'NotificationService', type: 'navigable', label: 'notifies' },
  { from: 'PaymentService', to: 'DatabaseGateway', type: 'navigable', label: 'queries' },
  { from: 'PaymentService', to: 'NotificationService', type: 'navigable', label: 'notifies' },
  { from: 'NotificationService', to: 'DatabaseGateway', type: 'navigable', label: 'persists' },
  { from: 'NotificationService', to: 'NotificationFormatter', type: 'navigable', label: 'formats' },

  { from: 'AuthController', to: 'User', type: 'dependency', label: 'manipule' },
  { from: 'ProviderController', to: 'ProviderProfile', type: 'dependency', label: 'manipule' },
  { from: 'ProviderController', to: 'VerificationRequest', type: 'dependency', label: 'cree' },
  { from: 'ServiceController', to: 'Service', type: 'dependency', label: 'manipule' },
  { from: 'CategoryController', to: 'Category', type: 'dependency', label: 'manipule' },
  { from: 'BookingController', to: 'Booking', type: 'dependency', label: 'manipule' },
  { from: 'ReviewController', to: 'Review', type: 'dependency', label: 'manipule' },
  { from: 'UserService', to: 'User', type: 'dependency', label: 'gère' },
  { from: 'UserService', to: 'ProviderProfile', type: 'dependency', label: 'vérifie' },
  { from: 'CategoryService', to: 'Category', type: 'dependency', label: 'gère' },
  { from: 'ServiceService', to: 'Service', type: 'dependency', label: 'gère' },
  { from: 'BookingService', to: 'Booking', type: 'dependency', label: 'gère' },
  { from: 'BookingService', to: 'Review', type: 'dependency', label: 'corrèle' },
  { from: 'PaymentService', to: 'Payment', type: 'dependency', label: 'crée' },
  { from: 'NotificationService', to: 'Notification', type: 'dependency', label: 'crée' },

  { from: 'User', to: 'ProviderProfile', type: 'composition', m1: '1', m2: '0..1', label: 'compose' },
  { from: 'ProviderProfile', to: 'Service', type: 'composition', m1: '1', m2: '0..*', label: 'services' },
  { from: 'User', to: 'Booking', type: 'association', m1: '1', m2: '0..*', label: 'bookings' },
  { from: 'Service', to: 'Booking', type: 'association', m1: '1', m2: '0..*', label: 'bookings' },
  { from: 'Booking', to: 'Review', type: 'composition', m1: '1', m2: '0..1', label: 'review' },
  { from: 'Booking', to: 'Payment', type: 'association', m1: '1', m2: '0..*', label: 'payments', sides: ['left', 'right'], shift: -18 },
  { from: 'Category', to: 'Service', type: 'association', m1: '1', m2: '0..*', label: 'services' },
  { from: 'SubscriptionPlan', to: 'Subscription', type: 'aggregation', m1: '1', m2: '0..*', label: 'plans' },
  { from: 'User', to: 'Notification', type: 'association', m1: '1', m2: '0..*', label: 'notifications', sides: ['bottom', 'top'], shift: 80 },
  { from: 'User', to: 'Subscription', type: 'association', m1: '1', m2: '0..*', label: 'subscriptions', sides: ['bottom', 'top'], shift: -80 },
];

const domainSvg = renderDiagram({
  width: 3950,
  height: 3450,
  title: 'KaayJob - Diagramme De Classes',
  subtitle: 'Modele metier extrait de schema.prisma avec multiplicites et types de relation',
  boxes: domainBoxes,
  relations: domainRelations,
  domainClass: 'domain',
});

const designSvg = renderDiagram({
  width: 6600,
  height: 4300,
  title: 'KaayJob - Diagramme De Conception',
  subtitle: 'Classes et modules backend reels avec methodes, dependances et navigabilite',
  frames: designFrames,
  boxes: designBoxes,
  relations: designRelations,
  domainClass: 'domain',
});

const domainOut = path.join(OUT_DIR, 'kaayjob-domain-class-diagram.svg');
const designOut = path.join(OUT_DIR, 'kaayjob-conception-diagram.svg');
fs.writeFileSync(domainOut, domainSvg, 'utf8');
fs.writeFileSync(designOut, designSvg, 'utf8');

console.log(domainOut);
console.log(designOut);
