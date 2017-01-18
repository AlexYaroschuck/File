var KnockoutUtils = {
    SetImageVersion: function (image, size) {
        return image.replace(/(.+-)(\w*)([.]jpg)/g, String.format("$1{0}$3", size));
    },
    UpdateArray: function (dest, arr, mappingOptions) {
        dest.removeAll();

        if (arr == null)
            return;

        if (mappingOptions == null)
            mappingOptions = {};

        $.each(arr, function (i, v) {
            dest.push(ko.mapping.fromJS(v, mappingOptions));
        });
    },
    ConvertUrl: function (url) {
        url = url.replace(/%20/g, "-");
        url = url.replace(/ /g, "-");
        url = url.replace(/\/\//g, "/");
        return url.replace(/-&-/g, "-qqq-")
            .replace(/-\/-/g, "-eee-")
            .replace(/-%26-/g, "-qqq-")
            .replace(/%22/g, "");
    },
    GetContentItemImage: function (uri) {
        return String.format("{0}/{1}", UserModule.CurrentStore.HttpImagesRoot, ko.unwrap(uri));
    },
    GetFormattedDate: function (date, momentFormat) {
        return String.isNullOrEmpty(date) ? "" : moment(date).format(momentFormat);
    },
    IsFloat(n) {
        return n === +n && n !== (n | 0);
    },
    addressString: function (prop) {
        return ko.computed(function () {
            var result = (String.isNullOrEmpty(prop.Address.AddressLine1()) ? "" : (prop.Address.AddressLine1() + ", ")) +
            (String.isNullOrEmpty(prop.Address.AddressLine2()) ? "" : (prop.Address.AddressLine2() + ", ")) +
            (String.isNullOrEmpty(prop.Address.City()) ? "" : (prop.Address.City() + ", ")) +
            (String.isNullOrEmpty(prop.Address.Country()) ? "" : (prop.Address.Country() + ", ")) +
            (String.isNullOrEmpty(prop.Address.State()) ? "" : (prop.Address.State() + ", ")) +
            (String.isNullOrEmpty(prop.Address.ZipPostal()) ? "" : (prop.Address.ZipPostal() + ", "));
            return result.slice(0, -2);
        }, this);
    },
    convertAddress: function (addr) {
        return (String.isNullOrEmpty(addr.AddressLine1) ? "" : (addr.AddressLine1 + ", ")) +
            (String.isNullOrEmpty(addr.AddressLine2) ? "" : (addr.AddressLine2 + ", ")) +
            (String.isNullOrEmpty(addr.City) ? "" : (addr.City + ", ")) +
            (String.isNullOrEmpty(addr.Country) ? "" : (addr.Country + ", ")) +
            (String.isNullOrEmpty(addr.State) ? "" : (addr.State + ", ")) +
            (String.isNullOrEmpty(addr.ZipPostal) ? "" : (addr.ZipPostal + ", "));
    },
    formatCurrency:function (amount) {
        if (!amount) {
            return "";
        }
        amount += '';
        x = amount.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return "$ " + x1 + x2;
    }
}
ko.bindingHandlers.boolValue = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var observable = valueAccessor(),
            interceptor = ko.computed({
                read: function () {
                    return observable().toString();
                },
                write: function (newValue) {
                    observable(newValue === "true");
                }
            });

        ko.applyBindingsToNode(element, { value: interceptor });
    }
};

