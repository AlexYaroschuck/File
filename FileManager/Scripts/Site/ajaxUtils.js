//#########################################################################################################
//###################################### common scripts for application services ##########################
//########################## DO NOT ADD HERE ANYTHING APPLICATION SPECIFIC ################################
//#########################################################################################################

//holds request animated button text and size
var global_RequestButtonText;
var global_RequestButtonWidth;
var global_RequestButtonHeigth;


//#region ###################################### AJAX GLOBAL EVENTS ##########################
//http://api.jquery.com/Ajax_Events/ws
function FireCustomEvent(name) {
    $(document).ready(function () {
        document.dispatchEvent(new CustomEvent(name, { "detail": "Event Fired " + name }));
    });
}

function ConvertCanvasToDataUrl(elem) {
    var canvas = $(elem)[0];

    if (canvas == null)
        return null;

    return canvas.toDataURL();;
}

function Serialize(item) {

    var o = {};
    var a = $(item).serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            var test = $(item).find(String.format('[name="{0}"]', this.name));
            if (test.attr("type") == "checkbox") {
                o[this.name] = $(test).check;
            } else {
                o[this.name] = this.value || '';
            }
        }
    });
    return o;

}
function FormOnAjaxRequest(form, status) {
    var types = ["button", "input"];

    $(types).each(function (index, t) {
        $($(form).find(t)).each(function (i, e) {
            $(e).prop("disabled", status);
        });
    });

}
function WrapCallbackOnAlways(params) {

    if (params.callbackOnAlways == null) {
        params.callbackOnAlways = function () { };
    }

    var t = params.callbackOnAlways;

    params.callbackOnAlways = function () {
        FormOnAjaxRequest(params.form, false);
        t();
    }

    return params;
}

function TempCheckBoxFix(form) {
    $($(form).find('input[type="checkbox"]')).each(function (i, v) {
        $(v).val(v.checked ? "true" : "false");
    });
}
var AjaxRequest = {
    Post: function (params) {
        params.requestType = "POST";
        AjaxRequest.Send(params);
    },

    PostForm: function (params) {
        params.requestType = "POST";
        params.data = JSON.stringify(Serialize(params.form));

        params = WrapCallbackOnAlways(params);
        FormOnAjaxRequest(params.form, true);

        AjaxRequest.Send(params);
    },
    PostFormTest: function (params) {
        params.requestType = "POST";
        //TempCheckBoxFix(params.form);   
        params.data = $(params.form).serialize();
        params.dataType = "json";
        params.contentType = "application/x-www-form-urlencoded";

        params = WrapCallbackOnAlways(params);
        FormOnAjaxRequest(params.form, true);

        AjaxRequest.Send(params);
    },
    PutForm: function (params) {
        params.requestType = "PUT";
        params.data = $(params.form).serialize();
        params.dataType = "json";
        params.contentType = "application/x-www-form-urlencoded";

        params = WrapCallbackOnAlways(params);
        FormOnAjaxRequest(params.form, true);

        AjaxRequest.Send(params);
    },
    Get: function (params) {
        params.requestType = "GET";
        AjaxRequest.Send(params);
    },

    Put: function (params) {
        params.requestType = "PUT";
        AjaxRequest.Send(params);
    },
    Patch: function (params) {
        params.requestType = "PATCH";
        AjaxRequest.Send(params);
    },
    Delete: function (params) {
        params.requestType = "DELETE";
        AjaxRequest.Send(params);
    },

    Send: function (params) {
        var debug = true;

        // Setting defaults
        AjaxRequest.RequestValidator(params);

        if (debug) {
            console.log("Sending ajax request...");
            console.log(String.format("URL : {0}{1}Type : {2}{1}DataType : {3}{1}Data : {4}", params.url, "\n", params.requestType, params.dataType, params.data));
            console.log("Request end");
        }

        var request = $.ajax({
            url: params.url,
            type: params.requestType,
            dataType: params.dataType,
            contentType: params.contentType,
            global: params.useGlobalEvents,
            headers: params.headers,
            cache: false,
            crossDomain: true,
            traditional: true,
            data: params.data,
            async: params.async,
            beforeSend: params.callbackOnBeforeSend
        });

        //bind local events
        if (params.callbackOnDone != null) { request.done(params.callbackOnDone); }

        if (params.callbackOnFail != null) { request.fail(params.callbackOnFail); }

        if (params.callbackOnAlways != null) {
            request.always(params.callbackOnAlways);
        }

    },
    RequestValidator: function (params) {
        if (params.useGlobalEvents == undefined || params.useGlobalEvents == null) params.useGlobalEvents = false;
        if (params.requestType == undefined || params.requestType == null) params.requestType = "GET";
        if (params.dataType == undefined || params.dataType == null) params.dataType = "JSON";
        if (params.async == undefined || params.async == null) params.async = true;
        if (params.beforeSend == undefined || params.beforeSend == null) params.beforeSend = false;

        if (params.contentType == undefined || params.contentType == null) params.contentType = "application/json; charset=UTF-8";

        if (params.url == undefined || params.url == null) {
            alert("Url not specified.");
            params.url = "default_url";
        }
        if (params.headers == null) params.headers = {};

        if (String.contains(params.url, "api.") || String.contains(params.url, ":8882")) {
            var cookie = Cookies.getJSON("ApiToken");
            if (cookie == null) {
                alert("Can`t find Api Cookie. Please, relogin.");
                return false;
            }
            params.headers["Authorization"] = "Bearer " + cookie.access_token;
        }

        if (params.callbackOnDone == undefined || params.callbackOnDone == null) params.callbackOnDone = function () {
            console.log("Ajax. CallbackOnDone executed");
        }
        if (params.callbackOnFail == undefined || params.callbackOnFail == null) params.callbackOnFail = function () {
            console.log("Ajax. СallbackOnFail executed");
        }
        if (params.callbackOnAlways == undefined || params.callbackOnAlways == null) params.callbackOnAlways = function (data) {
            console.log("Ajax. CallbackOnAlways executed \n Data : ");
            console.log(data);
        }
    },
    GetAuthorizationHeader: function () {
        var cookie = Cookies.getJSON("ApiToken");
        if (cookie == null) {
            alert("Can`t find Api Cookie. Please, relogin.");
            return false;
        }

        return { Authorization: "Bearer " + cookie.access_token };
    }
}

