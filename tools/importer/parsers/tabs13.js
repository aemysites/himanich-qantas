/* global WebImporter */
export default function parse(element, { document }) {
  if (!element || !element.querySelector('nav.navigation-inpage__nav')) return;

  const headerRow = ['Tabs'];
  const rows = [headerRow];

  const nav = element.querySelector('nav.navigation-inpage__nav');
  const tabLinks = nav ? nav.querySelectorAll('ul > li > a') : [];

  tabLinks.forEach((a) => {
    const tabTitle = a.textContent.trim();
    if (!tabTitle) return;
    // Always output 4 columns: Tab title, Tab Heading, Tab Image, Tab Content (empty if not present)
    rows.push([tabTitle, '', '', '']);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
