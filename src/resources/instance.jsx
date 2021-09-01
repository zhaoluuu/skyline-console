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

import React, { useEffect, useState } from 'react';
import ImageType from 'components/ImageType';
import globalRootStore from 'stores/root';
import { getLocalTimeStr } from 'utils/time';
import { Table, Popover } from 'antd';
import globalActionLogStore from 'stores/nova/action-log';
import { Link } from 'react-router-dom';

import lockSvg from 'src/asset/image/lock.svg';
import unlockSvg from 'src/asset/image/unlock.svg';

const lockIcon = <img src={lockSvg} alt="lock" style={{ width: '12px' }} />;
const unlockIcon = (
  <img src={unlockSvg} alt="unlock" style={{ width: '12px' }} />
);

export const transitionStatus = {
  build: t('Build'),
  building: t('Building'),
  stopped: t('Stopped'),
  recovering: t('Recovering'),
  rescued: t('Rescued'),
  resized: t('Resized'),
  scheduling: t('Scheduling'),
  reboot: t('Reboot'),
  hard_reboot: t('Hard Reboot'),
  migrating: t('Migrating'),
};

export const stableStatus = {
  deleted: t('Deleted'),
  active: t('Active'),
  shutoff: t('Shutoff'),
  paused: t('Paused'),
  error: t('Error'),
  resize: t('Resizing or Migrating'),
  verify_resize: t('Resizing or Migrating'),
  revert_resize: t('Revert Resize/Migrate'),
  // reboot: t('Reboot'),
  // hard_reboot: t('Hard Reboot'),
  password: t('Password'),
  rebuild: t('Rebuild'),
  rescue: t('Rescue'),
  'soft-delete': t('Soft Deleted'),
  soft_deleted: t('Soft Deleted'),
  shelved: t('Shelved'),
  shelved_offloaded: t('Shelved Offloaded'),
  suspended: t('Suspended'),
  stopped: t('Shutoff'),
};

export const taskStatus = {
  null: t('No Task'),
  scheduling: t('Scheduling'),
  block_device_mapping: t('Block Device Mapping'),
  networking: t('Networking'),
  spawning: t('Spawning'),
  image_snapshot: t('Snapshotting'),
  image_snapshot_pending: t('Image Snapshot Pending'),
  image_pending_upload: t('Image Pending Upload'),
  image_uploading: t('Image Uploading'),
  image_backup: t('Image Backup'),
  updating_password: t('Updating Password'),
  resize_prep: t('Resizing or Migrating'),
  resize_migrating: t('Resizing or Migrating'),
  resize_migrated: t('Resizing or Migrating'),
  resize_finish: t('Resizing or Migrating'),
  resize_reverting: t('Reverting Resize or Migrate'),
  resize_confirming: t('Confirming Resize or Migrate'),
  rebooting: t('Rebooting'),
  reboot_pending: t('Rebooting'),
  reboot_started: t('Rebooting'),
  rebooting_hard: t('Hard Rebooting'),
  reboot_pending_hard: t('Hard Rebooting'),
  reboot_started_hard: t('Hard Rebooting'),
  pausing: t('Pausing'),
  unpausing: t('Resuming'),
  suspending: t('Suspending'),
  resuming: t('Resuming'),
  'powering-off': t('Powering Off'),
  'powering-on': t('Powering On'),
  rescuing: t('Rescuing'),
  unrescuing: t('Unrescuing'),
  rebuilding: t('Rebuilding'),
  rebuild_block_device_mapping: t('Rebuild Block Device Mapping'),
  rebuild_spawning: t('Rebuild Spawning'),
  migrating: t('Migrating'),
  deleting: t('Deleting'),
  'soft-deleting': t('Soft Deleting'),
  restoring: t('Restoring'),
  shelving: t('Shelving'),
  shelving_image_pending_upload: t('Shelving Image Pending Upload'),
  shelving_image_uploading: t('Shelving Image Uploading'),
  shelving_offloading: t('Shelving Offloading'),
  unshelving: t('Unshelving'),
};

export const powerStatus = {
  'NO STATE': t('No State'),
  RUNNING: t('Running'),
  BLOCKED: t('Blocked'),
  PAUSED: t('Paused'),
  SHUTDOWN: t('Shut Down'),
  SHUTOFF: t('Shut Off'),
  CRASHED: t('Crashed'),
  SUSPENDED: t('Suspended'),
  FAILED: t('Failed'),
  BUILDING: t('Building'),
};

export const instanceStatus = {
  ...transitionStatus,
  ...stableStatus,
  ...taskStatus,
  ...powerStatus,
};

export const isBuilding = (instance) => instance.status === 'build';

