import { inject, bindable, computedFrom } from 'aurelia-framework';
import numeral from 'numeral';
const defaultNumberFormat = "0,0.00";

export class CostCalculationRetailMaterial {

    controlOptions = {
        control: {
            length: 12
        }
    };

    async activate(context) {
        this.context = context;
        this.data = this.context.data;
        this.options = this.context.options;
        this.readOnly = true;
        this.data.Conversion = numeral(this.data.Conversion).format(defaultNumberFormat);
        this.data.Total = numeral(this.data.Total).format(defaultNumberFormat);
    }
}
