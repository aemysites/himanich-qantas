/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure element is a UL with LI children
  if (!element || !element.querySelectorAll) return;

  // Header row as per block guidelines
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];

  // Get all direct LI children
  const items = Array.from(element.children).filter(child => child.tagName === 'LI');

  items.forEach(li => {
    // Find the link inside the LI
    const link = li.querySelector('a');
    if (!link) return; // skip if no link

    // Always two columns: [image/icon cell, text cell]
    // No image/icon in source, so first cell is empty string
    // Second cell is the link (title and CTA)
    rows.push(['', link]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