export const isNotLocked = (instance) => !instance.locked;

export const isNotDeleting = (instance) => {
  if (instance.task_state) {
    return instance.task_state.toLowerCase() !== 'deleting';
  }
  return true;
};

export const isLocked = (instance) => !!instance.locked;

export const lockRender = (value) => (value ? lockIcon : unlockIcon);

export const checkStatus = (statusList = [], instance) => {
  const { status, vm_state } = instance;
  return (
    statusList.includes(status.toLowerCase()) ||
    (vm_state && statusList.includes(vm_state.toLowerCase()))
  );
};

export const isNotLockedOrAdmin = (instance, isAdmin = false) => {
  if (isLocked(instance)) {
    return isAdmin;
  }
  return true;
};

export const isActiveOrShutOff = (item) =>
  checkStatus(['active', 'shutoff'], item);

export const isShutOff = (item) => checkStatus(['shutoff'], item);

export const isActive = (item) => checkStatus(['active'], item);

export const isNotError = (item) => !checkStatus(['error'], item);

export const isIsoInstance = (item) => {
  const { iso_server = false } = item;
  return iso_server;
};

export const hasRootVolume = (item) => {
  const {
    root_device_name: rootDeviceName = '/dev/vda',
    volumes_attached: volumes = [],
  } = item;
  const rootVolume = volumes.find(
    (it) => it.is_root_volume || it.device === rootDeviceName
  );
  return !!rootVolume;
};

const passwordAndUserData =
  'Content-Type: multipart/mixed; boundary="===============2309984059743762475=="\n' +
  'MIME-Version: 1.0\n' +
  '\n' +
  '--===============2309984059743762475==\n' +
  'Content-Type: text/cloud-config; charset="us-ascii" \n' +
  'MIME-Version: 1.0\n' +
  'Content-Transfer-Encoding: 7bit\n' +
  'Content-Disposition: attachment; filename="ssh-pwauth-script.txt" \n' +
  '\n' +
  '#cloud-config\n' +
  'disable_root: false\n' +
  'ssh_pwauth: true\n' +
  'password: USER_PASSWORD\n' +
  '\n' +
  '--===============2309984059743762475==\n' +
  'Content-Type: text/x-shellscript; charset="us-ascii" \n' +
  'MIME-Version: 1.0\n' +
  'Content-Transfer-Encoding: 7bit\n' +
  'Content-Disposition: attachment; filename="passwd-script.txt" \n' +
  '\n' +
  '#!/bin/sh\n' +
  "echo 'root:USER_PASSWORD' | chpasswd\n" +
  '\n' +
  '--===============2309984059743762475==\n' +
  'Content-Type: text/x-shellscript; charset="us-ascii" \n' +
  'MIME-Version: 1.0\n' +
  'Content-Transfer-Encoding: 7bit\n' +
  'Content-Disposition: attachment; filename="init-shell.txt" \n' +
  '\n' +
  'USER_DATA\n' +
  '\n' +
  '--===============2309984059743762475==--';

const onlyPasword =
  'Content-Type: multipart/mixed; boundary="===============2309984059743762475==" \n' +
  'MIME-Version: 1.0\n' +
  '\n' +
  '--===============2309984059743762475==\n' +
  'Content-Type: text/cloud-config; charset="us-ascii" \n' +
  'MIME-Version: 1.0\n' +
  'Content-Transfer-Encoding: 7bit\n' +
  'Content-Disposition: attachment; filename="ssh-pwauth-script.txt" \n' +
  '\n' +
  '#cloud-config\n' +
  'disable_root: false\n' +
  'ssh_pwauth: true\n' +
  'password: USER_PASSWORD\n' +
  '\n' +
  '--===============2309984059743762475==\n' +
  'Content-Type: text/x-shellscript; charset="us-ascii" \n' +
  'MIME-Version: 1.0\n' +
  'Content-Transfer-Encoding: 7bit\n' +
  'Content-Disposition: attachment; filename="passwd-script.txt" \n' +
  '\n' +
  '#!/bin/sh\n' +
  "echo 'root:USER_PASSWORD' | chpasswd\n" +
  '\n' +
  '--===============2309984059743762475==--';

const onlyUserData =
  'Content-Type: multipart/mixed; boundary="===============2309984059743762475==" \n' +
  'MIME-Version: 1.0\n' +
  '\n' +
  '--===============2309984059743762475==\n' +
  'Content-Type: text/x-shellscript; charset="us-ascii" \n' +
  'MIME-Version: 1.0\n' +
  'Content-Transfer-Encoding: 7bit\n' +
  'Content-Disposition: attachment; filename="init-shell.txt" \n' +
  '\n' +
  'USER_DATA\n' +
  '\n' +
  '--===============2309984059743762475==--';

