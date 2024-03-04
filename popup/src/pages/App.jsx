import { useState, useEffect } from 'react'
import './style.scss'
import { Table, Input, Select, Tooltip, Switch, Button, Alert } from 'antd'
import { PlusCircleTwoTone, MinusCircleTwoTone, QuestionCircleOutlined } from '@ant-design/icons'
import { IS_PROD } from '@/constant.js'
import { copy, uuid } from '@/utils.js'

IS_PROD && chrome.runtime.connect()

export default function App() {
  const connectToBackground = IS_PROD && chrome.runtime.connect({ name: 'popup-background-link' })

  const storageOptions = [
    { label: 'Local Storage', value: 'localStorage' },
    { label: 'Session Storage', value: 'sessionStorage' },
    { label: 'Cookie', value: 'cookie' }
  ]
  const [configs, setConfigs] = useState([{ status: true, id: uuid() }])

  const setStorage = () => {
    if (IS_PROD) {
      connectToBackground.postMessage(configs)
    }
  }

  useEffect(() => {
    IS_PROD &&
      chrome.storage.local.get('websiteConfigs', (data) => {
        if (data?.websiteConfigs) setConfigs(data.websiteConfigs)
      })
  }, [])

  function addConfig() {
    setConfigs([...configs, { status: true, id: uuid() }])
  }

  function removeConfig(index) {
    if (configs.length > 1) {
      configs.splice(index, 1)
      setConfigs([...configs])
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
      width: 100,
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
      render: (value, record, index) => {
        return (
          <>
            <Input
              value={value}
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
      ellipsis: { showTitle: false },
      render: (text) => {
        if (typeof text === 'object') {
          text = JSON.stringify(text)
        }
        return (
          <Tooltip
            title="点击复制"
            placement="topLeft">
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => {
                copy(text)
              }}>
              {text}
            </span>
          </Tooltip>
        )
      }
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      width: 100,
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
      <Alert
        style={{ marginTop: '10px' }}
        message="New feature: when field is empty, copy all"
        type="warning"
      />
      <Button
        type="primary"
        style={{ marginTop: '10px', textAlign: 'center' }}
        onClick={() => {
          setStorage()
        }}>
        Confirm
      </Button>
    </div>
  )
}
