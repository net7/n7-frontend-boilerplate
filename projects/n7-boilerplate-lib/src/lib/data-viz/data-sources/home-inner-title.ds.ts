import { DataSource } from '@n7-frontend/core';

export class DvHomeInnerTitleDS extends DataSource {
	
	protected transform(data){
		return {
			title: {
				main: {
					text:"Red table supply 001",
					classes: "n7-main-widget-title",
				},
			}
		}
	}
}
