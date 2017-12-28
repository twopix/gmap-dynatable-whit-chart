(function() {
  var $table = $('#chart-example'), 
      $chart = $('#chart-example-chart'), 
      chart,
      markersArray = [];
      // $map = $('#example-map');


  // Set up our Highcharts chart
  chart = new Highcharts.Chart({
    chart: {
      type: 'column',
      renderTo: 'chart-example-chart'
    },
    title: {
      text: 'World\'s largest cities per 2008'
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Population (millions)'
      }
    },
    series: [{
      name: 'Population',
      color: '#006A72'
    }]
  });

  // set up gmap
  map = new google.maps.Map(document.getElementById('example-map'), {
            center: {lat: 40.5264274, lng: 22.204014099999995},
            zoom: 8
          });

  // clear maps
  function clearOverlays() {
    for (var i = 0; i < markersArray.length; i++ ) {
      markersArray[i].setMap(null);
    }
    markersArray.length = 0;
  }

  // Create a function to update the chart with the current working set
  // of records from dynatable, after all operations have been run.
  function updateChart() {
    clearOverlays();
    var dynatable = $table.data('dynatable'), categories = [], values = [], datas=[];
    $.each(dynatable.settings.dataset.records, function() {
      categories.push(this.city);
      values.push(parseFloat(this.population));

      datas.push(parseFloat(this.long)); 


      var latLng = new google.maps.LatLng(this.population,this.long);

      var imageUrl = 'http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=' +
          'FFFFFF,008CFF,000000&ext=.png';
      var markerImage = new google.maps.MarkerImage(imageUrl,
          new google.maps.Size(24, 32));

      var marker = new google.maps.Marker({
        'position': latLng,
        'icon': markerImage,
        'map': map 
      });
      markersArray.push(marker);
      google.maps.event.addListener(marker,"click",function(){alert('asd')});
      // var fn = storeList.markerClickFunction(storeList.pics[i], latLng);
      // google.maps.event.addListener(marker, 'click', fn);
      // google.maps.event.addDomListener(title, 'click', fn);




    });

    chart.xAxis[0].setCategories(categories);
    chart.series[0].setData(values);
  };




  // Attach dynatable to our table,
  // and trigger our update function whenever we interact with it.
  $table
    .dynatable({
      inputs: {
        queryEvent: 'blur change keyup',
        recordCountTarget: $chart,
        paginationLinkTarget: $chart,
        searchTarget: $chart,
        perPageTarget: $chart
      },
      dataset: {
        perPageOptions: [5, 10, 20],
        sortTypes: {
          'population': 'number'
        }
      }
    })
    .bind('dynatable:afterProcess', updateChart);

  // Run our updateChart function for the first time.
  updateChart();
})();