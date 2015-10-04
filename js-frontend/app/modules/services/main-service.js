angular.module('sp.modules.services',[
  //modulite za drugite servisi
])
  .service('mainService', function(){
    this.apiUrl = 'http://192.168.1.3:3000/'; //api url so se koristit niz aplikacijata
  });
