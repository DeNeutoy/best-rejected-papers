// ICLR Acceptance vs Citations Visualization
document.addEventListener("DOMContentLoaded", function () {
  // Set fixed dimensions for the visualization
  const containerWidth =
    document.getElementById("visualization").clientWidth || 800;
  const containerHeight =
    document.getElementById("visualization").clientHeight || 500;

  // SVG dimensions and margins
  const margin = { top: 50, right: 50, bottom: 70, left: 80 };
  const width = containerWidth - margin.left - margin.right;
  const height = containerHeight - margin.top - margin.bottom;

  // Append SVG to the visualization div
  const svg = d3
    .select("#visualization")
    .append("svg")
    .attr("width", containerWidth)
    .attr("height", containerHeight)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Add title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("ICLR Paper Acceptance Status vs Citation Count");

  // Placeholder data - will be replaced with actual OpenReview data
  const sampleData = [
    { year: 2017, status: "Accepted", citations: 45 },
    { year: 2017, status: "Rejected", citations: 22 },
    { year: 2018, status: "Accepted", citations: 58 },
    { year: 2018, status: "Rejected", citations: 27 },
    { year: 2019, status: "Accepted", citations: 62 },
    { year: 2019, status: "Rejected", citations: 31 },
    { year: 2020, status: "Accepted", citations: 49 },
    { year: 2020, status: "Rejected", citations: 25 },
    { year: 2021, status: "Accepted", citations: 34 },
    { year: 2021, status: "Rejected", citations: 16 },
    { year: 2022, status: "Accepted", citations: 18 },
    { year: 2022, status: "Rejected", citations: 7 },
  ];

  // Define scales
  const years = [...new Set(sampleData.map((d) => d.year))];
  const xScale = d3.scaleBand().domain(years).range([0, width]).padding(0.3);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(sampleData, (d) => d.citations) * 1.1])
    .range([height, 0]);

  const colorScale = d3
    .scaleOrdinal()
    .domain(["Accepted", "Rejected"])
    .range(["#4CAF50", "#F44336"]);

  // Create grouped bar chart
  const statusGroups = d3.group(sampleData, (d) => d.year);

  years.forEach((year) => {
    const yearData = sampleData.filter((d) => d.year === year);
    const innerScale = d3
      .scaleBand()
      .domain(["Accepted", "Rejected"])
      .range([0, xScale.bandwidth()])
      .padding(0.1);

    // Add bars
    svg
      .selectAll(`.bar-${year}`)
      .data(yearData)
      .enter()
      .append("rect")
      .attr("class", (d) => `bar bar-${d.status.toLowerCase()}`)
      .attr("x", (d) => xScale(d.year) + innerScale(d.status))
      .attr("y", (d) => yScale(d.citations))
      .attr("width", innerScale.bandwidth())
      .attr("height", (d) => height - yScale(d.citations))
      .attr("fill", (d) => colorScale(d.status))
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.8);
        tooltip.transition().duration(200).style("opacity", 1);

        // Get mouse position relative to the visualization container
        const visualizationRect = document
          .getElementById("visualization")
          .getBoundingClientRect();
        const mouseX = event.clientX - visualizationRect.left;
        const mouseY = event.clientY - visualizationRect.top;

        tooltip
          .html(
            `<strong>${d.year} (${d.status})</strong><br>Citations: ${d.citations}`
          )
          .style("left", mouseX + 10 + "px")
          .style("top", mouseY - 28 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        tooltip.transition().duration(500).style("opacity", 0);
      });
  });

  // Add X axis
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale))
    .append("text")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("fill", "#000")
    .style("font-size", "14px")
    .style("text-anchor", "middle")
    .text("ICLR Conference Year");

  // Add Y axis
  svg
    .append("g")
    .call(d3.axisLeft(yScale))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", -height / 2)
    .attr("fill", "#000")
    .style("font-size", "14px")
    .style("text-anchor", "middle")
    .text("Citation Count");

  // Add legend
  const legend = svg
    .append("g")
    .attr("transform", `translate(${width - 100}, 0)`);

  const statuses = ["Accepted", "Rejected"];

  statuses.forEach((status, i) => {
    const legendRow = legend
      .append("g")
      .attr("transform", `translate(0, ${i * 20})`);

    legendRow
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", colorScale(status));

    legendRow
      .append("text")
      .attr("x", 20)
      .attr("y", 10)
      .attr("text-anchor", "start")
      .style("font-size", "12px")
      .text(status);
  });

  // Add tooltip
  const tooltip = d3
    .select("#visualization")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Add a note about the placeholder data
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 60)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("font-style", "italic")
    .text(
      "Note: This visualization currently uses placeholder data. Real OpenReview data will be used in the final version."
    );
});

// Function to load and process real data when available
async function loadRealData() {
  try {
    // Placeholder for actual data fetching code
    // const response = await fetch('path/to/openreview/data.json');
    // const data = await response.json();
    // processAndVisualizeData(data);
    console.log("Real data loading will be implemented here");
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

// This function will process and visualize the actual OpenReview data
function processAndVisualizeData(data) {
  // Code to process and visualize the real data will go here
  console.log(
    "Data processing and visualization code will be implemented here"
  );
}
