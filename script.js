var map2010 = L.map('map2010', {
    center: [0,0],
    zoom:2,
    minZoom:1,
    maxZoom:5,
    maxBounds: L.latLngBounds([85, -180], [-70, 180])
}).setView([25, 0], 1.5);

var map2015 = L.map('map2015', {
    center: [0,0],
    zoom:2,
    minZoom:2,
    maxZoom:5,
    maxBounds: L.latLngBounds([85, -180], [-70, 180])
}).setView([25, 0], 1.5);

var map2020 = L.map('map2020', {
    center: [0,0],
    zoom:2,
    minZoom:2,
    maxZoom:5,
    maxBounds: L.latLngBounds([85, -180], [-70, 180])
}).setView([25, 0], 1.5);


function addMapData(map, fieldName) {
    fetch('world2.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function(feature) {
                var value = feature.properties[fieldName];

                if (value === null || isNaN(value)) {
                    return {
                        fillColor: '#838383', 
                        weight: 1,
                        opacity: 1,
                        color: 'white',
                        fillOpacity: 0.7
                    };
                }
                return {
                    fillColor:getColor(value),
                    weight:1,
                    opacity: 1,
                    color: 'white',
                    fillOpacity: 0.7
                };
            },
            onEachFeature: function(feature,layer) {
                var value = feature.properties[fieldName];
                value = (value === null || isNaN(value)) ? 'N/A' : value; 

                layer.on({
                    mouseover:function(e) {
                        var popupContent = feature.properties.Name + ": " + value 

                        e.target.bindPopup(popupContent, {className: 'customPopup'}).openPopup();
                        
                        e.target.setStyle({
                            color: '#000000',
                            weight: 2});

                        e.target.bringToFront()
                    },

                    mouseout: function(e) {
                        e.target.closePopup()
                        
                        e.target.setStyle({
                            color: '#FFFFFF',
                            weight:1})
                    },

                    click: function(e) {
                        var feature = e.target.feature;
                        var data = [feature.properties.d2010_b, feature.properties.d2015_b, feature.properties.d2020_b];
                        var ctx = document.getElementById('chart').getContext('2d');
                    
                        if (window.myChart) {
                            window.myChart.destroy();
                        }
                    
                        window.myChart = new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: ['2010', '2015', '2020'],
                                datasets: [{
                                    data: data,
                                    backgroundColor: ['rgb(123,66,133)', 'rgb(123,66,133)','rgb(123,66,133)',],

                                }]
                            },
                            options: {
                                scales: {
                                    y: {
                                       
                                    }
                                },
                                plugins: {
                                    title: {
                                        display: true,
                                        text: feature.properties.Name
                                    },
                                    legend: {
                                        display: false
                                    }
                                }
                            }
                        });
                    
                        document.getElementById('chart').style.display = 'block';
                        document.getElementById('chart').style.height = '300px';
                        document.getElementById('chart').style.width = '400px';
                    
                    }
                });
            
            }   
        }).addTo(map);
    });
}

function getColor(value) {
    return value < 7.327 ? '#f1a6ff' :
           (value >= 7.327 && value < 10.246) ? '#ca85d6' :
           (value >= 10.246 && value < 13.165)  ? '#a264ad' :
           (value >= 13.165 && value < 16.084) ? '#7b4285' :
           (value >= 16.084 && value < 19.004)   ? '#53215c' :
           (value >= 19.004)  ? '#2c0033' :
           '#737074';
}

function addLegend(map) {
    var legend = L.control({position: 'bottomleft'});

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0,7.3,10.2,13.2,16.1,19.0],
        labels = [];
        

        for (var i=0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }


        return div;
    };
    legend.addTo(map);
}

addMapData(map2010, 'd2010_b')
addMapData(map2015, 'd2015_b')
addMapData(map2020, 'd2020_b')

addLegend(map2010)
addLegend(map2015)
addLegend(map2020)

