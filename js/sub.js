$(document).ready(function() {

    ymaps.ready(function() {
        /*var country = ymaps.geolocation.country;
        var city = ymaps.geolocation.city;
        $('#country').html('Ваша страна: '+country);
        $('#city').html('Ваш город: '+city);*/
        var myMap = new ymaps.Map("map", {
            center: [52.111406,26.102473],
            zoom: 3
        });
        myMap.controls.add(
            new ymaps.control.ZoomControl()
        );

        $("#submit").click(function () {
            var cityName = $("#cityName").val();
            console.log(cityName);

            var myGeocoder = ymaps.geocode(cityName, {results: 1, kind: 'locality'});
            myGeocoder.then(
                function (res) {
                    if(res.geoObjects.get(0)) {
                        var coords = res.geoObjects.get(0).geometry.getCoordinates();
                        console.log(res.geoObjects.get(0).properties._k);
                        myMap.setCenter(coords, 7);
                        myMap.geoObjects.add(
                            new ymaps.Placemark(coords,
                                {iconContent: ''},
                                {preset: 'twirl#redStretchyIcon'}
                            )
                        );
                        console.log('Координаты объекта :' + res.geoObjects.get(0).geometry.getCoordinates());
                    }else{
                        alert('Такого города нет');
                    }
                    //
                },
                function (err) {
                    console.log('Ошибка');
                }
            );
        });
    });

});