export const getUserData = (password, userData) => {
  if (password && userData) {
    const str = passwordAndUserData.replace(/USER_PASSWORD/g, password);
    return str.replace(/USER_DATA/g, userData);
  }
  if (password) {
    return onlyPasword.replace(/USER_PASSWORD/g, password);
  }
  return onlyUserData.replace(/USER_DATA/g, userData);
};

export const getIpInitValue = (subnet) => {
  if (!subnet) {
    return null;
  }
  const { start } = subnet.allocation_pools[0];
  return start;
};

export const physicalNodeTypes = [
  {
    label: t('Smart Scheduling'),
    value: 'smart',
  },
  {
    label: t('Manually Specify'),
    value: 'manually',
  },
];

export const isIronicInstance = (item) => {
  const { flavor_info: { extra_specs: extra = {} } = {} } = item;
  return (
    extra[':architecture'] === 'bare_metal' ||
    extra['trait:CUSTOM_GOLD'] === 'required'
  );
};

export const instanceColumnsBackend = [
  {
    title: t('Name'),
    dataIndex: 'name',
    sortKey: 'display_name',
  },
  {
    title: t('Image'),
    sorter: false,
    dataIndex: 'image_os_distro',
    render: (value, record) => (
      <ImageType type={value} title={record.image_name} />
    ),
    stringify: (_, record) => record.image_name,
  },
  {
    title: t('Fixed IP'),
    dataIndex: 'fixed_addresses',
    width: 120,
    sorter: false,
    render: (fixed_addresses) => {
      if (!fixed_addresses || !fixed_addresses.length) {
        return '-';
      }
      return fixed_addresses.map((it) => (
        <span key={it}>
          {it}
          <br />
        </span>
      ));
    },
  },
  {
    title: t('Floating IP'),
    dataIndex: 'floating_addresses',
    width: 120,
    sorter: false,
    render: (addresses) => {
      if (!addresses || !addresses.length) {
        return '-';
      }
      return addresses.map((it) => (
        <span key={it}>
          {it}
          <br />
        </span>
      ));
    },
  },
  {
    title: t('Flavor'),
    dataIndex: 'flavor',
    sorter: false,
  },
  {
    title: t('Created At'),
    dataIndex: 'created_at',
    valueRender: 'sinceTime',
  },
];

export const instanceFilters = [
  {
    label: t('Name'),
    name: 'name',
  },
];

export const instanceSortProps = {
  isSortByBack: true,
  defaultSortKey: 'created_at',
  defaultSortOrder: 'descend',
};

export const instanceSelectTablePropsBackend = {
  ...instanceSortProps,
  filterParams: instanceFilters,
  columns: instanceColumnsBackend,
};

export const canCreateIronicByLicense = () =>
  globalRootStore.checkLicense('ironic');

export const instanceStatusFilter = {
  label: t('Status'),
  name: 'status',
  options: [
    { label: t('Active'), key: 'ACTIVE' },
    { label: t('Building'), key: 'BUILD' },
    { label: t('Paused'), key: 'PAUSED' },
    { label: t('Suspended'), key: 'SUSPENDED' },
    { label: t('Error'), key: 'ERROR' },
    { label: t('Shutoff'), key: 'SHUTOFF' },
    { label: t('Shelved Offloaded'), key: 'SHELVED_OFFLOADED' },
  ],
};

export const hasOnlineResizeFlavor = (item) => {
  const {
    extra_specs: { 'hw:live_resize': liveResize = false },
  } = (item || {}).flavor_info || {};
  return !!liveResize;
};

export const actionMap = {
  attach_interface: t('Attach Interface'),
  detach_interface: t('Detach Interface'),
  attach_volume: t('Attach Volume'),
  detach_volume: t('Detach Volume'),
  create: t('Create'),
  stop: t('Stop'),
  reboot: t('Reboot'),
  suspend: t('Suspend'),
  resume: t('Resume'),
  shelve: t('Shelve'),
  unshelve: t('Unshelve'),
  start: t('Start'),
  lock: t('Lock'),
  unlock: t('Unlock'),
  pause: t('Pause'),
  unpause: t('Unpause'),
  createImage: t('Create Snapshot'),
  resize: t('Extend Root Volume'),
  confirmResize: t('Resize'),
  'live-resize': t('Online Resize'),
  extend_volume: t('Extend Volume'),
  changePassword: t('Change Password'),
  rebuild: t('Rebuild'),
  migrate: t('Migrate'),
  'live-migration': t('Live Migrate'),
  delete: t('Delete'),
  restore: t('Recover'),
};

