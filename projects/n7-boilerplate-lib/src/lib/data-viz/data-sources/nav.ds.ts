import { DataSource } from '@n7-frontend/core';

export class DvNavDS extends DataSource {

	protected transform(data){
        return {
			items: [
				{text: "Woking time", payload:"WorkingTime"},
				{text: "Temperature", payload:"Temperature"},
				{text: "Functioning time", payload:"FunctioningTime"},
				{text: "Fan speed", payload:"FanSpeed"},
				{text: "Tension and power", payload:"TensionAndPower"},
				{text: "Status", payload:"Status"},
			]
		};
	}
}
