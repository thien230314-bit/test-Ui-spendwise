const { chromium } = require('node:module').createRequire(require('node:path').resolve(__dirname, '../apps/admin-crm/package.json'))('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 }, locale: 'vi-VN' });
  const p = await context.newPage();

  const shotUser = async (name) => {
    await p.screenshot({ path: path.join('img', 'user', name + '.png'), animations: 'disabled' });
  };
  const shotAdmin = async (name) => {
    await p.screenshot({ path: path.join('img', 'admin', name + '.png'), animations: 'disabled' });
  };

  console.log('Capturing User Mobile...');
  await p.goto('http://localhost:5173/app');
  await shotUser('login');

  await p.getByRole('button', { name: 'Đăng nhập vào SpendWise' }).click();
  await p.locator('.d-page-enter').waitFor();
  await shotUser('dashboard');

  const userPages = [
    ['wallet', 'wallet'],
    ['groups', 'groups'],
    ['friends', 'friends'],
    ['fixed-fund', 'fixed-fund'],
    ['free-fund', 'free-fund'],
    ['transactions', 'transactions'],
    ['profile', 'profile'],
    ['settings', 'settings'],
    ['ai', 'ai']
  ];

  for (const [route, name] of userPages) {
    await p.goto('http://localhost:5173/app/' + route);
    await p.locator('.d-page-enter').waitFor();
    await shotUser(name);
  }

  // User Transfer Success Dialog
  await p.goto('http://localhost:5173/app');
  await p.locator('.d-page-enter').waitFor();
  await p.getByRole('button', { name: 'Chuyển tiền', exact: true }).click();
  const d = p.getByRole('dialog');
  await d.getByLabel('Số tiền (VND)', { exact: true }).fill('100000');
  await d.getByLabel('PIN bảo mật · Mã mô phỏng: 123456', { exact: true }).fill('123456');
  await d.getByRole('button', { name: 'Xác nhận', exact: true }).click();
  await p.getByRole('heading', { name: 'Thao tác thành công', exact: true }).waitFor();
  await shotUser('transfer-success');
  await p.getByRole('button', { name: 'Hoàn tất', exact: true }).click();

  console.log('Capturing Admin CRM...');
  await p.goto('http://localhost:5173/admin');
  await shotAdmin('login');

  await p.locator('#btn-admin-login-submit').click();
  await p.locator('.d-page-enter').waitFor();
  await shotAdmin('dashboard');

  await p.goto('http://localhost:5173/admin/users');
  await p.locator('.d-page-enter').waitFor();
  await shotAdmin('users');

  await p.goto('http://localhost:5173/admin/support');
  await p.locator('.d-page-enter').waitFor();
  await shotAdmin('support');

  await p.goto('http://localhost:5173/admin/notifications');
  await p.locator('.d-page-enter').waitFor();
  await shotAdmin('notifications');

  await p.goto('http://localhost:5173/admin/maintenance');
  await p.locator('.d-page-enter').waitFor();
  await shotAdmin('maintenance');

  // Sidebar collapsed
  const collapseBtn = p.locator('button[aria-label="Thu gọn sidebar"]');
  if (await collapseBtn.count() > 0) {
    await collapseBtn.click();
    await shotAdmin('sidebar-collapsed');
  }

  await browser.close();
  console.log('Capture finished cleanly.');
})().catch(e => {
  console.error(e);
  process.exit(1);
});
