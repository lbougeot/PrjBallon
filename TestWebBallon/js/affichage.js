/* global dataSet */

function afficherPositionEtAltitude()
{

    var numLatitude = [];
    var numLongitude = [];
    var numAltitude = [];



    $.ajax({
        url: 'php/controleur.php',
        data:
                {
                    'commande': 'getPositions',
                },
        dataType: 'json',
        type: 'GET',

        success:
                function (donnees, status, xhr)
                {
                    console.log(donnees);
                    // Your access token can be found at: https://cesium.com/ion/tokens.
                    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMDAxZDUwOS0yNGYzLTQ0YjktYTJlZS1hMWUwNDAzMjkyZDgiLCJpZCI6NDMzMjIsImlhdCI6MTYxMjQzMDU2NX0.O1S6zm_ZVuz5bIKy-rkgsKYxSavDblsEI1R6BPtFtbw';


                    // Création du spectateur
                    const viewer = new Cesium.Viewer('cesiumContainer', {
                        terrainProvider: Cesium.createWorldTerrain()
                    });

                    // Création des batiments 3D
                    const osmBuildings = viewer.scene.primitives.add(Cesium.createOsmBuildings());


                    // Création des deux positions du ballon

                    const flightData = donnees;


// Create a point for each.
                    for (let i = 0; i < flightData.length; i++) {
                        const dataPoint = flightData[i];

                        viewer.entities.add({
                            description: `Location: (${dataPoint.longitude}, ${dataPoint.latitude}, ${dataPoint.height})`,
                            position: Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height),
                            point: {pixelSize: 10, color: Cesium.Color.RED}
                        });


                    }
//                    numLatitude[donnees] = [status.latitude];
//                    numLongitude[donnees] = [status.longitude];
//                    numAltitude[donnees] = [status.altitude];


                },
        error:
                function (xhr, status, error)
                {
                    console.log("param : " + JSON.stringify(xhr));
                    console.log("status : " + status);
                    console.log("error : " + error);
                }

    });



//
//    $.getJSON('php/controleur.php',
//            {
//                'commande': 'getPositions'
//            }
//    )
//            .done(function (data, textStatus, jqXHR) {
//
//                $.each(data, function (index, tab) {
//
//
//                    tabJsonLongitude[index] = [tab.longitude]; 
//                    tabJsonLatitude[index] = [tab.latitude];
//                    tabJsonAltitude[index] = [tab.height];
//
//
//                });



}




