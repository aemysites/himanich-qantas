/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure we have a UL with LI children
  if (!element || !element.querySelectorAll) return;

  // Table header row - must be exactly as specified
  const headerRow = ['Cards (cards1)'];
  const rows = [headerRow];

  // Get all immediate LI children (cards)
  const items = Array.from(element.children).filter((child) => child.tagName === 'LI');

  items.forEach((li) => {
    // Find the link inside the card
    const link = li.querySelector('a');
    if (!link) return; // skip if no link

    // Always two columns: first for image/icon (none here, so empty), second for text/link
    rows.push(['', link]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
