/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the hero image (picture or img)
  let heroImg = null;
  const heroImageDiv = Array.from(element.querySelectorAll(':scope > div > div'))
    .find(div => div.classList.contains('HeroImageAndIntro__heroImage'));
  if (heroImageDiv) {
    heroImg = heroImageDiv.querySelector('picture') || heroImageDiv.querySelector('img');
  }

  // Defensive: find the heading (h1)
  let heading = null;
  const headingDiv = Array.from(element.querySelectorAll(':scope > div > div'))
    .find(div => div.classList.contains('HeroImageAndIntro__intro'));
  if (headingDiv) {
    const headingContainer = headingDiv.querySelector('.HeroImageAndIntro__intro-heading');
    if (headingContainer) {
      heading = headingContainer.querySelector('h1');
    }
  }

  // Defensive: find the description (paragraph)
  let description = null;
  if (headingDiv) {
    const descContainer = headingDiv.querySelector('.HeroImageAndIntro__intro-description');
    if (descContainer) {
      description = descContainer.querySelector('p');
    }
  }

  // Compose content row: heading and description
  const contentRow = [];
  const contentElements = [];
  if (heading) contentElements.push(heading);
  if (description) contentElements.push(description);
  // If both heading and description exist, put both in the cell
  // If only one exists, just use that
  contentRow.push(contentElements);

  // Compose image row
  const imageRow = [heroImg ? heroImg : ''];

  // Table rows: header, image, content
  const cells = [
    ['Hero (hero11)'],
    imageRow,
    contentRow
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
