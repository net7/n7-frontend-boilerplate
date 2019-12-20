import { DataSource } from '@n7-frontend/core';

export class DvDatepickerWrapperDS extends DataSource {
    private _datepicker: any = null;

    protected transform(data){ 
        return {
            //set select option
           select: {
                id:"dv-select",
                hidden: true,
                icon: "n7-icon-angle-down",
                label: "Last week",
                items: [
                    {
                        text: "Last week",
                        payload: "lastWeek",
                    },
                    {
                        text: "Last month",
                        payload: "lastMonth",
                    },
                    {
                        text: "Last year",
                        payload: "lastYear",
                    },
                    {
                        text: "Select Date",
                        //this payload key is use for visualise the datepicker.
                        payload: "ByDate",
                    }
                ],
                classes:"dv-datepicker-select-dropdown",
            },
            //set picker
            datepicker: {
                hidden: true,
                data: {
                    id: 'datepicker',
                    libOptions: {
                        dateFormat: 'Y-m-d',
                        mode: 'range',
                    },
                    getInstance: (datepicker) => this._datepicker = datepicker,
                    _elementId: 'datepicker',
                    options: {
                        dateFormat: 'Y-m-d',
                        // defaultDate: [data.start_date, data.end_date],
                        mode: "range"
                    },
                }
            }
        } 
    }

    open(){
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
            this.open();
            this.output.select.label = payload;
            this.output.select.hidden = true;
            this.output.datepicker.hidden = false;
        }else{
            this.output.select.label = payload;
            this.output.select.hidden = true;
            this.output.datepicker.hidden = true;
        }
    }
    setDate(payload){
        this.output.datepicker.hidden = true;
        this.output.select.label = payload.dateStr;
    }
}