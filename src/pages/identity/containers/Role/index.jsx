// Copyright 2021 99cloud
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Base from 'containers/List';
import globalRoleStore from 'stores/keystone/role';

@inject('rootStore')
@observer
export default class Role extends Base {
  init() {
    this.store = globalRoleStore;
  }

  get tabs() {
    return [];
  }

  get policy() {
    return 'identity:list_roles';
  }

  get name() {
    return t('roles');
  }

  get isFilterByBackend() {
    return false;
  }

  getColumns = () => [
    {
      title: t('Role Name'),
      dataIndex: 'name',
      linkPrefix: '/identity/role-admin/detail',
      render: (name, record) => {
        if (name) {
          return (
            <Link to={`/identity/role-admin/detail/${record.id}`}>{name}</Link>
          );
        }
        return '-';
      },
    },
    {
      title: t('ID'),
      dataIndex: 'id',
      isHideable: true,
      copyable: true,
    },
    {
      title: t('Description'),
      dataIndex: 'description',
      isHideable: true,
    },
    // {
    //   title: t('Created Time'),
    //   dataIndex: 'created_at',
    //   sorter: true,
    //   sortOrder: this.getSortOrder('created_at'),
    //   isHideable: true,
    //   render: time => getSinceTime(time),
    // },
  ];

  get searchFilters() {
    return [
      {
        label: t('Role Name'),
        name: 'name',
      },
    ];
  }
}
