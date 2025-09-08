/* global WebImporter */
export default function parse(element, { document }) {
  if (!element || !element.classList.contains('block-list')) return;

  // Always use the correct header row
  const headerRow = ['Cards (cards2)'];

  // Get all <li> direct children
  const items = Array.from(element.querySelectorAll(':scope > li'));

  // Build rows for each card
  const rows = items.map((li) => {
    const link = li.querySelector('a');
    if (!link) return null;

    // First cell: icon placeholder (since no image or icon in HTML, use a right arrow Unicode character)
    const iconCell = document.createElement('span');
    iconCell.textContent = '→';

    // Second cell: text content (title as heading, link as CTA)
    const cardContent = document.createElement('div');
    // Use all text content from the <li> (not just link.textContent)
    // This ensures any additional text nodes are included
    // But in this HTML, only the link is present, so we include its text and the link itself
    const title = document.createElement('h3');
    title.textContent = link.textContent.trim();
    cardContent.appendChild(title);
    // Add the link as CTA at the bottom
    const cta = link.cloneNode(true);
    cardContent.appendChild(cta);

    return [iconCell, cardContent];
  }).filter(Boolean);

  const tableData = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
