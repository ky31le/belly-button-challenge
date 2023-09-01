
document.addEventListener("DOMContentLoaded", function() {
    const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
    
    d3.json(url).then(data => {
      const sampleIds = data.names;
      const dropdown = d3.select("#dropdown");
    
      // Populate the dropdown with sample IDs
      sampleIds.forEach(id => {
        dropdown.append("option").attr("value", id).text(id);
      });
    
      // Display the bubble chart for the first sample on page load
      updateBubbleChart(sampleIds[0], data);
        
      // Update bubble chart on dropdown change
      dropdown.on("change", function() {
        const selectedSample = d3.select(this).property("value");
        updateBubbleChart(selectedSample, data);
      });
    });
  });
  
  function updateBubbleChart(sampleId, data) {
    // Find the index of the selected sample in the data
    const sampleIndex = data.names.indexOf(sampleId);
    
    // Extract relevant data
    const sampleValues = data.samples[sampleIndex].sample_values;
    const otuIds = data.samples[sampleIndex].otu_ids;
    const otuLabels = data.samples[sampleIndex].otu_labels;
    
    // Create the bubble chart using D3
    const chart = d3.select("#chart-container").html("").append("svg")
      .attr("width", 800)
      .attr("height", 600);
    
    const margin = { top: 20, right: 20, bottom: 80, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
    
    const xScale = d3.scaleLinear().domain([0, d3.max(otuIds)]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, d3.max(sampleValues)]).range([height, 0]);
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    
    chart.append("g")
      .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
      .call(xAxis)
      .append("text")
      .attr("x", width / 2)
      .attr("y", 40)
      .attr("fill", "black")
      .text("OTU IDs");
    
    chart.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x", -height / 2)
      .attr("fill", "black")
      .text("Sample Values");
    
    chart.selectAll(".bubble")
      .data(sampleValues)
      .enter()
      .append("circle")
      .attr("class", "bubble")
      .attr("cx", d => margin.left + xScale(otuIds[d]))
      .attr("cy", d => margin.top + yScale(d))
      .attr("r", d => d)
      .attr("fill", (d, i) => colorScale(otuIds[i]));
    
    chart.selectAll(".label")
      .data(sampleValues)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => margin.left + xScale(otuIds[d]))
      .attr("y", d => margin.top + yScale(d) - d - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text((d, i) => otuLabels[i]);
    
    // Display sample metadata
    const metadataContainer = d3.select("#metadata-container");
    metadataContainer.node().innerHTML = "";
  
    const metadata = data.metadata[sampleIndex];
    for (const [key, value] of Object.entries(metadata)) {
      const keyValue = `${key}: ${value}`;
      metadataContainer.append("p").text(keyValue);
    }
  }
  