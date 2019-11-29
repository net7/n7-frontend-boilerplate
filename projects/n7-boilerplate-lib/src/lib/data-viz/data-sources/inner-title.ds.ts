import { DataSource } from '@n7-frontend/core';

export class DvInnerTitleDS extends DataSource {

	protected transform(data){
		return {
			title: {
				main: {
					text:"Dipendenti",
					classes: "n7-main-widget-title",
				},
				secondary: {
					text: "Dipendeti al 10/10/10",
					classes: "n7-secondary-widget-title",
				}
			},
		}
	}
}
