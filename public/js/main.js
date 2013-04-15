jQuery(document).ready(function($){

  $('#status').click(function(){
    cmd('getinfo',[],function(data){
      //console.log(data);
      var info = [];
      for(k in data){
        info.push(k+':'+data[k])
      }
      $('#wallet').html(info.join('<br>'));
    });
    return false;
  });

  $('#txs').click(function(){
    cmd('listtransactions',[],function(data){
      //console.log(data);
      var info = [];
      $(data).each(function(i,tx){
        info.push(JSON.stringify(tx))
      });
      $('#wallet').html(info.join('<hr/>'));
    });
    return false;
  });
});

var cmd = function(method,params,cb){
  var $ = jQuery;
  rpc = JSON.stringify({
    method:method,
    params:params
  });
  $.post('/cmd',{rpc:rpc},cb);
}