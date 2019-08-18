
var conn = new WebSocket("ws://10.0.10.24:8080");
conn.onopen = function(){
  console.log("conn open");
};

var config = {controls : [{name : "Rot", channels : [1]}, {name : "Grün", channels : [2]}]};

function load_config() {
  config = JSON.parse($("#config-container>textarea").val());
  $("#mixer")[0].innerHTML = "";
  config.controls.forEach(function(elem, index){
    $("#mixer").append(`
      <div class="controller">
      <span>0</span>
      <input type="range" min="0" max="255" value="0" class="slider" name="${elem.name}" index="${index}" orient="vertical">
      <span>${elem.name}</span>
      <span>${elem.channels}</span>
      </div>`);
  });
  $(".slider").each(function(elem){
    $(this).on("input", function(){
      $(this).parent().children("span")[0].innerHTML = this.value;
      conn.send(JSON.stringify({channel : config.controls[$(this).attr("index")].channels, value : this.value}));
    });
  });
};

$("#config-container>textarea").val(JSON.stringify(config));
load_config();

$("#save-config").on("click", load_config);
