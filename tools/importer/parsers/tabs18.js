/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter(child => child.matches(selector));
  }

  // Get the carousel control panel (tab labels)
  const controlPanel = element.querySelector('.carousel__control-panel');
  const tabLabels = Array.from(controlPanel.querySelectorAll('.container__controls > li'));

  // Get the tab panels (slides)
  const panelsContainer = element.querySelector('.container__parsys');
  const panelDivs = getDirectChildren(panelsContainer, '.slide.panel.parbase');

  // Defensive: ensure equal number of tabs and panels
  const tabCount = Math.min(tabLabels.length, panelDivs.length);

  // Build header row
  const headerRow = ['Tabs'];
  const rows = [headerRow];

  for (let i = 0; i < tabCount; i++) {
    const tabLabelLi = tabLabels[i];
    const panelDiv = panelDivs[i];
    // Tab title (from tab label, strip icon)
    const tabButton = tabLabelLi.querySelector('.container__control__button');
    let tabTitle = '';
    if (tabButton) {
      // Remove icon span if present
      const tabButtonClone = tabButton.cloneNode(true);
      const iconSpan = tabButtonClone.querySelector('span');
      if (iconSpan) iconSpan.remove();
      tabTitle = tabButtonClone.textContent.trim();
    }
    // Panel content
    const panel = panelDiv.querySelector('.container__panel');
    // Tab Heading (h2)
    let tabHeading = '';
    const headingDiv = panel && panel.querySelector('.homepage-promotion__content-inner-wrap > div:first-child h2');
    if (headingDiv && headingDiv.textContent.trim() !== tabTitle) {
      tabHeading = headingDiv;
    }
    // Tab Image (img inside .hero__picture)
    let tabImage = '';
    const img = panel && panel.querySelector('.hero__picture img');
    if (img) {
      tabImage = img;
    }
    // Tab Content (body text and button)
    let tabContent = [];
    // Body text
    const bodyTextDiv = panel && panel.querySelector('.homepage-promotion__content-inner-wrap .body-text');
    if (bodyTextDiv && (!tabHeading || bodyTextDiv.textContent.trim() !== (tabHeading.textContent ? tabHeading.textContent.trim() : tabHeading))) {
      tabContent.push(bodyTextDiv);
    }
    // Promotion button
    const promoButton = panel && panel.querySelector('.homepage-promotion__content-inner-wrap a.promotion__button');
    if (promoButton) {
      tabContent.push(promoButton);
    }
    // Defensive: ensure tabContent is not empty
    if (tabContent.length === 0) tabContent = '';
    // Only include non-empty cells, no unnecessary empty columns
    const row = [tabTitle];
    if (tabHeading) row.push(tabHeading);
    if (tabImage) row.push(tabImage);
    if (tabContent) row.push(tabContent);
    rows.push(row);
  }

  // Create table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
