export const palette = [
  // 工作流左侧节点内容 START, END, SQL_QUERY, HBASE_QUERY, API_CALL, DATA_HANDLE, CONDITIONAL;
  // {
  //   category: 'IN_PARAM',
  //   nodeName: '入参',
  //   key: '1'
  // },
  {
    key: '2',
    category: 'MULTI_BRANCH',
    path: 'flowNode.png',
    nodeName: '分流节点'
  },
  {
    key: '3',
    category: 'HTTP_QUERY',
    nodeName: 'http任务'
  },
  {
    key: '4',
    category: 'FORK_JOIN',
    nodeName: '合并任务'
  },
  // {
  //   key: '3',
  //   category: 'GROUP_CHOICE',
  //   nodeName: '分群节点'
  // },
  // {
  //   key: '4',
  //   category: 'FILTER_CHOICE',
  //   nodeName: '过滤节点'
  // },
  {
    key: '5',
    category: 'OUT_PARAM',
    nodeName: '运营\n方式'
  }
  // {
  //   key: '6',
  //   category: 'OUT_KAFKA',
  //   nodeName: '下发\nkafka'
  // }
]
