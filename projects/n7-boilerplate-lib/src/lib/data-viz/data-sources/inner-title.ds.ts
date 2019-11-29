import { DataSource } from '@n7-frontend/core';
import { INNER_TITLE_MOCK } from "@n7-frontend/components";

export class DvInnerTitleDS extends DataSource {

	protected transform(data){
		return INNER_TITLE_MOCK
	}
}
