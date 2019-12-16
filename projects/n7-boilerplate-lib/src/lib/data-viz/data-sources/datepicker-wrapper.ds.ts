import { DataSource } from '@n7-frontend/core';
import { DATEPICKER_MOCK } from "@n7-frontend/components";

export class DvDatepickerWrapperDS extends DataSource {
    protected transform(data){  
        return {
            //set select option
           select: {
                id:"dv-select",
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
            datepicker: DATEPICKER_MOCK
        }
    }
}