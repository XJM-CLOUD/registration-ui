import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

export function fetchById(id) {
  return request({
    url: '/user/detail',
    method: 'get',
    params: { id }
  })
}

export function create(data) {
  return request({
    url: '/user/save',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/user/save',
    method: 'post',
    data
  })
}
