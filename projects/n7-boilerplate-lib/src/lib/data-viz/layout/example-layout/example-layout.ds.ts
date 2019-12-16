import { LayoutDataSource } from '@n7-frontend/core';


export class DvExampleLayoutDS extends LayoutDataSource {
    // for show also the datepiker and the dropdown.
    public showing = {
        dropdown: false,
        datepicker: false,
    }
    // set the selct item value omn click default("select period")
    // FIX: the default value is Select Period ?
    public labelValueDatepicker: string = 'Select Period';
    public autoOpenDatepiker: string;
    //get flatpick DOM element
    public pickerElement = document.getElementsByClassName("flatpickr-calendar")[0];
    setDatepicker( payload ) {
        const pickerElement = document.getElementsByClassName("flatpickr-calendar")[0];
        if(payload === "outClick"){
            pickerElement.classList.remove("open");
        }else if (payload === "ByDate") {
            this.labelValueDatepicker = payload;
            pickerElement.classList.add("open");
            this.showing.datepicker = true;
        }else{
            this.labelValueDatepicker = payload;
            pickerElement.classList.remove("open");
            this.showing.dropdown = false;
            this.showing.datepicker = false;
        }
    }
    
    openDropDown(payload) {
        this.showing.dropdown = payload;
    }

    setDate(payload){
        this.labelValueDatepicker = payload.dateStr;
    }
}