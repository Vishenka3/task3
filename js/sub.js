$(document).ready(function() {
    ymaps.ready(function() {
        var country = ymaps.geolocation.country;
        var city = ymaps.geolocation.city;

        var myGeocoder = ymaps.geocode("Пинск");
        myGeocoder.then(
            function (res) {
                console.log('Координаты объекта :' + res.geoObjects.get(0).geometry.getCoordinates());
                var coords = res.geoObjects.get(0).geometry.getCoordinates();

                var myMap = new ymaps.Map("map", {
                        center: coords,
                        zoom: 4
                });

                myGeoObject = new ymaps.GeoObject({
                     geometry: {
                         type: "Point",// тип геометрии - точка
                         coordinates: coords // координаты точки
                     }
                 });
                myMap.geoObjects.add(myGeoObject);

                /*myMap.geoObjects.add(
                    new ymaps.Placemark(myGeocoder.geoObjects.get(0).geometry.getCoordinates(),
                        {iconContent: 'Пинск'},
                        {preset: 'twirl#greenStretchyIcon'}
                    )
                );*/

                myMap.balloon.open(myMap.getCenter(),
                    {
                        contentHeader: 'Пинск'
                    }
                );
            },
            function (err) {
                console.log('Ошибка');
            }
        );

        $('#country').html('Ваша страна: '+country);
        $('#city').html('Ваш город: '+city);
    });
});