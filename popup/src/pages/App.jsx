import { useState, useEffect } from 'react'
import './style.scss'
import { Table, Input, Select, Tooltip } from '@arco-design/web-react'
import { IconPlusCircleFill, IconMinusCircleFill } from '@arco-design/web-react/icon'
import { IS_PROD } from '@/constant.js'
import { debounce, copy } from '@/utils.js'

IS_PROD && chrome.runtime.connect()

export default function App() {
  const PopupToBackgroundPort = IS_PROD && chrome.runtime.connect({ name: 'popup-background-link' })

  const storageOptions = [
    { label: 'Local Storage', value: 'localStorage' },
    { label: 'Session Storage', value: 'sessionStorage' },
    { label: 'Cookie', value: 'cookie' }
  ]

  const [configs, setConfigs] = useState([{}])

  const setStorage = debounce(function setStorage() {
    if (IS_PROD) {
      PopupToBackgroundPort.postMessage(configs)
    }
  }, 100)

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
    setConfigs([...configs, {}])
  }

  function removeConfig(key) {
    if (configs.length > 1) {
      setConfigs(configs.filter((item, index) => key !== index))
    }
  }

  function changeFromDomain(key, value) {
    setConfigs(
      configs.map((item, index) => {
        if (index === key) item.fromDomain = value
        return item
      })
    )
  }

  function changeToDomain(key, value) {
    setConfigs(
      configs.map((item, index) => {
        if (index === key) item.toDomain = value
        return item
      })
    )
  }

  function changeStorage(key, value) {
    setConfigs(
      configs.map((item, index) => {
        if (index === key) item.storage = value
        return item
      })
    )
  }

  function changeField(key, value) {
    setConfigs(
      configs.map((item, index) => {
        if (index === key) item.field = value
        return item
      })
    )
  }

  const columns = [
    {
      title: 'From Domain',
      dataIndex: 'fromDomain',
      render: (value, record, index) => {
        return (
          <Input
            allowClear
            value={value}
            onChange={(value) => {
              changeFromDomain(index, value)
            }}
          />
        )
      }
    },
    {
      title: 'To Domain',
      dataIndex: 'toDomain',
      render: (value, record, index) => {
        return (
          <Input
            allowClear
            value={value}
            onChange={(value) => {
              changeToDomain(index, value)
            }}
          />
        )
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
            onChange={(value) => {
              changeStorage(index, value)
            }}
          />
        )
      }
    },
    {
      title: 'Field',
      width: 100,
      dataIndex: 'field',
      render: (value, record, index) => {
        return (
          <Input
            allowClear
            value={value}
            onChange={(value) => {
              changeField(index, value)
            }}
          />
        )
      }
    },
    {
      title: 'Token',
      width: 100,
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
      width: 100,
      dataIndex: 'operation',
      render: (value, record, index) => {
        return (
          <div style={{ fontSize: '20px' }}>
            <IconPlusCircleFill onClick={addConfig} />
            <IconMinusCircleFill
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
        columns={columns}
        data={configs}
        pagination={false}
        scroll={{ y: 250 }}
      />
    </div>
  )
}
