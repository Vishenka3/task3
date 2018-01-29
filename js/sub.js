$(document).ready(function() {

    ymaps.ready(function() {
        var country = ymaps.geolocation.country;
        var city = ymaps.geolocation.city;

        var myMap = new ymaps.Map("map", {
            center: [52.111406,26.102473],
            zoom: 5
        });

        $('#country').html('Ваша страна: '+country);
        $('#city').html('Ваш город: '+city);

        $("#submit").click(function () {
            var cityName = $("#cityName").val();
            console.log(cityName);

            var myGeocoder = ymaps.geocode(cityName);
            myGeocoder.then(
                function (res) {
                    console.log('Координаты объекта :' + res.geoObjects.get(0).geometry.getCoordinates());
                    var coords = res.geoObjects.get(0).geometry.getCoordinates();
                    myMap.geoObjects.add(
                        new ymaps.Placemark(coords,
                            {iconContent: ''},
                            {preset: 'twirl#redStretchyIcon'}
                        )
                    );

                },
                function (err) {
                    console.log('Ошибка');
                }
            );
        });
    });


});