function afficherCourbesPression()
{
    //   var tabJsonGamma = [];
    var tabJsonPression = [];
    var tabJsonAltitude = [];

    $.getJSON("php/controleur.php", {'commande': 'getDonnees'})
            .done(function (data, textStatus, jqXHR) {

                $.each(data, function (index, ligne) {

                    var d = new Date(ligne.date); // datetime attend un nombre de millisecondes pour cela je dois la convertir la date avec getTime
                    //tabJsonGamma[index] = [d.getTime(), ligne.radiation];
                    tabJsonAltitude[index] = [d.getTime(), ligne.altitude];
                    tabJsonPression[index] = [d.getTime(), ligne.pression];


                });


                // Pression

                Highcharts.chart('containerPression', {

                    title: {
                        text: "Pression en fonction de l'altitude"
                    },

                    chart: {
                        zoomType: 'xy'
                    },

                    xAxis: [{
                            type: 'datetime',
                            crosshair: true
                        }],
                    yAxis: [{// Primary yAxis
                            labels: {
                                format: '{value}hPa',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            },
                            title: {
                                text: 'Pression',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            }
                        }, {// Secondary yAxis
                            title: {
                                text: 'Altitude',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                format: '{value} m',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            opposite: true
                        }],
                    tooltip: {
                        shared: true
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'left',
                        x: 120,
                        verticalAlign: 'top',
                        y: 100,
                        floating: true,
                        backgroundColor:
                                Highcharts.defaultOptions.legend.backgroundColor || // theme
                                'rgba(255,255,255,0.25)'
                    },
                    series: [{
                            name: 'Altitude',
                            type: 'spline',
                            yAxis: 1,
                            data: tabJsonAltitude,
                            tooltip: {
                                valueSuffix: ' m'
                            }

                        }, {
                            name: 'Pression',
                            type: 'spline',
                            data: tabJsonPression,
                            tooltip: {
                                valueSuffix: 'hPa'
                            }
                        }]
                });

                // afficher la courbe de la pression
                $("containerPression").show();
            });
}






function afficherCourbesTemperature()
{

    var tabJsonTemperature = [];
    var tabJsonAltitude = [];

    $.getJSON("php/controleur.php", {'commande': 'getDonnees'})
            .done(function (data, textStatus, jqXHR) {
                $.each(data, function (index, ligne) {

                    var d = new Date(ligne.date); // datetime attend un nombre de millisecondes pour cela je dois la convertir la date avec getTime
                    tabJsonTemperature[index] = [d.getTime(), ligne.temperature];
                    tabJsonAltitude[index] = [d.getTime(), ligne.altitude];


                });
                // temperature

                Highcharts.chart('containerTemperature', {

                    title: {
                        text: "Temperature en fonction de l'altitude"
                    },

                    chart: {
                        zoomType: 'xy'
                    },

                    xAxis: [{
                            type: 'datetime',
                            crosshair: true
                        }],
                    yAxis: [{// Primary yAxis
                            labels: {
                                format: '{value}°C',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            },
                            title: {
                                text: 'Temperature',
                                style: {
                                    color: Highcharts.getOptions().colors[1]
                                }
                            }
                        }, {// Secondary yAxis
                            title: {
                                text: 'Altitude',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                format: '{value} m',
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            opposite: true
                        }],
                    tooltip: {
                        shared: true

                    },
                    legend: {
                        layout: 'vertical',
                        align: 'left',
                        x: 120,
                        verticalAlign: 'top',
                        y: 100,
                        floating: true,
                        backgroundColor:
                                Highcharts.defaultOptions.legend.backgroundColor || // theme
                                'rgba(255,255,255,0.25)'
                    },
                    series: [{
                            name: 'Altitude',
                            type: 'spline',
                            yAxis: 1,
                            data: tabJsonAltitude,
                            tooltip: {
                                valueSuffix: ' m'
                            }

                        }, {
                            name: 'Temperature',
                            type: 'spline',
                            data: tabJsonTemperature,
                            tooltip: {
                                valueSuffix: '°C'
                            }
                        }]
                });

                // afficher la courbe de la temperature
                $("containerTemperature").show();

            });
}










/**
 * 
 * @brief affiche la section Position Ballon
 */
function menuPositionBallon() {
    $("#sectionPosition").show();
    $("#sectionCourbes").hide();
    $("#sectionAccueil").hide();
    $("#sectionTableaudonnees").hide();
    afficherPositionEtAltitude();

}







/**
 * 
 * @brief affiche la section accueil
 */
function menuAccueil() {
    $("#sectionAccueil").show();
    $("#sectionPosition").hide();
    $("#sectionCourbes").hide();
    $("#sectionTableaudonnees").hide();


}




/**
 * 
 * @brief affiche la section courbes des données
 */
function menuCourbes() {

    $("#sectionPosition").hide();
    $("#sectionAccueil").hide();
    $("#sectionCourbes").show();
    $("#sectionTableaudonnees").hide();
    // cacher les container 
    $("#containerPression").hide();
    $("#containerTemperature").hide();






    //associer les evenements click sur les boutons aux fonctions d'affichage ajax

    $("input[type=checkbox][name=switchTemp]").change(function () {
        if (this.checked) {
            // Si la case est cochée, on fait des traitements
            afficherCourbesTemperature();

            $("#containerTemperature").show();
        } else {
            // Si la case est n'est pas cochée, on cache la courbe
            $("#containerTemperature").hide();
        }
    });

    $("input[type=checkbox][name=switchPress]").change(function () {
        if (this.checked) {
            // Si la case est cochée, on fait des traitements
            afficherCourbesPression();
            $("#containerPression").show();

        } else {
            // Si la case est n'est pas cochée, on cache la courbe
            $("#containerPression").hide();
        }
    });


    //   $("#formcheck1").click(afficherCourbesPression);
    //   $("#formcheck2").click(afficherCourbesTemperature);
}



/**
 * 
 * @brief affiche la section tableau des donnees
 */
function menuTableau() {

    $("#sectionPosition").hide();
    $("#sectionAccueil").hide();
    $("#sectionCourbes").hide();
    $("#sectionTableaudonnees").show();




}











function afficherTableau()
{



    // je récupere les données    
    $.getJSON("php/controleur.php", {'commande': "getInformations"})
            .done(function (data, textStatus, jqXHR) {




                $('#tableauMesures').DataTable(
                        {
                            "retrieve": true,
                            "data": data,

                            "columns": [
                                {title: "Date"},
                                {title: "Altitude"},
                                {title: "Température"},
                                {title: "Pression"},
                                {title: "Radiation"},
                            ],

                            "lengthMenu": [[5, 10, 15, 25, 50, 100, -1], [5, 10, 15, 25, 50, 100, "Tous"]],
                            "pageLength": 5,
                            "language": {
                                "lengthMenu": "Afficher _MENU_ lignes par page",
                                "info": "page _PAGE_ sur _PAGES_",
                                "infoEmpty": "pas de résultat",
                                "search": "Recherchez: ",
                                "paginate": {
                                    "first": "Premier",
                                    "last": "Dernier",
                                    "next": "Suivant",
                                    "previous": "Précédent"
                                },
                            }
                        }
                );
            })
            .fail(function (xhr, text, error) {
                console.log("param : " + JSON.stringify(xhr));
                console.log("status : " + text);
                console.log("error : " + error);
            })
}









// actions à réaliser au chargement de la page d'accueil
$(document).ready(function ()
{

//        //gestion surbrillance menu
//      $(".nav").click(function () {
//        $.each($(".nav"), function () {
//            $(this).removeClass("active");
//        });
//        $(this).addClass("active");
//     });

    // gestion des selections de menu
    $("#accueil").click(menuAccueil);
    $("#position").click(menuPositionBallon);
    $("#courbes").click(menuCourbes);
    $("#tableaudonnees").click(menuTableau);
    $("#tableaudonnees").click(afficherTableau);
    menuAccueil();


});



