/* global WebImporter */
export default function parse(element, { document }) {
  // Only process if element contains a nav with anchor links
  const nav = element.querySelector('nav');
  if (!nav) return;
  const ul = nav.querySelector('ul');
  if (!ul) return;
  const lis = ul.querySelectorAll('li');
  if (!lis.length) return;

  // Header row as per block guidelines
  const headerRow = ['Tabs'];
  const rows = [headerRow];

  // Each tab is a row: always output 4 columns per row, even if some are empty
  lis.forEach((li) => {
    const a = li.querySelector('a');
    if (!a) return;
    const tabTitle = a.textContent.trim();
    // Always output 4 columns per row, even if some are empty
    rows.push([
      tabTitle, // Tab Title
      '',       // Tab Heading (none)
      '',       // Tab Image (none)
      ''        // Tab Content (none)
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
