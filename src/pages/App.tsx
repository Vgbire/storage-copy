import { useState, useEffect } from "react"
import "./style.css"
import { Table, Input, Select, Switch, Button } from "antd"
import { PlusCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons"
import { copy, uuid } from "../utils"
import i18n from "../i18n"
import IconTip from "./components/IconTip"

export default function App() {
  const storageOptions = [
    { label: "Local Storage", value: "localStorage" },
    { label: "Session Storage", value: "sessionStorage" },
    { label: "Cookie", value: "cookie" },
  ]
  const [configs, setConfigs] = useState([{ status: true, id: uuid() }])

  const getConfigFromStorage = () => {
    chrome.storage.local.get("websiteConfigs", (data) => {
      if (data?.websiteConfigs) setConfigs(data.websiteConfigs)
    })
  }

  useEffect(() => {
    getConfigFromStorage()
  }, [])

  chrome.storage.onChanged.addListener(() => {
    getConfigFromStorage()
  })

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
      title: i18n.t("enabled"),
      dataIndex: "status",
      width: 100,
      render: (value, record, index) => {
        return (
          <Switch
            checked={value}
            onChange={(value) => {
              changeField(index, "status", value)
            }}
          />
        )
      },
    },
    {
      title: (
        <>
          {i18n.t("sourceSite")} <IconTip title={i18n.t("sourceSiteTip")} />
        </>
      ),
      dataIndex: "fromDomain",
      render: (value, record, index) => {
        return (
          <>
            <Input
              value={value}
              placeholder="xxx.com"
              onChange={(e) => {
                changeField(index, "fromDomain", e.target.value)
              }}
            />
          </>
        )
      },
    },
    {
      title: (
        <>
          {i18n.t("targetSite")} <IconTip title={i18n.t("targetSiteTip")} />
        </>
      ),
      dataIndex: "toDomain",
      render: (value, record, index) => {
        return (
          <Input
            value={value}
            placeholder="localhost:8080"
            onChange={(e) => {
              changeField(index, "toDomain", e.target.value)
            }}
          />
        )
      },
      onCell: (record) => {
        return { rowSpan: record.span || 1 }
      },
    },
    {
      title: i18n.t("storage"),
      width: 170,
      dataIndex: "storage",
      render: (value, record, index) => {
        return (
          <Select
            allowClear
            value={value}
            options={storageOptions}
            style={{ width: "100%" }}
            onChange={(value) => {
              changeField(index, "storage", value)
            }}
            placeholder={i18n.t("storage")}
          />
        )
      },
    },
    {
      title: (
        <>
          {i18n.t("storageField")}
          <IconTip title={i18n.t("storageFieldTip")} />
        </>
      ),
      dataIndex: "field",
      render: (value, record, index) => {
        return (
          <Input
            allowClear
            value={value}
            onChange={(e) => {
              changeField(index, "field", e.target.value)
            }}
            placeholder="token"
          />
        )
      },
    },
    {
      title: (
        <>
          {i18n.t("storageValue")}
          <IconTip title={i18n.t("storageValueTip")} />
        </>
      ),
      dataIndex: "token",
      ellipsis: { showTitle: false },
      render: (text) => {
        if (typeof text === "object") {
          text = JSON.stringify(text)
        }
        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              copy(text)
            }}
          >
            {text}
          </span>
        )
      },
    },
    {
      title: i18n.t("operation"),
      dataIndex: "operation",
      width: 100,
      render: (value, record, index) => {
        return (
          <div style={{ fontSize: "20px", textAlign: "center" }}>
            <PlusCircleTwoTone
              onClick={() => {
                configs.splice(index, 0, { ...record, id: uuid() })
                setConfigs([...configs])
              }}
            />
            <MinusCircleTwoTone
              style={{ marginLeft: "8px" }}
              onClick={() => {
                removeConfig(index)
              }}
            />
          </div>
        )
      },
    },
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
      {/* <Alert
        style={{ marginTop: "10px" }}
        message={
          <span>
            New feature: when field is empty, copy all
            <Tooltip title="In this case, it is important to note that all the stored data obtained from the source site should not exceed 10M, as this exceeds the plugin's storage limit. If it cannot be used because it is exceeded, please fill in the field to avoid getting too much data.">
              <QuestionCircleOutlined style={{ marginLeft: 5 }} />
            </Tooltip>
          </span>
        }
        type="warning"
      /> */}
      <Button
        type="primary"
        style={{ marginTop: "10px", textAlign: "center" }}
        onClick={() => {
          chrome.storage.local.set({ websiteConfigs: configs })
        }}
      >
        {i18n.t("confirm")}
      </Button>
    </div>
  )
}
