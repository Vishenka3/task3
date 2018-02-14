$(document).ready(function() {
    $('#overlay').fadeIn(400,
        function(){
            $('#modal_form')
                .css('display', 'block')
                .animate({opacity: 1, top: '50%'}, 200);
        });

    //Задание исходных данных и конфигов
    var resultsCities = [];
    var grammar;

    var config = {      //конфиг для Papa Parse
        delimiter: ",",
        newline: "",
        quoteChar: '',
        header: false,
        dynamicTyping: false,
        preview: 0,
        encoding: "UTF-8",
        worker: false,
        comments: false,
        step: undefined,
        complete: function(results) {
            resultsCities = results.data;
            for(var i=0;i<resultsCities.length;i++){        //Заполнение массива городов
                resultsCities[i]=resultsCities[i][0];
            }
            //console.timeEnd('test callback');
            $('#modal_form').animate({opacity: 0, top: '45%'}, 400,  //блашка для невозможности взаимодействия со страниецей и отвлечения пользователя
                function(){
                    $(this).css('display', 'none');
                    $('#overlay').fadeOut(600);
                });
            grammar = "#JSGF V1.0; grammar resultsCities; public <color> = " + resultsCities.join(" | ") + " ;";  //задание словаря для распознавания речи
            speechRecognitionPrepare();  //вызов функции подготовки распознавания
        },
        error: function(error) {
            console.log(error);
        },
        download: true,
        skipEmptyLines: undefined,
        chunk: undefined,
        fastMode: true,
        beforeFirstChunk: undefined,
        withCredentials: undefined
    };

    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;


    //console.time('test callback');
    Papa.parse("cities.csv", config);   //Вызов функции парсинка csv файла перед началом игры. Такой способ выбрал,
                                        //т.к. подгрузка 1.5кк строк занимает от 6с времени и каждый раз обращаться к фалу было бы очень долго

    function speechRecognitionPrepare(){        //Функция распознования речи
        recognition.onresult = function(event) {
            var last = event.results.length - 1;
            var city = event.results[last][0].transcript;
            $("#cityName").val(city);
        };

        recognition.onspeechend = function() {
            recognition.stop();
        };

        recognition.onnomatch = function(event) {
            $("#comunication").text('Не понимаю что вы сказали ):');
        };
    }

    $("#speech").click(function () {
        recognition.start();
    });

    ymaps.ready(function() {        //Подгрузка API
        var myMap = new ymaps.Map("map", {
            center: [52.111406,26.102473],
            zoom: 3
        });
        myMap.controls.add(
            new ymaps.control.ZoomControl()
        );
        var lastComputerChar;
        var playerAnswers = [];
        var computerAnswers = [];
        var errorFlag = 0;
        var fairAnswer = 1;

        function locate(cityName, color) {  //Функция геолокации
            var myGeocoder = ymaps.geocode(cityName, {results: 1, kind: 'locality'});
            myGeocoder.then(
                function (res) {
                    if(res.geoObjects.get(0)) {
                        errorFlag = 0;
                        fairAnswer = 1;
                        var coords = res.geoObjects.get(0).geometry.getCoordinates();
                        myMap.setCenter(coords, 7);
                        myMap.geoObjects.add(       //Размещение балуна
                            new ymaps.Placemark(coords,
                                {iconContent: ''},
                                {preset: 'twirl#' + color + 'StretchyIcon'}
                            )
                        );
                    }else{
                        $("#comunication").text('Упс, кажется такого города нет.');
                        errorFlag = 1;
                        fairAnswer = 0;
                    }
                },
                function (err) {
                    console.log('Ошибка');
                }
            );
        }

        function computerAnswer(lastChar){      //Функция ответа компьютера
            fairAnswer = 1;
            for(var i=0;i<resultsCities.length;i++){
                if(!resultsCities[i].charAt(0).localeCompare(lastChar)){
                    for(var j=0;j<playerAnswers.length;j++){
                        if(resultsCities[i].localeCompare(playerAnswers[j])===0){
                            fairAnswer = 0;
                        }
                    }
                    if(!errorFlag && fairAnswer){
                        locate(resultsCities[i], 'red');
                        computerAnswers.push(resultsCities[i]);
                        lastComputerChar=resultsCities[i].charAt(resultsCities[i].length-1).toUpperCase(); //Последняя буква ответа компьютера
                        resultsCities.splice(i,1);
                        return 'Мой ответ: ' + computerAnswers[computerAnswers.length-1] + '. \nТебе на "'+lastComputerChar +'"';
                    }
                }
            }
            for(i=0;i<playerAnswers.length;i++) {
                $('#playerList').append('<li>' +playerAnswers[i] + '</li>');
            }
            for(i=0;i<computerAnswers.length;i++) {
                $('#computerList').append('<li>' +computerAnswers[i] + '</li>');
            }
            $('#overlay').fadeIn(400,       //Вывод модального окна с итогами, в случае невозможности подобрать подходящий город компьютером
                function(){
                    $('#modal_form')
                        .css({'display': 'block', 'width': '70vw', 'height': '70vh', 'left': '15vw', 'background': 'white'})
                        .animate({opacity: 1, top: '15vh'}, 200);
                    $('.cssload-container , #smallText').css('display', 'none');
                    $('#answersList , #victory').css('display','block');
                }).click(
                function(){
                    location.reload();
                }
            );
        }

        $("#submit").click(function () {    //Подтвердить ввод города
            var fairAnswer = 1;
            var cityName = $("#cityName").val();
            for(var i=0;i<playerAnswers.length;i++){
                if(cityName.localeCompare(playerAnswers[i])===0){
                    fairAnswer = 0;
                }
            }
            for(i=0;i<computerAnswers.length;i++){
                if(cityName.localeCompare(computerAnswers[i])===0){
                    fairAnswer = 0;
                }
            }
            if(fairAnswer) {
                var lastChar = cityName.charAt(cityName.length - 1).toUpperCase();
                console.log('lastChar ' + lastChar);
                if (!lastComputerChar) {
                    locate(cityName, 'green');  //Вызов функции геолокации
                    if (!errorFlag) {
                        playerAnswers.push(cityName);
                        $("#comunication").text(computerAnswer(lastChar)); //Вызов функции ответа компьютера
                    }
                } else {
                    if (cityName.charAt(0) === lastComputerChar) {
                        if (!errorFlag) {
                            locate(cityName, 'green');
                            $("#comunication").text(computerAnswer(lastChar));
                        }
                    }
                    else {
                        $("#comunication").text('Первая буква твоего города должна совпадать с "'+lastComputerChar+'" :( Попрробуй еще раз!')
                    }
                }
            }else{
                $("#comunication").text('Этот город уже был! Не пытайся обмануть меня');
            }
        });

        $("#giveup").click(function () {        //Сдаться и просмотреть итоги матча
            for(var i=0;i<playerAnswers.length;i++) {
                $('#playerList').append('<li>' +playerAnswers[i] + '</li>');
            }
            for(i=0;i<computerAnswers.length;i++) {
                $('#computerList').append('<li>' +computerAnswers[i] + '</li>');
            }
            $('#overlay').fadeIn(400,
                function(){
                    $('#modal_form')
                        .css({'display': 'block', 'width': '70vw', 'height': '70vh', 'left': '15vw', 'background': 'white'})
                        .animate({opacity: 1, top: '15vh'}, 200);
                    $('.cssload-container , #smallText').css('display', 'none');
                    $('#answersList , #defeat').css('display','block');
                }).click(
                function(){
                    location.reload();  //Новая игра при перезагрузке страницы
                }
            );
        });

    });

});
