/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all direct card columns
  const cardColumns = element.querySelectorAll(':scope > .row > .column');
  const rows = [];
  // Header row as per block spec
  rows.push(['Cards (cards4)']);

  cardColumns.forEach((col) => {
    // Defensive: skip empty columns
    if (!col.textContent.trim() && !col.querySelector('img')) return;
    // Find image (mandatory)
    let img = col.querySelector('img');
    // Defensive: skip if no image (cards4 expects image)
    if (!img) return;

    // Find text content: usually in .links parbase > a
    let textCellContent = [];
    const linksParbase = col.querySelector('.links.parbase');
    if (linksParbase) {
      // Use the whole .links.parbase block for resilience
      textCellContent.push(linksParbase);
    }
    // If no .links.parbase, fallback to any <a> after image
    if (!textCellContent.length) {
      const possibleLink = col.querySelector('a[href]');
      if (possibleLink) textCellContent.push(possibleLink);
    }

    // Build row: [image, text content]
    rows.push([
      img,
      textCellContent.length ? textCellContent : ''
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
