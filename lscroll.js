(function($){
    var lScrollMethods = {
        // Функция инициализации
        init: function(){
            // Получаем jQuery - объект, к которому применяется плагин
            var $thisIs = this;
            initStart($thisIs);
            // Функция инициализации
            function initStart(jqObj){
                // Проверяем есть ли объект физически и один ли он
                if(jqObj.length > 0){
                  jqObj.each(function(){
                      var param = new initParam();
                      // Сохраняем объект в массиве
                      //objParams.push(param);
                      //console.log(objParams);
                      // Инициализация html-конструктора
                      //param.htmlConstructor($(this));
                      param.htmlRebuld($(this));
                  });
                }else{
                  return false;
                }
            };
            
        },
        destroy: function(jqObj){
            if(jqObj !== undefined){
                // Переинициализация
                var $thisIs = jqObj;
            }else{
                // Прямой вызов метода
                var $thisIs = this;
            }

            var $contentBox = $thisIs.find('.lScrollContent');
            var $content = $contentBox.children();
            $contentBox.unwrap();
            $content.unwrap();
            $thisIs.removeClass('lscrollMainContainer')
                   .attr('style', '');
            $thisIs.find('.vertical-bar').remove();
            $thisIs.find('.horizontal-bar').remove();

            //$contentBox.unwrap();
            /*var content = $contentBox.find('*').clone('true');
            if($contentBox.length > 0){
                $thisIs.removeClass('lscrollMainContainer')
                   .attr('style', '')
                   .html("")
                   .append(content);
            }*/
            /*var content = $contentBox.html();
            if($contentBox.length > 0){
                $thisIs.removeClass('lscrollMainContainer')
                   .html(content)
                   .attr('style', '');
            }*/
            // Надо как-то удалить сам объект после удаления основного контейнера
            
        }
    };
    //var objParams = new Array();
    var initParam = function(){
        return param = {
        // Высота родительского блока
        containerHeight: 0,
        // Ширина родительского блока
        containerWidth: 0,
        // Высота блока с контентом
        contentHeight: 0,
        // Ширина блока с контентом
        contentWidth: 0,
        // Ширина полосы браузерного скроллбара
        scrollWidth: 0,
        // Высота вертикального бара - ползунка
        vertBarHeight: 0,
        // Ширина горизонтального бара
        horizBarWidth: 0,
        // Нужен ли вертикальный скролл - boolean
        giveVerticalScroll: false,
        // Нужен ли горизонтальный скролл - boolean
        giveHorizontalScroll: false,
        //Ссылка на главный контейнер - обёртку
        lScrollMainContainer: false,
        //Ссылка на контейнер
        lScrollContainer: false,
        //Ссылка на контейнер с контентов
        lScrollContent: false,
        //Ccылка на контейнер для вертикального ползунка
        verticalScroll: false,
        //Ccылка на вертикальный ползунок
        verticalScrollSlider: false,
        //Ccылка на контейнер для горизонтального ползунка
        horizontalScroll: false,
        //Ccылка на горизонтальный ползунок
        horizontalScrollSlider: false,

        htmlRebuld: function(jqObj){
            if(!jqObj.hasClass('lscrollMainContainer')){
                this.htmlConstructor(jqObj);
            }else{
                lScrollMethods.destroy(jqObj);
                this.htmlConstructor(jqObj);
            }
        },      
        htmlConstructor: function(jqObj){
            // Перед преобразованиями структуры элемента определим максимальную ширину содержимого контейнера
            this.getWidthContent(jqObj);
            // Изменение разметки
            /*var htm = jqObj.html();
            var newHtm = "<div class='lScrollContainer'><div class='lScrollContent'>"+htm+"</div></div>";
            jqObj.html(newHtm)
                 .addClass('lscrollMainContainer');*/

            jqObj.addClass('lscrollMainContainer')
                 .wrapInner("<div class='lScrollContainer'><div class='lScrollContent'></div></div>");
            /*var newHtm = jqObj.children().clone(true);
            console.log(newHtm);
            jqObj.addClass('lscrollMainContainer')
                 .html("")
                 .append("<div class='lScrollContainer'><div class='lScrollContent'></div></div>")
                 .find('.lScrollContent')
                 .append(newHtm);*/

                 
            this.objParamCalculator(jqObj);
        },
        objParamCalculator: function(jqObj){
            // Подсчет геометрических параметров и расстановка необходимых css - свойств
            this.getScrollWidth();
            this.getContainerSize(jqObj);
            this.getContentSize(jqObj.find('.lScrollContent'));
            this.getGiveVerticalScroll(this.containerHeight, this.contentHeight);
            this.getGiveHorizontalScroll(this.containerWidth, this.contentWidth);

            if(this.giveVerticalScroll || this.giveHorizontalScroll){
                var $mainContainer = jqObj;
                var $container = jqObj.find('.lScrollContainer');
                var $content = $container.find('.lScrollContent');
                var h, w;

                if(this.giveHorizontalScroll){
                    h = this.containerHeight + this.scrollWidth;
                }else{
                    h = this.containerHeight;
                }
                if(this.giveVerticalScroll){
                    w = this.containerWidth + this.scrollWidth;
                }else{
                    w = this.containerWidth;
                }
        
                if($mainContainer.length > 0 && $container.length > 0){
                    // Записываем ссылки на контейнеры в свойства объекта
                    this.lScrollMainContainer = $mainContainer;
                    this.lScrollContainer = $container;
                    this.lScrollContent = $content;
                    // Установки css главного контейнера
                    this.lScrollMainContainer.css({'overflow': 'hidden', 'position' : 'relative', 'height': this.containerHeight, 'width': this.containerWidth});
                    // Добавляем новый контейнер - эмуляция скролла
                    this.lScrollContainer.css({'height': h, 'width': w, 'overflow':'auto', 'position' : 'relative'})
                    this.lScrollContent.css({'position': 'relative', 'height': this.contentHeight});

                    if(this.giveVerticalScroll){
                        var $vertScroll, $vertScrollSlider;
                        this.getVertBarHeight(this.containerHeight, this.contentHeight);
                        this.lScrollMainContainer.append("<div class='vertical-bar'><div class='vertical-bar__slider'></div></div>");
                        this.verticalScroll = $mainContainer.find('.vertical-bar');
                        this.verticalScrollSlider = this.verticalScroll.find('.vertical-bar__slider');
                        if(this.verticalScroll.length > 0 && this.verticalScrollSlider.length > 0){
                            this.verticalScroll.css({'height' : this.containerHeight});
                            this.verticalScrollSlider.css('height', this.vertBarHeight);
                            // Привязываем поведение по скроллингу и перетаскиванию
                            this.addEventVerticalScroll(this.verticalScrollSlider);
                            this.addEventVerticalDragAndDrop(this.verticalScrollSlider);
                        }
                    }
                    if(this.giveHorizontalScroll){
                        var $horizScroll, $horizScrollSlider;
                        this.getHorizBarWidth(this.containerWidth, this.contentWidth);
                        this.lScrollMainContainer.append("<div class='horizontal-bar'><div class='horizontal-bar__slider'></div></div>");
                        this.horizontalScroll = $mainContainer.find('.horizontal-bar');
                        this.horizontalScrollSlider = this.horizontalScroll.find('.horizontal-bar__slider');
                        if(this.horizontalScroll.length > 0 && this.horizontalScrollSlider.length > 0){
                            this.horizontalScroll.css({'width' : this.containerWidth});
                            this.horizontalScrollSlider.css('width', this.horizBarWidth);
                            // Привязываем поведение по скроллингу и перетаскиванию
                            this.addEventHorizontalScroll(this.horizontalScrollSlider);
                            this.addEventHorizontalDragAndDrop(this.horizontalScrollSlider);
                        }
                    }


                }else{
                    $.error('Error, html is not built');
                }
                
            }
        },
        addEventVerticalScroll: function(jqObj){
            if(jqObj.length > 0){
                var thisIs = this;
                thisIs.lScrollContainer.on('scroll', function(){
                    var delta = Math.abs(thisIs.lScrollContent.position().top);
                    // На сколько сместился блок относительно его высоты
                    var relativeDelta = thisIs.containerHeight*delta/thisIs.contentHeight;
                    jqObj.css('top', relativeDelta);
                });
    
            }
        },
        addEventHorizontalScroll: function(jqObj){
            if(jqObj.length > 0){
                var thisIs = this;
                thisIs.lScrollContainer.on('scroll', function(){
                    var delta = Math.abs(thisIs.lScrollContent.position().left);
                    // На сколько сместился блок относительно его ширины
                    var relativeDelta = thisIs.containerWidth*delta/thisIs.contentWidth;
                    jqObj.css('left', relativeDelta);
                });
    
            }
        },
        addEventVerticalDragAndDrop: function(jqObj){
            if(jqObj.length > 0){
                var mainObj = this;
                // Эмуляция движения бара при захвате
                jqObj.on('mousedown', function(e){
                    var $thisIs = $(this);
                    var content = mainObj.lScrollContent;
                    var container = mainObj.lScrollContainer;
                    // регистрируем координату Y
                    var y = e.pageY;
                    var scrTop = container.scrollTop();
                    // регистрируем позицию ползунка
                    var top = Math.round($thisIs.position().top);
                    var contentTop = Math.round(content.position().top);
                    // назначаем событие на mousemovie - вертикальное смещение
                    $(document).on('mousemove', function(e){
                        var y1 = e.pageY;
                        // Движение вниз
                        if(y1 > y){
                            var delta = y1 - y;
                            var posTop = Math.round($thisIs.position().top);
                            var maxTop = Math.round(mainObj.containerHeight - mainObj.vertBarHeight);
                            if(posTop <  maxTop){
                                var bias = top + delta;
                                $thisIs.css('top', bias + 'px');
                                var contentBias = Math.round(bias*mainObj.contentHeight/mainObj.containerHeight);
                                container.scrollTop(contentBias);
                            }else{
                                $thisIs.css('top', maxTop);
                            }

                        }
                        // Движение вверх
                        if(y1 < y){
                            delta = y - y1;
                            if($thisIs.position().top > 0){
                                var bias = Math.round(top - delta);
                                // двигаем ползунок вверх
                                $thisIs.css('top', bias + 'px');
                                // двигаем сам контент
                                var contentBias = Math.round(bias*mainObj.contentHeight/mainObj.containerHeight);
                                container.scrollTop(contentBias)
                            }
                        }
                        // Отмена выделения текста в блоке при перемещении ползунка
                        if(window.getSelection()){
                            window.getSelection().removeAllRanges();
                        }

                    });

                    // Назначаем событие на отпускание мыши
                    $(document, $(this)).on('mouseup', function(e){
                        $(this).off('mousemove');
                    });
                    
                })
            }
        },
        addEventHorizontalDragAndDrop: function(jqObj){
            if(jqObj.length > 0){
                var mainObj = this;
                // Эмуляция движения бара при захвате
                jqObj.on('mousedown', function(e){
                    var $thisIs = $(this);
                    var content = mainObj.lScrollContent;
                    var container = mainObj.lScrollContainer;
                    // регистрируем координату X
                    var x = e.pageX;
                    var scrLeft = container.scrollLeft();
                    // регистрируем позицию ползунка
                    var left = $thisIs.position().left;
                    var contentLeft = content.position().left;
                    // назначаем событие на mousemovie - вертикальное смещение
                    $(document).on('mousemove', function(e){
                        var x1 = e.pageX;
                        // Движение вправо
                        if(x1 > x){
                            var delta = x1 - x;
                            var posLeft = Math.round($thisIs.position().left);
                            var maxLeft = Math.round(mainObj.containerWidth - mainObj.horizBarWidth);
                            if(posLeft <  maxLeft){
                                var bias = left + delta;
                                $thisIs.css('left', bias + 'px');
                                var contentBias = Math.round(bias*mainObj.contentWidth/mainObj.containerWidth);
                                container.scrollLeft(contentBias);
                            }else{
                                $thisIs.css('left', maxLeft);
                            }

                        }
                        // Движение влево
                        if(x1 < x){
                            delta = x - x1;
                            if($thisIs.position().left> 0){
                                var bias = Math.round(left - delta);
                                // двигаем ползунок вверх
                                $thisIs.css('left', bias + 'px');
                                // двигаем сам контент
                                var contentBias = Math.round(bias*mainObj.contentWidth/mainObj.containerWidth);
                                container.scrollLeft(contentBias)
                            }
                        }
                        // Отмена выделения текста в блоке при перемещении ползунка
                        if(window.getSelection()){
                            window.getSelection().removeAllRanges();
                        }

                    });

                    // Назначаем событие на отпускание мыши
                    $(document, $(this)).on('mouseup', function(e){
                        $(this).off('mousemove');
                    });
                    
                })
            }
        },
        getScrollWidth: function(){
            var div = document.createElement('div');
            div.style.overflowY = 'scroll';
            div.style.width = '50px';
            div.style.height = '50px';
            div.style.position = 'fixed';
            div.style.right = '-100000px';
            div.style.visibility = 'hidden';
            
            document.body.appendChild(div);
            var scrollWidth = div.offsetWidth - div.clientWidth;
            document.body.removeChild(div);
            
            if(scrollWidth > 0){
                this.scrollWidth = scrollWidth;
            }else if(scrollWidth == 0){
                this.scrollWidth = 8;
            }
        },
        getContainerSize: function( jqObj ){
            if(jqObj.length > 0){
                //this.containerHeight = jqObj.outerHeight();
                //this.containerWidth = jqObj.outerWidth();
                this.containerHeight = jqObj.height();
                this.containerWidth = jqObj.width();
            }
        },
        getContentSize: function( jqObj ){
            if(jqObj.length > 0){
                this.contentHeight = jqObj.height();
                //this.contentHeight = jqObj.outerHeight();
                //this.contentWidth = jqObj.width();
            }
        },
        getGiveVerticalScroll: function(h1, h2){
            if(h1 < h2){
                this.giveVerticalScroll = true;
            }
        },
        getGiveHorizontalScroll: function(w1, w2){
            if(w1 < w2){
                this.giveHorizontalScroll = true;
            }
        },
        getVertBarHeight: function(h1, h2){
            if(h1 !== 0 && h2 !== 0){
                this.vertBarHeight = Math.round(h1*h1/h2);
            }
        },
        getHorizBarWidth: function(w1, w2){
            if(w1 !== 0 && w2 !== 0){
                this.horizBarWidth = Math.round(w1*w1/w2);
            }
        },
        getWidthContent: function(jqObj){
            if(jqObj){
                // Поиск максимальной ширины содержимого объекта
                var maxWidth = 0;
                var $child = jqObj.children();
                if($child.length > 0){
                    $child.each(function(){
                        //var w = $(this).outerWidth(true);
                        var w = $(this).width();
                        if(w > maxWidth)
                            maxWidth = w;
                    });
                }
                if(maxWidth > 0){
                    this.contentWidth = maxWidth;
                }
            }
        }
    };
    }

    $.fn.lScroll = function( method ) {
        
        if ( lScrollMethods[method] ) {
          return lScrollMethods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            
          return lScrollMethods.init.apply( this, arguments );
        } else {
          $.error( 'Метод с именем ' +  method + ' не существует' );
        }    

    };

})(jQuery);