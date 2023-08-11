<template>
    <div>
        <el-form :model="baseForm" ref="baseForm" inline>
            <el-row class="base-form">
                <el-form-item prop="key">
                    <el-select
                            v-model="baseForm.key"
                            placeholder="请选择"
                            class="data-select"
                            @change="getTaskList"
                            filterable
                    >
                        <el-option
                                v-for="item in typeList"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="id">
                    <el-select
                            v-model="baseForm.id"
                            placeholder="请选择"
                            class="data-select"
                            filterable
                    >
                        <el-option
                                v-for="item in taskList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-button type="primary" v-if="true" @click="handleSearch">查询</el-button>
            </el-row>
        </el-form>
        <div id='container' style="height: 800px;width: 100%"></div>
    </div>
</template>

<script>
import G6 from '@antv/g6'
import {getTaskList, getDolphinProcessById, getDolphinTaskById} from '@/api/dispatch/taskManag'

export default {
    data() {
        return {
            baseForm: {
                key: '',
                id: ''
            },
            taskList: {
                id: ''
            },
            typeList: [
                {
                    key: 1,
                    value: '任务筛选'
                },
                {
                    key: 2,
                    value: '工作流筛选'
                }
            ],
            treeData: {},
            graph: null
        }
    },
    name: 'G6Demo',
    mounted() {
        // this.getTaskList()
    },
    methods: {
        getTaskList(item) {
            console.log('item' + item)
            getTaskList(item).then(({data}) => {
                this.taskList = data.data
                this.typeList.key = item
            })
        },
        handleSearch() {
            console.log('graph:' + this.graph)
            if (this.graph) {
                this.graph.destroy()
            }
            console.log('this.typeList.key' + this.typeList.key)
            if (this.typeList.key === 1) {
                getDolphinTaskById(this.baseForm.id).then(({data}) => {
                    this.initTree(data.data)
                })
            } else {
                getDolphinProcessById(this.baseForm.id).then(({data}) => {
                    this.initTree(data.data)
                })
            }
        },
        initTree(data) {
            G6.registerNode(
                'sql',
                {
                    drawShape(cfg, group) {
                        const rect = group.addShape('rect', {
                            attrs: {
                                x: -75,
                                y: -25,
                                width: 150,
                                height: 50,
                                radius: 10,
                                stroke: '#5B8FF9',
                                fill: '#C6E5FF',
                                lineWidth: 3
                            },
                            name: 'rect-shape'
                        })
                        if (cfg.name) {
                            group.addShape('text', {
                                attrs: {
                                    text: cfg.name,
                                    x: 0,
                                    y: 0,
                                    fill: '#00287E',
                                    fontSize: 14,
                                    textAlign: 'center',
                                    textBaseline: 'middle',
                                    fontWeight: 'bold'
                                },
                                name: 'text-shape'
                            })
                        }
                        return rect
                    }
                },
                'single-node'
            )

            const container = document.getElementById('container')
            const width = container.scrollWidth
            const height = container.scrollHeight
            this.graph = new G6.Graph({
                container: 'container',
                width,
                height,
                layout: {
                    type: 'dagre',
                    rankdir: 'TB',
                    nodesepFunc: (d) => {
                        // if (d.id === '3') {
                        //     return 500
                        // }
                        return 50
                    },
                    ranksep: 30,
                    controlPoints: true
                },
                defaultNode: {
                    type: 'sql'
                },
                defaultEdge: {
                    type: 'polyline',
                    style: {
                        radius: 20,
                        offset: 45,
                        endArrow: true,
                        lineWidth: 2,
                        stroke: '#C2C8D5'
                    }
                },
                nodeStateStyles: {
                    selected: {
                        stroke: '#d9d9d9',
                        fill: '#5394ef'
                    }
                },
                modes: {
                    default: [
                        'drag-canvas',
                        'zoom-canvas',
                        'click-select'
                        // {
                        //     type: 'tooltip',
                        //     formatText(model) {
                        //         const cfg = model.conf
                        //         const text = []
                        //         cfg.forEach((row) => {
                        //             text.push(row.label + ':' + row.value + '<br>')
                        //         })
                        //         return text.join('\n')
                        //     },
                        //     offset: 30
                        // }
                    ]
                },
                fitView: true
            })
            this.graph.node(function (node) {
                console.log('node:' + JSON.stringify(node))
                if (node.id === 'center') {
                    return {
                        label: node.name,
                        style: {
                            stroke: '#50C878',
                            fill: '#9FE2BF',
                            lineWidth: 1,
                            radius: 10
                        }
                    }
                }
                return {
                    label: node.id
                }
            })
            this.graph.data(data)
            this.graph.render()

            // if (typeof window !== 'undefined') {
            //     window.onresize = () => {
            //         if (!this.graph || this.graph.get('destroyed')) return
            //         if (!container || !container.scrollWidth || !container.scrollHeight) return
            //         this.graph.changeSize(container.scrollWidth, container.scrollHeight)
            //     }
            // }
        }
    }
}
</script>
<style>
.g6-tooltip {
    border-radius: 6px;
    font-size: 12px;
    color: #fff;
    background-color: #000;
    padding: 2px 8px;
    text-align: center;
}
</style>