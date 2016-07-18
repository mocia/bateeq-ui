import {inject, bindable} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Service} from './service';
 
@inject(Router, Service)
export class DataForm {
    @bindable data = {};
    
    constructor(router, service) { 
        this.router = router;
        this.service = service;  
    }

    activate(params) {

    }  
    
    search() { 
        var transferInItem = require('bateeq-models').inventory.TransferInItem; 
        this.service.getOutByCode(this.data.reference)
            .then(dataOut=>{
                //this.dataOut = dataOut;
                var dataOutFirst = dataOut[0];
                this.data.sourceId = dataOutFirst.sourceId
                this.data.destinationId = dataOutFirst.destinationId
                this.data.items = [];   
                for(var i in dataOutFirst.items) {  
                    var item = new transferInItem();
                    var obj = dataOutFirst.items[i]; 
                    item.articleVariantId = obj.articleVariantId;
                    item.quantityOut = obj.quantity;
                    item.quantity = obj.quantity;
                    item.remark = obj.remark;
                    this.data.items.push(item); 
                }   
        })
        .catch(e=> {
            console.log(e);
            alert('Referensi Keluar tidak ditemukan');
        }) 
    } 
}
 