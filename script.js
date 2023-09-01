document.addEventListener("DOMContentLoaded", function() {
    const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
  
    d3.json(url).then(data => {
      const sampleIds = data.names;
      const dropdown = d3.select("#dropdown");
  
      // Populate the dropdown with sample IDs
      sampleIds.forEach(id => {
        dropdown.append("option").attr("value", id).text(id);
      });
  
      // Display the chart for the first sample on page load
      updateChart(sampleIds[0], data);
      
      // Update chart on dropdown change
      dropdown.on("change", function() {
        const selectedSample = d3.select(this).property("value");
        updateChart(selectedSample, data);
      });
    });
  });
  
  function updateChart(sampleId, data) {
    // Find the index of the selected sample in the data
    const sampleIndex = data.names.indexOf(sampleId);
  
    // Extract relevant data
    const sampleValues = data.samples[sampleIndex].sample_values.slice(0, 10);
    const otuIds = data.samples[sampleIndex].otu_ids.slice(0, 10);
    const otuLabels = data.samples[sampleIndex].otu_labels.slice(0, 10);
  
    // Create the horizontal bar chart using D3
    const chart = d3.select("#chart-container").html("").append("svg")
      .attr("width", 500)
      .attr("height", 400);
  
    const barWidth = 300;
  
    const bars = chart.selectAll("rect")
      .data(sampleValues)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 40)
      .attr("width", d => d * 5)
      .attr("height", 30)
      .attr("fill", "steelblue");
  
    const labels = chart.selectAll("text")
      .data(otuIds)
      .enter()
      .append("text")
      .attr("x", 10)
      .attr("y", (d, i) => i * 40 + 20)
      .text(d => `OTU ${d}`)
      .attr("alignment-baseline", "middle")
      .attr("fill", "black");
  
    // Add hovertext using otu_labels
    bars.append("title")
      .text((d, i) => otuLabels[i]);
  }
  
  