ko.bindingHandlers.date = {
    convertDateTimeStringAMPM: function (date) {
        var ampm = "AM";
        var result = date.getFullYear() + '-' + (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + date.getDate();

        var hours = date.getHours();
        var minutes = date.getMinutes();
        if (hours === 0)
            hours = 12;
        else if (hours > 12) {
            ampm = "PM";
            hours = hours - 12;
        }

        result = result + ' ' + (hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;

        return result;
    },
    convertDateTimeString: function (date) {
        var result = date.getFullYear() + '-' + (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + date.getDate();

        var hours = date.getHours();
        var minutes = date.getMinutes();

        result = result + ' ' + (hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);

        return result;
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var value = ko.unwrap(valueAccessor());

        if (typeof value === "string") {
            value = moment(new Date(value)).format('L');
        }

        //value = ko.bindingHandlers.date.convertDateTimeString(value);

        $(element).text(value);
    }
};

ko.extenders.error = function (target, message) {
    target.hasError = ko.observable();
    target.validationMessage = ko.observable(message);

    function validate(newValue) {
        target.hasError(false);
    }

    validate(target());

    target.subscribe(validate);

    return target;
};

ko.extenders.length = function (target, options) {
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();

    function validate(newValue) {
        var error = (newValue.length < options.minLength || newValue.length > options.maxLength);
        target.hasError(error);
        target.validationMessage(!error ? "" : options.message || "This field length is wrong");
    }

    validate(target());

    target.subscribe(validate);

    return target;
};

ko.extenders.regex = function (target, options) {
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();

    function validate(newValue) {
        var expr = new RegExp(options.regex);
        var error = !expr.test(newValue);
        target.hasError(error);
        target.validationMessage(!error ? "" : options.message || String.format("This field does not match regex {0}", options.regex));
    }

    validate(target());

    target.subscribe(validate);

    return target;
};

ko.extenders.required = function (target, message) {
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();

    function validate(newValue) {
        target.hasError(newValue ? false : true);
        target.validationMessage(newValue ? "" : message || "This field is required");
    }

    validate(target());

    target.subscribe(validate);

    return target;
};

ko.extenders.positive = function (target, message) {
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();

    function validate(newValue) {
        var newValueAsNum = isNaN(newValue) ? 0 : parseFloat(+newValue);
        var error = newValueAsNum < 0;
        target.hasError(error);
        target.validationMessage(!error ? "" : message || "This field must be positive");
    }

    validate(target());

    target.subscribe(validate);

    return target;
};

ko.extenders.requiredId = function (target, message) {
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();

    function validate(newValue) {
        var newValueAsNum = isNaN(newValue) ? 0 : parseFloat(+newValue);
        var error = newValueAsNum <= 0;
        target.hasError(error);
        target.validationMessage(!error ? "" : message || "This field is required");
    }

    validate(target());

    target.subscribe(validate);

    return target;
};

ko.extenders.numeric = function (target, precision) {
    var result = ko.pureComputed({
        read: target,
        write: function (newValue) {
            var current = target();
            var roundingMultiplier = Math.pow(10, precision);
            var newValueAsNum = isNaN(newValue) ? 0 : parseFloat(+newValue);
            var valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;

            if (valueToWrite !== current) {
                target(valueToWrite);
            } else {
                if (newValue !== current) {
                    target.notifySubscribers(valueToWrite);
                }
            }
        }
    }).extend({ notify: 'always' });

    result(target());

    return result;
};

ko.bindingHandlers.numericText = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        var val = valueAccessor();
        var value = ko.utils.unwrapObservable(val),
            precision = ko.utils.unwrapObservable(allBindingsAccessor().precision) || ko.bindingHandlers.numericText.defaultPrecision,
            formattedValue = KnockoutUtils.IsFloat(value) ? value.toFixed(precision) : value;

        ko.bindingHandlers.text.update(element, function () { return formattedValue; });
    },
    defaultPrecision: 1
};

ko.bindingHandlers.formatter = {
    init: function (element, valueAccessor) {
        var options = ko.unwrap(valueAccessor()) || {},
            instance = new Formatter(element, ko.toJS(options)),
            _processKey = Formatter.prototype._processKey,
            valueSubs, patternSubs, patternsSubs;

        if (ko.isWritableObservable(options.value)) {
            // capture initial element value
            options.value(element.value);
            // shadow the internal _processKey method so we see value changes
            instance._processKey = function () {
                _processKey.apply(this, arguments);
                options.value(element.value);
            };
            // catch the 'cut' event that formatter.js originally ignores
            ko.utils.registerEventHandler(element, 'input', function () {
                options.value(element.value);
            });
            // subscribe to options.value to achieve two-way binding
            valueSubs = options.value.subscribe(function (newValue) {
                // back out if observable and element values are equal
                if (newValue === element.value) return;
                // otherwise reset element and "type" new observable value
                element.value = '';
                _processKey.call(instance, newValue, false, true);
                // write formatted value back into observable
                if (element.value !== newValue) options.value(element.value);
            });
        }
        // support updating "pattern" option through knockout
        if (ko.isObservable(options.pattern)) {
            patternSubs = options.pattern.subscribe(function (newPattern) {
                instance.resetPattern(newPattern);
            });
        }
        // support updating "patterns" option through knockout
        if (ko.isObservable(options.patterns)) {
            patternsSubs = options.patterns.subscribe(function (newPatterns) {
                instance.opts.patterns = newPatterns;
                instance.resetPattern();
            });
        }
        // clean up after ourselves
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            if (valueSubs) valueSubs.dispose();
            if (patternSubs) patternSubs.dispose();
            if (patternsSubs) patternsSubs.dispose();
        });
    }
    // this binding has no "update" part, it's not necessary
};

