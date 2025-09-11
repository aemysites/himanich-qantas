/* global WebImporter */
export default function parse(element, { document }) {
  // Get all columns (cards)
  const columns = element.querySelectorAll(':scope > .row > .column');
  if (!columns.length) return;

  // Header row as per block spec
  const headerRow = ['Cards (cards8)'];
  const rows = [headerRow];

  columns.forEach((col) => {
    // Find the image (mandatory)
    let imgEl = null;
    const picture = col.querySelector('picture');
    if (picture) {
      imgEl = picture.querySelector('img');
    }

    // Find the text content (mandatory)
    // The link in .links is the title and CTA
    let textCell = document.createElement('div');
    const linksDiv = col.querySelector('.links');
    if (linksDiv) {
      // Use the anchor as the title/CTA
      const link = linksDiv.querySelector('a');
      if (link) {
        // Use the anchor's text as a heading, and the anchor as CTA
        const heading = document.createElement('strong');
        heading.textContent = link.textContent;
        textCell.appendChild(heading);
        textCell.appendChild(document.createElement('br'));
        textCell.appendChild(link.cloneNode(true));
      }
      // Also include any additional text nodes in .links (for flexibility)
      Array.from(linksDiv.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          textCell.appendChild(p);
        }
      });
    }

    // Defensive: if either image or text is missing, skip this card
    if (!imgEl || !textCell.hasChildNodes()) return;

    rows.push([
      imgEl,
      textCell
    ]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
