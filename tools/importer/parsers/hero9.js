/* global WebImporter */
export default function parse(element, { document }) {
  // Find hero image (picture or img)
  let heroImage = null;
  const heroImageDiv = element.querySelector('.HeroImageAndIntro__heroImage');
  if (heroImageDiv) {
    heroImage = heroImageDiv.querySelector('picture') || heroImageDiv.querySelector('img');
  }

  // Find heading (h1)
  let heading = null;
  const headingDiv = element.querySelector('.HeroImageAndIntro__intro-heading');
  if (headingDiv) {
    heading = headingDiv.querySelector('h1');
  }

  // Find description (paragraph)
  let description = null;
  const descDiv = element.querySelector('.HeroImageAndIntro__intro-description');
  if (descDiv) {
    const textDiv = descDiv.querySelector('.HeroImageAndIntro__text');
    if (textDiv) {
      description = textDiv.querySelector('p') || textDiv;
    } else {
      description = descDiv.querySelector('p') || descDiv;
    }
  }

  // Compose the content cell for row 3 (heading + description)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);

  // Build the table rows
  const headerRow = ['Hero (hero9)'];
  const imageRow = [heroImage ? heroImage : ''];
  const contentRow = [contentCell.length > 0 ? contentCell : ''];

  const cells = [headerRow, imageRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
