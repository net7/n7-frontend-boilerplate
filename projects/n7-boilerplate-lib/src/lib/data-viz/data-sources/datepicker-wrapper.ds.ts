import { DataSource } from '@n7-frontend/core';

export class DvDatepickerWrapperDS extends DataSource {
    protected _datepicker: any = null;

    protected transform(data){ 
        return {
            //set select option
           select: {
                id: data.select.id,
                hidden: true,
                icon: "n7-icon-angle-down",
                label: data.select.label,
                items: data.select.items,
                classes:"dv-datepicker-select-dropdown",
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

    openDatepicker(){
        setTimeout(() => this._datepicker.open());
    }

    openDropDown(){
        if(this.output.select.hidden === false) {
            this.output.select.hidden = true;
        }
        else{
            this.output.select.hidden = false;
        }
    }
    setDatepicker(payload){
        if (payload === "ByDate") {
            this.openDatepicker();
            this.output.select.hidden = true;
            this.output.datepicker.hidden = false;
        }else{
            this.output.select.hidden = true;
            this.output.datepicker.hidden = true;
        }
    }
    setDate(payload){
        let range_disable = [];
        this.output.datepicker.hidden = true;
        this.output.select.label = payload.dateStr;
    }
}