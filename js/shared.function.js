var BROWSER = chrome;
var Common = {
    setLocal: function(data={},callback=function(){}){
        BROWSER.storage.local.set(data,callback);
    },
    getLocal: function(key,callback){
        BROWSER.storage.local.get(key,function(data){
            //console.log(data,key);
            callback(data[key]);
        });
    },
    clearStorage:()=>{
        BROWSER.storage.local.clear();
    }
};
var SHARED_SERVICE = {
    isValidLinkedPost: function(url){
        //url = `https://www.linkedin.com/posts/danshumistry-inspiration-motivation-activity-6606839584070348800-YEWN`;
        let isValid=false;
        if(url.indexOf('https://www.linkedin.com/posts/')>=0 || url.indexOf('https://linkedin.com/posts/')){
            let partials = url.split('activity-');
            if(partials.length==2){
                partials = partials[1].split("-");
                if(partials[0].length == 19 && partials[1].length==4){
                    isValid = true;
                }
            }
        }
        return isValid;
    },
    cleanStr:function (str) {
        if (typeof str !== 'undefined') {
            if (str.length)
                str = str.trim();
            str = str
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>');
        } else
            str = "";
        return decodeURIComponent(str);
    },
    escapeHtml:function (str) {
        if (str != "" && typeof str != 'undefined') {
            str = str.replace(/(<([^>]+)>)/ig, " ");
        }
        return str.replace(/\s\s+/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
    },
    renderTemplate:function(container,template,params="",callback=function(){}){
        console.log(template);
        if(container=="")container = "#ui-view";
        $.get('templates/'+template+'.html').done(function (data) {  
            $(container).html(data); 
            METHODS[template](params); 
            callback();
        }); 
    },
    openModal:function(options){
        let defaltSetting = {
            top:'36%',
            height:"20%",
            width:"95%",
            left:"0%",
            html:"",
            bodyClass:"show",
            footerClass:"show",
            headingText:"",
            button:{
                title:"Ok",
                type:'button',
                click:function(){}
            },
            afterHtmlLoaded:function(){}
        };
        options = $.extend(defaltSetting,options);
        let modal = `<div id="myModal" class="modal fade" role="dialog">
            <div class="modal-dialog" style="width:`+options.width+`">
            <div class="modal-content" style="margin-top:`+options.top+`;left:`+options.left+`;height:`+options.height+`">
                <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <p class="text-center"><b>`+options.headingText+`</b></p>
                </div>
                <form method="post" id="modalForm">
                <div class="modal-body `+options.bodyClass+`">`+options.html+`</div>
                <div class="modal-footer `+options.footerClass+`">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="`+options.button.type+`" id="action-button" class="md-button">`+options.button.title+`</button>
                </div>
                </form>
            </div>
            </div>
        </div>`;
        $('body').append(modal);
        if(options.button.type == "submit"){
            $('#modalForm').submit(function(e){
                e.preventDefault();
                options.button.click(hideModal);
                return false;
            });
        }else{
            $('#myModal button#action-button').click(function(){
                options.button.click(hideModal);
            })
        }
        function hideModal(){
            $('#myModal').data('modal', null);
            $( '.modal,#myModal' ).modal( 'hide' ).data( 'bs.modal', null );
            //
        }
        $('#myModal').modal();
        $('#myModal').on('hidden.bs.modal', function(){
            $('.modal').remove();
         });
        options.afterHtmlLoaded(hideModal);
    }
    
};

!function ($) {
    $.callAjax = function(url,data={},callback=function(){},method="POST"){
        var ajaxObj = {
            url:url,
            type:method,
            dataType:"JSON",
            success:function(result){
                callback(true,result);
            },error:function(err){
                callback(false,err);
            }
        };
        if(method.toUpperCase()=="POST"){
            ajaxObj.data = data;
        }
        $.ajax(ajaxObj);
    };
    $.doValidate = function(form){
        $('p.error').hide().html("");
        var allValidateInputs = $(form).find('.validate');
        var isValid = $.grep(allValidateInputs,function(elem){
            var elem = $(elem);
            console.log(elem)
            if(elem.val()==""){
                elem.parent('div').next('p.error').show().html(elem.attr('validate-msg'));
                elem.next('p.error').show().html(elem.attr('validate-msg'));
                return true;
            }
        });
        return isValid.length ==0 ? true : false;
    }
    $.scrollDown = function(div, callback,delay=200,scroll=3500) {
        var scrollValue = typeof div == 'undefined' || div == "" ? scroll :  $(div).offset().top - 100 ;
        $('html,body').animate({ scrollTop: scrollValue }, delay).promise().then(callback);
    };
    $.randomTime = function(min, max){return $.randomNum(min, max) * 1000;};
    $.randomNum = function(min, max) {if (max == null) {max = min;min = 0;}
        return (min + Math.floor(Math.random() * (max - min + 1)));
    };
    $.sleep = function(callback,secons){setTimeout(callback,secons);};
    $.forEachSeries = function (dataSet, iterateFunc, finalCall) {
        if(typeof finalCall == 'undefined')
            finalCall = function(){};
            var executedFunction = 0, funcLength = dataSet.length;
            function getArgs(func) {
                var args = func.toString().match(/function.*?\(([^)]*)\)/)[1];
                return args.split(',').map(function (arg) {
                    return arg.replace(/\/\*.*\*\//, '').trim();
                }).filter(function (arg) {
                    return arg;
                });
            };
            var argsLength = getArgs(iterateFunc).length;
            goNextIteration();
            function callback() {
                executedFunction++;
                goNextIteration();
            };
            function goNextIteration() {
                if (executedFunction < funcLength) {
                    if (argsLength == 1) iterateFunc(callback);
                    else if (argsLength == 2) iterateFunc(dataSet[executedFunction], callback);
                    else if (argsLength == 3) iterateFunc(executedFunction, dataSet[executedFunction], callback);
                } else if(executedFunction == funcLength){
                    finalCall();
                }
            }
        };
    // Water Fall method Execution
    $.waterFall = function (funcList, finalFunc) {
        var passingData = [], executedFunction = 0;
        var funcLength = funcList.length;
        gotoNext();
        function callback() {
            passingData = [];
            for (var i = 0; i < arguments.length; i++)
                passingData[i] = arguments[i];
            executedFunction++;
            gotoNext();
            if (executedFunction == funcLength - 1) {
                finalFunc();
            }
        }
        function dispatch(fn, args) {
            fn = (typeof fn == "function") ? fn : window[fn];
            return fn.apply(this, args || []);
        }
        function gotoNext() {
            if (executedFunction < funcLength) {
                var currentFunction;
                if (typeof funcList[executedFunction] !== 'undefined') {
                    currentFunction = funcList[executedFunction];
                    passingData.push(callback);
                    dispatch(currentFunction, passingData);
                }
            }
        }
    }    
}($);