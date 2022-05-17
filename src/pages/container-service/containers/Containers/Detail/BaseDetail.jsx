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

import Base from 'containers/BaseDetail';
import React from 'react';
import { inject, observer } from 'mobx-react';

export class BaseDetail extends Base {
  get leftCards() {
    const cards = [this.baseInfoCard, this.miscellaneousCard];
    return cards;
  }

  get rightCards() {
    return [this.specCard];
  }

  get baseInfoCard() {
    const options = [
      {
        label: t('ID'),
        dataIndex: 'uuid',
      },
      {
        label: t('Name'),
        dataIndex: 'name',
      },
      {
        label: t('Status'),
        dataIndex: 'status',
      },
      {
        label: t('Status Detail'),
        dataIndex: 'status_detail',
      },
      {
        label: t('Status Reason'),
        dataIndex: 'status_reason',
      },
      {
        label: t('Task State'),
        dataIndex: 'task_state',
      },
      {
        label: t('Command'),
        dataIndex: 'command',
      },
    ];

    return {
      title: t('Base Info'),
      options,
    };
  }

  get miscellaneousCard() {
    const content = (
      <div>
        <pre>{JSON.stringify(this.detailData.environment, null, 4)}</pre>
      </div>
    );

    const options = [
      {
        label: t('Host'),
        dataIndex: 'host',
      },
      {
        label: t('Workdir'),
        dataIndex: 'workdir',
      },
      {
        label: t('Environment'),
        dataIndex: 'environment',
        content
      },
      {
        label: t('Interactive'),
        dataIndex: 'interactive',
        valueRender: 'yesNo',
      },
      {
        label: t('Labels'),
        dataIndex: 'labels',
        render: (value) => value['cloud-shell'] || '-',
      },
      {
        label: t('Links'),
        dataIndex: 'links',
        render: (value) => <div> <pre>{JSON.stringify(value, null, 4)}</pre> </div>
      },
    ];

    return {
      title: t('Miscellaneous'),
      options,
    };
  }

  get specCard() {
    const options = [
      {
        label: t('Image'),
        dataIndex: 'image',
      },
      {
        label: t('Image Driver'),
        dataIndex: 'image_driver',
      },
      {
        label: t('Image Pull Policy'),
        dataIndex: 'image_pull_policy',
      },
      {
        label: t('Hostname'),
        dataIndex: 'hostname',
      },
      {
        label: t('Runtime'),
        dataIndex: 'runtime',
      },
      {
        label: t('CPU'),
        dataIndex: 'cpu',
      },
      {
        label: t('Memory'),
        dataIndex: 'memory',
      },
      {
        label: t('Disk'),
        dataIndex: 'disk',
      },
      {
        label: t('Restart Policy'),
        dataIndex: 'restart_policy',
        render: (value) => <div> <pre>{JSON.stringify(value, null, 4)}</pre> </div>
      },
      {
        label: t('Auto Remove'),
        dataIndex: 'auto_remove',
      },
      {
        label: t('Auto Heal'),
        dataIndex: 'auto_heal',
      },
      {
        label: t('Addresses'),
        dataIndex: 'addresses',
        render: (value) => <div> <pre>{JSON.stringify(value, null, 4)}</pre> </div>
      },
      {
        label: t('Ports'),
        dataIndex: 'ports',
        render: (value) => <div> <pre>{JSON.stringify(value, null, 4)}</pre> </div>
      },
      {
        label: t('Security Groups'),
        dataIndex: 'security_groups',
        render: (value) => <div> <pre>{JSON.stringify(value, null, 4)}</pre> </div>
      },
    ];

    return {
      title: t('Spec'),
      labelCol: 4,
      options,
    };
  }
}

export default inject("rootStore")(observer(BaseDetail))