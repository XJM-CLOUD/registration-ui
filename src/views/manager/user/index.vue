<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.userName" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.phone" placeholder="手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.roles | rolesNameFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.enableStatus | statusFilter">
            {{ row.enableStatus | statusNameFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.enableStatus!='1'" size="mini" type="success" @click="handleModifyStatus(row,1)">
            启用
          </el-button>
          <el-button v-if="row.enableStatus!='0'" size="mini" @click="handleModifyStatus(row,0)">
            禁用
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="temp.userName" />
        </el-form-item>
        <el-form-item label="登录密码" prop="userPwd">
          <el-input v-model="temp.userPwd" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="temp.realName" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select v-model="temp.roles" class="filter-item" placeholder="请选择角色">
            <el-option v-for="item in rolesOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="enableStatus">
          <el-select v-model="temp.enableStatus" class="filter-item" placeholder="请选择状态">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, create, update } from '@/api/manager/user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { validUsername } from '@/utils/validate' // secondary package based on el-pagination

const statusOptions = [
  { key: 1, label: '启用' },
  { key: 0, label: '禁用' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const statusOptionsKeyValue = statusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.label
  return acc
}, {})

const rolesOptions = [
  { label: '患者', key: 'patient' },
  { label: '医生', key: 'doctor' },
  { label: '管理员', key: 'admin' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const rolesOptionsKeyValue = rolesOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.label
  return acc
}, {})

export default {
  name: 'UserTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'info'
      }
      return statusMap[status]
    },
    statusNameFilter(type) {
      return statusOptionsKeyValue[type]
    },
    rolesNameFilter(type) {
      return rolesOptionsKeyValue[type]
    }
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('用户名长度大于等于3位并且小于20位'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        userName: undefined,
        phone: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      statusOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      rolesOptions,
      showReviewer: false,
      temp: {
        userId: undefined,
        userName: '',
        realName: '',
        phone: '',
        roles: '',
        avatar: '',
        enableStatus: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      rules: {
        userName: [{ required: true, message: '用户名不能为空', trigger: 'change', validator: validateUsername }],
        userPwd: [{ required: true, message: '密码不能为空', trigger: 'change', validator: validatePassword }],
        realName: [{ required: true, message: '真实姓名不能为空', trigger: 'change' }],
        phone: [{ required: true, message: '手机号不能为空', trigger: 'change' }],
        roles: [{ required: true, message: '角色不能为空', trigger: 'change' }],
        enableStatus: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      update({ userId: row.userId, enableStatus: status }).then(() => {
        this.$message({
          message: '操作Success',
          type: 'success'
        })
        row.enableStatus = status
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        userId: undefined,
        userName: '',
        realName: '',
        phone: '',
        roles: '',
        avatar: '',
        enableStatus: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          create(this.temp).then(() => {
            // this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 1000,
              onClose: () => this.getList()
            })
          })
        }
      })
    },
    handleUpdate(row) {
      console.log(row)
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          update(tempData).then(() => {
            // const index = this.list.findIndex(v => v.id === this.temp.id)
            // this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 1000,
              onClose: () => this.getList()
            })
          })
        }
      })
    },

    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
