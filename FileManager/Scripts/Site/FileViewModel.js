function koFileViewModel() {
    var self = this;
    this.files = ko.observableArray();
    this.oneFile = koFileViewModel.obsevable("");

    this.ServiceGetAll = function() {
        AjaxRequest.Get({
            url: "http://localhost:17340/" + '/file',
            callbackOnDone: function (result) {
                if (result.Data.Success) {
                    if (params != null)
                        params.Success(result.Data);
                    return result.Data;
                } else {
                    params.Fail(result.Data);
                }
            },
            callbackOnFail: function (result) {
                params.Fail(result.responseJSON);
            }
        });
    }

    this.GetAll = function() {
        self.ServiceGetAll({
            Success: function(resp) {
                KnockoutUtils.UpdateArray(self.files, resp);
            },
            Fail: function(resp) {
            }
        });
    }

   // this.ServiceModify
}