export const actionEvent = {
  compute_restore_instance: t('Resume Instance'),
  compute_soft_delete_instance: t('Soft Delete Instance'),
  compute_post_live_migration_at_destination: t(
    'Live Migration At Destination'
  ),
  compute_pre_live_migration: t('Pre Live Migration'),
  compute_live_migration: t('Compute Live Migration'),
  compute_check_can_live_migrate_source: t('Check Can Live Migrate Source'),
  compute_check_can_live_migrate_destination: t(
    'Check Can Live Migrate Destination'
  ),
  conductor_live_migrate_instance: t('Conductor Live Migrate Instance'),
  compute_confirm_resize: t('Resized'),
  compute_finish_resize: t('Finish Resize'),
  compute_resize_instance: t('Resize Instance'),
  compute_prep_resize: t('Prep Resize'),
  cold_migrate: t('Cold Migrate'),
  conductor_migrate_server: t('Conductor Migrate Server'),
  compute_rebuild_instance: t('Rebuild Instance'),
  rebuild_server: t('Rebuild Instance'),
  compute_set_admin_password: t('Set Admin Password'),
  compute_extend_volume: t('Extend Volume'),
  compute_live_resize_instance: t('Compute Live Resize Instance'),
  conductor_live_resize_instance: t('Conductor Live Resize Instance'),
  api_snapshot_instance: t('Snapshot Instance'),
  api_lock: t('Lock'),
  api_unlock: t('Unlock'),
  compute_detach_volume: t('Detach Volume'),
  compute_attach_volume: t('Attach Volume'),
  compute_detach_interface: t('Detach Interface'),
  compute_attach_interface: t('Attach Interface'),
  compute__do_build_and_run_instance: t('Do Build And Run Instance'),
  compute_suspend_instance: t('Compute Suspend Instance'),
  compute_start_instance: t('Compute Start Instance'),
  compute_stop_instance: t('Compute Stop Instance'),
  compute_resume_instance: t('Compute Resume Instance'),
  compute_pause_instance: t('Compute Pause Instance'),
  compute_unpause_instance: t('Compute Unpause Instance'),
  compute_reboot_instance: t('Compute Reboot Instance'),
};

function PopUpContent({ id, requestId }) {
  const [event, setEvent] = useState([]);
  const [isLoading, setLoaidng] = useState(false);

  useEffect(() => {
    (async function () {
      setLoaidng(true);
      const cb = await globalActionLogStore.fetchDetail({ id, requestId });
      const { events = [] } = cb;
      setEvent(events.reverse());
      setLoaidng(false);
    })();
  }, []);
  const columns = [
    {
      title: t('Operation Name'),
      dataIndex: 'event',
      key: 'event',
      render: (value) => actionEvent[value],
    },
    {
      title: t('Start Time'),
      dataIndex: 'start_time',
      key: 'start_time',
      render: (value) => getLocalTimeStr(value),
    },
    {
      title: t('End Time'),
      dataIndex: 'finish_time',
      key: 'finish_time',
      render: (value) => (value ? getLocalTimeStr(value) : '-'),
    },
    {
      title: t('Execution Result'),
      dataIndex: 'result',
      key: 'result',
      render: (value) => (value === 'Success' ? t('Success') : '-'),
    },
  ];
  const table = (
    <Table
      columns={columns}
      dataSource={event}
      pagination={false}
      loading={isLoading}
      size="small"
      rowKey="event"
    />
  );
  return table;
}

export const actionColumn = (self) => {
  return [
    {
      title: t('Operation Name'),
      dataIndex: 'action',
      render: (value) => actionMap[value],
    },
    {
      title: t('Project ID/Name'),
      dataIndex: 'project_name',
      isHideable: true,
      hidden: !self.isAdminPage,
    },
    {
      title: t('Operation Time'),
      dataIndex: 'start_time',
      valueRender: 'toLocalTimeMoment',
    },
    {
      title: t('Request ID'),
      dataIndex: 'request_id',
      isHideable: true,
      render: (value, record) => {
        const content = (
          <PopUpContent id={record.instance_uuid} requestId={value} />
        );
        return (
          <>
            {value && (
              <Popover content={content} destroyTooltipOnHide trigger="click">
                <span className="linkClass">{value}</span>
              </Popover>
            )}
          </>
        );
      },
    },
    {
      title: t('User ID'),
      dataIndex: 'user_id',
      isHideable: true,
      hidden: !self.isAdminPage,
      render: (value) => (
        <Link to={`${self.getUrl('/identity/user')}/detail/${value}`}>
          {value}
        </Link>
      ),
    },
  ];
};

export const allowAttachInterfaceStatus = ['active', 'paused', 'stopped'];
