/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main containers
  const heroContainer = element.querySelector('.HeroImageAndIntro__container');
  if (!heroContainer) return;

  // --- IMAGE ROW ---
  // Find the hero image container and its image
  const imageContainer = heroContainer.querySelector('.HeroImageAndIntro__heroImage');
  let imageEl = null;
  if (imageContainer) {
    // Prefer the <img> inside <picture>
    const img = imageContainer.querySelector('img');
    if (img) imageEl = img;
  }

  // --- CONTENT ROW ---
  // Find the heading
  let headingEl = null;
  const headingContainer = heroContainer.querySelector('.HeroImageAndIntro__intro-heading');
  if (headingContainer) {
    const h1 = headingContainer.querySelector('h1');
    if (h1) headingEl = h1;
  }

  // Find the description (paragraphs)
  let descriptionEls = [];
  const descriptionContainer = heroContainer.querySelector('.HeroImageAndIntro__intro-description');
  if (descriptionContainer) {
    const textDiv = descriptionContainer.querySelector('.HeroImageAndIntro__text');
    if (textDiv) {
      // Get all paragraphs, filter out empty ones
      descriptionEls = Array.from(textDiv.querySelectorAll('p')).filter(p => p.textContent.trim() && p.innerHTML.replace(/&nbsp;/g, '').trim());
    }
  }

  // Compose the content row: heading + paragraphs
  const contentRow = [];
  const contentCell = [];
  if (headingEl) contentCell.push(headingEl);
  if (descriptionEls.length) contentCell.push(...descriptionEls);
  if (contentCell.length) {
    contentRow.push([contentCell]);
  } else {
    // fallback: empty cell
    contentRow.push(['']);
  }

  // Compose the table rows
  const headerRow = ['Hero'];
  const imageRow = [imageEl ? imageEl : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow[0],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