// common function to process ajax request result, insert resulting html, display errors and "empty" messages
function AjaxRequestCallbackInsertHtml(params) {
    //#region Params

    //params.InsertMode //this is flag for the html insert position
    //params.result
    //params.$ContentContainer
    //params.$MessageContainer
    //params.successMessage
    //params.emptyMessage
    //params.Append //this is flag for the message
    //params.TriggerOnChange //whatever on change event is triggered

    if (!params.Append) { params.Append = false; }
    if (!params.InsertMode) { params.InsertMode = 'append'; }

    //#endregion

    if (params.result.Success) {
        if (!params.result.IsEmpty) {
            if (params.InsertMode == 'append') {
                params.$ContentContainer.append(params.result.Data.Html);
            }
            else {
                params.$ContentContainer.prepend(params.result.Data.Html);
            }

            if (params.TriggerOnChange) {
                params.$ContentContainer.trigger("OnChange");
            }

            if (params.successMessage) {
                DisplayMessage({ $MessageContainer: params.$MessageContainer, MessageText: params.successMessage, MessageType: "text-success", Append: params.Append });
            }
        }
        else {
            if (params.emptyMessage) {
                DisplayMessage({ $MessageContainer: params.$MessageContainer, MessageText: params.emptyMessage, MessageType: "text-info", Append: params.Append });
            }
        }
    }
    else {
        DisplayErrors({ $MessageContainer: params.$MessageContainer, Data: params.result.Errors, Append: params.Append });
    }
}

// common function to process ajax request result and display result messages
function AjaxRequestCallbackDefault(params) {
    //#region Params

    //params.result
    //params.$MessageContainer
    //params.$ContentContainer
    //params.successMessage
    //params.Append
    //params.TriggerOnChange //whatever on change event is triggered

    if (!params.Append) { params.Append = false; }

    //#endregion

    if (params.result.Success) {
        if (params.successMessage) {
            DisplayMessage({ $MessageContainer: params.$MessageContainer, MessageText: params.successMessage, MessageType: "text-success", Append: params.Append });
        }

        //content can be manipulated only after the calling function, so triggering here OnChange is too early.
        //if (params.TriggerOnChange) {
        //    debugger;
        //    params.$ContentContainer.trigger("OnChange");
        //}
    }
    else {
        DisplayErrors({ $MessageContainer: params.$MessageContainer, Data: params.result.Errors, Append: params.Append });
    }
}

//global error event handler catches unhandled run time errors only. json results are always returned and processed in .done or .always events localy
$(document).ajaxError(function (event, jqXHR, ajaxSettings, thrownError) {
    //create html container
    $('<div>').attr('id', 'ajax-error-dialog').prependTo('body');
    $('<iframe>').prependTo($("#ajax-error-dialog"));

    $("#ajax-error-dialog iframe")[0].contentDocument.write(jqXHR.responseText); //load error details into iframe

    $('div.modal').modal('hide'); //close open dialogs

    $("#ajax-error-dialog").slideDown("slow"); //show error
});

