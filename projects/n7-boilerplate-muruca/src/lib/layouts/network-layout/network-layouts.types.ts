export interface NetworkNode {
  id: number;
  label: string;
  group: string;
  payload?: any;
}

export interface NetworkEdge {
  id: number;
  from: number;
  to: number;
  label: string;
}

export interface NetworkLibOptions {
  nodes: {
    shape: string;
    size: number;
    font: {
      size: number;
      color: string;
    };
  };
  edges: {
    arrows: {
      to: { enabled: boolean; scaleFactor: number };
    };
    width: number;
    font: {
      size: number;
      align: string;
      color: string;
    };
    color: {
      color: string;
      highlight: string;
    };
  };
  groups: {
    [key: string]: {
      color: string;
      shape?: string;
      icon?: {
        face: string;
        code: string;
        size: number;
        color: string;
      };
    };
  };
  physics: {
    stabilization: boolean;
    barnesHut: {
      gravitationalConstant: number;
      springLength: number;
      springConstant: number;
    };
  };
  interaction: {
    hover: boolean;
    tooltipDelay: number;
    zoomView: boolean;
    dragView: boolean;
  };
  layout: {
    improvedLayout: boolean;
  };
}

export interface NetworkData {
  containerID?: string;
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  groups?: {
    [key: string]: {
      color: string;
      shape?: string;
      icon?: {
        face: string;
        code: string;
        size: number;
        color: string;
      };
    };
  };
}

export interface GetResourceResponse {
  sections: any;
}
