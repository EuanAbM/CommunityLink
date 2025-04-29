const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

console.log("🟡 Starting screenshot automation...");

const simpleRoutes = [
  "/", "/login", "/dashboard", "/students", "/students/add", "/incidents", "/incidents/new", "/users",
  "/reports", "/settings",
  "/reports/query-search",
  "/settings/email", "/settings/categories", "/settings/agency", "/settings/workflows", "/settings/policies",
  "/settings/integrations", "/settings/data"
];

const tabbedRoutes = {
  "/students/student-1": ["overview", "incidents", "contacts", "agencies", "attendance", "achievement", "documents"],
  "/users/user-1": ["overview", "incidents", "student-access", "audit-logs", "settings"]
};

const viewports = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 }
};

const outputDir = path.join(__dirname, "screenshots");

(async () => {
  try {
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const browser = await puppeteer.launch({ headless: false }); // See it happening
    console.log("🟢 Browser launched.");

    for (let [viewportName, viewportSize] of Object.entries(viewports)) {
      console.log(`\n🌐 Viewport: ${viewportName.toUpperCase()}`);
      const deviceDir = path.join(outputDir, viewportName);
      if (!fs.existsSync(deviceDir)) fs.mkdirSync(deviceDir);

      const page = await browser.newPage();
      await page.setViewport(viewportSize);

      // Simple routes
      for (let route of simpleRoutes) {
        const url = `http://localhost:3000${route}`;
        try {
          console.log(`📸 Capturing ${url}`);
          await page.goto(url, { waitUntil: 'networkidle0' });
          await page.waitForTimeout(1000);
          const safeRoute = route === '/' ? 'home' : route.replace(/\//g, '_');
          const filePath = path.join(deviceDir, `${safeRoute}.png`);
          await page.screenshot({ path: filePath, fullPage: true });
          console.log(`✅ Saved: ${filePath}`);
        } catch (err) {
          console.error(`❌ Error visiting ${url}:`, err.message);
        }
      }

      // Tabbed routes
      for (let [route, tabs] of Object.entries(tabbedRoutes)) {
        const baseUrl = `http://localhost:3000${route}`;
        for (let tab of tabs) {
          try {
            console.log(`📍 ${route} — tab: ${tab}`);
            await page.goto(baseUrl, { waitUntil: 'networkidle0' });
            await page.waitForTimeout(1000);
            if (tab !== 'overview') {
              await page.click(`[role='tab'][data-state='inactive'][data-value='${tab}']`);
              await page.waitForTimeout(1000);
            }
            const safeTab = `${route.replace(/\//g, '_')}_${tab}`;
            const filePath = path.join(deviceDir, `${safeTab}.png`);
            await page.screenshot({ path: filePath, fullPage: true });
            console.log(`✅ Saved: ${filePath}`);
          } catch (err) {
            console.error(`❌ Tab ${tab} failed at ${route}:`, err.message);
          }
        }
      }

      await page.close();
    }

    await browser.close();
    console.log("🎉 All screenshots complete!");
  } catch (err) {
    console.error("🚨 Fatal error:", err.message);
  }
})();
