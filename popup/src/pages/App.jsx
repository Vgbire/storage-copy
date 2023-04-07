import { useState, useEffect } from 'react'
import './style.scss'
import { Table, Input, Select, Tooltip, Switch } from 'antd'
import { PlusCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons'
import { IS_PROD } from '@/constant.js'
import { debounce, copy } from '@/utils.js'

IS_PROD && chrome.runtime.connect()

export default function App() {
  const connectToBackground = IS_PROD && chrome.runtime.connect({ name: 'popup-background-link' })

  const storageOptions = [
    { label: 'Local Storage', value: 'localStorage' },
    { label: 'Session Storage', value: 'sessionStorage' },
    { label: 'Cookie', value: 'cookie' }
  ]
  const [id, setId] = useState(1)
  const [configs, setConfigs] = useState([{ status: true, id }])

  const setStorage = debounce(() => {
    if (IS_PROD) {
      connectToBackground.postMessage(configs)
    }
  }, 200)

  useEffect(() => {
    IS_PROD &&
      chrome.storage.local.get('websiteConfigs', (data) => {
        if (data?.websiteConfigs) setConfigs(data.websiteConfigs)
      })
  }, [])

  useEffect(() => {
    setStorage()
  }, [configs])

  function addConfig() {
    setId(id + 1)
    setConfigs([...configs, { status: true, id: id + 1 }])
  }

  function removeConfig(key) {
    if (configs.length > 1) {
      setConfigs(configs.filter((item, index) => key !== index))
    }
  }

  function changeField(index, key, value) {
    setConfigs(
      configs.map((item, configIndex) => {
        if (configIndex === index) item[key] = value
        return item
      })
    )
  }

  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value, record, index) => {
        return (
          <Switch
            checked={value}
            onChange={(value) => {
              changeField(index, 'status', value)
            }}
          />
        )
      }
    },
    {
      title: 'Source Site',
      dataIndex: 'fromDomain',
      width: 180,
      render: (value, record, index) => {
        return (
          <>
            <Input
              value={value}
              style={{ width: 130 }}
              onChange={(e) => {
                changeField(index, 'fromDomain', e.target.value)
              }}
            />
          </>
        )
      }
    },
    {
      title: 'Target Site',
      dataIndex: 'toDomain',
      render: (value, record, index) => {
        return (
          <Input
            value={value}
            onChange={(e) => {
              changeField(index, 'toDomain', e.target.value)
            }}
          />
        )
      },
      onCell: (record) => {
        return { rowSpan: record.span || 1 }
      }
    },
    {
      title: 'Storage',
      width: 170,
      dataIndex: 'storage',
      render: (value, record, index) => {
        return (
          <Select
            allowClear
            value={value}
            options={storageOptions}
            style={{ width: '100%' }}
            onChange={(value) => {
              changeField(index, 'storage', value)
            }}
          />
        )
      }
    },
    {
      title: 'Field',
      dataIndex: 'field',
      render: (value, record, index) => {
        return (
          <Input
            allowClear
            value={value}
            onChange={(e) => {
              changeField(index, 'field', e.target.value)
            }}
          />
        )
      }
    },
    {
      title: 'Value',
      dataIndex: 'token',
      render: (value) => {
        return (
          <Tooltip content="点击复制">
            {
              <Input
                readOnly
                value={value}
                title="点击复制"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  copy(value)
                }}
              />
            }
          </Tooltip>
        )
      }
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (value, record, index) => {
        return (
          <div style={{ fontSize: '20px', textAlign: 'center' }}>
            <PlusCircleTwoTone onClick={addConfig} />
            <MinusCircleTwoTone
              style={{ marginLeft: '8px' }}
              onClick={() => {
                removeConfig(index)
              }}
            />
          </div>
        )
      }
    }
  ]

  return (
    <div className="popup-container">
      <Table
        rowKey="id"
        size="small"
        bordered={false}
        columns={columns}
        dataSource={configs}
        pagination={false}
      />
    </div>
  )
}
