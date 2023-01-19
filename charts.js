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

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    // Deliverable 1: 3. Create a variable that holds the samples array and metadata array.  
    var samples = data.samples;
    var metadata = data.metadata;

    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var firstSample = sampleArray[0];
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var result = metadataArray[0];


    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels; 
    var otuSampleValues = firstSample.sample_values;

    // Deliverable 3: 3. Create a variable that holds the washing frequency.
     var wFreq = result.wfreq; 

     function intToFloat(num, decPlaces) { 
        return num + '.' + Array(decPlaces + 1).join('0');
       }
     var floatWashingFreq = intToFloat(wFreq,1);

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 

   var charts = Array();

    for(var i=0; i<firstSample.otu_ids.length; i++) {
      charts.push({ 
        id:firstSample.otu_ids[i], 
        label: firstSample.otu_labels[i], 
        value: firstSample.sample_values[i] 
      });
    }

    //Sort by values 
    var sortedCharts = charts.sort((p1,p2)=> { 
      return p1.value - p2.value;
      });
  
      //Slice top 10 values 
      var x = (sortedCharts.map(c => c.value)).slice(-10);
      var yID = (sortedCharts.map(c => c.id)).slice(-10);
      var hoverText = (sortedCharts.map(c => c.label)).slice(-10);

      //Create yticks values 
      var yticks = yID.map(a=> 'OTU '+ a);

    // Deliverable 1: 8. Create the trace for the bar chart.   
    var barData = [{
      x: x,
      y: yticks,
      text: hoverText,
      type: 'bar',
      orientation: 'h' 
     }];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
     paper_bgcolor: '#FFFFFF57',
     title: 'Top 10 Bacteria Cultures Found'
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout.  
    Plotly.newPlot('bar', barData, barLayout);

    // Deliverable 2: 1. Create the trace for the bubble chart.
    console.log(otuIDs.filter((item,
      index) => otuIDs.indexOf(item) === index));
    var bubbleData = [{
      x: otuIDs,
      y: otuSampleValues,
      text: otuLabels,
      mode:'markers',
      marker: {
        color: otuIDs.map(id => numberToColour(id*1000)),
        size: otuSampleValues
      }
   }];
   console.log(otuIDs);

    //  Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      paper_bgcolor: '#FFFFFF57',
      title:'Bacteria Cultures Per Sample',
      xaxis: {title:'OTU ID'},
      width: 1184,
      showlegend: false
    };

    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout ); 

    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gaugeData = [{ 
      title: {
        text:'<b>Belly Button Washing Frequency</b><br>Scrubs per week',
      },
      domain: { x: [0, 1], y: [0, 1] },
      value: floatWashingFreq,
      type: "indicator",
      mode: "gauge+number",
      delta: { reference: 380 },
      gauge: {
        axis: { range: [null, 10] },
        bar: { color: "black" },
        borderwidth: 2,
        bordercolor: "black",
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "rgb(144, 238, 144)"},
          {range: [8, 10], color: "green"}
        ] 
      }
    }];
  
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      paper_bgcolor: '#FFFFFF57',
      width: 500,
      height: 450,
    };

    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge',gaugeData, gaugeLayout);


  });
};

function numberToColour(number) {
  const r = (number & 0xff0000) >> 16;
  const g = (number & 0x00ff00) >> 8;
  const b = (number & 0x0000ff);
  
  return 'rgb('+r+', '+g+', '+b+')';
};