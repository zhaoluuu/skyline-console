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

import { observer, inject } from 'mobx-react';
import Base from 'containers/List';
import globalShareGroupTypeStore from 'stores/manila/share-group-type';
import { shareGroupTypeColumns } from 'src/resources/manila/share-group-type';
import actionConfigs from './actions';

export class ShareGroupType extends Base {
  init() {
    this.store = globalShareGroupTypeStore;
  }

  get policy() {
    return 'manila:share_type:index';
  }

  get name() {
    return t('share types');
  }

  get fetchDataByAllProjects() {
    return false;
  }

  get actionConfigs() {
    return actionConfigs;
  }

  updateFetchParams = (params) => {
    return {
      ...params,
      is_public: 'all',
    };
  };

  getColumns = () => shareGroupTypeColumns;
}

export default inject('rootStore')(observer(ShareGroupType));
