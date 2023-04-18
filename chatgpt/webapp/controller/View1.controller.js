
sap.ui.define([
    "sap/m/MessageToast",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (MessageToast, DateFormat, Controller, JSONModel) {
        "use strict";

        return Controller.extend("com.ravi.chatgpt.controller.View1", {
            
            onInit: function() {
                // set mock model
                var jsonFeed = {"EntryCollection":[]};
                jsonFeed.EntryCollection.push({
                    "Author" : "Ravi Soni",
                    "AuthorPicUrl" : "",
                    "Type" : "Request",
                    "Date" : new Date(),
                    "Text" : "Start chat" })
                var oModel = new JSONModel();
                oModel.setData(jsonFeed);
                this.getView().setModel(oModel);
            },

            callGPTResult:async function(prompt){
           
                var that = this;
                fetch(
                    `https://api.openai.com/v1/completions`,
                      {
                          body: JSON.stringify({"model": "text-davinci-003", "prompt": prompt, "temperature": 0, "max_tokens": 1000}),
                          method: "POST",
                          headers: {
                              "content-type": "application/json",
                              Authorization: "Bearer  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",
                          },
                              }
                    ).then((response) => {
                      if (response.ok) {
                          response.json().then((json) => {
                              console.log(json);
                              var oEntry = {
                                Author: "CHATGPT",
                                AuthorPicUrl: "https://www.klippa.com/wp-content/uploads/2023/01/ChatGPT-preview.jpg",
                                Type: "Reply",
                                Date: new Date(),
                                Text: json.choices[0].text

                            };
                
                            // update model
                            var oModel = that.getView().getModel();
                            var aEntries = oModel.getData().EntryCollection;
                            aEntries.unshift(oEntry);
                            oModel.setData({
                                EntryCollection: aEntries
                            });
                          });
                      }
                  });

            },
            callGPTResultImage:async function(prompt){
           
                var that = this;
                that.getView().setBusy(true);
                                fetch(
                    `https://api.openai.com/v1/images/generations`,
                      {
                          body: JSON.stringify({ "prompt": prompt, size: "1024x1024"}),
                          method: "POST",
                          headers: {
                              "content-type": "application/json",
                              Authorization: "Bearer  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",
                          },
                              }
                    ).then((response) => {
                      if (response.ok) {
                          response.json().then((json) => {
                              console.log(json);
                              that.getView().setBusy(false);

                             that.getView().byId("imageChat").setSrc(json.data[0].url);
                
                            // update model
                            that.getView().byId("query").setText("Query - "+prompt);

                          });
                      }
                  });

            },
    
            onPost: function(oEvent) {
                var oFormat = DateFormat.getDateTimeInstance({ style: "medium" });
                var oDate = new Date();
                var sDate = oFormat.format(oDate);
              

           
                if(this.getView().byId("idIconTabBarMulti").getSelectedKey() === "text"){
                         // create new entry
                var sValue = oEvent.getParameter("value");
                var oEntry = {
                    Author: "Ravi Soni",
                    AuthorPicUrl: "https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg",
                    Type: "Reply",
                    Date: new Date(),
                    Text: sValue
                };
    
                var oModel = this.getView().getModel();
                var aEntries = oModel.getData().EntryCollection;
                aEntries.unshift(oEntry);
                oModel.setData({
                    EntryCollection: aEntries
                });
                this.callGPTResult(oEvent.getParameter("value"));
                }else if(this.getView().byId("idIconTabBarMulti").getSelectedKey() === "image"){
                    this.callGPTResultImage(oEvent.getParameter("value"));

                }

            },
    
            onSenderPress: function(oEvent) {
                MessageToast.show("Clicked on Link: " + oEvent.getSource().getSender());
            },
    
            onIconPress: function(oEvent) {
                MessageToast.show("Clicked on Image: " + oEvent.getSource().getSender());
            }
        });
    });
