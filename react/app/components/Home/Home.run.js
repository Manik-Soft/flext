import initSparkLine from "../Common/sparkline";
import initSlimScroll from "../Common/slimscroll";
import initVectorMap from "../Common/maps-vector";

export default function(chartSpline) {
  var datav3 = [
    {
      label: "Individuals",
      color: "#1ba3cd",
      data: [
        ["0", 30],
        ["1", 38],
        ["2", 40],
        ["3", 42],
        ["4", 48],
        ["5", 50],
        ["6", 70],
        ["7", 145],
        ["8", 70],
        ["9", 59],
        ["10", 48],
        ["11", 38],
        ["12", 29],
        ["13", 30],
        ["14", 22],
        ["15", 20],
        ["16", 21],
        ["17", 18],
        ["18", 29],
        ["19", 40],
        ["20", 22],
        ["21", 49],
        ["22", 23],
        ["23", 60]
      ]
    },
    {
      label: "Teams",
      color: "#3a3f51",
      data: [
        ["0", 20],
        ["1", 16],
        ["2", 18],
        ["3", 17],
        ["4", 16],
        ["5", 30],
        ["6", 110],
        ["7", 19],
        ["8", 18],
        ["9", 110],
        ["10", 19],
        ["11", 16],
        ["12", 10],
        ["13", 20],
        ["14", 10],
        ["15", 12],
        ["16", 25],
        ["17", 50],
        ["18", 101],
        ["19", 120],
        ["20", 60],
        ["21", 70],
        ["22", 90],
        ["23", 70]
      ]
    }
  ];

  var options = {
    series: {
      lines: {
        show: false
      },
      points: {
        show: true,
        radius: 4
      },
      splines: {
        show: true,
        tension: 0.4,
        lineWidth: 1,
        fill: 0.5
      }
    },
    grid: {
      borderColor: "#eee",
      borderWidth: 1,
      hoverable: true,
      backgroundColor: "#fcfcfc"
    },
    tooltip: true,
    tooltipOpts: {
      content: function(label, x, y) {
        return x + " : " + y;
      }
    },
    xaxis: {
      tickColor: "#fcfcfc",
      mode: "categories"
    },
    yaxis: {
      min: 0,
      max: 150, // optional: use it for a clear represetation
      tickColor: "#eee",
      //position: 'right' or 'left',
      tickFormatter: function(v) {
        return v /* + ' visitors'*/;
      }
    },
    shadowSize: 0
  };

  if (chartSpline) {
    $(chartSpline).height($(chartSpline).data("height") || 250);
    $.plot(chartSpline, datav3, options);
  }

  // Sparkline
  $("[data-sparkline]").each(initSparkLine);

  // Classyloader

  $("[data-classyloader]").each(function() {
    $(this).ClassyLoader($(this).data());
  });

  // Slimscroll
  $("[data-scrollable]").each(initSlimScroll);

  // Vector Map
  $("[data-vector-map]").each(initVectorMap);
}
