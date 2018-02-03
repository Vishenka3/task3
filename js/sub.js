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
            locate(cityName);

        });

        function locate(cityName) {
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
        }

        $("#reset").click(function () {
            console.time('test callback');
            var cityName ="\""+ $("#cityName").val() + "\"";
            var file = document.getElementById('fileItem').files[0];
            var results = [];
            var k=0;
            var config = {
                delimiter: ",",	// auto-detect
                newline: "\r",	// auto-detect
                quoteChar: '"',
                header: true,
                dynamicTyping: false,
                preview: 0,
                encoding: "",
                worker: false,
                comments: false,
                step: function(row) {
                    results.push(row.data);
                    if(cityName.localeCompare(row.data[0].title_ru) === 0)  k=1;
                },
                complete: function() {
                    console.log("Количество: " + results.length);
                    k===1 ?  console.log("Нашелся") : console.log("He нашелся");
                    k=0;
                    console.log("results " + results[4][0].title_ru);
                    console.timeEnd('test callback');
                    locate(cityName);
                },
                error: function(error) {
                    console.log(error);
                },
                download: false,
                skipEmptyLines: false,
                chunk: undefined,
                fastMode: true,
                beforeFirstChunk: undefined,
                withCredentials: undefined
            };
            Papa.parse(file, config);
            //console.log("results " + results);
            /*Papa.parse(file,{
                header: true,
                delimiter: ",",
                step: function(row) {
                    console.log("Row:", row.data);
                },
                complete: function() {
                    console.log();
                }
            });*/
        });

    });

});

