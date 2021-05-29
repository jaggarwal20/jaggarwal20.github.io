function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    //console.log(sampleArray);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleNumber = sampleArray.filter(sampleID => sampleID.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var initialSample = sampleNumber[0];

    // Filter the data for the object with the desired sample number
    
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = initialSample.otu_ids;
    var out_labels = initialSample.otu_labels;
    var sample_value = initialSample.sample_values;
    var wfrequency = parseFloat(result.wfreq);
    console.log(wfrequency);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(ids => `OTU ${ids}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        x: sample_value.slice(0,10).reverse(),
        y: yticks,
        text: out_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
      }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      width: 600,
      height: 600
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    



  // Bar and Bubble charts
// Create the buildCharts function.
//function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
//  d3.json("samples.json").then((data) => {
//    var sampleArray = data.samples;

    // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
    //Plotly.newPlot("bubble",bubbleData, bubbleLayout); 

    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_value,
        text: out_labels,
        mode: "markers",
        marker: {
           color: otu_ids,
           size: sample_value
       }
      }];

    var data = [bubbleData]

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacterial Cultures per Sample"
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

   
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: {
          x:[0,1],
          y: [0,1]
        },
        value: wfrequency,
        title: {text: "<b>Belly Button Washing Frequency"},
        type: "indicator",
        mode: "gauge+number",
        gauge:{
          axis: {range:[null,10], tickwidth:1},
          steps:[
            { range: [0, 2], color: "#8b0000" },
            { range: [2, 4], color: "#ff8c00" },
            { range: [4, 6], color: "#ffd700" },
            { range: [6, 8], color: "#adff2f" },
            { range: [8, 10], color: "#008000" }
          ],
        }
        
      }
    ];
  
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600,
      height: 400,
      margin: { t: 4, b: 0 },
      
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}