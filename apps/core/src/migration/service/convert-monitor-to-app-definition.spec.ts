import { convertMonitorToAppDefinition } from './convert-monitor-to-app-definition';
import {
  MonitorAnnotations,
  MonitorMetric,
  MonitorWidgetType,
  SiteWiseMonitorDashboardDefinition,
} from './monitor-dashboard-definition';
import { DashboardWidgetType } from '../../dashboards/entities/dashboard-widget.entity';

const createMonitorChartWidget = (
  widgetType: MonitorWidgetType,
  metrics: MonitorMetric[],
  annotations?: MonitorAnnotations,
  title?: string,
) => {
  return {
    type: widgetType,
    title: title ?? 'test',
    x: 0,
    y: 0,
    height: 3,
    width: 3,
    metrics,
    alarms: [],
    properties: {
      colorDataAcrossThresholds: true,
    },
    annotations,
  };
};

const createApplicationChartDefinition = (
  widgetType: string,
  properties: object,
  height = 23.5,
  width = 41.5,
  x = 0,
  y = 0,
  z = 0,
) => {
  return {
    type: widgetType,
    x,
    y,
    z,
    width,
    height,
    properties,
  };
};

describe('Dashboard definition conversion', () => {
  it('converts a single SiteWise Monitor line chart into an application line chart', () => {
    const metrics = [
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
    ];

    const lineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [createMonitorChartWidget(MonitorWidgetType.LineChart, metrics)],
    };

    const expectedProperties = {
      title: 'test',
      symbol: {
        style: 'filled-circle',
      },
      axis: {
        yVisible: true,
        xVisible: true,
      },
      line: {
        connectionStyle: 'linear',
        style: 'solid',
      },
      legend: {
        visible: true,
      },
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  aggregationType: 'AVERAGE',
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '1m',
                  color: '#7d2105',
                },
              ],
            },
          ],
        },
      },
    };
    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition('xy-plot', expectedProperties),
      ],
    };
    const applicationDefinition =
      convertMonitorToAppDefinition(lineChartDefinition);
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('converts multiple SiteWise Monitor line charts into an application line charts', () => {
    const metrics = [
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
      {
        type: 'iotsitewise',
        label: 'Other metric',
        assetId: '12345678-85db-4c90-854f-4e29d579b898',
        propertyId: '12345678-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
    ];

    const lineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [createMonitorChartWidget(MonitorWidgetType.LineChart, metrics)],
    };

    const expectedProperties = {
      title: 'test',
      symbol: {
        style: 'filled-circle',
      },
      axis: {
        yVisible: true,
        xVisible: true,
      },
      line: {
        connectionStyle: 'linear',
        style: 'solid',
      },
      legend: {
        visible: true,
      },
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  aggregationType: 'AVERAGE',
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '1m',
                  color: '#7d2105',
                },
              ],
            },
            {
              assetId: '12345678-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  aggregationType: 'AVERAGE',
                  propertyId: '12345678-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '1m',
                  color: '#3184c2',
                },
              ],
            },
          ],
        },
      },
    };
    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition(
          DashboardWidgetType.XYPlot,
          expectedProperties,
        ),
      ],
    };
    const applicationDefinition =
      convertMonitorToAppDefinition(lineChartDefinition);
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('convers a single SiteWise Monitor bar chart into an application bar chart', () => {
    const metrics = [
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
    ];

    const barChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [createMonitorChartWidget(MonitorWidgetType.BarChart, metrics)],
    };

    const expectedProperties = {
      title: 'test',
      axis: {
        showX: true,
        showY: true,
      },
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  aggregationType: 'AVERAGE',
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '1m',
                },
              ],
            },
          ],
        },
      },
      styleSettings: {}, // refId is randomly generated so we are just asserting that styleSettings exists
    };
    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition('bar-chart', expectedProperties),
      ],
    };

    const applicationDefinition =
      convertMonitorToAppDefinition(barChartDefinition);
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('convers a single SiteWise Monitor scatter chart into an application scatter chart', () => {
    const metrics = [
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
    ];

    const lineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [
        createMonitorChartWidget(MonitorWidgetType.ScatterChart, metrics),
      ],
    };

    const expectedProperties = {
      title: 'test',
      symbol: {
        style: 'filled-circle',
      },
      axis: {
        yVisible: true,
        xVisible: true,
      },
      line: {
        connectionStyle: 'none',
        style: 'solid',
      },
      legend: {
        visible: true,
      },
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  aggregationType: 'AVERAGE',
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '1m',
                },
              ],
            },
          ],
        },
      },
    };
    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition('xy-plot', expectedProperties),
      ],
    };
    const applicationDefinition =
      convertMonitorToAppDefinition(lineChartDefinition);
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('convers a single SiteWise Monitor timeline chart into an application timeline chart', () => {
    const metrics = [
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
    ];

    const timelineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [
        createMonitorChartWidget(MonitorWidgetType.StatusTimeline, metrics),
      ],
    };

    const expectedProperties = {
      title: 'test',
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  aggregationType: 'AVERAGE',
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '0',
                },
              ],
            },
          ],
        },
      },
      styleSettings: {}, // refId is randomly generated so we are just asserting that styleSettings exists
    };
    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition('status-timeline', expectedProperties),
      ],
    };
    const applicationDefinition = convertMonitorToAppDefinition(
      timelineChartDefinition,
    );
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('convers a single SiteWise Monitor table chart into an application table chart', () => {
    const metrics = [
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
    ];

    const lineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [createMonitorChartWidget(MonitorWidgetType.Table, metrics)],
    };

    const expectedProperties = {
      title: 'test',
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  aggregationType: 'AVERAGE',
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '0',
                },
              ],
            },
          ],
        },
      },
      styleSettings: {}, // refId is randomly generated so we are just asserting that styleSettings exists
    };
    const expectedDefinition = {
      widgets: [createApplicationChartDefinition('table', expectedProperties)],
    };
    const applicationDefinition =
      convertMonitorToAppDefinition(lineChartDefinition);
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('convers a single SiteWise Monitor KPI widget into an application KPI', () => {
    const metrics = [
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
    ];

    const kpiDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [createMonitorChartWidget(MonitorWidgetType.Kpi, metrics)],
    };

    const expectedProperties = {
      title: 'test',
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '0',
                },
              ],
            },
          ],
        },
      },
    };
    const expectedDefinition = {
      widgets: [createApplicationChartDefinition('kpi', expectedProperties)],
    };
    const applicationDefinition = convertMonitorToAppDefinition(kpiDefinition);
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('convers a SiteWise Monitor KPI widget with many properties into many application KPIs', () => {
    const metrics = [
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
    ];

    const kpiDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [createMonitorChartWidget(MonitorWidgetType.Kpi, metrics)],
    };

    const expectedProperties = {
      title: 'test',
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '0',
                },
              ],
            },
          ],
        },
      },
    };
    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition(
          'kpi',
          expectedProperties,
          7.5,
          13.5,
          0,
          0,
          0,
        ),
        createApplicationChartDefinition(
          'kpi',
          expectedProperties,
          7.5,
          13.5,
          14,
          0,
          1,
        ),
        createApplicationChartDefinition(
          'kpi',
          expectedProperties,
          7.5,
          13.5,
          28,
          0,
          2,
        ),
        createApplicationChartDefinition(
          'kpi',
          expectedProperties,
          7.5,
          13.5,
          0,
          8,
          3,
        ),
        createApplicationChartDefinition(
          'kpi',
          expectedProperties,
          7.5,
          13.5,
          14,
          8,
          4,
        ),
      ],
    };
    const applicationDefinition = convertMonitorToAppDefinition(kpiDefinition);
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('convers a single SiteWise Monitor status grid widget into an application status widget', () => {
    const metrics = [
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
    ];

    const lineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [
        createMonitorChartWidget(MonitorWidgetType.StatusGrid, metrics),
      ],
    };

    const expectedProperties = {
      title: 'test',
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '0',
                },
              ],
            },
          ],
        },
      },
    };
    const expectedDefinition = {
      widgets: [createApplicationChartDefinition('status', expectedProperties)],
    };
    const applicationDefinition =
      convertMonitorToAppDefinition(lineChartDefinition);
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });

  it('converts Monitor annotations into Application thresholds', () => {
    const color = '#5e87b5';
    const comparisonOperator = 'LT';
    const showValue = true;
    const value = 100;

    const metrics = [
      {
        type: 'iotsitewise',
        label: 'Total Average Power (Demo Wind Farm Asset)',
        assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
        propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
        dataType: 'DOUBLE',
      },
    ];

    const annotations = {
      y: [
        {
          color,
          comparisonOperator,
          showValue,
          value,
        },
      ],
    };

    const lineChartDefinition: SiteWiseMonitorDashboardDefinition = {
      widgets: [
        createMonitorChartWidget(
          MonitorWidgetType.LineChart,
          metrics,
          annotations,
        ),
      ],
    };

    const expectedProperties = {
      title: 'test',
      thresholds: [
        {
          color,
          comparisonOperator,
          value,
          visible: showValue,
        },
      ],
      symbol: {
        style: 'filled-circle',
      },
      axis: {
        yVisible: true,
        xVisible: true,
      },
      line: {
        connectionStyle: 'linear',
        style: 'solid',
      },
      legend: {
        visible: true,
      },
      queryConfig: {
        source: 'iotsitewise',
        query: {
          properties: [],
          assets: [
            {
              assetId: '3d196ab5-85db-4c90-854f-4e29d579b898',
              properties: [
                {
                  aggregationType: 'AVERAGE',
                  propertyId: 'c07c2fa5-265e-4ed4-bbf0-e94fe01e4d54',
                  resolution: '1m',
                },
              ],
            },
          ],
        },
      },
    };
    const expectedDefinition = {
      widgets: [
        createApplicationChartDefinition('xy-plot', expectedProperties),
      ],
    };

    const applicationDefinition =
      convertMonitorToAppDefinition(lineChartDefinition);
    expect(applicationDefinition).toMatchObject(expectedDefinition);
  });
});
