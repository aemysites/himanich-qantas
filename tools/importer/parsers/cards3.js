/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child columns
  const columns = Array.from(element.querySelectorAll(':scope .row > .column'));
  const headerRow = ['Cards (cards3)'];
  const rows = [headerRow];

  columns.forEach((col) => {
    // --- IMAGE ---
    let imgEl = null;
    const picture = col.querySelector('.responsive-image picture');
    if (picture) {
      imgEl = picture.querySelector('img');
    }

    // --- TITLE (as link) ---
    let titleLink = null;
    const linksDiv = col.querySelector('.links');
    if (linksDiv) {
      const link = linksDiv.querySelector('a');
      if (link) {
        // Use the link as the title, styled as a heading
        const heading = document.createElement('strong');
        heading.append(link);
        titleLink = heading;
      }
    }

    // --- DESCRIPTION ---
    let desc = null;
    const bodyDiv = col.querySelector('.body-text');
    if (bodyDiv) {
      // Defensive: skip empty paragraphs
      const p = bodyDiv.querySelector('p');
      if (p && p.textContent.trim().replace(/\u00A0/g, '').length > 0) {
        desc = p;
      }
    }

    // Compose the text cell
    const textCell = [];
    if (titleLink) textCell.push(titleLink);
    if (desc) textCell.push(desc);

    // Defensive: if no title, fallback to link text
    if (!titleLink && linksDiv) {
      const link = linksDiv.querySelector('a');
      if (link) textCell.push(link);
    }

    // Defensive: if nothing, fallback to column text
    if (textCell.length === 0) {
      textCell.push(col);
    }

    rows.push([
      imgEl ? imgEl : '',
      textCell.length === 1 ? textCell[0] : textCell,
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
