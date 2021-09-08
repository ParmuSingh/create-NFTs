var fs = require('fs');

var app_config = fs.readFileSync("./config.json");
app_config = JSON.parse(app_config)
app_config = app_config[app_config['use-settings']]

module.exports = {
  config: app_config,
  // log: function(message){
  //   var timestamp = new Date()
  //   // console.log(timestamp+": "+message+"\n")
  //   console.log(message+"\n")
  // },
  // ObjectId: ObjectId
}
