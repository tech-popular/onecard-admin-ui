export default {
  namespaced: true,
  state: {
    reportName: '',
    chartName: '',
    reportId: '',
    chartId: ''
  },
  mutations: {
    setReportName (state, name) {
      state.reportName = name
    },
    setCharttName (state, name) {
      state.chartName = name
    },
    setReportId (state, id) {
      state.reportId = id
    },
    setChartId (state, id) {
      state.chartId = id
    }
  }
}
