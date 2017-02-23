import { inject, bindable } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';

@inject(Router, Service)
export class DataForm {
    @bindable data = {};
    @bindable error = {};
    sources = [];
    destinations = [];

    indexSource = 0;
    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    getStorage(config) {
        return new Promise((resolve, reject) => {
            var getStorages = [];
            if (config.source.type && config.source.type == "selection") {
                for (var sourceId of config.source.value) {
                    getStorages.push(this.service.getStorageById(sourceId.toString()));
                    this.indexSource++;
                }
            }
            else {
                if (config.source.value) {
                    getStorages.push(this.service.getStorageById(config.source.value.toString()));
                    this.indexSource++
                }
            }
            var getStoragesDestination = [];
            if (config.destination.type && config.destination.type == "selection") {
                for (var destinationId of config.destination.value) {
                    getStorages.push(this.service.getStorageById(destinationId.toString()));
                }
            }
            else {
                if (config.destination.value) {
                    getStorages.push(this.service.getStorageById(config.destination.value.toString()));
                }
            }
            resolve(Promise.all(getStorages));
        })

    }

    itemChanged(e, item) {
        var itemData = e.detail;
        if (itemData) {
            item.itemId = itemData._id;
            item.availableQuantity = 0;
            this.service.getDataInventory(this.data.source._id, item.itemId)
                .then(inventoryData => {
                    if (inventoryData) {
                        item.availableQuantity = inventoryData.quantity;
                    }
                })
        }
    }

    addItem() { 
        var newItem = {};
        newItem.itemId = "";
        newItem.item = {};
        newItem.availableQuantity = 0;
        newItem.quantity = 0;
        newItem.remark = "";
        this.data.items.push(newItem);
    }

    removeItem(item) {
        var itemIndex = this.data.items.indexOf(item);
        this.data.items.splice(itemIndex, 1);
    }

    async attached() {
        var storages = await this.service.getModuleConfig();
        var result = await this.getStorage(storages[0].config);

        this.sources = result.splice(0, this.indexSource);
        this.destinations = result.splice(0);
        this.sources = this.sources.map(source => {
            source.toString = function () {
                return this.name;
            }
            return source;
        })
        this.destinations = this.destinations.map(destination => {
            destination.toString = function () {
                return this.name;
            }
            return destination;
        }) 
    }

    search() {
    }
}