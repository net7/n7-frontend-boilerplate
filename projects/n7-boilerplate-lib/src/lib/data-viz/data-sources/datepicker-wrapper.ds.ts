import { DataSource } from '@n7-frontend/core';
import { DATEPICKER_MOCK } from "@n7-frontend/components";

export class DvDatepickerWrapperDS extends DataSource {
    protected transform(data){  
        return [
            //set select option
            {
                id:"dv-select",
                options: [
                    {
                        text: "last week",
                        payload: "lastWeek",
                    },
                    {
                        text: "last month",
                        payload: "lastMonth",
                    },
                    {
                        text: "last year",
                        payload: "lastYear",
                    },
                    {
                        text: "Select Date",
                        payload: "ByDate",
                    }
                ],
                classes:"dv-datepicker-select-dropdown",
            },
            //set picker
            DATEPICKER_MOCK,
        ]
    }
}