jQuery(document).ready(function($){

  App = Ember.Application.create();
  
  // Set Router
  
  App.Router.map(function() {
  
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
  
  App.AddressAdd = Ember.View.create({
    name: 'address_add'
  });
  App.AddressAdd = Ember.View.extend({
  
    click: function(evt) {
      cmd('getnewaddress',[""],function(data){
        if( $('table#addressesList').length > 0 ){
          $('table#addressesList tbody').append('<tr><td>'+data+'</td></tr>');
        }
      });
    }
    
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