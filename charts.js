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
    buildGauge(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  buildGauge(newSample)
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log("Metadata is :");
    console.log(result);
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
    // 3. Create a variable that holds the samples array. 
   var samples = data.samples;
   console.log("samples");

   console.log(samples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
   
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    console.log("resultArray is ")

    console.log(resultArray)

    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log("result is");

   console.log(result);


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    console.log(otu_ids);
    console.log(otu_labels);
    console.log(sample_values);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
   var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(); 
   console.log("yticks is")

    console.log(yticks)

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        y:yticks,
        x:sample_values.slice(0,10).reverse(),
        text:otu_labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"
      }
     
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title:"Top Bacteria Cultures Found",
      margin:{t:30,l:150}
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout)
// 1. Create the trace for the bubble chart.
var bubbleData = [
  {
    x:otu_ids,
    y:sample_values,
    text:otu_labels,
    mode:"markers",
    marker:{
      size:sample_values,
      color:otu_ids,
      colorscale:"Earth"

    }

  }
   
];


// 2. Create the layout for the bubble chart.
var bubbleLayout = {
  title:"Bacteria Cultures Sample",
  hovermode:"closest",
  xaxis:{title:"OTU ID"},
  margin:{t:30}



  
};

// 3. Use Plotly to plot the data with the layout.
Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

  });
}
function buildGauge(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    var samples = data.samples;


    // Create a variable that filters the samples for the object with the desired sample number.
    var resultArraySample = samples.filter(sampleObj => sampleObj.id == sample);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var resultArrayMetadata = metadata.filter(sampleObj => sampleObj.id == sample);


    // Create a variable that holds the first sample in the array.
    var resultSample = resultArraySample[0];
    console.log("Sample array is");
    console.log(resultSample);


    // 2. Create a variable that holds the first sample in the metadata array.
    var resultMetadata = resultArrayMetadata[0];
    console.log("metadata result array is");
    console.log(resultMetadata);
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
   var otu_ids = resultSample.otu_ids;
   var otu_labels = resultSample.otu_labels;
   var sample_values = resultSample.sample_values;

    // 3. Create a variable that holds the washing frequency.
   var wfreq = resultMetadata.wfreq;
   var wfreqfloat = parseFloat(wfreq);
   console.log("wfreq data is");
   console.log(wfreqfloat);
   
   // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        type : "indicator",
        mode:"gauge+number",
        value:wfreqfloat,
        title : {text : "<b>Belly Button Washing Frequency</b> <br>Scrubs per week</br>"},
        gauge: {
          axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
          bar: { color: "black" },
          bgcolor: "white",
          borderwidth: 0.75,
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" }
          ],
          
      } 
    } 
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width : 400,
      height : 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      font: { color: "darkblue", family: "Arial" }
      
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);
  });
}



