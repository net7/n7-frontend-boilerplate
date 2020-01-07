import { DataSource } from '@n7-frontend/core';

export class DvDatepickerWrapperDS extends DataSource {
    protected _datepicker: any = null;

    protected transform(data){ 
        if(!data){return};
        
        return {
            //set select option
           select: {
                id: data.select.id,
                hidden: true,
                icon: data.select.icon || "n7-icon-angle-down",
                label: data.select.label,
                items: data.select.items,
                classes: data.select.classes,
            },
            //set picker
            datepicker: {
                hidden: true,
                data: {
                    id: data.datepicker.id,
                    libOptions: data.datepicker.libOptions,
                    getInstance: (datepicker) => this._datepicker = datepicker,
                }
            }
        } 
    }

    openDatepicker() {
        setTimeout(() => this._datepicker.open());
    }

    closeDatepicker() {
        setTimeout(() => this._datepicker.close());
    }

    setLabel(paylod) {
        this.output.select.label = paylod.dateStr;
        this.output.datepicker.hidden = true;
    }

    toggleDropDown(){
        if(this.output.select.hidden === false) {
            this.output.select.hidden = true;
        }else{
            this.output.select.hidden = false;
        }
    }

    getDatepicker(payload) {
        if (payload === "ByDate") {
            this.openDatepicker();
            this.output.select.hidden = true;
            this.output.datepicker.hidden = false;
        }else{
            this.closeDatepicker();
            this.output.select.hidden = true;
            this.output.datepicker.hidden = true;
        }
    }

}