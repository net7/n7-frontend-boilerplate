import { DataSource } from '@n7-frontend/core';
import { CHART_MOCK } from "@n7-frontend/components";

export class DvGraphDS extends DataSource {

	protected transform(data){
        return CHART_MOCK;
	}
}