//global send
$(document).ajaxSend(function (e, xhr, s) {    //event,xhr,options 
    console.log("in AJAX GLOBAL EVENTS - ajaxSend()" + s.url)

    var inRequestClass = "spinner2 disabled";
    //new version
    if (s.$AnimationContainer != undefined) {
        //add animation
        s.$AnimationContainer.addClass(inRequestClass); //todo: (alex) set this class name as client application confg value

        //save text for buttons
        if (s.$AnimationContainer.is("button, input[type=submit]")) {
            global_RequestButtonText = s.$AnimationContainer.val();
            s.$AnimationContainer.val('');
        }
    }

    //old version
    //show action animation
    if (s.actionsContainerID != undefined) {
        if ($("#" + s.actionsContainerID) != undefined) {
            console.log("adding .spinner to - #" + s.actionsContainerID);
            // set spinner class
            $("#" + s.actionsContainerID).addClass("spinner");
        }
    }
    if (s.ActionsContainerObject != undefined) {
        console.log("adding .spinner to object: " + $(s.ActionsContainerObject));
        // set spinner class
        $(s.ActionsContainerObject).addClass("spinner");
    }

    //clear old status messages
    if (s.MessageContainerID != undefined) {
        if ($("#" + s.MessageContainerID) != undefined) {
            console.log("cleaning - " + s.MessageContainerID);
            // set spinner class
            $("#" + s.MessageContainerID).html("");
        }
    }

});

//global complete
$(document).ajaxComplete(function (e, xhr, s) {

    var inRequestClass = "spinner2 disabled";
    //new version
    if (s.$AnimationContainer != undefined) {
        //add animation
        s.$AnimationContainer.removeClass(inRequestClass);

        //restore text for buttons
        if (s.$AnimationContainer.is("button, input[type=submit]")) {
            s.$AnimationContainer.val(global_RequestButtonText);
        }
    }

    //old version
    //hide action animation
    if (s.actionsContainerID != undefined) {
        if ($("#" + s.actionsContainerID) != undefined) {
            console.log("removing .spinner from - #" + s.actionsContainerID);
            // remove spinner class
            $("#" + s.actionsContainerID).removeClass("spinner");
        }
    }
    if (s.ActionsContainerObject != undefined) {
        console.log("removing .spinner from - #" + s.ActionsContainerObject);
        // remove spinner class
        $(s.ActionsContainerObject).removeClass("spinner");
    }
});

function DisplayErrors(params) {

    //params.$MessageContainer
    //params.Data
    //params.Append

    var key; var message; var messages = [];

    if (params.Append == null)
        params.Append = false;

    if (!params.Append)
        $(params.$MessageContainer).empty();

    for (var i = 0; i < params.Data.length; i++) { //loop thru keys
        key = params.Data[i].Key;
        for (var j = 0; j < params.Data[i].Value.length; j++) { //loop thru messages
            message = params.Data[i].Value[j];

            DisplayMessage({
                $MessageContainer: params.$MessageContainer,
                MessageText: message,
                MessageType: "text-danger",
                Append: true
            });
        }
    }
}
function ShowApiErrors(resp) {

    if (resp == null || resp.Errors == null)
        return;

    $.each(resp.Errors, function (i, pair) {

        if (pair.Key == "Stack")
            return true;

        $.each(pair.Value, function (i2, value) {

            if (String.isNullOrEmpty(value)) {
                return true;
            }

            toastr["error"](value);
        });
    });
}
function UpdateFormValidationSummary(form, data) {
    if (!form || !data) return;
    var validator = $(form).validate();
    var key; var message; var messages = [];
    for (var i = 0; i < data.length; i++) {
        key = data[i].Key;
        for (var j = 0; j < data[i].Value.length; j++) {
            message = data[i].Value[j];
            if (key) {
                var error = new Object();
                error[key] = message;
            }
            messages.push(message);
        }
    }
    var sumDiv = $("#" + form.attr("id") + " div[data-valmsg-summary=true]");
    var sumLst = $("ul", sumDiv);
    if (sumDiv.length && sumLst.length) {
        PopulateList(sumLst, messages);
        sumDiv.removeClass('validation-summary-valid').addClass('validation-summary-errors');
    }
}
function PopulateList(listObject, data) {
    var items = [];
    for (i = 0; i < data.length; ++i) {
        items.push('<li>' + data[i] + '</li>');
    }
    listObject.html(items.join(''));
}


function DisplayMessage(params) {
    //params.$MessageContainer - message container
    //params.MessageText - text
    //params.MessageType - bootstrap style of message - danger, warning, etc.
    //params.Append (bool) 

    //validate params
    if (params == undefined) {
        throw "Parameters are expected!";
    }

    if (params.$MessageContainer == undefined) {
        throw "Element params.$MessageContainer is not found!";
    }

    if (!params.$MessageContainer.is("ul")) {
        throw "Message container must be of type <ul>!";
    }

    if (params.MessageText == undefined) {
        throw "Message text is missing!";
    }

    //set defaults
    if (params.Append == undefined) { params.Append = false; }

    //clear if needed
    if (!params.Append) { params.$MessageContainer.empty(); }

    //set MessageType
    params.$MessageContainer.removeClass("text-primary text-success text-info text-warning text-danger").addClass(params.MessageType)

    //set text
    params.$MessageContainer.append('<li>' + params.MessageText + '</li>');

    //set to display (just in case)
    params.$MessageContainer.show();
}
