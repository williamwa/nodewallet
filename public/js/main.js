jQuery(document).ready(function($){

  App = Ember.Application.create();
  
  // Set Router
  
  App.Router.map(function() {
  
    this.route("error",{ path: "/error" });
    this.route("overview", { path: "/overview" });
    this.route("send", { path: "/send" });
    this.route("receive", { path: "/receive" });
    this.route("transactions", { path: "/transactions" });
    
  });
  
  App.OverviewRoute = Ember.Route.extend({
    
    setupController: function(controller){
      cmd( 'getinfo',[],function(data){
        controller.set( 'info',data );
      } );
    }
    
  });
  
  App.TransactionsRoute = Ember.Route.extend({
    
    setupController: function(controller){
      cmd( 'listtransactions',[ "",10 ],function(data){
        controller.set( 'transactions',data.reverse() );
      });
    }
    
  });
  
  App.ReceiveRoute = Ember.Route.extend({
  
    setupController: function(controller){
      cmd( 'getaddressesbyaccount',[""],function(data){
        controller.set( 'addresses',data );
      });
    }
  });
  
  // Set Controller
  
  // Set Helpers
  
  Ember.Handlebars.registerBoundHelper('showDate', function( time ) {
    var pad = function( variable ){
      return ('0'+variable).substr(-2,2);
    }
    var date = new Date();
    date.setTime( time*1000 );
    return date.getFullYear()+'/'+(parseInt(date.getMonth())+1)+'/'+date.getDate()+' '+pad(date.getHours())+':'+pad(date.getMinutes())+':'+pad(date.getSeconds());
  });
  
  Ember.Handlebars.registerBoundHelper('showNegative', function( amount ) {
    if( amount < 0 ){
      return new Handlebars.SafeString('<span class="negative">'+amount+'</span>');
    }
    else{
      return amount;
    }
  });
  
  //set Views

  App.AddressAdd = Ember.View.extend({
  
    click: function(evt) {
      cmd('getnewaddress',[""],function(data){
        if( $('table#addressesList').length > 0 ){
          $('table#addressesList tbody').append('<tr><td>'+data+'</td></tr>');
        }
      });
    }
    
  });
  
  App.RecipientAdd = Ember.View.extend({
  
    click: function(){
      var html = $('li.sendItem:first').html();
      $('ul#sendsList').append('<li class="sendItem brandNew">'+html+'</li>');
    }
  });
  
  App.RecipientRemove = Ember.View.extend({
    click: function(){
      $('li.brandNew').remove();
    }
  });
  
  App.AmountSend = Ember.View.extend({
    click: function(){
    
      var errors = [];
      var sends = {};
      $('li.sendItem').children('form').children('.control-group').removeClass('error');
      $('li.sendItem').children('form').children('.control-group').removeClass('warning');
      $('span.errMsg').remove();
      $('span.successMsg').remove();
      $('div#sendsResult').empty();
      
      $('li.sendItem').each(function(i,e){
      
        var payToAddress = $(e).children('form').children('.control-group').children('.controls').children('input#payToAddress').val();
        var payToAmount = $(e).children('form').children('.control-group').children('.controls').children('input#payToAmount').val();
        
        if( payToAmount == '' || parseFloat(payToAmount) == 0 ){ 
          //payToAmount = 0.00000000;
          $(e).children('form').children('.control-group:first').next().addClass('error');
          $(e).children('form').children('.control-group:first').next().children('.controls').append('<span class="errMsg help-inline">Error,invalid amount!</span>');
          errors.push(i);
        }
        
        if( payToAddress == '' ){ 
          $(e).children('form').children('.control-group:first').addClass('error'); 
          $(e).children('form').children('.control-group:first').children('.controls').append('<span class="errMsg help-inline">Error,address can\'t be blank!</span>');
          errors.push(i); 
        }
        else if( !BtcAddressValidate(payToAddress) ){
          $(e).children('form').children('.control-group:first').addClass('warning'); 
          $(e).children('form').children('.control-group:first').children('.controls').append('<span class="errMsg help-inline">Error,invalid address format!</span>');
          errors.push(i); 
        }
        else{
        
          //
          sends[payToAddress] = parseFloat(payToAmount);
          
        }
        
      });
      
      if( errors == '' ){
      
        //send
        cmd('sendmany',["",sends],function(data){
           if( typeof data.code != "undefined" ){
              //error
              $('div#sendsResult').append('<p class="alert alert-error"><strong>Failded!</strong><br/>Error Code: '+data.code+'</p>');
            }
            else{
              //success
              $('div#sendsResult').append('<p class="alert alert-success"><strong>Success!</strong><br/>Bitcoins has been sent successfully!');
            }
        });
        
      }
    }
  });
  
});

var cmd = function(method,params,cb){
  var $ = jQuery;
  rpc = JSON.stringify({
    method:method,
    params:params
  });
  $.post('/cmd',{rpc:rpc},function(data){
  
    console.log(data);
    if( typeof data.errno != "undefined"){
      window.location.href = '#/error';
    }
    else{
      cb(data);
    }
   
  });
}

function BtcAddressValidate( address ){
  var pattern = /^[a-zA-Z1-9]{27,35}$/;
  return pattern.test( address );
}