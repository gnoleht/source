var vehicleReportsSetting = {
    view: {
        module: 'pt',
        subModule: 'vehicle',
        formName: 'vehicleReports',
        gridName: 'grvVehicleReports'
    }
};

function vehicleReportsInitSetting() {
    vehicleReportsSetting.grid = {};

    vehicleReportsSetting.required = [];
    vehicleReportsSetting.valuelist = {};
    vehicleReportsSetting.options = {};
    vehicleReportsSetting.validate = {};
}