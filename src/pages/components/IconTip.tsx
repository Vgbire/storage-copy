import React from "react"
import { QuestionCircleOutlined } from "@ant-design/icons"
import { Tooltip } from "antd"
interface IProps {
  title: string
}

const IconTip = (props: IProps) => {
  const { title } = props
  return (
    <Tooltip title={title}>
      <QuestionCircleOutlined style={{ marginLeft: 5 }} />
    </Tooltip>
  )
}
export default IconTip
