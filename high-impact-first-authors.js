// High Impact First Authors Visualization
document.addEventListener("DOMContentLoaded", function () {
  if (typeof window.highImpactFirstAuthorsRejected === "undefined") {
    console.error("High impact first authors data not found");
    return;
  }

  const container = document.getElementById(
    "high-impact-first-author-rejected-visualization"
  );
  if (!container) {
    console.error("Container not found");
    return;
  }

  // Sort authors by average citations per year (descending)
  const sortedAuthors = window.highImpactFirstAuthorsRejected.sort(
    (a, b) => b.avg_citations_per_year - a.avg_citations_per_year
  );

  // Create the HTML structure
  const html = `
        <div class="high-impact-authors-container">
            <div class="authors-list">
                ${sortedAuthors
                  .map((author, index) => createAuthorCard(author, index))
                  .join("")}
            </div>
        </div>
    `;

  container.innerHTML = html;

  // Add event listeners for toggles
  addToggleListeners();
});

function createAuthorCard(author, index) {
  const topPaper = author.papers.reduce(
    (max, paper) => (paper.citations > max.citations ? paper : max),
    author.papers[0]
  );

  // Create author link using semantic scholar ID
  const authorLink = `<a href="https://www.semanticscholar.org/author/${author.id}" target="_blank">${author.author}</a>`;

  return `
        <div class="author-card">
            <div class="author-header" data-toggle="author-${index}">
                <div class="author-info">
                    <div class="author-name-line">
                        <h5 class="author-name">${authorLink}</h5>
                        <div class="author-stats-inline">
                            <span class="stat-item">
                                <span class="stat-value">${Math.round(
                                  author.avg_citations_per_year
                                )}</span> avg citations/year
                            </span>
                            <span class="stat-separator">•</span>
                            <span class="stat-item">
                                <span class="stat-value">${
                                  author.total_citations
                                }</span> total citations
                            </span>
                            <span class="stat-separator">•</span>
                            <span class="stat-item">
                                <span class="stat-value">${
                                  author.total_papers
                                }</span> rejected papers
                            </span>
                        </div>
                    </div>
                    <div class="top-paper-preview">
                        Most cited: "${topPaper.title}" (${
    topPaper.citations
  } citations)
                    </div>
                </div>
                <div class="toggle-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 8L10 12L14 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
            <div class="author-papers" id="author-${index}" style="display: none;">
                <div class="papers-list">
                    ${author.papers
                      .map((paper) => createPaperItem(paper))
                      .join("")}
                </div>
            </div>
        </div>
    `;
}

function createPaperItem(paper) {
  const conferenceDisplay = paper.conference_name.toUpperCase();
  const yearDisplay = paper.conference_year;

  return `
        <div class="paper-item">
            <div class="paper-title">
                <a href="https://www.semanticscholar.org/paper/${
                  paper.semantic_scholar_id
                }" target="_blank">${paper.title}</a>
            </div>
            <div class="paper-meta">
                <span class="paper-citations"><strong>${paper.citations.toLocaleString()} citations</strong></span>
                <span class="paper-separator">•</span>
                <span class="paper-citations-per-year"><strong>${paper.citations_per_year.toFixed(
                  1
                )} citations/year</strong></span>
                <span class="paper-separator">•</span>
                <span class="paper-conference"><strong> Rejected from ${conferenceDisplay} ${yearDisplay}</strong></span>
            </div>
        </div>
    `;
}

function addToggleListeners() {
  document.querySelectorAll(".author-header").forEach((header) => {
    header.addEventListener("click", function () {
      const targetId = this.getAttribute("data-toggle");
      const targetElement = document.getElementById(targetId);
      const toggleIcon = this.querySelector(".toggle-icon");

      if (targetElement.style.display === "none") {
        targetElement.style.display = "block";
        toggleIcon.classList.add("expanded");
      } else {
        targetElement.style.display = "none";
        toggleIcon.classList.remove("expanded");
      }
    });
  });
}
