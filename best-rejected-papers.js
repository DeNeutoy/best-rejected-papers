// Best Rejected Papers Visualization
document.addEventListener("DOMContentLoaded", function () {
  let bestRejectedPapers = {}; // Will be populated from JSON data

  // Map conference keys from JSON to display names
  const conferenceMapping = {
    iclr2017: { display: "ICLR 2017", key: "iclr-2017" },
    iclr2019: { display: "ICLR 2019", key: "iclr-2019" },
    iclr2020: { display: "ICLR 2020", key: "iclr-2020" },
    iclr2021: { display: "ICLR 2021", key: "iclr-2021" },
    iclr2022: { display: "ICLR 2022", key: "iclr-2022" },
    iclr2023: { display: "ICLR 2023", key: "iclr-2023" },
    iclr2024: { display: "ICLR 2024", key: "iclr-2024" },
    neurips2021: { display: "NeurIPS 2021", key: "neurips-2021" },
    neurips2022: { display: "NeurIPS 2022", key: "neurips-2022" },
    neurips2023: { display: "NeurIPS 2023", key: "neurips-2023" },
    neurips2024: { display: "NeurIPS 2024", key: "neurips-2024" },
  };

  // Load real data from JavaScript file
  function loadRealData() {
    try {
      // Use the data from the global variable instead of fetching
      const data = window.bestRejectedPapersData;

      if (!data) {
        throw new Error("Data not loaded");
      }

      // Transform the data to match our visualization format
      bestRejectedPapers = {};

      Object.keys(data).forEach((confKey) => {
        const mapping = conferenceMapping[confKey];
        if (mapping) {
          bestRejectedPapers[mapping.key] = data[confKey].map((paper) => ({
            title: paper.title,
            authors: paper.authors,
            authorIds: paper.authorIds,
            citations: paper.citation_count,
            venue: paper.publication_venue || "Unknown Venue",
            year: paper.conference_year,
            abstract: paper.abstract,
            url: paper.url,
            reviewScores: paper.review_scores,
            reviewScoreAvg: paper.review_score_avg,
            keywords: paper.keywords || [],
          }));
        }
      });

      // Initialize the visualization once data is loaded
      initializeBestRejectedPapers();
    } catch (error) {
      console.error("Error loading data:", error);
      // Fall back to showing error message
      const loadingElement = document.getElementById("papers-loading");
      loadingElement.innerHTML =
        '<div class="error-message">Error loading data. Please try again later.</div>';
    }
  }

  // Initialize the visualization
  function initializeBestRejectedPapers() {
    const loadingElement = document.getElementById("papers-loading");
    const contentElement = document.getElementById("papers-content");

    // Hide loading and show content
    loadingElement.style.display = "none";
    contentElement.style.display = "block";

    // Update tab buttons to match available data
    updateTabButtons();

    // Set up tab switching
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const conference = this.getAttribute("data-conference");
        switchTab(conference);
      });
    });

    // Show initial tab (first available conference)
    const firstConference = Object.keys(bestRejectedPapers)[0];
    if (firstConference) {
      switchTab(firstConference);
    }
  }

  // Update tab buttons based on available data
  function updateTabButtons() {
    const tabContainer = document.querySelector(".conference-tabs");
    tabContainer.innerHTML = ""; // Clear existing buttons

    Object.keys(bestRejectedPapers).forEach((confKey, index) => {
      const mapping = Object.values(conferenceMapping).find(
        (m) => m.key === confKey
      );
      if (mapping) {
        const button = document.createElement("button");
        button.className = `tab-button ${index === 0 ? "active" : ""}`;
        button.setAttribute("data-conference", confKey);
        button.textContent = mapping.display;
        tabContainer.appendChild(button);
      }
    });
  }

  // Switch between conference tabs
  function switchTab(conference) {
    // Update active tab button
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach((button) => {
      button.classList.remove("active");
      if (button.getAttribute("data-conference") === conference) {
        button.classList.add("active");
      }
    });

    // Display papers for selected conference
    displayPapers(conference);
  }

  // Display papers for a given conference
  function displayPapers(conference) {
    const contentElement = document.getElementById("papers-content");
    const papers = bestRejectedPapers[conference] || [];

    if (papers.length === 0) {
      contentElement.innerHTML =
        '<div class="no-papers-message">No data available for this conference yet.</div>';
      return;
    }

    // Sort papers by citation count (descending)
    papers.sort((a, b) => b.citations - a.citations);

    // Generate HTML for papers
    const papersHTML = papers
      .map((paper, index) => {
        // Create author links using author IDs
        const authorsWithLinks = paper.authors.map((author, idx) => {
          const authorId = paper.authorIds && paper.authorIds[idx];
          if (authorId) {
            return `<a href="https://www.semanticscholar.org/author/${authorId}" target="_blank">${author}</a>`;
          }
          return author;
        });

        const authorsText =
          authorsWithLinks.length > 3
            ? `${authorsWithLinks.slice(0, 3).join(", ")} <em>et al.</em>`
            : authorsWithLinks.join(", ");

        // Format review scores if available
        const reviewInfo =
          paper.reviewScores && paper.reviewScores.length > 0
            ? `<span class="paper-review-score"><strong>Avg Review: ${paper.reviewScoreAvg.toFixed(
                1
              )}/10</strong></span>`
            : "";

        // Create expandable abstract
        const shortAbstract = paper.abstract.slice(0, 200) + "...";
        const fullAbstract = paper.abstract;
        const needsExpansion = paper.abstract.length > 200;

        const abstractHTML = needsExpansion
          ? `<div class="paper-abstract">
               <span class="abstract-short">${shortAbstract}</span>
               <span class="abstract-full" style="display: none;">${fullAbstract}</span>
             <span class="expand-abstract-btn" onclick="toggleAbstract(this)">Show more</span>
             </div>
          `
          : `<div class="paper-abstract">${fullAbstract}</div>`;

        return `
        <div class="paper-item">
          <div class="paper-title">
            <a href="${paper.url}" target="_blank">${paper.title}</a>
          </div>
          <div class="paper-authors">
            ${authorsText}
          </div>
          <div class="paper-meta">
            <span class="paper-citations"><strong>${paper.citations.toLocaleString()} citations</strong></span>
            <span class="paper-separator">•</span>
            ${reviewInfo}
            <span class="paper-separator">•</span>
            <span class="paper-venue"><strong>Eventually published: ${
              paper.venue
            }</strong></span>
          </div>
          ${abstractHTML}
        </div>
      `;
      })
      .join("");

    contentElement.innerHTML = papersHTML;
  }

  // Add global function for toggling abstracts
  window.toggleAbstract = function (button) {
    const abstractContainer = button.parentElement;
    const shortAbstract = abstractContainer.querySelector(".abstract-short");
    const fullAbstract = abstractContainer.querySelector(".abstract-full");

    if (fullAbstract.style.display === "none") {
      shortAbstract.style.display = "none";
      fullAbstract.style.display = "inline";
      button.textContent = "Show less";
    } else {
      shortAbstract.style.display = "inline";
      fullAbstract.style.display = "none";
      button.textContent = "Show more";
    }
  };

  // Start loading data
  loadRealData();
});
