export default {
	namespaced: true,
	state: {
		sqlPreviewDataList: []
	},

	mutations: {
		setPreviewList (state, list) {
			state.sqlPreviewDataList = list
		}
	}
}
