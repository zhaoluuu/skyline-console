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
import { inject, observer } from 'mobx-react';
import Base from 'containers/BaseDetail';

export class BaseDetail extends Base {
  get leftCards() {
    const cards = [this.attachmentsCard];
    if (this.detailData.volume_image_metadata) {
      cards.push(this.imageCard);
    }
    if (this.detailData.transfer) {
      cards.push(this.transferCard);
    }
    return cards;
  }

  get attachmentsCard() {
    const options = [
      {
        label: t('Attached To'),
        dataIndex: 'attachmentsContrib',
        render: (value) => {
          if (!value || value.length === 0) {
            return '-';
          }
          return value.map((it) => (
            <div key={it.server_id}>
              {it.device} on{' '}
              {this.getLinkRender(
                'instanceDetail',
                it.server_name,
                { id: it.server_id },
                { tab: 'volumes' }
              )}
            </div>
          ));
        },
      },
    ];
    return {
      title: t('Attachments Info'),
      options,
    };
  }

  get imageCard() {
    const {
      volume_image_metadata: { image_id, image_name },
    } = this.detailData;
    const options = [
      {
        label: t('Image'),
        dataIndex: 'volume_image_metadata.image_name',
        render: () =>
          this.getLinkRender('imageDetail', image_name, { id: image_id }, null),
      },
    ];

    return {
      title: t('Volume Source'),
      options,
    };
  }

  get transferCard() {
    const options = [
      {
        label: t('ID'),
        dataIndex: 'transfer.id',
      },
      {
        label: t('Name'),
        dataIndex: 'transfer.name',
      },
      {
        label: t('Created'),
        dataIndex: 'transfer.created_at',
        valueRender: 'toLocalTime',
      },
    ];

    return {
      title: t('Volume Transfer'),
      options,
    };
  }
}

export default inject('rootStore')(observer(BaseDetail));
