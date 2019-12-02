import { DataSource } from '@n7-frontend/core';

export class DvNavDS extends DataSource {

	protected transform(data){
        return {
			items: [
				{text: "Woking time", payload:"/working-time"},
				{text: "Temperature", payload:"/temperature"},
				{text: "Functioning time", payload:"/functioning-time"},
				{text: "Fan speed", payload:"/fan-speed"},
				{text: "Tension and power", payload:"/tension-and-power"},
				{text: "Status", payload:"/status"},
			]
		};
	}
}
